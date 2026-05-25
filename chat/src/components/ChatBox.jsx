import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { v4 as uuid } from "uuid";
import Message from "./Message";

export default function ChatBox({ currentUser, selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  async function loadMessages() {
    const response = await api.get("/messages");
    const filtered = response.data.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
    );
    setMessages(filtered);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newMessage = {
      id: uuid(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text,
      createdAt: new Date(),
    };
    await api.post("/messages", newMessage);
    setText("");
    loadMessages();
  }

  function scrollBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {onBack && (
          <button onClick={onBack} style={styles.backButton}>
            ←
          </button>
        )}
        <img
          src={selectedUser.avatar}
          alt={selectedUser.name}
          style={styles.avatar}
        />
        <h3 style={styles.headerName}>{selectedUser.name}</h3>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isMine={message.senderId === currentUser.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input fixo no fundo */}
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Enviar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",        // ocupa toda a altura do pai
    overflow: "hidden",    // impede scroll no container
  },

  header: {
    flexShrink: 0,         // nunca encolhe
    height: 70,
    background: "#fff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    fontSize: 22,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 8,
    color: "#333",
    lineHeight: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },

  headerName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  messages: {
    flex: 1,               // cresce para preencher o espaço
    overflowY: "auto",     // scroll apenas aqui
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  form: {
    flexShrink: 0,         // nunca encolhe — fica fixo no fundo
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "#fff",
    borderTop: "1px solid #eee",
    // segurança para notch em iPhones
    paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
  },

  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 24,
    border: "1px solid #ddd",
    fontSize: 15,
    outline: "none",
    background: "#f5f5f5",
    minWidth: 0,           // evita overflow em flex
  },

  button: {
    flexShrink: 0,
    padding: "12px 20px",
    border: "none",
    borderRadius: 24,
    background: "#0084ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 15,
    whiteSpace: "nowrap",
  },
};
