import { verifyAccessToken } from "../../../utils/account/auth";

/**
 * API endpoint for user authentication, note: currently not used, but included for possible future use
 * @param {*} res
 * @param {*} req
 * @returns
 */

export default function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const decoded = verifyAccessToken(authHeader);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(200).json({ message: "Access granted", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
