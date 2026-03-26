"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  Users,
  Home,
  DollarSign,
  FileText,
  AlertTriangle,
  Eye,
  Phone,
  Heart,
  Settings,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const steps = ["Partners", "Home", "Money", "Property", "Separation", "Review"];

const initialForm = {
  // Basic Info
  partnerOne: "",
  partnerTwo: "",
  partnerOnePhone: "",
  partnerTwoPhone: "",
  partnerOneEmail: "",
  partnerTwoEmail: "",

  // Home
  address: "",
  stateOrCountry: "",
  moveInDate: "",

  // Money
  rentMortgageSplit: "",
  utilitiesSplit: "",
  bankAccounts: "Separate unless otherwise agreed in writing",
  sharedExpenses: "",
  emergencyFund: "",

  // Property
  existingProperty: "Each party keeps property they owned before moving in together",
  sharedProperty: "Items purchased together are jointly owned unless otherwise agreed in writing",
  debts: "Each party remains solely responsible for debts in their own name",
  pets: "The parties will decide pet care cooperatively; ownership remains with the adopting party unless otherwise agreed",

  // Lifestyle (Optional)
  communication: "",
  decisionMaking: "",
  guests: "",
  quietHours: "",
  cleaning: "",
  technology: "",
  vacation: "",
  insurance: "",

  // Separation
  breakupTerms:
    "If the relationship ends, one party may move out upon reasonable written notice, and jointly owned items will be divided by mutual agreement or sold and the proceeds split equally.",
  disputeResolution: "The parties will attempt to resolve disputes through good-faith discussion before mediation.",
  extraTerms: "",

  // Optional sections enabled/disabled
  includeLifestyle: false,
  includeContact: false,
  includeInsurance: false,
  includeTechnology: false,
};

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function buildLocalAgreement(form: typeof initialForm) {
  const today = new Date().toLocaleDateString();
  let agreement = `COHABITATION AGREEMENT\n\nThis Cohabitation Agreement (the "Agreement") is made between ${form.partnerOne || "[Partner One]"} and ${form.partnerTwo || "[Partner Two]"} on ${today}.\n\n`;

  if (form.includeContact && (form.partnerOnePhone || form.partnerTwoPhone || form.partnerOneEmail || form.partnerTwoEmail)) {
    agreement += `CONTACT INFORMATION\n`;
    if (form.partnerOnePhone) agreement += `${form.partnerOne}: ${form.partnerOnePhone}\n`;
    if (form.partnerTwoPhone) agreement += `${form.partnerTwo}: ${form.partnerTwoPhone}\n`;
    if (form.partnerOneEmail) agreement += `${form.partnerOne}: ${form.partnerOneEmail}\n`;
    if (form.partnerTwoEmail) agreement += `${form.partnerTwo}: ${form.partnerTwoEmail}\n\n`;
  }

  agreement += `1. RESIDENCE\nThe parties agree to live together at ${form.address || "[Address]"}, ${form.stateOrCountry || "[State/Country]"}. Their intended move-in date is ${form.moveInDate || "[Move-in date]"}.\n\n`;

  agreement += `2. FINANCIAL ARRANGEMENTS\n`;
  agreement += `Rent / Mortgage: ${form.rentMortgageSplit || "[Describe split]"}.\n`;
  agreement += `Utilities / Household Bills: ${form.utilitiesSplit || "[Describe split]"}.\n`;
  if (form.sharedExpenses) agreement += `Shared Expenses: ${form.sharedExpenses}.\n`;
  if (form.emergencyFund) agreement += `Emergency Fund: ${form.emergencyFund}.\n`;
  agreement += `Bank Accounts: ${form.bankAccounts || "[Describe arrangement]"}.\n\n`;

  agreement += `3. PROPERTY\n`;
  agreement += `Pre-existing Property: ${form.existingProperty || "[Describe treatment of existing property]"}.\n`;
  agreement += `Shared Property: ${form.sharedProperty || "[Describe treatment of jointly acquired property]"}.\n\n`;

  agreement += `4. DEBTS AND LIABILITIES\n${form.debts || "[Describe debt responsibility]"}.\n\n`;

  agreement += `5. PETS\n${form.pets || "[Describe pet arrangements]"}.\n\n`;

  if (form.includeLifestyle) {
    agreement += `6. LIFESTYLE AND HOUSEHOLD\n`;
    if (form.communication) agreement += `Communication: ${form.communication}.\n`;
    if (form.guests) agreement += `Guests & Visitors: ${form.guests}.\n`;
    if (form.quietHours) agreement += `Quiet Hours & Rules: ${form.quietHours}.\n`;
    if (form.cleaning) agreement += `Cleaning & Maintenance: ${form.cleaning}.\n`;
    if (form.vacation) agreement += `Vacation & Time Away: ${form.vacation}.\n`;
    if (form.includeTechnology && form.technology) agreement += `Technology & Accounts: ${form.technology}.\n`;
    if (form.includeInsurance && form.insurance) agreement += `Insurance: ${form.insurance}.\n`;
    agreement += `\n`;
  }

  const sectionNumber = form.includeLifestyle ? 7 : 6;
  agreement += `${sectionNumber}. SEPARATION OR MOVE-OUT\n${form.breakupTerms || "[Describe what happens if the relationship ends]"}.\n\n`;

  agreement += `${sectionNumber + 1}. DISPUTE RESOLUTION\n${form.disputeResolution || "[Describe dispute resolution method]"}.\n\n`;

  agreement += `${sectionNumber + 2}. ADDITIONAL TERMS\n${form.extraTerms || "None."}\n\n`;

  agreement += `${sectionNumber + 3}. GENERAL\nThis Agreement reflects the parties' present intentions regarding shared living arrangements. The parties understand laws vary by jurisdiction and should seek independent legal advice before signing or relying on this document.\n\nSigned:\n\n______________________________\n${form.partnerOne || "[Partner One]"}\n\n______________________________\n${form.partnerTwo || "[Partner Two]"}\n`;

  return agreement;
}

function AgreementPreview({ content }: { content: string }) {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground font-sans">{content}</pre>
    </div>
  );
}

export default function CohabitationAgreementGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // Calculate total steps (always 6 pages: partners, home, money, property, separation, review)
  const getTotalSteps = () => 6;

  const getCurrentStepName = (stepIndex: number) => {
    const baseSteps = ["Partners", "Home", "Money", form.includeLifestyle ? "Property + Lifestyle" : "Property", "Separation", "Review"];
    return baseSteps[stepIndex] || "Review";
  };

  const progress = ((step + 1) / getTotalSteps()) * 100;
  const agreementText = useMemo(() => buildLocalAgreement(form), [form]);

  const update = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));
  const next = () => {
    const maxStep = getTotalSteps() - 1;
    setStep((s) => Math.min(s + 1, maxStep));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const downloadText = () => {
    const blob = new Blob([agreementText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cohabitation-agreement.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFromRoute = async (endpoint: string, filename: string, mimeType: string) => {
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
    } catch (err) {
      setError(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 p-4 md:p-8">
      {/* SEO Content - Hidden from users but visible to search engines */}
      <div className="sr-only">
        <h1>Cohabitation Agreement Generator - Free Legal Template Creator</h1>
        <p>Create professional cohabitation agreements online for free. Generate legally sound living together contracts in minutes. No attorney fees required. Download as PDF, Word document, or text file.</p>

        <h2>What is a Cohabitation Agreement?</h2>
        <p>A cohabitation agreement is a legal document that outlines the rights and responsibilities of unmarried couples living together. It covers financial arrangements, property ownership, debt responsibility, and separation terms.</p>

        <h2>Why Do You Need a Cohabitation Agreement?</h2>
        <ul>
          <li>Protects both partners financially</li>
          <li>Clarifies property ownership rights</li>
          <li>Prevents disputes over shared expenses</li>
          <li>Provides legal protection if relationship ends</li>
          <li>Saves money compared to hiring a lawyer</li>
        </ul>

        <h2>Free Cohabitation Agreement Template Features</h2>
        <ul>
          <li>Step-by-step guided questionnaire</li>
          <li>Professional legal language</li>
          <li>Customizable terms and conditions</li>
          <li>Multiple export formats (PDF, DOCX, TXT)</li>
          <li>Instant download and printing</li>
        </ul>

        <h2>Cohabitation Agreement Topics Covered</h2>
        <ul>
          <li>Rent and mortgage payment responsibilities</li>
          <li>Utility bill sharing arrangements</li>
          <li>Bank account and financial management</li>
          <li>Property ownership (separate vs. joint)</li>
          <li>Debt and liability responsibilities</li>
          <li>Pet ownership and care arrangements</li>
          <li>Relationship termination procedures</li>
          <li>Dispute resolution methods</li>
        </ul>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Protect Your Home. Protect Your Relationship.</h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                    Create a clear, fair cohabitation agreement in 5 minutes. No lawyer fees. Professional, legally sound, and ready to sign.
                  </p>
                </div>
              </div>
              <div className="hidden rounded-2xl border bg-muted/60 p-3 lg:block">
                <Shield className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Skip the awkward conversations", "We guide you through money, property, and expectations"],
                ["Professional document", "Formatted for courts — taken seriously if needed"],
                ["Instant download", "Sign and share immediately — no waiting for lawyers"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> {title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Why Cohabitation Agreements Matter</h2>
            <p className="mt-2 text-muted-foreground">Whether you're moving in together for the first time or after years of dating, a cohabitation agreement sets clear expectations—protecting both of you.</p>
            
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-foreground">Avoids money conflicts</h3>
                <p className="mt-1 text-sm text-muted-foreground">Decide upfront who pays rent, bills, and shared expenses. No surprises or resentment later.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Clarifies property ownership</h3>
                <p className="mt-1 text-sm text-muted-foreground">Document what you each own separately vs. jointly. Protects you both if the relationship ends.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Protects your independence</h3>
                <p className="mt-1 text-sm text-muted-foreground">Define your own boundaries around finances, career, and personal life. Healthy relationships need transparency.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Saves thousands in lawyers</h3>
                <p className="mt-1 text-sm text-muted-foreground">A lawyer charges $500–$2,000+. You get a professional agreement here in 5 minutes, free.</p>
              </div>
            </div>
          </div>

          <Card className="rounded-3xl shadow-sm border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Build your agreement</CardTitle>
              <CardDescription className="text-base">Answer 6 simple questions. We'll create a professional agreement you can use immediately.</CardDescription>
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Step {step + 1} of {getTotalSteps()}</span>
                  <span>{getCurrentStepName(step)}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <SectionHeader title="Who is this agreement for?" description="Start with the partners' names and contact information." />
                  </div>
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

                  {!form.includeContact && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                      <button
                        onClick={() => update("includeContact", true)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Plus className="h-4 w-4" />
                        Add contact information (phone, email)
                      </button>
                    </div>
                  )}

                  {form.includeContact && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <button
                          onClick={() => update("includeContact", false)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Partner one phone</Label>
                          <Input value={form.partnerOnePhone} onChange={(e) => update("partnerOnePhone", e.target.value)} placeholder="(555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label>Partner two phone</Label>
                          <Input value={form.partnerTwoPhone} onChange={(e) => update("partnerTwoPhone", e.target.value)} placeholder="(555) 987-6543" />
                        </div>
                        <div className="space-y-2">
                          <Label>Partner one email</Label>
                          <Input type="email" value={form.partnerOneEmail} onChange={(e) => update("partnerOneEmail", e.target.value)} placeholder="jordan@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>Partner two email</Label>
                          <Input type="email" value={form.partnerTwoEmail} onChange={(e) => update("partnerTwoEmail", e.target.value)} placeholder="alex@email.com" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <Home className="h-5 w-5 text-green-600" />
                    </div>
                    <SectionHeader title="Where will you live together?" description="Add the shared home details and intended move-in date." />
                  </div>
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                    <SectionHeader title="How will expenses work?" description="Capture the main financial arrangements." />
                  </div>
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-purple-100 p-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <SectionHeader title="Who owns what?" description="Document property, debts, and pets." />
                  </div>
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

                  {!form.includeLifestyle && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 mt-4">
                      <button
                        onClick={() => update("includeLifestyle", true)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Plus className="h-4 w-4" />
                        Add lifestyle & living arrangements (communication, guests, cleaning, etc.)
                      </button>
                    </div>
                  )}

                  {form.includeLifestyle && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">✓ Lifestyle section added</span>
                        <button
                          onClick={() => update("includeLifestyle", false)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                          Remove lifestyle section
                        </button>
                      </div>
                      <p className="text-xs text-green-700">You'll be able to add communication preferences, household rules, and more in the next step.</p>
                    </div>
                  )}
                </div>
              )}

                  <div className="space-y-2">
                    <Label>Communication & decision making</Label>
                    <Textarea value={form.communication} onChange={(e) => update("communication", e.target.value)} placeholder="How will we communicate about important decisions? Weekly check-ins?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Guests & visitors</Label>
                    <Textarea value={form.guests} onChange={(e) => update("guests", e.target.value)} placeholder="Rules about having guests over, overnight stays, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label>Quiet hours & household rules</Label>
                    <Textarea value={form.quietHours} onChange={(e) => update("quietHours", e.target.value)} placeholder="Quiet hours, noise levels, smoking, alcohol policies" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cleaning & maintenance</Label>
                    <Textarea value={form.cleaning} onChange={(e) => update("cleaning", e.target.value)} placeholder="Who handles cleaning? Chore schedules? Repairs?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vacation & time away</Label>
                    <Textarea value={form.vacation} onChange={(e) => update("vacation", e.target.value)} placeholder="How much notice for trips? Vacation time sharing?" />
                  </div>

                  {form.includeTechnology && (
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Technology & shared accounts</Label>
                        <button
                          onClick={() => update("includeTechnology", false)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                      <Textarea value={form.technology} onChange={(e) => update("technology", e.target.value)} placeholder="Shared devices, streaming accounts, passwords, internet bills" />
                    </div>
                  )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <SectionHeader title="What happens if things change?" description="Add move-out and dispute-resolution terms." />
                  </div>
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
                    <Textarea value={form.extraTerms} onChange={(e) => update("extraTerms", e.target.value)} placeholder="Optional: confidentiality, notices, furniture, parking, guests..." rows={4} />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <Eye className="h-5 w-5 text-emerald-600" />
                    </div>
                    <SectionHeader title="Review and download" description="Your agreement is ready. Download it in your preferred format." />
                  </div>
                  {error ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{error}</div> : null}
                  <AgreementPreview content={agreementText} />
                </div>
              )}

              <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Disclaimer: Not legal advice. Laws vary by jurisdiction. Recommend lawyer review before signing.
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={back} disabled={step === 0} className="text-base px-6 py-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  {step < getTotalSteps() - 1 ? (
                    <Button onClick={next} className="text-base px-8 py-2">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Your agreement is ready!</span>
                        </div>
                        <p className="text-sm text-green-700">Download in your preferred format. All files include professional formatting.</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Button onClick={downloadText} className="h-12 text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all px-3">
                          <Download className="mr-2 h-4 w-4" /> TXT
                        </Button>
                        <Button
                          onClick={() => downloadFromRoute("/api/export-docx", "cohabitation-agreement.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
                          className="h-12 text-sm font-semibold bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all px-3"
                        >
                          <Download className="mr-2 h-4 w-4" /> DOCX
                        </Button>
                        <Button
                          onClick={() => downloadFromRoute("/api/export-pdf", "cohabitation-agreement.pdf", "application/pdf")}
                          className="h-12 text-sm font-semibold bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all px-3"
                        >
                          <Download className="mr-2 h-4 w-4" /> PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
