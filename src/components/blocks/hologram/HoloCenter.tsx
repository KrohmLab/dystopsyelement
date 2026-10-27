import { getImage } from "../../../lib/images";
import { Logo } from "../../layout/Logo";

type Props =
  /** Logo en hologramme (variante festival : logo Nexen). */
  | { kind: "logo"; image: string }
  /** Visuel de l'événement dans un médaillon circulaire, recadré par `focus` (object-position). */
  | { kind: "visual"; image: string; focus: string }
  /** Repli sans visuel : logo Dystopsy en néon. */
  | { kind: "brand" };

/** Centre du radar holographique : flotte, grésille, traversé de lignes de balayage. Décoratif. */
export function HoloCenter(props: Props) {
  if (props.kind === "brand") {
    return (
      <div className="holo-center holo-center--brand">
        <Logo className="size-full text-cyan" />
        <span className="holo-center__lines" />
      </div>
    );
  }

  const sources = getImage(props.image);
  if (!sources) return null;
  const picture = (className?: string) => (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes="40vw" />
      <img
        src={sources.src}
        srcSet={sources.webp}
        sizes="40vw"
        width={sources.width}
        height={sources.height}
        alt=""
        decoding="async"
        className={className}
        style={props.kind === "visual" ? { objectPosition: props.focus } : undefined}
      />
    </picture>
  );

  if (props.kind === "logo") {
    return (
      <div className="holo-center holo-center--logo">
        {picture()}
        <span className="holo-center__lines" />
      </div>
    );
  }
  return (
    <div className="holo-center holo-center--visual">
      <div className="holo-center__disc">
        {picture()}
        {picture("holo-center__chroma")}
        <span className="holo-center__tint" />
        <span className="holo-center__lines" />
      </div>
    </div>
  );
}
