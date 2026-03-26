import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { posts } from "./posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohabitation Blog — Advice for Couples Moving In Together | NestRules",
  description:
    "Practical guides on splitting rent, handling shared property, resolving cohabitation conflicts, and protecting yourself legally when you move in with a partner.",
  alternates: { canonical: "https://nestrules.net/blog" },
  openGraph: {
    title: "Cohabitation Blog — Advice for Couples Moving In Together",
    description:
      "Practical guides on splitting rent, handling shared property, resolving cohabitation conflicts, and protecting yourself legally.",
    url: "https://nestrules.net/blog",
    siteName: "NestRules",
    locale: "en_US",
    type: "website",
  },
};

const categoryColors: Record<string, string> = {
  Money: "bg-green-100 text-green-800",
  Property: "bg-blue-100 text-blue-800",
  Planning: "bg-purple-100 text-purple-800",
  Conflict: "bg-orange-100 text-orange-800",
  Legal: "bg-gray-100 text-gray-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Shield className="h-4 w-4" />
            NestRules
          </Link>
          <Link
            href="/"
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Create your agreement →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 space-y-12">
        {/* Page title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Cohabitation Guides
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Practical advice for couples navigating money, property, and expectations when
            moving in together — plus the legal protection you actually need.
          </p>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-3xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    categoryColors[featured.category] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {featured.category}
                </span>
                <span className="text-xs text-muted-foreground">{featured.readingTime}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{featured.description}</p>
              <p className="text-xs text-muted-foreground">{formatDate(featured.date)}</p>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-2xl border bg-background p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      categoryColors[post.category] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                </div>
                <h3 className="font-semibold leading-snug group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.date)}</p>
            </Link>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-3xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">Ready to protect your home and your relationship?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create a professional cohabitation agreement in 5 minutes — covering finances,
            property, pets, and separation terms. Free and easy to use.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start your free agreement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
