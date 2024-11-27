import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Validate HTTP method
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  const { id } = req.query; // Extract the comment ID from the query
  const { rating } = req.body; // Extract the rating from the request body

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid or missing comment ID" });
  }

  if (typeof rating !== "number" || (rating !== 1 && rating !== -1)) {
    return res
      .status(400)
      .json({
        error: "Invalid rating value. Must be 1 (upvote) or -1 (downvote).",
      });
  }

  try {
    // Update the comment's rating score
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        ratingScore: {
          increment: rating, // Increment or decrement the rating score
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
}
