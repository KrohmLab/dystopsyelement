import { getImage } from "../../lib/images";
import { InfoIcon, MusicIcon, TicketIcon } from "../icons";
import { Eyebrow } from "../layout/SectionHeader";
import { NeonFlicker } from "../motion/NeonFlicker";
import { Parallax } from "../motion/Parallax";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";

type Props = {
  dates: string;
  place: string;
  /** Billetterie si l'édition est à venir ; sinon le bouton mène à /nexen. */
  ticketUrl: string | null;
};

/** Bloc Nexen de l'accueil (SITE_PLAN §3.4) : logo néon sur écailles en parallaxe, tuiles-liens, CTA festival. */
export function NexenFeature({ dates, place, ticketUrl }: Props) {
  const logo = getImage("festival/logo-nexen");
  return (
    <section aria-labelledby="nexen-titre" data-floor="lilac" className="relative isolate overflow-hidden border-y border-pink-line px-gutter py-section text-center">
      <Parallax speed={80} mouse={0} className="hero-fade absolute -inset-y-24 inset-x-0 -z-20">
        <ResponsiveImage image="festival/ecailles" alt="" sizes="100vw" className="opacity-35" />
      </Parallax>
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-radial from-void/40 to-void/60 to-75%" />
      <div className="mx-auto flex max-w-site flex-col items-center">
        <Eyebrow tone="pink">Nexen</Eyebrow>
        <h2 id="nexen-titre" className="sr-only">
          Nexen Festival
        </h2>
        {logo && (
          <NeonFlicker className="w-[min(28rem,80%)]">
            <picture>
              <source type="image/avif" srcSet={logo.avif} sizes="28rem" />
              <img src={logo.src} srcSet={logo.webp} sizes="28rem" width={logo.width} height={logo.height} alt="Nexen Open Air Festival" loading="lazy" className="h-auto w-full" />
            </picture>
          </NeonFlicker>
        )}
        <p className="mt-2 text-lead">
          {dates} · {place}
        </p>
        <Reveal className="my-9 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button variant="secondary" icon={MusicIcon} href="/nexen#line-up">
            Line-up
          </Button>
          <Button variant="secondary" href="/nexen#univers">
            L'univers
          </Button>
          <Button variant="secondary" icon={InfoIcon} href="/nexen#infos">
            Infos pratiques
          </Button>
        </Reveal>
        {ticketUrl ? (
          <Button variant="festival" icon={TicketIcon} href={ticketUrl}>
            Billetterie
          </Button>
        ) : (
          <Button variant="festival" href="/nexen">
            Voir le festival
          </Button>
        )}
      </div>
    </section>
  );
}
