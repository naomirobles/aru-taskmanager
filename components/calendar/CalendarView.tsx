// components/calendar/CalendarView.tsx
"use client";

import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { TaskModal } from "./TaskModal";
import { TaskViewModal } from "./TaskViewModal";
import { Task, Category, SavedRecommendation } from "@prisma/client";

type TaskWithRelations = Task & {
  category: Category | null;
  saved_recommendations: SavedRecommendation[];
};

interface CalendarViewProps {
  initialTasks: TaskWithRelations[];
  initialMonth: number;
  initialYear: number;
  categories: Category[];
}

export function CalendarView({ 
  initialTasks, 
  initialMonth, 
  initialYear,
  categories 
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [view, setView] = useState<"month" | "week">("month");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddTask = (date?: Date) => {
    setSelectedDate(date || new Date());
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: TaskWithRelations) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        view={view}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onViewChange={setView}
        onAddTask={() => handleAddTask()}
      />

      <CalendarGrid
        tasks={initialTasks}
        currentMonth={currentMonth}
        currentYear={currentYear}
        view={view}
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
      />

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          selectedDate={selectedDate}
          categories={categories}
        />
      )}

      {isViewModalOpen && selectedTask && (
        <TaskViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          categories={categories}
        />
      )}
    </div>
  );
}