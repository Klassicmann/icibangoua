import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, BookOpen, Clock, Settings, LogOut, ChevronRight } from "lucide-react";
import NdopBackground from "@/components/NdopBackground";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full py-12 lg:py-20 overflow-hidden">
      <NdopBackground opacityLight={0.05} opacityDark={0.08} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-600/20">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tight">{session.user?.name}</h1>
                  <p className="text-foreground/50 font-bold flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               <span className="bg-blue-600/10 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-600/20 flex items-center">
                  <Shield className="w-3 h-3 mr-2" />
                  {(session.user as any).roles?.[0] || 'Membre'}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar / Stats */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-6">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold">Modules suivis</span>
                    </div>
                    <span className="text-lg font-black italic">0</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-bold">Temps d'étude</span>
                    </div>
                    <span className="text-lg font-black italic">0h</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-3xl p-6 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h3 className="font-black text-xl mb-2 italic">Passer PRO</h3>
                  <p className="text-white/70 text-sm font-medium mb-4 leading-relaxed">
                    Débloquez l'accès à tous les modules certifiés et rejoignez le cercle des leaders.
                  </p>
                  <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                    Découvrir l'offre
                  </button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <section>
                <h2 className="text-xl font-black text-foreground mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-blue-600" />
                  Paramètres du compte
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Informations personnelles", desc: "Changez votre nom ou email", icon: User },
                    { title: "Sécurité", desc: "Mettre à jour le mot de passe", icon: Shield },
                    { title: "Préférences notifications", desc: "Gérez vos alertes", icon: Clock },
                    { title: "Paramètres de confidentialité", desc: "Visibilité de votre profil", icon: Settings },
                  ].map((item, i) => (
                    <button key={i} className="flex p-5 bg-card/30 hover:bg-card border border-border rounded-3xl transition-all group text-left">
                      <div className="p-3 bg-blue-600/10 rounded-2xl mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-sm text-foreground mb-1">{item.title}</h4>
                        <p className="text-xs font-medium text-foreground/40">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-foreground/20 self-center" />
                    </button>
                  ))}
                </div>
              </section>

              <div className="h-px bg-border/50"></div>

              <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
                <h3 className="text-red-500 font-black text-lg mb-2">Zone de danger</h3>
                <p className="text-foreground/50 text-sm font-medium mb-6">
                  Toutes les actions ici sont irréversibles. Soyez prudent.
                </p>
                <button className="text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all">
                  Supprimer mon compte
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
