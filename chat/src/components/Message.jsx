export default function Message({ message, isMine }) {
  const status = message.read ? "read" : "delivered"; // azul ou cinza

  return (
    <div style={{
      display: "flex",
      justifyContent: isMine ? "flex-end" : "flex-start",
      marginBottom: 8,
    }}>
      <div style={{
        maxWidth: "65%",
        background: isMine ? "#dcf8c6" : "#fff",
        padding: "8px 12px",
        borderRadius: 12,
        fontSize: 14,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        position: "relative",
      }}>
        <p style={{ margin: 0, wordBreak: "break-word" }}>{message.text}</p>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 3,
          marginTop: 4,
        }}>
          <span style={{ fontSize: 11, color: "#999" }}>
            {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Traços estilo WhatsApp — só para mensagens enviadas */}
          {isMine && (
            <span style={{ color: message.read ? "#34b7f1" : "#aaa", fontSize: 14, lineHeight: 1 }}>
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}