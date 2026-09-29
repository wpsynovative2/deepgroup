import { z } from "zod";

const normalizeMobile = (v: string) => {
  const digits = v.replace(/\D/g, "");
  return digits.replace(/^(?:91|0)(?=[6-9]\d{9}$)/, "");
};

export const mobileSchema = z
  .string()
  .transform(normalizeMobile)
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number")
  .refine((v) => !/^(\d)\1{9}$/.test(v), "Enter a valid 10-digit Indian mobile number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(60, "Name is too long")
  .regex(/^[A-Za-z][A-Za-z .']*[A-Za-z]$/, "Use letters and spaces only");

const optionalEmail = z.string().trim().email("Enter a valid email").optional().or(z.literal(""));

export const FORM_TYPES = ["lead", "redevelopment", "career", "channel-partner"] as const;
export const INTENTS = ["enquiry", "site-visit", "brochure", "cost-sheet", "floor-plan"] as const;
export type FormType = (typeof FORM_TYPES)[number];
export type Intent = (typeof INTENTS)[number];

export const LeadSchema = z.object({
  fullName: nameSchema,
  mobile: mobileSchema,
  email: optionalEmail,
  project: z.string().max(100).optional(),
  unit: z.string().max(50).optional(),
  message: z.string().max(500, "Keep it under 500 characters").optional(),
  consent: z.literal(true, { error: "Please accept to continue" }),
  formType: z.enum(FORM_TYPES),
  intent: z.enum(INTENTS).optional(),
  source: z.string().max(200),
  tracking: z.record(z.string(), z.string().max(300)).optional(),
  // anti-spam
  website: z.string().max(500).optional(), // honeypot: any value means a bot; the API fakes success
  renderedAt: z.number(),
  recaptchaToken: z.string().min(10),
});

export const RedevelopmentSchema = LeadSchema.extend({
  societyName: z.string().trim().min(2, "Enter your society name").max(100),
  location: z.string().max(100).optional(),
  members: z.string().max(10).optional(),
  plotArea: z.string().max(50).optional(),
  buildingAge: z.string().max(10).optional(),
  designation: z.enum(["chairman", "secretary", "member", ""]).optional(),
});

export const ChannelPartnerSchema = LeadSchema.extend({
  email: z.string().trim().email("Enter a valid email"),
  firmName: z.string().trim().min(2, "Enter your firm name").max(100),
  reraAgentNo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^A\d{11}$/, "Enter a valid MahaRERA agent number, e.g. A51800012345"),
  operatingAreas: z.array(z.string()).min(1, "Choose at least one area"),
  experienceYears: z.coerce.number().min(0).max(60).optional(),
  teamSize: z.coerce.number().min(1).max(1000).optional(),
});

export const CareerSchema = LeadSchema.extend({
  email: z.string().trim().email("Enter a valid email"),
  position: z.string().min(2, "Choose a position").max(100),
  experience: z.string().max(20).optional(),
  currentLocation: z.string().max(100).optional(),
  resumeName: z.string().max(200).optional(),
  resumeMime: z
    .enum([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ])
    .optional(),
  // ~5 MB file → ~6.7 MB base64
  resumeBase64: z.string().max(7_000_000, "Résumé must be 5 MB or smaller").optional(),
});

export const schemaFor = (formType: unknown) =>
  formType === "channel-partner"
    ? ChannelPartnerSchema
    : formType === "redevelopment"
      ? RedevelopmentSchema
      : formType === "career"
        ? CareerSchema
        : LeadSchema;

export type LeadInput = z.input<typeof LeadSchema>;
export type LeadOutput = z.output<typeof LeadSchema>;
