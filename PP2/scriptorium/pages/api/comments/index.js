import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { blogPostId } = req.query;

    if (!blogPostId || isNaN(parseInt(blogPostId))) {
      return res.status(400).json({ error: "Invalid or missing blogPostId" });
    }

    const parsedBlogPostId = parseInt(blogPostId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.method === "GET") {
      const comments = await prisma.comment.findMany({
        where: {
          blogPostId: parsedBlogPostId,
          parentId: null,
        },
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
        orderBy: {
          ratingScore: "desc",
        },
        skip,
        take: limit,
      });

      const totalComments = await prisma.comment.count({
        where: {
          blogPostId: parsedBlogPostId,
          parentId: null,
        },
      });

      const totalPages = Math.ceil(totalComments / limit);

      return res.status(200).json({
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments,
        },
      });
    }

    if (req.method === "POST") {
      const authHeader = req.headers.authorization;
      const user = verifyAccessToken(authHeader);

      console.log(user);
      if (!user) {
        return res.status(401).json({ error: "Please log in to post a comment" });
      }

      const { content, parentId } = req.body;

      if (!content || typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ error: "Content cannot be empty" });
      }

      const comment = await prisma.comment.create({
        data: {
          content: content.trim(),
          authorId: user.id,
          blogPostId: parsedBlogPostId,
          parentId: parentId ? parseInt(parentId) : null,
        },
      });

      return res.status(201).json({ message: "Comment added successfully", comment });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
