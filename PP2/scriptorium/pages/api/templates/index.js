// handles creating new templates, listing all templates, searching by title, explanation or tags
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";
import { saveCodeFile } from "../../../utils/code-saving/codeFileHandler";

const prisma = new PrismaClient();

/**
 * Handles creating new code templates and retrieving existing templates.
 *
 * This function allows authenticated users to create new code templates with
 * specified details and enables both authenticated users and visitors to
 * retrieve templates based on search queries and filtering by
 * author.
 *
 * @param {string} method - The HTTP method of the request (required).
 * @param {string} [title] - The title of the new code template (required for POST).
 * @param {string} [explanation] - A description of the code template (optional).
 * @param {string} [codeContent] - The actual code content to be saved (required for POST).
 * @param {array} [tags] - An array of tags associated with the template (optional).
 * @param {string} [language] - The programming language of the code content (required for POST).
 * @param {string} [query] - A search term to filter templates by title, explanation, or tags (optional for GET).
 * @param {number} [page] - The page number for pagination (default is 1, optional for GET).
 * @param {number} [limit] - The number of templates per page (default is 10, optional for GET).
 * @returns {Promise<Object>} - An object containing a success message and the created or retrieved templates.
 *
 * @throws {Error} If the authorization token is missing, required fields are missing,
 *                 or if there is an error creating or retrieving templates.
 */

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "POST":
      const authHeader = req.headers.authorization;
      const user = verifyAccessToken(authHeader);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Login required to create template." });
      }

      // body passes in code content as a block of text
      const { title, explanation, codeContent, tags, language } = req.body;
      if (!title || !codeContent || !language) {
        return res.status(400).json({
          message: "Title, code and language selection are required",
        });
      }

      try {
        // save code content to file and get file path
        const filePath = saveCodeFile(user.id, null, codeContent, language);

        if (!filePath) {
          return res.status(500).json({
            message: "Failed to save the code file. ",
          });
        }

        // make new code obj
        const newCode = await prisma.code.create({
          data: {
            filePath,
            language,
          },
        });

        const tagOperations =
          Array.isArray(tags) && tags.length > 0
            ? tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              }))
            : [];

        const newTemplate = await prisma.codeTemplate.create({
          data: {
            title,
            explanation: explanation || "",
            authorId: user.id,
            codeId: newCode.id,
            ...(tagOperations.length > 0 && {
              tags: { connectOrCreate: tagOperations },
            }),
          },
          include: { tags: true },
        });

        res.status(200).json({
          message: "Template created successfully.",
          template: newTemplate,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error creating template", error: error.message });
      }
      break;

    case "GET":
      try {
        const { query, page = 1, limit = 10 } = req.query;
        // pagintating
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;

        const authHeader = req.headers.authorization;
        const user = verifyAccessToken(authHeader);

        console.log("in get");

        let visitor = false;
        if (!user) {
          visitor = true;
        }

        const lowerCaseQuery = query ? query.toLowerCase() : "";

        let templates;
        if (query && !visitor) {
          //  searching through my saved code templates
          templates = await prisma.codeTemplate.findMany({
            where: {
              authorId: parseInt(user.id),
              OR: [
                { title: { contains: lowerCaseQuery } },
                { explanation: { contains: lowerCaseQuery } },
                {
                  tags: {
                    some: { name: { contains: lowerCaseQuery } },
                  },
                },
              ],
            },
            include: { tags: true, code: true },
            skip: skip,
            take: parsedLimit,
          });
        } else if (query && visitor) {
          // a visitor
          templates = await prisma.codeTemplate.findMany({
            where: {
              OR: [
                { title: { contains: lowerCaseQuery } },
                { explanation: { contains: lowerCaseQuery } },
                {
                  tags: {
                    some: { name: { contains: lowerCaseQuery } },
                  },
                },
              ],
            },
            include: { tags: true, code: true },
            skip: skip,
            take: parsedLimit,
          });
        } else if (!visitor) {
          // return all of user's templates
          templates = await prisma.codeTemplate.findMany({
            where: { authorId: parseInt(user.id) },
            include: { tags: true, code: true },
            skip: skip,
            take: parsedLimit,
          });
        } else {
          // return all templates
          templates = await prisma.codeTemplate.findMany({
            include: { tags: true, code: true },
            skip: skip,
            take: parsedLimit,
          });
        }
        res.status(200).json(templates);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "error getting template", error: error.message });
      }
      break;

    default:
      // might have to change to something
      res.status(405).json({ message: "Method not allowed" });
    // res.setHeader("Allow", ["GET", "POST"]);
    // res.status(405).end(`Method ${method} Not Allowed`);
  }
}
