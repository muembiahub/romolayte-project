export default function Footer() {
  return (
    <footer className="relative border-t border-blue-500/10 bg-slate-950 text-slate-400 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-t-[3rem] mt-20 shadow-[0_-20px_50px_rgba(15,23,42,0.8)]">
      
      {/* ADVANCED DEPTH GLOWS & GRID PATTERN */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-blue-950/20 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:24px_24px] opacity-30 z-0" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-10" />

      {/* CONTENT CONTAINER */}
      <div className="relative z-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center pb-12 border-b border-blue-950">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-5 space-y-3 text-center md:text-left">
            <span className="text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              Romolayte<span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            </span>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm font-light leading-relaxed mx-auto md:mx-0">
              La solution numérique et de services techniques de haute qualité pour propulser vos ambitions.
            </p>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="md:col-span-4 flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-slate-300">
            <a href="/services" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-blue-400 transition-colors">Confidentialité</a>
            <a href="/terms" className="hover:text-blue-400 transition-colors">Conditions</a>
          </div>

          {/* BADGE / STATUS COLUMN */}
          <div className="md:col-span-3 flex justify-center md:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-xs font-semibold text-blue-300 backdrop-blur-md shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Systèmes opérationnels
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 font-light gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Romolayte. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600">Sécurisé & Conçu pour l'excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
}