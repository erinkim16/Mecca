import { verifyAccessToken, verifyRefreshToken } from "../../../utils/account/auth";

export default function adminMiddleware(req, res) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    console.log("Authorization token missing");
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    var decoded = verifyAccessToken(authHeader);
    if (!decoded) {
          console.log("Invalid or expired token");
            return res.status(401).json({ message: "Invalid or expired token" });
    }

    // check if admin
    if (decoded.role !== "ADMIN") {
      console.log("forbideen");
      return res.status(403).json({ error: "Forbidden" });
    }
    //res.status(200).json({ message: "Admin access granted", user: decoded });
  } catch (error) {
    console.log("other error")
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
