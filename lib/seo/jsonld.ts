import type { Job, Project, Site } from "@/types";
import { siteUrl } from "@/lib/utils";

export const organizationLd = (site: Site) => ({
  "@type": "Organization",
  "@id": siteUrl("/#organization"),
  name: site.name,
  legalName: site.legalName,
  url: siteUrl(),
  logo: { "@type": "ImageObject", url: siteUrl("/logo.png"), width: 512, height: 512 },
  foundingDate: site.foundingYear,
  telephone: site.phone,
  email: site.email,
  address: { "@type": "PostalAddress", ...site.headOffice.address, addressCountry: "IN" },
  sameAs: Object.values(site.social),
  contactPoint: [
    { "@type": "ContactPoint", telephone: site.phone, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "hi", "mr"] },
    { "@type": "ContactPoint", telephone: site.cpDesk.phone, email: site.cpDesk.email, contactType: "channel partner support", areaServed: "IN" },
  ],
});

export const websiteLd = (site: Site) => ({
  "@type": "WebSite",
  "@id": siteUrl("/#website"),
  url: siteUrl(),
  name: site.name,
  publisher: { "@id": siteUrl("/#organization") },
  inLanguage: "en-IN",
});

export const localBusinessLd = (site: Site) => ({
  "@type": "HomeAndConstructionBusiness",
  "@id": siteUrl("/#head-office"),
  name: `${site.name}, ${site.headOffice.label}`,
  image: siteUrl(site.defaultOgImage),
  telephone: site.phone,
  address: { "@type": "PostalAddress", ...site.headOffice.address, addressCountry: "IN" },
  ...(site.headOffice.lat !== undefined && {
    geo: { "@type": "GeoCoordinates", latitude: site.headOffice.lat, longitude: site.headOffice.lng },
  }),
  openingHours: site.openingHours,
  parentOrganization: { "@id": siteUrl("/#organization") },
});

export const breadcrumbLd = (items: Array<{ name: string; href: string }>) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: siteUrl(it.href) })),
});

export const faqLd = (faqs: Array<{ q: string; a: string }>) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const itemListLd = (slugs: string[]) => ({
  "@type": "ItemList",
  itemListElement: slugs.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: siteUrl(`/projects/${s}`) })),
});

export function projectLd(p: Project, amenityLabels: string[]) {
  const url = siteUrl(`/projects/${p.slug}`);
  const address = {
    "@type": "PostalAddress",
    streetAddress: p.location.address,
    addressLocality: p.location.locality,
    addressRegion: p.location.state,
    ...(p.location.pincode && { postalCode: p.location.pincode }),
    addressCountry: "IN",
  };
  const geo =
    p.location.lat !== undefined && p.location.lng !== undefined
      ? { "@type": "GeoCoordinates", latitude: p.location.lat, longitude: p.location.lng }
      : undefined;
  const image = [p.images.cover, ...p.images.gallery].map((i) => siteUrl(i.src));

  if (p.category === "residential") {
    return {
      "@type": "ApartmentComplex",
      "@id": `${url}#project`,
      name: p.name,
      description: p.tagline,
      url,
      address,
      geo,
      image,
      amenityFeature: amenityLabels.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      containsPlace: p.units.map((u) => ({
        "@type": "Apartment",
        name: u.label,
        numberOfRooms: Number.parseInt(u.label) || undefined,
        ...(u.carpetAreaSqft && {
          floorSize: { "@type": "QuantitativeValue", minValue: u.carpetAreaSqft[0], maxValue: u.carpetAreaSqft[1], unitCode: "FTK" },
        }),
      })),
      ...(p.price.min && {
        offers: { "@type": "Offer", priceCurrency: "INR", price: p.price.min, availability: "https://schema.org/InStock" },
      }),
    };
  }
  return {
    "@type": "Place",
    "@id": `${url}#project`,
    additionalType: p.category === "commercial" ? "https://schema.org/Store" : "https://schema.org/LocalBusiness",
    name: p.name,
    description: `${p.tagline}. ${p.description ?? ""}`.trim(),
    url,
    address,
    geo,
    image,
  };
}

export const jobLd = (job: Job, site: Site) => ({
  "@type": "JobPosting",
  title: job.title,
  description: `<p>${job.description}</p><ul>${[...job.responsibilities, ...job.requirements].map((r) => `<li>${r}</li>`).join("")}</ul>`,
  datePosted: job.postedAt,
  validThrough: job.validThrough,
  employmentType: job.type,
  hiringOrganization: { "@type": "Organization", name: site.name, sameAs: siteUrl(), logo: siteUrl("/logo.png") },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: job.location, addressRegion: "Maharashtra", addressCountry: "IN" },
  },
});

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
