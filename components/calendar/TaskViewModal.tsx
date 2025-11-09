// components/calendar/TaskViewModal.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTask, toggleTaskComplete, deleteTask } from "@/app/actions/task_actions";
import { createRecommendation, deleteRecommendation } from "@/app/actions/recommendation_actions";
import { Task, Category, SavedRecommendation } from "@prisma/client";
import { X, Calendar as CalendarIcon, BookmarkPlus, Bookmark, Trash2, Plus, Sparkles } from "lucide-react";
import { CategorySelector } from "./CategorySelector";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithRelations;
  categories: Category[];
}

export function TaskViewModal({ isOpen, onClose, task, categories }: TaskViewModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    category_id: task.category_id,
    description: task.description || "",
    start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "",
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
  });
  const [recommendations, setRecommendations] = useState(task.saved_recommendations);
  const [newRecommendation, setNewRecommendation] = useState("");
  const [isAddingRecommendation, setIsAddingRecommendation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleToggleComplete = async () => {
    startTransition(async () => {
      const result = await toggleTaskComplete(task.id);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.category_id) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    startTransition(async () => {
      const result = await updateTask({
        id: task.id,
        title: formData.title,
        category_id: formData.category_id,
        description: formData.description || undefined,
        start_date: formData.start_date ? new Date(formData.start_date) : undefined,
        due_date: formData.due_date ? new Date(formData.due_date) : undefined,
      });

      if (result.error) {
        alert(result.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.error) {
        alert(result.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  };

  const handleAddRecommendation = async () => {
    if (!newRecommendation.trim()) return;

    startTransition(async () => {
      const result = await createRecommendation(task.id, newRecommendation.trim());
      if (result.error) {
        alert(result.error);
      } else if (result.recommendation) {
        setRecommendations([...recommendations, result.recommendation]);
        setNewRecommendation("");
        setIsAddingRecommendation(false);
        router.refresh();
      }
    });
  };

  const handleDeleteRecommendation = async (recommendationId: string) => {
    startTransition(async () => {
      const result = await deleteRecommendation(recommendationId);
      if (result.error) {
        alert(result.error);
      } else {
        setRecommendations(recommendations.filter(r => r.id !== recommendationId));
        router.refresh();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 flex-1">
            {isEditing ? (
              <BookmarkPlus className="w-6 h-6 text-purple-500 flex-shrink-0" />
            ) : (
              <Bookmark className="w-6 h-6 text-purple-500 flex-shrink-0" />
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-semibold text-purple-500 bg-transparent border-b-2 border-purple-200 focus:border-purple-400 focus:outline-none flex-1"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-purple-500">
                {task.title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle completada */}
            <div className="flex items-center gap-2 px-4 py-2 border border-purple-200 rounded-full">
              <span className="text-sm text-purple-400">Completada</span>
              <button
                onClick={handleToggleComplete}
                disabled={isPending}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  task.is_completed ? "bg-purple-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    task.is_completed ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pb-8">
          {/* Columna izquierda - Detalles de la tarea */}
          <div className="space-y-6">
            {/* Categoría */}
            <div>
              <label className="block text-sm text-purple-400 mb-2">
                Categoría
              </label>
              {isEditing ? (
                <CategorySelector
                  categories={categories}
                  selectedCategoryId={formData.category_id}
                  onSelectCategory={(categoryId) =>
                    setFormData({ ...formData, category_id: categoryId })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-100 rounded-xl">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.category?.color || "#10B981" }}
                  />
                  <span className="text-gray-700 font-medium">
                    {task.category?.name || "Sin categoría"}
                  </span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm text-purple-400 mb-2">
                Descripción
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all resize-none"
                  rows={5}
                  placeholder="Este es un texto que describe la tarea, puede incluir detalles o instrucciones para llevarla a cabo."
                />
              ) : (
                <div className="px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl text-gray-600 min-h-[120px]">
                  {task.description || "Sin descripción"}
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              {/* Fecha de inicio */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-purple-400 w-32 flex-shrink-0">
                  Fecha de inicio
                </label>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 pointer-events-none" />
                </div>
              </div>

              {/* Fecha de fin */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-purple-400 w-32 flex-shrink-0">
                  Fecha de fin
                </label>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        title: task.title,
                        category_id: task.category_id,
                        description: task.description || "",
                        start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "",
                        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
                      });
                    }}
                    disabled={isPending}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isPending}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-6 py-2.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-colors font-medium"
                  >
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Columna derecha - Recomendaciones */}
          <div className="lg:border-l lg:border-purple-100 lg:pl-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">
                Recomendaciones
              </h3>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {/* Mensaje de construcción */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-600 font-medium">
                  IA en construcción
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  Pronto podrás obtener recomendaciones inteligentes
                </p>
              </div>

              {/* Recomendaciones existentes */}
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 group hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 flex-1">{rec.description}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteRecommendation(rec.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Agregar nueva recomendación */}
              {isAddingRecommendation ? (
                <div className="space-y-2">
                  <textarea
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    placeholder="Escribe una recomendación..."
                    className="w-full px-3 py-2 text-sm bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsAddingRecommendation(false);
                        setNewRecommendation("");
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddRecommendation}
                      disabled={isPending || !newRecommendation.trim()}
                      className="flex-1 px-3 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingRecommendation(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-purple-500 border border-purple-200 border-dashed rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Añadir recomendación</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}