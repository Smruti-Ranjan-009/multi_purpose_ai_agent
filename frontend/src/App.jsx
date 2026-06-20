import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setChatHistory={setChatHistory} />
      <ChatWindow chatHistory={chatHistory} setChatHistory={setChatHistory} />
    </div>
  );
}

export default App;