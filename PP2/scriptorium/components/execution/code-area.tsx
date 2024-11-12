import React, { useState, useEffect, useRef } from "react";

import MonacoEditor from "@monaco-editor/react";

export default function CodeArea() {
    const [code, setCode] = useState("");

    return (
        <MonacoEditor
            height="400px"
            language="javascript"
            theme="vs-light"
            value={code}
            onChange={(value) => setCode(value || "")}
        />
    );
}
