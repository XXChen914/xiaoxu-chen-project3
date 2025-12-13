import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./App.css";

export default function App() {
  return (
      <div className="app">
        <NavBar />
        <Outlet />
      </div>

  );
}