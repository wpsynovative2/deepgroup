import "server-only";
import site from "@/data/site.json";
import navigation from "@/data/navigation.json";
import amenities from "@/data/amenities.json";
import testimonials from "@/data/testimonials.json";
import faqs from "@/data/faqs.json";
import seo from "@/data/seo.json";
import home from "@/data/pages/home.json";
import about from "@/data/pages/about.json";
import redevelopment from "@/data/pages/redevelopment.json";
import career from "@/data/pages/career.json";
import channelPartner from "@/data/pages/channel-partner.json";
import contact from "@/data/pages/contact.json";
import categories from "@/data/categories.json";
import legacy from "@/data/legacy.json";
import { SiteSchema } from "@/lib/schemas/site.schema";

const pages = { home, about, redevelopment, career, "channel-partner": channelPartner, contact };
type Pages = typeof pages;

export const getSite = () => SiteSchema.parse(site);
export const getNavigation = () => navigation;
export const getAmenities = () => amenities;
export const getAmenity = (id: string) => amenities.find((a) => a.id === id);
export const getTestimonials = () => testimonials as Array<{ name: string; project: string; quote: string; rating?: number }>;
export const getCategoryContent = () => categories as Array<{
  slug: "residential" | "commercial" | "industrial"; title: string; accent: string; blurb: string; icon: string; comingSoon: boolean;
}>;
export const getLegacy = () => legacy as Array<{ name: string; locality: string; type: "residential" | "industrial" }>;
export const getFaqs = <K extends keyof typeof faqs>(page: K) => faqs[page];
export const getSeo = () => seo;
export const getPageSeo = (path: keyof typeof seo.pages) => seo.pages[path];
export const getPage = <K extends keyof Pages>(name: K): Pages[K] => pages[name];
