// Icônes au trait 24 px, épaisseur 1,5 (tracés Lucide et docs/styleguide.html). Décoratives : aria-hidden.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: 16 | 20 | 24 | 32 };

function Icon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="18" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);

export const MapPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

// Billet aux coins biseautés (comme les chamfers du site), encoches latérales, souche pointillée et losange.
export const TicketIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5h16l2 2v3a2 2 0 0 0 0 4v3l-2 2H4l-2-2v-3a2 2 0 0 0 0-4V7Z" />
    <path d="M15.5 5.5v2M15.5 11v2M15.5 16.5v2" />
    <path d="m8.5 9 2.5 3-2.5 3L6 12Z" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const MusicIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Icon>
);

export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

export const InstagramIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </Icon>
);

export const FacebookIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Icon>
);

export const SoundCloudIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 15v2M5 12v5M8 10v7M11 8v9M14 7h3a4 4 0 0 1 0 8h-3z" />
  </Icon>
);

export const YouTubeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </Icon>
);

// Icônes de l'expérience festival (page Nexen).
export const TreeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22v-6M8 16h8l-4-6 3 0-3-5-3 5h3l-4 6Z" />
  </Icon>
);

export const TentIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 21 12 4l8.5 17M12 4v17M8 21l4-6 4 6M2 21h20" />
  </Icon>
);

export const StoreIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 9 5 4h14l2 5M3 9h18M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8M10 20v-5h4v5" />
  </Icon>
);

export const FoodIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 2v8a2 2 0 0 0 4 0V2M9 10v12M17 2c-2 2-3 5-3 8h3v12" />
  </Icon>
);

export const FireIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-1 2-2 3-3 3-1-2-1-4 0-6-4 2-7 7-7 13 0 4 3 7 7 7Z" />
    <path d="M12 22a3 3 0 0 0 3-3c0-2-2-3-3-5-1 2-3 3-3 5a3 3 0 0 0 3 3Z" />
  </Icon>
);

export const YogaIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M12 7v6M5 10l7 3 7-3M8 21l4-8 4 8M5 21h14" />
  </Icon>
);

export const ArtIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" />
    <path d="m3 16 5-5 4 4 3-3 6 6" />
    <circle cx="15.5" cy="8.5" r="1.5" />
  </Icon>
);

export const DropIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12 5 5 9-10" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const GridIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Icon>
);

export const TimetableIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 4h18M3 4v16h18V4M12 4v16M3 9h4M3 14h4M15 7h4v5h-4zM8 11h3v6H8z" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ResetIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
  </Icon>
);
