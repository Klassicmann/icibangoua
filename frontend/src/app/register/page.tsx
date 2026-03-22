"use client";

import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, User, Mail, AlertCircle, ChevronLeft, CheckCircle2 } from "lucide-react";
import NdopBackground from "@/components/NdopBackground";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerUser({ username, email, password });
        
        if (result.id) {
            setIsSuccess(true);
            // Wait 2 seconds then sign in
            setTimeout(async () => {
                await signIn("credentials", {
                    username,
                    password,
                    callbackUrl: "/",
                });
            }, 2000);
        } else {
            setError(result.message || "Une erreur est survenue lors de l'inscription.");
        }
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue.");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 overflow-hidden">
        <NdopBackground opacityLight={0.07} opacityDark={0.12} />
        <div className="w-full max-w-md relative z-10 text-center animate-fade-in-up">
          <div className="bg-card/80 backdrop-blur-2xl border border-border shadow-2xl rounded-[2.5rem] p-10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-4">Bienvenue !</h1>
            <p className="text-foreground/60 font-bold mb-8">
              Votre compte a été créé avec succès. Connexion automatique en cours...
            </p>
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 py-20 overflow-hidden">
      <NdopBackground opacityLight={0.07} opacityDark={0.12} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-sm font-bold text-foreground/50 hover:text-foreground mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="bg-card/80 backdrop-blur-2xl border border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">
                Créer un <span className="text-blue-600">Compte</span>.
              </h1>
              <p className="text-foreground/60 font-medium">
                Rejoignez la plus grande plateforme jeunesse de Bangoua pour apprendre et partager ensemble.
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
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground"
                    placeholder="ex: jeune_bangoua"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-border focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-foreground"
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
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center border-t border-border pt-8">
              <p className="text-sm font-bold text-foreground/50">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
