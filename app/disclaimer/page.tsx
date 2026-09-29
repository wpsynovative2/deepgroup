import { LegalPage } from "@/components/layout/LegalPage";
import { getPageSeo } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...getPageSeo("/disclaimer"), path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="RERA"
      accent="disclaimer"
      updated="September 2026"
      path="/disclaimer"
      sections={[
        { title: "MahaRERA registration", points: ["Every Deep Group project advertised on this site is registered with MahaRERA, or its registration has been applied for.", "Registration numbers and QR codes are shown on each project page.", "Verify details at maharera.maharashtra.gov.in."] },
        { title: "Visuals", points: ["Images, renders and walkthroughs are artist's impressions.", "Furniture, fixtures and landscaping shown are not part of the standard offering unless stated in the agreement."] },
        { title: "Areas & prices", points: ["Areas are RERA carpet areas unless stated otherwise.", "Prices exclude stamp duty, registration, GST and other charges, and may change without notice."] },
        { title: "No offer", points: ["Nothing on this site is a legal offer. The agreement for sale is the only binding document."] },
      ]}
    />
  );
}
