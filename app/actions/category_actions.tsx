// app/actions/category-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const { userId } = await auth()


    if (!userId) {
      return { error: "No autorizado" };
    }

    const categories = await db.category.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Error al obtener las categorías" };
  }
}

export async function createCategory(name: string, color?: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await db.category.findFirst({
      where: {
        user_id: userId,
        name: {
          equals: name,
          mode: 'insensitive', // Case insensitive
        },
      },
    });

    if (existingCategory) {
      return { error: "Ya existe una categoría con ese nombre" };
    }

    // Generar un color aleatorio si no se proporciona
    const categoryColor = color || generateRandomColor();

    const category = await db.category.create({
      data: {
        user_id: userId,
        name,
        color: categoryColor,
      },
    });

    revalidatePath("/calendar");

    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Error al crear la categoría" };
  }
}

export async function updateCategory(categoryId: string, name: string, color?: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la categoría pertenece al usuario
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
      select: { user_id: true },
    });

    if (!existingCategory || existingCategory.user_id !== userId) {
      return { error: "Categoría no encontrada" };
    }

    // Verificar si ya existe otra categoría con ese nombre
    const duplicateCategory = await db.category.findFirst({
      where: {
        user_id: userId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
        NOT: {
          id: categoryId,
        },
      },
    });

    if (duplicateCategory) {
      return { error: "Ya existe una categoría con ese nombre" };
    }

    const category = await db.category.update({
      where: { id: categoryId },
      data: {
        name,
        ...(color && { color }), // Only update color if provided
      },
    });

    revalidatePath("/calendar");

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Error al actualizar la categoría" };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la categoría pertenece al usuario
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
      select: { user_id: true },
    });

    if (!existingCategory || existingCategory.user_id !== userId) {
      return { error: "Categoría no encontrada" };
    }

    // Verificar si hay tareas asociadas
    const tasksWithCategory = await db.task.count({
      where: {
        category_id: categoryId,
      },
    });

    if (tasksWithCategory > 0) {
      return { 
        error: `No se puede eliminar. Hay ${tasksWithCategory} tarea(s) usando esta categoría.`,
        tasksCount: tasksWithCategory 
      };
    }

    await db.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/calendar");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Error al eliminar la categoría" };
  }
}

// Función auxiliar para generar colores aleatorios
function generateRandomColor(): string {
  const colors = [
    "#EF4444", // red
    "#F59E0B", // amber
    "#10B981", // emerald
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#14B8A6", // teal
    "#F97316", // orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}