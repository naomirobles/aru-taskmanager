import { Page, expect } from "@playwright/test";

/**
 * Navega al calendario y espera a que cargue completamente
 */
export async function navigateToCalendar(page: Page) {
  await page.goto("/calendar");
  await page.waitForLoadState("networkidle");
}

/**
 * Cambia a la vista de lista
 */
export async function switchToListView(page: Page) {
  const listButton = page.getByRole('button', { name: /^lista$/i });
  await expect(listButton).toBeVisible();
  await listButton.click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('Lista de Tareas')).toBeVisible({ timeout: 5000 });
}

/**
 * Cambia a la vista de calendario
 */
export async function switchToCalendarView(page: Page) {
  const calendarButton = page.getByRole('button', { name: /calendario/i });
  await expect(calendarButton).toBeVisible();
  await calendarButton.click();
  await expect(page.locator('h1.text-2xl').filter({ 
    hasText: /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i 
  })).toBeVisible();
}

/**
 * Abre el modal para crear una nueva tarea
 */
export async function openNewTaskModal(page: Page) {
  const addButton = page.getByRole('button', { name: /añadir tarea/i });
  await expect(addButton).toBeVisible();
  await addButton.click();
  await expect(page.getByText('Nueva Tarea')).toBeVisible();
}

/**
 * Abre el modal para crear una nueva categoría
 */
export async function openNewCategoryModal(page: Page) {
  const newSectionButton = page.getByRole('button', { name: /nueva sección/i });
  await expect(newSectionButton).toBeVisible();
  await newSectionButton.click();
  await expect(page.getByText('Nueva Categoría')).toBeVisible();
}

/**
 * Selecciona la primera categoría disponible en un selector
 */
export async function selectFirstCategory(page: Page) {
  const categorySelector = page.locator('button').filter({ hasText: /selecciona una categoría/i });
  await expect(categorySelector).toBeVisible();
  await categorySelector.click();
  await page.waitForTimeout(500);
  const firstCategory = page.locator('div.group.hover\\:bg-purple-50').first();
  await expect(firstCategory).toBeVisible();
  await firstCategory.click();
}

/**
 * Espera a que un modal se cierre
 */
export async function waitForModalClose(page: Page, modalTitle: string) {
  await Promise.race([
    page.waitForSelector(`h2:has-text("${modalTitle}")`, { state: 'hidden', timeout: 10000 }),
    page.waitForTimeout(10000)
  ]);
  await page.waitForLoadState('networkidle');
}

/**
 * Genera un nombre único con timestamp
 */
export function generateUniqueName(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}
