"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";

const SLIDE_DURATION = 6000; // 6 seconds per slide

interface Slide {
  id: number;
  image: string;      // Background image path
  accentColor: string;
  badge: string;
  title: string[];    // Each item is a line (allows multi-line bold titles)
  titleHighlight: string; // Word(s) to highlight in accent color
  subtitle: string;
  cta: { label: string; href: string; style: "primary" | "outline" };
  ctaSecondary?: { label: string; href: string };
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  pattern?: string; // which geometric motif to show
}

const slides: Slide[] = [
  {
    id: 0,
    image: "/images/hero/dialogue.png",
    accentColor: "#60a5fa",
    badge: "Plateforme Jeunesse 2026",
    title: ["Bâtir le Futur", "par le Dialogue"],
    titleHighlight: "Dialogue",
    subtitle:
      "ICIBANGOUA.net est l'espace numérique dédié à la jeunesse africaine pour apprendre les compétences civiques, échanger des idées et créer l'avenir ensemble.",
    cta: { label: "Rejoindre le mouvement", href: "/register", style: "primary" },
    ctaSecondary: { label: "Découvrir nos cours", href: "/lms" },
    stat1: { value: "+500", label: "Membres actifs" },
    stat2: { value: "100%", label: "Gratuit" },
    pattern: "ndop",
  },
  {
    id: 1,
    image: "/images/hero/learning.png",
    accentColor: "#a78bfa",
    badge: "Formation & Développement",
    title: ["Apprendre &", "S'Élever"],
    titleHighlight: "S'Élever",
    subtitle:
      "Accédez à des formations exclusives sur le leadership, l'entrepreneuriat social, et le développement civique. Des cours certifiés pensés pour vous.",
    cta: { label: "Explorer les cours", href: "/lms", style: "primary" },
    ctaSecondary: { label: "Voir les modules", href: "/lms/modules" },
    stat1: { value: "20+", label: "Modules certifiés" },
    stat2: { value: "5 étoiles", label: "Note moyenne" },
    pattern: "triangles",
  },
  {
    id: 2,
    image: "/images/hero/culture.png",
    accentColor: "#34d399",
    badge: "Culture & Patrimoine",
    title: ["Nos Racines,", "Notre Force"],
    titleHighlight: "Racines",
    subtitle:
      "Plongez dans le riche patrimoine culturel de Bangoua. Redécouvrez les traditions ancestrales, les arts Ndop, et les récits qui forgent notre identité collective.",
    cta: { label: "Découvrir la culture", href: "/culture", style: "primary" },
    ctaSecondary: { label: "Le village Bangoua", href: "/village" },
    stat1: { value: "3000+", label: "Ans d'histoire" },
    stat2: { value: "10+", label: "Groupes culturels" },
    pattern: "diamonds",
  },
  {
    id: 3,
    image: "/images/hero/economy.png",
    accentColor: "#fca5a5",
    badge: "Actualités & Économie",
    title: ["Une Économie", "en Plein Essor"],
    titleHighlight: "Essor",
    subtitle:
      "Suivez l'actualité économique de Bangoua. Opportunités d'emploi, projets de développement, success stories locales — tout ce qui fait avancer notre communauté.",
    cta: { label: "Voir les opportunités", href: "/economie", style: "primary" },
    ctaSecondary: { label: "Lire les actualités", href: "/actualites" },
    stat1: { value: "50+", label: "Partenaires locaux" },
    stat2: { value: "2x", label: "Croissance annuelle" },
    pattern: "circles",
  },
];

// Geometric pattern SVG patterns for each slide
function SlidePattern({ pattern, color }: { pattern?: string; color: string }) {
  const opacity = 0.06;
  if (pattern === "ndop") return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern id="ndop-p" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect x="5" y="5" width="20" height="20" fill="none" stroke={color} strokeWidth="2" transform="rotate(45 15 15)" />
          <circle cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="1.5" />
          <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.5" />
          <line x1="30" y1="0" x2="30" y2="60" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ndop-p)" />
    </svg>
  );
  if (pattern === "triangles") return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern id="tri-p" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,5 75,70 5,70" fill="none" stroke={color} strokeWidth="1.5" />
          <polygon points="40,30 60,65 20,65" fill={color} fillOpacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tri-p)" />
    </svg>
  );
  if (pattern === "diamonds") return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern id="dia-p" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
          <rect x="10" y="10" width="50" height="50" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(45 35 35)" />
          <circle cx="35" cy="35" r="5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dia-p)" />
    </svg>
  );
  if (pattern === "circles") return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <defs>
        <pattern id="cir-p" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="40" cy="40" r="15" fill="none" stroke={color} strokeWidth="1" />
          <circle cx="40" cy="40" r="4" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cir-p)" />
    </svg>
  );
  return null;
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const goToSlide = useCallback((next: number, dir: "left" | "right" = "right") => {
    if (isAnimating || next === current) return;
    setIsAnimating(true);
    setDirection(dir);
    setPrev(current);
    setCurrent(next);
    setProgress(0);
    startTimeRef.current = Date.now();
    setTimeout(() => {
      setIsAnimating(false);
      setPrev(null);
    }, 900);
  }, [isAnimating, current]);

  const nextSlide = useCallback(() => goToSlide((current + 1) % slides.length, "right"), [current, goToSlide]);
  const prevSlide = useCallback(() => goToSlide((current - 1 + slides.length) % slides.length, "left"), [current, goToSlide]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [current, isPaused]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      return;
    }
    slideTimerRef.current = setTimeout(() => nextSlide(), SLIDE_DURATION);
    return () => { if (slideTimerRef.current) clearTimeout(slideTimerRef.current); };
  }, [current, isPaused, nextSlide]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* SLIDES */}
      {slides.map((s, idx) => {
        const isActive = idx === current;
        const isPrev = idx === prev;

        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-none overflow-hidden"
            style={{
              zIndex: isActive ? 20 : isPrev ? 10 : 0,
              clipPath: isActive
                ? isAnimating
                  ? direction === "right"
                    ? "inset(0 0 0 100%)"  // will be animated via keyframe
                    : "inset(0 100% 0 0)"
                  : "inset(0 0 0 0)"
                : isPrev
                ? "inset(0 0 0 0)"
                : "inset(0 0 0 100%)",
              animation: isActive && isAnimating
                ? direction === "right"
                  ? "slideInRight 0.9s cubic-bezier(0.77, 0, 0.18, 1) forwards"
                  : "slideInLeft 0.9s cubic-bezier(0.77, 0, 0.18, 1) forwards"
                : "none",
            }}
          >
            {/* Background Image with Ken Burns effect */}
            <div 
              className="absolute inset-0 z-0 transition-transform duration-[10s] ease-linear"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            />

            {/* Tinted Overlay */}
            <div 
              className="absolute inset-0 z-1"
              style={{
                background: `linear-gradient(135deg, rgba(10, 22, 40, 0.9) 0%, rgba(19, 44, 82, 0.7) 50%, transparent 100%)`,
              }}
            />
            
            <div 
              className="absolute inset-0 z-2 opacity-30"
              style={{
                background: `radial-gradient(circle at center, transparent 0%, #000 100%)`,
              }}
            />
            {/* Pattern Overlay */}
            <SlidePattern pattern={s.pattern} color={s.accentColor} />

            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 70% at 70% 50%, ${s.accentColor}18 0%, transparent 70%)`,
              }}
            />

            {/* Bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* CONTENT — only animate when this slide is becoming active */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32">
              <div className="max-w-4xl">
                {/* Badge */}
                <div
                  className="inline-flex items-center space-x-2 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-8"
                  style={{
                    background: `${s.accentColor}22`,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: s.accentColor }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: s.accentColor }} />
                  </span>
                  <span className="text-xs font-black text-white/90 uppercase tracking-[0.15em]">{s.badge}</span>
                </div>

                {/* Title */}
                <div
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
                  }}
                >
                  {s.title.map((line, li) => (
                    <h1
                      key={li}
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tight"
                    >
                      {line.includes(s.titleHighlight) ? (
                        <>
                          {line.split(s.titleHighlight)[0]}
                          <span style={{ color: s.accentColor }}>{s.titleHighlight}</span>
                          {line.split(s.titleHighlight)[1]}
                        </>
                      ) : line}
                    </h1>
                  ))}
                </div>

                {/* Subtitle */}
                <p
                  className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-medium"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
                  }}
                >
                  {s.subtitle}
                </p>

                {/* CTAs */}
                <div
                  className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.8s ease 0.75s, transform 0.8s ease 0.75s",
                  }}
                >
                  <Link
                    href={s.cta.href}
                    className="group inline-flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                    style={{
                      background: s.accentColor,
                      boxShadow: `0 8px 32px ${s.accentColor}50`,
                      color: s.id === 0 || s.id === 2 ? "#0f172a" : "white",
                    }}
                  >
                    <span>{s.cta.label}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {s.ctaSecondary && (
                    <Link
                      href={s.ctaSecondary.href}
                      className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      <span>{s.ctaSecondary.label}</span>
                    </Link>
                  )}
                </div>

                {/* Stats */}
                <div
                  className="mt-14 flex items-center gap-10"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(15px)",
                    transition: "opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s",
                  }}
                >
                  <div>
                    <div className="text-4xl font-black text-white">{s.stat1.value}</div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">{s.stat1.label}</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div>
                    <div className="text-4xl font-black" style={{ color: s.accentColor }}>{s.stat2.value}</div>
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">{s.stat2.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── SLIDE COUNTER & NAVIGATION ─── */}
      <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 xl:left-32 z-30 flex items-center space-x-6">
        {/* Prev & Next */}
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide counter */}
        <div className="text-white/50 text-sm font-black tabular-nums select-none">
          <span className="text-white text-xl">{String(current + 1).padStart(2, "0")}</span>
          <span className="mx-2">/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* ─── DOT NAVIGATION ─── */}
      <div className="absolute bottom-8 right-8 md:right-16 z-30 flex flex-col items-end space-y-3">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx, idx > current ? "right" : "left")}
            aria-label={`Aller à la diapositive ${idx + 1}`}
            className="flex items-center group"
          >
            <span
              className="text-xs font-bold text-white/30 group-hover:text-white/70 transition-colors mr-3 hidden md:block"
              style={{ color: idx === current ? slides[idx].accentColor : undefined }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span
              className={`block rounded-full transition-all duration-500`}
              style={{
                width: idx === current ? "32px" : "8px",
                height: "8px",
                background: idx === current ? s.accentColor : "rgba(255,255,255,0.25)",
                boxShadow: idx === current ? `0 0 12px ${s.accentColor}` : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* ─── PROGRESS BAR ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30">
        <div
          className="h-full transition-none"
          style={{
            width: `${progress}%`,
            background: slide.accentColor,
            boxShadow: `0 0 8px ${slide.accentColor}`,
            transition: isPaused ? "none" : "width 0.1s linear",
          }}
        />
      </div>

      {/* ─── SCROLL INDICATOR ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-2 opacity-50">
        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
        </div>
      </div>

      {/* ─── KEYFRAME STYLES ─── */}
      <style jsx>{`
        @keyframes slideInRight {
          from { clip-path: inset(0 0 0 100%); }
          to   { clip-path: inset(0 0 0 0%); }
        }
        @keyframes slideInLeft {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0%); }
        }
      `}</style>
    </section>
  );
}
