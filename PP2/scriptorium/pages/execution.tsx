import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CodeArea from "../components/execution/code-area";
import ExecSettings from "../components/execution/exec-settings";
import NavBar from "@/components/general/nav-bar";
import axios from "axios";

export default function Execution() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [codeWidth, setCodeWidth] = useState("60vw");
  const [fontSize, setFontSize] = useState(16);
  const [templateInfo, setTemplateInfo] = useState({
    explanation: "",
    title: "",
    tags: [],
    id: 0,
  });

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/templates/${id}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        .then((response) => {
          setCode(response.data.code.content);
          setLanguage(response.data.code.language);
          // @ts-ignore
          setTemplateInfo({
            title: response.data.title,
            explanation: response.data.explanation,
            tags: response.data.tags,
            // @ts-ignore
            id: parseInt(id),
          });
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]); // Dependency array ensures this runs only when 'id' changes

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
    <>
      <NavBar></NavBar>
      <div className=" flex items-center justify-center w-full flex-col md:flex-row p-4">
        <div className="p-2">
          <CodeArea
            fontSize={fontSize}
            width={codeWidth}
            language={language}
            code={code}
            setCode={setCode}
          />
        </div>

        <div className="exec-options p-2 w-full md:flex-1">
          <ExecSettings
            templateInfo={templateInfo}
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        </div>
      </div>
    </>
  );
}
