import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLmsModuleBySlug } from "@/lib/api";
import { ChevronLeft, Clock, BarChart, BookOpen, CheckCircle, Share2, Printer } from "lucide-react";

export default async function LmsModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = await getLmsModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  const featuredImage = module._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const duration = module.meta?.duration || "45 min";
  const level = module.meta?.level || "Débutant";

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      {/* Cinematic Header */}
      <header className="relative h-[60dvh] min-h-[400px] flex items-center overflow-hidden">
        {featuredImage ? (
          <img 
            src={featuredImage} 
            alt={module.title.rendered}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-slate-900/40 z-0" />

        <div className="container mx-auto px-4 relative z-20 pt-20">
          <Link 
            href="/lms" 
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Retour aux modules</span>
          </Link>

          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600 text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 shadow-xl shadow-blue-600/30">
              Module de Formation
            </span>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight"
              dangerouslySetInnerHTML={{ __html: module.title.rendered }}
            />
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold uppercase tracking-wider">{duration}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                <BarChart className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wider">{level}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold uppercase tracking-wider">4 Sections</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Content Column */}
          <div className="lg:col-span-8">
            <article className="prose prose-xl dark:prose-invert max-w-none">
              <div 
                className="text-foreground/80 leading-relaxed font-medium mb-12"
                dangerouslySetInnerHTML={{ __html: module.content.rendered }}
              />
              
              {/* Dummy Section Breakdown for Premium Feel */}
              <div className="space-y-12 mt-16">
                <section>
                  <h2 className="text-4xl font-black text-foreground mb-6 flex items-center">
                    <span className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mr-4 text-xl">01</span>
                    Objectifs d'apprentissage
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Comprendre les enjeux de la cohésion sociale', 'Identifier les barrières au dialogue', 'Pratiquer l\'écoute active', 'Développer l\'empathie culturelle'].map((goal, i) => (
                      <div key={i} className="flex items-start bg-card border border-border p-6 rounded-2xl hover:border-blue-500/50 transition-colors">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-4 mt-0.5" />
                        <span className="font-bold text-foreground/80">{goal}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-900 text-white rounded-[2.5rem] p-12 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                   <div className="relative z-10">
                     <h2 className="text-3xl font-black mb-6 uppercase tracking-wider text-blue-400">Pourquoi ce cours ?</h2>
                     <p className="text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
                       Ce module a été conçu par des experts en médiation sociale pour répondre aux défis spécifiques rencontrés par la jeunesse de Bangoua. Il allie théorie ancestrale et pratiques modernes.
                     </p>
                   </div>
                </section>
              </div>
            </article>
          </div>

          {/* Sidebar / Actions Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border rounded-[2rem] p-8 sticky top-24 shadow-2xl shadow-slate-900/5 dark:shadow-none">
              <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-foreground">Action</h3>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl mb-4 shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center">
                <span>COMMENCER LE MODULE</span>
                <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
              </button>
              
              <button className="w-full border border-border hover:bg-foreground/5 text-foreground font-bold py-4 rounded-2xl mb-8 transition-colors flex items-center justify-center">
                <Printer className="w-4 h-4 mr-2" />
                <span>Version imprimable (PDF)</span>
              </button>

              <div className="pt-8 border-t border-border">
                <div className="flex items-center justify-between text-foreground/40 text-xs font-black uppercase tracking-widest mb-4">
                  <span>Partager ce module</span>
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="flex gap-2">
                   {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-foreground/5 animate-pulse" />)}
                </div>
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-8">
               <h4 className="font-black uppercase tracking-widest text-blue-600 mb-4">Besoin d'aide ?</h4>
               <p className="text-sm font-medium text-foreground/60 leading-relaxed mb-6">
                 Nos tuteurs sont disponibles pour répondre à vos questions sur ce module.
               </p>
               <Link href="/contact" className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline">Contactez un tuteur →</Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
