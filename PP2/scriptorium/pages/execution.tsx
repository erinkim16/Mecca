import React, { useEffect, useState } from "react";

import CodeArea from "../components/execution/code-area"
import LanguageDropdown from "../components/execution/language-dropdown"

export default function Execution() {
    const [code, setCode] = useState("");
    const [stdin, setStdin] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");

    const executeAndUpdateOut = async () => {
        var output = await executeCode(code, language, stdin);
        setOutput(output);
    };

    
    return (
        <>
        <LanguageDropdown language={language} setLanguage={setLanguage}/>

        <button onClick={() => executeAndUpdateOut()}>Run</button>

        <label>Input:</label>
        <input type="text" value={stdin} onChange={(e) => setStdin(e.target.value)}/>

        <label>Output:</label>
        <div id="output"> 
            <p></p>
        </div>

        <CodeArea language={language} code={code} setCode={setCode}/>
        </> 
    )
}

async function executeCode(code: string, language: string, stdin: string): Promise<string> {
    // const response = fetch("/api/code-writing-and-execution/execute-code", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ code, language, stdin }),
    // });

    // const data = (await response).json();
    // return data.output;
    return "";
}   