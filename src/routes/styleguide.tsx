// Page interne du design system (CLAUDE.md §8, phase 1) : composants ui/, layout/, motion/ et Portal dans leurs états.
// Non indexée et exclue du sitemap. Exemples tirés des données réelles (SITE_PLAN §9) et des libellés d'interface.
import { useState } from "react";
import { Portal } from "../components/blocks/Portal";
import { CalendarIcon, InfoIcon, MapPinIcon, MusicIcon, TicketIcon } from "../components/icons";
import { CtaBanner } from "../components/layout/CtaBanner";
import { Logo } from "../components/layout/Logo";
import { Section } from "../components/layout/Section";
import { Eyebrow, SectionHeader } from "../components/layout/SectionHeader";
import { DecodeText } from "../components/motion/DecodeText";
import { GridFloor } from "../components/motion/GridFloor";
import { NeonFlicker } from "../components/motion/NeonFlicker";
import { NeonFrame } from "../components/motion/NeonFrame";
import { Parallax } from "../components/motion/Parallax";
import { Reveal } from "../components/motion/Reveal";
import { Accordion } from "../components/ui/Accordion";
import { Badge } from "../components/ui/Badge";
import { Brackets } from "../components/ui/Brackets";
import { Button } from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import { Divider } from "../components/ui/Divider";
import { Field } from "../components/ui/Field";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/styleguide";

export const meta: Route.MetaFunction = () => pageMeta({ title: "Design system", path: "/styleguide", noindex: true });

const NEXEN_TICKETS = "https://www.helloasso.com/associations/dystopsy-elements/evenements/nexen-festival-2026";

const SWATCHES = [
  { name: "void", role: "fond", className: "bg-void" },
  { name: "abyss", role: "alterné", className: "bg-abyss" },
  { name: "surface", role: "cartes", className: "bg-surface" },
  { name: "surface-raised", role: "survol", className: "bg-surface-raised" },
  { name: "line", role: "bordures", className: "bg-line" },
  { name: "line-strong", role: "séparateurs", className: "bg-line-strong" },
  { name: "ink", role: "titres", className: "bg-ink" },
  { name: "ink-soft", role: "texte", className: "bg-ink-soft" },
  { name: "ink-muted", role: "méta", className: "bg-ink-muted" },
  { name: "ink-faint", role: "décor", className: "bg-ink-faint" },
  { name: "cyan", role: "navigation", className: "bg-cyan" },
  { name: "pink", role: "conversion", className: "bg-pink" },
  { name: "danger", role: "erreurs", className: "bg-danger" },
];

const TYPE_SCALE = [
  { token: "display", spec: "40 → 88 px · 900", className: "font-display text-display font-black text-ink uppercase", sample: "Nexen" },
  { token: "h1", spec: "32 → 60 px · 900", className: "font-display text-h1 font-black text-ink uppercase", sample: "Agenda" },
  { token: "h2", spec: "28 → 48 px · 900", className: "font-display text-h2 font-black text-ink uppercase", sample: "Prochaines dates" },
  { token: "h3", spec: "18 → 24 px · 700", className: "font-display text-h3 font-bold text-ink uppercase", sample: "Nexen's Home" },
  { token: "lead", spec: "18 → 22 px · 500", className: "text-lead text-ink-soft", sample: "Open air festival · Psytrance, techno, bass, chill." },
  { token: "body", spec: "18 px · 500", className: "text-body", sample: "Nexen's Home, jeudi 7 mai 2026, à La Maison Café, Nantes." },
  { token: "small", spec: "16 px · 500", className: "text-small text-ink-muted", sample: "La Maison Café, Nantes" },
  { token: "label", spec: "13 px · 700 · 0.2em", className: "font-display text-label font-bold text-ink uppercase", sample: "Voir le line-up" },
  { token: "eyebrow", spec: "12 px · 700 · 0.3em", className: "font-display text-eyebrow font-bold text-cyan uppercase", sample: "// Prestations" },
  { token: "micro", spec: "12 px · 600 · 0.1em", className: "text-micro font-semibold text-ink-muted uppercase", sample: "Jeu. 7 mai 2026 · Nantes" },
];

const DEMO_LABEL = "mb-3 text-micro font-semibold text-ink-muted uppercase";

/** Démo du hero de l'accueil en « mode spectacle » (DESIGN_SYSTEM §6.2). */
function SpectacleDemo() {
  const [run, setRun] = useState(0);
  return (
    <section aria-labelledby="sg-titre" className="relative isolate flex min-h-svh items-center overflow-hidden border-b border-line bg-void pt-header">
      <Parallax speed={40} mouse={16} className="absolute inset-0 -z-10 flex items-center justify-end pr-gutter">
        <Logo className="size-[min(60vw,32rem)] text-cyan opacity-10" />
      </Parallax>
      <GridFloor className="absolute inset-x-0 bottom-0 -z-10 h-1/2" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />
      <div className="absolute inset-x-6 top-24 bottom-6 -z-10 hidden lg:block">
        <NeonFrame key={`frame-${run}`} className="size-full" />
      </div>

      <div className="mx-auto w-full max-w-site px-gutter py-section">
        <Badge variant="neutral">Prochaine édition à venir</Badge>
        <h1 id="sg-titre" className="glitch mt-5 mb-5 max-w-4xl text-display font-black" data-text="Nexen Festival 2026">
          <DecodeText key={`title-${run}`} text="Nexen Festival 2026" />
        </h1>
        <p className="mb-9 flex flex-wrap gap-x-7 gap-y-3 text-lead">
          <span className="inline-flex items-center gap-2.5">
            <CalendarIcon className="text-cyan" />5 – 7 juin 2026
          </span>
          <span className="inline-flex items-center gap-2.5">
            <MapPinIcon className="text-cyan" />
            Maine-et-Loire
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" href="#sg-portails">
            Voir le festival
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setRun((n) => n + 1)}>
            Rejouer l'intro
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <>
      <SpectacleDemo />

      <Section tone="abyss" labelledBy="sg-portails">
        <SectionHeader id="sg-portails" eyebrow="Portails" title="Où aller" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0}>
            <Portal label="Nexen" eyebrow="01" href="#sg-portails" />
          </Reveal>
          <Reveal delay={120}>
            <Portal label="Agenda" eyebrow="02" href="#sg-portails" />
          </Reveal>
          <Reveal delay={240}>
            <Portal label="Billetterie" eyebrow="03" href={NEXEN_TICKETS} />
          </Reveal>
          <Reveal delay={360}>
            <Portal label="Contact" eyebrow="04" href="#sg-portails" className="lg:col-span-2" />
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="sg-animations">
        <SectionHeader id="sg-animations" eyebrow="Animations" title="Mode spectacle" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative grid min-h-64 place-items-center bg-surface p-8 chamfer-md">
            <p className={`${DEMO_LABEL} absolute top-4 left-6`}>NeonFlicker</p>
            <NeonFlicker className="text-cyan">
              <Logo className="size-28" />
            </NeonFlicker>
          </div>
          <div className="relative min-h-64 overflow-hidden bg-surface chamfer-md">
            <p className={`${DEMO_LABEL} absolute top-4 left-6`}>GridFloor + NeonFrame</p>
            <GridFloor className="absolute inset-x-0 bottom-0 h-3/4" />
            <div className="absolute inset-4">
              <NeonFrame className="size-full" />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="abyss" labelledBy="sg-couleurs">
        <SectionHeader id="sg-couleurs" eyebrow="Couleurs" title="Deux accents, deux rôles" />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="bg-surface chamfer-md">
              <div className={`h-20 border-b border-line ${swatch.className}`} />
              <p className="px-3 pt-2.5 pb-3 text-small">
                <b className="block font-display text-eyebrow text-ink uppercase">{swatch.name}</b>
                {swatch.role}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="sg-typo">
        <SectionHeader id="sg-typo" eyebrow="Typographie" title="Orbitron parle fort" />
        <dl>
          {TYPE_SCALE.map((row) => (
            <div key={row.token} className="grid items-baseline gap-1.5 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-small text-ink-muted">
                <b className="block font-semibold text-cyan">{row.token}</b>
                {row.spec}
              </dt>
              <dd className={row.className}>{row.sample}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="abyss" labelledBy="sg-boutons">
        <SectionHeader id="sg-boutons" eyebrow="Boutons" title="Quatre variantes" />
        <div className="grid gap-8">
          <div>
            <p className={DEMO_LABEL}>primary · sm / md / lg · icône</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" href="#sg-boutons">
                Billets
              </Button>
              <Button icon={TicketIcon} href="#sg-boutons">
                Billetterie
              </Button>
              <Button size="lg" href="#sg-boutons">
                Demander un devis
              </Button>
              <Button type="submit">Envoyer</Button>
            </div>
          </div>
          <div>
            <p className={DEMO_LABEL}>secondary · lien externe</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" size="sm" icon={MusicIcon} href="#sg-boutons">
                Line-up
              </Button>
              <Button variant="secondary" icon={InfoIcon} href="#sg-boutons">
                Infos pratiques
              </Button>
              <Button variant="secondary" size="lg" href="https://www.facebook.com/events/1363260745173238">
                Événement Facebook
              </Button>
            </div>
          </div>
          <div>
            <p className={DEMO_LABEL}>ghost</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="ghost" href="#sg-boutons">
                Tout l'agenda
              </Button>
              <Button variant="ghost" href="#sg-boutons">
                Découvrir
              </Button>
            </div>
          </div>
          <div>
            <p className={DEMO_LABEL}>festival · réservé au CTA Nexen</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="festival" icon={TicketIcon} href={NEXEN_TICKETS}>
                Billetterie
              </Button>
              <Button variant="festival" href="#sg-boutons">
                Voir le festival
              </Button>
            </div>
          </div>
          <div>
            <p className={DEMO_LABEL}>pleine largeur</p>
            <div className="max-w-sm">
              <Button fullWidth size="lg" icon={TicketIcon} href="#sg-boutons">
                Billetterie
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="sg-badges">
        <SectionHeader id="sg-badges" eyebrow="Badges" title="États et ornements" />
        <p className={DEMO_LABEL}>live · info · neutral · outline</p>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="live">Dernières places</Badge>
          <Badge variant="info">À venir</Badge>
          <Badge variant="neutral">Passé</Badge>
          <Badge variant="outline">Complet</Badge>
        </div>
        <p className={`${DEMO_LABEL} mt-10`}>Brackets · survoler le bloc</p>
        <div className="group relative max-w-md bg-surface p-7 transition-colors duration-base hover:bg-surface-raised">
          <Brackets />
          <p className="text-micro font-semibold text-cyan uppercase">5 – 7 juin 2026</p>
          <h3 className="mt-2 text-h3 font-bold">Nexen Festival 2026</h3>
          <p className="mt-2 inline-flex items-center gap-2 text-small text-ink-muted">
            <MapPinIcon size={16} className="text-cyan" />
            Maine-et-Loire
          </p>
        </div>
        <p className={`${DEMO_LABEL} mt-10`}>Divider</p>
      </Section>
      <Divider />

      <Section tone="abyss" labelledBy="sg-formulaire">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader id="sg-formulaire" eyebrow="Formulaire" title="Nous écrire" />
            <form className="grid max-w-xl gap-5" onSubmit={(event) => event.preventDefault()}>
              <Field label="Nom" name="nom" placeholder="Votre nom" autoComplete="name" />
              <Field
                label="E-mail"
                name="email"
                type="email"
                defaultValue="vous@"
                autoComplete="email"
                error="Ajoutez le domaine de votre adresse, par exemple vous@exemple.fr."
              />
              <Field label="Sujet" name="sujet" type="select" options={["Billetterie", "Prestation"]} />
              <Field label="Message" name="message" type="textarea" rows={4} placeholder="Votre message" />
              <Checkbox name="rgpd">J'accepte que mes données soient utilisées pour répondre à ma demande.</Checkbox>
              <div>
                <Button type="submit">Envoyer</Button>
              </div>
            </form>
          </div>
          <div>
            <SectionHeader eyebrow="Accordion" title="Avant de venir" />
            <Accordion question="Où a lieu le Nexen Festival 2026 ?" open>
              <p>En Maine-et-Loire, du 5 au 7 juin 2026.</p>
            </Accordion>
            <Accordion question="Où acheter les billets ?">
              <p>
                Sur <a href={NEXEN_TICKETS}>HelloAsso</a>.
              </p>
            </Accordion>
          </div>
        </div>
      </Section>

      <Section grid labelledBy="sg-section">
        <SectionHeader
          id="sg-section"
          eyebrow="Agenda"
          title="Prochaines dates"
          lead="Section avec trame de grille et action alignée à droite."
          action={
            <Button variant="ghost" href="#sg-section">
              Tout l'agenda
            </Button>
          }
        />
        <div className="flex flex-col items-center text-center">
          <Eyebrow tone="pink">Shop</Eyebrow>
          <h2 className="text-h2 font-black">La boutique est sur Vinted</h2>
        </div>
      </Section>

      <CtaBanner
        eyebrow="Contact"
        title="Nous écrire"
        primary={{ label: "Nous écrire", href: "#sg-formulaire" }}
        secondary={{ label: "Voir l'agenda", href: "#sg-section" }}
      />
    </>
  );
}
