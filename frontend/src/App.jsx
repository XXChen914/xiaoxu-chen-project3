import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./components/NavBar";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Check login status on app load
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await axios.get("/api/user/isLoggedIn", {
          withCredentials: true,
        });
        setUsername(res.data.username);
      } catch {
        setUsername(null);
      }
    }
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await axios.post("/api/logout", {}, { withCredentials: true });
    setUsername(null);
    navigate("/");
  };

  return (
    <div className="app">
      <NavBar username={username} onLogout={handleLogout} />
      <Outlet context={{ username }} />
    </div>
  );
}
