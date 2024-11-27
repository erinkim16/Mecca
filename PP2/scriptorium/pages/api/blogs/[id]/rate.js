import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {

  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  try {
    
  // Validate HTTP method
  if (req.method === "PUT") {
    const { id } = req.query; // Extract the comment ID from the query
    const { rating } = req.body; // Extract the rating from the request body
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid or missing comment ID" });
  }

  if (typeof rating !== "number" || (rating !== 1 && rating !== -1)) {
    return res.status(400).json({ error: "Invalid rating value. Must be 1 (upvote) or -1 (downvote)." });
  }

  try {
    const where = { userId_blogPostId: { userId: user.id, blogPostId: parseInt(id) } };

    const existing = await prisma.rating.findUnique({
      where,
    });
    
    const ratingAdjustment = existing ? rating - existing.rating : rating;

    // Upsert the rating
    await prisma.rating.upsert({
      where,
      update: { rating: rating },
      create: {
        rating: rating,
        userId: user.id,
        ...{ blogPostId: parseInt(id) },
      },
    });

    const updated = await prisma.blogPost.update({
        where: { id: parseInt(id) },
        data: { ratingScore: { increment: ratingAdjustment } },
      });


    return res.status(200).json( updated );
  } catch (error) {
    console.error("Error updating blog rating:", error);
    return res.status(500).json({ error: "Failed to update blog rating" });
  }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid or missing blog ID" });
    }
  
    try {
      // Find the existing vote
      const existingVote = await prisma.rating.findUnique({
        where: {
          userId_blogPostId: {
            userId: user.id,
            blogPostId: parseInt(id),
          },
        },
      });
  
      if (!existingVote) {
        return res.status(400).json({ error: "No vote to remove" });
      }
  
      // Remove the vote
      await prisma.rating.delete({
        where: {
          userId_blogPostId: {
            userId: user.id,
            blogPostId: parseInt(id),
          },
        },
      });
  
      // Adjust the rating score on the comment
      const adjustment = -existingVote.rating;
      const updated = await prisma.blogPost.update({
        where: { id: parseInt(id) },
        data: {
          ratingScore: {
            increment: adjustment,
          },
        },
      });

  
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error removing vote:", error);
      return res.status(500).json({ error: "Failed to remove vote" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }


  } catch (error){
    return res.status(500).json({ error: "Comment can not be rated" });
  }

}
