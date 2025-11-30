// components/calendar/TaskModal.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/app/actions/task_actions";
import { Category } from "@prisma/client";
import { X, Calendar as CalendarIcon, BookmarkPlus } from "lucide-react";
import { CategorySelector } from "./CategorySelector";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  categories: Category[];
}

export function TaskModal({ isOpen, onClose, selectedDate, categories }: TaskModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    start_date: selectedDate?.toISOString().split('T')[0] || "",
    due_date: "",
  });

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

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        start_date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category_id) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    startTransition(async () => {
      const result = await createTask({
        title: formData.title,
        category_id: formData.category_id,
        description: formData.description || undefined,
        start_date: formData.start_date ? new Date(formData.start_date) : undefined,
        due_date: formData.due_date ? new Date(formData.due_date) : undefined,
      });

      if (result.error) {
        alert(result.error);
      } else {
        setFormData({
          title: "",
          category_id: "",
          description: "",
          start_date: "",
          due_date: "",
        });
        onClose();
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
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-center pt-8 pb-6 relative">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#8b7dd8]">
              Nueva Tarea
            </h2>
            <BookmarkPlus className="w-6 h-6 text-[#8b7dd8]" />
          </div>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm text-[#8b7dd8] mb-2">
              Ingrese el nombre de su tarea
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all"
              placeholder="Comer verdura"
              required
            />
          </div>

          {/* Selector de categorías (nuevo componente) */}
          <CategorySelector
            categories={categories}
            selectedCategoryId={formData.category_id}
            onSelectCategory={(categoryId) => 
              setFormData({ ...formData, category_id: categoryId })
            }
          />

          {/* Descripción */}
          <div>
            <label className="block text-sm text-[#8b7dd8] mb-2">
              Ingrese la descripción de la tarea
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all resize-none"
              rows={4}
              placeholder="Descripción de la tarea..."
            />
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
                  className="w-full px-4 py-2.5 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
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
                  className="w-full px-4 py-2.5 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b7dd8]/50 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Botón Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-12 py-3 bg-gradient-to-r from-[#9d8de8] to-[#8b7dd8] text-white font-medium rounded-xl hover:from-[#8b7dd8] hover:to-[#7a6bc0] focus:outline-none focus:ring-2 focus:ring-[#8b7dd8] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8b7dd8]/20"
            >
              {isPending ? "Creando..." : "Hecho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}