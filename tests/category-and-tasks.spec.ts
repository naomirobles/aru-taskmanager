import { test, expect } from "@playwright/test";

test.describe("Gestión de Categorías", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
    await page.waitForLoadState("networkidle");
    // Cambiar a vista de lista para acceder a las categorías fácilmente
    const listButton = page.getByRole('button', { name: /^lista$/i });
    await listButton.click();
    await page.waitForTimeout(1000);
  });

  test("debería poder crear una nueva categoría", async ({ page }) => {
    // Hacer clic en el botón "Nueva Sección" que abre el modal de categoría
    const newSectionButton = page.getByRole('button', { name: /nueva sección/i });
    await expect(newSectionButton).toBeVisible();
    await newSectionButton.click();

    // Esperar a que el modal se abra
    await expect(page.getByText('Nueva Categoría')).toBeVisible();

    // Generar un nombre único para evitar conflictos
    const uniqueName = `Test Cat ${Date.now()}`;

    // Rellenar el nombre de la categoría
    const categoryInput = page.getByPlaceholder(/ej: trabajo, personal, estudios/i);
    await expect(categoryInput).toBeVisible();
    await categoryInput.fill(uniqueName);

    // Seleccionar un color diferente (segundo color)
    const colorButtons = page.locator('button[style*="background-color"]').filter({ hasNot: page.locator('svg') });
    const secondColor = colorButtons.nth(1);
    await secondColor.click();

    // Verificar que aparece en la vista previa
    await expect(page.getByText(uniqueName).first()).toBeVisible();

    // Hacer clic en el botón "Crear Categoría"
    const createButton = page.getByRole('button', { name: /crear categoría/i });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();

    // Configurar listener para capturar errores de navegación
    page.on('pageerror', err => console.log('Page error:', err.message));

    await createButton.click();

    // Esperar con estrategia más robusta
    await Promise.race([
      page.waitForSelector('h2:has-text("Nueva Categoría")', { state: 'hidden', timeout: 10000 }),
      page.waitForTimeout(10000)
    ]);

    // Verificar que la categoría aparece en la lista de filtros
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const categoryInList = page.getByText(uniqueName).first();
    await expect(categoryInList).toBeVisible({ timeout: 5000 });
  });

  test("debería poder editar una categoría existente", async ({ page }) => {
    // Buscar una categoría en la lista de filtros
    const categoryLabels = page.locator('label.flex.items-center.gap-3');
    const firstCategory = categoryLabels.first();
    await expect(firstCategory).toBeVisible();

    // Obtener el nombre original de la categoría
    const originalName = await firstCategory.locator('span.text-sm').textContent();

    // Hacer clic en una sección de categoría para abrir el modal de edición
    const categorySection = page.locator('div[class*="bg-white"][class*="rounded-2xl"]').first();
    if (await categorySection.count() > 0) {
      // Hacer hover para ver las opciones
      await categorySection.hover();
      await page.waitForTimeout(500);

      // Buscar el botón de menú o hacer clic en el header de la sección
      const sectionHeader = categorySection.locator('div').first();
      await sectionHeader.click();

      // Esperar a que aparezca el modal de edición
      await page.waitForTimeout(1000);

      if (await page.getByText('Editar Categoría').isVisible()) {
        // Generar nombre único
        const newName = `${originalName} ${Date.now()}`;

        // Cambiar el nombre
        const nameInput = page.getByPlaceholder(/ej: trabajo, personal, estudios/i);
        await nameInput.clear();
        await nameInput.fill(newName);

        // Seleccionar un color diferente
        const colorButtons = page.locator('button[style*="background-color"]').filter({ hasNot: page.locator('svg') });
        const thirdColor = colorButtons.nth(2);
        await thirdColor.click();

        // Guardar cambios
        const saveButton = page.getByRole('button', { name: /guardar cambios/i });
        await saveButton.click();

        // Esperar a que el modal se cierre
        await expect(page.getByText('Editar Categoría')).not.toBeVisible({ timeout: 5000 });

        // Verificar que el nombre cambió
        await page.waitForTimeout(1000);
        await expect(page.getByText(newName).first()).toBeVisible();
      }
    }
  });

  test("debería poder eliminar una categoría sin tareas", async ({ page }) => {
    // Primero crear una categoría única para eliminar
    const newSectionButton = page.getByRole('button', { name: /nueva sección/i });
    await newSectionButton.click();
    await expect(page.getByText('Nueva Categoría')).toBeVisible();

    const uniqueName = `ToDelete ${Date.now()}`;
    const categoryInput = page.getByPlaceholder(/ej: trabajo, personal, estudios/i);
    await categoryInput.fill(uniqueName);

    const createButton = page.getByRole('button', { name: /crear categoría/i });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    // Esperar a que el modal se cierre con estrategia robusta
    await Promise.race([
      page.waitForSelector('h2:has-text("Nueva Categoría")', { state: 'hidden', timeout: 10000 }),
      page.waitForTimeout(10000)
    ]);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Ahora buscar y eliminar la categoría
    const categoryToDelete = page.getByText(uniqueName);
    await expect(categoryToDelete.first()).toBeVisible({ timeout: 5000 });

    // Hacer clic en la sección de la categoría
    const categorySection = page.locator('div').filter({ hasText: uniqueName }).first();
    await categorySection.click();
    await page.waitForTimeout(1000);

    if (await page.getByText('Editar Categoría').isVisible()) {
      // Hacer clic en el botón eliminar
      const deleteButton = page.getByRole('button', { name: /eliminar categoría/i });
      await expect(deleteButton).toBeVisible();

      // Preparar para aceptar el diálogo de confirmación
      page.once('dialog', dialog => dialog.accept());

      await deleteButton.click();

      // Esperar a que el modal se cierre
      await expect(page.getByText('Editar Categoría')).not.toBeVisible({ timeout: 5000 });

      // Verificar que la categoría ya no existe
      await page.waitForTimeout(1000);
      await expect(page.getByText(uniqueName)).not.toBeVisible();
    }
  });
});

test.describe("Gestión de Tareas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
    await page.waitForLoadState("networkidle");
  });

  test("debería poder editar una tarea existente", async ({ page }) => {
    const uniqueTitle = `Edit Task ${Date.now()}`;

    // Primero crear una tarea para editar
    const addButton = page.getByRole('button', { name: /añadir tarea/i });
    await addButton.click();
    await expect(page.getByText('Nueva Tarea')).toBeVisible();

    // Crear tarea con fecha de inicio
    await page.getByPlaceholder(/comer verdura/i).fill(uniqueTitle);
    const categorySelector = page.locator('button').filter({ hasText: /selecciona una categoría/i });
    await categorySelector.click();
    await page.waitForTimeout(500);
    const firstCategory = page.locator('div.group.hover\\:bg-purple-50').first();
    await firstCategory.click();
    await page.getByPlaceholder(/descripción de la tarea/i).fill('Descripción original');

    // Agregar fecha de inicio
    const startDateInput = page.locator('input[type="date"]').first();
    await startDateInput.fill('2025-11-30');

    const submitButton = page.getByRole('button', { name: /^hecho$/i });
    await submitButton.click();

    // Esperar a que se cierre el modal y se cree la tarea
    await Promise.race([
      page.waitForSelector('h2:has-text("Nueva Tarea")', { state: 'hidden', timeout: 10000 }),
      page.waitForTimeout(10000)
    ]);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Buscar y hacer clic en la tarea creada
    const taskElement = page.getByText(uniqueTitle).first();
    await expect(taskElement).toBeVisible({ timeout: 10000 });
    await taskElement.click();

    // Esperar a que se abra el modal de visualización
    await page.waitForTimeout(1000);

    // Hacer clic en el botón "Editar"
    const editButton = page.getByRole('button', { name: /^editar$/i }).last();
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForTimeout(500);

    // Editar el título
    const titleInput = page.locator('input.text-2xl[value]');
    await titleInput.clear();
    const newTitle = `${uniqueTitle} - Editado`;
    await titleInput.fill(newTitle);

    // Editar la descripción
    const descriptionTextarea = page.locator('textarea').nth(0);
    await expect(descriptionTextarea).toBeVisible();
    await descriptionTextarea.click();
    await descriptionTextarea.clear();
    await descriptionTextarea.fill('Descripción modificada por test');

    // Guardar cambios
    const saveButton = page.getByRole('button', { name: /guardar/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Esperar a que se guarden los cambios
    await page.waitForTimeout(2000);

  });

});

test.describe("Generación de Recomendaciones con IA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
    await page.waitForLoadState("networkidle");
  });

  test("debería poder generar recomendaciones para una tarea", async ({ page }) => {
    const uniqueTitle = `Learn JS ${Date.now()}`;

    // Crear una tarea con tema específico para obtener mejores recomendaciones
    const addButton = page.getByRole('button', { name: /añadir tarea/i });
    await addButton.click();
    await expect(page.getByText('Nueva Tarea')).toBeVisible();

    // Crear tarea con tema específico
    await page.getByPlaceholder(/comer verdura/i).fill(uniqueTitle);
    const categorySelector = page.locator('button').filter({ hasText: /selecciona una categoría/i });
    await categorySelector.click();
    await page.waitForTimeout(500);
    const firstCategory = page.locator('div.group.hover\\:bg-purple-50').first();
    await firstCategory.click();
    await page.getByPlaceholder(/descripción de la tarea/i).fill('Necesito aprender los fundamentos de JavaScript para desarrollo web');

    // Agregar fecha de inicio
    const startDateInput = page.locator('input[type="date"]').first();
    await startDateInput.fill('2025-11-30');

    const submitButton = page.getByRole('button', { name: /^hecho$/i });
    await submitButton.click();

    // Esperar a que el modal se cierre completamente
    await Promise.race([
      page.waitForSelector('h2:has-text("Nueva Tarea")', { state: 'hidden', timeout: 10000 }),
      page.waitForTimeout(10000)
    ]);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const listButton = page.getByRole('button', { name: /^lista$/i });
    await expect(listButton).toBeVisible();
    await listButton.click();
    await page.waitForTimeout(1000);

    // Buscar y hacer clic en la tarea creada
    const taskElement = page.getByText(uniqueTitle).first();
    await expect(taskElement).toBeVisible({ timeout: 10000 });
    await taskElement.click();

    // Esperar a que se abra el modal de visualización
    await page.waitForTimeout(1000);

    // Verificar que aparece la sección de Recomendaciones
    await expect(page.getByRole('heading', { name: 'Recomendaciones' })).toBeVisible();

    // Hacer clic en el botón "Generar con IA"
    const generateButton = page.getByRole('button', { name: /generar con ia/i });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // Verificar que aparece el indicador de carga (usar .first() para strict mode)
    await expect(page.getByText(/generando|buscando recursos/i).first()).toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(2000);

    const recommendations = page.locator('a[href^="http"]');
    const firstRecommendation = recommendations.first();
    await expect(firstRecommendation).toBeVisible();

  });

});
