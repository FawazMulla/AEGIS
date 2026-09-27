# Design Principals — Quick Reference Index

> Project-agnostic frontend design, architecture, and AI agent operating standards.  
> Read these documents before every development session to prevent recurring errors.

---

## Documents

| # | Document | What It Covers | When to Read |
| :--- | :--- | :--- | :--- |
| **01** | [ARCHITECTURE.md](./01-ARCHITECTURE.md) | Tech stack, folder structure, routing, state management (Zustand), offline-first PWA, deep-linking, build tooling | Starting a project, adding routes, modifying state, changing folder structure |
| **02** | [DESIGN-SYSTEM.md](./02-DESIGN-SYSTEM.md) | Color tokens (HSL CSS vars), typography hierarchy, spacing scale, border radius, shadows, animations, touch targets, RTL/i18n, responsive breakpoints | Any visual/styling work, adding colors, changing fonts, accessibility review |
| **03** | [UI-COMPONENTS.md](./03-UI-COMPONENTS.md) | shadcn/ui component specs (Button, Badge, Card, Dialog, Tabs, etc.), anti-hallucination rules, `cn()` utility, variant/size patterns, testing requirements, icon & toast standards | Every UI implementation — **mandatory read before writing components** |
| **04** | [AGENT-STANDARDS.md](./04-AGENT-STANDARDS.md) | AI agent behavioral rules (DO/DON'T), development workflow (Plan → Implement → Verify), quality gate checklist, work logging, documentation sync, top 10 common mistakes | Every session start, before marking tasks complete |

---

## Quick Usage

### For AI Assistants

Add this to your project's `AGENTS.md` or `.agents/rules/`:

```markdown
> [!IMPORTANT]
> Before any UI implementation, read the 4 design principal documents in `design-principals/`:
> 1. `01-ARCHITECTURE.md` — Stack, structure, state, routing
> 2. `02-DESIGN-SYSTEM.md` — Tokens, typography, spacing, accessibility
> 3. `03-UI-COMPONENTS.md` — Component specs, anti-hallucination rules
> 4. `04-AGENT-STANDARDS.md` — Workflow, quality gates, behavioral rules
```

### For Developers

These documents serve as the single source of truth for:
- Which components to use (and which to avoid)
- How to style elements (tokens, not hardcoded values)
- How to structure state and data flow
- Minimum accessibility and ergonomic requirements
- Testing and quality standards

---

## Key Principles at a Glance

1. **shadcn/ui primitives only** — No custom HTML wrappers when a primitive exists
2. **Design tokens only** — No hardcoded hex/rgb colors, use semantic CSS variables
3. **`cn()` for classes** — Never concatenate Tailwind strings manually
4. **48px touch targets** — Every interactive element, no exceptions
5. **Store → Component** — Data flows through Zustand, never `fetch()` in components
6. **i18n dictionary keys** — No hardcoded English strings in JSX
7. **RTL-safe** — Use `ms-`/`me-`/`ps-`/`pe-` instead of `ml-`/`mr-`/`pl-`/`pr-`
8. **Test everything** — `npm test` must pass before any task is complete
9. **Mobile-first responsive** — Write `text-xs sm:text-sm`, not `text-sm xs:text-xs`
10. **No scope creep** — Only build what was explicitly requested

---

*Last updated: 27th September 2026*
