import { useState } from "react";
import { Button } from "../ui/Button";

/** Partager la page : feuille de partage du téléphone, sinon copie du lien. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };
  return (
    <>
      <Button variant="secondary" onClick={share}>
        {copied ? "Lien copié" : "Partager"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Lien copié dans le presse-papiers" : ""}
      </span>
    </>
  );
}
