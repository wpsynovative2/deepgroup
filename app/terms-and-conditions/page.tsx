import { LegalPage } from "@/components/layout/LegalPage";
import { getPageSeo } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...getPageSeo("/terms-and-conditions"), path: "/terms-and-conditions" });

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms &"
      accent="conditions"
      updated="September 2026"
      path="/terms-and-conditions"
      sections={[
        { title: "Use of this site", points: ["Content is for general information only and is not an offer or contract.", "Do not misuse forms or attempt to disrupt the site."] },
        { title: "Project information", points: ["Plans, specifications, prices and images may change without notice.", "The registered agreement for sale prevails over anything on this site."] },
        { title: "Intellectual property", points: ["All text, images, logos and renders belong to Deep Group or its licensors."] },
        { title: "Liability", points: ["We are not liable for decisions made solely on the basis of this website."] },
        { title: "Governing law", points: ["These terms are governed by the laws of India. Courts in Palghar, Maharashtra have jurisdiction."] },
      ]}
    />
  );
}
