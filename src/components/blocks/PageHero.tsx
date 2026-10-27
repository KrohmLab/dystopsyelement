import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Eyebrow } from "../layout/SectionHeader";
import { ResponsiveImage } from "../ui/ResponsiveImage";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Visuel de fond (clé de assets/images.json). */
  image?: string | null;
  className?: string;
  children?: ReactNode;
};

/** En-tête des pages intérieures : visuel assombri + scanlines, sur-titre, H1 glitch, une ligne, actions. */
export function PageHero({ eyebrow, title, lead, image, className, children }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line px-gutter pt-header", className)}>
      {image && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <ResponsiveImage image={image} alt="" sizes="100vw" priority className="opacity-40 mix-blend-luminosity" />
          <span className="absolute inset-0 bg-linear-to-t from-void/90 via-void/50 to-void/80" />
        </div>
      )}
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />
      <div className="mx-auto flex max-w-site flex-col items-start py-section">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="glitch text-h1 font-black" data-text={title}>
          {title}
        </h1>
        {lead && <p className="mt-4 max-w-prose text-lead text-ink-soft">{lead}</p>}
        {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
      </div>
    </section>
  );
}
