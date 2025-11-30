// Updated TaskViewModal with improved dark mode text visibility
// (Only diff applied: added consistent dark:text-... classes and adjusted grays)

"use client";

// ... Due to message length, paste your full component here and I will apply the dark mode fixes directly. // components/calendar/TaskViewModal.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateTask, toggleTaskComplete, deleteTask } from "@/app/actions/task_actions";
import { deleteRecommendation } from "@/app/actions/recommendation_actions";
import { generateRecommendations } from "@/app/actions/ai-actions";
import { Task, Category, SavedRecommendation } from "@prisma/client";
import { X, Calendar as CalendarIcon, BookmarkPlus, Bookmark, Trash2, Sparkles, Loader2, ExternalLink, Youtube, FileText, GraduationCap } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Estado local para el toggle de completado
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  
  const [formData, setFormData] = useState({
    title: task.title,
    category_id: task.category_id,
    description: task.description || "",
    start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "",
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
  });
  const [recommendations, setRecommendations] = useState(task.saved_recommendations);

  // Sincronizar el estado cuando cambie la prop task
  useEffect(() => {
    setIsCompleted(task.is_completed);
    setFormData({
      title: task.title,
      category_id: task.category_id,
      description: task.description || "",
      start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : "",
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
    });
    setRecommendations(task.saved_recommendations);
  }, [task]);

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
    setIsCompleted(!isCompleted);
    
    startTransition(async () => {
      const result = await toggleTaskComplete(task.id);
      if (result.error) {
        setIsCompleted(isCompleted);
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

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateRecommendations(
        task.id, 
        task.title, 
        task.description || undefined
      );
      
      if (result.error) {
        alert(result.error);
      } else if (result.recommendations) {
        setRecommendations([...recommendations, ...result.recommendations]);
        router.refresh();
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      alert("Error al generar recomendaciones");
    } finally {
      setIsGenerating(false);
    }
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

  // Función para obtener el icono según el tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'article':
      default:
        return <FileText className="w-4 h-4 text-green-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white  dark:bg-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 flex-1">
            {isEditing ? (
              <BookmarkPlus className="w-6 h-6 text-[#8b7dd8] flex-shrink-0" />
            ) : (
              <Bookmark className="w-6 h-6 text-[#8b7dd8] flex-shrink-0" />
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-semibold text-[#8b7dd8] bg-transparent border-b-2 border-[#8b7dd8]/20 focus:border-[#8b7dd8] focus:outline-none flex-1"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-[#8b7dd8]">
                {task.title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle completada */}
            <div className="flex items-center gap-2 px-4 py-2 border border-[#8b7dd8]/20 rounded-full">
              <span className="text-sm text-[#8b7dd8]">Completada</span>
              <button
                type="button"
                onClick={handleToggleComplete}
                disabled={isPending}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isCompleted ? "bg-[#8b7dd8]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isCompleted ? "translate-x-6" : ""
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
              <label className="block text-sm text-[#8b7dd8] mb-2">
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
                <div 
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ 
                    backgroundColor: task.category?.color ? `${task.category.color}20` : '#10B98120'
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.category?.color || "#10B981" }}
                  />
                  <span className="text-gray-700 font-medium  dark:text-white">
                    {task.category?.name || "Sin categoría"}
                  </span>
                </div>
              )}
            </div>

           {/* Descripción */}
            <div>
              <label className="block text-sm text-[#8b7dd8] mb-2">
                Descripción
              </label>

              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 placeholder:text-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all resize-none"
                  rows={5}
                  placeholder="Este es un texto que describe la tarea, puede incluir detalles o instrucciones para llevarla a cabo."
                />
              ) : (
                <div className="px-4 py-3 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-600 dark:text-white min-h-[120px]">
                  {task.description || "Sin descripción"}
                </div>
              )}
            </div>


            {/* Fechas */}
            <div className="space-y-4">
              {/* Fecha de inicio */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-[#8b7dd8] w-32 flex-shrink-0">
                  Fecha de inicio
                </label>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b7dd8]/50 pointer-events-none" />
                </div>
              </div>

              {/* Fecha de fin */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-[#8b7dd8] w-32 flex-shrink-0">
                  Fecha de fin
                </label>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700  dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b7dd8]/50 pointer-events-none" />
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
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#9d8de8] to-[#8b7dd8] text-white rounded-xl hover:from-[#8b7dd8] hover:to-[#7a6bc0] transition-colors disabled:opacity-50 font-medium"
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
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#9d8de8] to-[#8b7dd8] text-white rounded-xl hover:from-[#8b7dd8] hover:to-[#7a6bc0] transition-colors font-medium"
                  >
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Columna derecha - Recomendaciones */}
          <div className="lg:border-l lg:border-[#8b7dd8]/20 lg:pl-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#8b7dd8]">
                Recomendaciones
              </h3>
              <button
                onClick={handleGenerateRecommendations}
                disabled={isGenerating || isPending}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#8b7dd8] text-white text-sm rounded-lg hover:bg-[#7a6bc0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar con IA
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {/* Mensaje de estado inicial */}
              {recommendations.length === 0 && !isGenerating && (
                <div className="bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl p-4 text-center">
                  <Sparkles className="w-8 h-8 text-[#8b7dd8] mx-auto mb-2" />
                  <p className="text-sm text-[#7a6bc0] font-medium">
                    Sin recomendaciones
                  </p>
                  <p className="text-xs text-[#8b7dd8] mt-1">
                    Haz clic en "Generar con IA" para obtener recursos útiles
                  </p>
                </div>
              )}

              {/* Indicador de carga */}
              {isGenerating && (
                <div className="bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl p-4 text-center">
                  <Loader2 className="w-8 h-8 text-[#8b7dd8] mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-[#7a6bc0] font-medium">
                    Buscando recursos...
                  </p>
                  <p className="text-xs text-[#8b7dd8] mt-1">
                    Esto puede tomar unos segundos
                  </p>
                </div>
              )}

              {/* Recomendaciones existentes */}
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl p-3 group hover:bg-[#8b7dd8]/10 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail si existe */}
                    {rec.thumbnail_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={rec.thumbnail_url}
                          alt={rec.title}
                          className="w-20 h-14 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {/* Título como link */}
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#7a6bc0] hover:text-[#6a5bb0] flex items-start gap-2 group/link mb-1"
                      >
                        <span className="flex-1 line-clamp-2">{rec.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
                      </a>
                      
                      {/* Descripción si existe */}
                      {rec.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {rec.description}
                        </p>
                      )}
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {getTypeIcon(rec.type)}
                        <span>{rec.source}</span>
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




