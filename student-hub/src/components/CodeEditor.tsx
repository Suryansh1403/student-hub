"use client"
import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {  useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import CodeSubmit from "./CodeSubmit";
import { QuestionWithExamples } from "@/lib/types";

const CodeEditor = ({ questionId, userId,roomId,question }:{questionId:string,userId:string,roomId:string,question:QuestionWithExamples}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [isLoaded, setIsLoaded] = useState(false); 

  const LOCAL_STORAGE_KEY = `code-${questionId}-${userId}`;

  const [defaultCode, setDefaultCode] = useState("");

  useEffect(() => {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      setDefaultCode(local);
      setIsLoaded(true);
    } else {
      // Fetch from API if not in localStorage
      axios
        .get(`/api/code/get?questionId=${questionId}&userId=${userId}&roomId=${roomId}`)
        .then((res) => {
          setDefaultCode(res.data.code || "");
          localStorage.setItem(LOCAL_STORAGE_KEY, res.data.code || "");
        })
        .catch(() => {
          setDefaultCode("");
        })
        .finally(() => setIsLoaded(true));
    }
  }, [questionId, userId]);

  const debouncedSave = useDebouncedCallback(() => {
    const value = editorRef.current?.getValue();
    if (!value) return;

    // Save to localStorage
    
    localStorage.setItem(LOCAL_STORAGE_KEY, value);

    // Save to API
    axios.post("/api/code/save", {
      userId,
      questionId,
      code: value,
      roomId:roomId
    });
  }, 1000); // 1 second delay

  const handleEditorMount = (editor:monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  if (!isLoaded) return <p>Loading editor...</p>;

  return (
    <>
    <MonacoEditor
      height="500px"
      language="javascript"
      theme="vs-dark"
      defaultValue={defaultCode}
      onMount={handleEditorMount}
      onChange={debouncedSave}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
      }}
    />
<CodeSubmit question={question} localKey={LOCAL_STORAGE_KEY}/>
    </>

  );
};

export default CodeEditor;
