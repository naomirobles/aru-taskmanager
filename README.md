# aru:taskmanager

Aplicación Next.js para gestionar tareas personales con integración de Clerk (autenticación), Prisma (Postgres) y generación de recomendaciones mediante OpenAI/OpenRouter.

## Resumen
- UI reactiva con Next 16 y React 19.
- Autenticación y metadata pública con Clerk.
- Persistencia en PostgreSQL mediante Prisma.
- Generación y guardado de recomendaciones con IA (OpenRouter/OpenAI).
- Diseño responsivo y componentes reutilizables en `components/calendar`.

## Características principales
- Panel calendario y vista en lista: componente [`CalendarView`](components/calendar/CalendarView.tsx).
- CRUD de tareas: acciones en [`app/actions/task_actions.tsx`](app/actions/task_actions.tsx).
- CRUD de categorías: acciones en [`app/actions/category_actions.tsx`](app/actions/category_actions.tsx).
- Onboarding que guarda metadata pública en Clerk y la BD: [`app/actions/register_user.tsx`](app/actions/register_user.tsx) y ruta de onboarding [`app/onboarding/page.tsx`](app/onboarding/page.tsx).
- Actualización de publicMetadata desde UI: API [`app/api/update-public-metadata/route.ts`](app/api/update-public-metadata/route.ts).
- Generación de recomendaciones con IA y guardado: [`app/actions/ai-actions.ts`](app/actions/ai-actions.ts).
- Integración con Clerk Provider: [`components/ClerkProviderWrapper.tsx`](components/ClerkProviderWrapper.tsx) y header: [`components/header.tsx`](components/header.tsx).
- Conexión a DB con Prisma: [`lib/db.ts`](lib/db.ts) y esquema: [`prisma/schema.prisma`](prisma/schema.prisma).

## Estructura relevante
- Páginas principales:
  - [app/page.tsx](app/page.tsx) — Home / calendario (requiere autenticación).
  - [app/calendar/page.tsx](app/calendar/page.tsx) — Ruta principal del calendario.
  - [app/onboarding/page.tsx](app/onboarding/page.tsx) — Flujo de onboarding.
  - [app/sign-in/[[...sign-in]]/page.tsx](app/sign-in/[[...sign-in]]/page.tsx)
  - [app/sign-up/[[...sign-up]]/page.tsx](app/sign-up/[[...sign-up]]/page.tsx)
- Componentes clave:
  - [`CalendarView`](components/calendar/CalendarView.tsx) — [components/calendar/CalendarView.tsx](components/calendar/CalendarView.tsx)
  - [`CalendarGrid`](components/calendar/CalendarGrid.tsx) — [components/calendar/CalendarGrid.tsx](components/calendar/CalendarGrid.tsx)
  - [`ListView`](components/calendar/ListView.tsx) — [components/calendar/ListView.tsx](components/calendar/ListView.tsx)
  - Modal y UI para tareas: [components/calendar/TaskModal.tsx](components/calendar/TaskModal.tsx), [components/calendar/TaskViewModal.tsx](components/calendar/TaskViewModal.tsx)
- Lógica server / actions:
  - Tareas: [app/actions/task_actions.tsx](app/actions/task_actions.tsx)
  - Categorías: [app/actions/category_actions.tsx](app/actions/category_actions.tsx)
  - Recomendaciones IA: [app/actions/ai-actions.ts](app/actions/ai-actions.ts)
  - Registro/Onboarding: [app/actions/register_user.tsx](app/actions/register_user.tsx)
- Infra / util:
  - Prisma client: [lib/db.ts](lib/db.ts)
  - OpenRouter client: [lib/openrouter.ts](lib/openrouter.ts)
  - Proxy / middleware Clerk: [proxy.ts](proxy.ts)
  - Prisma schema y migraciones: [prisma/schema.prisma](prisma/schema.prisma) y [prisma/migrations](prisma/migrations)

## Requisitos
- Node.js (recomendado 18+)
- PostgreSQL
- Variables de entorno (archivo `.env`):
  - DATABASE_URL — URL de conexión Postgres (usada por Prisma)  
  - DIRECT_URL — (opcional) direct DB url
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Clerk publishable key
  - NEXT_PUBLIC_APP_URL — URL pública de la app (usada en headers)
  - OPENROUTER_API_KEY — clave para OpenRouter (si usas la integración IA)
  - NEXT_PUBLIC_CLERK_PROXY_URL / NEXT_PUBLIC_CLERK_DOMAIN — (opcional) configuración Clerk
- Instalar dependencias:
```bash
npm install
```

## Scripts
- Desarrollo:
```bash
npm run dev
```
- Build:
```bash
npm run build
```
- Start (producción):
```bash
npm run start
```
- Lint:
```bash
npm run lint
```

## Base de datos (Prisma)
- Generar cliente Prisma:
```bash
npx prisma generate
```
- Crear/migrar esquema:
```bash
npx prisma migrate dev
```
- Ver esquema y tablas: [prisma/schema.prisma](prisma/schema.prisma)

## Configuración de Clerk
- Revisa [`components/ClerkProviderWrapper.tsx`](components/ClerkProviderWrapper.tsx) para las variables utilizadas.
- La middleware de Clerk se configura en [proxy.ts](proxy.ts) y redirige usuarios incompletos al onboarding.

## OpenRouter / IA
- Cliente configurado en: [lib/openrouter.ts](lib/openrouter.ts)
- Función que genera y guarda recomendaciones: [`generateRecommendations`](app/actions/ai-actions.ts) — [app/actions/ai-actions.ts](app/actions/ai-actions.ts)
- Añade `OPENROUTER_API_KEY` a `.env` para habilitar.

## Notas y consejos
- El onboarding marca `onboardingComplete` en la publicMetadata de Clerk con [`app/actions/register_user.tsx`](app/actions/register_user.tsx) y la comprobación se realiza en [app/onboarding/layout.tsx](app/onboarding/layout.tsx) y en la middleware [proxy.ts](proxy.ts).
- Revalidate de páginas se hace desde las actions usando `revalidatePath` para mantener UI sincronizada.
- Si usas Vercel, añade las variables de entorno en el dashboard y habilita las migraciones/seed según necesidad.

## Contribuir
1. Crea una rama feature/bugfix.
2. Añade pruebas si procede.
3. Abre PR con descripción y cambios.

## Referencias rápidas (archivos / símbolos)
- [`CalendarView`](components/calendar/CalendarView.tsx) — components/calendar/CalendarView.tsx  
- [`createTask`](app/actions/task_actions.tsx) — app/actions/task_actions.tsx  
- [`generateRecommendations`](app/actions/ai-actions.ts) — app/actions/ai-actions.ts  
- [`registerUser`](app/actions/register_user.tsx) — app/actions/register_user.tsx  
- [`db`](lib/db.ts) — lib/db.ts  
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)  
- Proxy/middleware Clerk: [proxy.ts](proxy.ts)  
- API actualizar metadata pública: [app/api/update-public-metadata/route.ts](app/api/update-public-metadata/route.ts)

---

Si quieres, puedo:
- Ajustar este README con comandos específicos para Docker/CI.
- Agregar secciones de despliegue en Vercel o pasos de migración más detallados.