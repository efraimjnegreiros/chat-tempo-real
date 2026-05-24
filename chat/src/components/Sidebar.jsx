export default function Sidebar({ users, selectedUser, setSelectedUser, messages, currentUser }) {
  const getUnreadCount = (userId) => {
    return messages.filter(
      (m) => m.senderId === userId && m.receiverId === currentUser.id && !m.read
    ).length;
  };

  const getLastMessage = (userId) => {
    const conv = messages
      .filter(
        (m) =>
          (m.senderId === userId && m.receiverId === currentUser.id) ||
          (m.senderId === currentUser.id && m.receiverId === userId)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return conv[0] || null;
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={{ padding: "0 0 12px 0", margin: 0, fontSize: 18 }}>Conversas</h2>

      {users.map((user) => {
        const unread = getUnreadCount(user.id);
        const last = getLastMessage(user.id);
        const isSelected = selectedUser?.id === user.id;

        return (
          <div
            key={user.id}
            style={{
              ...styles.user,
              background: isSelected ? "#f0f0f0" : "#fff",
            }}
            onClick={() => setSelectedUser(user)}
          >
            <img src={user.avatar} alt={user.name} style={styles.avatar} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: 15 }}>{user.name}</span>
                {last && (
                  <span style={{ fontSize: 11, color: "#999" }}>
                    {new Date(last.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <span style={{
                  fontSize: 13,
                  color: "#999",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 170,
                }}>
                  {last
                    ? (last.senderId === currentUser.id ? "Você: " : "") + last.text
                    : "Nenhuma mensagem"}
                </span>

                {/* Bolinha de não lidas */}
                {unread > 0 && (
                  <span style={{
                    background: "#25d366",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: 20,
                    height: 20,
                    fontSize: 11,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                    flexShrink: 0,
                  }}>
                    {unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  sidebar: {
    borderRight: "1px solid #ddd",
    padding: "16px 12px",
    background: "#fff",
    overflowY: "auto",
    flex: 1,
  },
  user: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    marginBottom: 4,
    transition: "background 0.2s",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
};