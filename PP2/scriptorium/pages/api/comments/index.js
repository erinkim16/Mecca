import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

/**
 * Allow users to view and post comments
 */

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  const { blogPostId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (req.method === "GET") {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          blogPostId: parseInt(blogPostId),
          parentId: null,
        },
        include: {
          author: true,
          replies: {
            include: {
              author: true,
            },
          },
        },
        orderBy: {
          ratingScore: "desc",
        },
        skip,
        take: limit,
      });

      const totalComments = await prisma.comment.count({
        where: {
          blogPostId: parseInt(blogPostId),
          parentId: null,
        },
      });
      const pages = Math.ceil(totalComments / limit);

      res.status(200).json({
        comments,
        pagination: {
          currentPage: page,
          pages,
          totalComments,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  } else if (req.method === "POST") {
    if (!user) {
      return res.status(401).json({ error: "Please log in to post a comment" });
    }

    const { content, parentId } = req.body;

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: user.id,
          blogPostId: parseInt(blogPostId),
          parentId: parentId ? parseInt(parentId) : null, // check if it is replying to a comment
        },
      });

      res.status(200).json({ message: "Comment added successfully", comment });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Failed to create comment" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
