# AI Agent Operating Standards & Development Workflow

**Project**: AEGIS — Autonomous Engineering Graph & Intelligence System  
**Scope**: Operating standards for AI coding assistants working on the AEGIS project (React + TypeScript + Tailwind CSS + shadcn/ui frontend, Python + FastAPI backend, Neo4j Knowledge Graph).  
**Purpose**: Establish strict behavioral rules, quality gates, and workflow discipline to prevent recurring design/component errors and ensure consistent, high-quality output across all sessions.  
**Applicability**: Every AI assistant session, every developer interaction, every feature implementation.

---

## 0. Project Knowledge Base — Mandatory Reading

> [!IMPORTANT]
> **AEGIS has a comprehensive documentation suite.** AI agents MUST read the relevant documents before writing any code. Skipping this step leads to incorrect technology choices, misaligned architecture, and wasted effort.

### 0.1 Project-Level Documents

These documents define **what AEGIS is**, its architecture, and its approved technology choices. Read these before any task that touches system design, backend, infrastructure, or technology selection.

| # | Document | Location | What It Covers |
|:---|:---|:---|:---|
| **P1** | [AEGIS Major Project Proposal](./AEGIS-Major-Project-Proposal.md) | `./AEGIS-Major-Project-Proposal.md` | Problem statement, research gap, objectives, AEGIS Loop (Predict → Deploy → Monitor → Diagnose → Heal → Learn), system architecture layers, core modules, functional requirements, evaluation plan, work phases. |
| **P2** | [AEGIS Tech Stack Document](./AEGIS_Tech_Stack_Document.md) | `./AEGIS_Tech_Stack_Document.md` | Complete 7-layer technology stack with version policies, selection rationale for every technology, graph schema (54 nodes, 142 edges), AI agent tool-calling architecture, observability stack, infrastructure & DevOps tooling, integration data flow diagrams. |
| **P3** | [AEGIS Review 2 Prototype Spec](./AEGIS_Major_Project_Review_2_Prototype.html) | `./AEGIS_Major_Project_Review_2_Prototype.html` | Interactive prototype specification, dashboard layout (4-module topology), dual-mode intelligence panel design, live demonstration script, KPI metrics, and evaluation benchmarks. |

### 0.2 Frontend Design & Standards Documents

These documents define **how to build the UI**. Read these before any frontend/UI implementation task.

| # | Document | Location | What It Covers |
|:---|:---|:---|:---|
| **D1** | [Architecture Principles](./design-principals/01-ARCHITECTURE.md) | `design-principals/01-ARCHITECTURE.md` | Core stack matrix (React, TypeScript, Vite, Tailwind, shadcn/ui, Zustand), folder structure, routing architecture, state management patterns, offline-first PWA, deep-linking, build tooling. |
| **D2** | [Design System](./design-principals/02-DESIGN-SYSTEM.md) | `design-principals/02-DESIGN-SYSTEM.md` | Color tokens (HSL CSS vars), typography hierarchy, spacing scale, border radius, shadows, animations, touch targets, RTL/i18n rules, responsive breakpoints. |
| **D3** | [UI Components](./design-principals/03-UI-COMPONENTS.md) | `design-principals/03-UI-COMPONENTS.md` | shadcn/ui component specs (Button, Badge, Card, Dialog, Tabs, etc.), anti-hallucination rules, `cn()` utility, variant/size patterns, testing requirements, icon & toast standards. |
| **D4** | [Agent Standards](./Agents.md) (this file) | `./Agents.md` | AI agent behavioral rules (DO/DON'T), development workflow, quality gate checklist, work logging, documentation sync, common mistakes. |

### 0.3 Reading Priority by Task Type

| Task Type | Must Read | Reference As Needed |
|:---|:---|:---|
| **Any task (always)** | This file (`Agents.md`) | — |
| **UI / Frontend work** | D1, D2, D3, P2 (§2 Frontend) | P3 (prototype layout reference) |
| **Backend / API work** | P1 (§5 Architecture), P2 (§3 Backend, §4 Graph, §5 AI) | D1 (API contract conventions) |
| **Graph / Neo4j work** | P1 (§4 AEGIS Loop), P2 (§4 Knowledge Graph) | P3 (graph schema in prototype) |
| **AI Agent / LLM work** | P1 (§3 Research Gap), P2 (§5 AI & Reasoning) | P2 (§10 Integration flows) |
| **Infrastructure / DevOps** | P2 (§7 Infrastructure) | P1 (§10 Sandbox setup) |
| **Architecture decisions** | P1 (full document), P2 (full document) | D1 (frontend architecture) |
| **New technology proposal** | P2 (§9 Dependency Map, §11 Version Policy) | P1 (§8 Technology Stack) |

---

## 1. Mandatory Pre-Work Checklist

> [!IMPORTANT]
> **Before writing a single line of code**, the AI assistant MUST complete ALL of the following steps. Skipping any step is a quality violation.

### 1.1 Read the Standards Documents

On **every** prompt, read the applicable project and design documents as defined in **§0.3 Reading Priority by Task Type** above.

For UI-related prompts specifically, read these design documents in order:

1. **[`AEGIS_Tech_Stack_Document.md`](./AEGIS_Tech_Stack_Document.md)** — Confirm the approved technologies, versions, and selection rationale before choosing any tool or library.
2. **[`01-ARCHITECTURE.md`](./design-principals/01-ARCHITECTURE.md)** — Understand the tech stack conventions, folder structure, state management patterns, and routing architecture.
3. **[`02-DESIGN-SYSTEM.md`](./design-principals/02-DESIGN-SYSTEM.md)** — Review color tokens, typography hierarchy, spacing scale, radius system, touch targets, RTL rules, and responsive breakpoints.
4. **[`03-UI-COMPONENTS.md`](./design-principals/03-UI-COMPONENTS.md)** — Check the component mapping table, variant specs, and anti-hallucination rules.
5. **This file (`Agents.md`)** — Follow the workflow, quality gates, and behavioral constraints.

### 1.2 Identify Affected Layers

For every task, determine which layers are impacted:

| Layer | Directory | When Affected |
| :--- | :--- | :--- |
| **Routes & Layouts** | `app/` | Adding pages, modifying navigation, changing shell layouts |
| **UI Primitives** | `components/ui/` | Adding or modifying base components |
| **Domain Components** | `components/[feature]/` | Building feature-specific UIs |
| **Shared Components** | `components/shared/` | Cross-feature header, nav, sidebar changes |
| **State Stores** | `stores/` | Adding state, modifying actions, changing data contracts |
| **Type Definitions** | `types/` | Any data model change |
| **Translations** | `lib/i18n/` | Any user-facing string addition or change |
| **Mock Data** | `lib/mock/` | Any state structure change requiring new seed data |
| **Dev Tools** | `components/dev/` | Prototype toolbar, role switcher changes |
| **Styling** | `app/globals.css`, `tailwind.config.ts` | Design token additions, new utility classes |

### 1.3 Verify Type Contracts

Before modifying any component or store:
- Confirm TypeScript interfaces in `types/*.ts` remain consistent.
- If a new data shape is needed, define the interface in `types/` first, then implement.
- Never use `any`, `unknown` (without narrowing), or untyped `Record<string, unknown>` in component props.

### 1.4 Confirm Scope

- Verify the requested feature or change is within the current development phase scope.
- If the request exceeds scope, explicitly flag it to the user before proceeding.
- Never silently add scope that wasn't requested.

---

## 2. Strict Behavioral Rules

### 2.1 DO (Always)

- ✅ **Use design tokens**: All colors via `bg-primary`, `text-secondary-foreground`, etc. All radii via `rounded-xl`, `rounded-2xl`. All fonts via `font-heading`, `font-sans`.
- ✅ **Use shadcn/ui primitives**: Button, Badge, Card, Dialog, Tabs, Input, Select, Progress, Avatar, Checkbox, Table — always from `@/components/ui/`.
- ✅ **Apply `cn()` for class merging**: Never concatenate Tailwind classes with template literals. Always use `cn()`.
- ✅ **Apply `active:scale-95 transition-all`**: On every clickable button and trigger.
- ✅ **Apply `touch-target`**: Ensure 48px minimum on all interactive elements.
- ✅ **Apply responsive sizing**: `text-xs sm:text-sm` for body, `text-base sm:text-lg` for titles.
- ✅ **Apply `font-heading font-bold`**: On all button labels, card titles, and section headers.
- ✅ **Use Lucide React icons**: From `lucide-react` import. Never use FontAwesome, Heroicons, or inline SVGs.
- ✅ **Use Sonner toasts**: `toast()` / `toast.success()` / `toast.error()`. Never `window.alert()`.
- ✅ **Route data through stores**: Components read from Zustand stores only. Never `fetch()` in components.
- ✅ **Write co-located tests**: Every new `@/components/ui/*.tsx` needs a `*.test.tsx` alongside it.
- ✅ **Use `@/` path aliases**: Always. No `../../../` deep relative imports.
- ✅ **Use logical CSS properties for RTL**: `ms-auto` not `ml-auto`, `me-2` not `mr-2`, `ps-4` not `pl-4`.
- ✅ **Include ARIA attributes**: `aria-label` on icon buttons, `role="progressbar"` on progress, semantic HTML elements.

### 2.2 DON'T (Never)

- ❌ **Hardcode hex/rgb colors**: Never `bg-[#fdb405]` or `text-[#787878]`. Use semantic tokens.
- ❌ **Use arbitrary Tailwind colors**: Never `bg-blue-500`, `text-gray-400`. Use project tokens.
- ❌ **Build custom wrappers**: Never create ad-hoc `<div className="...">` replacements for existing primitives.
- ❌ **Use raw HTML controls**: Never `<input>`, `<select>`, `<textarea>`, `<button>`, `<table>`, `<input type="checkbox">` without the shadcn/ui wrapper.
- ❌ **Use inline styles**: Never `style={{ ... }}` unless absolutely required for dynamic values (e.g., `translateX` in Progress). Document exceptions.
- ❌ **Add unnecessary dependencies**: Never add npm packages when existing stack handles the use case.
- ❌ **Hardcode user-facing strings**: Never write English text directly in JSX. All strings go through i18n dictionary keys.
- ❌ **Write `fetch()` in components**: Never make API calls directly in UI components. Route through stores.
- ❌ **Break existing contracts**: Never modify TypeScript interfaces in `types/` without updating all consumers.
- ❌ **Introduce backend dependencies in prototype phase**: Never add real API endpoints, database connections, or authentication flows during frontend prototyping.
- ❌ **Leave dead routes**: Never create routes without at least a placeholder/fallback component.
- ❌ **Introduce scope creep**: Never add features, layout changes, or design modifications that weren't explicitly requested.
- ❌ **Skip tests**: Never mark UI work complete without running `npm test`.
- ❌ **Use moment.js**: Use `Intl.DateTimeFormat` or native `Date` methods.
- ❌ **Use lodash/underscore**: Use native Array/Object methods (`.map`, `.filter`, `.reduce`, `Object.entries`, etc.).

---

## 3. Development Workflow

### 3.1 Phase 1: Plan

```
User Request → Read Standards → Identify Layers → Verify Types → Confirm Scope
```

1. Read the user's request completely.
2. Review all 4 standards documents.
3. Map the request to affected layers (see §1.2).
4. Check existing types and components for reuse opportunities.
5. Outline the implementation plan (which files to create/modify).

### 3.2 Phase 2: Implement

```
Types → Store → Component → Tests → Integration
```

1. **Types first**: Define or verify TypeScript interfaces in `types/`.
2. **Store updates**: Add or modify Zustand store slices, actions, and selectors.
3. **Component implementation**: Build using shadcn/ui primitives, design tokens, and `cn()`.
4. **Test writing**: Create co-located test files for new components.
5. **Integration**: Wire components into routes, ensure store hydration works.

### 3.3 Phase 3: Verify

```
TypeScript Compile → Unit Tests → Visual Verification → Cross-Check
```

1. **Clean compilation**: `npx tsc --noEmit` must pass with zero errors.
2. **Unit tests**: `npm test` must pass with 100% success.
3. **Visual verification**: Check rendering at 375px, 390px, 1024px, 1280px.
4. **RTL verification**: If touching any user-facing text, verify Urdu/RTL rendering.
5. **Cross-role verification**: If feature is role-dependent, verify across all applicable roles.
6. **Accessibility check**: Verify ARIA attributes, touch targets, contrast ratios.

---

## 4. End-to-End Change Rules

> [!WARNING]
> **Every UI change must be evaluated across ALL frontend tiers.** Partial or half-wired implementations must NEVER be marked complete.

### 4.1 Change Impact Matrix

For every change, verify each applicable layer:

- [ ] **Routes (`app/`)**: Page routing, layouts, navigation paths
- [ ] **UI Primitives (`components/ui/`)**: Reusable component changes
- [ ] **Domain Components (`components/[feature]/`)**: Feature-specific UI
- [ ] **Shared Components (`components/shared/`)**: Cross-feature shared UI
- [ ] **State Stores (`stores/`)**: Zustand actions, selectors, persistence
- [ ] **Type Definitions (`types/`)**: Interface consistency
- [ ] **Translations (`lib/i18n/`)**: All supported language dictionaries
- [ ] **Mock Data (`lib/mock/`)**: Seed data accuracy and completeness
- [ ] **Dev Tools (`components/dev/`)**: Prototype toolbar synchronization
- [ ] **Documentation**: Standards docs updated if new patterns established
- [ ] **Tests**: All affected component tests pass

### 4.2 Cross-Cutting Concerns

Every feature change must consider:

1. **Multi-language rendering**: Does it work in all supported languages?
2. **RTL layout**: Does it render correctly when `dir="rtl"` is active?
3. **Multi-role access**: Does it respect role-based visibility and permissions?
4. **Offline state**: Does it degrade gracefully without network connectivity?
5. **Mobile ergonomics**: Are touch targets ≥ 48px? Are CTAs in the thumb zone?
6. **Dark mode**: Does it render correctly in both light and dark themes?

---

## 5. Code Quality Standards

### 5.1 TypeScript Strictness

- **Strict mode always**: `"strict": true` in `tsconfig.json`.
- **No `any`**: Never use `any` type. Use `unknown` with proper type narrowing if needed.
- **Explicit return types**: Functions that return complex types should have explicit return type annotations.
- **Interface over type** for object shapes: Use `interface` for component props and data models.
- **Enum vs union**: Prefer string union types (`"a" | "b" | "c"`) over TypeScript enums.

### 5.2 Component Code Organization

Every component file should follow this structure:

```tsx
// 1. Imports
import React from "react";
import { cn } from "@/lib/utils";

// 2. Type definitions
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary";
}

// 3. Component implementation
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // 4. Internal logic (hooks, derived state)
    
    // 5. Render
    return (
      <element
        ref={ref}
        className={cn("base-classes", variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

// 6. Display name
Component.displayName = "Component";
```

### 5.3 Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| Component files | `kebab-case.tsx` | `dropdown-menu.tsx` |
| Component names | `PascalCase` | `DropdownMenu` |
| Store hooks | `use[Domain]Store` | `useFeedStore` |
| Type files | `kebab-case.ts` | `feed.ts` |
| Interface names | `PascalCase` | `FeedPost` |
| CSS variables | `--kebab-case` | `--primary-foreground` |
| Translation keys | `camelCase` nested | `feed.likeCount` |
| Mock data files | `camelCase.json` | `feedItems.json` |
| Test files | `[component].test.tsx` | `button.test.tsx` |

---

## 6. Quality Gate Checklist

> [!IMPORTANT]
> Before considering ANY task complete, verify EVERY applicable item:

### 6.1 Functional Quality

- [ ] Requirements fully match the user's request — nothing more, nothing less.
- [ ] No TypeScript compilation errors (`npx tsc --noEmit`).
- [ ] All unit tests pass (`npm test`).
- [ ] No runtime crashes or console errors.
- [ ] All interactive elements respond correctly to user actions.

### 6.2 Design Quality

- [ ] All colors use semantic design tokens (no hardcoded values).
- [ ] Typography follows the font hierarchy (`font-heading` for titles, `font-sans` for body).
- [ ] Border radii follow the scale (`rounded-xl` for controls, `rounded-2xl` for cards).
- [ ] Touch targets ≥ 48px on all interactive elements.
- [ ] `active:scale-95 transition-all` on all clickable elements.
- [ ] Responsive sizing applied (`text-xs sm:text-sm` pattern).

### 6.3 Component Quality

- [ ] All UI uses shadcn/ui primitives — zero hallucinated components.
- [ ] `cn()` used for all class composition.
- [ ] `forwardRef` pattern used where applicable.
- [ ] No raw HTML form controls (`<input>`, `<select>`, `<button>` without wrapper).

### 6.4 Accessibility Quality

- [ ] ARIA labels on all icon-only buttons.
- [ ] Semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`).
- [ ] Proper heading hierarchy (single `<h1>`, sequential `<h2>` → `<h3>`).
- [ ] Keyboard navigation works (Tab, Enter, Escape).
- [ ] Color contrast meets WCAG AA standards.

### 6.5 Architecture Quality

- [ ] No `any` types in new code.
- [ ] State routed through Zustand stores (no direct `fetch` in components).
- [ ] All user-facing strings use i18n dictionary keys.
- [ ] All mock data conforms to TypeScript interfaces in `types/`.
- [ ] `@/` path aliases used for all imports.

### 6.6 Cross-Cutting Quality

- [ ] Renders correctly in RTL mode (Urdu/Arabic).
- [ ] Renders correctly across all supported user roles.
- [ ] Works in offline mode (graceful degradation).
- [ ] Responsive fidelity verified at 375px, 390px, 1024px, 1280px+.
- [ ] Dark mode rendering verified (if dark mode is enabled).

---

## 7. Work Logging Standards

### 7.1 Mandatory Work Log

For every task executed, maintain a `work.md` log with:

- **Task Number & Title**: Sequential numbering with descriptive title.
- **Execution Date & Timestamp**: Full date with timezone (e.g., `Date: 27th September 2026 | Time: 02:30 IST`).
- **Key Actions & Deliverables**: 2–3 bullet points summarizing what was done and which files were created/modified.

### 7.2 Work Log Rules

- **No summary tables**: Individual task blocks only.
- **No user prompt quotes**: Omit raw request text.
- **Concise entries**: High-level actions, not line-by-line code descriptions.
- **Never skip**: Every completed task must have a `work.md` entry before the session ends.

### 7.3 Template

```markdown
---

### Task #[N] — [Descriptive Title]

**Date**: [Day] [Month] [Year] | **Time**: [HH:MM] [TZ]

**Key Actions**:
- [Action 1: what was done, which files affected]
- [Action 2: what was done, which files affected]
- [Action 3: what was done, which files affected]
```

---

## 8. Documentation Synchronization

### 8.1 Living Document Updates

When any of the following changes during development, the corresponding standards document(s) MUST be updated synchronously:

| Change Type | Documents to Update |
| :--- | :--- |
| New design token or color | `02-DESIGN-SYSTEM.md`, `globals.css`, `tailwind.config.ts` |
| New UI primitive component | `03-UI-COMPONENTS.md` (add spec) |
| New component variant | `03-UI-COMPONENTS.md` (update variant table) |
| New layout pattern | `01-ARCHITECTURE.md` (routing/layout section) |
| New state store | `01-ARCHITECTURE.md` (state management section) |
| New accessibility rule | `02-DESIGN-SYSTEM.md` (accessibility section) |
| New animation pattern | `02-DESIGN-SYSTEM.md` (animation section) |
| New RTL/i18n rule | `02-DESIGN-SYSTEM.md` (multilingual section) |

### 8.2 Issue-Based Development

- All tasks must trace back to a documented issue or user request.
- Blueprint/standards issues should remain open as living documents throughout the project lifecycle.
- Any architectural decision that deviates from these standards must be documented with rationale.

---

## 9. Common Mistakes & How to Avoid Them

### 9.1 Top 10 Recurring Errors

| # | Error | Why It Happens | Prevention |
| :--- | :--- | :--- | :--- |
| 1 | Hardcoded hex colors | Forgetting design tokens exist | Always search `02-DESIGN-SYSTEM.md` first |
| 2 | Raw `<button>` instead of `<Button>` | AI hallucination or habit | Consult component mapping table in `03-UI-COMPONENTS.md` §1.1 |
| 3 | Missing `active:scale-95` on buttons | Forgetting micro-interaction rule | Part of Button base class — never remove |
| 4 | Touch targets < 48px | Not testing on mobile | Apply `.touch-target` class or `min-h-[48px]` |
| 5 | Hardcoded English strings | Quick prototyping temptation | Always use i18n dictionary keys |
| 6 | `ml-auto` instead of `ms-auto` | Not thinking about RTL | Use logical CSS properties always |
| 7 | Missing test file for new component | Rushing to completion | Create `.test.tsx` immediately after `.tsx` |
| 8 | Fetching data in components | Bypassing store architecture | Data flows: mock → store → component |
| 9 | Adding unnecessary npm packages | Not checking existing capabilities | Audit shadcn/ui + Radix + native APIs first |
| 10 | Scope creep (extra features) | Anticipating user needs | Only implement what was explicitly requested |

### 9.2 Self-Review Prompt

Before submitting any work, ask yourself:

1. "Did I use design tokens for every visual property?"
2. "Is every interactive element using a shadcn/ui primitive?"
3. "Would this work in RTL mode without changes?"
4. "Can a user with a budget phone use this comfortably?"
5. "Did I run the tests?"

---

*End of AI Agent Operating Standards Document*
