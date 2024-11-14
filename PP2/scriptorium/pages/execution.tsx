import React, { useEffect, useState } from "react";

import CodeArea from "../components/execution/code-area"
import LanguageDropdown from "../components/execution/language-dropdown"
import { JsonObject } from "@prisma/client/runtime/library";

export default function Execution() {
    const [code, setCode] = useState("");
    const [stdin, setStdin] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const executeAndUpdateOut = async () => {
        // Clear what's currently outputted
        setOutput("");
        setError("");

        // New outputs
        var codeOutput = await executeCode(code, language, stdin);

        if (codeOutput.error) {
            setError(codeOutput.error.toString());
        }

        if (codeOutput.output) {
            setOutput(codeOutput.output.toString());
        }
    };

    
    return (
        <div className="flex items-center justify-center">

            <div className="m-4">
            <CodeArea language={language} code={code} setCode={setCode}/>   
            </div>

            <div className="exec-options m-4">
            <LanguageDropdown language={language} setLanguage={setLanguage}/>

            <button className="m-4" onClick={() => executeAndUpdateOut()}>Run</button>

            <label>Input:</label>
            <input type="text" value={stdin} onChange={(e) => setStdin(e.target.value)}/>

            <label>Output:</label>

            <div id="output"> 
                <p>{output}</p>

                {error && (
                    <p>{error}</p>
                )}
            </div>    

            </div>
  
        </div> 
    )
}

async function executeCode(code: string, language: string, stdin: string): Promise<JsonObject> {
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