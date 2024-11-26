import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../../utils/account/auth";
/**
 * Refreshes access tokens using a provided refresh token.
 *
 * This function verifies the refresh token and generates a new access token
 * for the user. It returns the new access token upon successful verification.
 *
 * @param {string} refreshToken - The refresh token used to obtain a new access token (required).
 * @returns {Promise<Object>} - An object containing the new access token.
 *
 * @throws {Error} If the refresh token is missing, invalid, expired, or if an error occurs during the process.
 */

export default function handler(req, res) {
  if (req.method === "POST") {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token missing" });
    }

    try {
      // verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        console.log("refresh token not valid");
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }

      // generate a new access toke with the payload from refresh token
      const newAccessToken = generateAccessToken({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });
      console.log("new access token generated");

      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Refresh error: ", error);
      res.status(500).json({ error: "Refreshing token failed" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
