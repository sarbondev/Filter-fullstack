# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FilterSystem is an e-commerce platform for filtration products. It's a monorepo with three independent apps (no workspace manager — each has its own `node_modules`):

- **`server/`** — Express + TypeScript + MongoDB/Mongoose REST API (port 4000)
- **`client/`** — Next.js 15 (App Router, Turbopack) customer-facing storefront (port 3000)
- **`admin/`** — Vite + React 19 admin dashboard (port 5173)

## Commands

### Server
```bash
cd server
npm run dev          # tsx watch src/server.ts
npm run build        # tsc via tsconfig.build.json
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src --ext .ts
```

### Client
```bash
cd client
npm run dev          # next dev --turbopack
npm run build        # next build --turbopack
npm run lint         # eslint
```

### Admin
```bash
cd admin
npm run dev          # vite dev
npm run build        # tsc -b && vite build
npm run lint         # eslint .
```

No test framework is configured in any of the three apps.

## Architecture

### Server — Modular layered architecture

Each domain module in `server/src/modules/<domain>/` follows this file convention:
- `*.entity.ts` — TypeScript interfaces + response mapper (`toXxxResponse`)
- `*.schema.ts` — Mongoose schema + Zod validation schemas
- `*.repository.ts` — Database access layer (Mongoose queries)
- `*.service.ts` — Business logic
- `*.controller.ts` — Express request handlers
- `*.routes.ts` — Route definitions with middleware wiring

Modules: auth, products, categories, orders, cart, users, reviews, banners, dashboard, upload.

Shared code lives in `server/src/shared/`:
- `middleware/` — auth (JWT), validation (Zod), error handler, request logger, locale
- `utils/` — API response helpers, pagination, logger (pino), localization
- `services/` — Socket.IO service, Gemini AI service
- `types/common.types.ts` — `TranslatedField`, `ApiResponse`, `AuthRequest`, `JwtPayload`, `Locale`

All API routes are prefixed with `/api` (configurable via `API_PREFIX` env var).

### i18n / TranslatedField pattern

Content is stored with all three translations inline as `{ uz, ru, en }` objects (`TranslatedField`). This applies to product names, descriptions, category names, banner text, etc. The `Accept-Language` header drives locale selection via `localeMiddleware`. Supported locales: `uz`, `ru`, `en`.

### Client — Feature-Sliced Design (FSD-like)

- `app/[lang]/` — Next.js dynamic route for locale-based routing
- `entities/` — Domain UI components (ProductCard, CartItem, etc.)
- `features/` — Self-contained features (language-switcher, toast, wishlist, theme-toggle)
- `widgets/` — Composite UI blocks (navbar, footer, hero, product-grid)
- `shared/` — UI primitives, hooks, i18n dictionaries, types, utils
- `store/` — Redux Toolkit with RTK Query (`store/api/` for API slices)
- `providers/` — React context providers (StoreProvider)

The client proxies `/uploads/*` to the server via Next.js rewrites in `next.config.ts`.

### Admin — Vite SPA with RTK Query

- `pages/` — Page-level components (one per domain)
- `components/ui/` — Shared UI primitives
- `components/layout/` — AdminLayout, Header, Sidebar
- `store/api/` — RTK Query API slices extending a shared `baseApi`
- `store/authSlice.ts` — Auth state (JWT token)
- `lib/i18n/` — i18n via i18next with uz/ru/en translations
- `hooks/useSocket.ts` — Socket.IO client for real-time updates

Vite proxies `/api`, `/uploads`, and `/socket.io` to the server (localhost:4000).

### Cross-cutting

- Both frontends use RTK Query with a `baseApi` that injects Bearer tokens from Redux auth state
- Both frontends use Tailwind CSS v4 and lucide-react icons
- Server env is validated with Zod at startup (`server/src/config/env.ts`); requires `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`
- File uploads go to `server/uploads/` and are served as static files at `/uploads`
- Real-time: Socket.IO connects admin dashboard to server for live order/event updates
