import { z } from "zod";

export const SiteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  url: z.string().url(),
  logo: z.string(),
  phone: z.string(),
  phoneHref: z.string(),
  altPhone: z.string().optional(),
  whatsapp: z.string(),
  email: z.string().email(),
  cpDesk: z.object({ phone: z.string(), phoneHref: z.string(), email: z.string().email() }),
  careersEmail: z.string().email(),
  foundingYear: z.string(),
  yearsOfSuccess: z.number(),
  hours: z.string(),
  openingHours: z.string(),
  headOffice: z.object({
    label: z.string(),
    address: z.object({
      streetAddress: z.string(),
      addressLocality: z.string(),
      addressRegion: z.string(),
      postalCode: z.string(),
    }),
    lat: z.number().optional(),
    lng: z.number().optional(),
    mapsUrl: z.string().url(),
  }),
  offices: z.array(z.object({ label: z.string(), address: z.string(), phone: z.string(), mapsUrl: z.string().url() })),
  social: z.record(z.string(), z.string().url()),
  defaultOgImage: z.string(),
});

export type Site = z.infer<typeof SiteSchema>;
