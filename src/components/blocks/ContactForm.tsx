import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Field } from "../ui/Field";

const ENDPOINT = "https://api.web3forms.com/submit";
// Clé publique Web3Forms (variable de build Workers Builds, CLAUDE.md §6) ; absente : formulaire non branché.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulaire de contact (SITE_PLAN §8) : fonctionne sans JavaScript (envoi classique vers Web3Forms),
 * envoi en arrière-plan avec états d'envoi / succès / erreur sinon. Honeypot anti-spam et case RGPD.
 */
export function ContactForm({ subjects, defaultSubject }: { subjects: string[]; defaultSubject?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ACCESS_KEY) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(event.currentTarget) });
      const result = (await response.json()) as { success?: boolean };
      setStatus(result.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="bg-cyan-dim p-8 inset-ring inset-ring-cyan-line chamfer-md">
        <p className="font-display text-h3 font-bold text-cyan uppercase">Message envoyé</p>
        <p className="mt-2 text-ink-soft">Merci, nous vous répondons rapidement.</p>
      </div>
    );
  }

  return (
    <form action={ENDPOINT} method="POST" onSubmit={onSubmit} className="grid gap-5">
      {ACCESS_KEY && <input type="hidden" name="access_key" value={ACCESS_KEY} />}
      <input type="hidden" name="subject" value="Message depuis le site Dystopsy Element" />
      {/* Honeypot : invisible pour les visiteurs, rempli par les robots. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" name="prenom" placeholder="Votre prénom" autoComplete="given-name" required />
        <Field label="Nom" name="nom" placeholder="Votre nom" autoComplete="family-name" required />
      </div>
      <Field label="E-mail" name="email" type="email" placeholder="vous@exemple.fr" autoComplete="email" required />
      <Field label="Sujet" name="sujet" type="select" options={subjects} defaultValue={defaultSubject} key={defaultSubject} />
      <Field label="Message" name="message" type="textarea" rows={6} placeholder="Votre message" required />
      <Checkbox name="rgpd" required>
        J'accepte que mes données soient utilisées pour répondre à ma demande (voir les mentions légales).
      </Checkbox>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">{status === "sending" ? "Envoi…" : "Envoyer"}</Button>
        <p role="status" aria-live="polite" className="text-small text-danger">
          {status === "error" && (ACCESS_KEY ? "L'envoi a échoué. Réessayez ou écrivez-nous par e-mail." : "Formulaire pas encore branché (clé Web3Forms à configurer).")}
        </p>
      </div>
    </form>
  );
}
