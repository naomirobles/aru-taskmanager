/**
 * Constantes para timeouts usados en los tests
 */
export const TIMEOUTS = {
  SHORT: 500,
  MEDIUM: 1000,
  LONG: 2000,
  NETWORK: 5000,
  MODAL_CLOSE: 10000,
} as const;

/**
 * Selectores comunes reutilizables
 */
export const SELECTORS = {
  CALENDAR_CONTAINER: 'div.bg-white.dark\\:bg-slate-800',
  MONTH_HEADER: 'h1.text-2xl.font-bold.text-white',
  CATEGORY_CHECKBOX: 'input[type="checkbox"]',
  CATEGORY_LABEL: 'label.flex.items-center.gap-3',
  COLOR_BUTTON: 'button[style*="background-color"]',
  CATEGORY_SECTION: 'div[class*="bg-white"][class*="rounded-2xl"]',
  DATE_INPUT: 'input[type="date"]',
  TASK_TITLE_INPUT: 'input.text-2xl[value]',
  DESCRIPTION_TEXTAREA: 'textarea',
  RECOMMENDATION_LINK: 'a[href^="http"]',
} as const;

/**
 * Placeholders de inputs
 */
export const PLACEHOLDERS = {
  TASK_NAME: /comer verdura/i,
  TASK_DESCRIPTION: /descripción de la tarea/i,
  CATEGORY_NAME: /ej: trabajo, personal, estudios/i,
  SEARCH: /search/i,
} as const;

/**
 * Textos de botones comunes
 */
export const BUTTONS = {
  ADD_TASK: /añadir tarea/i,
  NEW_SECTION: /nueva sección/i,
  DONE: /^hecho$/i,
  CREATE_CATEGORY: /crear categoría/i,
  SAVE_CHANGES: /guardar cambios/i,
  DELETE_CATEGORY: /eliminar categoría/i,
  EDIT: /^editar$/i,
  SAVE: /guardar/i,
  GENERATE_AI: /generar con ia/i,
  LIST: /^lista$/i,
  CALENDAR: /calendario/i,
  NEXT_MONTH: /mes siguiente/i,
  PREV_MONTH: /mes anterior/i,
} as const;

/**
 * Meses en español
 */
export const MONTHS_REGEX = /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i;
