import React, { useEffect, useState } from "react";

import CodeArea from "../components/execution/code-area"
import ExecSettings from "../components/execution/exec-settings"

export default function Execution() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    
    return (
        <div className="flex items-center justify-center">

            <div className="m-4">
                <CodeArea language={language} code={code} setCode={setCode}/>   
            </div>

            <div className="exec-options m-4">
                <ExecSettings language={language} setLanguage={setLanguage} code={code} setCode={setCode}/>
            </div>
  
        </div> 
    )
}

