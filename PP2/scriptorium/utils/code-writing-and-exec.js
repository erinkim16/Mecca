import { spawn, exec } from 'child_process';
import fs from 'fs';
import { get } from 'http';
import path from 'path';
import os from 'os';
import Docker from 'dockerode';

const docker = new Docker();
const SUPPORTED_LANGUAGES = ["python", "java", "javascript", "golang", "elixir", "perl", "php", "ruby", "rust", "swift"];
const TIMEOUT_TIME = 6000;
const MAX_RESOURCES = 10 * 1024 * 1024; // 10MB


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

async function executeCodeDocker(language, code, stdin) {
    const tempDir = path.join(process.cwd(), "..", "..", "temp_code");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  
    const { temp_file_dir, filename, relative_path } = getRandomTempFile();
    let file = filename;
    let fileName, imageName, command, fileExt;
  
    switch (language.toLowerCase()) {
      case 'python':
        imageName = 'my-python-env'; // Replace with your Python Docker image name
        fileExt = 'py';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | python3 ${fileName}`];
        break;
      case 'java':
        imageName = 'my-java-env'; // Replace with your Java Docker image name
        fileExt = 'java';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | javac ${fileName} && echo "${stdin}" | java ${file}`];
        // Find and replace main class (has to be the same as filename)
        code = code.replace(/public class Main/, "public class " + filename);
        break;
      case 'javascript':
        imageName = 'my-javascript-env'; 
        fileExt = 'js';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | node ${fileName}`];
        break;
      case 'golang':
        imageName = 'my-golang-env'; 
        fileExt = 'go';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | go run ${fileName}`];
        break;
      case 'elixir':
        imageName = 'my-elixir-env'; 
        fileExt = 'ex';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | elixir ${fileName}`];
        break;
      case 'perl':
        imageName = 'my-perl-env'; 
        fileExt = 'pl';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | perl ${fileName}`];
        break;
      case 'php':
        imageName = 'my-php-env'; 
        fileExt = 'php';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | php ${fileName}`];
        break;
      case 'ruby':
        imageName = 'my-ruby-env'; 
        fileExt = 'rb';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | ruby ${fileName}`];
        break;
      case 'rust':
        imageName = 'my-rust-env'; 
        fileExt = 'rs';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | cargo run ${fileName}`];
        break;
      case 'swift':
        imageName = 'my-swift-env'; 
        fileExt = 'swift';
        fileName = file + '.' + fileExt;
        command = ['sh', '-c', `echo "${stdin}" | swift ${fileName}`];
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  
    // Write the code to a file
    const filePath = path.join(tempDir, fileName);
    await fs.writeFileSync(filePath, code);
  
    // Run the Docker container
    try {
      const container = await docker.createContainer({
        Image: imageName,
        Cmd: command,
        Tty: false,
        HostConfig: {
          ReadonlyRootfs: true,
          NetworkMode: 'none',
          CapDrop: ['ALL'],
          Binds: [`${tempDir}:/app`],  // Make sure this is the correct path
          AutoRemove: true,
          Memory: MAX_RESOURCES,
          StdinOnce: true,
        },
        WorkingDir: '/app', // Ensure the working directory inside Docker is correct
      });
    
      await container.start();

  // Attach to the container's combined output stream
  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  });

  // Buffers to store the separate outputs
  var stdoutData = '';
  var stderrData = '';

  // Use Docker's demuxStream to separate stdout and stderr
  container.modem.demuxStream(stream, {
    write: (chunk) => {
      // Handle stdout data
      stdoutData += chunk.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    }
  }, {
    write: (chunk) => {
      // Handle stderr data
      stderrData += chunk.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    }
  });
    
  const timeout = TIMEOUT_TIME;

  const timeoutPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(async () => {
      console.warn('Container execution timeout, stopping container...');
      try {
        await container.kill(); // Stop the container if it takes too long
        stderrData = 'Code timed out after ' + TIMEOUT_TIME + 'ms';  // Set stderrData to 'timeout' instead of throwing an error
        resolve();  // Resolve the promise to prevent further processing
      } catch (err) {
        reject(err);  // Resolve the promise to avoid uncaught exceptions
      }
    }, timeout);
  
    // Clear the timeout if the container finishes execution in time
    container.wait().then(() => {
      clearTimeout(timer);
      resolve();  // Resolve the promise when the container finishes execution
    }).catch(() => {
      clearTimeout(timer);
      resolve();  // Resolve the promise if there's an error with container.wait()
    });
  });
  
  // Wait for either container to finish or timeout to trigger
  await Promise.race([
    container.wait(), // Wait for the container to finish execution
    timeoutPromise,   // Wait for the timeout
  ]);

    // Cleanup
    cleanUp(tempDir, filePath, filename, language);
    // Output the collected data
    // console.log('Standard Output:', stdoutData);
    // console.log('Standard Error:', stderrData);
  
    return {
      stdout: stdoutData,
      stderr: stderrData,
    };
  
    } catch (err) {
      console.log('Error executing code:', err);
      throw err;
    }
  }
  
// executeCodeDocker("python", `
// def main():
//     name = input()
//     age = int(input())
//     print(f"Hello, {name}! You are {age} years old.")

// if __name__ == "__main__":
//     main()
// `, 'Alessia\n20\n');
  
// executeCodeDocker("java", `
// import java.util.Scanner;

// public class Main {
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         String name = scanner.nextLine();
//         int age = Integer.parseInt(scanner.nextLine());
//         System.out.println("Hello, " + name + "! You are " + age + " years old.");
//     }
// }
// `, 'Alessia\n20\n');

// executeCodeDocker("javascript", `
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.on('line', (userInput) => {
//   console.log(\`Hello, \${userInput} from Node.js!\`);
//   rl.close();
// });`, 'Alessia\n');
  
// executeCodeDocker("golang", `package main

// import "fmt"

// func main() {
//     fmt.Print("Enter text: ")
//     var input string
//     fmt.Scanln(&input)
//     fmt.Print(input)
// }`, 'Alessia\n');

// executeCodeDocker("python", `import os
// import socket

// # Test if the system can connect to an external server (Internet connectivity)
// try:
//     print("Testing Internet Access...")
//     socket.create_connection(("www.google.com", 80), timeout=1)
//     internet_access = True
// except socket.error:
//     internet_access = False

// print("Internet Access: ", internet_access)

// try:
//     with open("C:/Windows/System32/drivers", "r") as f:
//         print(f.read())
// except Exception as e:
//     print(f"Access denied: {e}")
// `, "");

// executeCodeDocker("python", `print("Hello, World!")`, "");

// executeCodeDocker("python", `while True:
//     pass`, "");

function cleanUp(tempDir, filePath, filename, language) {
    fs.rmSync(filePath);

    if (language === "java") {
        fs.rmSync(path.join(tempDir, filename) + ".class");
    }
}

export { SUPPORTED_LANGUAGES, executeCode, executeCodeDocker };
