// app/calendar/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CalendarView } from "@/components/calendar/CalendarView";
import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";

interface PageProps {
  searchParams: { month?: string; year?: string };
}

async function getTasks(userId: string, month: number, year: number) {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(addMonths(startDate, 1));

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
      saved_recommendations: true, // ← Agregar esto
    },
    orderBy: {
      start_date: "asc",
    },
  });

  return tasks;
}

async function getCategories(userId: string) {
  const categories = await db.category.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const { userId } = await auth()


  if (!userId) {
    redirect("/sign-in");
  }

  const now = new Date();
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth();
  const year = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  // Fetch tasks and categories in parallel
  const [tasks, categories] = await Promise.all([
    getTasks(userId, month, year),
    getCategories(userId),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto p-6">
        <CalendarView 
          initialTasks={tasks} 
          initialMonth={month} 
          initialYear={year}
          categories={categories}
        />
      </div>
    </div>
  );
}