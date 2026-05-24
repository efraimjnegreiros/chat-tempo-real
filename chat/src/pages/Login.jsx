import { useState } from "react";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const response = await api.get("/users");

    const user = response.data.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Email ou senha inválidos");
      return;
    }

    onLogin(user);
  } catch {
    setError("Erro ao fazer login");
  }
}

  return (
    <div style={styles.container}>
      <form
        style={styles.form}
        onSubmit={handleSubmit}
      >
        <h1>Chat Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <button style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
  },

  form: {
    width: 350,
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  input: {
    padding: 14,
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 16,
  },

  button: {
    height: 50,
    border: "none",
    borderRadius: 12,
    background: "#0084ff",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },

  error: {
    color: "red",
  },
};