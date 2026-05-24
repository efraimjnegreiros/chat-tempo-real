import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { v4 as uuid } from "uuid";
import Message from "./Message";

export default function ChatBox({
  currentUser,
  selectedUser,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  async function loadMessages() {
    const response = await api.get("/messages");

    const filtered = response.data.filter(
      (msg) =>
        (msg.senderId === currentUser.id &&
          msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id &&
          msg.receiverId === currentUser.id)
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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={selectedUser.avatar}
          alt={selectedUser.name}
          style={styles.avatar}
        />

        <h3>{selectedUser.name}</h3>
      </div>

      <div style={styles.messages}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isMine={
              message.senderId === currentUser.id
            }
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        style={styles.form}
      >
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          style={styles.input}
        />

        <button style={styles.button}>
          Enviar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    height: 80,
    background: "#fff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
  },

  messages: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
  },

  form: {
    display: "flex",
    padding: 20,
    gap: 10,
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 16,
  },

  button: {
    padding: "0 24px",
    border: "none",
    borderRadius: 12,
    background: "#0084ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};