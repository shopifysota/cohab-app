import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip + ":docx", 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { agreement } = await req.json();

    if (!agreement || typeof agreement !== "string" || agreement.length > 100_000) {
      return NextResponse.json(
        { error: "Invalid agreement" },
        { status: 400 }
      );
    }

    const lines = String(agreement).split("\n");
    
    const children = lines.map((line, index) => {
      // Make the first line (title) larger
      if (index === 0) {
        return new Paragraph({
          children: [new TextRun({ text: line, size: 32, bold: true })],
          spacing: { after: 240 },
        });
      }
      
      // Style section headers (lines ending with numbers followed by period)
      if (/^\d+\.\s/.test(line)) {
        return new Paragraph({
          children: [new TextRun({ text: line, size: 26, bold: true })],
          spacing: { before: 120, after: 120 },
        });
      }

      return new Paragraph({
        children: [new TextRun({ text: line || "", size: 22 })],
        spacing: { after: 160 },
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          'attachment; filename="cohabitation-agreement.docx"',
      },
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}
