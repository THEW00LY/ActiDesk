'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    const budget = parseFloat(formData.get("budget") as string) || 0;
    const clientId = formData.get("clientId") as string;
    const deadlineStr = formData.get("deadline") as string;

    if (!name || !clientId) {
        throw new Error("Le nom du projet et le client sont obligatoire");
    }

    await prisma.project.create({
        data: {
            name,
            budget,
            clientId,
            deadline: deadlineStr ? new Date(deadlineStr) : null,
            status: "in_progress",
        },
    });

    revalidatePath("/projects");
    revalidatePath("/dashboard"); //prcq ya la prévisualisation des projets dedans
}