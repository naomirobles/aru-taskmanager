// components/calendar/ListViewTask.tsx
"use client";

import { Task, Category, SavedRecommendation } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface ListViewTaskProps {
  task: TaskWithRelations;
  onClick: () => void;
}

export function ListViewTask({ task, onClick }: ListViewTaskProps) {
  const formatDateRange = () => {
    if (!task.start_date && !task.due_date) return null;

    const startDate = task.start_date ? new Date(task.start_date) : null;
    const dueDate = task.due_date ? new Date(task.due_date) : null;

    if (startDate && dueDate) {
      const startMonth = format(startDate, "MMM dd", { locale: es });
      const endMonth = format(dueDate, "MMM dd", { locale: es });
      
      // Capitalizar primera letra
      const formattedStart = startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
      const formattedEnd = endMonth.charAt(0).toUpperCase() + endMonth.slice(1);
      
      return `${formattedStart} - ${formattedEnd}`;
    } else if (startDate) {
      const formatted = format(startDate, "MMM dd", { locale: es });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } else if (dueDate) {
      const formatted = format(dueDate, "MMM dd", { locale: es });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    return null;
  };

  const dateRange = formatDateRange();

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 group-hover:text-[#7a6bc0] transition-colors mb-1">
            {task.title}
          </h4>
          {dateRange && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateRange}</span>
            </div>
          )}
        </div>

        {/* Indicador de completado */}
        <div className="flex-shrink-0">
          {task.is_completed ? (
            <div className="w-5 h-5 rounded-full bg-[#8b7dd8] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#8b7dd8] transition-colors" />
          )}
        </div>
      </div>
    </button>
  );
}
