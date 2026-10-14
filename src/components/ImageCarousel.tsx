"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  { url: "/casal.jpeg", alt: "Arthur & Pyetra 1" },
  { url: "/casal-2.jpeg", alt: "Arthur & Pyetra 2" },
  { url: "/casal-3.jpeg", alt: "Arthur & Pyetra 3" },
  { url: "/casal-4.jpeg", alt: "Arthur & Pyetra 4" },
  { url: "/casal-5.jpeg", alt: "Arthur & Pyetra 5" },
  { url: "/casal-6.jpeg", alt: "Arthur & Pyetra 6" },
  { url: "/casal-7.jpeg", alt: "Arthur & Pyetra 7" },
  { url: "/casal-8.jpeg", alt: "Arthur & Pyetra 8" },
];

export function ImageCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>(".carousel-item");
    if (cards[index]) {
      const card = cards[index];
      // Centraliza a foto selecionada no container
      const scrollPos = card.offsetLeft - (container.clientWidth / 2 - card.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollPos), behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = activeIndex === 0 ? IMAGES.length - 1 : activeIndex - 1;
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % IMAGES.length;
    scrollToIndex(nextIdx);
  };

  // Atualiza o dot ativo conforme o usuário rola manualmente
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.querySelectorAll<HTMLElement>(".carousel-item");
    const center = container.scrollLeft + container.clientWidth / 2;

    cards.forEach((card, idx) => {
      const left = card.offsetLeft;
      const right = left + card.clientWidth;
      if (center >= left && center <= right) {
        setActiveIndex(idx);
      }
    });
  };

  return (
    <section className="w-full my-10 relative overflow-hidden select-none">
      {/* Botões laterais flutuantes */}
      <button
        onClick={handlePrev}
        aria-label="Foto anterior"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/85 hover:bg-white text-stone-800 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Próxima foto"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/85 hover:bg-white text-stone-800 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Faixa contínua de fotos lado a lado estilo galeria panorâmica */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth px-4 sm:px-12 md:px-20 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {IMAGES.map((img, index) => (
          <div
            key={index}
            onClick={() => scrollToIndex(index)}
            className="carousel-item shrink-0 h-72 sm:h-80 md:h-[380px] rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200/60 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="h-full w-auto max-w-none object-cover sm:object-contain bg-stone-900/5 block"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Pontos de navegação inferiores */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            aria-label={`Ir para a foto ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex
                ? "bg-stone-700 w-6 h-2"
                : "bg-stone-300 hover:bg-stone-400 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}