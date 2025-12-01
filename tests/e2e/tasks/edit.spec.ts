import { test, expect } from "@playwright/test";
import {
  navigateToCalendar,
  openNewTaskModal,
  selectFirstCategory,
  waitForModalClose,
  generateUniqueName,
  switchToListView
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, SELECTORS, TIMEOUTS } from "../../utils/constants";

test.describe("Editar Tareas", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
  });
  test("debería poder editar una tarea existente", async ({ page }) => {
    const uniqueTitle = generateUniqueName('Edit Task');

    // Primero crear una tarea para editar
    await openNewTaskModal(page);

    // Crear tarea con fecha de inicio
    await page.getByPlaceholder(PLACEHOLDERS.TASK_NAME).fill(uniqueTitle);
    await selectFirstCategory(page);
    await page.getByPlaceholder(PLACEHOLDERS.TASK_DESCRIPTION).fill('Descripción original');

    // Agregar fecha de inicio
    const startDateInput = page.locator(SELECTORS.DATE_INPUT).first();
    await startDateInput.fill('2025-11-30');

    const submitButton = page.getByRole('button', { name: BUTTONS.DONE });
    await submitButton.click();

    // Esperar a que se cierre el modal y se cree la tarea
    await waitForModalClose(page, 'Nueva Tarea');
    await page.waitForLoadState('networkidle'); // 👈 Mejor que timeout fijo

    // 🔧 FIX: Cambiar a vista de lista donde todas las tareas son visibles
    await switchToListView(page);

    // Buscar y hacer clic en la tarea creada
    const taskElement = page.getByText(uniqueTitle).first();
    await expect(taskElement).toBeVisible({ timeout: 10000 });
    await taskElement.click();



    // Esperar a que se abra el modal de visualización
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // Hacer clic en el botón "Editar"
    const editButton = page.getByRole('button', { name: BUTTONS.EDIT }).last();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForTimeout(TIMEOUTS.SHORT);

    // Editar el título
    const titleInput = page.locator(SELECTORS.TASK_TITLE_INPUT);
    await titleInput.clear();
    const newTitle = `${uniqueTitle} - Editado`;
    await titleInput.fill(newTitle);

    // Editar la descripción
    const descriptionTextarea = page.locator(SELECTORS.DESCRIPTION_TEXTAREA).nth(0);
    await expect(descriptionTextarea).toBeVisible();
    await descriptionTextarea.click();
    await descriptionTextarea.clear();
    await descriptionTextarea.fill('Descripción modificada por test');

    // Guardar cambios
    const saveButton = page.getByRole('button', { name: BUTTONS.SAVE });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Esperar a que se guarden los cambios
    await page.waitForTimeout(TIMEOUTS.LONG);
  });
});
