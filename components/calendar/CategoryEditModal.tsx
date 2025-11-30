// components/calendar/CategoryEditModal.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCategory, deleteCategory } from "@/app/actions/category_actions";
import { Category } from "@prisma/client";
import { X, Palette, Trash2 } from "lucide-react";

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

const AVAILABLE_COLORS = [
  { name: "Rojo", value: "#EF4444" },
  { name: "Ámbar", value: "#F59E0B" },
  { name: "Esmeralda", value: "#10B981" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Violeta", value: "#8B5CF6" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Turquesa", value: "#14B8A6" },
  { name: "Naranja", value: "#F97316" },
];

export function CategoryEditModal({ isOpen, onClose, category }: CategoryEditModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categoryName, setCategoryName] = useState(category.name);
  const [selectedColor, setSelectedColor] = useState(category.color || "#10B981");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCategoryName(category.name);
      setSelectedColor(category.color || "#10B981");
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Por favor ingresa un nombre para la categoría");
      return;
    }

    startTransition(async () => {
      const result = await updateCategory(category.id, categoryName.trim(), selectedColor);

      if (result.error) {
        alert(result.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(category.id);

      if (result.error) {
        alert(result.error);
      } else {
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
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center pt-8 pb-6 relative">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#8b7dd8]">
              Editar Categoría
            </h2>
            <Palette className="w-6 h-6 text-[#8b7dd8]" />
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
          {/* Nombre de la categoría */}
          <div>
            <label className="block text-sm text-[#8b7dd8] mb-2">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-3 bg-[#8b7dd8]/5 border border-[#8b7dd8]/20 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b7dd8]/50 focus:border-transparent transition-all"
              placeholder="Ej: Trabajo, Personal, Estudios..."
              required
              maxLength={50}
            />
          </div>

          {/* Selector de color */}
          <div>
            <label className="block text-sm text-[#8b7dd8] mb-3">
              Selecciona un color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative aspect-square rounded-xl transition-all hover:scale-105 ${
                    selectedColor === color.value
                      ? "ring-4 ring-[#8b7dd8] ring-offset-2"
                      : "hover:ring-2 hover:ring-[#8b7dd8]/50 hover:ring-offset-2"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white drop-shadow-lg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Color seleccionado: {AVAILABLE_COLORS.find(c => c.value === selectedColor)?.name}
            </p>
          </div>

          {/* Preview */}
          <div className="bg-[#8b7dd8]/5 rounded-xl p-4">
            <p className="text-xs text-[#8b7dd8] mb-2">Vista previa:</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-gray-700 font-medium">
                {categoryName || "Nombre de categoría"}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3 pt-2">
            {/* Botón Eliminar */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Categoría
            </button>

            {/* Botones Cancelar y Guardar */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !categoryName.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#9d8de8] to-[#8b7dd8] text-white font-medium rounded-xl hover:from-[#8b7dd8] hover:to-[#7a6bc0] focus:outline-none focus:ring-2 focus:ring-[#8b7dd8] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8b7dd8]/20"
              >
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
