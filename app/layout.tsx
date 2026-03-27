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
  title: "Free Cohabitation Agreement Generator | Professional Agreement Templates",
  description: "Create a professional cohabitation agreement in 5 minutes. Free and easy to use. Generate clear, structured agreements for couples living together. Download as PDF, DOCX, or TXT. Not legal advice.",
  keywords: "cohabitation agreement, living together agreement, agreement template, relationship contract, domestic partnership, free agreement generator, cohabitation form",
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
    title: "Free Cohabitation Agreement Generator | Professional Agreement Templates",
    description: "Create a professional cohabitation agreement in 5 minutes. Free and easy to use. Generate clear, structured agreements for couples living together.",
    url: 'https://nestrules.net',
    siteName: 'Cohabitation Agreement Generator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free Cohabitation Agreement Generator | Professional Agreement Templates",
    description: "Create a professional cohabitation agreement in 5 minutes. Free and easy to use.",
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Cohabitation Agreement Generator",
              "description": "Create professional cohabitation agreements in 5 minutes. Free and easy to use.",
              "url": "https://nestrules.net",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "Cohabitation Agreement Generator"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
