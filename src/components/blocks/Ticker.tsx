/** Bandeau défilant (DESIGN_SYSTEM §7.11) : termes des affiches réelles, alternés cyan / rose. Décoratif. */
export function Ticker({ items }: { items: string[] }) {
  const sequence = items.flatMap((item) => [item, "✦"]);
  return (
    <div aria-hidden="true" className="flex h-12 items-center overflow-hidden border-y border-line bg-abyss">
      <div className="ticker-track flex w-max gap-8 font-display text-eyebrow font-bold whitespace-nowrap uppercase">
        {[...sequence, ...sequence, ...sequence, ...sequence].map((item, i) => (
          <span key={i} className={i % 2 === 0 ? "text-cyan" : "text-pink"}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
