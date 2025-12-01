import { test, expect } from "@playwright/test";
import { 
  navigateToCalendar, 
  switchToListView, 
  switchToCalendarView 
} from "../../helpers/test-helpers";
import { BUTTONS, PLACEHOLDERS, TIMEOUTS } from "../../utils/constants";

test.describe("Vistas del Calendario", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
  });

  test("debería poder cambiar entre vista de mes y vista de lista", async ({ page }) => {
    // Cambiar a vista de lista
    await switchToListView(page);
    
    // Cambiar de vuelta a vista de calendario
    await switchToCalendarView(page);
  });

  test("debería poder buscar tareas en la vista de lista", async ({ page }) => {
    // Cambiar a vista de lista
    await switchToListView(page);
    
    // Buscar el input de búsqueda
    const searchInput = page.getByPlaceholder(PLACEHOLDERS.SEARCH);
    await expect(searchInput).toBeVisible();
    
    // Escribir en el buscador
    await searchInput.fill('test');
    await page.waitForTimeout(TIMEOUTS.SHORT);
    
    // Verificar que el filtro se aplicó
    await expect(searchInput).toHaveValue('test');
    
    // Limpiar la búsqueda
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test("debería poder filtrar tareas por categoría en la vista de lista", async ({ page }) => {
    // Cambiar a vista de lista
    await switchToListView(page);
    
    // Verificar que la sección de filtros está visible
    const filterText = page.getByText(/filtrar/i);
    await expect(filterText).toBeVisible();
    
    // Buscar checkboxes de categorías
    const categoryCheckboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await categoryCheckboxes.count();
    
    if (checkboxCount > 0) {
      // Obtener el primer checkbox
      const firstCheckbox = categoryCheckboxes.first();
      
      // Verificar el estado inicial
      const initialState = await firstCheckbox.isChecked();
      
      // Hacer clic en el label padre para cambiar el estado
      const firstLabel = page.locator('label.flex.items-center.gap-3').first();
      await firstLabel.click();
      await page.waitForTimeout(300);
      
      // Verificar que cambió el estado
      const newState = await firstCheckbox.isChecked();
      expect(newState).not.toBe(initialState);
      
      // Restaurar el estado original si es necesario
      if (initialState) {
        await firstLabel.click();
        await page.waitForTimeout(300);
      }
    }
  });
});
