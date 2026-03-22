import { getPostBySlug, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts (simple strategy: get 3 recent posts)
  const relatedPosts = await getPosts({ per_page: 3 }).catch(() => []);
  const filteredRelated = relatedPosts.filter((p: any) => p.id !== post.id).slice(0, 3);

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const authorName = post._embedded?.["author"]?.[0]?.name || "Rédaction ICIBANGOUA";
  const authorAvatar = post._embedded?.["author"]?.[0]?.avatar_urls?.["96"];
  
  const date = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Simple reading time calculation (avg 200 words/min)
  const words = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <article className="min-h-screen bg-background transition-colors duration-300">
      {/* --- HERO SECTION --- */}
      <header className="relative w-full overflow-hidden bg-slate-950 px-4 pt-32 pb-20 md:pt-48 md:pb-32">
        {featuredImage && (
          <>
            <img
              src={featuredImage}
              alt={post.title.rendered}
              className="absolute inset-0 h-full w-full object-cover opacity-10 scale-110 blur-xl grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
          </>
        )}
        
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <Link 
              href="/media" 
              className="mb-10 inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 group"
            >
              <svg className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              Retour au Hub Media
            </Link>
            
            <div className="mb-8 flex flex-wrap justify-center items-center gap-4">
              <span className="rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-600/40">
                Civic Media
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-600"></div>
              <time className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{date}</time>
              <div className="h-1 w-1 rounded-full bg-slate-600"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{readingTime} min de lecture</span>
            </div>
            
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-12 max-w-3xl mx-auto"
              style={{ textShadow: '0 20px 50px rgba(0,0,0,1)' }}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Author Meta */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-30 animate-pulse"></div>
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="relative h-12 w-12 rounded-full border-2 border-white/20 object-cover" />
                ) : (
                  <div className="relative h-12 w-12 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center font-bold text-white">
                    {authorName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Écrit par</p>
                <p className="font-bold text-white tracking-tight">{authorName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Main Article Body */}
          <main className="lg:w-[68%]">
            <div className="bg-card rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border">
              {/* Internal Featured Image (Display if available and clean) */}
              {featuredImage && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-xl ring-1 ring-border">
                   <img src={featuredImage} alt="Main illustration" className="w-full h-full object-cover" />
                </div>
              )}

              <div 
                className="prose prose-lg md:prose-xl max-w-none 
                  prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight 
                  prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:mb-10
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline decoration-blue-200 decoration-2 underline-offset-4
                  prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-16 prose-img:mx-auto
                  prose-blockquote:border-l-0 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-12 prose-blockquote:px-12 prose-blockquote:rounded-[2rem] prose-blockquote:not-italic prose-blockquote:font-black prose-blockquote:text-foreground prose-blockquote:text-2xl prose-blockquote:leading-snug prose-blockquote:relative prose-blockquote:before:content-['«'] prose-blockquote:before:text-blue-200 dark:prose-blockquote:before:text-blue-800 prose-blockquote:before:text-7xl prose-blockquote:before:absolute prose-blockquote:before:-top-4 prose-blockquote:before:-left-4
                  prose-strong:text-foreground prose-strong:font-black
                  prose-ul:list-none prose-ul:pl-0 prose-li:pl-8 prose-li:relative prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-3.5 prose-li:before:h-2 prose-li:before:w-2 prose-li:before:rounded-full prose-li:before:bg-blue-600
                "
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
              
              {/* Share Bar */}
              <div className="mt-20 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Partager :</span>
                    <button className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground/40 hover:bg-blue-600 hover:text-white transition-all"><svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
                    <button className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground/40 hover:bg-blue-400 hover:text-white transition-all"><svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button>
                 </div>
                 <Link href="/news" className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 hover:underline">Signalement & Éthique →</Link>
              </div>
            </div>

            {/* Read Next / Related Posts Section */}
            {filteredRelated.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-black text-foreground mb-8 tracking-tight">À lire ensuite</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {filteredRelated.map((p: any) => {
                      const img = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                      return (
                        <Link key={p.id} href={`/media/${p.slug}`} className="group block bg-card rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-border hover:-translate-y-1 transition-all duration-300">
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                            <img src={img || '/hero-bg.png'} alt={p.title.rendered} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <h4 className="font-bold text-foreground leading-tight group-hover:text-blue-600 transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: p.title.rendered }}></h4>
                        </Link>
                      );
                   })}
                </div>
              </div>
            )}
          </main>

          {/* --- SIDEBAR --- */}
          <aside className="lg:w-[32%]">
            <div className="sticky top-28 space-y-8">
              {/* Mission Control Widget */}
              <div className="rounded-[2.5rem] bg-card p-8 md:p-10 border border-border shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                
                <h3 className="relative z-10 mb-6 text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Réseau ICIBANGOUA</h3>
                <p className="relative z-10 text-xl font-black text-foreground leading-tight mb-6 italic">
                  "Dialogue Civique, Apprentissage et Partage pour la Jeunesse Africaine."
                </p>
                <div className="relative z-10 h-px w-12 bg-blue-600 mb-8"></div>
                <p className="relative z-10 text-foreground/60 text-sm leading-relaxed mb-8 font-medium">
                  Nous sommes une plateforme inclusive et dynamique, unissant les voix locales pour un impact continental.
                </p>
                
                <div className="relative z-10 flex items-center gap-4 p-5 rounded-3xl bg-background border border-border group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-card shadow-xl flex items-center justify-center text-blue-600 font-black text-2xl group-hover:text-blue-700">
                    ICI
                  </div>
                  <div>
                    <p className="font-black text-foreground leading-none mb-1 group-hover:text-white">Impact Civique</p>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-100 transition-colors">Digital Network</p>
                  </div>
                </div>
              </div>

              {/* Call to action Card */}
              <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white overflow-hidden relative shadow-2xl shadow-blue-900/20 group">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Prochaine Étape</p>
                  <h4 className="text-3xl font-black mb-6 tracking-tight leading-tight">Envie de contribuer ?</h4>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Inscrivez-vous pour accéder à nos formations certifiantes et commencez à publier vos propres médias.</p>
                  <Link 
                    href="/register" 
                    className="flex items-center justify-center w-full bg-blue-600 text-white hover:bg-blue-500 py-5 rounded-2xl font-black text-base transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] tracking-widest uppercase"
                  >
                    Rejoindre ICI
                  </Link>
                </div>
              </div>
              
              {/* Newsletter or Mini Feed */}
              <div className="px-6 py-4 flex items-center justify-center space-x-4 opacity-30 grayscale hover:opacity-100 transition-all duration-500">
                 <span className="h-1 flex-1 bg-border"></span>
                 <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                 <span className="h-1 flex-1 bg-border"></span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

