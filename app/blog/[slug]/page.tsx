import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { getPost, getAllSlugs, posts } from "../posts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | NestRules Blog`,
    description: post.description,
    alternates: { canonical: `https://nestrules.net/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://nestrules.net/blog/${slug}`,
      siteName: "NestRules",
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Very lightweight markdown renderer — handles ## headings, **bold**, and bullet lists */
function renderContent(raw: string) {
  const paragraphs = raw.split(/\n\n+/);

  return paragraphs.map((block, i) => {
    // H2 heading
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 mb-3 text-xl font-semibold tracking-tight">
          {block.slice(3)}
        </h2>
      );
    }

    // H3 heading
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-6 mb-2 text-lg font-semibold">
          {block.slice(4)}
        </h3>
      );
    }

    // Bullet list
    const lines = block.split("\n");
    if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
      return (
        <ul key={i} className="my-3 space-y-1.5 list-disc pl-5 text-muted-foreground">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.slice(2))}</li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      return (
        <ol key={i} className="my-3 space-y-1.5 list-decimal pl-5 text-muted-foreground">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(/^\d+\.\s/, ""))}</li>
          ))}
        </ol>
      );
    }

    // Separator
    if (block.trim() === "---") {
      return <hr key={i} className="my-8 border-border" />;
    }

    // Normal paragraph
    return (
      <p key={i} className="my-3 leading-7 text-foreground/90">
        {renderInline(block)}
      </p>
    );
  });
}

/** Handle **bold**, *italic*, [text](url), **[bold link](url)**, and inline code */
function renderInline(text: string): React.ReactNode {
  // Split on bold-wrapped links, standalone links, bold text, and italic text
  const parts = text.split(/(\*\*\[[^\]]+\]\([^)]+\)\*\*|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    // Bold-wrapped link: **[text](url)**
    const boldLinkMatch = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
    if (boldLinkMatch) {
      const [, label, href] = boldLinkMatch;
      const isInternal = href.startsWith("/");
      return isInternal ? (
        <strong key={i}><Link href={href} className="underline underline-offset-4 hover:text-primary transition-colors">{label}</Link></strong>
      ) : (
        <strong key={i}><a href={href} className="underline underline-offset-4 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">{label}</a></strong>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith("/");
      return isInternal ? (
        <Link key={i} href={href} className="underline underline-offset-4 hover:text-primary transition-colors">
          {label}
        </Link>
      ) : (
        <a key={i} href={href} className="underline underline-offset-4 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return part;
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const categoryColors: Record<string, string> = {
    Money: "bg-green-100 text-green-800",
    Property: "bg-blue-100 text-blue-800",
    Planning: "bg-purple-100 text-purple-800",
    Conflict: "bg-orange-100 text-orange-800",
    Legal: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
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

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>

        {/* Article header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                categoryColors[post.category] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">{post.readingTime}</span>
            <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.description}</p>
        </div>

        <hr className="border-border" />

        {/* Article body */}
        <article className="prose-custom text-base">
          {renderContent(post.content)}
        </article>

        {/* CTA */}
        <div className="rounded-3xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-7 space-y-4">
          <h2 className="text-lg font-semibold">Protect yourself with a written agreement</h2>
          <p className="text-sm text-muted-foreground">
            A cohabitation agreement takes about 5 minutes to create and covers finances,
            property, pets, and separation terms. Free, no lawyer needed, instant download.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start your free agreement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <nav className="grid gap-4 sm:grid-cols-2 pt-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col rounded-2xl border bg-background p-4 hover:shadow-md transition-shadow"
              >
                <span className="text-xs text-muted-foreground mb-1">← Previous</span>
                <span className="text-sm font-medium group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col rounded-2xl border bg-background p-4 hover:shadow-md transition-shadow sm:text-right"
              >
                <span className="text-xs text-muted-foreground mb-1">Next →</span>
                <span className="text-sm font-medium group-hover:underline underline-offset-4 decoration-muted-foreground/40">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
