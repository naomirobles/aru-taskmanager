// components/calendar/CategorySelector.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Category } from "@prisma/client";
import { ChevronDown, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category_actions";
import { useRouter } from "next/navigation";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: CategorySelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setEditingCategoryId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await createCategory(newCategoryName.trim());
    
    if (result.error) {
      alert(result.error);
    } else if (result.category) {
      onSelectCategory(result.category.id);
      setNewCategoryName("");
      setIsCreating(false);
      router.refresh();
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingName.trim()) return;

    const result = await updateCategory(categoryId, editingName.trim());
    
    if (result.error) {
      alert(result.error);
    } else {
      setEditingCategoryId(null);
      setEditingName("");
      router.refresh();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return;
    }

    const result = await deleteCategory(categoryId);
    
    if (result.error) {
      alert(result.error);
    } else {
      if (selectedCategoryId === categoryId) {
        onSelectCategory("");
      }
      router.refresh();
    }
  };

  const startEditing = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategoryId(category.id);
    setEditingName(category.name);
    setIsCreating(false);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategoryId(null);
    setEditingName("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-purple-400 mb-2">
        Seleccione la categoría de su tarea
      </label>
      
      {/* Selector principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all flex items-center justify-between"
      >
        <span className={selectedCategory ? "text-gray-700" : "text-gray-400"}>
          {selectedCategory ? selectedCategory.name : "Selecciona una categoría"}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border dark:bg-slate-700  border-purple-100 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {/* Lista de categorías existentes */}
          {categories.map((category) => (
            <div
              key={category.id}
              className="group hover:bg-purple-50 dark:hover:bg-slate-600 transition-colors"
            >
              {editingCategoryId === category.id ? (
                // Modo edición
                <div className="flex items-center gap-2 px-4 py-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color || "#8B5CF6" }}
                  />
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-300"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateCategory(category.id);
                      } else if (e.key === "Escape") {
                        setEditingCategoryId(null);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateCategory(category.id)}
                    className="p-1 hover:bg-green-100 rounded text-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600" 
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Modo normal
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(category.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color || "#8B5CF6" }}
                    />
                    <span className="text-sm text-gray-700  dark:text-white">{category.name}</span>
                  </button>
                  
                  {/* Acciones (aparecen en hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => startEditing(category, e)}
                      className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Botón para crear nueva categoría */}
          {isCreating ? (
            <div className="flex items-center gap-2 px-4 py-3 border-t border-purple-100">
              <Plus className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 px-2 py-1 text-sm border border-purple-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCategory();
                  } else if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewCategoryName("");
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="p-1 hover:bg-green-100 rounded text-green-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewCategoryName("");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 dark:text-gray-600 "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-purple-500 hover:bg-purple-50 dark:hover:bg-slate-600 transition-colors border-t border-purple-100"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Crear nueva categoría</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}