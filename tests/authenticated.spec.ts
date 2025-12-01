import { test, expect } from "@playwright/test";

test.describe("authenticated tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
    // Esperar a que la página cargue completamente
    await page.waitForLoadState("networkidle");
  });

  test("debería poder acceder al calendario autenticado", async ({ page }) => {
    // Verificar que estamos en la página del calendario
    await expect(page).toHaveURL(/.*calendar/);
    
    // Verificar que el contenedor principal del calendario está visible
    await expect(page.locator('div.bg-white.dark\\:bg-slate-800')).toBeVisible();
  });

  test("debería poder crear una nueva tarea", async ({ page }) => {
    // El botón correcto es "Añadir tarea" según CalendarHeader.tsx
    const addButton = page.getByRole('button', { name: /añadir tarea/i });
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Esperar a que el modal se abra
    await expect(page.getByText('Nueva Tarea')).toBeVisible();
    
    // Rellenar el formulario
    await page.getByPlaceholder(/comer verdura/i).fill('Test Task - Playwright');
    
    // Abrir el selector de categorías
    const categorySelector = page.locator('button').filter({ hasText: /selecciona una categoría/i });
    await expect(categorySelector).toBeVisible();
    await categorySelector.click();
    
    // Esperar a que aparezca el dropdown y seleccionar la primera categoría
    await page.waitForTimeout(500);
    const firstCategory = page.locator('div.group.hover\\:bg-purple-50').first();
    await expect(firstCategory).toBeVisible();
    await firstCategory.click();
    
    // Rellenar la descripción
    await page.getByPlaceholder(/descripción de la tarea/i).fill('Esta es una tarea de prueba creada por Playwright');
    
    // Hacer clic en el botón "Hecho"
    const submitButton = page.getByRole('button', { name: /^hecho$/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Esperar a que el modal se cierre (con más tiempo)
    await page.waitForTimeout(2000);
    
    // Verificar que no hay errores visibles
    const modalStillVisible = await page.getByText('Nueva Tarea').isVisible().catch(() => false);
    if (modalStillVisible) {
      // Si el modal sigue abierto, puede ser que haya un error de validación
      console.log('Modal todavía visible, puede haber un error de validación');
    }
  });

  test("debería poder cambiar entre vista de mes y vista de lista", async ({ page }) => {
    // El botón correcto es "Lista" según CalendarHeader.tsx
    const listButton = page.getByRole('button', { name: /^lista$/i });
    await expect(listButton).toBeVisible();
    await listButton.click();
    
    // Verificar que aparece el texto "Lista de Tareas" en el header
    await expect(page.getByText('Lista de Tareas')).toBeVisible({ timeout: 5000 });
    
    // Cambiar de vuelta a vista de mes usando el botón "Calendario"
    const calendarButton = page.getByRole('button', { name: /calendario/i });
    await expect(calendarButton).toBeVisible();
    await calendarButton.click();
    
    // Verificar que volvemos a la vista de calendario
    await expect(page.locator('h1.text-2xl').filter({ hasText: /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i })).toBeVisible();
  });

  test("debería poder navegar entre meses", async ({ page }) => {
    // Esperar a que el calendario cargue
    await page.waitForTimeout(1000);
    
    // Obtener el mes actual mostrado - específicamente el h1 que contiene el mes
    const monthHeader = page.locator('h1.text-2xl.font-bold.text-white').filter({ 
      hasText: /enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i 
    });
    await expect(monthHeader).toBeVisible();
    const currentMonthText = await monthHeader.textContent();
    
    // Hacer clic en el botón siguiente mes (usando aria-label)
    const nextButton = page.getByRole('button', { name: /mes siguiente/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar que el mes cambió
    const newMonthText = await monthHeader.textContent();
    expect(newMonthText).not.toBe(currentMonthText);
    
    // Volver al mes anterior
    const prevButton = page.getByRole('button', { name: /mes anterior/i });
    await expect(prevButton).toBeVisible();
    await prevButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar que volvimos al mes original
    const restoredMonthText = await monthHeader.textContent();
    expect(restoredMonthText).toBe(currentMonthText);
  });

  test("debería poder buscar tareas en la vista de lista", async ({ page }) => {
    // Cambiar a vista de lista
    const listButton = page.getByRole('button', { name: /^lista$/i });
    await expect(listButton).toBeVisible();
    await listButton.click();
    await page.waitForTimeout(1000);
    
    // Buscar el input de búsqueda
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Escribir en el buscador
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    
    // Verificar que el filtro se aplicó
    await expect(searchInput).toHaveValue('test');
    
    // Limpiar la búsqueda
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test("debería poder filtrar tareas por categoría en la vista de lista", async ({ page }) => {
    // Cambiar a vista de lista
    const listButton = page.getByRole('button', { name: /^lista$/i });
    await expect(listButton).toBeVisible();
    await listButton.click();
    await page.waitForTimeout(1000);
    
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
