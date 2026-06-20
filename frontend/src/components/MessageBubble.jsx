import ReactMarkdown from "react-markdown";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "16px",
    }}>
      <div style={{
        maxWidth: "70%",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "#2563eb" : "#1e1e1e",
        color: "#ececec",
        fontSize: "14px",
        lineHeight: "1.6",
        border: isUser ? "none" : "1px solid #2a2a2a",
      }}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MessageBubble;