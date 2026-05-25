// export default function Sidebar({ users, selectedUser, setSelectedUser, messages, currentUser }) {
//   const getUnreadCount = (userId) => {
//     return messages.filter(
//       (m) => m.senderId === userId && m.receiverId === currentUser.id && !m.read
//     ).length;
//   };

//   const getLastMessage = (userId) => {
//     const conv = messages
//       .filter(
//         (m) =>
//           (m.senderId === userId && m.receiverId === currentUser.id) ||
//           (m.senderId === currentUser.id && m.receiverId === userId)
//       )
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     return conv[0] || null;
//   };

//   return (
//     <div style={styles.sidebar}>
//       <h2 style={styles.title}>Conversas</h2>

//       {users.map((user) => {
//         const unread = getUnreadCount(user.id);
//         const last = getLastMessage(user.id);
//         const isSelected = selectedUser?.id === user.id;

//         return (
//           <div
//             key={user.id}
//             style={{
//               ...styles.user,
//               background: isSelected ? "#f0f7ff" : "#fff",
//               borderLeft: isSelected ? "3px solid #0084ff" : "3px solid transparent",
//             }}
//             onClick={() => setSelectedUser(user)}
//           >
//             {/* Avatar */}
//             <img src={user.avatar} alt={user.name} style={styles.avatar} />

//             {/* Info */}
//             <div style={styles.info}>
//               {/* Nome + horário */}
//               <div style={styles.row}>
//                 <span style={styles.name}>{user.name}</span>
//                 {last && (
//                   <span style={styles.time}>
//                     {new Date(last.createdAt).toLocaleTimeString("pt-BR", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 )}
//               </div>

//               {/* Preview + bolinha */}
//               <div style={styles.row}>
//                 <span style={styles.preview}>
//                   {last
//                     ? (last.senderId === currentUser.id ? "Você: " : "") + last.text
//                     : "Nenhuma mensagem"}
//                 </span>
//                 {unread > 0 && (
//                   <span style={styles.badge}>{unread}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {users.length === 0 && (
//         <p style={styles.empty}>Nenhum usuário encontrado</p>
//       )}
//     </div>
//   );
// }

// const styles = {
//   sidebar: {
//     flex: 1,
//     overflowY: "auto",
//     padding: "12px 8px",
//     background: "#fff",
//   },

//   title: {
//     padding: "0 8px 12px",
//     margin: 0,
//     fontSize: 17,
//     fontWeight: 700,
//     color: "#333",
//   },

//   user: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: "10px 10px",
//     borderRadius: 12,
//     cursor: "pointer",
//     marginBottom: 2,
//     transition: "background 0.15s",
//   },

//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: "50%",
//     objectFit: "cover",
//     flexShrink: 0,
//   },

//   info: {
//     flex: 1,
//     minWidth: 0,        // essencial para o ellipsis funcionar dentro do flex
//     display: "flex",
//     flexDirection: "column",
//     gap: 3,
//   },

//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 6,
//   },

//   name: {
//     fontWeight: 600,
//     fontSize: 15,
//     color: "#111",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//   },

//   time: {
//     fontSize: 11,
//     color: "#aaa",
//     flexShrink: 0,
//   },

//   preview: {
//     fontSize: 13,
//     color: "#999",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     flex: 1,           // ocupa o espaço restante, respeitando a bolinha
//     minWidth: 0,
//   },

//   badge: {
//     background: "#25d366",
//     color: "#fff",
//     borderRadius: 999,
//     minWidth: 20,
//     height: 20,
//     fontSize: 11,
//     fontWeight: "bold",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "0 5px",
//     flexShrink: 0,
//   },

//   empty: {
//     textAlign: "center",
//     color: "#bbb",
//     fontSize: 14,
//     marginTop: 40,
//   },
// };

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
      <h2 style={styles.title}>Conversas</h2>

      {users.map((user) => {
        const unread = getUnreadCount(user.id);
        const last = getLastMessage(user.id);
        const isSelected = selectedUser?.id === user.id;

        return (
          <div
            key={user.id}
            style={{
              ...styles.user,
              background: isSelected ? "#f0f7ff" : "#fff",
              borderLeft: isSelected ? "3px solid #0084ff" : "3px solid transparent",
            }}
            onClick={() => setSelectedUser(user)}
          >
            {/* Avatar + bolinha online */}
            <div style={styles.avatarWrapper}>
              <img src={user.avatar} alt={user.name} style={styles.avatar} />
              <span style={{
                ...styles.onlineDot,
                background: user.online ? "#25d366" : "#bbb",
              }} />
            </div>

            {/* Info */}
            <div style={styles.info}>
              <div style={styles.row}>
                <span style={styles.name}>{user.name}</span>
                {last && (
                  <span style={styles.time}>
                    {new Date(last.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              <div style={styles.row}>
                <span style={{
                  ...styles.preview,
                  color: user.typingTo === currentUser.id ? "#25d366" : "#999",
                  fontStyle: user.typingTo === currentUser.id ? "italic" : "normal",
                }}>
                  {user.typingTo === currentUser.id
                    ? "digitando..."
                    : last
                    ? (last.senderId === currentUser.id ? "Você: " : "") + last.text
                    : "Nenhuma mensagem"}
                </span>
                {unread > 0 && (
                  <span style={styles.badge}>{unread}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {users.length === 0 && (
        <p style={styles.empty}>Nenhum usuário encontrado</p>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 8px",
    background: "#fff",
  },

  title: {
    padding: "0 8px 12px",
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#333",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 10px",
    borderRadius: 12,
    cursor: "pointer",
    marginBottom: 2,
    transition: "background 0.15s",
  },

  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
  },

  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: "50%",
    border: "2px solid #fff",
  },

  info: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },

  name: {
    fontWeight: 600,
    fontSize: 15,
    color: "#111",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  time: {
    fontSize: 11,
    color: "#aaa",
    flexShrink: 0,
  },

  preview: {
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    minWidth: 0,
  },

  badge: {
    background: "#25d366",
    color: "#fff",
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    fontSize: 11,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px",
    flexShrink: 0,
  },

  empty: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 14,
    marginTop: 40,
  },
};
