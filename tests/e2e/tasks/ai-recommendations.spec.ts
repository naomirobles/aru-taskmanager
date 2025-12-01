import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  openNewTaskModal,
  selectFirstCategory,
  waitForModalClose,
  switchToListView,
  generateUniqueName
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, SELECTORS, TIMEOUTS } from "../../utils/constants";

test.describe("Generación de Recomendaciones con IA", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
  });

  test("debería poder generar recomendaciones para una tarea", async ({ page }) => {
    const uniqueTitle = generateUniqueName('Learn JS');

    // Crear una tarea con tema específico para obtener mejores recomendaciones
    await openNewTaskModal(page);

    // Crear tarea con tema específico
    await page.getByPlaceholder(PLACEHOLDERS.TASK_NAME).fill(uniqueTitle);
    await selectFirstCategory(page);
    await page.getByPlaceholder(PLACEHOLDERS.TASK_DESCRIPTION).fill('Necesito aprender los fundamentos de JavaScript para desarrollo web');

    // Agregar fecha de inicio
    const startDateInput = page.locator(SELECTORS.DATE_INPUT).first();
    await startDateInput.fill('2025-11-30');

    const submitButton = page.getByRole('button', { name: BUTTONS.DONE });
    await submitButton.click();

    // Esperar a que el modal se cierre completamente
    await waitForModalClose(page, 'Nueva Tarea');
    await page.waitForTimeout(TIMEOUTS.LONG);

    // Cambiar a vista de lista
    await switchToListView(page);

    // Buscar y hacer clic en la tarea creada
    const taskElement = page.getByText(uniqueTitle).first();
    await expect(taskElement).toBeVisible({ timeout: 10000 });
    await taskElement.click();

    // Esperar a que se abra el modal de visualización
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // Verificar que aparece la sección de Recomendaciones
    await expect(page.getByRole('heading', { name: 'Recomendaciones' })).toBeVisible();

    // Hacer clic en el botón "Generar con IA"
    const generateButton = page.getByRole('button', { name: BUTTONS.GENERATE_AI });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // Verificar que aparece el indicador de carga
    await expect(page.getByText(/generando|buscando recursos/i).first()).toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(TIMEOUTS.LONG);

    // Verificar que aparecen las recomendaciones
    const recommendations = page.locator(SELECTORS.RECOMMENDATION_LINK);
    const firstRecommendation = recommendations.first();
    await expect(firstRecommendation).toBeVisible();
  });
});
