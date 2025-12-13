import express from "express";
import {
  isLoggedIn,
  login,
  register,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();

// Check if user is logged in
// GET /api/user/isLoggedIn
router.get("/isLoggedIn", isLoggedIn);

// Login user and set cookie
// POST /api/user/login
router.post("/login", login);

// Register a new user and set cookie
// POST /api/user/register
router.post("/register", register);

// Logout user and clear cookie
// POST /api/user/logout
router.post("/logout", logout);

export default router;