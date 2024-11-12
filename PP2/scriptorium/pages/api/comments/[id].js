import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method == "GET") {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(id) },
        include: { user: true, replies: { include: { user: true } } },
      });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ error: "Failed to get comment" });
    }
  } else if (req.method === "PUT") {
    // update comments
    const { content } = req.body;

    try {
      const updated = await prisma.comment.update({
        where: { id: parseInt(id) },
        data: { content },
      });

      res
        .status(200)
        .json({ message: "Comment updated successfully", updated });
    } catch (error) {
      return res.status(500).json({ error: "Comment could not be updated" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.comment.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete the comment" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
