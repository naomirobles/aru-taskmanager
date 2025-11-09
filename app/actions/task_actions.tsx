// app/actions/task-actions.ts
"use server";

import { auth, clerkClient  } from '@clerk/nextjs/server';
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
  description?: string;
  category_id: string;
  start_date?: Date;
  due_date?: Date;
  estimated_duration?: number;
  status?: TaskStatus;
  notes?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  id: string;
};

export async function createTask(data: CreateTaskInput) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    const task = await db.task.create({
      data: {
        ...data,
        user_id: userId,
        start_date: data.start_date ? new Date(data.start_date) : null,
        due_date: data.due_date ? new Date(data.due_date) : null,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/calendar");
    revalidatePath("/");

    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Error al crear la tarea" };
  }
}

export async function updateTask(data: UpdateTaskInput) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    const { id, ...updateData } = data;

    // Verify task belongs to user
    const existingTask = await db.task.findUnique({
      where: { id },
      select: { user_id: true },
    });

    if (!existingTask || existingTask.user_id !== userId) {
      return { error: "Tarea no encontrada" };
    }

    const task = await db.task.update({
      where: { id },
      data: {
        ...updateData,
        start_date: updateData.start_date ? new Date(updateData.start_date) : undefined,
        due_date: updateData.due_date ? new Date(updateData.due_date) : undefined,
        updated_at: new Date(),
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/calendar");
    revalidatePath("/");

    return { success: true, task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Error al actualizar la tarea" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verify task belongs to user
    const existingTask = await db.task.findUnique({
      where: { id: taskId },
      select: { user_id: true },
    });

    if (!existingTask || existingTask.user_id !== userId) {
      return { error: "Tarea no encontrada" };
    }

    await db.task.delete({
      where: { id: taskId },
    });

    revalidatePath("/calendar");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Error al eliminar la tarea" };
  }
}

export async function toggleTaskComplete(taskId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    const existingTask = await db.task.findUnique({
      where: { id: taskId },
      select: { user_id: true, is_completed: true },
    });

    if (!existingTask || existingTask.user_id !== userId) {
      return { error: "Tarea no encontrada" };
    }

    const task = await db.task.update({
      where: { id: taskId },
      data: {
        is_completed: !existingTask.is_completed,
        completed_at: !existingTask.is_completed ? new Date() : null,
        status: !existingTask.is_completed ? TaskStatus.COMPLETED : TaskStatus.TODO,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/calendar");
    revalidatePath("/");

    return { success: true, task };
  } catch (error) {
    console.error("Error toggling task:", error);
    return { error: "Error al actualizar la tarea" };
  }
}

export async function getTasksByDateRange(startDate: Date, endDate: Date) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    const tasks = await db.task.findMany({
      where: {
        user_id: userId,
        OR: [
          {
            start_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            due_date: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        start_date: "asc",
      },
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { error: "Error al obtener las tareas" };
  }
}