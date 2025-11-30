// components/calendar/ListView.tsx
"use client";

import { useState, useMemo } from "react";
import { Task, Category, SavedRecommendation } from "@prisma/client";
import { Plus, Search, Filter } from "lucide-react";
import { ListViewSection } from "./ListViewSection";
import { CategoryModal } from "./CategoryModal";
import { CategoryEditModal } from "./CategoryEditModal";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface ListViewProps {
  tasks: TaskWithRelations[];
  categories: Category[];
  onAddTask: () => void;
  onTaskClick: (task: TaskWithRelations) => void;
}

export function ListView({ 
  tasks, 
  categories, 
  onAddTask, 
  onTaskClick 
}: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map(c => c.id)
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Filtrar tareas por búsqueda y categorías seleccionadas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.includes(task.category_id);
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, selectedCategories]);

  // Agrupar tareas por categoría
  const groupedTasks = useMemo(() => {
    const groups = new Map<string, TaskWithRelations[]>();
    
    categories.forEach(category => {
      const categoryTasks = filteredTasks.filter(
        task => task.category_id === category.id
      );
      if (categoryTasks.length > 0) {
        groups.set(category.id, categoryTasks);
      }
    });

    return groups;
  }, [filteredTasks, categories]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleCategoryClick = (category: Category) => {
    setCategoryToEdit(category);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar izquierdo */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-[#9a81fc]/10 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 rounded-2xl p-4 space-y-4">
            {/* Botón Nueva Tarea */}
            <button
              onClick={onAddTask}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-600 text-[#7a6bc0] dark:text-purple-300 px-4 py-3 rounded-xl hover:bg-[#8b7dd8]/5 dark:hover:bg-slate-500 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nueva Tarea
            </button>

            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7dd8] dark:text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-600 dark:text-gray-200 rounded-xl border border-[#8b7dd8]/20 dark:border-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 dark:focus:ring-purple-400/50 text-sm placeholder:text-[#8b7dd8]/50 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Divisor */}
            <div className="border-t border-[#8b7dd8]/20 dark:border-slate-600" />

            {/* Filtros por categoría */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-[#8b7dd8] dark:text-purple-400" />
                <span className="text-sm font-medium text-[#7a6bc0] dark:text-purple-300">Filtrar</span>
              </div>

              <div className="space-y-2">
                {categories.map(category => {
                  const categoryTaskCount = tasks.filter(
                    task => task.category_id === category.id
                  ).length;

                  return (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedCategories.includes(category.id)
                            ? 'bg-[#8b7dd8] dark:bg-purple-500 border-[#8b7dd8] dark:border-purple-500'
                            : 'bg-white dark:bg-slate-600 border-[#8b7dd8]/50 dark:border-slate-500 group-hover:border-[#8b7dd8] dark:group-hover:border-purple-400'
                        }`}>
                          {selectedCategories.includes(category.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                        {category.name}
                      </span>
                      <span className="text-xs text-[#8b7dd8] dark:text-purple-300 bg-white dark:bg-slate-600 px-2 py-0.5 rounded-full">
                        {categoryTaskCount}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Área principal de tareas */}
        <div className="flex-1 min-h-[calc(100vh-8rem)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">List View</h2>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-[#8b7dd8] dark:text-purple-400 hover:text-[#7a6bc0] dark:hover:text-purple-300 font-medium transition-colors"
            >
              + Nueva Sección
            </button>
          </div>

          {/* Secciones por categoría - Grid Responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-min content-start flex-1">
            {Array.from(groupedTasks.entries()).map(([categoryId, categoryTasks]) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) return null;

              return (
                <ListViewSection
                  key={categoryId}
                  category={category}
                  tasks={categoryTasks}
                  onTaskClick={onTaskClick}
                  onCategoryClick={handleCategoryClick}
                />
              );
            })}

            {groupedTasks.size === 0 && (
              <div className="w-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8b7dd8]/10 dark:bg-purple-500/10 rounded-full mb-4">
                  <Search className="w-8 h-8 text-[#8b7dd8] dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {searchQuery ? "No se encontraron tareas" : "No hay tareas"}
                </h3>
                <p className="text-[#7a6bc0] dark:text-purple-300">
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : "Comienza creando tu primera tarea"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de nueva categoría */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Modal de editar categoría */}
      {categoryToEdit && (
        <CategoryEditModal
          isOpen={!!categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
          category={categoryToEdit}
        />
      )}
    </div>
  );
}
