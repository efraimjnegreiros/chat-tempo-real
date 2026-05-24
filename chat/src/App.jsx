import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStorage = localStorage.getItem("chat_user");

    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
  }, []);

  function handleLogin(userData) {
    localStorage.setItem(
      "chat_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("chat_user");
    setUser(null);
  }

  return (
    <>
      {user ? (
        <Home currentUser={user} logout={logout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}