// app/actions/recommendation-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRecommendations(taskId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "No autorizado" };
    }

    const recommendations = await db.savedRecommendation.findMany({
      where: {
        task_id: taskId,
      },
      orderBy: {
        saved_at: "desc",
      },
    });

    return { success: true, recommendations };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { error: "Error al obtener las recomendaciones" };
  }
}

export async function createRecommendation(taskId: string, content: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la tarea pertenece al usuario
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { user_id: true },
    });

    if (!task || task.user_id !== userId) {
      return { error: "Tarea no encontrada" };
    }

    const recommendation = await db.savedRecommendation.create({
      data: {
        task_id: taskId,
        user_id: userId,
        description: content,
        title: "",
        url: "",
        type: "MANUAL",
        source: "USER",
      },
    });

    revalidatePath("/");

    return { success: true, recommendation };
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return { error: "Error al crear la recomendación" };
  }
}

export async function deleteRecommendation(recommendationId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la recomendación pertenece a una tarea del usuario
    const recommendation = await db.savedRecommendation.findUnique({
      where: { id: recommendationId },
      include: {
        task: {
          select: { user_id: true },
        },
      },
    });

    if (!recommendation || recommendation.task.user_id !== userId) {
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