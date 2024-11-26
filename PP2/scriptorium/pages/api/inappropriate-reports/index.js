import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";

const prisma = new PrismaClient();

/**
 * Allow users to make reports for inappropriate content
 * @param {Int} contentId - Id of the content to be reported
 * @param {Int} reason - why the comment is being reported
 * @param {Int} contentType - determine if a comment or blog is being reported
 * @returns
 */

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const user = verifyAccessToken(authHeader);


  if (!user) {
    return res.status(401).json({ error: "Please log in to report the user" });
  }

  if (req.method === "POST") {
    const { contentId, reason, contentType } = req.body;

    if (!contentId || !reason || !contentType) {
      return res.status(400).json({ error: "Content ID, reason, and Content type are required" });
    }


    try {
      let existingReport;

      if (contentType === "BlogPost"){
        existingReport = await prisma.blogReport.findFirst({
          where: {
            blogId: contentId,
            reporterId: user.id,
          }
        });
      } else if (contentType === "Comment") {
        existingReport = await prisma.commentReport.findFirst({
          where: {
            commentId: contentId,
            reporterId: user.id,
          },
        });
      } else {
        return res.status(400).json({ error: "Invalid content type" });
      }

      if (existingReport) {
        return res.status(400).json({ error: "You have already reported this content" });
      }

      let report;

      if (contentType === "BlogPost") {
        report = await prisma.blogReport.create({
          data: {
            reason,
            blog: {
              connect: { id: contentId },
            },
            reporter: {
              connect: { id: user.id },
            },
          },
        });
        res.status(200).json({ message: "Blog has been reported successfully", report });
      } else if (contentType === "Comment") {
        report = await prisma.commentReport.create({
          data: {
            reason,
            comment: {
              connect: { id: contentId },
            },
            reporter: {
              connect: { id: user.id },
            },
          },
        });

        return res.status(200).json({ message: "Comment has been reported successfully", report });
      } else {
        return res.status(400).json({ error: "Invalid content type" });
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Failed to submit report" });
    }
  }
}
