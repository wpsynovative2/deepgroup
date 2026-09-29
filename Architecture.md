# Deep Groups Website: Architecture

A marketing and lead-generation website for **Deep Groups**, a real estate developer building residential, commercial and industrial projects along the Mumbai Western line (Virar, Nallasopara, Vasai and nearby).

This document is the single source of truth for how the site is structured, how content is stored, how leads flow into Google Sheets, and how SEO is handled. Anyone joining the project should be able to build a feature from this file without asking where things go.

---

## 1. Goals

1. Generate qualified leads (site visits, brochure requests, redevelopment enquiries, job applications).
2. Let a visitor find a project by type, status and nearest station in two clicks or fewer.
3. Rank for location-intent searches such as "flats in Virar", "commercial shops Nallasopara", "society redevelopment Vasai".
4. Stay easy to update: every piece of content lives in JSON under `/data`, so adding a project means adding one file, never touching components.
5. Load fast on mid-range Android phones on 4G (target: LCP < 2.5s, CLS < 0.1, INP < 200ms).

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router, latest stable) | Static generation for every page; one API route for forms |
| Language | TypeScript (strict) | `strict: true`, `noUncheckedIndexedAccess: true` |
| Styling | Tailwind CSS v4 | Design tokens declared with `@theme` in `globals.css` |
| Validation | Zod | Same schema used on the client form and the API route |
| Forms | React Hook Form + `@hookform/resolvers/zod` | |
| Spam protection | Google reCAPTCHA v3 + honeypot + time trap + rate limit | Verified server-side |
| Lead storage | Google Apps Script web app → Google Sheet | Script URL never exposed to the browser |
| Images | `next/image` (AVIF/WebP) | |
| Fonts | `next/font/google` (self-hosted at build) | |
| Icons | `lucide-react` | |
| Carousel / gallery | `embla-carousel-react` + `yet-another-react-lightbox` | Both small, accessible |
| Analytics | Google Tag Manager (GA4, Meta Pixel via GTM) | Loaded with `next/script` `afterInteractive` |
| Hosting | Vercel (recommended) or any Node host | See §13 for static-export fallback |

---

## 3. Sitemap and routes

```
/                                   Home
/about-us                           About us
/projects                           All projects (filterable)
/projects/[slug]                    Project detail page
/projects/station/[station]         Station landing page (e.g. /projects/station/virar)
/projects/type/[category]           Category landing page (residential | commercial | industrial)
/redevelopment                      Redevelopment
/career                             Careers (job list + application form)
/career/[jobSlug]                   Single job opening (JobPosting schema)
/channel-partner                    Channel partner (broker) programme + registration
/contact-us                         Contact us
/thank-you                          Post-submission page (noindex, used for conversion tracking)
/privacy-policy                     Privacy policy (DPDP Act 2023)
/terms-and-conditions               Terms
/disclaimer                         RERA / advertising disclaimer

/api/lead                           POST: validates, verifies reCAPTCHA, forwards to Apps Script

/sitemap.xml                        Generated from /data
/robots.txt                         Generated
/manifest.webmanifest               Generated
/llms.txt                           Generated summary for LLM crawlers
/llms-full.txt                      Generated full content for LLM crawlers
/.well-known/security.txt           Static
/opengraph-image                    Dynamic OG images (site default + per project)
```

Station and category landing pages are real, indexable pages (not just filtered views). They carry their own title, intro copy and schema, which is what lets the site rank for "flats in Virar" style queries. The `/projects?station=virar` query-string view is for in-page filtering and canonicalises to `/projects`.

---

## 4. Folder structure

```
deep-groups/
├── app/
│   ├── layout.tsx                    Root layout: fonts, header, footer, LeadModal provider, global JSON-LD
│   ├── page.tsx                      Home
│   ├── globals.css                   Tailwind v4 + @theme tokens
│   ├── not-found.tsx
│   ├── about-us/page.tsx
│   ├── projects/
│   │   ├── page.tsx                  Listing + filters (server shell, client filter island)
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── opengraph-image.tsx   Per-project OG image
│   │   ├── station/[station]/page.tsx
│   │   └── type/[category]/page.tsx
│   ├── redevelopment/page.tsx
│   ├── career/
│   │   ├── page.tsx
│   │   └── [jobSlug]/page.tsx
│   ├── channel-partner/page.tsx
│   ├── contact-us/page.tsx
│   ├── thank-you/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms-and-conditions/page.tsx
│   ├── disclaimer/page.tsx
│   ├── api/lead/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── manifest.ts
│   ├── llms.txt/route.ts
│   ├── llms-full.txt/route.ts
│   ├── opengraph-image.tsx           Site-wide default OG image
│   ├── icon.png                      512×512
│   ├── apple-icon.png                180×180
│   └── favicon.ico
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                Sticky header, logo, nav, "Enquire now" CTA
│   │   ├── NavProjectsDropdown.tsx   Stations (only those with projects) + category links
│   │   ├── MobileNav.tsx             Drawer with the same station list
│   │   ├── Footer.tsx
│   │   ├── MobileActionBar.tsx       Fixed bottom bar on mobile: Call | WhatsApp | Enquire
│   │   └── Breadcrumbs.tsx           Visual breadcrumb + BreadcrumbList JSON-LD
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── QuickFinder.tsx           Type + station + status selects → /projects?…
│   │   ├── FeaturedProjects.tsx
│   │   ├── CategoryTiles.tsx
│   │   ├── AboutTeaser.tsx
│   │   ├── StationPresence.tsx
│   │   ├── RedevelopmentTeaser.tsx
│   │   ├── Testimonials.tsx
│   │   └── CtaBand.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx           Whole card is a link to /projects/[slug]
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectFilters.tsx        Client component, URL-synced
│   │   ├── FilterChips.tsx           Active filters with remove buttons
│   │   ├── SortSelect.tsx
│   │   ├── EmptyResults.tsx
│   │   └── detail/
│   │       ├── ProjectHero.tsx
│   │       ├── ProjectOverview.tsx
│   │       ├── ConfigurationTable.tsx
│   │       ├── AmenitiesGrid.tsx
│   │       ├── Gallery.tsx
│   │       ├── FloorPlans.tsx        Blurred until the lead form is submitted
│   │       ├── LocationConnectivity.tsx
│   │       ├── ConstructionUpdates.tsx
│   │       ├── ReraBlock.tsx         RERA number + QR code (MahaRERA requirement)
│   │       ├── ProjectFaq.tsx
│   │       ├── RelatedProjects.tsx
│   │       └── StickyProjectCta.tsx
│   ├── redevelopment/
│   │   ├── RedevHero.tsx
│   │   ├── RedevBenefits.tsx
│   │   ├── RedevProcess.tsx          Real sequence, so numbered steps are appropriate
│   │   ├── RedevCompleted.tsx        Past redevelopment projects
│   │   ├── RedevFaq.tsx
│   │   └── RedevEnquiryForm.tsx      Society-specific fields
│   ├── career/
│   │   ├── JobList.tsx
│   │   ├── JobCard.tsx
│   │   └── ApplicationForm.tsx
│   ├── channel-partner/
│   │   ├── CpHero.tsx
│   │   ├── CpBenefits.tsx
│   │   ├── CpProcess.tsx             Real sequence, so numbered steps are appropriate
│   │   ├── CpProjects.tsx            Projects open to channel partners
│   │   ├── CpPolicies.tsx            Client tagging, payout terms (accordion)
│   │   ├── CpFaq.tsx
│   │   └── CpRegistrationForm.tsx
│   ├── forms/
│   │   ├── LeadModal.tsx             Global popup form
│   │   ├── LeadModalProvider.tsx     React context: openLeadModal({ source, project })
│   │   ├── LeadForm.tsx              Shared form body (used inline and in modal)
│   │   ├── Honeypot.tsx
│   │   ├── PhoneInput.tsx            Fixed +91 prefix, numeric keyboard
│   │   └── useRecaptcha.ts           Lazy-loads reCAPTCHA v3 on first interaction
│   ├── seo/
│   │   └── JsonLd.tsx                <script type="application/ld+json"> renderer
│   └── ui/
│       ├── Button.tsx                Variants: primary (maroon), accent (gold), outline, ghost
│       ├── CtaButton.tsx             Button that calls openLeadModal()
│       ├── Container.tsx
│       ├── Section.tsx
│       ├── Badge.tsx                 Status badges: Upcoming / Ongoing / Completed
│       ├── Select.tsx
│       ├── Accordion.tsx
│       └── Dialog.tsx
│
├── data/                             ALL site content, JSON only (see §5)
│   ├── site.json
│   ├── navigation.json
│   ├── stations.json
│   ├── amenities.json
│   ├── projects/
│   │   ├── deep-heights-virar.json
│   │   └── …one file per project
│   ├── pages/
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── redevelopment.json
│   │   ├── career.json
│   │   ├── channel-partner.json
│   │   └── contact.json
│   ├── jobs.json
│   ├── testimonials.json
│   ├── faqs.json
│   └── seo.json
│
├── lib/
│   ├── data/
│   │   ├── projects.ts               getAllProjects, getProjectBySlug, getRelatedProjects
│   │   ├── stations.ts               getActiveStations (only stations with ≥1 project)
│   │   ├── filters.ts                applyFilters, getFilterOptions (with counts)
│   │   ├── jobs.ts
│   │   └── content.ts                getSite, getPage('home') …
│   ├── schemas/                      Zod schemas for every JSON file (validated at build)
│   │   ├── project.schema.ts
│   │   ├── station.schema.ts
│   │   ├── site.schema.ts
│   │   ├── job.schema.ts
│   │   └── lead.schema.ts            Form schema shared by client + server
│   ├── seo/
│   │   ├── metadata.ts               buildMetadata({ title, description, path, image })
│   │   └── jsonld.ts                 organizationLd, websiteLd, projectLd, breadcrumbLd, jobLd, faqLd
│   ├── lead/
│   │   ├── verifyRecaptcha.ts
│   │   ├── rateLimit.ts
│   │   └── forwardToSheet.ts
│   ├── tracking/
│   │   ├── utm.ts                    Captures utm_*, gclid, fbclid into sessionStorage
│   │   └── datalayer.ts              pushEvent('generate_lead', …)
│   └── utils.ts                      cn(), formatPrice (₹ lakh/crore), slugify
│
├── types/
│   └── index.ts                      Types inferred from Zod: z.infer<typeof ProjectSchema>
│
├── public/
│   ├── images/
│   │   ├── hero/hero.jpg             The supplied hero image (see §8.1)
│   │   ├── projects/<slug>/…         Gallery, floor plans, RERA QR per project
│   │   ├── about/…
│   │   └── redevelopment/…
│   ├── brochures/<slug>.pdf
│   ├── logo.svg
│   └── .well-known/security.txt
│
├── scripts/
│   ├── validate-data.ts              Runs Zod over /data; fails the build on bad content
│   └── google-apps-script/Code.gs    Source for the Apps Script (kept in repo for versioning)
│
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "validate": "tsx scripts/validate-data.ts",
    "build": "npm run validate && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 5. Data layer (`/data`)

### 5.1 Principles

1. JSON only. No content is hard-coded in components.
2. One project = one file in `/data/projects/`. The file name is the slug.
3. Every file is validated with Zod at build time (`npm run validate`). A typo in `status` or a missing image fails the build instead of shipping a broken page.
4. Derived data (active stations, filter options, counts, related projects, sitemap entries, llms.txt) is computed from the JSON, never stored twice.
5. Images live in `/public/images/...`; JSON stores the path plus alt text.

### 5.2 `stations.json`

The master list of stations in line order. A station only appears on the site when at least one project references it.

```json
[
  { "slug": "virar",       "name": "Virar",       "line": "Western", "order": 1 },
  { "slug": "nallasopara", "name": "Nallasopara", "line": "Western", "order": 2 },
  { "slug": "vasai-road",  "name": "Vasai Road",  "line": "Western", "order": 3 },
  { "slug": "naigaon",     "name": "Naigaon",     "line": "Western", "order": 4 },
  { "slug": "bhayandar",   "name": "Bhayandar",   "line": "Western", "order": 5 },
  { "slug": "mira-road",   "name": "Mira Road",   "line": "Western", "order": 6 },
  { "slug": "boisar",      "name": "Boisar",      "line": "Western", "order": 7 }
]
```

Each station can also carry optional `intro` copy and `seo` fields for its landing page.

### 5.3 Project file (`/data/projects/deep-heights-virar.json`)

```json
{
  "slug": "deep-heights-virar",
  "name": "Deep Heights",
  "tagline": "2 & 3 BHK residences 6 minutes from Virar station",
  "category": "residential",
  "subType": "apartments",
  "status": "ongoing",
  "featured": true,
  "station": "virar",
  "location": {
    "address": "Plot No. 12, Bolinj Road",
    "locality": "Virar West",
    "city": "Palghar",
    "state": "Maharashtra",
    "pincode": "401303",
    "lat": 19.4559,
    "lng": 72.8114,
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=…",
    "distanceFromStation": "1.2 km"
  },
  "units": [
    { "label": "2 BHK", "carpetAreaSqft": [650, 720], "priceFrom": 5500000 },
    { "label": "3 BHK", "carpetAreaSqft": [920, 980], "priceFrom": 8200000 }
  ],
  "price": { "min": 5500000, "max": 9800000, "display": "₹55 L – ₹98 L", "onRequest": false },
  "possession": "2028-12",
  "landParcelAcres": 3.5,
  "towers": 5,
  "floors": "G+23",
  "rera": [
    { "number": "P99000012345", "phase": "Phase 1", "qr": "/images/projects/deep-heights-virar/rera-qr-1.png" }
  ],
  "highlights": ["Infinity pool", "3-level clubhouse", "70% open space"],
  "amenities": ["swimming-pool", "clubhouse", "gym", "kids-play-area", "jogging-track"],
  "connectivity": [
    { "place": "Virar station", "distance": "1.2 km", "type": "transport" },
    { "place": "Mumbai–Vadodara Expressway", "distance": "8 km", "type": "road" }
  ],
  "images": {
    "cover": { "src": "/images/projects/deep-heights-virar/cover.jpg", "alt": "Deep Heights towers with infinity pool at dusk" },
    "gallery": [
      { "src": "/images/projects/deep-heights-virar/g1.jpg", "alt": "Clubhouse lobby", "kind": "amenity" }
    ],
    "floorPlans": [
      { "src": "/images/projects/deep-heights-virar/fp-2bhk.jpg", "alt": "2 BHK floor plan, 690 sq ft carpet", "label": "2 BHK" }
    ]
  },
  "videoUrl": "https://www.youtube.com/watch?v=…",
  "brochure": "/brochures/deep-heights-virar.pdf",
  "constructionUpdates": [
    { "date": "2026-08", "title": "Tower A: 14th slab complete", "image": "/images/projects/deep-heights-virar/cu-2026-08.jpg" }
  ],
  "faqs": [
    { "q": "Is Deep Heights RERA registered?", "a": "Yes. MahaRERA No. P99000012345." }
  ],
  "seo": {
    "title": "Deep Heights: 2 & 3 BHK Flats in Virar West",
    "description": "RERA-registered 2 & 3 BHK flats near Virar station from ₹55 L. Infinity pool, clubhouse, possession Dec 2028.",
    "keywords": ["2 BHK in Virar", "flats in Virar West", "new projects in Virar"]
  },
  "publishedAt": "2026-06-01",
  "updatedAt": "2026-09-20"
}
```

Category-specific notes:

| Category | `subType` examples | `units[].label` examples | Extra fields |
|---|---|---|---|
| residential | apartments, villas, row-houses | 1 BHK, 2 BHK, 3 BHK, Jodi | — |
| commercial | shops, offices, showrooms | Shop, Office, Showroom | `frontageFt` (optional) |
| industrial | galas, warehouses, sheds | Industrial gala, Warehouse | `ceilingHeightFt`, `powerLoadKva`, `floorLoadKgSqm` (optional) |

Optional `"cpEligible": true|false` (default `true`) controls whether the project appears on the Channel partner page; completed or sold-out projects are usually set to `false`.

`status` is exactly one of `upcoming | ongoing | completed`. For `upcoming`, price and RERA may be absent; the schema allows `price.onRequest: true` and makes `rera` optional only when `status === "upcoming"`.

### 5.4 Other files

| File | Contents |
|---|---|
| `site.json` | Brand name, legal name, logo, phones, WhatsApp number, email, office addresses, hours, social links, founding year, default SEO image |
| `navigation.json` | Main nav order and labels, footer link groups (the Projects dropdown items are derived, not stored) |
| `amenities.json` | `{ id, label, icon }` so projects reference amenities by id |
| `pages/home.json` | Hero copy, section headings, stats (only verified numbers), CTA text |
| `pages/about.json` | Story, vision, mission, leadership, milestones timeline, certifications |
| `pages/redevelopment.json` | Hero, benefits, process steps, completed redevelopments, FAQs |
| `pages/career.json` | Intro, culture points, perks, application instructions |
| `pages/channel-partner.json` | Hero copy, benefits, onboarding steps, client-tagging and payout policy text, FAQs, RM contact |
| `jobs.json` | `{ slug, title, department, location, type, experience, description, responsibilities[], requirements[], postedAt, validThrough, open }` |
| `testimonials.json` | `{ name, project, quote, rating?, image? }` (real customers only, with consent) |
| `faqs.json` | Site-wide FAQs grouped by page |
| `seo.json` | Default title template, per-static-page titles and descriptions, `sameAs` social URLs |

### 5.5 Data access (`lib/data`)

```ts
// lib/data/projects.ts
import fs from "node:fs";
import path from "node:path";
import { ProjectSchema, type Project } from "@/lib/schemas/project.schema";

const DIR = path.join(process.cwd(), "data/projects");

export function getAllProjects(): Project[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ProjectSchema.parse(JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt));
}

export const getProjectBySlug = (slug: string) => getAllProjects().find((p) => p.slug === slug);

export function getRelatedProjects(p: Project, limit = 3) {
  return getAllProjects()
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => score(b, p) - score(a, p))
    .slice(0, limit);
}
const score = (x: Project, p: Project) => (x.station === p.station ? 2 : 0) + (x.category === p.category ? 1 : 0);
```

```ts
// lib/data/stations.ts
import stations from "@/data/stations.json";
import { getAllProjects } from "./projects";

/** Stations that have at least one project, in line order, with counts. */
export function getActiveStations() {
  const counts = new Map<string, number>();
  for (const p of getAllProjects()) counts.set(p.station, (counts.get(p.station) ?? 0) + 1);
  return stations
    .filter((s) => counts.has(s.slug))
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, count: counts.get(s.slug)! }));
}
```

These run only on the server at build time. Client components receive plain props.

---

## 6. Projects page filters

### 6.1 Filters

| Filter | Control | Values | Source |
|---|---|---|---|
| Category | Segmented buttons | Residential, Commercial, Industrial | Fixed enum, hide values with 0 projects |
| Status | Segmented buttons | Upcoming, Ongoing, Completed | Fixed enum, hide values with 0 projects |
| Station | Multi-select chips | Only stations with ≥1 project | `getActiveStations()` |
| Configuration | Multi-select chips | 1 BHK, 2 BHK, 3 BHK, Shop, Office, Gala… | Derived from `units[].label` across projects |
| Budget | Select | Under ₹50 L, ₹50 L–1 Cr, ₹1–2 Cr, Above ₹2 Cr, Price on request | `price.min` |
| Possession | Select | Ready to move, 2027, 2028, 2029+ | `possession` + `status` |
| RERA registered | Toggle | On / off | `rera.length > 0` |
| Search | Text input | Project name or locality | `name`, `location.locality` |
| Sort | Select | Featured, Newest, Price low→high, Price high→low, Possession soonest | — |

### 6.2 Behaviour

1. **URL is the state.** Filters read and write query params: `/projects?category=residential&status=ongoing&station=virar,nallasopara&budget=50l-1cr`. Filtered views are shareable and survive refresh and back-button.
2. **Options narrow to what exists.** Each option shows a count computed against the other active filters (faceted counts). Options with 0 results are disabled, not hidden, so the layout doesn't jump.
3. **Cross-filter dependency.** Choosing Industrial hides BHK configuration chips and shows gala/warehouse chips.
4. **Client-side filtering.** The full project list (small, static) is passed to the client island; filtering is instant with no network calls.
5. **Mobile.** Filters collapse into a "Filters (3)" button that opens a bottom sheet with an "Show 12 projects" apply button.
6. **Empty state.** "No projects match these filters." plus a "Clear filters" button and a "Tell us what you're looking for" CTA that opens the lead modal pre-filled with the chosen filters.
7. **SEO.** `/projects` with any query string sets `<link rel="canonical" href="/projects">`. Indexable filtered content lives at `/projects/station/[station]` and `/projects/type/[category]`.

```ts
// lib/data/filters.ts (shape)
export type FilterState = {
  category?: Category[]; status?: Status[]; station?: string[];
  config?: string[]; budget?: BudgetBand; possession?: string;
  rera?: boolean; q?: string; sort?: SortKey;
};
export function applyFilters(projects: Project[], f: FilterState): Project[];
export function getFacetCounts(projects: Project[], f: FilterState): Record<keyof FilterState, Record<string, number>>;
```

### 6.3 Project card

Whole card is one `<Link href="/projects/[slug]">` (no nested links). Contents: cover image (4:3), status badge, name, locality + station, configurations ("2 & 3 BHK"), price from, possession. A secondary "Enquire" button inside the card opens the lead modal and uses `e.preventDefault()` + `e.stopPropagation()` so it doesn't navigate; it sits outside the link element in the DOM to stay valid HTML (overlay link pattern).

---

## 7. Navigation

### 7.1 Header

```
[Logo]   Home   About us   Projects ▾   Redevelopment   Channel partners   Career   Contact us   [ Enquire now ]
```

Between 1024px and 1180px wide, "Career" and "Channel partners" move into a "More ▾" menu so the row doesn't wrap. Channel partners is also linked in the footer.

Sticky. Transparent over the hero's white top area, turns solid white with a hairline border after 80px scroll.

### 7.2 Projects dropdown

Built at build time from `getActiveStations()` and category counts, passed to the header as props.

```
┌──────────────────────────────────────────────────┐
│ By station            │ By type                  │
│ Virar (4)             │ Residential (6)          │
│ Nallasopara (2)       │ Commercial (2)           │
│ Vasai Road (1)        │ Industrial (1)           │
│                       │                          │
│ View all projects                                │
└──────────────────────────────────────────────────┘
```

Station items link to `/projects/station/[slug]`. If a station has no projects it never appears, because it isn't in the derived list. Adding the first project in Boisar makes "Boisar" appear in the dropdown, the filters, the sitemap and llms.txt on the next build, with no other change.

Accessibility: opens on hover (desktop, with a 150ms close delay) and on click/Enter/Space; `aria-expanded`, `aria-controls`; Escape closes and returns focus; arrow keys move between items. On mobile it's an accordion inside the drawer.

---

## 8. Page specifications

### 8.1 Home

**Hero (uses the supplied `hero.jpg`).** The image is 1920×1407 with the top ~35% fading to white, towers in the middle, and the pool in the foreground. This composition means the headline can sit in the white area in maroon without any dark overlay on the photo, which keeps the render bright and is the one distinctive moment of the page.

```
┌───────────────────────────────────────────────────────────┐
│ [Logo]  nav…                                 [Enquire now]│  ← transparent header on white
│                                                           │
│          Homes and workspaces along the Western line      │  ← display serif, #650727
│      Residential, commercial and industrial projects in   │
│              Virar, Nallasopara and Vasai                 │
│        [ Explore projects ]   [ Book a site visit ]       │
│                                                           │
│                  ▲ towers ▲  ▲ towers ▲                   │  ← image, object-position: center bottom
│   ~~~~~~~~~~~~~~~~~~~~ pool ~~~~~~~~~~~~~~~~~~~~~~~~~~~~   │
├───────────────────────────────────────────────────────────┤
│ Quick finder: [Type ▾] [Station ▾] [Status ▾] [Search]    │  ← overlaps hero bottom edge
└───────────────────────────────────────────────────────────┘
```

Implementation:

```tsx
<Image
  src="/images/hero/hero.jpg"
  alt="Deep Groups residential towers seen across an infinity pool"
  fill
  priority
  fetchPriority="high"
  sizes="100vw"
  className="object-cover object-bottom"
/>
```

On mobile (portrait) crop with `object-position: 50% 85%` so the towers and pool stay in frame; headline stays in the white area above. Export AVIF/WebP at 640, 1080, 1920 widths (handled by `next/image`), keep the source under 400 KB.

**Remaining sections, in order:**

1. Quick finder: three selects (type, station, status) that navigate to `/projects?…`.
2. Featured projects: 3–6 cards where `featured: true`.
3. What we build: three tiles, Residential / Commercial / Industrial, each linking to its type page with project count.
4. About teaser: two-paragraph story, verified stats (years, projects delivered, families), "About Deep Groups" link.
5. Where we build: station list with counts, links to station pages.
6. Redevelopment teaser: one line of value proposition, "Explore redevelopment" and "Talk to our team" CTAs.
7. Testimonials.
8. CTA band: "Visit a project this weekend" + Book a site visit.
9. Footer.

### 8.2 About us

Hero with a single strong image, company story, vision and mission, leadership (photo, name, role, short bio), milestones timeline (real chronology, so year markers are appropriate), quality and compliance (RERA, certifications), CSR, CTA band.

### 8.3 Projects

Breadcrumb, H1 "Our projects", short intro, filters (§6), result count ("14 projects"), grid (3 cols desktop, 2 tablet, 1 mobile), load-more at 12 items (all items are still in the HTML for crawlers; load-more only toggles visibility).

### 8.4 Project detail (`/projects/[slug]`)

Generated with `generateStaticParams()` from `/data/projects`. `dynamicParams = false` so unknown slugs return 404.

| Order | Section | Notes |
|---|---|---|
| 1 | Breadcrumb | Home › Projects › Virar › Deep Heights |
| 2 | Hero | Cover image, name (H1), locality, status badge, price, possession, two CTAs: "Book a site visit", "Download brochure" |
| 3 | Sticky sub-nav | Overview · Configurations · Amenities · Gallery · Floor plans · Location (in-page anchors) |
| 4 | Overview | Tagline, description, key facts grid (land parcel, towers, floors, possession, RERA) |
| 5 | Configurations | Table: type, carpet area, price from, "Get cost sheet" button per row (opens modal with `unit` pre-filled) |
| 6 | Amenities | Icon grid from `amenities.json` |
| 7 | Gallery | Embla carousel + lightbox, lazy-loaded below the fold |
| 8 | Floor plans | Blurred thumbnails; clicking opens the lead form, after success the plans unblur (flag in sessionStorage) |
| 9 | Location & connectivity | Lazy map (click-to-load iframe placeholder to protect LCP), connectivity list |
| 10 | Construction updates | Ongoing projects only |
| 11 | RERA | Registration number(s), QR code(s), link to MahaRERA site, disclaimer text |
| 12 | FAQ | Accordion |
| 13 | Related projects | Same station first, then same category |
| 14 | Sticky CTA | Desktop: right-side "Enquire" card. Mobile: bottom action bar |

Brochure download is gated: the "Download brochure" button opens the lead form with `intent: "brochure"`; on success the PDF opens in a new tab.

### 8.5 Station and type landing pages

`/projects/station/virar`: H1 "Projects in Virar", 80–150 words of station-specific intro from `stations.json`, the filtered grid (with remaining filters available), a small connectivity blurb, FAQ ("How far is Deep Heights from Virar station?"), CTA. Same template for `/projects/type/[category]`.

### 8.6 Redevelopment

The reference page (imperiallifestyle.in) could not be fetched automatically because the site blocks crawlers, so this structure follows the standard pattern for Mumbai society redevelopment pages; compare it against the reference before design sign-off.

1. Hero: "Redevelopment for housing societies", sub-line on what members get, CTA "Request a feasibility meeting".
2. Why redevelop: bigger homes, modern amenities, parking, lift, corpus fund, rent during construction (only benefits Deep Groups actually offers).
3. What members receive: additional carpet area, rent/transit accommodation, corpus, hardship allowance (numbers only if confirmed by the business).
4. Process: real sequence, numbered: society resolution → feasibility & PMC → tender and developer selection → agreement → approvals → vacating & construction → possession. Mention that the process follows the Maharashtra government's Section 79A guidelines for cooperative housing societies.
5. Transparency: how updates are shared, escrow/bank guarantee (if applicable), legal support.
6. Completed and ongoing redevelopments: cards from `redevelopment.json` (or projects tagged `"redevelopment": true`).
7. Testimonials from society committees.
8. FAQ.
9. **Redevelopment enquiry form** (different fields, see §9.2).

### 8.7 Career

Intro and culture, perks, open positions list (filter by department), each linking to `/career/[jobSlug]` with full description, "Apply now" form (full name, mobile, email, position, experience, current location, resume). Closed jobs (`open: false`) are removed from the list and sitemap and their pages return 404 (keeps JobPosting data honest).

Resume upload: file ≤ 5 MB, PDF/DOC/DOCX. The API route base64-encodes the file and the Apps Script saves it to a Drive folder, writing the Drive link into the Careers sheet. If a simpler route is preferred, replace upload with a "Resume link (Google Drive / LinkedIn)" field.

### 8.8 Channel partner

For real estate brokers and agencies who want to sell Deep Groups projects. The audience is professional, so the page is direct: what partners get, how onboarding works, which projects are open, and the rules.

1. Hero: "Sell Deep Groups projects as a channel partner", one line on the offer, CTA "Register as a partner" (scrolls to the form), secondary "Call the CP desk" (tap-to-call).
2. Why partner with us: only terms the business confirms, e.g. brokerage payout timeline, dedicated relationship manager, site-visit support and pickup, marketing collateral (creatives, brochures, videos), CP meets and incentives.
3. How it works: real sequence, numbered: register → document verification → empanelment → tag your client → site visit → booking → brokerage payout.
4. Projects open to partners: cards for projects with `cpEligible !== false`, same `ProjectCard` component, linking to the project page.
5. Policies (accordion): client-tagging rules (how a lead is registered to a partner and for how long), what counts as a valid site visit, payout milestones, and the requirement that partners hold a valid MahaRERA agent registration. Text comes from `pages/channel-partner.json` and must be approved by the business.
6. FAQ.
7. Registration form (see §9.2) with the CP desk's phone and email beside it.

This page's own CTAs open the channel-partner form, not the buyer lead form, so broker registrations never mix with buyer leads in the sheet.

### 8.9 Contact us

Form (left), contact details (right): phone (tap-to-call), WhatsApp, email, office address with directions link, hours. Click-to-load map below. Multiple site offices can be listed from `site.json`.

### 8.10 Thank-you page

`/thank-you?type=lead|redevelopment|career|channel-partner` with `robots: noindex`. Shows confirmation matching the action ("Thanks, our team will call you within one working day."), next steps and links back to projects. Fires the conversion event. Used as the destination-URL conversion for Google Ads and a Meta custom conversion.

---

## 9. Lead capture

### 9.1 CTA placement ("CTAs everywhere")

Every CTA calls one function: `openLeadModal({ source, project?, unit?, intent? })`.

| Location | CTA |
|---|---|
| Header (all pages) | Enquire now |
| Home hero | Explore projects / Book a site visit |
| Every project card | Enquire |
| Project hero | Book a site visit / Download brochure |
| Configuration rows | Get cost sheet |
| Floor plans | Unlock floor plans |
| Sticky sidebar (project, desktop) | Inline form |
| Mobile bottom bar (all pages) | Call · WhatsApp · Enquire |
| CTA band (bottom of every page) | Book a site visit |
| Empty filter results | Tell us what you're looking for |
| Redevelopment | Request a feasibility meeting |
| Channel partner | Register as a partner (opens CP form, not the buyer form) |
| Footer | Enquire now |

Optional timed popup: opens once per session after 25s **or** 50% scroll on project pages only, never on Contact/Career/Thank-you, never twice, respects dismissal for 7 days (cookie). Aggressive popups on mobile can hurt the page experience, so keep this conservative.

CTA labels describe the action ("Book a site visit", "Download brochure"), never "Submit".

### 9.2 Form fields

**Lead form (popup and inline):**

| Field | Required | Rule |
|---|---|---|
| Full name | Yes | 2–60 chars, letters, spaces, `.` and `'` only, trimmed, at least two characters that are letters |
| Mobile | Yes | Indian mobile, see below |
| Email | No | Valid email if filled |
| Interested in | No | Project select, pre-filled from context |
| Configuration | No | Pre-filled from context |
| Message | No | ≤ 500 chars |
| Consent | Yes (checkbox, pre-checked is not allowed) | "I agree to be contacted by Deep Groups by call, SMS or WhatsApp, even if my number is on DND." |

**Redevelopment form adds:** society name (required), location/station, number of members/flats, approximate plot area, building age, designation in society (chairman/secretary/member).

**Channel partner form:** full name (required), mobile (required), email (required), firm/agency name (required), MahaRERA agent registration number (required, format `A` followed by 11 digits, e.g. `A51800012345`, validated with `/^A\d{11}$/i` and stored uppercase), stations/areas you operate in (multi-select from `getActiveStations()` plus "Other"), years of experience, team size, message. Don't collect PAN, GST or bank details on the website; those are gathered during verification.

```ts
export const ChannelPartnerSchema = LeadSchema.extend({
  email: z.string().trim().email("Enter a valid email"),
  firmName: z.string().trim().min(2, "Enter your firm name").max(100),
  reraAgentNo: z.string().trim().toUpperCase()
    .regex(/^A\d{11}$/, "Enter a valid MahaRERA agent number, e.g. A51800012345"),
  operatingAreas: z.array(z.string()).min(1, "Choose at least one area"),
  experienceYears: z.coerce.number().min(0).max(60).optional(),
  teamSize: z.coerce.number().min(1).max(1000).optional(),
});
```

**Career form adds:** email (required), position, experience (years), current location, resume.

Hidden fields (all forms): `source` (page path), `formType`, `project`, `unit`, `intent`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `landingPage`, `referrer`, honeypot, `renderedAt`.

### 9.3 Indian mobile validation

Accepts user input like `9876543210`, `+91 98765 43210`, `09876543210`, `91-9876543210`. Normalises to 10 digits. First digit must be 6–9. Rejects obviously fake repeats.

```ts
// lib/schemas/lead.schema.ts
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

export const LeadSchema = z.object({
  fullName: nameSchema,
  mobile: mobileSchema,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  project: z.string().max(100).optional(),
  unit: z.string().max(50).optional(),
  message: z.string().max(500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
  formType: z.enum(["lead", "redevelopment", "career", "channel-partner"]),
  intent: z.enum(["enquiry", "site-visit", "brochure", "cost-sheet", "floor-plan"]).optional(),
  source: z.string().max(200),
  tracking: z.record(z.string().max(300)).optional(),
  // anti-spam
  website: z.string().max(0).optional(),          // honeypot must be empty
  renderedAt: z.number(),
  recaptchaToken: z.string().min(10),
});
export type LeadInput = z.infer<typeof LeadSchema>;
```

`PhoneInput` shows a fixed "+91" prefix, uses `inputMode="numeric"`, `autoComplete="tel-national"`, `maxLength` 14, and formats as `98765 43210` while typing. Errors appear under the field on blur and on submit, with `aria-invalid` and `aria-describedby`.

### 9.4 Spam protection (four layers)

1. **Honeypot.** A field named `website`, visually hidden (`position:absolute; left:-9999px`), `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`. Humans never fill it; bots usually do. If filled, the API returns a fake success (don't tell bots they were caught) and drops the lead.
2. **Time trap.** `renderedAt` is set when the form mounts; submissions under 3 seconds are dropped the same way.
3. **reCAPTCHA v3.** Token generated on submit with `action: "lead_submit"` (or `redevelopment_submit`, `career_submit`, `channel-partner_submit`, matching `${formType}_submit` in the API route). The server verifies with Google and requires `success`, matching `action`, matching `hostname`, and `score ≥ 0.5`. Scores between 0.3 and 0.5 are accepted but flagged `review` in the sheet rather than dropped, so borderline real leads aren't lost.
4. **Rate limit.** 5 submissions per IP per 10 minutes (in-memory LRU for a single instance; Upstash Redis if deployed to serverless with multiple instances).

**reCAPTCHA loading.** The script is not loaded on page load (it costs ~150 KB and hurts INP). `useRecaptcha()` injects it on the first focus of any form field or when the lead modal opens. The badge is hidden with CSS and this text is shown under every form, as Google's terms require when hiding the badge: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."

### 9.5 Submission flow

```
Browser (LeadForm)
  │ 1. Zod validation (client)
  │ 2. grecaptcha.execute(siteKey, { action })
  │ 3. POST /api/lead  { ...fields, tracking, recaptchaToken, website, renderedAt }
  ▼
Next.js API route  /api/lead
  │ 4. Rate limit by IP
  │ 5. Zod validation (server, same schema)
  │ 6. Honeypot / time trap → fake 200 if tripped
  │ 7. Verify reCAPTCHA with secret key
  │ 8. POST to Apps Script with shared secret (server-to-server)
  ▼
Google Apps Script web app (doPost)
  │ 9. Check shared secret
  │10. Append row to the right tab (Leads / Redevelopment / Careers / ChannelPartners)
  │11. Flag duplicate if the same mobile submitted in the last 24h
  │12. Optional: email the sales inbox
  ▼
Google Sheet
Browser ← 200 { ok: true } → dataLayer.push('generate_lead') → router.push('/thank-you?type=lead')
```

Why the API route sits in the middle: the reCAPTCHA secret and the Apps Script URL stay on the server. If the Apps Script URL were in the browser, anyone could post junk straight into the sheet.

### 9.6 API route

```ts
// app/api/lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LeadSchema, ChannelPartnerSchema } from "@/lib/schemas/lead.schema";
import { verifyRecaptcha } from "@/lib/lead/verifyRecaptcha";
import { rateLimit } from "@/lib/lead/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a few minutes." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const schema = body?.formType === "channel-partner" ? ChannelPartnerSchema : LeadSchema;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const lead = parsed.data;

  // Honeypot + time trap: pretend success
  if (lead.website || Date.now() - lead.renderedAt < 3000) return NextResponse.json({ ok: true });

  const captcha = await verifyRecaptcha(lead.recaptchaToken, `${lead.formType}_submit`);
  if (captcha.score < 0.3) return NextResponse.json({ ok: true }); // silently drop

  const res = await fetch(process.env.GSCRIPT_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    body: JSON.stringify({
      secret: process.env.GSCRIPT_SHARED_SECRET,
      sheet: { lead: "Leads", redevelopment: "Redevelopment", career: "Careers", "channel-partner": "ChannelPartners" }[lead.formType],
      data: {
        timestamp: new Date().toISOString(),
        fullName: lead.fullName,
        mobile: lead.mobile,
        email: lead.email ?? "",
        project: lead.project ?? "",
        unit: lead.unit ?? "",
        intent: lead.intent ?? "",
        message: lead.message ?? "",
        source: lead.source,
        recaptchaScore: captcha.score,
        quality: captcha.score >= 0.5 ? "ok" : "review",
        ...("firmName" in lead && {
          firmName: lead.firmName,
          reraAgentNo: lead.reraAgentNo,
          operatingAreas: lead.operatingAreas.join(", "),
          experienceYears: lead.experienceYears ?? "",
          teamSize: lead.teamSize ?? "",
        }),
        ...lead.tracking,
      },
    }),
  });

  if (!res.ok) return NextResponse.json({ ok: false, error: "We couldn't save your details. Please call us instead." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
```

```ts
// lib/lead/verifyRecaptcha.ts
export async function verifyRecaptcha(token: string, expectedAction: string) {
  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY!, response: token }),
  }).then((x) => x.json());

  const hostOk = [new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname, "localhost"].includes(r.hostname);
  if (!r.success || r.action !== expectedAction || !hostOk) return { score: 0 };
  return { score: Number(r.score ?? 0) };
}
```

### 9.7 Google Apps Script (`scripts/google-apps-script/Code.gs`)

Setup:
1. Create a Google Sheet with tabs `Leads`, `Redevelopment`, `Careers`, `ChannelPartners` (the script also creates any missing tab with headers). Optionally set a separate `CP_NOTIFY_EMAIL` so broker registrations go to the CP desk rather than the sales inbox.
2. Extensions → Apps Script, paste the code below.
3. Project Settings → Script properties: add `SHARED_SECRET` (same value as `GSCRIPT_SHARED_SECRET`) and optionally `NOTIFY_EMAIL`, `RESUME_FOLDER_ID`.
4. Deploy → New deployment → Web app. Execute as: **Me**. Who has access: **Anyone**. Copy the `/exec` URL into `GSCRIPT_WEBHOOK_URL`.
5. Every code change needs **Manage deployments → Edit → New version**; otherwise the old code keeps running.

```js
const HEADERS = {
  Leads: ["timestamp","fullName","mobile","email","project","unit","intent","message","source",
          "utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid",
          "landingPage","referrer","recaptchaScore","quality","duplicate"],
  Redevelopment: ["timestamp","fullName","mobile","email","societyName","location","members",
          "plotArea","buildingAge","designation","message","source","utm_source","utm_medium",
          "utm_campaign","gclid","fbclid","recaptchaScore","quality","duplicate"],
  Careers: ["timestamp","fullName","mobile","email","position","experience","currentLocation",
          "resumeUrl","message","source","recaptchaScore","quality","duplicate"],
  ChannelPartners: ["timestamp","fullName","mobile","email","firmName","reraAgentNo","operatingAreas",
          "experienceYears","teamSize","message","source","utm_source","utm_medium","utm_campaign",
          "recaptchaScore","quality","duplicate","status"],
};
// Keep "mobile" as the 3rd column in every tab; isDuplicate() relies on it.
// "status" is left blank for the CP desk to fill (Pending / Verified / Empanelled / Rejected).

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    if (body.secret !== props.getProperty("SHARED_SECRET")) return json({ ok: false, error: "unauthorized" });

    const sheetName = HEADERS[body.sheet] ? body.sheet : "Leads";
    const sheet = getSheet(sheetName);
    const data = body.data || {};

    if (sheetName === "Careers" && data.resumeBase64) {
      data.resumeUrl = saveResume(data, props.getProperty("RESUME_FOLDER_ID"));
    }
    data.duplicate = isDuplicate(sheet, data.mobile) ? "yes" : "";

    // Store mobile as text so leading digits/format are preserved
    const row = HEADERS[sheetName].map((h) => (h === "mobile" ? "'" + (data[h] || "") : data[h] ?? ""));
    sheet.appendRow(row);

    const notify = (sheetName === "ChannelPartners" && props.getProperty("CP_NOTIFY_EMAIL"))
      || props.getProperty("NOTIFY_EMAIL");
    if (notify) {
      MailApp.sendEmail(notify, `New ${sheetName} enquiry: ${data.fullName}`,
        `${data.fullName}\n${data.mobile}\n${data.project || data.societyName || data.position || data.firmName || ""}\n${data.source}`);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS[name]);
  return sheet;
}

function isDuplicate(sheet, mobile) {
  const last = sheet.getLastRow();
  if (last < 2 || !mobile) return false;
  const start = Math.max(2, last - 200);
  const rows = sheet.getRange(start, 1, last - start + 1, 3).getValues(); // timestamp, name, mobile
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return rows.some((r) => String(r[2]).replace("'", "") === mobile && new Date(r[0]).getTime() > dayAgo);
}

function saveResume(data, folderId) {
  const blob = Utilities.newBlob(Utilities.base64Decode(data.resumeBase64), data.resumeMime, data.resumeName);
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  delete data.resumeBase64;
  return file.getUrl();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

### 9.8 Tracking

`lib/tracking/utm.ts` runs once on first page load: reads `utm_*`, `gclid`, `fbclid` from the URL and stores them with `landingPage` and `document.referrer` in `sessionStorage` (first-touch within the session). Every form attaches them as `tracking`. On success:

```ts
window.dataLayer?.push({ event: "generate_lead", form_type, project, intent, lead_source: source });
```

GTM maps this to the GA4 `generate_lead` event, Google Ads conversion, and Meta `Lead` event. Channel partner registrations push `cp_registration` instead, so broker sign-ups don't inflate buyer-lead conversions or train ad bidding on the wrong audience. The `/thank-you` URL provides a second, redundant conversion signal.

---

## 10. Design system

### 10.1 Brand colours

The brief fixes the two brand colours. Everything else is neutral so the maroon and gold carry the identity.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-50:  #fbf1f4;
  --color-brand-100: #f3d9e1;
  --color-brand-600: #8a0f38;
  --color-brand-700: #650727;   /* primary: brand maroon */
  --color-brand-800: #4d051d;   /* hover / pressed */
  --color-brand-900: #33030f;

  --color-gold-100: #f6ecd9;
  --color-gold-400: #d9ad62;
  --color-gold-500: #c9943c;    /* accent: brand gold */
  --color-gold-600: #a97a2c;    /* gold text on white (contrast) */

  --color-ink:     #1d1a1b;     /* body text */
  --color-muted:   #5f5759;     /* secondary text */
  --color-line:    #e6e1e2;     /* borders */
  --color-surface: #f8f6f6;     /* alternating section background */
  --color-white:   #ffffff;

  --font-display: var(--font-marcellus), Georgia, serif;
  --font-sans: var(--font-instrument), system-ui, sans-serif;

  --radius-card: 0.75rem;
  --radius-control: 0.5rem;
}
```

Usage rules:

| Colour | Use | Don't |
|---|---|---|
| Maroon `#650727` | Headlines, primary buttons, active nav, links, footer background | Large body-text blocks |
| Gold `#c9943c` | Thin accents: dividers under section titles, icon strokes, status badge for "Ongoing", focus ring, secondary button border | Body text on white (fails contrast); use `gold-600` for small gold text |
| White / surface | Page and alternating section backgrounds | — |

Contrast: maroon on white is ~13:1 (passes AAA). White on maroon passes AAA. Gold `#c9943c` on white is ~2.6:1, so it's only for decoration or large text ≥ 24px bold; gold on maroon (~4.9:1) is fine for footer headings.

### 10.2 Typography

- **Display: Marcellus.** An inscriptional, classical serif that echoes the arches and cornices in the project renders. Used for H1–H3 only.
- **Body/UI: Instrument Sans.** Clean, slightly narrow, reads well at small sizes on phones.

Scale (1.25 ratio, rem): 0.8 / 1 / 1.25 / 1.563 / 1.953 / 2.441 / 3.052 (H1 desktop), H1 mobile 2.2. Body 1rem/1.65, max line length ~70ch. Sentence case everywhere; no all-caps eyebrow labels above headings.

### 10.3 Layout and components

- Container max-width 1240px, 20px mobile gutters, 32px desktop.
- Section spacing: 64px mobile, 112px desktop. Alternate white and `surface` backgrounds.
- Cards: 1px `line` border, no drop shadow at rest; on hover the image scales 1.03 and the border turns gold. Radius `card` for cards, `control` for inputs and buttons.
- Buttons: primary maroon fill / white text; accent gold outline / maroon text; minimum height 44px (touch target).
- Status badges: Upcoming (brand-50 bg, maroon text), Ongoing (gold-100 bg, gold-600 text), Completed (surface bg, ink text).
- Motion: one orchestrated hero entrance (headline fades in, towers image settles 8px upward). Everything else is static except responses to user action (modal open, accordion, dropdown). Respect `prefers-reduced-motion`.
- Visible focus ring: 2px gold outline, 2px offset.

**UI reference:** the brief mentions `Refrence.jpg` as the UI reference, but it wasn't included with the brief. Once supplied, reconcile section 10 against it (layout rhythm, card style, header treatment) before design sign-off.

---

## 11. SEO

### 11.1 Metadata (every page)

`lib/seo/metadata.ts` builds Next.js `Metadata` consistently:

```ts
export function buildMetadata({ title, description, path, image, noindex }: MetaInput): Metadata {
  const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL).toString();
  return {
    title,                                   // root layout template: "%s | Deep Groups"
    description,                             // 140–160 chars, includes location + offer
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: "Deep Groups", locale: "en_IN",
                 images: image ? [{ url: image, width: 1200, height: 630 }] : undefined },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true,
             googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  };
}
```

Root layout also sets: `metadataBase`, `title.template`, `applicationName`, `authors`, `creator`, `publisher`, `formatDetection: { telephone: false }` (we control tap-to-call ourselves), `verification.google` (Search Console), `other: { "geo.region": "IN-MH", "geo.placename": "Virar" }`, `themeColor` via `viewport` export (`#650727`), `<html lang="en-IN">`.

Page title/description patterns:

| Page | Title | Description pattern |
|---|---|---|
| Home | Deep Groups: Residential, Commercial & Industrial Projects in Virar & Vasai | Who, what, where, proof point |
| Projects | Projects in Virar, Nallasopara & Vasai | Count + categories + stations |
| Project | {name}: {configs} {category noun} in {locality} | Configs, price from, RERA, possession, 1 amenity |
| Station | Flats, Shops & Industrial Units near {station} Station | Count and types at that station |
| Redevelopment | Society Redevelopment in {region} | Benefits + process + CTA |
| Career | Careers at Deep Groups | Open roles count, departments |
| Channel partner | Channel Partner Programme: Sell Projects in Virar & Vasai | Who can join, key benefits, register CTA |
| Contact | Contact Deep Groups | Office address, phone, hours |

### 11.2 On-page rules

1. Exactly one H1 per page; H2/H3 follow document order without skipping levels.
2. Every image has descriptive `alt` from JSON (what's in the picture, plus location when natural); decorative images use `alt=""`.
3. Image file names are descriptive (`deep-heights-virar-clubhouse.jpg`).
4. Internal linking: project pages link to their station page, type page and related projects; station pages link to every project at that station; footer links to all station pages with projects.
5. Breadcrumbs on every page except Home (visual + JSON-LD).
6. Clean, lowercase, hyphenated URLs; no trailing slash (`trailingSlash: false`), permanent redirects for any renamed slug (maintain a `redirects` array in `next.config.ts`).
7. Real `<a href>` links for everything crawlable (dropdown, filters on landing pages, pagination).
8. Custom 404 with links to projects and contact.
9. Location-specific copy on station pages (not the same paragraph with the name swapped).

### 11.3 Structured data (JSON-LD)

Rendered with `<JsonLd data={…} />` in server components. One `@graph` per page, entities linked by `@id`.

| Where | Types |
|---|---|
| All pages (root layout) | `Organization` (`@id: /#organization`), `WebSite` (`@id: /#website`) |
| Home, Contact | `HomeAndConstructionBusiness` (a `LocalBusiness` subtype) per office: address, geo, openingHours, telephone, `parentOrganization` → Organization |
| Every non-home page | `BreadcrumbList` |
| Residential project | `ApartmentComplex` with `address`, `geo`, `numberOfAccommodationUnits` (if known), `amenityFeature`, `image`, `containsPlace` (unit types as `Apartment` with `floorSize` and `numberOfRooms`), plus `Offer` with `priceCurrency: "INR"` and `price` from |
| Commercial / industrial project | `Place` with `additionalType` (e.g. `https://schema.org/Store`, `https://schema.org/Warehouse` isn't a type, so use `Place` + descriptive `additionalType` URL and `description`), address, geo, image |
| Project listing / station pages | `ItemList` of project URLs |
| Pages with FAQs | `FAQPage` |
| Job pages | `JobPosting` with `datePosted`, `validThrough`, `employmentType`, `hiringOrganization`, `jobLocation`, `baseSalary` if disclosed |
| About | `AboutPage` + `Organization` details (`foundingDate`, `founder`, `numberOfEmployees` if public) |
| Contact | `ContactPage` |
| Channel partner | `WebPage` + `ContactPoint` (`contactType: "channel partner support"`) on the Organization, `FAQPage`, `BreadcrumbList` |

```ts
// lib/seo/jsonld.ts (excerpt)
export const organizationLd = (site: Site) => ({
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: "Deep Groups",
  legalName: site.legalName,
  url: site.url,
  logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
  foundingDate: site.foundingYear,
  telephone: site.phone,
  email: site.email,
  address: { "@type": "PostalAddress", ...site.headOffice.address, addressCountry: "IN" },
  sameAs: site.social,
  contactPoint: [{ "@type": "ContactPoint", telephone: site.phone, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "hi", "mr"] }],
});
```

Honest expectations: Google shows rich results for Breadcrumb, Organization (logo/knowledge panel signals), LocalBusiness and JobPosting. It has no rich result for real estate projects, and it limited FAQ rich results to authoritative government/health sites in 2023. Project and FAQ schema are still worth adding because they help search engines and AI assistants understand the entities, but they won't create special search snippets. Validate every template with Google's Rich Results Test and the Schema.org validator before launch.

### 11.4 `sitemap.xml`

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const staticPages = ["", "/about-us", "/projects", "/redevelopment", "/channel-partner", "/career", "/contact-us"]
    .map((p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 }));
  const projects = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "weekly" as const, priority: 0.9,
    images: [p.images.cover.src, ...p.images.gallery.slice(0, 5).map((g) => g.src)].map((s) => `${base}${s}`),
  }));
  const stations = getActiveStations().map((s) => ({ url: `${base}/projects/station/${s.slug}`, priority: 0.8 }));
  const types = getActiveCategories().map((c) => ({ url: `${base}/projects/type/${c}`, priority: 0.7 }));
  const jobs = getOpenJobs().map((j) => ({ url: `${base}/career/${j.slug}`, lastModified: new Date(j.postedAt), priority: 0.5 }));
  return [...staticPages, ...projects, ...stations, ...types, ...jobs];
}
```

Excluded: `/thank-you`, `/api/*`, query-string views, closed jobs.

### 11.5 `robots.txt`

```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are allowed by the `*` rule, since a developer benefits from being cited by AI assistants. If the business decides otherwise, add explicit `disallow: "/"` rules per user-agent.

### 11.6 Web app manifest

```ts
// app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deep Groups",
    short_name: "Deep Groups",
    description: "Residential, commercial and industrial projects along the Mumbai Western line.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#650727",
    lang: "en-IN",
    categories: ["business", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

### 11.7 `llms.txt` and `llms-full.txt`

`llms.txt` is a proposed convention (not an official standard, and adoption by AI crawlers is uneven) for giving language models a clean, Markdown summary of a site. It's cheap to generate from `/data`, so both files are built as route handlers and stay in sync with content automatically.

`/llms.txt` (summary + links):

```md
# Deep Groups

> Real estate developer building residential, commercial and industrial projects near Virar, Nallasopara and Vasai Road stations on the Mumbai Western line. All projects are MahaRERA registered.

## Projects
- [Deep Heights, Virar West](https://deepgroups.in/projects/deep-heights-virar): 2 & 3 BHK, ongoing, from ₹55 L, possession Dec 2028
- …

## Projects by station
- [Virar](https://deepgroups.in/projects/station/virar): 4 projects
- …

## Services
- [Society redevelopment](https://deepgroups.in/redevelopment)
- [Channel partner programme](https://deepgroups.in/channel-partner): for MahaRERA-registered agents

## Company
- [About](https://deepgroups.in/about-us)
- [Careers](https://deepgroups.in/career)
- [Contact](https://deepgroups.in/contact-us): +91 …, office address, hours
```

`/llms-full.txt`: the same outline with each project's full details (configurations, carpet areas, prices, amenities, connectivity, RERA numbers, FAQs) and the redevelopment page content, as plain Markdown.

```ts
// app/llms.txt/route.ts
export const dynamic = "force-static";
export function GET() {
  return new Response(buildLlmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

### 11.8 Open Graph images

`app/opengraph-image.tsx` (site default) and `app/projects/[slug]/opengraph-image.tsx` use `ImageResponse` to render 1200×630 images: project cover photo, maroon bar at the bottom with project name, locality and "from ₹X" in white, gold hairline, logo. Every share on WhatsApp and LinkedIn then shows the specific project, not a generic logo.

### 11.9 Other SEO and trust items

| Item | Detail |
|---|---|
| Google Search Console + Bing Webmaster Tools | Verify, submit sitemap |
| Google Business Profile | One per office; NAP (name, address, phone) must match `site.json` exactly |
| IndexNow | Optional: ping Bing/Yandex on deploy with changed URLs |
| `security.txt` | `/.well-known/security.txt` with a contact email |
| Canonical host | Redirect `www` → apex (or vice-versa) and `http` → `https` at the host level |
| Hreflang | Not needed while the site is English-only; add `en-IN`/`mr-IN` alternates if a Marathi version is added |
| RERA compliance | MahaRERA registration number and QR code on every project page and on any page advertising a project; disclaimer page linked in footer |

---

## 12. Performance and accessibility

**Performance**
1. All pages statically generated; only `/api/lead` runs on the server.
2. Hero image `priority` + `fetchPriority="high"`; all other images lazy.
3. Fonts via `next/font` (self-hosted, `display: swap`, subset `latin`).
4. Google Maps iframes replaced by a static image placeholder until clicked.
5. YouTube embeds use a lite-embed facade (thumbnail + play button).
6. reCAPTCHA loaded on first form interaction only (§9.4).
7. GTM with `afterInteractive`; audit tags quarterly, since third-party tags are the usual cause of poor INP.
8. Client JavaScript limited to: header dropdown/drawer, filters island, gallery, modal/forms. Everything else is server components.
9. Budgets: JS < 170 KB gzipped on project pages; hero image < 200 KB AVIF at 1080w.

**Accessibility (WCAG 2.2 AA)**
1. Keyboard-operable nav, dropdown, filters, modal (focus trap, Escape to close, focus returns to trigger), gallery.
2. Labels on every input (no placeholder-only fields); errors announced via `aria-live="polite"`.
3. Colour contrast per §10.1.
4. Touch targets ≥ 44×44px.
5. `prefers-reduced-motion` disables the hero entrance and carousel autoplay.
6. Skip-to-content link.

---

## 13. Environment and deployment

`.env.example`:

```
NEXT_PUBLIC_SITE_URL=https://www.deepgroups.in
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
GSCRIPT_WEBHOOK_URL=
GSCRIPT_SHARED_SECRET=
NEXT_PUBLIC_GTM_ID=
GOOGLE_SITE_VERIFICATION=
```

The domain above is a placeholder; replace it with the real one.

`next.config.ts` highlights:

```ts
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  trailingSlash: false,
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
  async redirects() { return []; }, // add old → new slugs here
};
```

**Deploy:** Vercel (recommended): connect repo, set env vars, every push to `main` rebuilds and re-derives stations, filters, sitemap and llms.txt from `/data`.

**Static-export fallback:** If the site must be hosted as static files (`output: "export"`, e.g. on shared hosting), the `/api/lead` route disappears. In that case the browser posts directly to Apps Script, and reCAPTCHA verification moves into Apps Script (`UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", …)` with the secret stored in Script Properties). The script URL becomes public, so server-side validation in Apps Script (name/mobile regex, honeypot, captcha score) is mandatory in that setup.

---

## 14. Content workflow

**Add a project**
1. Create `/data/projects/<slug>.json` following §5.3.
2. Add images to `/public/images/projects/<slug>/` and brochure to `/public/brochures/`.
3. If the station is new, confirm it exists in `stations.json`.
4. `npm run validate`, then commit. The project page, card, filters, nav dropdown, station page, sitemap, llms.txt and OG image all update on deploy.

**Change a project's status** (e.g. ongoing → completed): edit `status` and `updatedAt`. Filters and badges update automatically.

**Add a job:** append to `jobs.json` with `open: true`. Close it by setting `open: false`.

---

## 15. Launch checklist

- [ ] All `/data` files pass `npm run validate`
- [ ] Every project shows a MahaRERA number and QR code
- [ ] Forms tested: valid submit, invalid mobile (`12345`, `5876543210`), honeypot filled, sub-3-second submit, rate limit
- [ ] Rows land in the right sheet tab with UTM values; duplicate flag works; notification email arrives
- [ ] Channel partner form: rejects a bad MahaRERA agent number, lands in `ChannelPartners`, fires `cp_registration` (not `generate_lead`), notifies the CP desk
- [ ] Channel partner policies (tagging validity, payout terms) approved by the business before publishing
- [ ] reCAPTCHA keys are production keys registered for the live domain
- [ ] `generate_lead` fires once per submission in GTM preview; thank-you conversion recorded
- [ ] Rich Results Test passes for Home, a project, a station page, a job
- [ ] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/llms.txt` reachable
- [ ] Search Console verified, sitemap submitted
- [ ] Lighthouse mobile ≥ 90 on Home, Projects, one project page
- [ ] Keyboard-only walkthrough of nav, filters, modal, gallery
- [ ] Privacy policy (DPDP Act 2023), terms and RERA disclaimer published and linked in footer
- [ ] `Refrence.jpg` UI reference reviewed against §10
- [ ] Redevelopment page compared against the reference URL