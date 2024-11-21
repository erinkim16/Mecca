import { spawn, exec } from 'child_process';
import fs from 'fs';
import { get } from 'http';
import path from 'path';
import os from 'os';
import Docker from 'dockerode';

const docker = new Docker();
const SUPPORTED_LANGUAGES = ["python", "java", "c", "javascript", "c++"];
const TIMEOUT_TIME = 3000;
const MAX_RESOURCES = 50; // 50 MB


/** Executes code in a specified language
 * 
 * @param {string} code - The code to execute (as backticked `...` plaintext)
 * @param {string} language - The language to execute the code in
 * @param {string} stdin  - The input to pass to the code
 * @returns - code output
 */
async function executeCode(code, language, stdin) {
    var process;

    switch (language) {
        case "python":
            process = spawn('python3', ['-c', code]);
            break;

        case "java":
            var { temp_file_dir, filename, relative_path } = await compileJavaCode(code);
            process = spawn('java', ['-cp', temp_file_dir, filename]);
            break;

        case "c":
            var { temp_file_dir, filename, relative_path } = await compileCCode(code);
            process = spawn(relative_path);
            break;

        case "javascript":
            process = spawn('node', ['-e', code]);
            break;

        case "c++":
            var { temp_file_dir, filename, relative_path } = await compileCppCode(code);
            process = spawn(relative_path);
            break;

        default:
            throw new Error("Unsupported language");
    }

    // Write stdin if provided
    if (stdin) {
        process.stdin.write(stdin, () => {
            process.stdin.end();
        });
    } else {
        process.stdin.end(); 
    }

    let output = await getExecOutput(process);

    // Clean up temporary files
    try {
        if (language === "java") {
            fs.unlinkSync(relative_path+".java");
            fs.unlinkSync(relative_path+".class");
        } else if (language === "c") {
            // C code has a different executable on windows
            if (os.platform() == 'win32'){
                fs.chmodSync(relative_path+".exe", '0777');
                fs.unlinkSync(relative_path+".exe");
            } else{
                fs.chmodSync(relative_path, '0777');
                fs.unlinkSync(relative_path);
            }

            fs.chmodSync(relative_path+".c", '0777');
            fs.unlinkSync(relative_path+".c");
        } else if (language === "c++") {
            fs.chmodSync(relative_path, '0777');
            fs.unlinkSync(relative_path);
            fs.chmodSync(relative_path+".cpp", '0777');
            fs.unlinkSync(relative_path+".cpp");
        }

    } catch (error) {
        console.log(error);
    }
    
    return output;
}


/** Get the output of a process and handle timeout/errors
 * 
 * Citation: ChatGPT utilized for bug fixes in this function.
 * 
 * @param {*} process - The process to get the output of
 * @returns {*} promise of output
 */
function getExecOutput(process) {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        // Collect stdout data
        process.stdout.on('data', (data) => {
            stdout += data.toString() + '\n';
        });

        // Collect stderr data
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Wait for the process to finish
        process.on('close', (code) => {
            clearTimeout(timeoutId); // Clear the timeout

            if (code !== 0) {
                return reject(`Process exited with code ${code}: ${stderr}`);
            }

            resolve(stdout);
        });

        // Kill process after timeout
        const timeoutId = setTimeout(() => {
            process.kill('SIGTERM'); 
            reject("Process timed out");
        }, TIMEOUT_TIME);
    });
}


/** Java requires code to be compiled first before running the process; this function
 * compiles the code and returns the temp_file_dir, filename, and relative_path to 
 * be utilized in the executeCode function. NOTE: Java code is wrapped in a main appropriate 
 * main class, do not add "public class <name> {...}" before code.
 * 
 * @param {string} code - The Java code to compile (as backticked `...` plaintext).
 * @returns temp_file_dir, filename, relative_path as dictionary
 */
async function compileJavaCode(code) {

    const { temp_file_dir, filename, relative_path } = getRandomTempFile();

    // Find and replace main class (has to be the same as filename)
    code = code.replace(/public class Main/, "public class " + filename);

    console.log(code);
    
    await new Promise((resolve, reject) => {
        fs.writeFile(relative_path+".java", code, (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("File write successful");
            resolve();
          }
        });
    });
      
    // Compile the code
    await new Promise((resolve, reject) => {
        exec(`javac "${relative_path}.java"`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Compilation successful");
                resolve();
            }
        });
    });

    return { temp_file_dir, filename, relative_path };
}

/** Compiles C code and returns the necessary info to execute it.
 * 
 * NOTE: Assume C has full proper structure. I.e. wrap with main and include any headers.
 * @param {*} code - The C code to compile (as backticked `...` plaintext).
 * @returns temp_file_dir, filename, relative_path as dictionary
 */
async function compileCCode(code) {
    const { temp_file_dir, filename, relative_path } = getRandomTempFile();

    console.log(relative_path);

    // Make temporary C file
    await new Promise((resolve, reject) => {
        fs.writeFile(relative_path+".c", code, (err) => {
          if (err) {
            console.log("Failed to write to file");
            console.log(err);
            reject(err);
          } else {
            console.log("File write successful");
            resolve();
          }
        });
    });

    // Compile the code
    await new Promise((resolve, reject) => {
        exec(`gcc "${relative_path}.c" -o "${relative_path}"`, (err, stdout, stderr) => {
            if (err) {
                console.log("Failed to compile code");
                console.log(err);
                reject(err);
            } else {
                console.log("Compilation successful");
                resolve();
            }
        });
    });

    return { temp_file_dir, filename, relative_path };
}

/** Compiles C++ code and returns the necessary info to execute it.
 * 
 * NOTE: Assume C++ has full proper structure. 
 * @param {*} code - The C++ code to compile (as backticked `...` plaintext).
 * @returns temp_file_dir, filename, relative_path as dictionary
 */
async function compileCppCode(code) {
    const { temp_file_dir, filename, relative_path } = getRandomTempFile();

    // Make temporary C file
    await new Promise((resolve, reject) => {
        fs.writeFile(relative_path+".cpp", code, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });

    // Compile the code
    await new Promise((resolve, reject) => {
        exec(`g++ "${relative_path}.cpp" -o "${relative_path}"`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return { temp_file_dir, filename, relative_path };
}


/** Gets a random temp file name and returns necessary paths
 * 
 * @returns temp_file_dir, filename, relative_path as dictionary
 */
function getRandomTempFile() {
    const basePath = path.join('utils', 'code-writing-and-exec.js');
    const dirname = path.dirname(basePath);
    const filename = Array(8).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const temp_file_dir = path.join(dirname, 'temp-compiled-files');
    const relative_path = path.join(temp_file_dir, filename);

    return { temp_file_dir, filename, relative_path };
}

async function executeCodeDocker(code, language, stdin) {
  try {
    // Map languages to Docker images
    const imageMap = {
      python: 'my-python-env',
      java: 'my-java-env',
      // Add more languages as needed
    };
    const image = imageMap[language];

    if (!image) {
      return res.status(400).json({ error: 'Language not supported.' });
    }

    const absolutePath = path.join(process.cwd(), 'PP2', 'scriptorium', 'utils', 'temp-compiled-files');
    console.log(absolutePath);
    var dockerPath = absolutePath.replace(/\\/g, '/');
    console.log(dockerPath);

    // Create and start a Docker container to execute the code
    const container = await docker.createContainer({
      Image: image,
      Tty: false,
      Cmd: ["python3", "your_code2.py"], // Adjust command per language
      Binds: [`${dockerPath}:/app`], // Bind current directory
      HostConfig: {
        AutoRemove: true,
        Memory: 512 * 1024 * 1024, // Memory limit
        CpuShares: 1024, // CPU limit
      },
    });

    await container.start();

    // Attach to the container's output stream
    const stream = await container.attach({ stream: true, stdout: true, stderr: true });
    let output = '';

    // Listen for data from the container's output
    stream.on('data', (chunk) => {
        // Convert chunk to string and remove non-printable characters using regex
        output += chunk.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    });

    // Wait for the container to stop
    await container.wait();

    // Log the output after the container stops
    console.log(output);
  } catch (error) {
    console.error(error);
  }
}


executeCodeDocker("temp", "python", "temp");

export { SUPPORTED_LANGUAGES, executeCode, executeCodeDocker };
