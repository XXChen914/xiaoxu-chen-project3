import jwt from "jsonwebtoken";

/**
 * Decodes the username from JWT stored in cookie.
 */
export function decodeUserName(req) {
  const token = req.cookies?.token;

  if (!token) {
    return null;
  }

  try {
    // Verify token with SUPER_SECRET
    const decoded = jwt.verify(token, process.env.SUPER_SECRET);
    return decoded.username || null;
  } catch (err) {
    // Token is invalid or expired
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
