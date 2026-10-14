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

  // Substitua pela sua chave PIX para transferências manuais
  const pixKey = "suachavepix@email.com";

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
      alert("Erro ao iniciar pagamento.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const isSoldOut = gift.isQuota && (gift.paidQuotas || 0) >= (gift.totalQuotas || 1);

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          {/* Foto */}
          <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
            <img
              src={gift.imageUrl}
              alt={gift.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              {gift.category}
            </span>
          </div>

          {/* Dados */}
          <div className="p-4">
            <h3 className="font-bold text-stone-800 text-base line-clamp-1">{gift.title}</h3>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-rose-600">
                {gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              {gift.isQuota && <span className="text-xs text-stone-400">/ cota</span>}
            </div>

            {/* Progresso de Cotas */}
            {gift.isQuota && (
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                  <span>
                    Cotas: {gift.paidQuotas || 0}/{gift.totalQuotas || 1}
                  </span>
                  <span>
                    Total:{" "}
                    {(gift.totalPrice || gift.price * (gift.totalQuotas || 1)).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
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

        {/* Botão */}
        <div className="p-4 pt-0">
          <button
            onClick={() => setIsOpen(true)}
            disabled={isSoldOut}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 text-white font-medium py-2 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            {isSoldOut
              ? "Esgotado / Totalmente Presenteado"
              : gift.isQuota
              ? "Presentear com uma Cota"
              : "Presentear"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-lg w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-stone-800 text-center mb-1">
              {gift.isQuota ? "Escolher Forma de Pagamento da Cota" : "Presentear Arthur & Pyetra"}
            </h3>
            <p className="text-xs text-stone-500 text-center mb-6">
              Item: <strong className="text-stone-700">{gift.title}</strong> • Valor:{" "}
              <strong className="text-rose-600">
                {gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </p>

            <div className="space-y-4">
              {/* Opção 1: Mercado Pago (Cartão parcelado em até 12x ou PIX automático) */}
              <div className="border border-rose-200 bg-rose-50/40 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito ou PIX com Confirmação</span>
                </div>
                <p className="text-xs text-stone-600 mb-3">
                  Pague com cartão de crédito (parcelado em até 12x) ou débito/PIX direto pelo Mercado Pago.
                </p>
                <button
                  onClick={handleIntegratedPayment}
                  disabled={loadingCheckout}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingCheckout ? (
                    "A abrir pagamento..."
                  ) : (
                    <>
                      Pagar com Cartão / Checkout <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Opção 2: PIX Direto */}
              <div className="border border-stone-200 bg-stone-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-1">
                  <QrCode className="w-4 h-4 text-stone-500" />
                  <span>PIX Direto (Chave Manual)</span>
                </div>
                <p className="text-xs text-stone-500 mb-2">
                  Se preferir transferir diretamente pelo seu banco, copie a nossa chave:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixKey}
                    className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-mono text-stone-700 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-stone-800 hover:bg-stone-900 text-white p-2 rounded-lg text-xs flex items-center gap-1 transition-colors shrink-0"
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