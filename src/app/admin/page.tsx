import { prisma } from "@/lib/prisma";
import AdminClientView from "./AdminClientView";

export default async function AdminPage() {
  const gifts = await prisma.gift.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-stone-800 mb-6">Painel Administrativo</h1>
        <AdminClientView initialAuth={false} gifts={gifts as any} />
      </div>
    </div>
  );
}