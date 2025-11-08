// components/calendar/CalendarGrid.tsx
"use client";

import { useMemo } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  format 
} from "date-fns";
import { Task, Category, SavedRecommendation } from "@prisma/client";
import { CalendarTask } from "./CalendarTask";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface CalendarGridProps {
  tasks: TaskWithRelations[];
  currentMonth: number;
  currentYear: number;
  view: "month" | "week";
  onAddTask: (date: Date) => void;
  onTaskClick: (task: TaskWithRelations) => void;
}

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function CalendarGrid({ 
  tasks, 
  currentMonth, 
  currentYear, 
  view, 
  onAddTask,
  onTaskClick 
}: CalendarGridProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth, currentYear]);

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      const taskStart = task.start_date ? new Date(task.start_date) : null;
      const taskDue = task.due_date ? new Date(task.due_date) : null;

      if (taskStart && taskDue) {
        return day >= taskStart && day <= taskDue;
      } else if (taskStart) {
        return isSameDay(day, taskStart);
      } else if (taskDue) {
        return isSameDay(day, taskDue);
      }
      return false;
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-purple-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, new Date(currentYear, currentMonth));
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-[120px] border rounded-lg p-2 transition-all cursor-pointer ${
                isCurrentMonth
                  ? "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                  : "bg-gray-50 border-gray-100"
              } ${isCurrentDay ? "ring-2 ring-purple-400" : ""}`}
              onClick={() => onAddTask(day)}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-medium ${
                    isCurrentMonth ? "text-gray-700" : "text-gray-400"
                  } ${
                    isCurrentDay 
                      ? "bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center" 
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <CalendarTask 
                    key={task.id} 
                    task={task}
                    onTaskClick={onTaskClick}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayTasks.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}