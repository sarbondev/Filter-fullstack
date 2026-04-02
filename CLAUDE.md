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
npm run build        # rimraf dist && tsc via tsconfig.build.json
npm start            # node dist/server.js
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src --ext .ts
```

### Client
```bash
cd client
npm run dev          # next dev --turbopack
npm run build        # next build --turbopack
npm start            # next start
npm run lint         # eslint
```

### Admin
```bash
cd admin
npm run dev          # vite dev
npm run build        # tsc -b && vite build
npm run preview      # vite preview
npm run lint         # eslint .
```

No test framework is configured in any of the three apps.

## Architecture

### Server — Modular layered architecture

Each domain module in `server/src/modules/<domain>/` follows this file convention:
- `*.entity.ts` — TypeScript interfaces + response mapper (`toXxxResponse`)
- `*.schema.ts` — Mongoose schema + Zod validation schemas (separate concerns: Mongoose for DB, Zod for request validation)
- `*.repository.ts` — Database access layer (Mongoose queries)
- `*.service.ts` — Business logic (calls repository, Gemini AI for translations, Socket.IO for real-time events)
- `*.controller.ts` — Express request handlers
- `*.routes.ts` — Route definitions with middleware wiring **and** manual dependency injection

Modules: auth, products, categories, orders, cart, users, reviews, banners, blogs, dashboard, upload.

**Dependency injection pattern** — each `routes.ts` manually wires the chain:
```typescript
const repository = new XxxRepository();
const service = new XxxService(repository);
const controller = new XxxController(service);
// Then: router.get('/', asyncHandler(controller.method))
```

**Route middleware composition**: `validate({ body: schema })` → `authenticate` → `authorize('ADMIN')` → `asyncHandler(controller.method)`

### Error handling & validation

Custom error hierarchy in `server/src/shared/middleware/error-handler.middleware.ts`:
- `AppError` base class with subclasses: `NotFoundError` (404), `ValidationError` (422), `UnauthorizedError` (401), `ForbiddenError` (403), `ConflictError` (409)
- Global error handler also catches: ZodError → 422 with flattened fieldErrors, Mongoose ValidationError → 422, MongoServerError E11000 → 409, CastError → 400
- All async controller methods must be wrapped in `asyncHandler()` to forward rejections to the error handler

### API response patterns

`ResponseHelper` in `server/src/shared/utils/api-response.ts`:
- `success(res, data, message?, statusCode?)` → `{ success: true, message, data }`
- `created(res, data, message?)` → 201
- `paginated(res, result, message?)` → data + meta (`total, page, limit, totalPages, hasNextPage, hasPrevPage`)
- `noContent()` → 204

Pagination: `parsePagination(req)` extracts page/limit from query (default limit 20, max 100).

### i18n / TranslatedField pattern

Content is stored with all three translations inline as `{ uz, ru, en }` objects (`TranslatedField`). The `Accept-Language` header (or `?lang` query param) drives locale selection via `localeMiddleware`. Supported locales: `uz`, `ru`, `en`.

**Server-side localization** (`server/src/shared/utils/localize.ts`):
- `localizeResponse(data, req)` recursively converts all TranslatedField objects to plain strings based on request locale
- Pass `?fullTranslation=true` to return all three locale values instead of a single string
- TranslatedField is detected by checking for objects with exactly `uz`, `ru`, `en` string keys

**Gemini AI translation** (`server/src/shared/services/gemini.service.ts`): Product/category creation can auto-translate fields via `geminiService.translate()` with retry logic (3 retries, exponential backoff for 429s).

### Client — Feature-Sliced Design (FSD-like)

Source lives under `client/src/`:
- `app/[lang]/` — Next.js dynamic route for locale-based routing
- `entities/` — Domain UI components (ProductCard, CartItem, etc.)
- `features/` — Self-contained features (language-switcher, toast, wishlist, theme-toggle)
- `widgets/` — Composite UI blocks (navbar, footer, hero, product-grid)
- `shared/` — UI primitives, hooks, i18n dictionaries, types, utils
- `store/` — Redux Toolkit with RTK Query (`store/api/` for API slices)
- `providers/` — React context providers (StoreProvider)
- `middleware.ts` — Next.js middleware for locale routing

**Client locale routing** (`client/src/middleware.ts`): Default locale is `ru`. Redirects paths without a locale prefix to `/{ru}/{path}`. Skips `_next`, `/api`, and static files.

**Client i18n**: `getDictionary(locale)` uses dynamic imports for code-splitting per locale. Type-safe via `Dictionary` type exported from `en.ts`.

The client proxies `/uploads/*` to the server via Next.js rewrites in `next.config.ts`.

### Admin — Vite SPA with RTK Query

Source lives under `admin/src/`:
- `pages/` — Page-level components (one per domain)
- `components/ui/` — Shared UI primitives
- `components/layout/` — AdminLayout, Header, Sidebar
- `store/api/` — RTK Query API slices extending a shared `baseApi`
- `store/authSlice.ts` — Auth state persisted to localStorage (token + user + notification counter)
- `lib/i18n/` — i18next with LanguageDetector (localStorage → navigator fallback, default `ru`)
- `hooks/useSocket.ts` — Socket.IO client for real-time updates

Vite proxies `/api`, `/uploads`, and `/socket.io` to the server (localhost:4000).

**Admin auth wrapper**: `baseQueryWithAuth` detects 401 responses and auto-dispatches `logout()`.

### RTK Query patterns (both frontends)

- Both use a `baseApi` that injects Bearer tokens from Redux auth state
- **Client** baseApi: extracts locale from URL pathname (`/[lang]/...`) for `Accept-Language` header
- **Admin** baseApi: wraps with 401 → auto-logout
- **Tag types**: `Product`, `Category`, `Cart`, `Review`, `Banner`, `Order`, `Blog` (admin adds `User`, `Dashboard`)
- **Tag invalidation pattern**: mutations use `invalidatesTags` with specific IDs + root tags; queries use `providesTags` with ID-based cache entries
- **transformResponse**: unwraps `response.data` from the API envelope

### Socket.IO real-time architecture

- Server authenticates sockets via JWT in handshake auth
- Room-based broadcasting: `user:{id}`, `role:{role}`, `staff` (ADMIN + CALL_MANAGER)
- Emit helpers: `emitToUser()`, `emitToStaff()`, `emitToRole()`, `emitToAll()`
- Event names: `order:new`, `order:statusUpdated`, `product:created`, `category:updated`, etc.
- Admin `useSocket` hook listens for events → increments notifications + invalidates RTK Query tags

### Cross-cutting

- Both frontends use Tailwind CSS v4 and lucide-react icons
- Server env validated with Zod at startup (`server/src/config/env.ts`); required: `MONGODB_URI`, `JWT_SECRET` (min 32 chars), `GEMINI_API_KEY`. Defaults: `PORT=4000`, `API_PREFIX=/api`, `GEMINI_MODEL=gemini-2.5-flash`, `JWT_EXPIRES_IN=7d`, `RATE_LIMIT_WINDOW_MS=900000`, `RATE_LIMIT_MAX_REQUESTS=100`, `LOG_LEVEL=info`
- All API routes prefixed with `/api` (configurable via `API_PREFIX`). Health check at `/health` (outside prefix).
- Server middleware order: helmet → CORS → rate-limit → body parsing → static files → locale → request logger → routes → 404 → error handler
- File uploads go to `server/uploads/` and are served as static files at `/uploads`
- Logging: pino with pino-pretty in dev, JSON in prod. Redacts `authorization`, `password`, `token` fields.
- Graceful shutdown on SIGTERM/SIGINT with 10s timeout
