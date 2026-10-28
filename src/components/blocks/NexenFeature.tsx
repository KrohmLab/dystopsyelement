import { useRef, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";
import { getImage } from "../../lib/images";
import { useMotionLevel } from "../../lib/useMotionLevel";
import { ArrowRightIcon, InfoIcon, MusicIcon, TicketIcon } from "../icons";
import { Eyebrow } from "../layout/SectionHeader";
import { CountUp } from "../motion/CountUp";
import { DecodeText } from "../motion/DecodeText";
import { NeonFlicker } from "../motion/NeonFlicker";
import { Parallax } from "../motion/Parallax";
import { Reveal } from "../motion/Reveal";
import { Brackets } from "../ui/Brackets";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";

export type NexenStage = { slug: "nexus" | "engine"; name: string; role: string; families: string[]; artists: string[] };

type Props = {
  title: string;
  dates: string;
  place: string;
  tagline: string;
  facts: { value: string; label: string }[];
  stages: NexenStage[];
  /** Billetterie si l'édition est à venir ; sinon le bouton mène à /nexen. */
  ticketUrl: string | null;
};

// Couleurs des scènes (DESIGN_SYSTEM §7.16 ter) : Nexus lilas, Engine pêche.
const STAGE_TONE = {
  nexus: { text: "text-nexen-lilac", ring: "inset-ring-nexen-lilac-line hover:inset-ring-nexen-lilac" },
  engine: { text: "text-nexen-peach", ring: "inset-ring-nexen-peach-line hover:inset-ring-nexen-peach" },
} as const;

/**
 * Bloc Nexen de l'accueil (SITE_PLAN §3.4) : un « portail » vers le festival. À gauche, le logo néon dans un
 * sceau qui tourne (anneaux de l'affiche) et s'ouvre à son arrivée à l'écran, incliné vers le curseur ; à droite, les chiffres
 * de l'édition, puis les deux scènes avec le défilé de leurs artistes. Survoler une scène teinte tout le bloc à sa
 * couleur. Styles et animations dans theme.css (.nexen-feature) ; mouvement réduit : tout est immobile.
 */
export function NexenFeature({ title, dates, place, tagline, facts, stages, ticketUrl }: Props) {
  const logo = getImage("festival/logo-nexen");
  const ref = useRef<HTMLElement>(null);
  const level = useMotionLevel();

  // Inclinaison du logo et du sceau vers le curseur (PC uniquement), en variables CSS de -1 à 1.
  const tilt = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || level !== "full" || event.pointerType !== "mouse") return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--tx", (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--ty", (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
  };
  const reset = () => {
    ref.current?.style.setProperty("--tx", "0");
    ref.current?.style.setProperty("--ty", "0");
  };

  return (
    <section
      ref={ref}
      aria-labelledby="nexen-titre"
      data-floor="lilac"
      onPointerMove={tilt}
      onPointerLeave={reset}
      className="nexen-feature relative isolate overflow-hidden border-y border-pink-line px-gutter py-section"
    >
      <Parallax speed={80} mouse={0} className="hero-fade absolute -inset-y-24 inset-x-0 -z-30">
        <ResponsiveImage image="festival/ecailles" alt="" sizes="100vw" className="opacity-25" />
      </Parallax>
      <span aria-hidden="true" className="nexen-feature__aura nexen-feature__aura--nexus" />
      <span aria-hidden="true" className="nexen-feature__aura nexen-feature__aura--engine" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines opacity-50" />

      <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Le sceau : anneaux de l'affiche autour du logo */}
        <div className="nexen-feature__core relative flex flex-col items-center text-center">
          <span aria-hidden="true" className="nexen-feature__sigil">
            <Sigil />
          </span>
          {logo && (
            <div className="nexen-feature__tilt relative w-[min(26rem,84%)]">
              <NeonFlicker className="nexen-feature__logo">
                <picture>
                  <source type="image/avif" srcSet={logo.avif} sizes="26rem" />
                  <img src={logo.src} srcSet={logo.webp} sizes="26rem" width={logo.width} height={logo.height} alt="Nexen Open Air Festival" loading="lazy" className="h-auto w-full" />
                </picture>
              </NeonFlicker>
            </div>
          )}
          <p className="relative mt-4 font-display text-label-lg font-bold text-ink uppercase">
            <DecodeText text={dates} duration={1200} />
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            <DecodeText text={place} duration={1200} />
          </p>
          <p className="relative mt-2 text-small text-ink-muted">{tagline}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          <div>
            <Eyebrow tone="pink">Le festival de l'asso</Eyebrow>
            <h2 id="nexen-titre" className="text-h2 font-black">
              {title}
            </h2>
          </div>

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden bg-line chamfer-md sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end gap-1 bg-abyss/90 p-4">
                  <dt className="text-micro font-semibold whitespace-nowrap text-ink-muted uppercase">{fact.label}</dt>
                  <dd className="font-display text-h3 font-black text-ink text-glow-cyan">
                    <CountUp value={fact.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="grid grid-cols-1 gap-4">
            {stages.map((stage, i) => (
              <Reveal as="li" key={stage.slug} delay={i * 120}>
                <StageCard stage={stage} reverse={i % 2 === 1} />
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            {ticketUrl ? (
              <Button variant="festival" icon={TicketIcon} href={ticketUrl}>
                Billetterie
              </Button>
            ) : (
              <Button variant="festival" href="/nexen">
                Voir le festival
              </Button>
            )}
            <nav aria-label="Le festival en bref" className="flex flex-wrap gap-2">
              <Chip href="/nexen#line-up" icon={<MusicIcon size={16} />}>
                Line-up
              </Chip>
              <Chip href="/nexen#univers">L'univers</Chip>
              <Chip href="/nexen#infos" icon={<InfoIcon size={16} />}>
                Infos pratiques
              </Chip>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Une scène : nom, rôle, styles, puis ses artistes qui défilent. Lien vers le line-up complet. */
function StageCard({ stage, reverse }: { stage: NexenStage; reverse: boolean }) {
  const tone = STAGE_TONE[stage.slug];
  return (
    <Link
      to="/nexen#line-up"
      prefetch="intent"
      data-stage={stage.slug}
      className={cn("nexen-stage group relative block overflow-hidden bg-surface/80 p-5 no-underline inset-ring transition-shadow duration-base chamfer-md", tone.ring)}
    >
      <Brackets />
      <span className="flex items-baseline justify-between gap-4">
        <span className={cn("font-display text-h3 font-black uppercase", tone.text)}>{stage.name}</span>
        <span className="flex items-center gap-2 text-micro font-semibold text-ink-muted uppercase">
          {stage.role}
          <ArrowRightIcon size={16} className={cn("transition-transform duration-base ease-out-expo group-hover:translate-x-1", tone.text)} />
        </span>
      </span>
      <span className="mt-1 block text-small text-ink-soft">{stage.families.join(" · ")}</span>
      {stage.artists.length > 0 && (
        <>
          <span aria-hidden="true" className="nexen-stage__marquee mt-4 block">
            <span className={cn("nexen-stage__track", reverse && "nexen-stage__track--reverse")}>
              {[...stage.artists, ...stage.artists].map((artist, i) => (
                <span key={i} className="font-display text-label font-bold whitespace-nowrap text-ink-muted uppercase transition-colors duration-base group-hover:text-ink">
                  {artist}
                  <span className={cn("ml-6", tone.text)}>✦</span>
                </span>
              ))}
            </span>
          </span>
          <span className="sr-only">
            {stage.artists.length} artistes : voir le line-up
          </span>
        </>
      )}
    </Link>
  );
}

function Chip({ href, icon, children }: { href: string; icon?: ReactNode; children: string }) {
  return (
    <Link
      to={href}
      prefetch="intent"
      className="inline-flex min-h-11 items-center gap-2 bg-void/60 px-4 font-display text-label-sm font-bold text-ink-soft uppercase no-underline inset-ring inset-ring-line-strong transition-colors duration-fast chamfer-sm hover:text-ink hover:inset-ring-pink"
    >
      {icon}
      {children}
    </Link>
  );
}

/** Sceau décoratif : anneaux pointillés, hexagones et repères, inspirés du cadre et de l'œil de l'affiche 2026. */
function Sigil() {
  return (
    <svg viewBox="0 0 400 400" className="size-full" fill="none" stroke="currentColor">
      <g className="nexen-sigil__ring nexen-sigil__ring--slow">
        <circle cx="200" cy="200" r="190" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="200" cy="200" r="176" strokeWidth="1.5" strokeDasharray="60 14 6 14" />
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M200 4v14" strokeWidth="2" transform={`rotate(${i * 15} 200 200)`} />
        ))}
      </g>
      <g className="nexen-sigil__ring nexen-sigil__ring--reverse">
        <polygon points="200,52 328,126 328,274 200,348 72,274 72,126" strokeWidth="1.5" strokeDasharray="14 8" />
        <circle cx="200" cy="200" r="132" strokeWidth="3" strokeDasharray="4 24" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle key={angle} cx="200" cy="52" r="5" fill="currentColor" stroke="none" transform={`rotate(${angle} 200 200)`} />
        ))}
      </g>
      <g className="nexen-sigil__ring nexen-sigil__ring--fast">
        <circle cx="200" cy="200" r="104" strokeWidth="1" strokeDasharray="1 6" />
        <path d="M200 84a116 116 0 0 1 116 116M200 316A116 116 0 0 1 84 200" strokeWidth="4" strokeLinecap="square" />
      </g>
    </svg>
  );
}
