"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Send, Bot, BookOpen, HelpCircle } from "lucide-react";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white flex justify-between items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Assistant Bangoua</h3>
                <div className="flex items-center space-x-1.5 opacity-80">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold">En ligne • Tradition & Aide</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[400px] overflow-y-auto space-y-6 flex-grow bg-slate-50/50 dark:bg-slate-900/50">
            {/* Bot Greeting */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm">
                👋 Bienvenue ! Je suis votre guide sur **ICIBANGOUA.net**. 
                <br /><br />
                Comment puis-je vous aider aujourd'hui ? Je peux vous parler de :
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                    <BookOpen className="w-3.5 h-3.5 mr-2" /> La culture & l'histoire Bangoua
                  </li>
                  <li className="flex items-center text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                    <HelpCircle className="w-3.5 h-3.5 mr-2" /> Utilisation de la plateforme
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Posez votre question ici..."
                className="w-full bg-secondary/50 border-border focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all pr-12 font-medium"
              />
              <button className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 text-[10px] text-center text-foreground/30 font-bold uppercase tracking-widest">
              Généré par ICIBANGOUA AI • Savoir & Modernité
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-500/40 active:scale-90 ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="absolute inset-0 rounded-[1.5rem] bg-blue-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity animate-pulse"></div>
        {isOpen ? (
          <X className="w-8 h-8 relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <Sparkles className="w-8 h-8 mb-0.5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">AI</span>
          </div>
        )}
      </button>
    </div>
  );
}
