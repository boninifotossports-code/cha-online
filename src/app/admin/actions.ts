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
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const category = (formData.get("category") as string) || "Geral";
  const description = (formData.get("description") as string) || "";

  if (!title || isNaN(price) || !imageUrl) {
    throw new Error("Preencha título, valor e URL da imagem.");
  }

  await prisma.gift.create({
    data: {
      title,
      price,
      imageUrl,
      category,
      description,
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