import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../../utils/account/auth";

// searches through user's templates only
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
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
          include: { tags: true, code: true, author: true },
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
