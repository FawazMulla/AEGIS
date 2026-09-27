# Design System & Visual Standards

**Scope**: Project-agnostic design system tokens, typography, color palettes, spacing, radius, and visual interaction standards for Tailwind CSS + shadcn/ui applications.  
**Applicability**: All mobile-first, accessibility-conscious web applications built by this team.

---

## 1. Design Philosophy

### 1.1 Core Design Tenets

1. **Civic Dignity & Accessibility First**: Design for the lowest-resource user — small screens, direct sunlight, low literacy, slow networks. Every design decision must pass the test: "Does this work for someone using a budget phone in bright daylight?"
2. **High Contrast & Readability**: Use color pairings that exceed WCAG AA contrast ratios. Avoid subtle gray-on-white for body text.
3. **Touch-First Ergonomics**: Every interactive element must be comfortably tappable with a thumb. Bottom-of-screen placement for primary actions.
4. **Consistency Over Creativity**: Use design tokens religiously. No hardcoded colors, font sizes, or spacing values. All visual properties flow from CSS custom properties.
5. **Progressive Enhancement**: The app must be fully functional without animations, custom fonts, or JavaScript enhancements. These layers enhance — they don't gatekeep.

---

## 2. Color System

### 2.1 Semantic Color Token Architecture

All colors are defined as HSL CSS custom properties in `globals.css` and consumed through Tailwind semantic classes. **Never use raw hex/rgb values in component code**.

#### Light Mode Token Definitions:

```css
@layer base {
  :root {
    /* === Brand & Action Colors === */
    --primary: <H> <S>% <L>%;            /* Main CTA, brand focus, ring highlights */
    --primary-foreground: <H> <S>% <L>%; /* Text on primary backgrounds */

    --secondary: <H> <S>% <L>%;          /* Secondary actions, header accents */
    --secondary-foreground: <H> <S>% <L>%;

    --tertiary: <H> <S>% <L>%;           /* Navigation highlights, badges, accents */
    --tertiary-foreground: <H> <S>% <L>%;

    /* === Semantic State Colors === */
    --success: 142 76% 36%;               /* Completion, health, positive states */
    --success-foreground: 0 0% 100%;

    --destructive: 0 84.2% 60.2%;         /* Errors, deletions, alerts */
    --destructive-foreground: 210 40% 98%;

    /* === Surface & Layout Colors === */
    --background: 0 0% 100%;              /* Page background */
    --foreground: 222 47% 11%;            /* Primary text */

    --card: 0 0% 100%;                    /* Card surface */
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;                 /* Popover/dropdown surface */
    --popover-foreground: 222 47% 11%;

    --muted: 210 20% 96%;                 /* Muted backgrounds, disabled areas */
    --muted-foreground: 0 0% 47%;         /* Secondary text, captions */

    /* === Structural Colors === */
    --border: 214.3 31.8% 91.4%;          /* Borders, dividers */
    --input: 214.3 31.8% 91.4%;           /* Input field borders */
    --ring: <same-as-primary>;            /* Focus ring color (matches primary) */
    --accent: <same-as-primary>;          /* Hover/active accent */
    --accent-foreground: <match-primary-fg>;

    /* === Layout & Interaction === */
    --radius: 0.75rem;                    /* Base border radius (12px) */
  }
}
```

#### Dark Mode Token Overrides:

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 222 47% 13%;
  --card-foreground: 210 40% 98%;
  --primary: <H> <S>% <L+5>%;       /* Slightly brighter for dark backgrounds */
  --secondary: <H> <S>% <L-5>%;     /* Slightly darker to maintain contrast */
  --border: 217 33% 20%;
  --input: 217 33% 20%;
}
```

### 2.2 Tailwind Color Consumption Rules

| Semantic Intent | Tailwind Classes | CSS Variable |
| :--- | :--- | :--- |
| **Primary CTA Background** | `bg-primary text-primary-foreground` | `--primary` |
| **Secondary Action** | `bg-secondary text-secondary-foreground` | `--secondary` |
| **Accent/Tertiary Badge** | `bg-tertiary text-tertiary-foreground` | `--tertiary` |
| **Success State** | `bg-success text-success-foreground` | `--success` |
| **Error/Destructive** | `bg-destructive text-destructive-foreground` | `--destructive` |
| **Card Surface** | `bg-card text-card-foreground` | `--card` |
| **Muted/Disabled** | `bg-muted text-muted-foreground` | `--muted` |
| **Page Background** | `bg-background text-foreground` | `--background` |
| **Borders** | `border-border` | `--border` |
| **Focus Ring** | `ring-ring` | `--ring` |

> [!CAUTION]
> **PROHIBITED**: Hardcoded hex values (`bg-[#fdb405]`), arbitrary Tailwind color scales (`bg-blue-500`), or inline CSS color properties (`style={{ color: '#787878' }}`). ALL colors must flow through semantic tokens.

### 2.3 Tailwind Config Color Extension

```typescript
// tailwind.config.ts
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  tertiary: {
    DEFAULT: "hsl(var(--tertiary))",
    foreground: "hsl(var(--tertiary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
}
```

---

## 3. Typography System

### 3.1 Font Hierarchy

| Tier | Font Family | CSS Variable / Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Headlines)** | Google `Quicksand` (or equivalent rounded display) | `var(--font-quicksand)` / `font-heading` | Page titles, section headers, hero cards, button labels |
| **Secondary (Body)** | Google `Nunito Sans` (or equivalent clean sans) | `var(--font-nunito)` / `font-sans` | Body text, article content, feed text, form inputs, descriptions |
| **Tertiary (System UI)** | System Sans-Serif stack | System default | Micro-captions, dense metadata, badges, timestamps, fallback |
| **Regional (Devanagari)** | `Noto Sans Devanagari` | `var(--font-devanagari)` / `font-devanagari` | Hindi & Marathi script rendering |
| **Regional (Arabic/Urdu)** | `Noto Nastaliq Urdu` / `Noto Naskh Arabic` | `var(--font-urdu)` / `font-urdu` | Urdu RTL script rendering |

### 3.2 Font Registration in CSS

```css
@layer base {
  :root {
    --font-quicksand: 'Quicksand', sans-serif;
    --font-nunito: 'Nunito Sans', sans-serif;
    --font-devanagari: 'Noto Sans Devanagari', sans-serif;
    --font-urdu: 'Noto Naskh Arabic', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-quicksand), "Quicksand", sans-serif;
  }

  body {
    font-family: var(--font-nunito), "Nunito Sans", sans-serif;
  }
}
```

### 3.3 Tailwind Font Family Extension

```typescript
// tailwind.config.ts
fontFamily: {
  heading: ["var(--font-quicksand)", "Quicksand", "sans-serif"],
  sans: ["var(--font-nunito)", "Nunito Sans", "sans-serif"],
  devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
  urdu: ["var(--font-urdu)", "Noto Nastaliq Urdu", "Gulzar", "sans-serif"],
},
```

### 3.4 Typography Scale

Use Tailwind's built-in size scale with responsive prefixes for mobile-first sizing:

| Element | Mobile (`< 640px`) | Desktop (`≥ 640px`) | Weight | Font |
| :--- | :--- | :--- | :--- | :--- |
| Page Title (`h1`) | `text-xl` (20px) | `sm:text-2xl` (24px) | `font-bold` | `font-heading` |
| Section Header (`h2`) | `text-lg` (18px) | `sm:text-xl` (20px) | `font-bold` | `font-heading` |
| Card Title (`h3`) | `text-base` (16px) | `sm:text-lg` (18px) | `font-bold` | `font-heading` |
| Body Text | `text-xs` (12px) | `sm:text-sm` (14px) | `font-normal` | `font-sans` |
| Caption / Metadata | `text-xs` (12px) | `text-xs` (12px) | `font-medium` | `font-sans` |
| Badge / Pill | `text-xs` (12px) | `text-xs` (12px) | `font-semibold` | `font-sans` |

> [!TIP]
> Always use responsive text sizing (`text-xs sm:text-sm`) rather than fixed sizes. This ensures readability on small devices while utilizing space on larger screens.

---

## 4. Spacing & Layout System

### 4.1 Spacing Scale

Follow Tailwind's 4px base unit spacing scale consistently:

| Spacing Token | Value | Common Usage |
| :--- | :--- | :--- |
| `p-1` / `gap-1` | 4px | Tight element spacing within badges, pills |
| `p-2` / `gap-2` | 8px | Icon-to-text gaps, compact list spacing |
| `p-3` / `gap-3` | 12px | Input padding, small card internal spacing |
| `p-4` / `gap-4` | 16px | Standard card padding, section gaps |
| `p-6` / `gap-6` | 24px | Desktop card padding, major section separation |
| `p-8` / `gap-8` | 32px | Page-level section spacing |

### 4.2 Container Width Standards

| Context | Max Width | Tailwind Class |
| :--- | :--- | :--- |
| **Page container (desktop)** | 1152px | `max-w-6xl mx-auto` |
| **Content feed center column** | 560px | `max-w-[560px]` |
| **Mobile full-screen** | 100% | No max-width constraint |
| **Dialog/modal** | 512px / 640px | `max-w-lg` / `max-w-xl` |
| **Admin table viewport** | 100% of container | `w-full` within admin shell |

---

## 5. Border Radius System

### 5.1 Radius Token Scale

| Element Type | Radius | Tailwind Class | CSS Value |
| :--- | :--- | :--- | :--- |
| **Interactive Controls** (Button, Input, Tabs, Badge triggers) | 12px | `rounded-xl` | `var(--radius)` |
| **Cards & Containers** | 16px | `rounded-2xl` | `calc(var(--radius) + 4px)` |
| **Avatars & Progress Bars** | Full circle | `rounded-full` | `9999px` |
| **Compact/Dense Controls** | 8px | `rounded-lg` | `calc(var(--radius) - 4px)` |
| **Dialog/Modal Windows** | 16px | `rounded-2xl` | `calc(var(--radius) + 4px)` |
| **Dropdown Menu Items** | 12px | `rounded-xl` | `var(--radius)` |

### 5.2 Tailwind Config Radius Extension

```typescript
// tailwind.config.ts
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
},
```

---

## 6. Shadows & Elevation

### 6.1 Shadow Scale

| Elevation Level | Tailwind Class | Usage |
| :--- | :--- | :--- |
| **Level 0 (Flat)** | No shadow | Inline elements, table rows, ghost buttons |
| **Level 1 (Subtle)** | `shadow-xs` | Cards, buttons, input fields, badges |
| **Level 2 (Medium)** | `shadow-md` | Dropdowns, popovers, hovering tooltips |
| **Level 3 (Prominent)** | `shadow-2xl` | Dialogs, modals, bottom sheets, overlays |
| **Glassmorphism** | `shadow-lg backdrop-blur-md bg-background/80` | iOS-style translucent surfaces |

---

## 7. Interaction & Animation Standards

### 7.1 Micro-Interaction Rules

| Interaction | Implementation | Purpose |
| :--- | :--- | :--- |
| **Button Press** | `active:scale-95 transition-all` | Tactile feedback on tap/click |
| **Hover State** | `hover:bg-[variant]/80` or `hover:bg-muted` | Visual affordance on desktop hover |
| **Focus Ring** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` | Keyboard navigation visibility |
| **Disabled State** | `disabled:pointer-events-none disabled:opacity-50` | Clear non-interactive indication |
| **Progress Animation** | `transition-all duration-300 ease-in-out` | Smooth progress bar fill |
| **List Item Entry** | FormKit Auto-Animate on parent container | Smooth add/remove/reorder animations |
| **Modal Enter/Exit** | `animate-in` / `animate-out` (tailwindcss-animate) | Smooth dialog transitions |

### 7.2 Animation Duration Guidelines

| Category | Duration | Easing |
| :--- | :--- | :--- |
| Micro-interaction (press, toggle) | 100–150ms | `ease-out` |
| State transition (progress, slide) | 200–300ms | `ease-in-out` |
| Modal/overlay enter | 200ms | `ease-out` |
| Modal/overlay exit | 150ms | `ease-in` |
| List auto-animate | 250ms | Auto (FormKit default) |
| Page transition | 300ms | `ease-in-out` |

> [!WARNING]
> **Never use animations longer than 500ms** for UI transitions. Users perceive delays > 400ms as sluggish. Animation is an enhancement, not an experience gate.

### 7.3 Required Keyframe Definitions

```typescript
// tailwind.config.ts
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  pulse: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0.5" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
},
```

---

## 8. Touch & Accessibility Ergonomics

### 8.1 Touch Target Standards

> [!IMPORTANT]
> **Minimum touch target**: Every interactive element (button, link, checkbox, toggle, icon trigger) MUST have a minimum hit area of **48px × 48px** (`min-h-[48px] min-w-[48px]`). This is a non-negotiable accessibility requirement per WCAG 2.5.8 and Material Design guidelines.

Apply via the `touch-target` utility class or direct min-height/min-width:

```css
.touch-target {
  min-height: 48px;
  min-width: 48px;
}
```

### 8.2 Mobile Ergonomic Zones

- **Primary CTA Zone**: Position the most important actions in the **bottom 120px** of mobile viewports (thumb-reachable zone).
- **Fixed Bottom Nav**: 64px height, anchored to bottom with safe area padding.
- **Scroll Content Area**: `min-h-[calc(100vh-120px)] pb-20` to account for header + bottom nav.

### 8.3 ARIA & Semantic HTML

- Use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on progress indicators.
- Use `aria-label` on icon-only buttons (e.g., audio play, close, share).
- Use semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`) for screen reader navigation.
- Ensure proper heading hierarchy: single `<h1>` per page, sequential `<h2>` → `<h3>` nesting.
- All images must have meaningful `alt` text or `alt=""` for decorative images.

### 8.4 High Contrast Standards

- Text on colored backgrounds must meet **WCAG AA** contrast ratio (4.5:1 for normal text, 3:1 for large text).
- Avoid light gray text on white backgrounds. Use `text-muted-foreground` (HSL `0 0% 47%`) minimum for secondary text.
- Test color combinations in both light and dark modes.
- Support `prefers-contrast: high` media query where possible.

---

## 9. Multilingual & RTL Layout

### 9.1 Bidirectional (RTL) Layout Support

When the app locale is set to an RTL language (e.g., Urdu, Arabic):

1. **Root Direction**: Root layout must set `dir="rtl"` and `lang="ur"` on the `<html>` element.
2. **Font Switching**: RTL mode triggers automatic font family override to regional script fonts:
   ```css
   [dir="rtl"] {
     font-family: "Noto Nastaliq Urdu", "Gulzar", system-ui, sans-serif;
     text-align: right;
     line-height: 1.85;
   }
   ```
3. **Logical CSS Properties**: Use Tailwind logical direction classes instead of physical direction classes:
   - ✅ `ms-auto` (margin-inline-start) instead of ❌ `ml-auto`
   - ✅ `me-2` (margin-inline-end) instead of ❌ `mr-2`
   - ✅ `ps-4` (padding-inline-start) instead of ❌ `pl-4`
   - ✅ `pe-3` (padding-inline-end) instead of ❌ `pr-3`
4. **Icon Direction Flipping**: Chevron and arrow icons must dynamically flip direction in RTL mode. Use `rtl:rotate-180` or conditional icon rendering.
5. **Flex Direction**: Horizontal flex layouts automatically reverse in RTL. Verify visual order is correct.

### 9.2 Internationalization (i18n) Architecture

- **Client-Side Dictionary Pattern**: Statically imported JSON/TS dictionaries per locale, accessed via a `useTranslation()` hook.
- **Dictionary Key Structure**: Nested by feature domain:
  ```typescript
  interface TranslationDictionary {
    common: { appName: string; continue: string; ... };
    feed: { likeCount: string; saveForOffline: string; ... };
    player: { nodeProgress: string; takeQuiz: string; ... };
  }
  ```
- **No Hardcoded User-Facing Strings**: Every visible string must be a dictionary key. Placeholders, labels, tooltips, aria-labels — all localized.
- **Audio Narration Layer**: Every localized string key optionally maps to an `audioKey` or `audioUrl` for low-literacy audio playback.

### 9.3 Supported Language Store Pattern

```typescript
type SupportedLanguage = "en" | "hi" | "mr" | "ur";

// useLanguageStore.ts
interface LanguageState {
  currentLanguage: SupportedLanguage;
  isRtl: boolean;  // Derived: true when currentLanguage === "ur"
  setLanguage: (lang: SupportedLanguage) => void;
}
```

---

## 10. Responsive Breakpoint Strategy

### 10.1 Tailwind Breakpoints (Mobile-First)

| Breakpoint | Width | Target Devices |
| :--- | :--- | :--- |
| **Default** (no prefix) | 0px+ | All mobile phones (375px–414px) |
| `sm:` | 640px+ | Large phones / small tablets |
| `md:` | 768px+ | Tablets (landscape) |
| `lg:` | 1024px+ | Desktop / laptop viewports |
| `xl:` | 1280px+ | Wide desktops |
| `2xl:` | 1536px+ | Ultra-wide displays |

### 10.2 Mobile-First Authoring Rule

> [!IMPORTANT]
> **Always author styles mobile-first**. Write the default (smallest viewport) style first, then add responsive prefixes for larger screens. Example: `text-xs sm:text-sm lg:text-base` — NOT `text-base sm:text-sm xs:text-xs`.

### 10.3 Critical Responsive Verification Widths

Always test UI at these exact widths:
- **375px**: iPhone SE / Budget Android (minimum supported)
- **390px**: iPhone 14 / Standard modern phone
- **768px**: iPad Mini / Tablet portrait
- **1024px**: Laptop / Desktop breakpoint
- **1280px+**: Wide desktop

---

*End of Design System & Visual Standards Document*
