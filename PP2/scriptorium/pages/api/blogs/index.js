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
      console.log("User not logged in");
      return res
        .status(401)
        .json({ error: "Please sign in to create a blog post" });
    }
   
    const { title, description, content, tags = [], codeTemplates = [] } = req.body;
  
    if (!title || !description || !content) {
      return res.status(400).json({
        error: "Blog posts must have a title, description, and valid content.",
      });
    }
  
    try {
      const templateIds = getTemplateIds(codeTemplates.map((url) => url.trim()));
      const templates = await prisma.codeTemplate.findMany({
        where: {
          id: { in: templateIds },
        },
      });
  
      if (templates.length !== templateIds.length) {
        return res.status(400).json({
          error: "Some code templates do not exist. Please check URLs.",
        });
      }
  
      const blog = await prisma.blogPost.create({
        data: {
          title,
          description,
          createdAt: new Date(),
          content: typeof content === "string" ? content : JSON.stringify(content),
          codeTemplate: {
            connect: templates.map((template) => ({ id: template.id })),
          },
          author: {
            connect: { id: user.id },
          },
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag.toLowerCase() },
              create: { name: tag.toLowerCase() },
            })),
          },
        },
        include: {
          author: {
            select: {
              username: true, // Include only the username
            },
          },
          tags: true,
          codeTemplate: true,
        },
      });

      // Ensure comments are explicitly set as an empty array
      const response = {
        ...blog,
        comments: [], // Explicitly set comments to an empty array
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return res.status(500).json({ error: "Blog post could not be created" });
    }
  } else if (req.method === "GET") {
      const query = req.query.query?.trim().toLowerCase();
      const tags = req.query.tags
      ? req.query.tags.split(",").map((tag) => tag.trim().toLowerCase())
      : null;
      const codeTemplate = req.query.codeTemplate?.trim().toLowerCase();
    
      try {
        const blogPosts = await prisma.blogPost.findMany({
          where: {
            hidden: false,
            AND: [
              // General query for title and content
              ...(query
                ? [
                    {
                      OR: [
                        { title: { contains: query } },
                        { content: { contains: query } },
                      ],
                    },
                  ]
                : []),
              ...(tags
                ? [
                    {
                      tags: {
                        some: {
                          name: {
                            in: tags, // Match any of the tags
                          },
                        },
                      },
                    },
                  ]
                : []),
              ...(codeTemplate
                ? [
                    {
                      codeTemplate: {
                        some: {
                          title: {
                            contains: codeTemplate,
                          },
                        },
                      },
                    },
                  ]
                : []),
            ],
          },
          include: {
            rating: true,
            tags: true,
            codeTemplate: true,
          },
          orderBy: [
            { ratingScore: "desc" },
            { createdAt: "desc" },
          ],
          take: 10, // Limit results
        });
    
        res.status(200).json(blogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ error: "Failed to fetch blog posts" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
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

