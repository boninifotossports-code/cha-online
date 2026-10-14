import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "./actions";
import AdminClientView from "./AdminClientView";

// Componente que executa as operações de runtime (cookies e banco)
async function AdminContent() {
  const isAuthenticated = await checkAdminAuth();

  const gifts = isAuthenticated
    ? await prisma.gift.findMany({
        orderBy: { createdAt: "desc" },
      })
    : [];

  return <AdminClientView initialAuth={isAuthenticated} gifts={gifts} />;
}

// Página principal com fallback do Suspense para permitir o prerender estático
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-12 text-stone-800">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto mt-20 text-center text-stone-400">
            <p className="text-sm">Carregando painel...</p>
          </div>
        }
      >
        <AdminContent />
      </Suspense>
    </div>
  );
}