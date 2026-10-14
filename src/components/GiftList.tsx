import { prisma } from "@/lib/prisma";
import { GiftCard } from "@/components/GiftCard";
import { Gift as GiftIcon } from "lucide-react";

export async function GiftList() {
  const gifts = await prisma.gift.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (gifts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
        <GiftIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500 font-medium">Nenhum presente cadastrado ainda.</p>
        <p className="text-xs text-stone-400 mt-1">Os itens cadastrados no painel aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {gifts.map((gift) => (
        <GiftCard key={gift.id} gift={gift} />
      ))}
    </div>
  );
}