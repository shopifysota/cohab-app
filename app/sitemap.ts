import type { MetadataRoute } from "next";
import { getAllSlugs } from "./blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nestrules.net";

  const blogSlugs = getAllSlugs();

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
