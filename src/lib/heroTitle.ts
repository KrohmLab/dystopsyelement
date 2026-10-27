/**
 * Titre du hero hologramme, variante soirée : le premier mot en plein, la suite en contour néon
 * (« NEXEN'S / HOME »). Au-delà de 3 mots, le titre reste d'un seul tenant.
 */
export function splitHeroTitle(title: string): { first: string; rest: string | null } {
  const words = title.trim().split(/\s+/);
  if (words.length < 2 || words.length > 3) return { first: title.trim(), rest: null };
  return { first: words[0] ?? "", rest: words.slice(1).join(" ") };
}
