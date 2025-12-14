import { createUser, findUserByUsername } from "../models/user/user.model.js";
import { decodeUserName } from "../utils/userNameDecoder.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

/**
 * GET /api/user/isLoggedIn
 * Checks if user is logged in via cookie
 */
export async function isLoggedIn(req, res) {
  try {
    const username = decodeUserName(req);
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
    res.json({ username });
  } catch (error) {
    console.error("Error checking login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/user/login
 * Sets cookie if login successful
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, process.env.SUPER_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie for session tracking
    res.cookie("token", token, getCookieOptions());
    res.status(200).json({ message: "Login successful", username });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/user/register
 * Sets cookie if registration successful
 */
export async function register(req, res) {
  try {
    const { username, password, verifyPassword } = req.body;

    if (!username || !password || !verifyPassword) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    if (password !== verifyPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createUser({ username, password: hashedPassword });

    const token = jwt.sign({ username }, process.env.SUPER_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, getCookieOptions());
    res
      .status(201)
      .json({ message: "User created", username: newUser.username });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/user/logout
 * Clears user cookie
 */
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}