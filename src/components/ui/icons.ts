// Registre des icônes Lucide utilisées sur le site : seules celles-ci finissent dans le build.
import ArrowRight from "@lucide/astro/icons/arrow-right";
import ArrowUpRight from "@lucide/astro/icons/arrow-up-right";
import Calendar from "@lucide/astro/icons/calendar";
import Info from "@lucide/astro/icons/info";
import MapPin from "@lucide/astro/icons/map-pin";
import Menu from "@lucide/astro/icons/menu";
import Music from "@lucide/astro/icons/music";
import Plus from "@lucide/astro/icons/plus";
import Ticket from "@lucide/astro/icons/ticket";
import X from "@lucide/astro/icons/x";

export const icons = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  calendar: Calendar,
  info: Info,
  "map-pin": MapPin,
  menu: Menu,
  music: Music,
  plus: Plus,
  ticket: Ticket,
  x: X,
};

export type IconName = keyof typeof icons;
