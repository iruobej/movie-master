import ReactMarkdown from "react-markdown";

type MessageProps = {
    role: string;
    text: string;
};

function Message({role, text}: MessageProps) {
    const content = Array.isArray(text) ? text.join("\n") : String(text);

    /*When you explicitly pass children={content} as a prop, TypeScript sees it as a regular prop assignment
     and is more lenient with the type checking. */

    return(
        <div className={`message-${role}`}>
            <ReactMarkdown children={content} />
        </div>
    );
}

export default Message;