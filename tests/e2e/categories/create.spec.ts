import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  switchToListView,
  openNewCategoryModal,
  waitForModalClose,
  generateUniqueName
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, SELECTORS, TIMEOUTS } from "../../utils/constants";

test.describe("Crear Categorías", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
    await switchToListView(page);
  });

  test("debería poder crear una nueva categoría", async ({ page }) => {
    // Abrir modal de nueva categoría
    await openNewCategoryModal(page);

    // Generar un nombre único para evitar conflictos
    const uniqueName = generateUniqueName('Test Cat');

    // Rellenar el nombre de la categoría
    const categoryInput = page.getByPlaceholder(PLACEHOLDERS.CATEGORY_NAME);
    await expect(categoryInput).toBeVisible();
    await categoryInput.fill(uniqueName);

    // Seleccionar un color diferente (segundo color)
    const colorButtons = page.locator(SELECTORS.COLOR_BUTTON).filter({ hasNot: page.locator('svg') });
    const secondColor = colorButtons.nth(1);
    await secondColor.click();

    // Verificar que aparece en la vista previa
    await expect(page.getByText(uniqueName).first()).toBeVisible();

    // Hacer clic en el botón "Crear Categoría"
    const createButton = page.getByRole('button', { name: BUTTONS.CREATE_CATEGORY });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();

    // Configurar listener para capturar errores de navegación
    page.on('pageerror', err => console.log('Page error:', err.message));

    await createButton.click();

    // Esperar a que el modal se cierre
    await waitForModalClose(page, 'Nueva Categoría');
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // Verificar que la categoría aparece en la lista de filtros
    const categoryInList = page.getByText(uniqueName).first();
    await expect(categoryInList).toBeVisible({ timeout: TIMEOUTS.NETWORK });
  });

  test("debería poder crear categoría con color personalizado", async ({ page }) => {
    // Abrir modal de nueva categoría
    await openNewCategoryModal(page);

    const uniqueName = generateUniqueName('Color Cat');

    // Rellenar el nombre
    const categoryInput = page.getByPlaceholder(PLACEHOLDERS.CATEGORY_NAME);
    await categoryInput.fill(uniqueName);

    // Seleccionar diferentes colores
    const colorButtons = page.locator(SELECTORS.COLOR_BUTTON).filter({ hasNot: page.locator('svg') });
    const thirdColor = colorButtons.nth(2);
    await thirdColor.click();

    // Crear categoría
    const createButton = page.getByRole('button', { name: BUTTONS.CREATE_CATEGORY });
    await createButton.click();

    // Esperar cierre del modal
    await waitForModalClose(page, 'Nueva Categoría');
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // Verificar que existe
    await expect(page.getByText(uniqueName).first()).toBeVisible({ timeout: TIMEOUTS.NETWORK });
  });
});
