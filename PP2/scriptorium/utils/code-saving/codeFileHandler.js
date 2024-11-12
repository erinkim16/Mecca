import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique file names

/**
 * Saves code content to a file and returns the relative file path.
 * @param {Number} userId - ID of the user saving the code.
 * @param {Number} templateId - ID of the code template (can be null for initial save).
 * @param {String} codeContent - Code content to be saved.
 * @param {String} language - Programming language of the code.
 * @returns {String} - Relative file path where code is stored.
 */

// assuming language is always lower case, in frontend will have a dropdown menu of selections

export function saveCodeFile(userId, templateId, codeContent, language) {
  const codeDir = path.join(process.cwd(), "code_files", `user_${userId}`);
  try {
    if (!fs.existsSync(codeDir)) {
      fs.mkdirSync(codeDir, { recursive: true });
    }

    const ext = getExtensionForLanguage(language);

    const uniqueSuffix = templateId ? `${templateId}_${Date.now()}` : uuidv4();
    const filePath = path.join(codeDir, `code_${uniqueSuffix}.${ext}`);

    fs.writeFileSync(filePath, codeContent);
    return filePath; // Return valid file path
  } catch (error) {
    console.error("Error saving code file:", error);
    return null; // Return null to indicate failure
  }
}

/**
 * Gets file extension based on programming language.
 * @param {String} language - Programming language name.
 * @returns {String} - File extension.
 */
export function getExtensionForLanguage(language) {
  switch (language.toLowerCase()) {
    case "c":
      return "c";
    case "c++":
      return "cpp";
    case "java":
      return "java";
    case "python":
      return "py";
    case "javascript":
      return "js";
    default:
      return "txt";
  }
}
