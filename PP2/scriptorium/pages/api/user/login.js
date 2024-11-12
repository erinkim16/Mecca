import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/account/auth";

/**
 * Authenticates a user and generates access and refresh tokens.
 *
 * This function validates the user's credentials (username and password)
 * and, if successful, generates an access token and a refresh token.
 *
 * @param {string} username - The username of the user (required).
 * @param {string} password - The password of the user (required).
 * @returns {Promise<Object>} - An object containing the access token and refresh token.
 *
 * @throws {Error} If the username or password is missing, or if the credentials are invalid.
 */

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: "Please provide all the required fields",
        });
      }

      const user = await prisma.user.findUnique({ where: { username } });
      // validate username and password
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // generate tokens
      const payload = { id: user.id, username: user.username, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Login error: ", error);
      res.status(500).json({ error: "Login failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
