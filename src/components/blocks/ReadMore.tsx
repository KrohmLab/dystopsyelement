import { useId, useState } from "react";
import { Button } from "../ui/Button";

/**
 * Résumé dépliable (v1 « Transmission ») : le premier paragraphe, puis « Lire la suite ».
 * Le HTML complet est pré-rendu ; sans JavaScript, tout est visible.
 */
export function ReadMore({ html }: { html: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const [first, ...rest] = html.split(/(?<=<\/p>)\s*/);
  const more = rest.join("");
  return (
    <div className="max-w-prose text-lead text-ink-soft [&_p+p]:mt-4">
      <div dangerouslySetInnerHTML={{ __html: first ?? "" }} />
      {more && (
        <>
          <div id={id} hidden={!open} className="mt-4" dangerouslySetInnerHTML={{ __html: more }} />
          <div className="mt-6">
            <Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-controls={id} aria-expanded={open}>
              {open ? "Réduire" : "Lire la suite"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
