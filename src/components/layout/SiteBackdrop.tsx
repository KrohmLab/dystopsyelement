/**
 * Fond vivant de tout le site (DESIGN_SYSTEM §5.3) : lueurs cyan / rose qui dérivent lentement,
 * sol quadrillé en perspective qui avance au défilement (prolonge le sol du hero), vignettage.
 * Fixe, décoratif, sous le contenu ; styles dans theme.css. Mouvement réduit : immobile.
 */
export function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <span className="site-backdrop__glow site-backdrop__glow--cyan" />
      <span className="site-backdrop__glow site-backdrop__glow--pink" />
      <span className="site-backdrop__glow site-backdrop__glow--deep" />
      <div className="site-backdrop__floor">
        <div className="site-backdrop__plane">
          <div className="site-backdrop__lines" />
        </div>
        <span className="site-backdrop__horizon" />
      </div>
      <span className="absolute inset-0 bg-scanlines opacity-60" />
      <span className="site-backdrop__vignette" />
    </div>
  );
}
