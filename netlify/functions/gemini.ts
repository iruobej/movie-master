import type { Handler } from "@netlify/functions";

/**
 * Basic CORS setup so the frontend can hit this function directly.
 * Nothing fancy here.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Hard limits:
 * - Gemini Flash is unreliable above ~2k output tokens
 * - Continuations are safer than asking for huge single responses
 */
const MAX_OUTPUT_TOKENS = 2048;

/**
 * Safety valve so we don’t get stuck in an infinite
 * “continue where you left off” loop.
 */
const MAX_CONTINUES = 4;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: { message?: string };
  message?: string;
};

/**
 * Pulls all text parts out of Gemini’s response
 * and stitches them into a single string.
 */
function extractText(data: GeminiResponse): string {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text ?? "")
      .join("") ?? ""
  );
}

/**
 * Gemini tells us *why* it stopped generating.
 * We only care if it hit the max token limit.
 */
function extractFinishReason(data: GeminiResponse): string {
  return data?.candidates?.[0]?.finishReason ?? "";
}

/**
 * One clean function that actually talks to Gemini.
 * Everything else builds on top of this.
 */
async function callGemini(opts: {
  apiKey: string;
  model: string;
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
  temperature: number;
}) {
  const { apiKey, model, contents, temperature } = opts;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    }),
  });

  const raw = (await resp.json().catch(() => ({} as any))) as GeminiResponse;

  return {
    status: resp.status,
    raw,
    text: extractText(raw),
    finishReason: extractFinishReason(raw),
  };
}

export const handler: Handler = async (event) => {
  // Preflight for CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing GEMINI_API_KEY env var." }),
    };
  }

  // Parse the request body once and reuse it
  let bodyObj: any;
  try {
    bodyObj = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body." }),
    };
  }

  const prompt = String(bodyObj.prompt || "").trim();
  const model = String(bodyObj.model || "gemini-flash-latest").trim();
  const temperature =
    typeof bodyObj.temperature === "number" ? bodyObj.temperature : 0.7;

  if (!prompt) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing 'prompt'." }),
    };
  }

  try {
    /**
     * We treat this like a mini conversation:
     * - user prompt
     * - model response
     * - possible “continue” prompts if needed
     */
    const contents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [{ role: "user", parts: [{ text: prompt }] }];

    let fullText = "";
    let finishReason = "";
    let continueCount = 0;

    while (true) {
      const result = await callGemini({
        apiKey,
        model,
        contents,
        temperature,
      });

      if (result.status < 200 || result.status >= 300) {
        const msg =
          result.raw?.error?.message ||
          result.raw?.message ||
          `Gemini request failed (${result.status})`;

        return {
          statusCode: result.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ error: msg, details: result.raw }),
        };
      }

      // Append this chunk to the full response
      if (result.text) {
        fullText += result.text;

        // Feed the model’s own output back into context
        // so continuations pick up exactly where it left off
        contents.push({
          role: "model",
          parts: [{ text: result.text }],
        });
      }

      finishReason = result.finishReason;

      // If we hit the token cap, explicitly ask it to continue
      if (finishReason === "MAX_TOKENS") {
        continueCount += 1;
        if (continueCount > MAX_CONTINUES) break;

        contents.push({
          role: "user",
          parts: [
            {
              text:
                "Continue exactly where you left off. " +
                "Do not repeat any text. Start with the next word.",
            },
          ],
        });

        continue;
      }

      // Any other finish reason means the model is done
      break;
    }

    if (!fullText) {
      return {
        statusCode: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No text returned from Gemini." }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: fullText,
        finishReason,
        continuations: continueCount,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server error calling Gemini.",
        details: String(err?.message || err),
      }),
    };
  }
};
