---
name: rooms-okc-system
description: Rooms OKC project design system. Use when adding pages, components, or styles to this codebase to stay consistent with the token system, BEM naming, and component patterns already in use.
---

# Rooms OKC Design System

Complete reference for building UI consistently inside this project.

---

## Stack

- Pure HTML + CSS + Vanilla JS (no framework, no build step)
- CSS architecture: `tokens.css` → `base.css` → `components.css` → `pages.css`
- Font: Poppins via Google Fonts (`--font-sans`)
- Icons: Font Awesome 6 (`fa-solid fa-*`)
- Dark/light theme via `data-theme` attribute on `<html>`

---

## Design Tokens (`css/tokens.css`)

### Colors
```css
/* Brand */
--color-primary: #3b82f6          /* blue-500 */
--color-primary-hover: #2563eb    /* blue-600 */
--color-primary-soft: #eff6ff     /* blue-50 bg */
--color-primary-contrast: #fff
--color-accent: #f97316           /* orange-500 */
--color-accent-hover: #ea580c

/* Surfaces */
--color-bg: #fafafa               /* page background */
--color-surface: #ffffff          /* cards, panels */
--color-surface-alt: #f4f4f5      /* subtle alt bg */
--color-overlay: rgba(9,9,11,0.5) /* modal backdrop */

/* Text */
--color-text: #18181b             /* primary text */
--color-text-muted: #71717a       /* secondary text */
--color-text-faint: #a1a1aa       /* placeholder, icons */

/* Borders */
--color-border: #e4e4e7
--color-border-strong: #d4d4d8

/* Semantic */
--color-success: #16a34a
--color-danger: #dc2626
--color-warning: #d97706
--color-info: #2563eb

/* Role badges */
--color-owner: #2563eb
--color-agent: #7c3aed
```

### Spacing Scale
```
--space-1: 0.25rem   (4px)
--space-2: 0.5rem    (8px)
--space-3: 0.75rem   (12px)
--space-4: 1rem      (16px)
--space-5: 1.5rem    (24px)
--space-6: 2rem      (32px)
--space-7: 3rem      (48px)
--space-8: 4rem      (64px)
--space-9: 6rem      (96px)
```

### Typography Scale
```
--text-xs: 0.75rem    --text-sm: 0.875rem   --text-base: 1rem
--text-lg: 1.125rem   --text-xl: 1.25rem    --text-2xl: 1.5rem
--text-3xl: 1.875rem  --text-4xl: 2.25rem   --text-5xl: 3rem
--leading-tight: 1.2  --leading-normal: 1.55
```

### Radii & Shadows
```
--radius-sm: 6px    --radius-md: 10px   --radius-lg: 16px
--radius-xl: 24px   --radius-full: 9999px

--shadow-sm: 0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.07)
--shadow-md: 0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)
--shadow-lg: 0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05)
```

### Layout & Motion
```
--container-max: 1200px
--navbar-height: 68px
--transition: 180ms ease     ← use this for all transitions
--bp-sm: 600px
--bp-md: 900px
--bp-lg: 1200px
```

---

## BEM Naming Convention

This project uses strict BEM: `block`, `block__element`, `block--modifier`.

```html
<!-- Block -->
<div class="card">
  <!-- Element -->
  <div class="card__header">
    <h2 class="card__title">Title</h2>
  </div>
  <!-- Modifier on block -->
  <div class="card card--featured">…</div>
</div>
```

**State classes** use `is-*` prefix (not BEM modifiers):
```html
<button class="btn is-loading">…</button>
<div class="modal is-open">…</div>
<button class="card-listing__fav is-saved">…</button>
```

**JavaScript hooks** use `js-*` prefix or `data-*` attributes, never styling classes.

---

## Button System

```html
<!-- Variants -->
<button class="btn btn--primary">Primary</button>
<button class="btn btn--accent">Accent (orange CTA)</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--icon"><i class="fa-solid fa-heart"></i></button>

<!-- Sizes -->
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary btn--lg">Large</button>

<!-- States -->
<button class="btn btn--primary" disabled>Disabled</button>
<button class="btn btn--primary" aria-disabled="true">Aria disabled</button>
```

Rules:
- Min touch target: 44px height (36px for `--sm`)
- Always use `btn--primary` for the main CTA, `btn--accent` for post/create actions
- Add `aria-label` to icon-only buttons
- `btn:focus-visible` outline is already handled globally

---

## Badge System

```html
<!-- Listing type badges -->
<span class="badge badge--sale">For Sale</span>
<span class="badge badge--rent">For Rent</span>
<span class="badge badge--shared">Shared</span>
<span class="badge badge--short">Short-Term</span>

<!-- Status badges -->
<span class="badge badge--active">Active</span>
<span class="badge badge--paused">Paused</span>
<span class="badge badge--expired">Expired</span>
<span class="badge badge--pending">Pending</span>

<!-- Role badges -->
<span class="badge badge--owner">Owner</span>
<span class="badge badge--agent">Agent</span>
```

Dark mode variants for all badges are in `components.css` — no extra work needed.

---

## Card Components

### Generic Card
```html
<div class="card">
  <div class="card__body">…</div>
</div>
```

### Listing Card
```html
<a href="listing-detail.html?id=…" class="card-listing">
  <div class="card-listing__img-wrap">
    <img src="…" alt="Property title" class="card-listing__img" loading="lazy">
    <div class="card-listing__badges">
      <span class="badge badge--sale">For Sale</span>
    </div>
    <button class="card-listing__fav" aria-label="Save to favourites">
      <i class="fa-regular fa-heart" aria-hidden="true"></i>
    </button>
  </div>
  <div class="card-listing__body">
    <p class="card-listing__price">$250,000 <span>/ month</span></p>
    <h3 class="card-listing__title">Property Title Here</h3>
    <p class="card-listing__location">
      <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
      Oklahoma City, OK
    </p>
    <div class="card-listing__meta">
      <span><i class="fa-solid fa-bed"></i> 3 bd</span>
      <span class="meta-dot">·</span>
      <span><i class="fa-solid fa-bath"></i> 2 ba</span>
      <span class="meta-dot">·</span>
      <span><i class="fa-solid fa-ruler-combined"></i> 1,200 sqft</span>
    </div>
  </div>
</a>
```

---

## Form Elements

```html
<!-- Input -->
<div class="form-group">
  <label class="form-label" for="price">Price</label>
  <input class="input" type="number" id="price" placeholder="e.g. 1200">
</div>

<!-- With icon -->
<div class="input-wrap">
  <i class="fa-solid fa-magnifying-glass input-wrap__icon" aria-hidden="true"></i>
  <input class="input input--icon-l" type="search" placeholder="Search…">
</div>

<!-- Select -->
<select class="input" id="type">
  <option value="">All Types</option>
  <option value="sale">For Sale</option>
</select>

<!-- Textarea -->
<textarea class="input" rows="4" placeholder="Description…"></textarea>

<!-- Checkbox -->
<label class="checkbox-label">
  <input type="checkbox" class="checkbox"> Include utilities
</label>
```

---

## Layout Helpers

```html
<!-- Page wrapper -->
<main class="page-top">
  <div class="section">
    <div class="container">
      …content…
    </div>
  </div>
</main>

<!-- Flex helpers -->
<div class="flex items-center justify-between gap-4">…</div>

<!-- Listing grid -->
<div class="listing-grid">
  <!-- 1 col → 2 col @600px → 3 col @1200px -->
  <a class="card-listing">…</a>
</div>
```

---

## Toast Notifications

```javascript
// From app.js — globally available
showToast('Saved!', 'success');
showToast('Something went wrong', 'error');
showToast('Check your input', 'warning');
showToast('Tip: You can filter by area', 'info');
// types: 'success' | 'error' | 'warning' | 'info'
// optional 3rd arg: duration in ms (default 3500)
```

---

## Modal Pattern

```html
<div class="modal" id="my-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__backdrop"></div>
  <div class="modal__box">
    <div class="modal__header">
      <h2 class="modal__title" id="modal-title">Modal Title</h2>
      <button class="btn btn--icon" aria-label="Close" onclick="closeModal('my-modal')">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
    <div class="modal__body">…</div>
    <div class="modal__footer">
      <button class="btn btn--ghost" onclick="closeModal('my-modal')">Cancel</button>
      <button class="btn btn--primary">Confirm</button>
    </div>
  </div>
</div>
```

```javascript
openModal('my-modal');   // from app.js
closeModal('my-modal');  // from app.js
```

---

## Animation Helpers

```html
<!-- Fade up on load -->
<div class="animate-fade-up">…</div>
<div class="animate-fade-up delay-1">…</div>  <!-- 60ms -->
<div class="animate-fade-up delay-2">…</div>  <!-- 120ms -->
<!-- delays 1–6 available (60ms steps) -->

<!-- Skeleton loading -->
<div class="skeleton" style="height:200px; border-radius:var(--radius-lg)"></div>
<div class="skeleton" style="height:1rem; width:60%"></div>
```

---

## Dark Mode Rules

- **Never hardcode colors** — always use tokens
- Test every new component with `data-theme="dark"` on `<html>`
- Badges use explicit dark overrides in `components.css`; follow the same pattern
- `body` transitions `background-color` and `color` smoothly (200ms)
- `[data-theme="dark"]` block in `tokens.css` overrides all relevant tokens

---

## Adding a New Page

1. Copy the navbar + mobile drawer HTML from `index.html` (lines 24–90)
2. Copy the footer from `index.html`
3. Link all 4 CSS files + app.js in `<head>` / before `</body>`
4. Use `<main class="page-top">` as the main wrapper
5. Wrap page sections with `<section class="section"><div class="container">…</div></section>`
6. Mark the active nav link with `class="navbar__link is-active"` for the current page

---

## File Map

```
css/
  tokens.css    ← edit ONLY to add tokens; never delete existing ones
  base.css      ← reset, typography, layout helpers
  components.css← all reusable components (btn, card, form, modal, toast…)
  pages.css     ← page-specific styles only
js/
  app.js        ← theme, navbar, toast, modal, shared utilities
  listings.js   ← listings page filtering/rendering
  calculator.js ← mortgage calculator
  post-listing.js← post a listing form
assets/img/     ← static images
```
