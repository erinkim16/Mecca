import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../../../utils/account/auth";
import fs from "fs";
import path from "path";
import { saveCodeFile } from "../../../utils/code-saving/codeFileHandler";
/**
 * Handles retrieving, updating, deleting, and forking code templates.
 *
 * This function allows authenticated users to manage their code templates,
 * including viewing a single template, updating it, deleting it, and forking
 * existing templates. Visitors can retrieve templates but cannot modify them.
 *
 * @param {string} method - The HTTP method of the request (required).
 * @param {number} id - The unique identifier of the code template being managed (required).
 * @param {string} [title] - The new title of the template (required for PUT and POST).
 * @param {string} [explanation] - The new explanation of the template (optional).
 * @param {string} [codeContent] - The new code content to be saved (required for PUT and POST).
 * @param {array} [tags] - An array of tags associated with the template (optional).
 * @param {string} [language] - The programming language of the code (required for POST).
 * @returns {Promise<Object>} - An object containing a success message and the created, updated, or retrieved template.
 *
 * @throws {Error} If the authorization token is missing, required fields are missing,
 *                 the template does not exist, or if there is an error processing the request.
 */

const prisma = new PrismaClient();
// const fs = require("fs").promises;

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      // retrieve a single template
      try {
        const template = await prisma.codeTemplate.findUnique({
          where: { id: parseInt(id) },
          include: { tags: true, code: true, author: true },
        });
        if (!template)
          return res.status(404).json({ message: "Template not found." });
        // const codeContent = fs.readFileSync(template.code.filePath, "utf-8");

        // res.status(200).json({ ...template, codeContent });

        let codeContent = "";
        if (template.code?.filePath) {
          const codeDir = path.join(process.cwd(), template.code.filePath);
          try {
            codeContent = fs.readFile(codeDir, "utf-8", (err, data) => {
              if (err) {
                console.error("Error reading code file:", err.message);
                return "";
              }
              return data;
            });
          } catch (readError) {
            console.error("Error reading code file:", readError.message);
            codeContent = ""; // Fallback
          }
        }

        // Respond with the template data
        res.status(200).json({
          ...template,
          code: { ...template.code, content: codeContent },
        });
      } catch (error) {
        console.error("Error fetching template:", error);
        res.status(500).json({ message: "Failed to fetch template" });
      }
      break;

    case "PUT":
      // update a template, separate from forking, only for users
      const authHeader = req.headers.authorization;
      const user = verifyAccessToken(authHeader);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Login required to edit template." });
      }

      try {
        const { title, explanation, codeContent, tags, language } = req.body;
        if (!title || !codeContent || !language) {
          return res.status(400).json({
            message: "Please provide all the required fields for updates",
          });
        }

        const template = await prisma.codeTemplate.findUnique({
          where: { id: parseInt(id) },
          include: { code: true },
        });

        if (!template) {
          return res.status(404).json({ message: "Template not found" });
        }

        if (template.authorId === user.id) {
          // user is the owener, update existing template

          // Delete the preexisting code file
          const codeDir = path.join(process.cwd(), template.code.filePath);
          if (template.code?.filePath && fs.existsSync(codeDir)) {
            try {
              fs.unlinkSync(codeDir);
            } catch (error) {
              console.error("Error deleting old code file (updating):", error);
              return res.status(500).json({
                message:
                  "Failed to update template. Error deleting old code file.",
              });
            }
          }
          // new filepath
          const filePath = saveCodeFile(
            user.id,
            template.id,
            codeContent,
            language
          );

          if (!filePath) {
            return res.status(500).json({
              message: "Failed to save the code file. ",
            });
          }

          // only update tags if `tags` are provided; otherwise, keep the original tags unchanged.
          const updatedTemplate = await prisma.codeTemplate.update({
            where: { id: template.id },
            data: {
              title,
              explanation: explanation || "",
              tags: tags
                ? {
                    set: [], // clear previous tags
                    connectOrCreate: tags.map((tag) => ({
                      where: { name: tag },
                      create: { name: tag },
                    })),
                  }
                : undefined,
              code: {
                update: {
                  filePath,
                  language,
                },
              },
              isForked: false,
            },
            include: { tags: true, code: true },
          });

          res.status(200).json({
            message: "Template updated successfully.",
            template: updatedTemplate,
          });
        } else {
          // user is not the owner, create a forked template
          return res.status(401).json({
            message:
              "Only the authors are allowed to edit templates. Please fork instead.",
          });
        }
      } catch (error) {
        console.error("Error updating template:", error);
        res.status(500).json({ message: "Failed to update template" });
      }
      break;

    case "DELETE":
      try {
        const authHeader = req.headers.authorization;
        const user = verifyAccessToken(authHeader);

        if (!user)
          return res.status(401).json({
            message: "Authentication required to delete template, please login",
          });

        // retrieve the code template to get associated file path

        const codeTemplate = await prisma.codeTemplate.findUnique({
          where: { id: parseInt(id) },
          include: { code: true },
        });

        if (codeTemplate.authorId === user.id) {
          if (!codeTemplate) {
            return res
              .status(404)
              .json({ message: "Template for deletion not found." });
          }

          //  delete code file from the file system
          const codeDir = path.join(process.cwd(), template.code.filePath);

          if (codeTemplate.code?.filePath && fs.existsSync(codeDir)) {
            try {
              fs.unlinkSync(codeDir);
            } catch (error) {
              console.error("Error deleting old code file:", error);
              return res.status(500).json({
                message:
                  "Failed to delete template. Error deleting old code file.",
              });
            }
          }

          //   delete code template
          await prisma.codeTemplate.delete({ where: { id: parseInt(id) } });
          // deleted successfully
          res.status(204).end();
        } else {
          // user is not the owner, cannot delete
          return res.status(401).json({
            message: "Only the authors are allowed to delete templates.",
          });
        }
      } catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({ message: "Failed to delete template." });
      }
      break;

    case "POST":
      // forking, cannot change the coding language
      try {
        const template = await prisma.codeTemplate.findUnique({
          where: { id: parseInt(id) },
          include: { tags: true, code: true },
        });

        if (!template)
          return res.status(404).json({ message: "Template not found." });

        const authHeader = req.headers.authorization;
        const user = verifyAccessToken(authHeader);

        if (!user)
          return res.status(401).json({
            message: "Please create an account to save the forked template",
          });

        const { title, explanation, codeContent } = req.body;
        if (!codeContent) {
          return res.status(400).json({
            message: "Please provide all the required fields for forking",
          });
        }

        // save code content to file and get file path
        const filePath = saveCodeFile(
          user.id,
          null,
          codeContent,
          template.code.language
        );

        if (!filePath) {
          return res.status(500).json({
            message: "Failed to save the code file. ",
          });
        }

        // make new code obj
        const newCode = await prisma.code.create({
          data: {
            filePath,
            language: template.code.language,
          },
        });

        const tagsToConnect =
          template.tags && template.tags.length > 0
            ? template.tags
                .map((tag) => ({ id: tag.id }))
                .filter((tag) => tag.id !== undefined)
            : [];

        const forkedTemplate = await prisma.codeTemplate.create({
          data: {
            title: title || `Fork of ${template.title}`,
            explanation: explanation || `Forked from template ${template.id}`,
            authorId: user.id,
            codeId: newCode.id,
            tags:
              tagsToConnect.length > 0 ? { connect: tagsToConnect } : undefined,

            isForked: true,
          },
          include: { tags: true },
        });

        res.status(201).json({
          message: "Template forked successfully.",
          template: forkedTemplate,
        });
      } catch (error) {
        console.error("Error forking template:", error);
        res.status(500).json({ message: "Failed to fork template." });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
