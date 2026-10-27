import { Button } from "../ui/Button";
import { Eyebrow } from "./SectionHeader";
import { Section } from "./Section";

type Action = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  primary: Action;
  secondary?: Action;
};

/** Bandeau d'appel à l'action de fin de page (DESIGN_SYSTEM §7.9) : 1 bouton rose + 1 secondaire. */
export function CtaBanner({ eyebrow, title, lead, primary, secondary }: Props) {
  return (
    <Section tone="abyss" grid className="border-t border-line text-center">
      <div className="flex flex-col items-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-h2 font-black">{title}</h2>
        {lead && <p className="mt-4 max-w-prose text-lead text-ink-soft">{lead}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" href={primary.href}>
            {primary.label}
          </Button>
          {secondary && (
            <Button variant="secondary" size="lg" href={secondary.href}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
