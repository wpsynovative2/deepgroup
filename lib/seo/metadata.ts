import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";

type MetaInput = { title: string; description: string; path: string; image?: string; noindex?: boolean; absoluteTitle?: boolean };

export function buildMetadata({ title, description, path, image, noindex, absoluteTitle }: MetaInput): Metadata {
  const url = siteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Deep Group",
      locale: "en_IN",
      images: [{ url: image ?? "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  };
}
