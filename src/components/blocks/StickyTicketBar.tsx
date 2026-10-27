import { TicketIcon } from "../icons";
import { Button } from "../ui/Button";
import { ShareButton } from "./ShareButton";

/** Barre d'actions collante en bas d'écran sur mobile (fiche événement) : billetterie + partage. */
export function StickyTicketBar({ ticketUrl, title }: { ticketUrl: string | null; title: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-cyan-line bg-abyss/90 px-gutter py-3 backdrop-blur-lg md:hidden">
      {ticketUrl && (
        <Button icon={TicketIcon} href={ticketUrl} fullWidth>
          Prendre ma place
        </Button>
      )}
      <ShareButton title={title} />
    </div>
  );
}
