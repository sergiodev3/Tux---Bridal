# Tux Bridal — Cupones de alquiler de trajes (Weslaco, TX)

Aplicación web para un negocio de alquiler de trajes formales: los clientes escanean un código QR, ven ofertas de temporada, dejan su correo y obtienen un cupón en PDF con descuento. El correo queda registrado para campañas futuras.

---

## Estado actual: etapa 1 (scaffolding) — completada

Esta etapa deja **lista la base técnica** del proyecto: configuración de Next.js, validación de entorno, clientes de Supabase y **esquema completo en PostgreSQL** (incluida la lógica de cupones en base de datos). **Aún no hay páginas visibles ni flujo de usuario** (`page.tsx`, `layout.tsx`, componentes de UI, PDF ni acciones de servidor de negocio están **fuera de alcance** hasta la etapa 2).

### Qué incluye la etapa 1

| Área | Contenido |
|------|-----------|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript en modo **strict** + `noUncheckedIndexedAccess` |
| **Estilos** | Tailwind CSS v4 (`@tailwindcss/postcss`, `src/app/globals.css`) |
| **Calidad** | ESLint (`next/core-web-vitals`), Prettier |
| **Variables de entorno** | `src/lib/env.ts` — validación con **Zod** (`getPublicEnv` / `getServerEnv`) |
| **Supabase** | `src/lib/supabase/server.ts` (anon + cookies), `browser.ts`, `service.ts` (rol de servicio, solo servidor) |
| **Tipos DB** | `src/types/database.ts` — **placeholder**; sustituir con `supabase gen types typescript` cuando exista el proyecto |
| **Estructura de rutas (vacía)** | `src/app/[locale]/(marketing)/` y `(coupon)/` preparados para `/en` y `/es` |
| **Base de datos** | `supabase/migrations/20260406120000_init.sql` |

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

Opcionales: `NEXT_PUBLIC_SITE_URL`, nombre/teléfono/dirección del negocio, base de URLs de productos JFW.

### Cómo arrancar en local (después de la etapa 2)

Cuando existan `layout` y `page` mínimos:

```bash
npm install
npm run dev
```

Hoy, **sin `layout.tsx` / `page.tsx`**, `next dev` no es un flujo completo hasta implementar la etapa 2.

### Aplicar la migración en Supabase

1. Crea el proyecto en [Supabase](https://supabase.com).
2. En el **SQL Editor**, pega y ejecuta el contenido de `supabase/migrations/20260406120000_init.sql` (o usa la CLI de Supabase vinculada al repo).
3. Genera tipos TypeScript y reemplaza `src/types/database.ts`:

```bash
npx supabase gen types typescript --project-id <TU_PROJECT_ID> > src/types/database.ts
```

---

## Próximas etapas sugeridas

### Etapa 2 — Shell de la app e internacionalización

- `src/app/layout.tsx` raíz y `src/app/[locale]/layout.tsx` con `generateMetadata` donde aplique.
- `middleware.ts`: redirección `/` → `/en`, detección o fijación de locale (`en` | `es`).
- Primera página mínima comprobable (`next dev` / `next build`).
- Diccionarios o archivos de traducción para textos EN/ES (hero, badges de disponibilidad, CTAs).

### Etapa 3 — Landing de conversión

- Hero con oferta de temporada y **cuenta regresiva** hasta fin de temporada.
- Hasta **4** tarjetas de trajes destacados (datos desde Supabase: `is_featured = true`).
- Badge prominente **“Available In Store” / “Disponible en Tienda”** vs **“By Special Order” / “Pedido Especial”**.
- CTA principal “Get My Coupon” / “Obtener mi Cupón” visible above the fold en móvil.
- Bloque de confianza (años, eventos, Weslaco, TX).
- Enlace JFW en nueva pestaña (sin hotlink de imágenes).

### Etapa 4 — Formulario, Server Action y descarga

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

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (cuando exista página mínima) |
| `npm run build` | Compilación de producción |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (escribir) |
| `npm run format:check` | Prettier (solo verificar) |

---

## Repositorio

**GitHub:** [https://github.com/sergiodev3/Tux---Bridal](https://github.com/sergiodev3/Tux---Bridal)

---

## Licencia

Privado — uso del negocio titular del repositorio.
