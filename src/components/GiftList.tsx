import { prisma } from "@/lib/prisma";
import { GiftCard } from "@/components/GiftCard";
import { Gift as GiftIcon, Home } from "lucide-react";

export async function GiftList() {
  const gifts = await prisma.gift.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (gifts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200">
        <GiftIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500 font-medium">Nenhum presente registado ainda.</p>
        <p className="text-xs text-stone-400 mt-1">Os itens adicionados no painel de administração aparecerão aqui.</p>
      </div>
    );
  }

  // Agrupar produtos por divisão da casa
  const giftsByRoom = gifts.reduce((acc, gift) => {
    const room = gift.category || "Outros";
    if (!acc[room]) acc[room] = [];
    acc[room].push(gift);
    return acc;
  }, {} as Record<string, typeof gifts>);

  return (
    <div className="space-y-12">
      {Object.entries(giftsByRoom).map(([room, items]) => (
        <div key={room} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <Home className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-stone-800">{room}</h3>
            <span className="text-xs text-stone-400 font-medium ml-auto">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}