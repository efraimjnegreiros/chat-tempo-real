import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Home({ currentUser, logout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    loadUsers();
    loadMessages();

    const interval = setInterval(loadMessages, 1000);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
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

  async function handleSelectUser(user) {
    setSelectedUser(user);

    const unread = messages.filter(
      (m) =>
        m.senderId === user.id &&
        m.receiverId === currentUser.id &&
        !m.read
    );

    for (const m of unread) {
      await api.patch(`/messages/${m.id}`, { read: true });
    }

    loadMessages();
  }

  function handleBack() {
    setSelectedUser(null);
  }

  // Mobile: mostra sidebar OU chat (nunca os dois)
  if (isMobile) {
    return (
      <div style={styles.mobileRoot}>
        {selectedUser ? (
          // Tela de chat ocupa 100% da tela
          <ChatBox
            currentUser={currentUser}
            selectedUser={selectedUser}
            onNewMessage={loadMessages}
            onBack={handleBack}
          />
        ) : (
          // Tela de lista ocupa 100% da tela
          <div style={styles.mobileSidebar}>
            <div style={styles.header}>
              <div style={styles.userInfo}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={styles.avatar}
                />
                <div>
                  <h3 style={styles.userName}>{currentUser.name}</h3>
                  <p style={styles.email}>{currentUser.email}</p>
                </div>
              </div>
              <button onClick={logout} style={styles.logoutButton}>
                Sair
              </button>
            </div>

            <Sidebar
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={handleSelectUser}
              messages={messages}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop: sidebar + chat lado a lado
  return (
    <div style={styles.desktopRoot}>
      <div style={styles.sidebarContainer}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={styles.avatar}
            />
            <div>
              <h3 style={styles.userName}>{currentUser.name}</h3>
              <p style={styles.email}>{currentUser.email}</p>
            </div>
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            Sair
          </button>
        </div>

        <Sidebar
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          messages={messages}
          currentUser={currentUser}
        />
      </div>

      {selectedUser ? (
        <ChatBox
          currentUser={currentUser}
          selectedUser={selectedUser}
          onNewMessage={loadMessages}
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
  // Mobile
  mobileRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",      // dvh respeita barra do browser no mobile
    overflow: "hidden",
    background: "#f5f5f5",
  },

  mobileSidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#fff",
    overflow: "hidden",
  },

  // Desktop
  desktopRoot: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflow: "hidden",
    background: "#f5f5f5",
  },

  sidebarContainer: {
    width: 340,
    flexShrink: 0,
    background: "#fff",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    flexShrink: 0,
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },

  userName: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  email: {
    margin: 0,
    color: "#888",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  logoutButton: {
    flexShrink: 0,
    border: "none",
    background: "#ff4d4d",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#aaa",
  },

  emptyTitle: {
    fontSize: 32,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
  },
};
