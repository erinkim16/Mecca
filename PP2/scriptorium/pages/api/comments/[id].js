import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

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
  } else if (req.method === "PUT") {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id) },
        data: { content },
      });

      res.status(200).json({ message: "Comment updated successfully", updatedComment });
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({ error: "Failed to update comment" });
    }
  } else if (req.method === "DELETE") {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    try {
      await prisma.comment.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Failed to delete comment" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
