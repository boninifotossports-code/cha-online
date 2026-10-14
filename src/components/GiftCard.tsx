"use client";

import { useState } from "react";
import { Gift, CreditCard, QrCode, Check, Copy, ExternalLink } from "lucide-react";

export type GiftType = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  totalPrice?: number | null;
  imageUrl: string;
  category: string;
  isQuota?: boolean;
  totalQuotas?: number;
  paidQuotas?: number;
};

export function GiftCard({ gift }: { gift: GiftType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Chave PIX manual para transferências diretas
  const pixKey = "profarthur.ef@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleIntegratedPayment = async () => {
    try {
      setLoadingCheckout(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          title: gift.title,
          price: gift.price,
          isQuota: gift.isQuota,
        }),
      });

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Não foi possível carregar o checkout. Pode utilizar a chave PIX manual.");
      }
    } catch {
      alert("Erro ao iniciar o pagamento.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const isSoldOut = gift.isQuota && (gift.paidQuotas || 0) >= (gift.totalQuotas || 1);

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Foto inteira sem cortes (object-contain + preenchimento uniforme) */}
          <div className="relative h-60 w-full bg-stone-50 p-3 flex items-center justify-center border-b border-stone-100">
            <img
              src={gift.imageUrl}
              alt={gift.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-stone-700 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm border border-stone-200/60">
              {gift.category}
            </span>
          </div>

          {/* Dados do Presente com tipografia maior e mais legível */}
          <div className="p-5">
            <h3 className="font-bold text-stone-900 text-lg md:text-xl line-clamp-2 leading-snug">
              {gift.title}
            </h3>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-rose-600">
                {gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              {gift.isQuota && (
                <span className="text-sm font-medium text-stone-500">/ cota</span>
              )}
            </div>

            {/* Barra de Progresso e Valores das Cotas */}
            {gift.isQuota && (
              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs md:text-sm font-medium text-stone-600 mb-1.5">
                  <span>Cotas: <strong className="text-stone-800">{gift.paidQuotas || 0}/{gift.totalQuotas || 1}</strong></span>
                  <span>Total: <strong className="text-stone-800">{(gift.totalPrice || gift.price * (gift.totalQuotas || 1)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((gift.paidQuotas || 0) / (gift.totalQuotas || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Presentear aumentado */}
        <div className="p-5 pt-0">
          <button
            onClick={() => setIsOpen(true)}
            disabled={isSoldOut}
            className="w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.99] disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-2xl transition-all text-base flex items-center justify-center gap-2 shadow-sm"
          >
            <Gift className="w-5 h-5" />
            {isSoldOut
              ? "Esgotado / Totalmente Presenteado"
              : gift.isQuota
              ? "Presentear com uma Cota"
              : "Presentear"}
          </button>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-stone-800 text-center mb-1">
              {gift.isQuota ? "Escolher Forma de Pagamento da Cota" : "Presentear Arthur & Pyetra"}
            </h3>
            <p className="text-sm text-stone-500 text-center mb-6">
              Item: <strong className="text-stone-800">{gift.title}</strong> • Valor:{" "}
              <strong className="text-rose-600">
                {gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </p>

            <div className="space-y-4">
              {/* Opção 1: Mercado Pago (Cartão parcelado em até 12x ou PIX) */}
              <div className="border border-rose-200 bg-rose-50/50 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-base mb-1.5">
                  <CreditCard className="w-5 h-5" />
                  <span>Cartão de Crédito ou PIX com Confirmação</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600 mb-4 leading-relaxed">
                  Pague com cartão de crédito (parcelado em até 12x) ou débito/PIX direto pelo Mercado Pago.
                </p>
                <button
                  onClick={handleIntegratedPayment}
                  disabled={loadingCheckout}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white text-base font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loadingCheckout ? (
                    "A abrir o pagamento..."
                  ) : (
                    <>
                      Pagar com Cartão / Checkout <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Opção 2: Chave PIX Manual */}
              <div className="border border-stone-200 bg-stone-50 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-base mb-1.5">
                  <QrCode className="w-5 h-5 text-stone-600" />
                  <span>PIX Direto (Chave Manual)</span>
                </div>
                <p className="text-xs md:text-sm text-stone-500 mb-3">
                  Se preferir transferir diretamente pelo seu banco, copie a nossa chave:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixKey}
                    className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs md:text-sm font-mono text-stone-800 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}