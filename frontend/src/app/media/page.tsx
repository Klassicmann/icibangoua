import { getPosts } from "@/lib/api";
import Link from "next/link";
import React from "react";

export default async function MediaPage() {
  const posts = await getPosts({ per_page: 20 });
  return (
    <div className="bg-background min-h-screen py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">Civic <span className="text-blue-600">Media Hub</span></h1>
          <p className="text-xl text-foreground/60">
            Découvrez le monde à travers les yeux de la jeunesse. Articles, podcasts et reportages photo créés par notre réseau.
          </p>
        </div>

        {/* Filtering */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-medium">Tout</button>
            <button className="bg-card text-foreground/70 hover:bg-background px-5 py-2 rounded-full text-sm font-medium transition-colors border border-border">Articles</button>
            <button className="bg-card text-foreground/70 hover:bg-background px-5 py-2 rounded-full text-sm font-medium transition-colors border border-border">Podcasts</button>
            <button className="bg-card text-foreground/70 hover:bg-background px-5 py-2 rounded-full text-sm font-medium transition-colors border border-border">Vidéos</button>
          </div>
          <div className="w-full md:w-auto">
            <select className="w-full md:w-48 bg-card border border-border text-foreground py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Filtrer par Pays</option>
              <option>Cameroun</option>
              <option>Côte d'Ivoire</option>
              <option>Sénégal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post: any) => {
              const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              
              return (
                <Link 
                  key={post.id} 
                  href={`/media/${post.slug}`}
                  className="rounded-2xl flex flex-col group cursor-pointer hover:shadow-xl transition-all bg-card border border-border overflow-hidden"
                >
                   {/* Card Image */}
                   <div className="aspect-video w-full bg-gray-100 relative">
                     {featuredImage ? (
                       <img 
                         src={featuredImage} 
                         alt={post.title.rendered}
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                     ) : (
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                          <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       </div>
                     )}
                     <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-black tracking-widest text-white bg-blue-600/90 px-2 py-1 rounded backdrop-blur-sm uppercase shadow-sm">
                          {new Date(post.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                   </div>

                   <div className="p-5 flex-1 flex flex-col">
                     <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Article</p>
                     <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-blue-600 transition-colors line-clamp-3 mb-3" 
                         dangerouslySetInnerHTML={{ __html: post.title.rendered }}>
                     </h3>
                     <div className="mt-auto text-xs text-foreground/40 line-clamp-2 italic" 
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}>
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
