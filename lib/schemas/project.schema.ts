import { z } from "zod";

export const CATEGORIES = ["residential", "commercial", "industrial"] as const;
export const STATUSES = ["upcoming", "ongoing", "completed"] as const;

const ImageSchema = z.object({ src: z.string().startsWith("/"), alt: z.string().min(3) });

export const ProjectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(2),
    tagline: z.string(),
    description: z.string().optional(),
    category: z.enum(CATEGORIES),
    subType: z.string(),
    status: z.enum(STATUSES),
    featured: z.boolean().default(false),
    /** Display order on the site (lower first). */
    order: z.number().optional(),
    cpEligible: z.boolean().default(true),
    station: z.string(),
    /** Society name when the project is a redevelopment. */
    redevelopmentOf: z.string().optional(),
    location: z.object({
      address: z.string(),
      locality: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string().regex(/^\d{6}$/).optional(),
      /** Exact coordinates, only when verified. Otherwise the map searches `mapQuery`. */
      lat: z.number().optional(),
      lng: z.number().optional(),
      mapQuery: z.string().optional(),
      mapEmbedUrl: z.string().url().optional(),
      distanceFromStation: z.string().optional(),
    }),
    units: z
      .array(
        z.object({
          label: z.string(),
          carpetAreaSqft: z.tuple([z.number(), z.number()]).optional(),
          priceFrom: z.number().optional(),
        }),
      )
      .default([]),
    price: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      display: z.string(),
      onRequest: z.boolean().default(false),
    }),
    possession: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    landParcelAcres: z.number().optional(),
    towers: z.number().optional(),
    floors: z.string().optional(),
    frontageFt: z.number().optional(),
    ceilingHeightFt: z.number().optional(),
    powerLoadKva: z.number().optional(),
    floorLoadKgSqm: z.number().optional(),
    rera: z.array(z.object({ number: z.string(), phase: z.string(), qr: z.string().optional() })).optional(),
    highlights: z.array(z.string()).default([]),
    specifications: z
      .array(z.object({ title: z.string(), icon: z.string(), items: z.array(z.string()) }))
      .default([]),
    amenities: z.array(z.string()).default([]),
    connectivity: z
      .array(z.object({ place: z.string(), distance: z.string(), type: z.string() }))
      .default([]),
    images: z.object({
      cover: ImageSchema,
      gallery: z.array(ImageSchema.extend({ kind: z.string().optional() })).default([]),
      floorPlans: z.array(ImageSchema.extend({ label: z.string() })).default([]),
    }),
    videoUrl: z.string().url().optional(),
    brochure: z.string().optional(),
    /** Project-specific booking line from the brochure. */
    bookingPhone: z.string().optional(),
    constructionUpdates: z
      .array(z.object({ date: z.string(), title: z.string(), image: z.string().optional() }))
      .default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
    }),
    publishedAt: z.string(),
    updatedAt: z.string(),
  })
  .superRefine((p, ctx) => {
    if (!p.price.onRequest && p.price.min === undefined) {
      ctx.addIssue({ code: "custom", path: ["price", "min"], message: "price.min is required unless onRequest" });
    }
  });

export type Project = z.infer<typeof ProjectSchema>;
export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];
