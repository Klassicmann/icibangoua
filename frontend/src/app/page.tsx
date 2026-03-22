import Link from "next/link";
import { getPosts, getLmsModules } from "@/lib/api";
import React from "react";
import { ArrowRight, BookOpen, Users, Share2, Target, Award, Globe } from "lucide-react";
import NdopBackground from "@/components/NdopBackground";
import HeroSlider from "@/components/HeroSlider";
import PostsSlider from "@/components/PostsSlider";

export default async function Home() {
  // Fetch data in parallel for performance
  const [recentPosts, lmsModules] = await Promise.all([
    getPosts({ per_page: 10 }),
    getLmsModules({ per_page: 3 }).catch(() => []) // Fallback if CPT not active
  ]);

  return (
    <div className="w-full bg-background transition-colors duration-300">
      {/* --- HERO SECTION (Full-Screen Slider) --- */}
      <HeroSlider />

      {/* --- PILLARS SECTION --- */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-[#132c52] uppercase tracking-[0.2em] mb-4">Notre Vision</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">Trois piliers pour un impact durable</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 - Ndop Deep */}
            <div className="group p-10 rounded-[2rem] bg-background hover:bg-[#0f172a] transition-all duration-500 hover:-translate-y-2 border border-border">
              <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-[#0f172a] transition-colors shadow-lg">
                <BookOpen className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-foreground group-hover:text-white mb-4">Apprendre</h4>
              <p className="text-foreground/60 group-hover:text-slate-300 leading-relaxed mb-6">
                Accédez à des formations exclusives sur le dialogue civique, le leadership et l'entrepreneuriat social.
              </p>
              <Link href="/lms" className="inline-flex items-center font-bold text-[#0f172a] dark:text-[#63b3ed] group-hover:text-white">
                Explorer les cours <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Pillar 2 - Ndop Primary */}
            <div className="group p-10 rounded-[2rem] bg-background hover:bg-[#132c52] transition-all duration-500 hover:-translate-y-2 border border-border">
              <div className="w-16 h-16 bg-[#132c52] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-[#132c52] transition-colors shadow-lg">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-foreground group-hover:text-white mb-4">Échanger</h4>
              <p className="text-foreground/60 group-hover:text-blue-100 leading-relaxed mb-6">
                Rejoignez des forums virtuels et participez à des débats constructifs sur les enjeux de votre communauté.
              </p>
              <Link href="/clubs" className="inline-flex items-center font-bold text-[#132c52] dark:text-[#63b3ed] group-hover:text-white">
                Rejoindre la communauté <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Pillar 3 - Ndop Royal */}
            <div className="group p-10 rounded-[2rem] bg-background hover:bg-[#2b6cb0] transition-all duration-500 hover:-translate-y-2 border border-border">
              <div className="w-16 h-16 bg-[#2b6cb0] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-[#2b6cb0] transition-colors shadow-lg">
                <Share2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-foreground group-hover:text-white mb-4">Partager</h4>
              <p className="text-foreground/60 group-hover:text-blue-100 leading-relaxed mb-6">
                Créez du contenu, publiez vos médias et faites entendre votre voix auprès de tout le réseau.
              </p>
              <Link href="/media" className="inline-flex items-center font-bold text-[#2b6cb0] dark:text-[#63b3ed] group-hover:text-white">
                Publier un média <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- RECENT ARTICLES SECTION (Edge-Style Slider) --- */}
      <section className="py-24 bg-background overflow-hidden border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center justify-center md:justify-start">
                < Award className="w-4 h-4 mr-2" /> Actualités Défilantes
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">Le meilleur du village et d'ailleurs</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Posts Slider (Spans 2x2) */}
            <PostsSlider posts={recentPosts.slice(0, 5)} />

            {/* Other Article Cards */}
            {recentPosts.slice(5, 9).map((post: any, i: number) => (
              <Link 
                key={post.id}
                href={`/media/${post.slug}`}
                className="group flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all h-full"
              >
                <div className="h-48 relative overflow-hidden shrink-0">
                   <img 
                    src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/learning.png"} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 backdrop-blur-sm border border-blue-600/20 text-blue-600 flex items-center justify-center">
                       <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center space-x-2 mb-3">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Village</span>
                      <span className="text-[10px] font-bold text-foreground/30">• Il y a {i + 3}h</span>
                   </div>
                   <h4 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-3 leading-snug" 
                       dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h4>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
             <Link href="/news" className="inline-flex items-center space-x-2 text-foreground font-black uppercase tracking-[0.2em] text-sm hover:text-blue-600 transition-colors">
                <span>Accéder à toutes les actualités</span>
                <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section className="py-24 bg-card overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="relative order-2 lg:order-1">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full z-0 opacity-50 blur-2xl"></div>
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl skew-y-1">
                  <img src="/learning.png" alt="Education" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-card p-8 rounded-[2rem] shadow-2xl border border-border max-w-xs hidden sm:block">
                  <p className="text-foreground/60 italic leading-relaxed">
                    "L'éducation est l'arme la plus puissante pour changer le monde. ICIBANGOUA nous donne les outils."
                  </p>
                  <div className="mt-4 font-bold text-foreground">— Membre certifié</div>
                </div>
             </div>
             
             <div className="order-1 lg:order-2">
                <h2 className="text-sm font-black text-[#132c52] uppercase tracking-widest mb-4 text-center lg:text-left flex items-center justify-center lg:justify-start">
                  <Globe className="w-4 h-4 mr-2" /> Pourquoi ICIBANGOUA ?
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-8 leading-tight text-center lg:text-left">Une plateforme pensée par et pour la jeunesse</h3>
                <p className="text-lg text-foreground/60 mb-10 leading-relaxed text-center lg:text-left">
                   Nous croyons que chaque jeune a un rôle à jouer dans la société. Notre plateforme combine les derniers outils pédagogiques avec un réseau social bienveillant pour transformer les idées en actions réelles.
                </p>
                
                <ul className="space-y-6">
                  {[
                    "Certificats reconnus pour chaque module complété",
                    "Réseautage avec des experts et leaders d'opinion",
                    "Support multilingue et accès optimisé pour les mobiles",
                    "Espace de stockage gratuit pour vos créations"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start space-x-4">
                      <div className="bg-[#132c52] text-white p-1 rounded-sm mt-1 transform rotate-45">
                        <Target className="w-3 h-3 -rotate-45" />
                      </div>
                      <span className="font-bold text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
           <div className="bg-[#0f172a] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              {/* Authentic Ndop SVG Pattern Overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] pointer-events-none">
                 <NdopBackground opacityLight={0.05} opacityDark={0.015} />
              </div>
              
              {/* Abstract Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2b6cb0]/20 rounded-full blur-3xl z-0"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#132c52]/30 rounded-full blur-3xl z-0"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Prêt à faire entendre votre voix ?</h2>
                <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto">
                  Inscrivez-vous gratuitement aujourd'hui et commencez votre parcours sur la plateforme ICIBANGOUA.net.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/register" className="bg-[#2b6cb0] hover:bg-[#1a4b82] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center">
                    S'inscrire Maintenant <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link href="/contact" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center">
                    Nous Contacter
                  </Link>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
