import { useEffect, useState } from "react";
import LanguageDropdown from "./language-dropdown";
import TagInput from "../general/tag-input";
import axios from "axios";

interface ExecSettingsProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  code: string; // The code content passed as a prop
  setCode: React.Dispatch<React.SetStateAction<string>>;
  templateInfo: {
    explanation: string;
    title: string;
    tags: string[];
    id: number;
  };
}

export default function ExecSettings(props: ExecSettingsProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stdin, setStdin] = useState("");
  // Define the state for tags and input value
  const [tags, setTags] = useState<string[]>([""]);
  const [input, setInput] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Hide and Show Certain Elements
  // TODO

  // Sync state with props when templateInfo changes
  useEffect(() => {
    console.log(props.templateInfo);
    setTitle(props.templateInfo.title);
    setDescription(props.templateInfo.explanation);
    // @ts-ignore comment  // @ts-ignore comment
    var extractedTags = props.templateInfo.tags.map((tag) => tag.name);
    // Now extractedTags will be an array of strings, e.g., ["demo"]
    setTags(extractedTags);
  }, [props.templateInfo]); // Dependency array ensures this runs when templateInfo changes

  const executeAndUpdateOut = async () => {
    // Clear what's currently outputted
    setOutput("");
    setError("");

    // New outputs
    var codeOutput = await executeCode(props.code, props.language, stdin);

    if (codeOutput.error) {
      setError(codeOutput.error.toString());
    }

    if (codeOutput.output) {
      setOutput(codeOutput.output.toString());
    }
  };

  const saveCode = async () => {
    // TODO: for Erin's backend
    // How to access things youll need to save
    let code = props.code;
    let language = props.language;
    // tags, title and description can be accessed like this (thats literally the variable names)

    // const data = await response.json();
    const token = localStorage.getItem("accessToken"); // Or use cookies
    console.log(token);

    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    var response;
    if (props.templateInfo.id) {
      try {
        response = await axios.put(
          `/api/templates/${props.templateInfo.id}`,
          {
            codeContent: code,
            language: language,
            title: title,
            explanation: description,
            tags: tags,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Code edited successfully!");
        } else {
          alert("Failed to edit code.");
        }
      } catch (error) {
        // @ts-ignore
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          // @ts-ignore
          if (error.response.status === 401) {
            alert("Failed to edit code: Unauthorized");
          } 
          // @ts-ignore
          else if (error.response.status === 400) {
            alert("Failed to edit code: please provide all fields.");
          } 
        } else {
          // Something else happened during the request
          // @ts-ignore
          alert("Error: " + error);
        }
      }
    }
      
    else {
      try {
        response = await axios.post(
          `/api/templates`,
          {
            codeContent: code,
            language: language,
            title: title,
            explanation: description,
            tags: tags,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Code saved successfully!");
        } else {
          alert("Failed to save code.");
        }
  
      } catch (error) {
        // @ts-ignore
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          // @ts-ignore
          if (error.response.status === 401) {
            alert("Failed to edit code: Unauthorized");
          } 
          // @ts-ignore
          if (error.response.status === 400) {
            alert("Please provide all necessary fields");
          } 
        } else {
          // Something else happened during the request
          // @ts-ignore
          alert("Error: " + error);
        }
      }
      
    }
  };

  const forkCode = async () => {
    // TODO:for Erin's backend
    let code = props.code;
    let language = props.language;
    const id = props.templateInfo.id;

    // // tags, title and description can be accessed like this (thats literally the variable names)
    const token = localStorage.getItem("accessToken"); // Or use cookies
    console.log(token);
    if (!token) {
      alert("Login to fork code");
      return;
    }

    const response = await axios.post(
      `/api/templates/${id}`,
      {
        codeContent: code,
        language: language,
        title: "Fork of " + title,
        explanation: description,
        tags: tags,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      setTitle("Fork of " + title);
      alert("Code forked successfully!");
    } else {
      alert("Failed to fork code.");
    }
  };

  return (
    <>
      {/* DB Settings */}
      <div>
        <label> Title </label>
        <input
          placeholder="Type your title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>

        <label> Description </label>
        <input
          placeholder="Type your description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>

        <label>Tags</label>
        <TagInput
          tags={tags}
          setTags={setTags}
          input={input}
          setInput={setInput}
        />
      </div>

      <div className="flex flex-row items-center justify-center">
        <LanguageDropdown
          language={props.language}
          setLanguage={props.setLanguage}
        />
        <button className="m-4" onClick={() => executeAndUpdateOut()}>
          Run
        </button>
        <button
          className="m-4 bg-accent border-accentDark"
          onClick={() => saveCode()}
        >
          Save
        </button>
        <button
          className="m-4 bg-accent border-accentDark"
          onClick={() => forkCode()}
        >
          Fork
        </button>
      </div>

      {/* Input and Output Fields */}
      <div className="flex flex-col w-full">
        <label htmlFor="input">Input (One Input Per Line):</label>
        <textarea
          id="input"
          className="w-full"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        ></textarea>

        <label htmlFor="output">Output:</label>
        <div id="output" className="w-full break-words whitespace-pre-line">
          <p className="exec-output">{output}</p>

          {error && <p className="exec-error mt-2 break-words whitespace-pre-line">{error}</p>}
        </div>
      </div>
    </>
  );
}

async function executeCode(
  code: string,
  language: string,
  stdin: string
): Promise<{ output: string; error: string }> {
  const response = fetch("/api/code-writing-and-execution/execute-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, stdin }),
  });

  var data: { output: string; error: string } = await (await response).json();

  return data;
}
