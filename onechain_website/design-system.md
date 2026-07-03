# OneChain Design System

> **Version:** 1.0 · **Date:** 24 June 2026
> **Style DNA:** Vercel clarity × Terminal3 Web3 aesthetic × OneChain teal identity

---

## Design Tokens

### Colors

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--oc-primary` | `#016282` | Brand teal | CTAs, headers, primary accent, links |
| `--oc-primary-light` | `#0189B5` | Teal hover | Button hover, active states |
| `--oc-primary-glow` | `rgba(1,98,130,0.15)` | Teal glow | Card hover glow, focus rings |
| `--oc-dark` | `#0A1628` | Deep navy | Hero backgrounds, dark sections |
| `--oc-dark-surface` | `#0F1D32` | Elevated dark | Cards on dark backgrounds |
| `--oc-border` | `rgba(10,22,40,0.08)` | Subtle border | Card borders, section dividers |
| `--oc-border-hover` | `rgba(10,22,40,0.15)` | Hover border | Card hover state borders |
| `--oc-light-bg` | `#F7FAFB` | Light background | Page backgrounds, alternating sections |
| `--oc-white` | `#FFFFFF` | White | Cards, text on dark |
| `--oc-esg-green` | `#2ECC71` | ESGLedger accent | ESGLedger page only |
| `--oc-cert-gold` | `#F0B429` | CertLedger accent | CertLedger page only |
| `--oc-ai-purple` | `#7F77DD` | AI highlight | AI feature badges and accents |
| `--oc-text` | `#0A1628` | Primary text | Headings, body text |
| `--oc-text-secondary` | `#475569` | Secondary text | Card descriptions |
| `--oc-muted` | `#64748B` | Muted text | Captions, meta, nav links |
| `--oc-muted-light` | `#94A3B8` | Light muted | Subtle labels, footer text |
| `--oc-success` | `#2ECC71` | Success | Confirmations, positive states |
| `--oc-warning` | `#F0B429` | Warning | Alerts, attention states |
| `--oc-error` | `#E74C3C` | Error | Errors, destructive states |

**Color discipline:** Teal is the dominant accent across all pages. Green and gold appear only on their respective product pages. Purple appears only alongside AI feature callouts. One color with restraint > five colors everywhere.

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `'Nunito', sans-serif` | H1–H2, hero headlines |
| `--font-body` | `'Inter', sans-serif` | Body, UI, navigation |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, data, API docs |
| `--font-cjk` | `'Noto Sans TC', sans-serif` | Traditional Chinese fallback |

#### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-hero` | 64px / 4rem | 800 | 1.1 | Homepage hero headline |
| `--text-h1` | 48px / 3rem | 700 | 1.2 | Page titles |
| `--text-h2` | 36px / 2.25rem | 700 | 1.25 | Section headers |
| `--text-h3` | 24px / 1.5rem | 600 | 1.3 | Card titles, sub-headers |
| `--text-h4` | 20px / 1.25rem | 600 | 1.4 | Small headings |
| `--text-body` | 16px / 1rem | 400 | 1.6 | Body text |
| `--text-body-lg` | 18px / 1.125rem | 400 | 1.6 | Hero sublines, lead text |
| `--text-small` | 14px / 0.875rem | 400 | 1.5 | Captions, meta, badges |
| `--text-xs` | 12px / 0.75rem | 500 | 1.4 | Labels, tags |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Inline icon gaps |
| `--space-sm` | 8px | Tight padding |
| `--space-md` | 16px | Standard padding |
| `--space-lg` | 24px | Card padding |
| `--space-xl` | 32px | Component gaps |
| `--space-2xl` | 48px | Section inner padding |
| `--space-3xl` | 64px | Section margins |
| `--space-section` | 96px | Between major sections |
| `--space-hero` | 120px | Hero vertical padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Buttons, inputs, badges |
| `--radius-md` | 12px | Small cards, tooltips |
| `--radius-lg` | 16px | Feature cards, panels |
| `--radius-xl` | 24px | Hero cards, product spotlights |
| `--radius-full` | 9999px | Pills, avatars, tags |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(10,22,40,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 16px rgba(10,22,40,0.08)` | Cards on light bg |
| `--shadow-lg` | `0 8px 32px rgba(10,22,40,0.12)` | Elevated modals |
| `--shadow-glow` | `0 0 24px rgba(1,98,130,0.2)` | Teal glow on hover |
| `--shadow-glow-green` | `0 0 24px rgba(46,204,113,0.2)` | ESGLedger card glow |
| `--shadow-glow-gold` | `0 0 24px rgba(240,180,41,0.2)` | CertLedger card glow |

### Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover states, color changes |
| `--duration-base` | 250ms | Transitions, toggles |
| `--duration-slow` | 400ms | Slide-ins, modals |
| `--duration-scroll` | 600ms | Scroll-triggered animations |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Elements entering |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |

---

## Components

### Button

| Variant | Background | Text | Border | Hover | Use When |
|---------|-----------|------|--------|-------|----------|
| Primary | `--oc-primary` | white | none | `--oc-primary-light` + glow | Main CTAs: "Explore ESGLedger", "Get Started" |
| Secondary | transparent | `--oc-primary` | 1px `--oc-primary` | filled teal at 10% | Supporting actions: "Learn More", "API Docs" |
| Ghost | transparent | `--oc-muted` | none | text darkens | Tertiary: nav links, "Read more" |
| Dark | `--oc-dark` | white | none | lighten 10% | CTAs on light backgrounds |

**Sizes:** `sm` (32px h, 14px text) · `md` (40px h, 16px text) · `lg` (48px h, 16px text)
**Border radius:** `--radius-sm` (8px)
**States:** default → hover (glow + lift 1px) → active (scale 0.98) → disabled (opacity 0.5) → loading (spinner)
**Accessibility:** `role="button"`, focus ring 2px offset teal, keyboard Enter/Space triggers

### Card

| Variant | Background | Border | Hover Effect | Usage |
|---------|-----------|--------|-------------|-------|
| Feature | `--oc-card-bg` (white) | `--oc-border` | Border darkens, lift shadow | Product features, infrastructure layers |
| Product Spotlight | `--oc-card-bg` (white) | gradient left border | Glow in product color | ESGLedger/CertLedger hero cards |
| Stat | transparent | bottom gradient line | Number count-up | Impact numbers, tech specs |
| Partner Logo | transparent | none | Opacity 0.6 → 1.0 | Partner/ecosystem logos |
| Solution | `--oc-card-bg` (white) | `--oc-border` | Lift + shadow | Use case cards, industry cards |

**Standard card padding:** `--space-lg` (24px)
**Border radius:** `--radius-lg` (16px)
**Gap between cards:** `--space-xl` (32px)

### Navigation (Header)

- **Height:** 64px
- **Background:** `rgba(255,255,255,0.85)` with `backdrop-filter: blur(16px)`, border-bottom `--oc-border`
- **Position:** `fixed` top, z-index 100
- **Logo:** ON;CHAIN® — "O" is a chain-link icon in teal, "N" in `--oc-primary`, ";" in `--oc-primary`, "CHAIN" in `--oc-dark`, ® in 8px `--oc-muted` superscript
- **Links:** `--font-body` 14px, weight 500, `--oc-muted` → `--oc-text` on hover
- **CTA button:** Primary variant, `sm` size
- **Mobile (< 1024px):** Hamburger menu, full-screen overlay nav
- **Language toggle:** EN / 繁 pill switcher, right of CTA

### Section Header

- **Eyebrow label:** `--text-xs`, uppercase, letter-spacing 2px, `--oc-primary` or product color
- **Heading:** `--text-h2`, `--font-display`, white (dark bg) or `--oc-dark` (light bg)
- **Subline:** `--text-body-lg`, `--oc-muted`, max-width 640px, centered
- **Spacing:** eyebrow → heading: 12px, heading → subline: 16px, subline → content: 48px

### Badge / Tag

| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| Teal | `--oc-primary` at 15% | `--oc-primary` | "Blockchain", "BaaS" |
| Green | `--oc-esg-green` at 15% | `--oc-esg-green` | "ESG", "Sustainability" |
| Gold | `--oc-cert-gold` at 15% | `--oc-cert-gold` | "Credentials", "Verification" |
| Purple | `--oc-ai-purple` at 15% | `--oc-ai-purple` | "AI-Powered" |

**Size:** 24px height, 12px horizontal padding, `--text-xs`, `--radius-full`

### Footer

- **Background:** `--oc-bg-alt` (#F7FAFB), border-top `--oc-border`
- **Layout:** 4-column grid (Company · Products · Resources · Contact) + bottom bar
- **Links:** `--text-small`, `--oc-muted` → `--oc-text` on hover
- **Social icons:** 20px, `--oc-muted` → `--oc-text` on hover
- **Bottom bar:** Copyright, Privacy, Terms — separated by `·`
- **Spacing:** `--space-section` top padding, `--space-2xl` bottom

---

## Patterns

### Hero Section (Light)

```
┌──────────────────────────────────────────────┐
│  [160px top padding]                          │
│                                               │
│     EYEBROW LABEL (teal, uppercase, pill bg)  │
│     Hero Headline (64px, Nunito, --oc-dark)   │
│     Subtitle (18px, Inter, --oc-muted)        │
│                                               │
│     [Primary CTA]  [Secondary CTA]           │
│                                               │
│  [100px bottom padding]                       │
│                                               │
│  Background: white with subtle radial glow    │
│  Glow: radial-gradient from accent at 0.06    │
└──────────────────────────────────────────────┘
```

### Partner Logo Strip

- Horizontal scroll on mobile, full row on desktop
- Logos in monochrome white at 60% opacity → 100% on hover
- Auto-scrolling marquee animation (Terminal3 style)
- Max height per logo: 32px
- Gap: `--space-xl`

### Feature Grid (Bento)

- 3-column grid on desktop, 1-column on mobile
- Cards use Feature Card variant
- Each card: icon (40px, teal) + title (h3) + description (body, muted)
- Optional: one card spans 2 columns for emphasis

### Product Spotlight Card

- 2-column layout: visual left, text right (alternating)
- Product color accent on left border (4px gradient)
- Tagline + 2-line description + CTA button
- Hover: glow in product color

### Pipeline / Flow Visualization

Used for ESGLedger credit lifecycle and CertLedger issue flow:
- Horizontal steps on desktop, vertical on mobile
- Each step: circle (numbered) + label + short description
- Connecting line between circles, animated on scroll
- Active step highlighted in product color

### Stats Banner

- 4-column on desktop, 2×2 on mobile
- Animated count-up on scroll into view
- Large number (`--text-h1`) + label (`--text-small`, muted)
- Optional: small icon above each stat

### FAQ Accordion

- Full-width, single column
- Question: `--text-h4`, weight 600
- Expand/collapse with smooth height transition
- Plus → minus icon rotation on toggle
- Only one open at a time

---

## Responsive Breakpoints

| Token | Width | Layout Behavior |
|-------|-------|-----------------|
| `--bp-mobile` | 375px | Single column, hamburger nav |
| `--bp-tablet` | 768px | 2-column grids, expanded nav options |
| `--bp-desktop` | 1280px | Full layout, sticky nav |
| `--bp-wide` | 1536px | Max-width container capped at 1280px with center alignment |

**Container max-width:** 1280px, centered with `auto` margins
**Section padding (horizontal):** 24px mobile · 48px tablet · 64px desktop

---

## Accessibility

- WCAG 2.1 AA minimum for all components
- Color contrast: 4.5:1 for body text, 3:1 for large text and UI elements
- Focus indicators: 2px solid `--oc-primary` with 2px offset
- All interactive elements keyboard-accessible (Tab, Enter, Escape)
- Semantic HTML: proper heading hierarchy, landmark regions, `<nav>`, `<main>`, `<footer>`
- `prefers-reduced-motion`: disable all scroll animations, count-ups, parallax
- `prefers-color-scheme`: dark mode support via CSS custom properties swap
- Alt text required for all images
- Skip-to-content link as first focusable element

---

## Dark Mode Token Swap

| Token | Light Value | Dark Value |
|-------|------------|------------|
| `--oc-page-bg` | `#F7FAFB` | `#0A1628` |
| `--oc-card-bg` | `#FFFFFF` | `#0F1D32` |
| `--oc-text-primary` | `#0A1628` | `#FFFFFF` |
| `--oc-text-secondary` | `#8896A6` | `#B0BEC5` |
| `--oc-border` | `rgba(10,22,40,0.08)` | `rgba(255,255,255,0.08)` |

**Default:** Light mode (clean, professional). Dark mode available via toggle or system preference.

---

## Icon System

- **Library:** Lucide React (outlined, rounded corners)
- **Sizes:** 16px (inline) · 20px (UI elements) · 24px (cards) · 40px (feature cards)
- **Stroke width:** 1.5px
- **Color:** Inherits text color by default; teal for accent icons
- **Custom icons:** Blockchain node, chain link, leaf, certificate — follow Lucide stroke style

---

*This design system serves as the single source of truth for all OneChain website pages. Every component, color, and spacing value should reference these tokens.*
