import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { hashPassword } from "../../../utils/account/auth";
// setting base for avatars
const AVATAR_BASE_URL = "/avatars/";

/**
 * Registers a new user.
 *
 * This function takes user details, validates them, and creates a new user
 * in the database. It returns the registered user's information upon success.
 *
 * @param {string} username - The username for the new account (required).
 * @param {string} password - The password for the new account (required).
 * @param {string} email - The email address for the new account (required).
 * @param {string} [firstName] - The user's first name (optional).
 * @param {string} [lastName] - The user's last name (optional).
 * @param {number} [avatar] - The avatar ID for the user (optional, defaults to 1).
 * @param {string} [role] - The role of the user (optional, defaults to "USER").
 * @returns {Promise<Object>} - The newly created user object, including an avatar URL.
 *
 * @throws {Error} If the registration fails due to missing fields or existing username.
 */

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // initialize variables
      const { username, password, firstName, lastName, email, avatar, role } =
        req.body;

      // avatar is optional for now?
      // maybe set a default avatar on random and then you can edit them after
      // phone number, firstName, lastName not required
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Please provide all the required fields",
        });
      }

      // check if username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // create user, assume 1 <= avatar <= 4
      const newUser = await prisma.user.create({
        data: {
          username,
          password: await hashPassword(password),
          firstName: firstName || "",
          lastName: lastName || "",
          email,
          avatar: avatar || 1, // default avatar is 1
          role: role || "USER", // Default to "USER" role if not provided
        },
      });

      res.status(200).json({
        ...newUser,
        avatarUrl: `${AVATAR_BASE_URL}${newUser.avatar}.png`,
      });
    } catch (error) {
      console.error("Registration error: ", error);
      res.status(500).json({ error: "Registration failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
