import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Cohabitation Agreement Generator — Instant Download, No Sign-Up",
  description: "Create a customizable cohabitation agreement in under 5 minutes — 100% free, no sign-up, instant download as PDF, Word, or TXT. Covers rent, bills, property, pets, and separation terms.",
  keywords: "free cohabitation agreement, cohabitation agreement generator, living together agreement, free template, instant download, no sign up, customizable agreement, PDF agreement, domestic partnership agreement, moving in together, relationship contract, cohabitation form, unmarried couple agreement",
  authors: [{ name: "Cohabitation Agreement Generator" }],
  creator: "Cohabitation Agreement Generator",
  publisher: "Cohabitation Agreement Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nestrules.net'),
  alternates: {
    canonical: 'https://nestrules.net',
  },
  openGraph: {
    title: "Free Cohabitation Agreement Generator — Instant Download, No Sign-Up",
    description: "Create a customizable cohabitation agreement in under 5 minutes — 100% free, no sign-up, instant download as PDF, Word, or TXT. Covers rent, bills, property, pets, and separation.",
    url: 'https://nestrules.net',
    siteName: 'NestRules',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free Cohabitation Agreement Generator — Instant Download",
    description: "100% free cohabitation agreement generator. Customizable, instant PDF/Word download, no sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'GgC9HRTyNAxcOk9CFBkEcyBsjvZToRS6ictwDf4dJhc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "NestRules — Free Cohabitation Agreement Generator",
                "description": "Create a customizable cohabitation agreement in under 5 minutes. 100% free, no sign-up, instant download as PDF, Word, or TXT.",
                "url": "https://nestrules.net",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web Browser",
                "featureList": "Free forever, No sign-up required, Customizable terms, Instant PDF download, Instant DOCX download, Instant TXT download, Covers rent and bills, Property and debt tracking, Pet ownership, Separation terms, Dispute resolution",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "NestRules",
                  "url": "https://nestrules.net"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is this cohabitation agreement generator really free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, 100% free with no hidden fees, no sign-up, and no email required. You can create and download your agreement instantly."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What formats can I download my cohabitation agreement in?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can download your agreement as a PDF, Word document (DOCX), or plain text (TXT) file — all free, all instant."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I customize the cohabitation agreement?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absolutely. Every section is fully customizable — from rent splits and property ownership to pet care, guest rules, and separation terms. You can also add optional lifestyle sections."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do I need to create an account or sign up?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No. There is no account, no sign-up, and no email required. Just answer the questions and download your agreement."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What does a cohabitation agreement cover?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A cohabitation agreement typically covers rent and mortgage splits, utility and bill sharing, bank account arrangements, property ownership (separate vs. joint), debt responsibilities, pet ownership, separation or move-out terms, and dispute resolution."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
