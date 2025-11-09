// components/calendar/ListViewSection.tsx
"use client";

import { Task, Category, SavedRecommendation } from "@prisma/client";
import { ListViewTask } from "./ListViewTask";
import { Settings } from "lucide-react";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface ListViewSectionProps {
  category: Category;
  tasks: TaskWithRelations[];
  onTaskClick: (task: TaskWithRelations) => void;
  onCategoryClick: (category: Category) => void;
}

export function ListViewSection({ 
  category, 
  tasks, 
  onTaskClick,
  onCategoryClick 
}: ListViewSectionProps) {
  // Obtener el color de fondo basado en el color de la categoría
  const getBgColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      '#EF4444': 'bg-red-100',
      '#F59E0B': 'bg-amber-100', 
      '#10B981': 'bg-emerald-100',
      '#3B82F6': 'bg-blue-100',
      '#8B5CF6': 'bg-purple-100',
      '#EC4899': 'bg-pink-100',
      '#14B8A6': 'bg-teal-100',
      '#F97316': 'bg-orange-100',
    };
    return colorMap[color] || 'bg-gray-100';
  };

  const bgColorClass = getBgColorClass(category.color || '#10B981');

  return (
    <div className={`rounded-2xl p-6 ${bgColorClass}`}>
      {/* Header de la sección - Ahora clicable */}
      <button
        onClick={() => onCategoryClick(category)}
        className="w-full flex items-center gap-3 mb-4 group hover:opacity-80 transition-opacity"
      >
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color || '#10B981' }}
        />
        <h3 className="text-lg font-semibold text-gray-800 flex-1 text-left">
          {category.name}
        </h3>
        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
          {tasks.length}
        </span>
        <Settings className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Lista de tareas */}
      <div className="space-y-3">
        {tasks.map(task => (
          <ListViewTask
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
}
