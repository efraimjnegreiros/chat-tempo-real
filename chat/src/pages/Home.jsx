import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Home({ currentUser, logout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // ← novo

  useEffect(() => {
    loadUsers();
    loadMessages();

    const interval = setInterval(loadMessages, 1000); // polling para bolinha
    return () => clearInterval(interval);
  }, []);

  async function loadUsers() {
    try {
      const response = await api.get("/users");
      setUsers(response.data.filter((u) => u.id !== currentUser.id));
    } catch (err) {
      console.log(err);
    }
  }

  async function loadMessages() {
    try {
      const response = await api.get("/messages");
      setMessages(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  // Marca como lido ao abrir conversa
  async function handleSelectUser(user) {
    setSelectedUser(user);

    // Marca todas as mensagens não lidas desse remetente como lidas
    const unread = messages.filter(
      (m) => m.senderId === user.id && m.receiverId === currentUser.id && !m.read
    );
    for (const m of unread) {
      await api.patch(`/messages/${m.id}`, { read: true });
    }
    loadMessages();
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebarContainer}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img src={currentUser.avatar} alt={currentUser.name} style={styles.avatar} />
            <div>
              <h3 style={styles.userName}>{currentUser.name}</h3>
              <p style={styles.email}>{currentUser.email}</p>
            </div>
          </div>
          <button onClick={logout} style={styles.logoutButton}>Sair</button>
        </div>

        <Sidebar
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser} // ← usa o handler
          messages={messages}               // ← passa messages
          currentUser={currentUser}         // ← passa currentUser
        />
      </div>

      {selectedUser ? (
        <ChatBox
          currentUser={currentUser}
          selectedUser={selectedUser}
          onNewMessage={loadMessages} // ← atualiza sidebar ao enviar
        />
      ) : (
        <div style={styles.emptyContainer}>
          <h1 style={styles.emptyTitle}>Bem-vindo ao Chat 💬</h1>
          <p style={styles.emptyText}>Selecione uma conversa para começar</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f5f5f5",
  },

  sidebarContainer: {
    width: 350,
    background: "#fff",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: 20,
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    objectFit: "cover",
  },

  userName: {
    margin: 0,
    fontSize: 18,
  },

  email: {
    margin: 0,
    color: "#777",
    fontSize: 13,
  },

  logoutButton: {
    border: "none",
    background: "#ff4d4d",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
  },

  emptyTitle: {
    fontSize: 36,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 18,
  },
};