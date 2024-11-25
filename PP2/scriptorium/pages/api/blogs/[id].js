import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";
import { getTemplateIds } from "../../../pages/api/blogs/index";

/**
 * Allow users to edit and delete blog posts
 */

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);

  if (!user && (req.method === "PUT" || req.method === "DELETE")) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    return await editBlog(req, res, id, user);
  } else if (req.method === "DELETE") {
    return await deleteBlog(req, res, id, user);
  } else if (req.method === "GET") {
    return await getBlog(req, res, id);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getBlog(req, res, id) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            username: true, // Include the username field
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
        codeTemplate: {
          select: {
            id: true,
            title: true,
            explanation: true,
            codeId: true,
          },
        },
        rating: true, // Include ratings if necessary
      },
    });

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    const transformedBlogPost = {
      ...blogPost,
      author: blogPost.author?.username || "Unknown Author", // Use username instead of email
      tags: blogPost.tags.map((tag) => tag.name),
      createdAt: new Date(blogPost.createdAt).toISOString(), // Format as ISO string
    };

    return res.status(200).json(transformedBlogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return res.status(500).json({ error: "Failed to fetch blog post" });
  }
}


async function editBlog(req, res, id, user) {
  try {
    const { title, description, content, newTemplates, newTags } = req.body;

    const blogPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post could not be found" });
    }

    // if they didn't write the blog post they can't edit it
    if (blogPost.authorId !== user.id) {
      return res
        .status(403)
        .json({ error: "You do not have access to edit this blog post" });
    }

    // user story -> can't edit content if it is hidden
    if (blogPost.hidden) {
      return res.status(403).json({ error: "You can not edit hidden content" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;

    if (newTemplates) {
      const templateIds = getTemplateIds(newTemplates);
      const templates = await prisma.codeTemplate.findMany({
        where: {
          id: {
            in: templateIds,
          },
        },
      });

      if (templates.length != newTemplates.length) {
        return res
          .status(400)
          .json({
            error: "Some code templates do not exist. Please check urls",
          });
      }
      

      updateData.codeTemplate = {
        connect: templates.map((template) => ({ id: template.id })),  
      };
    }

    if (newTags) {
      updateData.tags = {
        set: [],
        connectOrCreate: newTags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res
      .status(200)
      .json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update blog post" });
  }
}

async function deleteBlog(req, res, id, user) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!blogPost) {
      return res.status(400).json({ error: "Blog post could not be found" });
    }

    if (blogPost.authorId !== user.id) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this blog post" });
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Blog post deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete blog post" });
  }
}
