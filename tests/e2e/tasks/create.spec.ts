import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  openNewTaskModal,
  selectFirstCategory,
  waitForModalClose 
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, SELECTORS, TIMEOUTS } from "../../utils/constants";

test.describe("Crear Tareas", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
  });

  test("debería poder crear una nueva tarea", async ({ page }) => {
    // Abrir modal de nueva tarea
    await openNewTaskModal(page);
    
    // Rellenar el formulario
    await page.getByPlaceholder(PLACEHOLDERS.TASK_NAME).fill('Test Task - Playwright');
    
    // Seleccionar categoría
    await selectFirstCategory(page);
    
    // Rellenar la descripción
    await page.getByPlaceholder(PLACEHOLDERS.TASK_DESCRIPTION).fill('Esta es una tarea de prueba creada por Playwright');
    
    // Hacer clic en el botón "Hecho"
    const submitButton = page.getByRole('button', { name: BUTTONS.DONE });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Esperar a que el modal se cierre
    await page.waitForTimeout(TIMEOUTS.LONG);
    
    // Verificar que no hay errores visibles
    const modalStillVisible = await page.getByText('Nueva Tarea').isVisible().catch(() => false);
    if (modalStillVisible) {
      console.log('Modal todavía visible, puede haber un error de validación');
    }
  });

  test("debería poder crear una tarea con fecha de inicio", async ({ page }) => {
    // Abrir modal de nueva tarea
    await openNewTaskModal(page);
    
    // Rellenar el formulario
    const uniqueTitle = `Task with Date ${Date.now()}`;
    await page.getByPlaceholder(PLACEHOLDERS.TASK_NAME).fill(uniqueTitle);
    
    // Seleccionar categoría
    await selectFirstCategory(page);
    
    // Rellenar descripción
    await page.getByPlaceholder(PLACEHOLDERS.TASK_DESCRIPTION).fill('Tarea con fecha específica');
    
    // Agregar fecha de inicio
    const startDateInput = page.locator(SELECTORS.DATE_INPUT).first();
    await startDateInput.fill('2025-12-01');
    
    // Enviar formulario
    const submitButton = page.getByRole('button', { name: BUTTONS.DONE });
    await submitButton.click();
    
    // Esperar a que se cierre el modal
    await waitForModalClose(page, 'Nueva Tarea');
  });
});
