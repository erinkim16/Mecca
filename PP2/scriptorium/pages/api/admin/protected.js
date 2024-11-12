import { verifyAccessToken } from "../../../utils/account/auth";

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

    // check if admin
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    //res.status(200).json({ message: "Admin access granted", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
