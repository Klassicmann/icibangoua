"use client";

import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, User, AlertCircle, ChevronLeft } from "lucide-react";
import NdopBackground from "@/components/NdopBackground";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background with Ndop Pattern */}
      <NdopBackground opacityLight={0.07} opacityDark={0.12} />
      
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-sm font-bold text-foreground/50 hover:text-foreground mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'accueil</span>
        </Link>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-2xl border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">
                Bon retour <span className="text-blue-600">parmi nous</span>.
              </h1>
              <p className="text-foreground/60 font-medium">
                Connectez-vous pour accéder à votre espace jeunesse et continuer votre apprentissage.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl flex items-center space-x-3 mb-6 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
                  Identifiant
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground placeholder:text-foreground/20"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">
                    Mot de passe
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                    Oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground placeholder:text-foreground/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex items-center justify-center space-x-2 group"
              >
                {isPending ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-foreground/50">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Inscrivez-vous ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
