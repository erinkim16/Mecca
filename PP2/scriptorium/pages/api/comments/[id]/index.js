import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  const { id } = req.query;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid or missing comment ID" });
  }

  if (req.method === "GET") {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(id) },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      res.status(200).json(comment);
    } catch (error) {
      console.error("Error fetching comment:", error);
      return res.status(500).json({ error: "Failed to get comment" });
    }
  } 
  // possible add ons: edit and delete comments
}
