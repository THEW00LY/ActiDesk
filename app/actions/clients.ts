"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  //extraction des champ du formulaire
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;

  //validation coté serv
  if (!name || !email) {
    throw new Error("Le nom et l'email sont obligatoire.");
  }

  //insertion dans postgre
  await prisma.client.create({
    data: {
      name,
      email,
      company: company || null,
    },
  });

  //force nextjs a recharger les données de /clients
  revalidatePath("/clients");
}
