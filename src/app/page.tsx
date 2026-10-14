import { Suspense } from "react";
import { Countdown } from "@/components/Countdown";
import { GiftList } from "@/components/GiftList";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Heart, Gift as GiftIcon, Calendar, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 pb-20">
      {/* Banner Principal */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-rose-100/70 via-stone-50/50 to-stone-50">
        
        {/* Foto de Destaque */}
        <div className="relative mb-6">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-stone-100">
            <img
              src="/casal.jpeg"
              alt="Arthur e Pyetra"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-2 rounded-full shadow-md">
            <Heart className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Subtítulo */}
        <div className="flex items-center gap-2 text-rose-600 font-semibold tracking-widest uppercase text-xs md:text-sm mb-2">
          <span>Nosso Chá de Casa Nova</span>
        </div>
        
        {/* Nomes */}
        <h1 className="text-4xl md:text-6xl font-serif text-stone-800 tracking-tight font-normal">
          Arthur & Pyetra
        </h1>

        {/* Mensagem */}
        <p className="mt-3 text-stone-600 max-w-lg text-base md:text-lg leading-relaxed">
          Preparamos este cantinho com muito carinho para compartilhar com vocês a alegria da nossa casa nova.
        </p>

        {/* Informações de Data e Local */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm font-medium text-stone-700">
          <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm border border-stone-200/80">
            <Calendar className="w-4 h-4 text-rose-500" /> 8 de Novembro de 2026
          </span>
          <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm border border-stone-200/80">
            <MapPin className="w-4 h-4 text-rose-500" /> Rio de Janeiro, RJ
          </span>
        </div>

        {/* Contador Regressivo */}
        <div className="mt-8 w-full max-w-md">
          <Countdown targetDate="2026-11-08T15:00:00" />
        </div>
      </section>

      {/* Carrossel Panorâmico */}
      <ImageCarousel />

      {/* Mensagem de Boas-Vindas */}
      <section className="max-w-2xl mx-auto px-6 py-6 text-center">
        <h2 className="text-2xl font-serif text-stone-800 mb-3">Bem-vindos à nossa lista de presentes</h2>
        <p className="text-stone-600 leading-relaxed text-sm md:text-base">
          A presença e o carinho de vocês são o nosso melhor presente. Caso queiram nos ajudar a equipar o nosso novo lar, fiquem à vontade para escolher qualquer item da lista abaixo e fazer a contribuição diretamente via PIX ou Cartão de Crédito.
        </p>
      </section>

      {/* Lista de Presentes Agrupada por Cômodo */}
      <section className="max-w-6xl mx-auto px-6 mt-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-stone-800">Lista de Presentes</h2>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-16 text-stone-400">
              <p className="text-sm">Carregando os presentes...</p>
            </div>
          }
        >
          <GiftList />
        </Suspense>
      </section>
    </main>
  );
}