import type { CSSProperties, ReactNode } from "react";

// Particules qui montent du cône (position, décalage, durée, rose ou cyan) : reprises des maquettes validées.
// Les 8 dernières sont masquées sur mobile (theme.css).
const PARTICLES: [string, string, string, boolean][] = [
  ["39.5%", "-3.3s", "5.8s", true],
  ["54.2%", "-3.8s", "4.7s", false],
  ["30.5%", "-5s", "5.4s", false],
  ["39.4%", "-6s", "6.1s", true],
  ["63.5%", "-2.9s", "6.7s", false],
  ["36%", "-3.8s", "7.5s", false],
  ["50.9%", "-4.4s", "6.8s", true],
  ["32.6%", "-4.5s", "6.6s", false],
  ["42.1%", "-0.2s", "7.5s", false],
  ["48.9%", "-4.3s", "7.6s", true],
  ["58.6%", "-5.5s", "5.9s", false],
  ["62%", "-2.7s", "7.8s", false],
  ["65.2%", "-0.6s", "5s", true],
  ["38.7%", "-5.8s", "6s", false],
  ["55.1%", "-1.8s", "6.3s", false],
  ["45.4%", "-2.1s", "6.5s", true],
];

/**
 * Radar holographique du hero (docs/hero-hologramme) : graduations, anneaux, arcs néon, balayage, cône de lumière,
 * plateforme, particules et, au centre, l'hologramme (`center`). Décoratif ; styles « Hero hologramme » de theme.css.
 * Il occupe la boîte de son parent (carrée) ; rotations et apparition en temps, sortie au défilement sur les parents.
 */
export function HoloRadar({ center }: { center: ReactNode }) {
  return (
    <div aria-hidden="true" className="holo-radar">
      <span className="holo-radar__ticks" />
      <span className="holo-radar__ring holo-radar__ring--outer" />
      <span className="holo-radar__ring holo-radar__ring--dotted" />
      <span className="holo-radar__orbit">
        <span className="holo-radar__ring holo-radar__ring--nodes" />
      </span>
      <span className="holo-radar__arc" />
      <span className="holo-radar__arc holo-radar__arc--pink" />
      <span className="holo-radar__sweep" />
      <span className="holo-radar__cone" />
      <span className="holo-radar__platform" />
      <span className="holo-radar__particles">
        {PARTICLES.map(([x, delay, duration, pink]) => (
          <span key={x + delay} data-pink={pink || undefined} style={{ "--x": x, "--delay": delay, "--duration": duration } as CSSProperties} />
        ))}
      </span>
      <div className="holo-radar__center">{center}</div>
    </div>
  );
}
