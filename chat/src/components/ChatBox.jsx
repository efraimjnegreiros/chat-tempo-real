// import { useEffect, useRef, useState } from "react";
// import { api } from "../services/api";
// import { v4 as uuid } from "uuid";
// import Message from "./Message";

// export default function ChatBox({ currentUser, selectedUser, onBack }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     loadMessages();
//     const interval = setInterval(loadMessages, 1000);
//     return () => clearInterval(interval);
//   }, [selectedUser]);

//   useEffect(() => {
//     scrollBottom();
//   }, [messages]);

//   async function loadMessages() {
//     const response = await api.get("/messages");
//     const filtered = response.data.filter(
//       (msg) =>
//         (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
//         (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
//     );
//     setMessages(filtered);
//   }

//   async function sendMessage(e) {
//     e.preventDefault();
//     if (!text.trim()) return;
//     const newMessage = {
//       id: uuid(),
//       senderId: currentUser.id,
//       receiverId: selectedUser.id,
//       text,
//       createdAt: new Date(),
//     };
//     await api.post("/messages", newMessage);
//     setText("");
//     loadMessages();
//   }

//   function scrollBottom() {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         {onBack && (
//           <button onClick={onBack} style={styles.backButton}>
//             ←
//           </button>
//         )}
//         <img
//           src={selectedUser.avatar}
//           alt={selectedUser.name}
//           style={styles.avatar}
//         />
//         <h3 style={styles.headerName}>{selectedUser.name}</h3>
//       </div>

//       {/* Messages */}
//       <div style={styles.messages}>
//         {messages.map((message) => (
//           <Message
//             key={message.id}
//             message={message}
//             isMine={message.senderId === currentUser.id}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input fixo no fundo */}
//       <form onSubmit={sendMessage} style={styles.form}>
//         <input
//           type="text"
//           placeholder="Digite uma mensagem..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>
//           Enviar
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100%",        // ocupa toda a altura do pai
//     overflow: "hidden",    // impede scroll no container
//   },

//   header: {
//     flexShrink: 0,         // nunca encolhe
//     height: 70,
//     background: "#fff",
//     borderBottom: "1px solid #ddd",
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "0 16px",
//   },

//   backButton: {
//     border: "none",
//     background: "transparent",
//     fontSize: 22,
//     cursor: "pointer",
//     padding: "4px 8px",
//     borderRadius: 8,
//     color: "#333",
//     lineHeight: 1,
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: "50%",
//     objectFit: "cover",
//     flexShrink: 0,
//   },

//   headerName: {
//     margin: 0,
//     fontSize: 16,
//     fontWeight: 600,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },

//   messages: {
//     flex: 1,               // cresce para preencher o espaço
//     overflowY: "auto",     // scroll apenas aqui
//     padding: "16px",
//     display: "flex",
//     flexDirection: "column",
//     gap: 4,
//   },

//   form: {
//     flexShrink: 0,         // nunca encolhe — fica fixo no fundo
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "12px 16px",
//     background: "#fff",
//     borderTop: "1px solid #eee",
//     // segurança para notch em iPhones
//     paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
//   },

//   input: {
//     flex: 1,
//     padding: "12px 16px",
//     borderRadius: 24,
//     border: "1px solid #ddd",
//     fontSize: 15,
//     outline: "none",
//     background: "#f5f5f5",
//     minWidth: 0,           // evita overflow em flex
//   },

//   button: {
//     flexShrink: 0,
//     padding: "12px 20px",
//     border: "none",
//     borderRadius: 24,
//     background: "#0084ff",
//     color: "#fff",
//     fontWeight: "bold",
//     cursor: "pointer",
//     fontSize: 15,
//     whiteSpace: "nowrap",
//   },
// };
import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { v4 as uuid } from "uuid";
import Message from "./Message";

export default function ChatBox({ currentUser, selectedUser, onNewMessage, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false); // selectedUser está digitando?
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevUnreadCount = useRef(0);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  // Notificação na aba quando chegar mensagem nova e aba estiver em segundo plano
  useEffect(() => {
    const unread = messages.filter(
      (m) => m.senderId === selectedUser.id && m.receiverId === currentUser.id && !m.read
    ).length;

    if (document.hidden && unread > prevUnreadCount.current) {
      document.title = `(${unread}) Nova mensagem de ${selectedUser.name}`;
    } else if (!document.hidden) {
      document.title = "Chat 💬";
    }

    prevUnreadCount.current = unread;
  }, [messages]);

  // Restaura título ao focar na aba
  useEffect(() => {
    const handleFocus = () => { document.title = "Chat 💬"; };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  async function loadMessages() {
    const response = await api.get("/messages");
    const filtered = response.data.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
    );
    setMessages(filtered);

    // Verifica se o selectedUser está digitando para currentUser
    try {
      const userRes = await api.get(`/users/${selectedUser.id}`);
      setIsTyping(userRes.data.typingTo === currentUser.id);
    } catch (_) {}

    if (onNewMessage) onNewMessage();
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

    // Para de sinalizar digitando ao enviar
    await api.patch(`/users/${currentUser.id}`, { typingTo: null });
    clearTimeout(typingTimeoutRef.current);

    loadMessages();
  }

  async function handleTyping(e) {
    setText(e.target.value);

    // Sinaliza que está digitando
    await api.patch(`/users/${currentUser.id}`, { typingTo: selectedUser.id });

    // Para de sinalizar após 2s sem digitar
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      await api.patch(`/users/${currentUser.id}`, { typingTo: null });
    }, 2000);
  }

  function scrollBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {onBack && (
          <button onClick={onBack} style={styles.backButton}>←</button>
        )}
        <div style={styles.avatarWrapper}>
          <img src={selectedUser.avatar} alt={selectedUser.name} style={styles.avatar} />
          <span style={{
            ...styles.onlineDot,
            background: selectedUser.online ? "#25d366" : "#bbb",
          }} />
        </div>
        <div>
          <h3 style={styles.headerName}>{selectedUser.name}</h3>
          <p style={styles.headerSub}>
            {isTyping
              ? "digitando..."
              : selectedUser.online
              ? "online"
              : selectedUser.lastSeen
              ? `visto às ${new Date(selectedUser.lastSeen).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : "offline"}
          </p>
        </div>
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

        {/* Indicador digitando */}
        {isTyping && (
          <div style={styles.typingIndicator}>
            <span style={styles.typingDot} />
            <span style={styles.typingDot} />
            <span style={styles.typingDot} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input fixo no fundo */}
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={handleTyping}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Enviar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },

  header: {
    flexShrink: 0,
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

  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  },

  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: "50%",
    border: "2px solid #fff",
  },

  headerName: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
  },

  headerSub: {
    margin: 0,
    fontSize: 12,
    color: "#25d366",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 14px",
    background: "#f0f0f0",
    borderRadius: 18,
    width: "fit-content",
    marginTop: 4,
  },

  typingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#999",
    animation: "bounce 1.2s infinite",
  },

  form: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
    background: "#fff",
    borderTop: "1px solid #eee",
  },

  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 24,
    border: "1px solid #ddd",
    fontSize: 15,
    outline: "none",
    background: "#f5f5f5",
    minWidth: 0,
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
