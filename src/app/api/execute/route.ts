import { NextRequest, NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const languageVersions: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const langConfig = languageVersions[language];
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            name: language === "java" ? "Main.java" : `main.${language === "python" ? "py" : "js"}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Piston API error:", errorText);
      return NextResponse.json(
        { error: "Code execution service unavailable" },
        { status: 503 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      stdout: result.run?.stdout || "",
      stderr: result.run?.stderr || "",
      exitCode: result.run?.code || 0,
    });
  } catch (error) {
    console.error("Execute API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
