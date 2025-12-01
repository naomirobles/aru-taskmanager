import { test, expect } from "@playwright/test";
import { navigateToCalendar } from "../../helpers/test-helpers";
import { SELECTORS, BUTTONS, MONTHS_REGEX, TIMEOUTS } from "../../utils/constants";

test.describe("Navegación del Calendario", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCalendar(page);
  });

  test("debería poder acceder al calendario autenticado", async ({ page }) => {
    // Verificar que estamos en la página del calendario
    await expect(page).toHaveURL(/.*calendar/);
    
    // Verificar que el contenedor principal del calendario está visible
    await expect(page.locator(SELECTORS.CALENDAR_CONTAINER)).toBeVisible();
  });

  test("debería poder navegar entre meses", async ({ page }) => {
    // Esperar a que el calendario cargue
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Obtener el mes actual mostrado
    const monthHeader = page.locator(SELECTORS.MONTH_HEADER).filter({ 
      hasText: MONTHS_REGEX
    });
    await expect(monthHeader).toBeVisible();
    const currentMonthText = await monthHeader.textContent();
    
    // Hacer clic en el botón siguiente mes
    const nextButton = page.getByRole('button', { name: BUTTONS.NEXT_MONTH });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Verificar que el mes cambió
    const newMonthText = await monthHeader.textContent();
    expect(newMonthText).not.toBe(currentMonthText);
    
    // Volver al mes anterior
    const prevButton = page.getByRole('button', { name: BUTTONS.PREV_MONTH });
    await expect(prevButton).toBeVisible();
    await prevButton.click();
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Verificar que volvimos al mes original
    const restoredMonthText = await monthHeader.textContent();
    expect(restoredMonthText).toBe(currentMonthText);
  });
});
