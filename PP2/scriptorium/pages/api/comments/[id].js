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
  } else if (req.method === "PUT" && req.url.endsWith("/rate")) {
    // Handle rating a comment
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { rating } = req.body;

    if (typeof rating !== "number" || (rating !== 1 && rating !== -1)) {
      return res.status(400).json({ error: "Invalid rating value" });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id) },
        data: {
          ratingScore: {
            increment: rating, // Adjusts the rating score
          },
        },
      });

      res.status(200).json({ message: "Comment rating updated successfully", updatedComment });
    } catch (error) {
      console.error("Error updating comment rating:", error);
      return res.status(500).json({ error: "Failed to update comment rating" });
    }
  } else   if (req.method === "PUT") {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.query; // Extract ID from the query params
    const { rating } = req.body; // Extract rating from the request body

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid or missing comment ID" });
    }

    if (typeof rating !== "number" || (rating !== 1 && rating !== -1)) {
      return res.status(400).json({ error: "Invalid rating value" });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id) },
        data: {
          rating: {
            increment: rating, // Adjust the rating
          },
        },
      });

      return res.status(200).json({
        message: "Comment rating updated successfully",
        updatedComment,
      });
    } catch (error) {
      console.error("Error updating comment rating:", error);
      return res.status(500).json({ error: "Failed to update comment rating" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
