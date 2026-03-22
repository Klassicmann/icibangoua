import Link from "next/link";
import React from "react";
import { getLmsModules } from "@/lib/api";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

export default async function LmsPage() {
  const modules = await getLmsModules({ per_page: 12 }).catch(() => []);

  return (
    <div className="bg-background min-h-screen py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Hero / Header Section */}
        <div className="relative mb-20 p-12 lg:p-20 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-6">Plateforme d'Apprentissage</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
              Apprendre à <span className="text-blue-500 italic">Bâtir</span> l'Avenir
            </h1>
            <p className="text-xl text-white/60 leading-relaxed font-medium mb-10">
              Développez vos compétences en dialogue civique, leadership et citoyenneté active à travers nos modules interactifs certifiés.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                 <div className="text-white text-2xl font-black">4</div>
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Modules Disponibles</div>
               </div>
               <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                 <div className="text-white text-2xl font-black">2h+</div>
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Contenu Vidéo</div>
               </div>
            </div>
          </div>
        </div>

        {/* Categories / Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 sticky top-20 z-40 bg-background/80 backdrop-blur-xl py-4 border-b border-border/50">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            {['Tous', 'Dialogue', 'Leadership', 'Paix', 'Culture'].map((cat, i) => (
              <button 
                key={i}
                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-card border border-border text-foreground/40 hover:text-foreground hover:bg-background'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-foreground/30 flex items-center">
             <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
             Tutorat Direct Disponible
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {modules.map((module: any) => {
              const featuredImage = module._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              const duration = module.meta?.duration || "45 min";
              const level = module.meta?.level || "Débutant";
              
              return (
                <Link 
                  key={module.id} 
                  href={`/lms/${module.slug}`}
                  className="group relative bg-card rounded-[2.5rem] border border-border hover:border-blue-500/30 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-blue-600/5"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {featuredImage ? (
                      <img 
                        src={featuredImage} 
                        alt={module.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700">
                        <BookOpen className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                       <span className="text-white text-xs font-black uppercase tracking-widest flex items-center">
                          Commencer maintenant <ArrowRight className="w-4 h-4 ml-2" />
                       </span>
                    </div>
                  </div>

                  <div className="p-10 flex-grow flex flex-col">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        {level}
                      </span>
                      <span className="flex items-center text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {duration}
                      </span>
                    </div>

                    <h3 
                      className="font-black text-2xl text-foreground mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: module.title.rendered }}
                    />
                    <div 
                      className="text-foreground/50 text-base mb-8 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: module.excerpt.rendered }}
                    />
                    
                    <div className="mt-auto pt-8 border-t border-border flex justify-between items-center group-hover:border-blue-500/20 transition-colors">
                      <div className="flex items-center">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-foreground/40 mr-3">
                            BN
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Bangoua Network</span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                         <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
