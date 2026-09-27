# UI Component Standards & Anti-Hallucination Rules

**Scope**: Project-agnostic UI component primitives specification for shadcn/ui + Radix + Tailwind CSS applications.  
**Purpose**: Eliminate AI component hallucination, enforce unified styling, standardize every UI primitive's props, variants, sizing, and class composition.  
**Applicability**: MUST be read before every UI implementation prompt.

---

## 1. Zero Component Hallucination Policy

> [!CAUTION]
> **ABSOLUTE RULE**: AI assistants (and developers) MUST NEVER build custom raw HTML controls, ad-hoc styled `<div>` wrappers, or inline CSS overrides when a standard primitive exists in `@/components/ui/`. Every UI need must first be mapped to an existing shadcn/ui primitive.

### 1.1 Mandatory Component Mapping Table

| Intended UI Requirement | MANDATORY Primitive Import | PROHIBITED Anti-Pattern (Hallucination) |
| :--- | :--- | :--- |
| **Interactive Action / Trigger** | `import { Button } from "@/components/ui/button"` | `<button className="px-4 py-2 bg-yellow-500...">`, `<div onClick={...}>` |
| **Status Tag / Chip / Category Pill** | `import { Badge } from "@/components/ui/badge"` | `<span className="px-2 py-1 bg-blue-100 rounded">`, `<div className="tag">` |
| **Text Entry / Search Input** | `import { Input } from "@/components/ui/input"` | `<input className="border p-2 rounded">` |
| **Multi-line Text Entry** | `import { Textarea } from "@/components/ui/textarea"` | `<textarea className="border p-2 rounded">` |
| **Completion / Progress Bar** | `import { Progress } from "@/components/ui/progress"` | `<div className="w-full bg-gray-200"><div style={{width:...}}>` |
| **Action Dropdown / Context Menu** | `import { DropdownMenu, ... } from "@/components/ui/dropdown-menu"` | Custom `position: absolute` popups with raw lists |
| **Content Card / Container** | `import { Card, CardHeader, CardTitle, ... } from "@/components/ui/card"` | `<div className="bg-white shadow rounded-lg p-4">` |
| **User Profile / Avatar Circle** | `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"` | `<img className="rounded-full w-10 h-10">` |
| **Tabbed View Switcher** | `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"` | Custom array-map buttons toggling active state indices |
| **Modal / Dialog Overlay** | `import { Dialog, DialogContent, ... } from "@/components/ui/dialog"` | Fixed backdrop `<div>` with custom z-index hacks |
| **Form Checkbox / Multi-Select** | `import { Checkbox } from "@/components/ui/checkbox"` | `<input type="checkbox">` |
| **Form Dropdown / Option Selector** | `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"` | Standard raw `<select>` tags or generic OS native dropdowns |
| **Data Grid / Table** | `import { Table, TableHeader, TableRow, ... } from "@/components/ui/table"` | Raw `<table>` with inline CSS |
| **Expandable Section** | `import { Accordion, AccordionItem, ... } from "@/components/ui/accordion"` | Custom toggle `<div>` with state-managed visibility |

### 1.2 When No Primitive Exists

If the required UI pattern doesn't map to any existing `@/components/ui/` primitive:

1. **Check Radix UI first**: See if Radix offers a headless primitive (e.g., `@radix-ui/react-slider`, `@radix-ui/react-tooltip`).
2. **Create a new shadcn/ui-style component**: Place it in `@/components/ui/`, following the same pattern (forwardRef, `cn()` composition, variant props).
3. **Document the new primitive**: Add its specification to this document.
4. **Never inline it**: Never create one-off styled wrappers inside feature components. All reusable UI goes in `@/components/ui/`.

---

## 2. The `cn()` Utility — Class Composition Foundation

Every shadcn/ui component uses the `cn()` utility for deterministic class merging:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why**: `clsx` handles conditional classes; `twMerge` deduplicates and resolves Tailwind class conflicts (e.g., `p-4` + `p-2` → `p-2`).

**Usage pattern in every component**:
```tsx
<element className={cn(
  "base-classes variant-classes size-classes",
  className  // Allow consumer to override via props
)} />
```

---

## 3. Component Primitive Specifications

### 3.1 Button (`@/components/ui/button`)

#### Props Interface:
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
```

#### Variant Styles:

| Variant | Classes | Use Case |
| :--- | :--- | :--- |
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs font-bold` | Primary CTAs, submit, course launch |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs font-bold` | Secondary actions, filter toggles, audio |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs` | Delete, cancel, reset |
| `outline` | `border border-border bg-background hover:bg-muted text-foreground` | Tertiary options, card actions |
| `ghost` | `hover:bg-muted text-foreground` | Header actions, toolbar items, inline triggers |
| `link` | `text-primary underline-offset-4 hover:underline` | Inline text links |

#### Size Styles:

| Size | Classes | Dimensions |
| :--- | :--- | :--- |
| `default` | `h-10 px-4 py-2 text-xs sm:text-sm` | Standard touch-friendly (40px height) |
| `sm` | `h-8 rounded-lg px-3 text-xs` | Compact inline (32px) — use inside dense tables only |
| `lg` | `h-12 rounded-2xl px-8 text-sm sm:text-base` | Hero CTAs, assessment submit (48px) |
| `icon` | `h-10 w-10` | Icon-only floating controls (40px square) |

#### Base Class Composition:
```tsx
cn(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-heading font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 touch-target active:scale-95",
  variantStyles[variant],
  sizeStyles[size],
  className
)
```

---

### 3.2 Badge (`@/components/ui/badge`)

#### Props Interface:
```typescript
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "tertiary";
}
```

#### Variant Styles:

| Variant | Classes | Use Case |
| :--- | :--- | :--- |
| `default` | `bg-primary text-primary-foreground hover:bg-primary/80` | Primary status badges |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | Active module labels |
| `tertiary` | `bg-tertiary text-tertiary-foreground hover:bg-tertiary/80` | Category tags, ward badges |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/80` | Urgent alerts, pending compliance |
| `outline` | `text-foreground border border-border hover:bg-muted` | Category filters, offline indicators |

#### Base Class Composition:
```tsx
cn(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variantStyles[variant],
  className
)
```

---

### 3.3 Input (`@/components/ui/input`)

#### Props Interface:
```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

#### Base Class Composition:
```tsx
cn(
  "flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  className
)
```

---

### 3.4 Textarea (`@/components/ui/textarea`)

#### Props Interface:
```typescript
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
```

#### Base Class Composition:
```tsx
cn(
  "flex min-h-[80px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  className
)
```

---

### 3.5 Progress (`@/components/ui/progress`)

#### Props Interface:
```typescript
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // Clamped between 0 and 100
}
```

#### Standard Implementation:
```tsx
export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  );
}
```

> [!NOTE]
> The Progress component uses `translateX` instead of `width` for GPU-accelerated animation. Always clamp value between 0–100.

---

### 3.6 Card Suite (`@/components/ui/card`)

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Card` | `rounded-2xl border border-border bg-card text-card-foreground shadow-xs transition-all` |
| `CardHeader` | `flex flex-col space-y-1.5 p-4 sm:p-6` |
| `CardTitle` | `font-heading font-bold text-base sm:text-lg leading-none tracking-tight` |
| `CardDescription` | `text-xs sm:text-sm text-muted-foreground` |
| `CardContent` | `p-4 sm:p-6 pt-0 sm:pt-0` |
| `CardFooter` | `flex items-center p-4 sm:p-6 pt-0 sm:pt-0` |

---

### 3.7 Avatar Suite (`@/components/ui/avatar`)

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Avatar` | `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full` |
| `AvatarImage` | `aspect-square h-full w-full object-cover` |
| `AvatarFallback` | `flex h-full w-full items-center justify-center rounded-full bg-muted font-heading font-bold text-xs text-muted-foreground` |

---

### 3.8 Tabs Suite (`@/components/ui/tabs`)

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Tabs` | Radix primitive root (`TabsPrimitive.Root`) |
| `TabsList` | `inline-flex h-11 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground w-full sm:w-auto` |
| `TabsTrigger` | `inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-heading font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs` |
| `TabsContent` | `mt-2 ring-offset-background focus-visible:outline-none` |

---

### 3.9 Dialog / Modal Suite (`@/components/ui/dialog`)

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Dialog` | Radix primitive root |
| `DialogTrigger` | Modal trigger button wrapper |
| `DialogOverlay` | `fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out` |
| `DialogContent` | `fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-border bg-background p-6 shadow-2xl duration-200 animate-in` |
| `DialogHeader` | `flex flex-col space-y-1.5 text-center sm:text-left` |
| `DialogTitle` | `font-heading font-bold text-lg` |
| `DialogDescription` | `text-xs sm:text-sm text-muted-foreground` |
| `DialogFooter` | `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2` |

---

### 3.10 Checkbox (`@/components/ui/checkbox`)

#### Implementation:
- Uses Radix Checkbox Primitive (`@radix-ui/react-checkbox`).
- Base classes: `peer h-5 w-5 shrink-0 rounded-md border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-colors`

---

### 3.11 Select Suite (`@/components/ui/select`)

> [!IMPORTANT]
> **PROHIBITED**: Standard raw HTML `<select>` elements and generic OS native dropdowns are strictly forbidden. All option selectors MUST use the themed `@/components/ui/select`.

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Select` | Radix primitive root (`@radix-ui/react-select`) |
| `SelectTrigger` | `flex h-12 w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary shadow-xs` |
| `SelectValue` | Rendered selected value text or placeholder |
| `SelectContent` | `z-50 max-h-96 min-w-[8rem] rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl animate-in` |
| `SelectItem` | `relative flex w-full select-none items-center rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:bg-primary/10 focus:text-primary` |

---

### 3.12 Table Suite (`@/components/ui/table`)

#### Subcomponents:

| Subcomponent | Base Classes |
| :--- | :--- |
| `Table` | `w-full caption-bottom text-sm` |
| `TableHeader` | `[&_tr]:border-b` |
| `TableBody` | `[&_tr:last-child]:border-0` |
| `TableRow` | `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted` |
| `TableHead` | `h-12 px-4 text-left align-middle font-medium text-muted-foreground` |
| `TableCell` | `p-4 align-middle` |

---

## 4. Component Composition Patterns

### 4.1 Compound Component Pattern

For multi-part components (Card, Dialog, Tabs), always export all sub-parts and compose them at the usage site:

```tsx
// ✅ CORRECT: Using compound component parts
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// ❌ WRONG: Custom wrapper div with inline styling
<div className="bg-white shadow rounded-lg p-4">
  <h3 className="font-bold">Title</h3>
  <p className="text-gray-500">Description</p>
  <button className="bg-yellow-500 px-4 py-2 rounded">Action</button>
</div>
```

### 4.2 ForwardRef Pattern

All primitive components must use `React.forwardRef` to support ref forwarding:

```tsx
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element ref={ref} className={cn(baseClasses, className)} {...props} />
    );
  }
);
Component.displayName = "Component";
```

### 4.3 Variant + Size Pattern

Components with visual variants follow the variant/size object lookup pattern:

```tsx
const variantStyles = {
  default: "...",
  secondary: "...",
  destructive: "...",
};

const sizeStyles = {
  default: "...",
  sm: "...",
  lg: "...",
};

// In render:
className={cn(baseClasses, variantStyles[variant], sizeStyles[size], className)}
```

---

## 5. Component Testing Standards

### 5.1 Mandatory Test Requirement

Every UI component in `@/components/ui/` **MUST** have a corresponding `*.test.tsx` file co-located alongside it.

### 5.2 Test Coverage Requirements

Each component test suite must verify:
- ✅ **Renders without crashing** with default props
- ✅ **Applies correct variant classes** for each variant option
- ✅ **Supports className override** via props
- ✅ **Forwards refs correctly** (for forwardRef components)
- ✅ **Handles disabled state** (pointer-events-none, opacity)
- ✅ **Accessibility attributes** (aria-labels, roles, etc.)

### 5.3 Verification Command

Before marking any UI task complete:
```bash
npm test
```

All unit tests MUST pass with 100% success rate.

---

## 6. Icon Standards (Lucide React)

### 6.1 Icon Usage Rules

- **Import source**: Always from `lucide-react`.
- **Sizing**: Default `size={20}` for inline icons, `size={24}` for standalone icon buttons.
- **Stroke width**: Use default (2) for standard usage, `strokeWidth={1.5}` for subtle icons.
- **Color**: Inherit from parent text color (`className="text-current"` is default).

### 6.2 Common Icon Mapping

| Intent | Lucide Icon | Notes |
| :--- | :--- | :--- |
| Home/Feed | `Home` or `Flame` | Bottom nav tab |
| Library/Saved | `BookmarkCheck` | Personal content library |
| Courses/Browse | `BookOpen` | Course catalog |
| Offline/Field | `MapPin` or `ClipboardCheck` | Field operations hub |
| Profile/Dashboard | `Award` or `User` | User portfolio |
| Audio/Play | `Volume2` | Audio narration trigger |
| Search | `Search` | Search input icon |
| Close/Dismiss | `X` | Modal close, dismiss actions |
| Share | `Share2` | Share to WhatsApp/social |
| Settings/Menu | `Settings` or `Menu` | Navigation controls |
| Success/Complete | `CheckCircle` | Completion states |
| Error/Alert | `AlertTriangle` | Warning states |
| Direction/Navigate | `ChevronRight` / `ChevronLeft` | Navigation arrows (flip in RTL) |

---

## 7. Toast / Notification Standards (Sonner)

### 7.1 Toast Rules

- Use `toast()` from `sonner` for all transient notifications.
- Position: Bottom-center on mobile, bottom-right on desktop.
- Duration: 3–4 seconds for informational, 5 seconds for action toasts.
- Never use `window.alert()` or custom toast implementations.

### 7.2 Toast Types

| Type | Function | Use Case |
| :--- | :--- | :--- |
| Success | `toast.success("Message")` | Completed actions, saved items |
| Error | `toast.error("Message")` | Failed operations, validation errors |
| Info | `toast("Message")` | Neutral notifications, state changes |
| Action | `toast("Message", { action: { ... } })` | Toasts with undo/retry buttons |

---

*End of UI Component Standards Document*
