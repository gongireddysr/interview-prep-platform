"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

type Language = "javascript" | "python" | "java";

interface CodeEditorProps {
  onCodeChange?: (code: string, language: Language) => void;
  initialCode?: string;
  initialLanguage?: Language;
  readOnly?: boolean;
}

const languageConfig: Record<Language, { label: string; monacoLang: string; boilerplate: string }> = {
  javascript: {
    label: "JavaScript",
    monacoLang: "javascript",
    boilerplate: `// JavaScript Solution
function solution(input) {
  // Write your code here
  
  return result;
}

// Test your solution
console.log(solution([2, 7, 11, 15], 9));
`,
  },
  python: {
    label: "Python",
    monacoLang: "python",
    boilerplate: `# Python Solution
def solution(input):
    # Write your code here
    
    return result

# Test your solution
print(solution([2, 7, 11, 15], 9))
`,
  },
  java: {
    label: "Java",
    monacoLang: "java",
    boilerplate: `// Java Solution
public class Main {
    public static void main(String[] args) {
        // Write your code here
        
        System.out.println("Hello, World!");
    }
}
`,
  },
};

export default function CodeEditor({
  onCodeChange,
  initialCode,
  initialLanguage = "javascript",
  readOnly = false,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode || languageConfig[initialLanguage].boilerplate);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const newCode = languageConfig[newLang].boilerplate;
    setCode(newCode);
    setOutput("");
    setError(null);
    onCodeChange?.(newCode, newLang);
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange?.(newCode, language);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Execution failed");
        return;
      }

      if (data.stderr) {
        setError(data.stderr);
      }
      if (data.stdout) {
        setOutput(data.stdout);
      }
      if (!data.stdout && !data.stderr) {
        setOutput("(No output)");
      }
    } catch (err) {
      setError("Failed to execute code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector and Run Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {(Object.keys(languageConfig) as Language[]).map((lang) => (
              <option key={lang} value={lang}>
                {languageConfig[lang].label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRunCode}
          disabled={isRunning || readOnly}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <>
              <span className="animate-spin">⏳</span>
              Running...
            </>
          ) : (
            <>
              <span>▶</span>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Editor and Output Split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        {/* Code Editor */}
        <div className="lg:w-[60%] flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-2">Code</span>
          <div className="h-[280px] border border-border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={languageConfig[language].monacoLang}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                readOnly,
                padding: { top: 10, bottom: 10 },
              }}
            />
          </div>
        </div>

        {/* Console Output */}
        <div className="lg:w-[40%] flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-2">Console Output</span>
          <div className="h-[280px] bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto">
            {isRunning && (
              <div className="text-gray-400">
                <span className="animate-pulse">Executing code...</span>
              </div>
            )}
            {error && (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            )}
            {output && (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            )}
            {!isRunning && !error && !output && (
              <span className="text-gray-500">Click "Run Code" to see output</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
