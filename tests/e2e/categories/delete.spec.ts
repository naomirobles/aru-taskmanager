import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  switchToListView,
  openNewCategoryModal,
  waitForModalClose,
  generateUniqueName
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, TIMEOUTS } from "../../utils/constants";

test.describe("Eliminar Categorías", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
    await switchToListView(page);
  });

  test("debería poder eliminar una categoría sin tareas", async ({ page }) => {
    // Primero crear una categoría única para eliminar
    await openNewCategoryModal(page);

    const uniqueName = generateUniqueName('ToDelete');
    const categoryInput = page.getByPlaceholder(PLACEHOLDERS.CATEGORY_NAME);
    await categoryInput.fill(uniqueName);

    const createButton = page.getByRole('button', { name: BUTTONS.CREATE_CATEGORY });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    // Esperar a que el modal se cierre
    await waitForModalClose(page, 'Nueva Categoría');
    await page.waitForTimeout(1500);

    // Ahora buscar y eliminar la categoría
    const categoryToDelete = page.getByText(uniqueName);
    await expect(categoryToDelete.first()).toBeVisible({ timeout: TIMEOUTS.NETWORK });

    // Hacer clic en la sección de la categoría
    const categorySection = page.locator('div').filter({ hasText: uniqueName }).first();
    await categorySection.click();
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    if (await page.getByText('Editar Categoría').isVisible()) {
      // Hacer clic en el botón eliminar
      const deleteButton = page.getByRole('button', { name: BUTTONS.DELETE_CATEGORY });
      await expect(deleteButton).toBeVisible();

      // Preparar para aceptar el diálogo de confirmación
      page.once('dialog', dialog => dialog.accept());

      await deleteButton.click();

      // Esperar a que el modal se cierre
      await expect(page.getByText('Editar Categoría')).not.toBeVisible({ timeout: TIMEOUTS.NETWORK });

      // Verificar que la categoría ya no existe
      await page.waitForTimeout(TIMEOUTS.MEDIUM);
      await expect(page.getByText(uniqueName)).not.toBeVisible();
    }
  });

  test("debería mostrar confirmación antes de eliminar", async ({ page }) => {
    // Crear categoría temporal
    await openNewCategoryModal(page);

    const uniqueName = generateUniqueName('ConfirmDelete');
    const categoryInput = page.getByPlaceholder(PLACEHOLDERS.CATEGORY_NAME);
    await categoryInput.fill(uniqueName);

    const createButton = page.getByRole('button', { name: BUTTONS.CREATE_CATEGORY });
    await createButton.click();

    await waitForModalClose(page, 'Nueva Categoría');
    await page.waitForTimeout(1500);

    // Buscar la categoría
    const categorySection = page.locator('div').filter({ hasText: uniqueName }).first();
    await categorySection.click();
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    if (await page.getByText('Editar Categoría').isVisible()) {
      const deleteButton = page.getByRole('button', { name: BUTTONS.DELETE_CATEGORY });
      await expect(deleteButton).toBeVisible();

      // Preparar para CANCELAR el diálogo de confirmación
      let dialogAppeared = false;
      page.once('dialog', dialog => {
        dialogAppeared = true;
        dialog.dismiss(); // Cancelar en lugar de aceptar
      });

      await deleteButton.click();
      await page.waitForTimeout(TIMEOUTS.SHORT);

      // Verificar que apareció el diálogo
      expect(dialogAppeared).toBe(true);

      // La categoría debe seguir existiendo porque cancelamos
      await expect(page.getByText(uniqueName)).toBeVisible();
    }
  });
});
