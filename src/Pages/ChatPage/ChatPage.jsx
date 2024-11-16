import { useState } from "react";
import ReactMarkdown from "react-markdown";
import runChat from "../../config/gemini";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    setMessages([...messages, newMessage]);

    const responseText = await runChat(userInput);

    const responseMessage = { sender: "bot", text: responseText };
    setMessages((prevMessages) => [...prevMessages, responseMessage]);
    setUserInput("");
  };

  return (
    <div style={styles.container}>
      <h1>IUFC Chat Bot</h1>
      <div style={styles.chatBox}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              color: message.sender === "user" ? "#FFF" : "#000",
              backgroundColor: message.sender === "user" ? "#fe3bd4" : "#FFF",
            }}
          >
            {message.sender === "bot" ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button style={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#F0F0F0",
  },
  chatBox: {
    width: "80%",
    maxWidth: "600px",
    height: "70vh",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    maxWidth: "70%",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },
  inputContainer: {
    display: "flex",
    width: "80%",
    maxWidth: "600px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginRight: "8px",
  },
  sendButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#fe3bd4",
    color: "#FFF",
    cursor: "pointer",
  },
};

export default ChatUI;
