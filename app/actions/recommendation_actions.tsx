// app/actions/recommendation_actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteRecommendation(recommendationId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la recomendación pertenece al usuario
    const recommendation = await db.savedRecommendation.findUnique({
      where: { id: recommendationId },
      select: { user_id: true },
    });

    if (!recommendation || recommendation.user_id !== userId) {
      return { error: "Recomendación no encontrada" };
    }

    await db.savedRecommendation.delete({
      where: { id: recommendationId },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    return { error: "Error al eliminar la recomendación" };
  }
}