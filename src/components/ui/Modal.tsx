import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "../../lib/useHydrated";
import { useModal } from "../../lib/useModal";
import { CloseIcon } from "../icons";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Titre lu par les lecteurs d'écran (nom de l'artiste, du membre…). */
  label: string;
  children: ReactNode;
};

/**
 * Fenêtre modale (DESIGN_SYSTEM §7.16 bis) : rendue hors de #contenu, focus piégé, Échap,
 * clic sur le fond, page inerte et focus rendu à l'élément d'origine (useModal, comme Outrance).
 */
export function Modal({ open, onClose, label, children }: Props) {
  const hydrated = useHydrated();
  const panelRef = useRef<HTMLDivElement>(null);
  useModal({ open, onClose, containers: [panelRef] });
  if (!hydrated || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-gutter">
      <button type="button" aria-label="Fermer" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default bg-void/85 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="modal-in relative max-h-full w-full max-w-3xl overflow-y-auto bg-cyan-line p-px chamfer-lg"
      >
        <div className="relative bg-surface-raised chamfer-lg">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center text-ink transition-colors duration-fast hover:text-cyan"
          >
            <CloseIcon size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
