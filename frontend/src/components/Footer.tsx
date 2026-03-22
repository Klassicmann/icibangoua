import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 text-center md:text-left">
          <div className="md:col-span-4 max-w-sm mx-auto md:mx-0">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-3 mb-8 group">
              <div className="bg-blue-600 text-white font-black px-3 py-1.5 rounded-xl transition-transform group-hover:scale-110">
                ICI
              </div>
              <span className="font-black text-2xl tracking-tighter text-foreground">
                BANGOUA<span className="text-blue-600">.net</span>
              </span>
            </Link>
            <p className="text-foreground/50 text-base leading-relaxed mb-8">
              La plateforme numérique panafricaine dédiée au dialogue civique, à l'apprentissage permanent et au partage d'idées pour la jeunesse de demain.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
               {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                 <a key={social} href="#" className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-foreground/40 hover:text-blue-600 hover:border-blue-600 transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current opacity-20" style={{ maskImage: `url(/icons/${social}.svg)`, maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                 </a>
               ))}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Plateforme</h4>
            <ul className="space-y-4">
              <li><Link href="/lms" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Apprentissage</Link></li>
              <li><Link href="/media" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Civic Media</Link></li>
              <li><Link href="/news" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Actualités</Link></li>
              <li><Link href="/clubs" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Clubs Jeunesse</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Communauté</h4>
            <ul className="space-y-4">
              <li><Link href="/events" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Événements</Link></li>
              <li><Link href="/guidelines" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Éthique</Link></li>
              <li><Link href="/partners" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Partenaires</Link></li>
              <li><Link href="/contact" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Juridique</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Confidentialité</Link></li>
              <li><Link href="/terms" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Conditions</Link></li>
              <li><Link href="/cookies" className="text-foreground/50 hover:text-blue-600 transition-colors font-bold text-sm">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
          <p>© {new Date().getFullYear()} ICIBANGOUA.net - Web and Development Foundation</p>
          <div className="flex items-center space-x-6">
             <p>Architecture by THE NET.</p>
             <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Server Status: Online</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
