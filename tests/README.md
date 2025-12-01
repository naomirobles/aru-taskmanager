# 📋 Tests - Task Manager

Estructura organizada de tests E2E usando Playwright.

## 🗂️ Estructura

```
tests/
├── fixtures/              # Configuración y setup de tests
│   └── auth.setup.ts     # Autenticación con Clerk
│
├── helpers/              # Funciones auxiliares reutilizables
│   └── test-helpers.ts   # Helpers para navegación y acciones comunes
│
├── utils/                # Utilidades y constantes
│   └── constants.ts      # Selectores, timeouts y textos reutilizables
│
└── e2e/                  # Tests End-to-End organizados por dominio
    ├── calendar/         # Tests del calendario
    │   ├── navigation.spec.ts  # Navegación entre meses
    │   └── views.spec.ts       # Cambio de vistas y filtros
    │
    ├── tasks/            # Tests de tareas
    │   ├── create.spec.ts           # Creación de tareas
    │   ├── edit.spec.ts             # Edición de tareas
    │   └── ai-recommendations.spec.ts # Generación de recomendaciones IA
    │
    └── categories/       # Tests de categorías
        ├── create.spec.ts  # Creación de categorías
        ├── edit.spec.ts    # Edición de categorías
        └── delete.spec.ts  # Eliminación de categorías
```

## 🚀 Ejecutar Tests

```bash
# Todos los tests
npm run test:e2e

# Tests específicos de un dominio
npx playwright test tests/e2e/calendar
npx playwright test tests/e2e/tasks
npx playwright test tests/e2e/categories

# Un archivo específico
npx playwright test tests/e2e/tasks/create.spec.ts

# Con interfaz gráfica
npx playwright test --ui

# En modo debug
npx playwright test --debug
```

## 📝 Convenciones

### Helpers
- Funciones reutilizables para acciones comunes
- Nombradas con verbos: `navigateTo`, `switchTo`, `openModal`
- Retornan promesas y usan async/await

### Constants
- Selectores CSS agrupados en `SELECTORS`
- Timeouts agrupados en `TIMEOUTS`
- Textos de botones en `BUTTONS`
- Placeholders en `PLACEHOLDERS`

### Tests
- Descripciones en español
- Nombres de archivos en inglés
- Un describe por archivo
- BeforeEach para setup común

## 🎯 Beneficios de esta Estructura

1. **Mantenibilidad**: Cambios en UI solo afectan archivos de helpers/constants
2. **Legibilidad**: Tests más limpios y fáciles de entender
3. **Reutilización**: Helpers compartidos evitan duplicación
4. **Escalabilidad**: Fácil añadir nuevos tests sin archivos enormes
5. **Debugging**: Errores más fáciles de localizar por dominio

## 🔧 Agregar Nuevos Tests

### Nuevo test en dominio existente:
Añade el test en el archivo `.spec.ts` correspondiente dentro de su carpeta de dominio.

### Nuevo dominio:
1. Crea carpeta en `tests/e2e/nuevo-dominio/`
2. Crea archivo `tests/e2e/nuevo-dominio/feature.spec.ts`
3. Reutiliza helpers existentes o crea nuevos en `helpers/test-helpers.ts`

### Nuevo helper:
Añade la función en `helpers/test-helpers.ts` con JSDoc descriptivo.

### Nuevas constantes:
Añade en la categoría apropiada en `utils/constants.ts`.
