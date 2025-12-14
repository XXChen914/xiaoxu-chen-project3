import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./components/NavBar";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Check login status on app load
  useEffect(() => {
    async function checkLogin() {
      try {
        const { data } = await axios.get("/api/user/isLoggedIn", {});
        setUsername(data.username);
      } catch {
        setUsername(null);
      } finally {
        setAuthLoading(false);
      }
    }
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    setUsername(null);
    navigate("/");
  };

  // Show loading state while checking auth
  if (authLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="app">
      <NavBar username={username} onLogout={handleLogout} />
      <Outlet context={{ username, setUsername }} />
    </div>
  );
}
