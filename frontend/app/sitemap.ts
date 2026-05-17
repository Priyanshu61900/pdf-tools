import type { MetadataRoute } from "next"
import { guides } from "@/lib/guides"
import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/tools",
      priority: 0.95,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/search-text-in-pdf",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/highlight-pdf",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/extract-pages",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/pdf-to-word",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/guides",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/pricing",
      priority: 0.85,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/api-access",
      priority: 0.85,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources",
      priority: 0.75,
      changeFrequency: "monthly" as const,
    },
    ...guides.map((guide) => ({
      path: `/guides/${guide.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    {
      path: "/about",
      priority: 0.6,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/contact",
      priority: 0.6,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/privacy-policy",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/cookie-policy",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/terms",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/disclaimer",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
  ]

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
