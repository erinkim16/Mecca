import React, { useState, useEffect, useRef } from "react";

import MonacoEditor from "@monaco-editor/react";

interface CodeAreaProps {
    language?: string;
    height?: string;
    width?: string;
}

export default function CodeArea(props: CodeAreaProps) {
    // TODO -> set default code to correspond to simple language-specifc code
    const [code, setCode] = useState("");

    return (
        <MonacoEditor
            height={props.height}
            width={props.width}
            language={props.language?.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
        />
    );
}

CodeArea.defaultProps = {
    language: "python",
    height: "80vh",
    width: "60vw"
};

