import MonacoEditor from "@monaco-editor/react";

interface CodeAreaProps {
    language?: string;
    height?: string;
    width?: string;
    code: string; // The code content passed as a prop
    setCode: React.Dispatch<React.SetStateAction<string>>;
}


export default function CodeArea(props: CodeAreaProps) {
    // TODO -> set default code to correspond to simple language-specifc code

    return (
        <MonacoEditor
            height={props.height}
            width={props.width}
            language={props.language?.toLowerCase()}
            theme="vs-dark"
            value={props.code}
            onChange={(value) => props.setCode(value || "")}
        />
    );
}

CodeArea.defaultProps = {
    height: "80vh",
    width: "60vw",
};

