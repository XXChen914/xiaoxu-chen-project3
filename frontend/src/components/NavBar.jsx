import { NavLink } from "react-router";
import logo from "../assets/sudoku-icon.svg";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-title">
        <img src={logo} alt="Sudoku Logo" className="nav-logo" />
        <span>Lucy's Sudoku</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li>
          <NavLink to={"/games"} end>
            Selection
          </NavLink>
        </li>
        <li>
          <NavLink to="/games/normal">Normal Game</NavLink>
        </li>
        <li>
          <NavLink to="/games/easy">Easy Game</NavLink>
        </li>
        <li>
          <NavLink to={"/rules"}>Rules</NavLink>
        </li>
        <li>
          <NavLink to={"/scores"}>High Scores</NavLink>
        </li>
        <li>
          <NavLink to={"/login"}>Login</NavLink>
        </li>
        <li>
          <NavLink to={"/register"}>Register</NavLink>
        </li>
      </ul>
    </nav>
  );
}
