import React, { useEffect, useState } from "react";

import CodeArea from "../components/execution/code-area"
import ExecSettings from "../components/execution/exec-settings"

export default function Execution() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [codeWidth, setCodeWidth] = useState("60vw");
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        const handleResize = () => {
          const currentWidth = window.innerWidth;
    
          if (currentWidth <= 768) {
            setCodeWidth("90vw");
            setFontSize(16);
          } else {
            setCodeWidth("60vw");
            setFontSize(18);
          }
        };
    
        // Run once initially to set the correct width
        handleResize();
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []); // Empty dependency array ensures this runs only once
    
    return (
        <div className="flex items-center justify-center m-2 flex-col md:flex-row">

            <div className="m-4">
                <CodeArea fontSize={fontSize} width={codeWidth} language={language} code={code} setCode={setCode}/>   
            </div>

            <div className="exec-options m-4">
                <ExecSettings language={language} setLanguage={setLanguage} code={code} setCode={setCode}/>
            </div>
  
        </div> 
    )
}

