import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

/**
 * API endpoint to leave ratings
 */

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Please log in to leave a rating" });
  }

  if (req.method === "POST") {
    const { id, contentType, vote } = req.body;

    try {
      if (contentType !== "BlogPost" && contentType !== "Comment") {
        return res
          .status(400)
          .json({ error: "Can not rate this type of content" });
      }

      const where = contentType === "BlogPost"
        ? { userId_blogPostId: { userId: user.id, blogPostId: id } }
        : { userId_commentId: { userId: user.id, commentId: id } };

      const existing = await prisma.rating.findUnique({
        where,
      });
      
      const ratingAdjustment = existing ? vote - existing.rating : vote;

      // Upsert the rating
      await prisma.rating.upsert({
        where,
        update: { rating: vote },
        create: {
          rating: vote,
          userId: user.id,
          ...(contentType === "BlogPost" ? { blogPostId: id } : { commentId: id }),
        },
      });

      let updated;
      if (contentType === "Comment") {
         updated = await prisma.comment.update({
          where: { id: id },
          data: { ratingScore: { increment: ratingAdjustment } },
        });
      } else if (contentType === "BlogPost") {
         updated = await prisma.blogPost.update({
          where: { id: id },
          data: { ratingScore: { increment: ratingAdjustment } },
        });
      }
      res.status(200).json({ message: "Rating has been processed", updated });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Failed to post rating" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
