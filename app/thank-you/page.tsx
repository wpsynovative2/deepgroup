import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, PhoneCall, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafSprig } from "@/components/decor/Botanical";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: "Thank you", description: "We have received your details.", path: "/thank-you", noindex: true });

const MESSAGES: Record<string, { title: string; text: string }> = {
  lead: { title: "Thank you!", text: "Our team will call you within one working day." },
  redevelopment: { title: "Request received", text: "Our redevelopment team will contact your society within two working days." },
  career: { title: "Application received", text: "Our HR team reviews every application and replies within a week." },
  "channel-partner": { title: "Welcome aboard", text: "Our CP desk will verify your documents within 3–5 working days." },
};

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { type } = await searchParams;
  const m = MESSAGES[typeof type === "string" ? type : "lead"] ?? MESSAGES.lead!;
  const steps = [
    { icon: PhoneCall, text: "We call you back" },
    { icon: CalendarCheck, text: "Plan a site visit" },
    { icon: Search, text: "Find your space" },
  ];

  return (
    <section className="grain relative flex min-h-[80vh] items-center overflow-hidden bg-cream pt-32 pb-20">
      <LeafSprig className="absolute top-24 -left-8 h-72 w-44 -rotate-12 text-gold-500/30" />
      <LeafSprig className="absolute -right-8 bottom-10 h-72 w-44 scale-x-[-1] text-brand-700/15" />
      <div className="container-x text-center">
        <span className="hero-rise relative mx-auto grid size-24 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold-500/20 [animation-duration:2.4s]" />
          <CheckCircle2 className="relative size-24 text-gold-500" strokeWidth={1} aria-hidden />
        </span>
        <h1 className="hero-rise mt-6 text-5xl md:text-6xl" style={{ "--d": 100 } as React.CSSProperties}>
          {m.title}
        </h1>
        <p className="hero-rise mx-auto mt-4 max-w-md text-lg text-muted" style={{ "--d": 200 } as React.CSSProperties}>
          {m.text}
        </p>
        <ol className="hero-rise mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3" style={{ "--d": 300 } as React.CSSProperties}>
          {steps.map(({ icon: I, text }, i) => (
            <li key={text} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm shadow-sm">
              <span className="grid size-7 place-items-center rounded-full bg-brand-700 text-xs text-white">{i + 1}</span>
              <I className="size-4 text-gold-500" aria-hidden /> {text}
            </li>
          ))}
        </ol>
        <div className="hero-rise mt-10 flex flex-wrap justify-center gap-3" style={{ "--d": 400 } as React.CSSProperties}>
          <ButtonLink href="/projects" size="lg">
            Browse projects <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <Link href="/" className="flex min-h-13 items-center px-6 text-brand-700 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
