import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SudokuProvider from "./components/SudokuProvider.jsx";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Selection from "./pages/Selection.jsx";
import SudokuGame from "./pages/SudokuGame.jsx";
import Rules from "./pages/Rules.jsx";
import Scores from "./pages/Scores.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "games",
        element: <Selection />,
      },
      {
        path: "games/:difficulty",
        element: (
          <SudokuProvider>
            <SudokuGame />
          </SudokuProvider>
        ),
      },
      {
        path: "rules",
        element: <Rules />,
      },
      {
        path: "scores",
        element: <Scores />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
