"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function authenticateAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Senha incorreta." };
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin");
}

export async function createGift(formData: FormData) {
  const title = formData.get("title") as string;
  const rawPrice = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const category = (formData.get("category") as string) || "Outros";
  const isQuota = formData.get("isQuota") === "on";
  const totalQuotas = isQuota ? parseInt(formData.get("totalQuotas") as string, 10) || 1 : 1;

  if (!title || isNaN(rawPrice) || !imageUrl) {
    throw new Error("Preencha título, valor e URL da imagem.");
  }

  // Se for cota, o preço individual é o total dividido pelo número de cotas
  const quotaPrice = isQuota ? rawPrice / totalQuotas : rawPrice;

  await prisma.gift.create({
    data: {
      title,
      price: quotaPrice,
      totalPrice: rawPrice,
      imageUrl,
      category,
      isQuota,
      totalQuotas,
      paidQuotas: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteGift(id: string) {
  await prisma.gift.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}