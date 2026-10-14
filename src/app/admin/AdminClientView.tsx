"use client";

import { useState } from "react";
import { authenticateAdmin, createGift, deleteGift, logoutAdmin } from "./actions";
import { PlusCircle, Trash2, Lock, LogOut, Gift as GiftIcon, ExternalLink, Layers } from "lucide-react";
import Link from "next/link";

type Gift = {
  id: string;
  title: string;
  price: number;
  totalPrice: number | null;
  imageUrl: string;
  category: string;
  isQuota: boolean;
  totalQuotas: number;
  paidQuotas: number;
};

const ROOMS = [
  "Cozinha",
  "Sala de Estar",
  "Quarto do Casal",
  "Casa de Banho",
  "Varanda / Área Gourmet",
  "Lavandaria",
  "Outros",
];

export default function AdminClientView({
  initialAuth,
  gifts,
}: {
  initialAuth: boolean;
  gifts: Gift[];
}) {
  const [isAuth, setIsAuth] = useState(initialAuth);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isQuotaChecked, setIsQuotaChecked] = useState(false);
  const [inputPrice, setInputPrice] = useState<number | string>("");
  const [inputQuotas, setInputQuotas] = useState<number>(2);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await authenticateAdmin(password);
    if (res.success) {
      setIsAuth(true);
      window.location.reload();
    } else {
      setError(res.error || "Senha incorreta.");
    }
    setLoading(false);
  };

  if (!isAuth) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800">Painel do Chá de Casa Nova</h1>
        <p className="text-sm text-stone-500 mt-1 mb-6">Digite a senha de administrador para continuar</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            required
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Acessar Painel"}
          </button>
        </form>
      </div>
    );
  }

  const calculatedQuotaValue =
    isQuotaChecked && Number(inputPrice) > 0 && inputQuotas > 0
      ? (Number(inputPrice) / inputQuotas).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Gerir Presentes & Cotas</h1>
          <p className="text-sm text-stone-500">Adicione itens divididos por compartimentos ou em cotas</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 border px-3 py-1.5 rounded-lg bg-stone-50"
          >
            Ver site <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={async () => {
              await logoutAdmin();
              setIsAuth(false);
            }}
            className="flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 h-fit">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-rose-500" /> Novo Presente
          </h2>

          <form
            action={async (formData) => {
              await createGift(formData);
              (document.getElementById("gift-form") as HTMLFormElement)?.reset();
              setIsQuotaChecked(false);
              setInputPrice("");
            }}
            id="gift-form"
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-stone-600 uppercase">Nome do Item</label>
              <input
                name="title"
                type="text"
                placeholder="Ex: Frigorífico Frost Free"
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 uppercase">Cômodo</label>
              <select
                name="category"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {ROOMS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 uppercase">Valor Total (R$)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Ex: 2000.00"
                value={inputPrice}
                onChange={(e) => setInputPrice(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Configuração de Cotas */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isQuota"
                  checked={isQuotaChecked}
                  onChange={(e) => setIsQuotaChecked(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-stone-700">Dividir em Cotas?</span>
              </label>

              {isQuotaChecked && (
                <div className="space-y-2 pt-1 border-t border-stone-200">
                  <label className="text-xs text-stone-600 block">Número de Cotas:</label>
                  <input
                    type="number"
                    name="totalQuotas"
                    min="2"
                    max="50"
                    value={inputQuotas}
                    onChange={(e) => setInputQuotas(parseInt(e.target.value, 10) || 2)}
                    className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  {calculatedQuotaValue && (
                    <p className="text-xs text-rose-600 font-medium">
                      Ficará {inputQuotas} cotas de {calculatedQuotaValue} cada.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 uppercase">Link da Imagem</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 rounded-xl transition-colors text-sm"
            >
              Adicionar Presente
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">
            Itens Registados ({gifts.length})
          </h2>

          {gifts.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <GiftIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum presente na lista ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto pr-1">
              {gifts.map((gift) => (
                <div key={gift.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={gift.imageUrl}
                      alt={gift.title}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 border"
                    />
                    <div>
                      <h4 className="font-medium text-stone-800 text-sm">{gift.title}</h4>
                      <p className="text-xs text-rose-600 font-bold">
                        {gift.isQuota ? (
                          <>
                            {gift.totalQuotas}x de{" "}
                            {gift.price.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                            <span className="text-stone-500 font-normal ml-1">
                              (Total:{" "}
                              {(gift.totalPrice || gift.price * gift.totalQuotas).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                              )
                            </span>
                          </>
                        ) : (
                          gift.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        )}
                        <span className="ml-2 font-normal text-stone-400">[{gift.category}]</span>
                      </p>
                      {gift.isQuota && (
                        <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3" /> {gift.paidQuotas} de {gift.totalQuotas} cotas presenteadas
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (confirm(`Remover "${gift.title}"?`)) {
                        await deleteGift(gift.id);
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}