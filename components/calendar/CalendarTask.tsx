// components/calendar/CalendarTask.tsx
"use client";

import { Task, Category, SavedRecommendation } from "@prisma/client";
import { Clock } from "lucide-react";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface CalendarTaskProps {
  task: TaskWithRelations;
  onTaskClick: (task: TaskWithRelations) => void;
}

export function CalendarTask({ task, onTaskClick }: CalendarTaskProps) {
  const categoryColor = task.category?.color || "#93c5fd";
  
  return (
    <div
      className="rounded px-2 py-1 text-xs truncate cursor-pointer hover:opacity-80 transition-opacity"
      style={{ 
        backgroundColor: `${categoryColor}20`,
        color: categoryColor 
      }}
      title={task.title}
      onClick={(e) => {
        e.stopPropagation();
        onTaskClick(task);
      }}
    >
      <div className="flex items-center gap-1">
        {task.estimated_duration && (
          <Clock className="w-3 h-3 flex-shrink-0" />
        )}
        <span className={`truncate font-medium ${task.is_completed ? "line-through" : ""}`}>
          {task.title}
        </span>
      </div>
    </div>
  );
}