# Frontend Architecture Principles

**Scope**: Project-agnostic frontend architecture standards for React + TypeScript + Tailwind CSS + shadcn/ui applications.  
**Applicability**: All PWA, SPA, and mobile-first web applications built by this team.

---

## 1. Technology Stack Conventions

### 1.1 Core Stack Matrix

| Layer | Technology | Version Policy | Purpose |
| :--- | :--- | :--- | :--- |
| **UI Framework** | React (latest stable) | Pin major, float patch | Component rendering engine |
| **Language** | TypeScript (Strict Mode) | `"strict": true` always | Type safety across all layers |
| **Bundler** | Vite | Latest stable | Fast HMR, path aliases (`@/*`), optimized builds |
| **Styling** | Tailwind CSS + PostCSS | v3.x / v4.x | Utility-first CSS with design token variables |
| **Component Library** | shadcn/ui (Radix UI primitives) | Latest | Headless, accessible, composable UI primitives |
| **State Management** | Zustand | Latest stable | Lightweight, scalable client state |
| **Persistence** | IndexedDB (`idb-keyval`) | Latest | Offline-first local data persistence |
| **Icons** | Lucide React | Latest | Consistent, semantic stroke icon set |
| **Animations** | FormKit Auto-Animate | Latest | Zero-config list & layout animations |
| **Charts** | Recharts | v2.x | Responsive SVG data visualizations |
| **Toasts** | Sonner | Latest | Low-friction notification toasts |
| **Testing** | Vitest + Testing Library | Latest | Component unit testing & integration |

### 1.2 Dependency Management Rules

> [!IMPORTANT]
> **Zero Bloat Policy**: Never add external packages when shadcn/ui primitives, Radix headless components, or native Web APIs can achieve the same result. Every new dependency must justify its inclusion over existing stack capabilities.

- **Audit before adding**: Check if `@/components/ui/` already has a primitive that solves the need.
- **Prefer composition**: Compose existing shadcn/ui components over importing new libraries.
- **Peer dependency alignment**: Ensure all Radix packages share the same major version to avoid runtime conflicts.
- **Banned patterns**: No jQuery, no Bootstrap, no Material UI alongside shadcn/ui, no redundant utility libraries (moment.js when `Intl.DateTimeFormat` exists, lodash when native Array methods suffice).

---

## 2. Project Structure & File Organization

### 2.1 Canonical Directory Layout

```
project-root/
├── app/                          # Route pages & layouts
│   ├── globals.css               # Tailwind layers, CSS custom properties, typography
│   ├── layout.tsx                # Root layout (providers, global wrappers)
│   ├── page.tsx                  # Landing/entry page
│   ├── (shell-group)/            # Route groups with shared layout shells
│   │   ├── layout.tsx            # Shell-specific layout (header, nav, sidebar)
│   │   └── feature/
│   │       └── page.tsx          # Feature page
│   └── (admin)/                  # Admin/management layout shell
│       └── layout.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (button, card, dialog, tabs, etc.)
│   │   ├── button.tsx
│   │   ├── button.test.tsx       # Co-located unit tests for every primitive
│   │   ├── card.tsx
│   │   └── ...
│   ├── shared/                   # Cross-feature shared components (nav, header, sidebar)
│   ├── feature-a/                # Domain-specific components grouped by feature
│   ├── feature-b/
│   ├── providers/                # React context providers (auth, theme, deep-link, etc.)
│   └── dev/                      # Development/prototype tooling (role switcher, debug panels)
│
├── lib/
│   ├── utils.ts                  # cn() helper, formatters, date utilities
│   ├── i18n/                     # Translation dictionaries per locale
│   └── mock/                     # Seed JSON mock data files for zero-backend operation
│
├── stores/                       # Zustand state stores
│   ├── useAuthStore.ts
│   ├── useFeatureStore.ts
│   └── ...
│
├── types/                        # Shared TypeScript interfaces & type definitions
│   ├── auth.ts
│   ├── feature.ts
│   └── i18n.ts
│
├── public/                       # Static assets (favicon, manifest, SW)
├── tailwind.config.ts            # Tailwind design token extensions
├── tsconfig.json                 # TypeScript configuration (strict mode)
└── vite.config.ts                # Vite bundler configuration
```

### 2.2 File Organization Rules

1. **Co-location over separation**: Place test files alongside their source files (`button.tsx` → `button.test.tsx`).
2. **Feature-based grouping**: Group domain components by feature (`components/feed/`, `components/player/`), not by technical role (`components/modals/`, `components/forms/`).
3. **One component per file**: Each `.tsx` file should export a single primary component. Sub-components (e.g., `CardHeader`, `CardTitle`) may co-exist in the same file only if they form a compound component suite.
4. **Index exports**: Use `index.ts` barrel files sparingly — only at the `components/ui/` level if needed for bulk re-exports. Avoid deep barrel nesting that obscures import origins.
5. **Path aliases**: Always use `@/` prefix imports (`@/components/ui/button`, `@/lib/utils`, `@/stores/useAuthStore`). Never use relative `../../../` paths beyond one level.

---

## 3. Routing Architecture

### 3.1 Route Group Strategy

Use parenthesized route groups to create distinct layout shells without affecting URL paths:

```
app/
├── (pwa)/                        # Mobile-first PWA shell (bottom nav, sticky header)
│   ├── layout.tsx                # Shared mobile shell layout
│   └── feature/page.tsx
├── (admin)/                      # Desktop management shell (sidebar, breadcrumbs)
│   ├── layout.tsx                # Shared admin shell layout
│   └── dashboard/page.tsx
└── (standalone)/                 # Full-screen standalone pages (embeds, simulators)
    └── embed/page.tsx
```

### 3.2 Responsive Layout Architecture — 3-Column Desktop / Full-Screen Mobile

Adopt a 3-Column Desktop / Full-Screen Mobile layout pattern inspired by LinkedIn & Instagram Web:

| Viewport | Layout Behavior |
| :--- | :--- |
| **Desktop (≥ 1024px)** | Unified container (`max-w-6xl mx-auto`): Left sidebar (~260px) + Center content (`flex-1 max-w-[560px]`) + Right widget column (~300px) |
| **Tablet (768px–1023px)** | Center content + optional condensed sidebar; hide secondary widgets |
| **Mobile (< 768px)** | 100% full-screen canvas; sticky header + fixed bottom thumb navigation |

**Key Principles**:
- **Unified container width**: Same `max-w-*` container class across all routes within a shell group. No width jumping between pages.
- **Progressive disclosure**: Desktop shows all 3 columns; tablet collapses sidebars; mobile shows content only.
- **Sidebars use `hidden lg:block`**: Sidebars conditionally render via responsive utility classes, not JavaScript media queries.

### 3.3 Navigation Patterns

- **Mobile Bottom Navigation**: Fixed 64px thumb-zone bar with 4–5 primary destinations. Use Lucide icons with labels below. Touch targets ≥ 48px.
- **Desktop Sidebar Navigation**: 260px collapsible sidebar with grouped navigation sections and role-based visibility.
- **Scroll-Driven Header**: Top bar auto-hides on scroll-down (maximize content area) and re-appears on scroll-up (instant access).

---

## 4. State Management Architecture

### 4.1 Zustand Store Design Principles

```
┌─────────────────────────────────────────────────────────────────┐
│                     ZUSTAND STATE STORES                        │
├──────────────────┬──────────────────┬──────────────────┬────────┤
│  useAuthStore    │  useFeatureStore │  useAdminStore   │  ...   │
│  - Active User   │  - Domain Data   │  - Management    │        │
│  - Role/Perms    │  - User Actions  │  - Config Data   │        │
│  - Session State │  - CRUD Ops      │  - Workflows     │        │
└──────────────────┴──────────────────┴──────────────────┴────────┘
```

#### Store Design Rules:

1. **One store per domain**: Create separate stores per feature domain (`useFeedStore`, `useCourseStore`, `useOfflineStore`). Avoid monolithic god-stores.
2. **Typed interfaces for all state**: Every store slice must be defined with explicit TypeScript interfaces. No `any` types. No loose `Record<string, unknown>`.
3. **Actions co-located with state**: Store actions (mutations) live inside the store definition, not in separate action files.
4. **Selectors for derived state**: Use Zustand selectors (`useStore(state => state.computed)`) to avoid unnecessary re-renders. Never destructure entire store state.
5. **Persistence via IndexedDB**: Use `idb-keyval` for offline persistence. Hydrate store from IndexedDB on app load, write-through on mutations.
6. **Naming convention**: All store hooks follow `use[Domain]Store` pattern (e.g., `useAuthStore`, `useFeedStore`).

### 4.2 Zero-Backend Mock Store Contract

> [!IMPORTANT]
> **During prototype/phase-1 development**: All data flows through typed Zustand stores seeded from `lib/mock/*.json`. UI components MUST query state exclusively from the store layer. When transitioning to a live backend, only the store's data-fetching logic changes — **zero component code changes required**.

**Data Flow Pattern**:
```
lib/mock/data.json  →  stores/useFeatureStore.ts  →  components/Feature.tsx
                         (seed on init)               (reads from store only)
```

- Never write `fetch()` or API calls directly in components.
- Never pass raw JSON data as props — always route through the store.
- All mock data JSON must conform to the same TypeScript interfaces (`types/*.ts`) that production APIs will serve.

### 4.3 Mock Data Quality Standards

- Mock data must be **realistic and domain-accurate** (real names, real locations, plausible values).
- Include edge cases: empty arrays, maximum-length strings, RTL text samples, special characters, null-adjacent values.
- Every mock JSON file must have a corresponding TypeScript type it conforms to.

---

## 5. Offline-First PWA Architecture

### 5.1 PWA Requirements

- **Service Worker**: Register a service worker for asset caching and offline fallback pages.
- **Web App Manifest**: Include proper `manifest.json` with app name, icons (192px + 512px), theme color, background color, and `display: "standalone"`.
- **iOS Safe Area**: Handle notch and home indicator with `env(safe-area-inset-*)` CSS utilities.

### 5.2 Offline State Management

- **Sync status tracking**: Every data mutation that would normally hit a backend must track `isSynced: boolean` in the store.
- **Optimistic UI**: Apply mutations immediately to local state; queue sync operations for when connectivity returns.
- **Visual offline indicators**: Show clear, non-intrusive banners or badges when the app is operating in offline mode.
- **Content filtering**: When offline, automatically filter views to show only locally-cached or downloaded content.

---

## 6. Deep-Linking & URL Parameter Contracts

### 6.1 URL Parameter Schema

Support tokenized deep-links for seamless entry from external surfaces (chatbots, notifications, QR codes, emails):

```
https://app.example.com/feature/resource-id
  ?auth_token=simulated_token
  &role=user_role
  &lang=language_code
  &source=entry_source
  &context_id=additional_context
```

### 6.2 Auto-Hydration Flow

1. On page load, a `DeepLinkProvider` component intercepts URL search parameters.
2. Auto-hydrates relevant stores (`useAuthStore`, `useLanguageStore`).
3. Displays a brief welcome toast confirming context restoration.
4. Navigates user directly to the target resource without friction.

---

## 7. Build & Tooling Configuration

### 7.1 TypeScript Configuration Standards

```jsonc
{
  "compilerOptions": {
    "strict": true,                    // Always strict mode
    "noUncheckedIndexedAccess": true,  // Safety for array/object access
    "noUnusedLocals": true,            // Clean code enforcement
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./*"]                   // Root-relative path aliases
    }
  }
}
```

### 7.2 Vite Configuration Essentials

- **Path aliases**: Map `@/` to source root.
- **React plugin**: Use `@vitejs/plugin-react` for Fast Refresh.
- **PWA plugin**: Use `vite-plugin-pwa` for service worker generation.
- **Environment variables**: Use `.env` files with `VITE_` prefix for client-exposed variables. Never expose secrets.

### 7.3 Testing Configuration

- **Framework**: Vitest (native Vite integration, fast execution).
- **DOM environment**: jsdom for component rendering.
- **Testing utilities**: `@testing-library/react` + `@testing-library/user-event`.
- **Test files**: Co-located with source (`*.test.tsx` alongside `*.tsx`).
- **Pre-commit requirement**: All tests must pass before merging. Run `npm test` after every component change.
- **Coverage target**: 100% passing for `@/components/ui/` primitives.

---

## 8. Platform-Native Adaptive UI

### 8.1 Platform Detection & Adaptive Styling

| Platform | UI Treatment |
| :--- | :--- |
| **iOS** | Glassmorphism (`backdrop-blur-md bg-background/80`), rounded floating bottom nav, safe area padding |
| **Android** | Material Design 3 flat containers, anchored flush bottom nav, ink ripple feedback |
| **Desktop** | Full 3-column layout, hover states, keyboard shortcuts (`Cmd+K` / `Ctrl+K`) |

### 8.2 Safe Area & Ergonomic Utilities

```css
/* iOS Safe Area Utilities */
.pt-safe { padding-top: env(safe-area-inset-top, 0px); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.pt-safe-header { padding-top: calc(env(safe-area-inset-top, 0px) + 0.625rem); }
.pt-safe-modal { padding-top: calc(env(safe-area-inset-top, 0px) + 1.25rem); }

/* Touch Target Accessibility */
.touch-target { min-height: 48px; min-width: 48px; }

/* Scrollbar Hiding (Cross-Browser) */
.scrollbar-none::-webkit-scrollbar { display: none !important; }
.scrollbar-none { scrollbar-width: none !important; }
```

---

*End of Architecture Principles Document*
