import { useState } from "react";
import LanguageDropdown from "./language-dropdown";

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
        <LanguageDropdown language={props.language} setLanguage={props.setLanguage}/>

        <button className="m-4" onClick={() => executeAndUpdateOut()}>Run</button>

        <label>Input:</label>
        <input type="text" value={stdin} onChange={(e) => setStdin(e.target.value)}/>

        <label>Output:</label>

        <div id="output"> 
            <p className="exec-output">{output}</p>

            {error && (
                <p className="exec-error mt-2">{error}</p>
            )}
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