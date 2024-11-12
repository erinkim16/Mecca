import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";
const prisma = new PrismaClient();
const AVATAR_BASE_URL = "/avatars/";

/**
 * Updates a user's profile information.
 *
 * This function allows authenticated users to update their profile details,
 * including their first name, last name, email, and avatar.
 *
 * @param {number} id - The unique identifier of the user whose profile is being updated (required).
 * @param {string} [firstName] - The new first name of the user (optional).
 * @param {string} [lastName] - The new last name of the user (optional).
 * @param {string} [email] - The new email address of the user (optional).
 * @param {number} [avatar] - The new avatar ID of the user (optional).
 * @returns {Promise<Object>} - An object containing a success message and the updated user information.
 *
 * @throws {Error} If the authorization token is missing, invalid, or if the update fails.
 */

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "PUT") {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = verifyAccessToken(authHeader);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }

    const { firstName, lastName, email, avatar } = req.body;

    try {
      const dataForUpdate = {};

      if (firstName !== undefined) {
        dataForUpdate.firstName = firstName;
      }
      if (lastName !== undefined) {
        dataForUpdate.lastName = lastName;
      }
      if (email !== undefined) {
        dataForUpdate.email = email;
      }
      if (avatar !== undefined) {
        dataForUpdate.avatar = avatar;
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: dataForUpdate,
      });

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          ...updatedUser,
          avatarUrl: `${AVATAR_BASE_URL}${updatedUser.avatar}.png`,
        },
      });
    } catch (error) {
      console.error("Profile update error: ", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
