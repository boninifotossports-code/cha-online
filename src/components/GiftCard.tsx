"use client";
import { useState } from "react";
import Image from "next/image";

type GiftProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: string;
};

export function GiftCard({ gift }: { gift: GiftProps }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col justify-between">
      <div className="relative h-48 w-full bg-zinc-50">
        <Image src={gift.imageUrl} alt={gift.title} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-zinc-800">{gift.title}</h3>
          <p className="text-rose-600 font-bold mt-1">
            {gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 rounded-xl transition-colors"
        >
          Presentear
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <h4 className="font-bold text-lg">Presentear: {gift.title}</h4>
            <p className="text-sm text-zinc-600">
              Valor: <strong>{gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
            </p>
            <div className="bg-zinc-100 p-3 rounded-lg text-xs font-mono break-all select-all">
              suachavepix@email.com
            </div>
            <p className="text-xs text-zinc-400">Copie a chave acima e envie pelo seu app bancário.</p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-zinc-200 hover:bg-zinc-300 text-zinc-800 py-2 rounded-xl text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}