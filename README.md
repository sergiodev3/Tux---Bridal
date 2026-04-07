# Tux Bridal — Cupones de alquiler de trajes (Weslaco, TX)

Aplicación web para un negocio de alquiler de trajes formales: los clientes escanean un código QR, ven ofertas de temporada, dejan su correo y obtienen un cupón en PDF con descuento. El correo queda registrado para campañas futuras.

---

## Estado actual

### Etapa 1 (scaffolding) — completada

Dejó **lista la base técnica**: Next.js, validación de entorno (**Zod**), clientes de Supabase y **esquema PostgreSQL** completo (RPC `claim_coupon`, RLS, seed).

### Etapa 2 (shell + i18n) — completada

La app ya **compila y arranca** con rutas localizadas:

| Área             | Contenido                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rutas**        | `/` redirige a `/en`; contenido en `/en` y `/es` (`src/app/[locale]/…`)                                                                                        |
| **Middleware**   | `src/middleware.ts` — prefijo de idioma y redirección por defecto                                                                                              |
| **Layouts**      | `src/app/layout.tsx` (raíz, fuentes DM Sans + Cormorant Garamond) y `src/app/[locale]/layout.tsx` con `lang` en contenedor y **`generateMetadata`** por idioma |
| **SEO**          | `alternates.languages` (`en` / `es`) en metadata de la home por locale                                                                                         |
| **Traducciones** | `src/lib/i18n/` — diccionarios EN/ES y `getDictionary`                                                                                                         |
| **Cabecera**     | `src/components/shell/site-header.tsx` — marca + conmutador **English / Español**                                                                              |
| **404**          | `src/app/not-found.tsx`                                                                                                                                        |

### Etapa 3 (landing de conversión) — completada

| Área                      | Contenido                                                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**                  | Temporada graduación/prom, titular, subtítulo, nota al pie — textos en `en.ts` / `es.ts`                                                                                           |
| **Cuenta regresiva**      | `SeasonCountdown` (cliente); fin de temporada configurable con `NEXT_PUBLIC_SEASON_END_ISO` o valor por defecto (30 jun 2026, `America/Chicago`); respeta `prefers-reduced-motion` |
| **CTA**                   | “Get my coupon” / “Obtener mi cupón” enlaza a `#featured-suits` (scroll suave en `globals.css`)                                                                                    |
| **Trajes destacados**     | `getFeaturedSuits()` en `src/lib/data/featured-suits.ts` — Supabase: `is_active`, `is_featured`, máx. 4 filas                                                                      |
| **Tarjetas**              | `SuitCard`: badge de stock **in_store** / **special_order**, descuento, placeholder elegante si no hay `image_url`, `next/image` si hay imagen en Storage                          |
| **JFW**                   | Enlace “See full photos” en nueva pestaña con `rel="noopener noreferrer"` (sin hotlink de imágenes de JFW)                                                                         |
| **Confianza**             | `TrustBlock` — RGV, Jim’s Formal Wear, Weslaco                                                                                                                                     |
| **Rendimiento de página** | `export const dynamic = "force-dynamic"` en la home de marketing                                                                                                                   |
| **Imágenes**              | `next.config.ts` — `remotePatterns` para el host de `NEXT_PUBLIC_SUPABASE_URL` (bucket público)                                                                                    |

### Resumen técnico compartido (etapas 1–3)

| Área                     | Contenido                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| **Framework**            | Next.js 15 (App Router), React 19, TypeScript **strict** + `noUncheckedIndexedAccess`              |
| **Estilos**              | Tailwind CSS v4 (`@tailwindcss/postcss`, `src/app/globals.css`, tema `font-sans` / `font-display`) |
| **Calidad**              | ESLint (`next/core-web-vitals`), Prettier                                                          |
| **Variables de entorno** | `src/lib/env.ts` — `getPublicEnv` / `getServerEnv`                                                 |
| **Supabase**             | `src/lib/supabase/server.ts`, `browser.ts`, `service.ts`                                           |
| **Tipos DB**             | `src/types/database.ts` — **placeholder** hasta `supabase gen types`                               |
| **Cupón / DB**           | `supabase/migrations/20260406120000_init.sql`                                                      |

### Base de datos (Supabase / PostgreSQL)

La migración define:

- **Enums:** `stock_type` (`in_stock` | `special_order`), `coupon_status` (`pending` | `redeemed` | `expired`).
- **Tablas:** `suit_categories`, `subscribers`, `coupons` (con instantáneas de descuento y disponibilidad al crear el cupón).
- **Reglas:** máximo **4** trajes destacados (`is_featured` + `is_active`); un mismo correo **solo un cupón por categoría de traje** (si repite, se devuelve el existente para volver a descargar).
- **RPC `claim_coupon`:** creación atómica del cupón, código de 8 caracteres con `gen_random_bytes`, límite de **3 cupones nuevos por correo cada 24 h** (no cuenta reutilizar el mismo traje).
- **RLS:** lectura pública de `suit_categories` activos; escrituras sensibles vía **service role** y la función `claim_coupon` (ejecutable solo por `service_role`).
- **Storage:** bucket público `suit-images` para imágenes propias (sin hotlink a Jim’s Formal Wear).
- **Datos iniciales:** 7 trajes de ejemplo con URLs de referencia a JFW.

### Variables de entorno

Copia `.env.example` a `.env.local` y completa al menos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo servidor; nunca exponer al cliente)

Opcionales: `NEXT_PUBLIC_SITE_URL`, nombre/teléfono/dirección del negocio, base de URLs de productos JFW, **`NEXT_PUBLIC_SEASON_END_ISO`** (fecha/hora ISO de fin de oferta para el contador).

### Cómo arrancar en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — te redirige a `/en`. Prueba también `/es`.

```bash
npm run build
```

Valida la compilación de producción.

### Aplicar la migración en Supabase

1. Crea el proyecto en [Supabase](https://supabase.com).
2. En el **SQL Editor**, pega y ejecuta el contenido de `supabase/migrations/20260406120000_init.sql` (o usa la CLI de Supabase vinculada al repo).
3. Genera tipos TypeScript y reemplaza `src/types/database.ts`:

```bash
npx supabase gen types typescript --project-id <TU_PROJECT_ID> > src/types/database.ts
```

---

## Próximas etapas sugeridas

### Etapa 4 — Formulario, Server Action y descarga (siguiente)

- Modal o formulario inline: solo **email**, **React Hook Form + Zod**.
- **Server Action** que llame a `claim_coupon` con el cliente de **service role**; manejo explícito de errores de Supabase y de `RATE_LIMIT`.
- Tras éxito: botón **“Descargar cupón”** en la misma pantalla (PDF generado en servidor o stream).
- `revalidatePath` / caché donde corresponda.

### Etapa 5 — PDF del cupón (`@react-pdf/renderer`)

- Plantilla con nombre del negocio, logo (placeholder), traje, badge de disponibilidad, % de descuento, código grande, vencimiento, dirección/teléfono, nota legal EN/ES.

### Etapa 6 — Despliegue y operación

- Proyecto en **Vercel**, variables de entorno de producción.
- Dominio y QR del flyer apuntando a la URL pública.
- (Opcional) panel interno o solo **Supabase Dashboard** para gestionar trajes, descuentos e imágenes en Storage.

---

## Scripts útiles

| Comando                | Descripción               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Servidor de desarrollo    |
| `npm run build`        | Compilación de producción |
| `npm run lint`         | ESLint                    |
| `npm run format`       | Prettier (escribir)       |
| `npm run format:check` | Prettier (solo verificar) |

---

## Repositorio

**GitHub:** [https://github.com/sergiodev3/Tux---Bridal](https://github.com/sergiodev3/Tux---Bridal)

---

## Licencia

Privado — uso del negocio titular del repositorio.
