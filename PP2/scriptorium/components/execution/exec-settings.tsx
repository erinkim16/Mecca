import { useState } from "react";
import LanguageDropdown from "./language-dropdown";
import TagInput from "./tag-input";

interface ExecSettingsProps {
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    code: string; // The code content passed as a prop
    setCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function ExecSettings(props: ExecSettingsProps) {
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [stdin, setStdin] = useState("");

    // Hide and Show Certain Elements
    // TODO

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
    
    return <>  

        {/* DB Settings */}
        <div>
            <label > Title </label>
            <input placeholder="Type your title here..."></input>

            <label> Description </label>
            <input placeholder="Type your description here..."></input>

            <label>Tags</label>
            <TagInput />
        </div>

        <div className="flex flex-row items-center justify-center">
            <LanguageDropdown language={props.language} setLanguage={props.setLanguage}/>
            <button className="m-4" onClick={() => executeAndUpdateOut()}>Run</button>
            <button className="m-4 bg-accent border-accentDark">Save</button>
            <button className="m-4 bg-accent border-accentDark">Fork</button>
        </div>

        {/* Input and Output Fields */}
        <div className="flex flex-col w-full">
            <label htmlFor="input">Input:</label>
            <input
                id="input"
                type="text"
                className="w-full"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
            />

            <label htmlFor="output">Output:</label>
            <div id="output" className="w-full">
                <p className="exec-output">{output}</p>

                {error && (
                    <p className="exec-error mt-2">{error}</p>
                )}
            </div>
        </div>
           
    </>;
}

async function executeCode(code: string, language: string, stdin: string): Promise<{ output: string, error: string }> {
    const response = fetch("/api/code-writing-and-execution/execute-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, stdin }),
    });

    var data: { output: string, error: string } = await (await response).json();

    return data;
}   