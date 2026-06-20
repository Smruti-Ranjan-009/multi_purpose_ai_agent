import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";

function ChatWindow({ chatHistory, setChatHistory }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: input,
        chat_history: updatedHistory,
      });
      const agentMsg = { role: "assistant", content: res.data.response };
      setChatHistory([...updatedHistory, agentMsg]);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
      
      if (!navigator.onLine) {
        errorMessage = "⚠️ No internet connection.";
      } else if (err.response) {
        errorMessage = `⚠️ Server error: ${err.response.status}. Please try again.`;
      } else if (err.request) {
        errorMessage = "⚠️ Backend is not running. Please start the server.";
      }

      setChatHistory([...updatedHistory, {
        role: "assistant",
        content: errorMessage,
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #1e1e1e",
        background: "#111",
      }}>
        <h1 style={{ fontSize: "18px", fontWeight: 600 }}>🤖 AI Agent</h1>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
          Powered by Groq · Web Search · RAG · Weather · Data Analysis
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}>
        {chatHistory.length === 0 && (
          <div style={{
            margin: "auto",
            textAlign: "center",
            color: "#444",
          }}>
            <p style={{ fontSize: "32px" }}>🤖</p>
            <p style={{ marginTop: "8px" }}>Ask me anything</p>
            <p style={{ fontSize: "12px", marginTop: "4px", color: "#333" }}>
              Search · Weather · Documents · Data Analysis
            </p>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#666",
            fontSize: "13px",
            padding: "8px 0"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2563eb",
              animation: "pulse 1s infinite"
            }}/>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2563eb",
              animation: "pulse 1s infinite 0.2s"
            }}/>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2563eb",
              animation: "pulse 1s infinite 0.4s"
            }}/>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid #1e1e1e",
        background: "#111",
        display: "flex",
        gap: "10px",
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          rows={1}
          style={{
            flex: 1,
            background: "#1e1e1e",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "#ececec",
            fontSize: "14px",
            resize: "none",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: "#2563eb",
            border: "none",
            borderRadius: "12px",
            padding: "0 20px",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;