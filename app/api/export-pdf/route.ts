import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { rateLimit } from "@/lib/rate-limit";

function toHtml(agreement: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            max-width: 8.5in;
            margin: 0 auto;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 30px;
            text-align: center;
            font-weight: bold;
          }
          h2 {
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          p {
            margin: 10px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        ${agreement
          .split("\n")
          .map((line) => {
            if (/^\d+\.\s/.test(line)) {
              return `<h2>${line}</h2>`;
            }
            if (line.trim() === "") {
              return "<p></p>";
            }
            return `<p>${line
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</p>`;
          })
          .join("\n")}
      </body>
    </html>
  `;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip + ":pdf", 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let browser;
  try {
    const { agreement } = await req.json();

    if (!agreement || typeof agreement !== "string" || agreement.length > 100_000) {
      return NextResponse.json(
        { error: "Invalid agreement" },
        { status: 400 }
      );
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(toHtml(String(agreement)), {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    return new NextResponse(pdf as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="cohabitation-agreement.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    if (browser) {
      await browser.close().catch(() => {});
    }
    return NextResponse.json(
      { error: "Failed to generate PDF. Ensure puppeteer dependencies are installed." },
      { status: 500 }
    );
  }
}
