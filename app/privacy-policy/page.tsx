import { LegalPage } from "@/components/layout/LegalPage";
import { getPageSeo, getSite } from "@/lib/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...getPageSeo("/privacy-policy"), path: "/privacy-policy" });

export default function PrivacyPage() {
  const site = getSite();
  return (
    <LegalPage
      title="Privacy"
      accent="policy"
      updated="September 2026"
      path="/privacy-policy"
      sections={[
        { title: "Who we are", points: [`${site.legalName} is the data fiduciary for this website under the Digital Personal Data Protection Act, 2023.`] },
        { title: "What we collect", points: ["Name, mobile number and email you submit in our forms.", "Society details for redevelopment enquiries; résumés for job applications.", "Campaign parameters (UTM, gclid, fbclid) and pages visited, to measure our marketing."] },
        { title: "Why we collect it", points: ["To call you back about the project or service you asked about.", "To process job applications and channel partner registrations.", "To improve our website and advertising."] },
        { title: "Your consent", points: ["We process your data only after you tick the consent box on our forms.", "You can withdraw consent at any time by emailing us."] },
        { title: "Sharing", points: ["We do not sell your data.", "Service providers (Google Workspace, analytics, telephony) process data on our behalf under contract."] },
        { title: "Retention", points: ["Enquiry data is kept for up to 3 years, then deleted.", "Job applications are kept for 12 months."] },
        { title: "Your rights", points: ["Access, correct or erase your data.", "Nominate someone to exercise your rights.", "Raise a grievance with our Grievance Officer, then with the Data Protection Board of India."] },
        { title: "Contact", points: [`Grievance Officer: ${site.email}`, site.offices[0]?.address ?? ""] },
      ]}
    />
  );
}
