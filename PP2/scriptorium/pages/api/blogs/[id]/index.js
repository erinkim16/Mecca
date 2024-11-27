import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "@/utils/account/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  if (!user && ["PUT", "DELETE"].includes(req.method)) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case "PUT":
        return await editBlog(req, res, id, user);
      case "DELETE":
        return await deleteBlog(req, res, id, user);
      case "GET":
        return await getBlog(req, res, id);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getBlog(req, res, id) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { id: true, username: true } },
        tags: { select: { name: true } },
        codeTemplate: { select: { id: true, title: true, explanation: true, codeId: true } },
      },
    });

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    return res.status(200).json({
      ...blogPost,
      content: blogPost.content ? JSON.parse(blogPost.content) : { type: "doc", content: [] },
      author: blogPost.author.username,
      tags: blogPost.tags.map((tag) => tag.name),
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return res.status(500).json({ error: "Failed to fetch blog post" });
  }
}



async function editBlog(req, res, id, user) {
  try {
    const { title, description, content, newTemplates, newTags } = req.body;

    console.log("Content received:", content); // Debug to confirm content format

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (blogPost.authorId !== user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(content && { content: typeof content === "string" ? content : JSON.stringify(content) }), // Ensure content is stringified
    };

    const updatedBlog = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.status(200).json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ error: "Failed to update blog post" });
  }
}


async function deleteBlog(req, res, id, user) {
  const blogPost = await prisma.blogPost.findUnique({ where: { id: parseInt(id) } });
  if (!blogPost) return res.status(404).json({ error: "Blog post not found" });
  if (blogPost.authorId !== user.id) return res.status(403).json({ error: "Unauthorized access" });

  await prisma.blogPost.delete({ where: { id: parseInt(id) } });

  return res.status(200).json({ message: "Blog post deleted successfully" });
}
