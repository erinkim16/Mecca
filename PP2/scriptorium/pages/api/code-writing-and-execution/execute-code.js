import * as utils from '../../../utils/code-writing-and-exec';

/**
 * This API endpoint is used to start a child process to execute code in a specified
 * langauge.
 * 
 * @param {string} req.body.code - The code to execute
 * @param {string} req.body.language - The language to execute the code in 
 * (Currently Supported: Python, Java, C, JavaScript, C++) 
 * @param {string} req.body.stdin - The input to pass to the code
 * @param {*} res
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Must be a POST request" });
    }

    let { code, language, stdin } = req.body;
    language = language.toLowerCase();


    // Check if the language is supported
    if (!utils.SUPPORTED_LANGUAGES.includes(language)) {
        return res.status(400).json({ error: "Invalid language" });
    }

    try {
        const output = await utils.executeCode(code, language, stdin);
        return res.status(200).json({ output });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}
