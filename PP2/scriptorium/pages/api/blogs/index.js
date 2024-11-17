import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

/**
 * handles creating new blog, listing all blogs, searching by title, explanation or tags
 */
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    const user = verifyAccessToken(authHeader);
  
    if (!user) {
      return res
        .status(401)
        .json({ error: "Please sign in to create a blog post" });
    }
  
    const { title, description, content, tags, codeTemplates } = req.body;
  
    if (!title || !description || !content || typeof content !== 'object') {
      return res
        .status(400)
        .json({ error: "Blog posts must have a title, description, and valid content." });
    }
  
    try {
      const templateIds = getTemplateIds(codeTemplates);
      const templates = await prisma.codeTemplate.findMany({
        where: {
          id: {
            in: templateIds,
          },
        },
      });
  
      if (templates.length != codeTemplates.length) {
        return res
          .status(400)
          .json({ error: "Some code templates do not exist. Please check URLs." });
      }
  
      const blog = await prisma.blogPost.create({
        data: {
          title,
          description,
          content, // Save TipTap JSON content here
          codeTemplate: {
            connect: templates.map((template) => ({ id: template.id })),
          },
          author: {
            connect: { id: user.id },
          },
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: { tags: true, codeTemplate: true },
      });
  
      res.status(200).json(blog);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Blog post could not be created" });
    }
  } if (req.method === "GET") {
    const query = req.query.paramName?.toLowerCase();
  
    try {
      const blogPosts = await prisma.blogPost.findMany({
        where: {
          hidden: false,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            {
              tags: {
                some: { name: { contains: query } },
              },
            },
            {
              codeTemplate: {
                some: {
                  title: { contains: query },
                },
              },
            },
          ],
        },
        include: {
          rating: true,
          tags: true,
          codeTemplate: true,
        },
        orderBy: { ratingScore: "desc" },
      });
  
      res.status(200).json(blogPosts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  }
}  


// helper function to extract template ids to query them
export function getTemplateIds(urls) {
  return urls
    .map((url) => {
      try {
        const objUrl = new URL(url);
        const pathSeg = objUrl.pathname.split("/");
        return parseInt(pathSeg[pathSeg.length - 1], 10); // get template ID
      } catch {
        return null; // return null if the url is invalid
      }
    })
    .filter((id) => id !== null);
}
