import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  switchToListView
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, SELECTORS, TIMEOUTS } from "../../utils/constants";

test.describe("Editar Categorías", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
    await switchToListView(page);
  });

  test("debería poder editar una categoría existente", async ({ page }) => {
    // Buscar una categoría en la lista de filtros
    const categoryLabels = page.locator(SELECTORS.CATEGORY_LABEL);
    const firstCategory = categoryLabels.first();
    await expect(firstCategory).toBeVisible();

    // Obtener el nombre original de la categoría
    const originalName = await firstCategory.locator('span.text-sm').textContent();

    // Hacer clic en una sección de categoría para abrir el modal de edición
    const categorySection = page.locator(SELECTORS.CATEGORY_SECTION).first();
    if (await categorySection.count() > 0) {
      // Hacer hover para ver las opciones
      await categorySection.hover();
      await page.waitForTimeout(TIMEOUTS.SHORT);

      // Buscar el botón de menú o hacer clic en el header de la sección
      const sectionHeader = categorySection.locator('div').first();
      await sectionHeader.click();

      // Esperar a que aparezca el modal de edición
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      if (await page.getByText('Editar Categoría').isVisible()) {
        // Generar nombre único
        const newName = `${originalName} ${Date.now()}`;

        // Cambiar el nombre
        const nameInput = page.getByPlaceholder(PLACEHOLDERS.CATEGORY_NAME);
        await nameInput.clear();
        await nameInput.fill(newName);

        // Seleccionar un color diferente
        const colorButtons = page.locator(SELECTORS.COLOR_BUTTON).filter({ hasNot: page.locator('svg') });
        const thirdColor = colorButtons.nth(2);
        await thirdColor.click();

        // Guardar cambios
        const saveButton = page.getByRole('button', { name: BUTTONS.SAVE_CHANGES });
        await saveButton.click();

        // Esperar a que el modal se cierre
        await expect(page.getByText('Editar Categoría')).not.toBeVisible({ timeout: TIMEOUTS.NETWORK });

        // Verificar que el nombre cambió
        await page.waitForTimeout(TIMEOUTS.MEDIUM);
        await expect(page.getByText(newName).first()).toBeVisible();
      }
    }
  });

  test("debería poder cambiar solo el color de una categoría", async ({ page }) => {
    const categorySection = page.locator(SELECTORS.CATEGORY_SECTION).first();
    
    if (await categorySection.count() > 0) {
      await categorySection.hover();
      await page.waitForTimeout(TIMEOUTS.SHORT);

      const sectionHeader = categorySection.locator('div').first();
      await sectionHeader.click();
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      if (await page.getByText('Editar Categoría').isVisible()) {
        // Solo cambiar el color sin modificar el nombre
        const colorButtons = page.locator(SELECTORS.COLOR_BUTTON).filter({ hasNot: page.locator('svg') });
        const fourthColor = colorButtons.nth(3);
        await fourthColor.click();

        // Guardar cambios
        const saveButton = page.getByRole('button', { name: BUTTONS.SAVE_CHANGES });
        await saveButton.click();

        // Esperar cierre
        await expect(page.getByText('Editar Categoría')).not.toBeVisible({ timeout: TIMEOUTS.NETWORK });
      }
    }
  });
});
