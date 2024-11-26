import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { blogPostId } = req.query;

      if (!blogPostId || isNaN(parseInt(blogPostId))) {
        return res.status(400).json({ error: "Invalid or missing blogPostId" });
      }

      const parsedBlogPostId = parseInt(blogPostId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const comments = await prisma.comment.findMany({
        where: {
          blogPostId: parsedBlogPostId,
          parentId: null, // Fetch only top-level comments
        },
        select: {
          id: true,
          content: true, // Include the content of the comment
          ratingScore: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true, // Include content for replies as well
              ratingScore: true,
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
          ratingScore: "desc", // Sort by rating score in descending order
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
      console.log(comments);
      const totalPages = Math.ceil(totalComments / limit);

      return res.status(200).json({
        comments: comments.map((comment) => ({
          ...comment,
          rating: comment.ratingScore, // Map ratingScore to rating
          replies: comment.replies?.map((reply) => ({
            ...reply,
            rating: reply.ratingScore, // Map for replies too
          })),
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalComments,
        },
      });
    } else if (req.method === "POST") {
      console.log("POST Request Body:", req.body);
      const authHeader = req.headers.authorization;
      const user = verifyAccessToken(authHeader);

      if (!user) {
        return res.status(401).json({ error: "Please log in to post a comment" });
      }

      const { content, blogId, parentId } = req.body;

      if (!content || typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ error: "Content cannot be empty" });
      }

      const comment = await prisma.comment.create({
        data: {
          content: content.trim(),
          authorId: user.id,
          blogPostId: parseInt(blogId),
          parentId: parentId ? parseInt(parentId) : null,
        },
      });

      return res.status(201).json({ message: "Comment added successfully", comment });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
