import "server-only";
import { getAllProjects } from "@/lib/data/projects";
import { getActiveStations, getStations } from "@/lib/data/stations";
import { getAmenity, getFaqs, getPage, getSite } from "@/lib/data/content";
import { formatConfigs, formatPrice, possessionLabel, siteUrl } from "@/lib/utils";

const summary = () =>
  "Deep Group (Deep Builder & Developers) has built homes and industrial hubs in Nallasopara, Virar and Vasai for 25 years, with 25 completed projects. Tagline: Extraordinary Reach. Extraordinary Results.";

export function buildLlmsTxt() {
  const site = getSite();
  const projects = getAllProjects();
  const stationName = (s: string) => getStations().find((x) => x.slug === s)?.name ?? s;
  return [
    `# ${site.name}`,
    "",
    `> ${summary()}`,
    "",
    "## Projects",
    ...projects.map(
      (p) =>
        `- [${p.name}, ${p.location.locality}](${siteUrl(`/projects/${p.slug}`)}): ${formatConfigs(p.units.map((u) => u.label)) || p.category}, ${p.status}, ${
          p.price.min && !p.price.onRequest ? `from ${formatPrice(p.price.min)}` : "price on request"
        }, ${possessionLabel(p.status, p.possession).toLowerCase()}, near ${stationName(p.station)}${p.rera?.[0] ? `, MahaRERA ${p.rera[0].number}` : ""}`,
    ),
    "",
    "## Projects by station",
    ...getActiveStations().map((s) => `- [${s.name}](${siteUrl(`/projects/station/${s.slug}`)}): ${s.count} project${s.count === 1 ? "" : "s"}`),
    "",
    "## Services",
    `- [Society redevelopment](${siteUrl("/redevelopment")})`,
    `- [Channel partner programme](${siteUrl("/channel-partner")}): for MahaRERA-registered agents`,
    "",
    "## Company",
    `- [About](${siteUrl("/about-us")})`,
    `- [Careers](${siteUrl("/career")})`,
    `- [Contact](${siteUrl("/contact-us")}): ${site.phone}, ${site.offices[0]?.address}, ${site.hours}`,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt() {
  const site = getSite();
  const redev = getPage("redevelopment");
  const out = [`# ${site.name}`, "", `> ${summary()}`, ""];
  for (const p of getAllProjects()) {
    out.push(
      `## ${p.name}`,
      "",
      `URL: ${siteUrl(`/projects/${p.slug}`)}`,
      `${p.tagline}. ${p.description ?? ""}`.trim(),
      `- Category: ${p.category} (${p.subType}); status: ${p.status}`,
      `- Location: ${p.location.address}, ${p.location.locality}, ${p.location.city} ${p.location.pincode ?? ""}${p.location.distanceFromStation ? `; ${p.location.distanceFromStation} from station` : ""}`,
      `- Price: ${p.price.display}; possession: ${possessionLabel(p.status, p.possession)}`,
      `- MahaRERA: ${p.rera?.map((r) => `${r.number} (${r.phase})`).join(", ") ?? "details on request"}`,
      "- Configurations:",
      ...p.units.map((u) => `  - ${u.label}${u.carpetAreaSqft ? `: ${u.carpetAreaSqft[0]}–${u.carpetAreaSqft[1]} sq ft carpet` : ""}${u.priceFrom ? `, from ${formatPrice(u.priceFrom)}` : ""}`),
      `- Amenities: ${p.amenities.map((a) => getAmenity(a)?.label ?? a).join(", ")}`,
      `- Connectivity: ${p.connectivity.map((c) => `${c.place} (${c.distance})`).join(", ")}`,
      ...(p.faqs.length ? ["- FAQs:", ...p.faqs.map((f) => `  - Q: ${f.q} A: ${f.a}`)] : []),
      "",
    );
  }
  out.push(
    "## Society redevelopment",
    "",
    `${redev.hero.title} ${redev.hero.titleAccent}. ${redev.hero.subtitle}`,
    `- Current redevelopments: ${redev.completed.map((c) => `${c.name} (${c.society}, ${c.location})`).join("; ")}`,
    `- Benefits: ${redev.benefits.map((b) => `${b.title} (${b.text})`).join("; ")}`,
    `- Process: ${redev.process.map((s, i) => `${i + 1}. ${s.title}`).join(" → ")}`,
    `- ${redev.processNote}`,
    ...getFaqs("redevelopment").map((f) => `- Q: ${f.q} A: ${f.a}`),
    "",
    "## Contact",
    `${site.phone} · ${site.email} · ${site.offices.map((o) => `${o.label}: ${o.address}`).join(" · ")} · ${site.hours}`,
    "",
  );
  return out.join("\n");
}
