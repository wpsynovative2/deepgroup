import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Sans, Marcellus, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { LeadModalProvider } from "@/components/forms/LeadModalProvider";
import { RevealObserver } from "@/components/decor/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNavigation, getSeo, getSite } from "@/lib/data/content";
import { getActiveStations } from "@/lib/data/stations";
import { getAllProjects, getNavCategories } from "@/lib/data/projects";
import { graph, organizationLd, websiteLd } from "@/lib/seo/jsonld";
import { siteUrl } from "@/lib/utils";

const marcellus = Marcellus({ variable: "--font-marcellus", weight: "400", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"], display: "swap" });
const pinyon = Pinyon_Script({ variable: "--font-pinyon", weight: "400", subsets: ["latin"], display: "swap" });

const seo = getSeo();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.defaultDescription,
  applicationName: "Deep Group",
  authors: [{ name: "Deep Group" }],
  creator: "Deep Group",
  publisher: "Deep Group",
  formatDetection: { telephone: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  other: { "geo.region": "IN-MH", "geo.placename": "Virar" },
};

export const viewport: Viewport = { themeColor: "#650727" };

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const site = getSite();
  const nav = getNavigation();
  const stations = getActiveStations().map(({ slug, name, count }) => ({ slug, name, count }));
  const categories = getNavCategories().map(({ slug, count, comingSoon }) => ({ slug, count, comingSoon }));
  const projectNames = getAllProjects().map((p) => p.name);

  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`no-js ${marcellus.variable} ${instrument.variable} ${pinyon.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js')" }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        {GTM ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
        ) : null}
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-brand-700 px-5 py-3 text-white transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <JsonLd data={graph(organizationLd(site), websiteLd(site))} />
        <LeadModalProvider projects={projectNames}>
          <Header nav={nav.main} stations={stations} categories={categories} phone={site.phone} phoneHref={site.phoneHref} />
          <main id="main">{children}</main>
          <Footer />
          <MobileActionBar phoneHref={site.phoneHref} whatsapp={site.whatsapp} />
        </LeadModalProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
