// components/calendar/CalendarHeader.tsx
"use client";

import { ChevronLeft, ChevronRight, Plus, Calendar, List } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  view: "month" | "week";
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onViewChange: (view: "month" | "week") => void;
  onAddTask: () => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function CalendarHeader({
  currentMonth,
  currentYear,
  view,
  onPreviousMonth,
  onNextMonth,
  onViewChange,
  onAddTask,
}: CalendarHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#8b7dd8] to-[#9d8de8] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {view === "month" && (
            <>
              <button
                onClick={onPreviousMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold text-white">
                  {MONTHS[currentMonth]} {currentYear}
                </h1>
              </div>

              <button
                onClick={onNextMonth}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {view === "week" && (
            <div className="flex items-center gap-3">
              <List className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">
                Lista de Tareas
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/20 rounded-lg p-1">
            <button
              onClick={() => onViewChange("month")}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === "month"
                  ? "bg-white text-[#8b7dd8]"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => onViewChange("week")}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === "week"
                  ? "bg-white text-[#8b7dd8]"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Lista
            </button>
          </div>

          <button
            onClick={onAddTask}
            className="flex items-center gap-2 bg-white text-[#8b7dd8] px-4 py-2 rounded-lg hover:bg-[#f8f7ff] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Añadir tarea
          </button>
        </div>
      </div>
    </div>
  );
}
