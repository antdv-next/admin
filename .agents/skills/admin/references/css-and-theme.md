# CSS And Theme

## Core Rules

- Prefer Tailwind CSS v4 utility classes directly in template `class`.
- Prefer theme tokens from `@antdv-next/tailwind/theme.css`.
- Do not hardcode business colors like `text-blue-500` or `bg-blue-50`.
- Do not branch pure styles with `isDark ? ... : ...`.
- Use inline styles or extra CSS only for values Tailwind cannot express cleanly.

## Preferred Tokens

### Page containers

- Root page container: `bg-layout text-text`
- Standard content area: `bg-base` or `bg-container`
- Floating or emphasized area: `bg-elevated`

### Panels and cards

- Standard panel: `border-border bg-container`
- Elevated panel: `border-border bg-elevated shadow-card`
- Secondary divider: `border-border-sec`

### Text

- Primary text: `text-text`
- Secondary text: `text-text-secondary`
- Tertiary text: `text-text-tertiary`
- Brand emphasis: `text-primary`

### Clickable text

- Brand or action text:
  `text-primary hover:text-primary-hover active:text-primary-active`
- Neutral nav text:
  `text-text-secondary hover:text-primary-hover active:text-primary-active`

### Lightweight emphasis

- Primary weak background: `bg-primary-bg`
- Primary weak accent: `bg-primary/10 border-primary/30`
- Info weak accent: `bg-info/10 border-info-border`

### Borders and shadows

- Default border: `border-border`
- Weak border: `border-border-sec`
- Brand border: `border-primary` or `border-primary/30`
- Card shadow: `shadow-card`
- Generic shadow: `shadow`
- Secondary shadow: `shadow-sec`
- Weak shadow: `shadow-ter`

### Status colors

- Success: `text-success bg-success-bg border-success-border`
- Warning: `text-warning bg-warning-bg border-warning-border`
- Error: `text-error bg-error-bg border-error-border`
- Info: `text-info bg-info-bg border-info-border`

## Allowed Custom Color Cases

- Demo code highlighting
- Decorative graphics or illustration-only elements
- Visuals the current token set cannot express, after checking token alternatives first
