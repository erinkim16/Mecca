import MonacoEditor from "@monaco-editor/react";
import {useEffect, useState} from "react";

interface CodeAreaProps {
    language?: string;
    height?: string;
    width?: string;
    fontSize?: number;
    code: string; // The code content passed as a prop
    setCode: React.Dispatch<React.SetStateAction<string>>;
}


export default function CodeArea(props: CodeAreaProps) {
    const [monacoLanguage, setMonacoLanguage] = useState<string>("");
    // TODO -> set default code to correspond to simple language-specifc code

    useEffect(() => {
        if (props.language === "golang") {
            setMonacoLanguage("go");
        }
        else {
            setMonacoLanguage(props.language?.toLowerCase() || "");
        }
    }, [props.language]);


    return (
        <>
        <MonacoEditor
            height={props.height}
            width={props.width}
            language={monacoLanguage}
            theme="vs-dark"
            value={props.code}
            onChange={(value) => props.setCode(value || "")}
            options={{
                fontSize: props.fontSize
            }}
        />
        </>
    );
}

CodeArea.defaultProps = {
    height: "80vh",
    width: "60vw",
    fontSize: 16
};

