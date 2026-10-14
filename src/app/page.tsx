import { Suspense } from "react";
import { Countdown } from "@/components/Countdown";
import { GiftList } from "@/components/GiftList";
import { Heart, Gift as GiftIcon, Calendar, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 pb-20">
      {/* Hero Banner */}
      <section className="relative h-[65vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-rose-100/60 via-stone-50/40 to-stone-50">
        <div className="flex items-center gap-2 text-rose-500 font-medium tracking-widest uppercase text-sm mb-3">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>Nosso Chá de Bebê</span>
          <Heart className="w-4 h-4 fill-rose-500" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-stone-800 tracking-tight">
          Arthur & Pyetra
        </h1>
        <p className="mt-3 text-stone-600 max-w-md text-base md:text-lg">
          Estamos muito felizes em celebrar esse momento especial com vocês!
        </p>

        {/* Data e Local */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-stone-600">
          <span className="flex items-center gap-1.5 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-stone-200/60">
            <Calendar className="w-4 h-4 text-rose-500" /> 15 de Dezembro de 2026
          </span>
          <span className="flex items-center gap-1.5 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-stone-200/60">
            <MapPin className="w-4 h-4 text-rose-500" /> Rio de Janeiro, RJ
          </span>
        </div>

        {/* Contador */}
        <div className="mt-8 w-full max-w-md">
          <Countdown targetDate="2026-12-15T15:00:00" />
        </div>
      </section>

      {/* Sessão da Mensagem */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-serif text-stone-800 mb-4">Bem-vindos ao nosso cantinho!</h2>
        <p className="text-stone-600 leading-relaxed">
          Criamos este site para compartilhar com amigos e familiares cada detalhe desse momento tão esperado. 
          Aqui você encontra nossa lista de presentes e pode nos ajudar a montar o enxoval diretamente via PIX.
        </p>
      </section>

      {/* Lista de Presentes envolvida por Suspense */}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-stone-800">Lista de Presentes</h2>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-16 text-stone-400">
              <p className="text-sm">Carregando presentes...</p>
            </div>
          }
        >
          <GiftList />
        </Suspense>
      </section>
    </main>
  );
}