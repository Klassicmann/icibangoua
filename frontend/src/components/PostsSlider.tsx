"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostsSlider({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % posts.length);
  };
  
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div className="md:col-span-2 md:row-span-2 relative h-[450px] md:h-auto min-h-[400px] rounded-[2rem] overflow-hidden shadow-xl border border-border group">
      {posts.map((post, idx) => {
        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/hero-bg.png";
        
        return (
          <Link 
            key={post.id}
            href={`/media/${post.slug}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img 
              src={featuredImage} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 p-8 w-full transition-all duration-700 transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest">A la une</div>
                <span className="text-xs font-bold text-white/50">{new Date(post.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
              </div>
              <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-blue-300 transition-colors" 
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h4>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-black text-white">B</div>
                   <span className="text-sm font-bold text-white/60">Bangoua Médias</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Navigation Indicators */}
      {posts.length > 1 && (
        <>
          <div className="absolute top-6 right-6 flex space-x-2 z-20">
            {posts.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === current ? "bg-blue-600 w-8" : "bg-white/20 w-4"
                }`}
              />
            ))}
          </div>
          
          <div className="absolute bottom-6 right-6 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={prev} className="p-2 rounded-xl bg-black/40 text-white hover:bg-blue-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="p-2 rounded-xl bg-black/40 text-white hover:bg-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
