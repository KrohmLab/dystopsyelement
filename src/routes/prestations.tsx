import { PageHero } from "../components/blocks/PageHero";
import { CtaBanner } from "../components/layout/CtaBanner";
import { Section } from "../components/layout/Section";
import { Eyebrow } from "../components/layout/SectionHeader";
import { Reveal } from "../components/motion/Reveal";
import { Brackets } from "../components/ui/Brackets";
import { Button } from "../components/ui/Button";
import { ResponsiveImage } from "../components/ui/ResponsiveImage";
import { services } from "../content/load.server";
import { cn } from "../lib/cn";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/prestations";

export function loader() {
  return { services };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Prestations", description: "Les prestations de Dystopsy Element : décoration, scénographie, arts vivants, production d'événements.", path: "/prestations" });

/** Prestations (SITE_PLAN §6) : une section ancrée par prestation, visuel alterné, CTA devis. */
export default function Prestations({ loaderData }: Route.ComponentProps) {
  const { services } = loaderData;
  return (
    <>
      <PageHero eyebrow="Prestations" title="Prestations" lead="Texte provisoire : une phrase sur les prestations de l'asso." image="festival/fond">
        <Button href="/contact?sujet=Prestation">Demander un devis</Button>
      </PageHero>

      {services.map((service, i) => (
        <Section key={service.slug} id={service.slug} tone={i % 2 ? "abyss" : "void"} labelledBy={`${service.slug}-titre`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn("group relative aspect-4/3 overflow-hidden chamfer-lg", i % 2 === 1 && "lg:order-2")}>
              <Brackets />
              <ResponsiveImage image={service.image} alt="" sizes="(min-width: 64rem) 40rem, 100vw" fallbackLabel={service.title} className="transition duration-slow ease-out-expo group-hover:scale-105" />
            </Reveal>
            <Reveal delay={120}>
              <Eyebrow tone={i % 2 ? "pink" : "cyan"}>{String(i + 1).padStart(2, "0")}</Eyebrow>
              <h2 id={`${service.slug}-titre`} className="text-h2 font-black">
                {service.title}
              </h2>
              <p className="mt-4 text-lead text-ink-soft">{service.tagline}</p>
              <ul className="mt-6 grid gap-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 before:size-2 before:shrink-0 before:bg-cyan before:chamfer-sm">
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={`/contact?sujet=Prestation&prestation=${service.slug}`}>Demander un devis</Button>
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <CtaBanner eyebrow="Devis" title="Un projet ?" primary={{ label: "Demander un devis", href: "/contact?sujet=Prestation" }} secondary={{ label: "Voir l'agenda", href: "/agenda" }} />
    </>
  );
}
