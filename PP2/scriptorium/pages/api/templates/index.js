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

    // case "GET":
    //   try {
    //     const { query, page = 1, limit = 10 } = req.query;
    //     // paginating
    //     const parsedPage = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
    //     const parsedLimit = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1
    //     const skip = (parsedPage - 1) * parsedLimit;

    //     const authHeader = req.headers.authorization;
    //     const user = verifyAccessToken(authHeader);

    //     // console.log("in get");

    //     let visitor = false;
    //     if (!user) {
    //       visitor = true;
    //     }

    //   // Split query into multiple terms, or use an empty array if no query
    //   const queryTerms = query ? query.toLowerCase().split(" ") : [];

    //   let templates;
    //   if (queryTerms.length && !visitor) {
    //     // Searching through user's saved code templates with multiple terms
    //     templates = await prisma.codeTemplate.findMany({
    //       where: {
    //         authorId: parseInt(user.id),
    //         OR: queryTerms.map((term) => ({
    //           OR: [
    //             { title: { contains: term } },
    //             { explanation: { contains: term } },
    //             {
    //               tags: {
    //                 some: { name: { contains: term } },
    //               },
    //             },
    //           ],
    //         })),
    //       },
    //       include: { tags: true, code: true },
    //       skip: skip,
    //       take: parsedLimit,
    //     });
    //   } else if (queryTerms.length && visitor) {
    //     // A visitor searching through templates with multiple terms
    //     templates = await prisma.codeTemplate.findMany({
    //       where: {
    //         OR: queryTerms.map((term) => ({
    //           OR: [
    //             { title: { contains: term } },
    //             { explanation: { contains: term } },
    //             {
    //               tags: {
    //                 some: { name: { contains: term } },
    //               },
    //             },
    //           ],
    //         })),
    //       },
    //       include: { tags: true, code: true },
    //       skip: skip,
    //       take: parsedLimit,
    //     });
    //   } else if (!visitor) {
    //     // Return all of the user's templates if no query terms
    //     templates = await prisma.codeTemplate.findMany({
    //       where: { authorId: parseInt(user.id) },
    //       include: { tags: true, code: true },
    //       skip: skip,
    //       take: parsedLimit,
    //     });
    //   } else {
    //     // Return all templates if no query terms
    //     templates = await prisma.codeTemplate.findMany({
    //       include: { tags: true, code: true },
    //       skip: skip,
    //       take: parsedLimit,
    //     });
    //   }
    //   res.status(200).json(templates);
    // } catch (error) {
    //   console.log(error);
    //   res
    //     .status(500)
    //     .json({ message: "error getting template", error: error.message });
    // }
    // break;

    // Split query into multiple terms, or use an empty array if no query
    //   const queryTerms = query ? query.toLowerCase().split(" ") : [];

    //   let whereCondition = {};
    //   if (queryTerms.length) {
    //     // Build search conditions based on query terms
    //     whereCondition = {
    //       OR: queryTerms.map((term) => ({
    //         OR: [
    //           { title: { contains: term } },
    //           { explanation: { contains: term } },
    //           {
    //             tags: {
    //               some: { name: { contains: term } },
    //             },
    //           },
    //         ],
    //       })),
    //     };
    //   }

    //   if (!visitor) {
    //     whereCondition.authorId = parseInt(user.id);
    //   }

    //   // Fetch total count for pagination
    //   const totalTemplates = await prisma.codeTemplate.count({
    //     where: whereCondition,
    //   });

    //   // Fetch paginated results
    //   const templates = await prisma.codeTemplate.findMany({
    //     where: whereCondition,
    //     include: { tags: true, code: true },
    //     skip: skip,
    //     take: parsedLimit,
    //   });

    //   // Calculate total pages
    //   const totalPages = Math.ceil(totalTemplates / parsedLimit);

    //   // Respond with templates and pagination metadata
    //   res.status(200).json({
    //     templates,
    //     pagination: {
    //       totalTemplates,
    //       totalPages,
    //       currentPage: parsedPage,
    //       limit: parsedLimit,
    //     },
    //   });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({
    //     message: "Error retrieving templates",
    //     error: error.message,
    //   });
    // }
    // break;

    // query splitting, by tags, title, and explanation
    case "GET":
      try {
        const {
          title, // Parameter to search by title
          explanation, // Parameter to search by explanation text
          tag, // Parameter to search by a specific tag
          page = 1,
          limit = 10,
        } = req.query;

        // Parsing pagination parameters
        const parsedPage = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
        const parsedLimit = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1
        const skip = (parsedPage - 1) * parsedLimit;

        const authHeader = req.headers.authorization;
        const user = verifyAccessToken(authHeader);

        let visitor = false;
        if (!user) {
          visitor = true;
        }

        // Split the query parameters into terms and convert them to lowercase
        const titleTerms = title ? title.toLowerCase().split(" ") : [];
        const explanationTerms = explanation
          ? explanation.toLowerCase().split(" ")
          : [];
        const tagTerms = tag ? tag.toLowerCase().split(" ") : [];

        // Construct `where` conditions for each parameter
        let whereCondition = {
          AND: [],
        };

        // Add conditions for title search
        if (titleTerms.length > 0) {
          whereCondition.AND.push({
            OR: titleTerms.map((term) => ({
              title: { contains: term },
            })),
          });
        }

        // Add conditions for explanation search
        if (explanationTerms.length > 0) {
          whereCondition.AND.push({
            OR: explanationTerms.map((term) => ({
              explanation: { contains: term },
            })),
          });
        }

        // Add conditions for tag search
        if (tagTerms.length > 0) {
          whereCondition.AND.push({
            OR: tagTerms.map((term) => ({
              tags: {
                some: { name: { contains: term } },
              },
            })),
          });
        }

        // Restrict to user's templates if authenticated
        if (!visitor) {
          whereCondition.AND.push({ authorId: parseInt(user.id) });
        }

        // Fetch total count for pagination
        const totalTemplates = await prisma.codeTemplate.count({
          where: whereCondition,
        });

        // Fetch paginated results
        const templates = await prisma.codeTemplate.findMany({
          where: whereCondition,
          include: { tags: true, code: true },
          skip: skip,
          take: parsedLimit,
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalTemplates / parsedLimit);

        // Respond with templates and pagination metadata
        res.status(200).json({
          templates,
          pagination: {
            totalTemplates,
            totalPages,
            currentPage: parsedPage,
            limit: parsedLimit,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Error retrieving templates",
          error: error.message,
        });
      }
      break;
    default:
      // might have to change to something
      res.status(405).json({ message: "Method not allowed" });
    // res.setHeader("Allow", ["GET", "POST"]);
    // res.status(405).end(`Method ${method} Not Allowed`);
  }
}
