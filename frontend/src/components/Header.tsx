"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import NdopBackground from "./NdopBackground";
import { useTheme } from "next-themes"; // Added for theme detection
import { useSession, signOut } from "next-auth/react";

/* eslint-disable @next/next/no-img-element */
import { Menu, X, ChevronDown, ChevronRight, GraduationCap, Users, Newspaper, User, LogOut, Settings, LayoutDashboard, UserCircle, UserPlus } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const { data: session, status } = useSession();
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const secondaryLinks = [
    { name: "Accueil", href: "/" },
    { 
      name: "Le Village", 
      href: "/category/mon-village",
      subItems: [
        { name: "La Chefferie & Dynastie", href: "/category/chefferie-bangoua" },
        { name: "Culture et Traditions", href: "/category/culture-et-traditions" },
        { name: "Histoire & Administration", href: "/category/administration-civile" },
        { name: "Le Groupement Bangoua", href: "/category/le-groupement-bangoua" }
      ]
    },
    { 
      name: "Actualités", 
      href: "/category/actualites",
      subItems: [
        { name: "Société", href: "/category/societe" },
        { name: "Politique", href: "/category/politique" },
        { name: "Jeunesse", href: "/category/jeunesse" },
        { name: "Education", href: "/category/education" },
        { name: "Santé", href: "/category/sante" }
      ]
    },
    { 
      name: "Culture & Tourisme", 
      href: "/category/tourisme",
      subItems: [
        { name: "Sites Touristiques", href: "/category/les-sites-touristiques" },
        { name: "Festival Macabo", href: "/category/la-fete-de-macabo" },
        { name: "Artistes & Musique", href: "/category/artistes" },
        { name: "Podium Star", href: "/category/podium-star" }
      ]
    },
    { 
      name: "Économie & Emploi", 
      href: "/category/finances",
      subItems: [
        { name: "Business & Finances", href: "/category/finances" },
        { name: "Offres d'Emploi", href: "/category/offres-demploi" },
        { name: "Page Jaune Bangoua", href: "/page-jaune" }
      ]
    },
    {
      name: "Diaspora & Solidarité",
      href: "/category/diaspora",
      subItems: [
        { name: "Bangoua de l'Étranger", href: "/category/diaspora" },
        { name: "Projets de Solidarité", href: "/category/solidarite" },
        { name: "Investir au Village", href: "/investir" }
      ]
    },
    {
      name: "Santé & Environnement",
      href: "/category/sante",
      subItems: [
        { name: "Santé & Hygiène", href: "/category/sante" },
        { name: "Nature & Écologie", href: "/category/environnement" },
        { name: "Urgences Bangoua", href: "/urgences" }
      ]
    },
    { 
      name: "Media & À Propos", 
      href: "/media",
      subItems: [
        { name: "A Propos de Icibangoua.Net", href: "/category/a-propos" },
        { name: "La TEAM", href: "/category/la-team" },
        { name: "Partager un Média", href: "/media" },
        { name: "Nous Contacter", href: "/contact" }
      ]
    }
  ];

  const mainMobileLinks = [
    { name: "Apprendre", href: "/lms", icon: <GraduationCap className="w-6 h-6" /> },
    { name: "Échanger", href: "/media", icon: <Users className="w-6 h-6" /> },
    { name: "À Savoir", href: "/news", icon: <Newspaper className="w-6 h-6" /> }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-blue-600 text-white font-black px-3 py-1.5 rounded-xl transition-transform group-hover:scale-110">
              ICI
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground truncate">
              BANGOUA<span className="text-blue-600">.net</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-10 items-center">
            <Link href="/lms" className="text-foreground/60 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Apprendre
            </Link>
            <Link href="/media" className="text-foreground/60 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Échanger
            </Link>
            <Link href="/news" className="text-foreground/60 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Actualités
            </Link>
          </nav>

          {/* Auth & Theme Toggle */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <ThemeToggle />
            
            {status === "authenticated" ? (
              <div className="group relative">
                <button className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800 transition-all hover:shadow-md">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:inline-block text-sm font-bold text-foreground/80">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                {/* User Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden p-2">
                    <div className="px-4 py-2 mb-2 border-b border-border/50">
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Compte</p>
                      <p className="text-sm font-bold text-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-foreground/70 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </Link>
                    <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-foreground/70 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Tableau de bord</span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden md:inline-flex text-foreground/60 hover:text-foreground font-bold text-sm uppercase tracking-widest transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="hidden sm:inline-flex bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  S'inscrire
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle Button */}
            <button 
              className="lg:hidden p-2.5 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 animate-in spin-in-90 duration-300" /> : <Menu className="h-6 w-6 animate-in fade-in duration-300" />}
            </button>
          </div>
        </div>
        
        {/* Desktop Secondary Sub-Navigation */}
        <div className="hidden lg:block w-full bg-transparent border-t border-border/60">
          <div className="container mx-auto px-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 py-3 lg:py-0 lg:h-12 text-[13px] font-bold text-foreground/80">
            {secondaryLinks.map((link, i) => (
              <div key={i} className="group relative flex items-center lg:h-full">
                <Link 
                  href={link.href}
                  className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap lg:py-4"
                >
                  <span>{link.name}</span>
                  {link.subItems && (
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
                
                {/* Desktop Dropdown Dropdown Menu Style */}
                {link.subItems && (
                  <div className="absolute top-full left-0 z-50 pt-2 lg:pt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden p-2 space-y-1">
                      {link.subItems.map((sub, j) => (
                        <Link 
                          key={j} 
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm font-semibold text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-secondary/50 rounded-xl transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Full Screen Overlay PREMIUM Version */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-background transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Decorative Ndop pattern to give local flavor */}
        <NdopBackground opacityLight={0.02} opacityDark={0.01} />
        
        <div className="flex flex-col h-full relative z-10">
          {/* Spacer for sticky header */}
          <div className="h-20 shrink-0 border-b border-border/30"></div>
          
          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
            {/* Quick Access Main Links */}
            <div className="grid grid-cols-1 gap-4 mb-10">
              {mainMobileLinks.map((link, i) => (
                <Link 
                  key={i}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center p-4 bg-secondary/40 border border-border/50 rounded-2xl hover:bg-secondary transition-all group overflow-hidden relative"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight text-foreground">{link.name}</span>
                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Découvrir maintenant</span>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-foreground/20 group-hover:text-blue-600 transition-colors group-hover:translate-x-1 duration-300" />
                  {/* Subtle hover effect background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors"></div>
                </Link>
              ))}
            </div>

            {/* Explorable Categories section with better hierarchy */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-foreground/30 uppercase tracking-[0.2em] px-2 mb-4">Parcourir</h3>
              
              <div className="space-y-1">
                {secondaryLinks.map((link, i) => (
                  <div key={i} className="flex flex-col">
                    {link.subItems ? (
                      <button 
                        className={`flex justify-between items-center py-4 px-3 rounded-2xl transition-all ${
                          activeSubMenu === i ? 'bg-blue-600/5 text-blue-600 ring-1 ring-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'text-foreground/80 hover:bg-secondary/60'
                        }`}
                        onClick={() => setActiveSubMenu(activeSubMenu === i ? null : i)}
                      >
                        <span className="text-lg font-black tracking-tight">{link.name}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-500 ${activeSubMenu === i ? 'rotate-180 text-blue-600' : 'text-foreground/30'}`} 
                        />
                      </button>
                    ) : (
                      <Link 
                        href={link.href}
                        className="py-4 px-3 text-lg font-black tracking-tight text-foreground/80 hover:bg-secondary/60 rounded-2xl transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}

                    {/* Mobile Sub Items with slide/fade animation base */}
                    {link.subItems && activeSubMenu === i && (
                      <div className="flex flex-col space-y-1 mt-2 mb-4 mx-2">
                        {link.subItems.map((sub, j) => (
                          <Link 
                            key={j} 
                            href={sub.href}
                            className="bg-secondary/30 p-4 rounded-xl text-[15px] font-bold text-foreground/60 hover:text-blue-600 hover:bg-secondary transition-all flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600/20 mr-3 hidden"></span>
                            {sub.name}
                            <ChevronRight className="w-4 h-4 ml-auto opacity-30" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Call-to-actions (Stick to bottom but float in the container) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-border/20 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/login" 
                className="flex-1 text-center bg-secondary hover:bg-secondary-foreground hover:text-secondary group transition-all py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircle className="w-5 h-5" />
                <span>Connexion</span>
              </Link>
              <Link 
                href="/register" 
                className="flex-1 text-center bg-blue-600 text-white hover:bg-blue-700 transition-all py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center space-x-2 border border-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                <span>S'inscrire</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
