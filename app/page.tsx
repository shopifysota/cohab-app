import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  ArrowRight,
  ArrowLeft,
  Download,
  Sparkles,
  CheckCircle2,
  Loader2,
  Rocket,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const steps = ["Partners", "Home", "Money", "Property", "Separation", "Review"];

const initialForm = {
  partnerOne: "",
  partnerTwo: "",
  address: "",
  stateOrCountry: "",
  moveInDate: "",
  rentMortgageSplit: "",
  utilitiesSplit: "",
  bankAccounts: "Separate unless otherwise agreed in writing",
  existingProperty: "Each party keeps property they owned before moving in together",
  sharedProperty: "Items purchased together are jointly owned unless otherwise agreed in writing",
  debts: "Each party remains solely responsible for debts in their own name",
  pets: "The parties will decide pet care cooperatively; ownership remains with the adopting party unless otherwise agreed",
  breakupTerms:
    "If the relationship ends, one party may move out upon reasonable written notice, and jointly owned items will be divided by mutual agreement or sold and the proceeds split equally.",
  disputeResolution: "The parties will attempt to resolve disputes through good-faith discussion before mediation.",
  extraTerms: "",
};

function SectionHeader({ title, description }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function buildLocalAgreement(form) {
  const today = new Date().toLocaleDateString();
  return `COHABITATION AGREEMENT\n\nThis Cohabitation Agreement (the "Agreement") is made between ${form.partnerOne || "[Partner One]"} and ${form.partnerTwo || "[Partner Two]"} on ${today}.\n\n1. PURPOSE\nThe parties wish to define their respective rights and responsibilities while living together at ${form.address || "[Address]"}, ${form.stateOrCountry || "[State/Country]"}. Their intended move-in date is ${form.moveInDate || "[Move-in date]"}.\n\n2. FINANCIAL ARRANGEMENTS\nRent / Mortgage: ${form.rentMortgageSplit || "[Describe split]"}.\nUtilities / Household Bills: ${form.utilitiesSplit || "[Describe split]"}.\nBank Accounts: ${form.bankAccounts || "[Describe arrangement]"}.\n\n3. PROPERTY\nPre-existing Property: ${form.existingProperty || "[Describe treatment of existing property]"}.\nShared Property: ${form.sharedProperty || "[Describe treatment of jointly acquired property]"}.\n\n4. DEBTS\n${form.debts || "[Describe debt responsibility]"}.\n\n5. PETS\n${form.pets || "[Describe pet arrangements]"}.\n\n6. SEPARATION OR MOVE-OUT\n${form.breakupTerms || "[Describe what happens if the relationship ends]"}.\n\n7. DISPUTE RESOLUTION\n${form.disputeResolution || "[Describe dispute resolution method]"}.\n\n8. ADDITIONAL TERMS\n${form.extraTerms || "None."}\n\n9. GENERAL\nThis Agreement reflects the parties' present intentions regarding shared living arrangements. The parties understand laws vary by jurisdiction and should seek independent legal advice before signing or relying on this document.\n\nSigned:\n\n______________________________\n${form.partnerOne || "[Partner One]"}\n\n______________________________\n${form.partnerTwo || "[Partner Two]"}\n`;
}

function AgreementPreview({ content }) {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground font-sans">{content}</pre>
    </div>
  );
}

const nextRouteCode = `// app/api/generate/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function promptFromForm(form: any) {
  return ` + "`" + `You are a careful legal-document drafting assistant.
Draft a plain-English cohabitation agreement using the structured facts below.
Keep a formal tone, use numbered sections, avoid inventing facts,
and include a short note that local law varies and legal review is recommended.

Partner One: ${form.partnerOne}
Partner Two: ${form.partnerTwo}
Address: ${form.address}
Jurisdiction: ${form.stateOrCountry}
Move-in date: ${form.moveInDate}
Rent/Mortgage split: ${form.rentMortgageSplit}
Utilities split: ${form.utilitiesSplit}
Bank accounts: ${form.bankAccounts}
Existing property: ${form.existingProperty}
Shared property: ${form.sharedProperty}
Debts: ${form.debts}
Pets: ${form.pets}
Breakup terms: ${form.breakupTerms}
Dispute resolution: ${form.disputeResolution}
Additional terms: ${form.extraTerms}` + "`" + `;
}

export async function POST(req: Request) {
  try {
    const { form } = await req.json();

    const response = await client.responses.create({
      model: "gpt-5",
      input: promptFromForm(form),
    });

    const agreement = response.output_text;

    return NextResponse.json({ agreement });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate agreement." },
      { status: 500 }
    );
  }
}`;

const docxRouteCode = `// app/api/export-docx/route.ts
import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function POST(req: Request) {
  try {
    const { agreement } = await req.json();

    const lines = String(agreement).split("\\n");
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map((line) =>
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 160 },
            })
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="cohabitation-agreement.docx"',
      },
    });
  } catch {
    return NextResponse.json({ error: "DOCX export failed." }, { status: 500 });
  }
}`;

const pdfRouteCode = `// app/api/export-pdf/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

function toHtml(agreement: string) {
  return ` + "`" + `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; white-space: pre-wrap;">
        ${agreement
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}
      </body>
    </html>
  ` + "`" + `;
}

export async function POST(req: Request) {
  try {
    const { agreement } = await req.json();
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(toHtml(String(agreement)), { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cohabitation-agreement.pdf"',
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF export failed." }, { status: 500 });
  }
}`;

const stripeRouteCode = `// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Cohabitation Agreement",
          },
          unit_amount: 999,
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000?success=true",
    cancel_url: "http://localhost:3000?canceled=true",
  });

  return NextResponse.json({ url: session.url });
}`;

const launchSteps = [
  "Create a Next.js app with Tailwind and shadcn/ui.",
  "Put this page in app/page.tsx.",
  "Create three API routes: /api/generate, /api/export-docx, and /api/export-pdf.",
  "Install packages: openai, docx, and puppeteer.",
  "Add OPENAI_API_KEY to .env.local.",
  "Test locally with npm run dev.",
  "Deploy to Vercel and add the same environment variable in project settings.",
  "Add a custom domain and publish privacy policy, terms, and disclaimer pages.",
];

export default function CohabitationAgreementGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState("generate");
  const [agreementText, setAgreementText] = useState(buildLocalAgreement(initialForm));
  const [error, setError] = useState("");

  const progress = ((step + 1) / steps.length) * 100;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const aiPrompt = useMemo(
    () => `You are a careful legal-document drafting assistant. Draft a plain-English cohabitation agreement using the structured facts below. Keep a formal tone, use numbered sections, avoid inventing facts, and include a short note that local law varies and legal review is recommended.\n\nPartner One: ${form.partnerOne}\nPartner Two: ${form.partnerTwo}\nAddress: ${form.address}\nJurisdiction: ${form.stateOrCountry}\nMove-in date: ${form.moveInDate}\nRent/Mortgage split: ${form.rentMortgageSplit}\nUtilities split: ${form.utilitiesSplit}\nBank accounts: ${form.bankAccounts}\nExisting property: ${form.existingProperty}\nShared property: ${form.sharedProperty}\nDebts: ${form.debts}\nPets: ${form.pets}\nBreakup terms: ${form.breakupTerms}\nDispute resolution: ${form.disputeResolution}\nAdditional terms: ${form.extraTerms}`,
    [form]
  );

  const fallbackAgreement = useMemo(() => buildLocalAgreement(form), [form]);

  const generateAgreement = async () => {
    setGenerated(true);
    setError("");
    setStep(steps.length - 1);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setAgreementText(data.agreement || fallbackAgreement);
    } catch (err) {
      setAgreementText(fallbackAgreement);
      setError("API route not found in preview, so the app used the built-in fallback template. Once you add the backend route, this button will generate with OpenAI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadText = () => {
    const blob = new Blob([agreementText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cohabitation-agreement.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFromRoute = async (endpoint, filename, mimeType) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreement: agreementText }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export route not found in preview. Add the DOCX/PDF API routes shown on the right, then these buttons will work in production.");
    }
  };

  const snippet =
    activeSnippet === "generate"
      ? nextRouteCode
      : activeSnippet === "docx"
      ? docxRouteCode
      : activeSnippet === "pdf"
      ? pdfRouteCode
      : stripeRouteCode;

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> AI-powered legal document builder
                </div>
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Free Cohabitation Agreement Generator</h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                    Answer a few questions, generate a polished agreement with AI, and export it as text, DOCX, or PDF.
                  </p>
                </div>
              </div>
              <div className="hidden rounded-2xl border bg-muted/60 p-3 lg:block">
                <Shield className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Guided questionnaire", "Plain-English prompts"],
                ["AI-generated draft", "Formal numbered sections"],
                ["Export ready", "TXT, DOCX, and PDF flow"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> {title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Build your agreement</CardTitle>
              <CardDescription>In preview mode, the AI call and file export routes will fall back gracefully until you add the backend files.</CardDescription>
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Step {step + 1} of {steps.length}</span>
                  <span>{steps[step]}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 0 && (
                <div className="space-y-4">
                  <SectionHeader title="Who is this agreement for?" description="Start with the partners' names." />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Partner one</Label>
                      <Input value={form.partnerOne} onChange={(e) => update("partnerOne", e.target.value)} placeholder="Jordan Lee" />
                    </div>
                    <div className="space-y-2">
                      <Label>Partner two</Label>
                      <Input value={form.partnerTwo} onChange={(e) => update("partnerTwo", e.target.value)} placeholder="Alex Morgan" />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <SectionHeader title="Where will you live together?" description="Add the shared home details and intended move-in date." />
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>State or country</Label>
                      <Input value={form.stateOrCountry} onChange={(e) => update("stateOrCountry", e.target.value)} placeholder="California, USA" />
                    </div>
                    <div className="space-y-2">
                      <Label>Move-in date</Label>
                      <Input type="date" value={form.moveInDate} onChange={(e) => update("moveInDate", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <SectionHeader title="How will expenses work?" description="Capture the main financial arrangements." />
                  <div className="space-y-2">
                    <Label>Rent or mortgage split</Label>
                    <Textarea value={form.rentMortgageSplit} onChange={(e) => update("rentMortgageSplit", e.target.value)} placeholder="50/50 split, paid monthly on the 1st" />
                  </div>
                  <div className="space-y-2">
                    <Label>Utilities and household bills</Label>
                    <Textarea value={form.utilitiesSplit} onChange={(e) => update("utilitiesSplit", e.target.value)} placeholder="Utilities split equally; groceries alternate weekly" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank accounts</Label>
                    <Textarea value={form.bankAccounts} onChange={(e) => update("bankAccounts", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <SectionHeader title="Who owns what?" description="Document property, debts, and pets." />
                  <div className="space-y-2">
                    <Label>Property owned before moving in</Label>
                    <Textarea value={form.existingProperty} onChange={(e) => update("existingProperty", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Property purchased together</Label>
                    <Textarea value={form.sharedProperty} onChange={(e) => update("sharedProperty", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Debts</Label>
                    <Textarea value={form.debts} onChange={(e) => update("debts", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pets</Label>
                    <Textarea value={form.pets} onChange={(e) => update("pets", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <SectionHeader title="What happens if things change?" description="Add move-out and dispute-resolution terms." />
                  <div className="space-y-2">
                    <Label>Breakup or move-out terms</Label>
                    <Textarea value={form.breakupTerms} onChange={(e) => update("breakupTerms", e.target.value)} rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Dispute resolution</Label>
                    <Textarea value={form.disputeResolution} onChange={(e) => update("disputeResolution", e.target.value)} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional terms</Label>
                    <Textarea
                      value={form.extraTerms}
                      onChange={(e) => update("extraTerms", e.target.value)}
                      placeholder="Optional: confidentiality, notices, furniture, parking, guests..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <SectionHeader title="Review and generate" description="Press Generate to call /api/generate in production. In canvas preview, the app falls back to the built-in template if the route is missing." />
                  {error ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{error}</div> : null}
                  <AgreementPreview content={agreementText || fallbackAgreement} />
                </div>
              )}

              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Not legal advice. Laws vary by jurisdiction. Recommend lawyer review before signing.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={back} disabled={step === 0 || isGenerating}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={next} disabled={isGenerating}>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={downloadText} disabled={!agreementText}>
                        <Download className="mr-2 h-4 w-4" /> TXT
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadFromRoute("/api/export-docx", "cohabitation-agreement.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
                        disabled={!agreementText}
                      >
                        <Download className="mr-2 h-4 w-4" /> DOCX
                      </Button>
                      <Button variant="outline" onClick={() => downloadFromRoute("/api/export-pdf", "cohabitation-agreement.pdf", "application/pdf")} disabled={!agreementText}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                      </Button>
                      <Button onClick={generateAgreement} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        {generated ? "Regenerate" : "Generate"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle>AI prompt preview</CardTitle>
              <CardDescription>This is the exact structured prompt your backend route will send.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border bg-muted/40 p-4">
                <pre className="whitespace-pre-wrap text-xs leading-5">{aiPrompt}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle>Backend code to paste into Next.js</CardTitle>
              <CardDescription>Use the tabs below to switch between the generate, DOCX, and PDF routes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  ["generate", "Generate API"],
                  ["docx", "DOCX Export"],
                  ["pdf", "PDF Export"],
                  ["stripe", "Payments"],
                ],
                  ["pdf", "PDF Export"],
                ].map(([key, label]) => (
                  <Button key={key} variant={activeSnippet === key ? "default" : "outline"} onClick={() => setActiveSnippet(key)}>
                    {label}
                  </Button>
                ))}
                <Button variant="outline" onClick={copySnippet}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
              <div className="rounded-2xl border bg-muted/40 p-4">
                <pre className="whitespace-pre-wrap text-xs leading-5">{snippet}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle>How to launch</CardTitle>
              <CardDescription>Fastest path to getting this live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {launchSteps.map((item, index) => (
                <div key={item} className="rounded-2xl border p-4">
                  <p className="font-medium text-foreground">
                    {index + 1}. {item}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl border p-4">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <Rocket className="h-4 w-4" /> Recommended stack
                </p>
                <p className="mt-1">Next.js + Vercel + OpenAI API + docx + puppeteer.</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-medium text-foreground">Commands</p>
                <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-foreground">npx create-next-app@latest cohab-agreement-app
cd cohab-agreement-app
npm install openai docx puppeteer
npm run dev</pre>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-medium text-foreground">Environment variable</p>
                <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-foreground">OPENAI_API_KEY=your_key_here</pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
