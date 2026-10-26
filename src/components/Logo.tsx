import logo from "../../assets/brand/logo-dystopsy.svg?raw";

/** Logo Dystopsy Element en SVG inline : prend la couleur du texte (`currentColor`). */
export function Logo({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block [&>svg]:size-full ${className}`} dangerouslySetInnerHTML={{ __html: logo }} />;
}
