import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (fileName.endsWith(".pdf")) {
      // Parse PDF
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (fileName.endsWith(".docx")) {
      // Parse DOCX
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: buffer });
      text = result.value || "";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF or DOCX." },
        { status: 400 }
      );
    }

    // Clean up the text
    const cleanedText = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error("Error parsing resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to parse resume", details: errorMessage },
      { status: 500 }
    );
  }
}
