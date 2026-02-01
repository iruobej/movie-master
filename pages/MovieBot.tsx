import Navbar from "../components/Navbar.tsx";
import { useEffect, useMemo, useState } from "react";
import Message from "../components/Message.tsx";

type ChatMessage = {
  id: number;
  role: string;
  text: string;
};

function MovieBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Safely load user (prevents blank screen if missing)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const chatKey = user?.username ? `chat_${user.username}` : "chat_guest";

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(chatKey) || "[]") as any[];
      return raw.map((m, i) => ({
        id: m.id ?? Date.now() + i,
        role: m.role,
        text: m.text,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.body.classList.remove("login", "home");
    document.body.classList.add("home");
  }, []);

  // Auto-save chat
  useEffect(() => {
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, chatKey]);

  // AI greeting (only once)
  useEffect(() => {
    if (messages.length > 0) return;
    setMessages([
      {
        id: Date.now(),
        role: "ai",
        text: `## Hi, I'm MovieBot - your friendly movie chatbot!

Ask me for movie recommendations, actor info, etc.`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    const baseId = Date.now();
    const userId = baseId;
    const loadingId = baseId + 1;

    setMessage("");

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text: cleaned },
      { id: loadingId, role: "ai", text: "Loading..." },
    ]);

    fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: cleaned }),
    })
      .then(async (res) => {
        // If your function errors, this helps show the real message
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Request failed");
        return data;
      })
      .then((data) => {
        const aiText = data.text ?? "Sorry — I couldn't generate a reply";
        setMessages((prev) =>
          prev.map((m) => (m.id === loadingId ? { ...m, text: aiText } : m))
        );
      })
      .catch((err) => {
        console.error("Gemini API error:", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, text: "Sorry — something went wrong." }
              : m
          )
        );
      });
  };

  return (
    <>
      <button type="button" className="hamburger" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-bars" style={{ color: "#3f98e0" }} />
      </button>

      <Navbar open={open} onClose={() => setOpen(false)} />

      <div className="chat-page">
        <h1>MovieBot</h1>

        <div className="messages">
          {messages.map((m) => (
            <Message key={m.id} role={m.role} text={m.text} />
          ))}
        </div>

        <div className="prompt-wrapper">
          <input
            type="text"
            placeholder="Give MovieBot a prompt"
            className="prompt"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) sendMessage(message);
            }}
          />

          {message.trim().length > 0 && (
            <button onClick={() => sendMessage(message)}>
              <i className="fa-solid fa-arrow-up" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default MovieBot;