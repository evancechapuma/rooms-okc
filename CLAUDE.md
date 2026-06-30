# Rooms OKC — Claude Code Guide

Real estate listing platform for Oklahoma City. Static HTML/CSS/Vanilla JS — no build step, no framework.

## Stack

- HTML5, CSS3 (custom properties), Vanilla JS (ES2020+)
- Font: Poppins (Google Fonts) — `--font-sans`
- Icons: Font Awesome 6 (`fa-solid fa-*`, `fa-regular fa-*`)
- No npm, no bundler, no TypeScript

## CSS Architecture

Load order matters — never reverse it:
```
tokens.css     → all CSS custom properties (:root + [data-theme="dark"])
base.css       → reset, typography, layout helpers
components.css → reusable components (btn, card, badge, form, modal, toast)
pages.css      → page-specific styles only
```

## Naming Conventions

- CSS: strict **BEM** — `block`, `block__element`, `block--modifier`
- State classes: `is-*` prefix — `is-open`, `is-loading`, `is-active`, `is-saved`
- JS hooks: `data-*` attributes or `js-*` classes — never use styling classes as JS selectors
- IDs: kebab-case, used for ARIA (`aria-labelledby`, `aria-describedby`) and JS anchors

## Key Rules

1. **Never hardcode colors** — always `var(--color-*)` tokens
2. **Mobile-first** — base styles for mobile, override at `600px` / `900px` / `1200px`
3. **No `!important`** — fix specificity with component-level tokens instead
4. **`--transition: 180ms ease`** — use this token for all transitions
5. **Always escape user content** before inserting into `innerHTML`
6. **Every icon button needs `aria-label`**; decorative icons get `aria-hidden="true"`
7. **Dark mode**: every new component must pass visual inspection in `[data-theme="dark"]`

## Available Global JS Utilities (app.js)

```javascript
showToast(message, type, duration?)  // type: 'success'|'error'|'warning'|'info'
openModal(id)
closeModal(id)
toggleTheme()
```

## Adding a New Page

1. Copy navbar + mobile drawer + footer from `index.html`
2. Link all 4 CSS files + `js/app.js`
3. Root wrapper: `<main class="page-top">`
4. Sections: `<section class="section"><div class="container">…</div></section>`
5. Mark current nav link: `class="navbar__link is-active"` + `aria-current="page"`

## File Map

```
index.html          — home / search hero
listings.html       — search results with filters
listing-detail.html — single property detail
post-listing.html   — create a listing form
dashboard.html      — user dashboard
my-listings.html    — manage listings
profile.html        — user profile
messages.html       — messaging
find-agent.html     — agent directory
favourites.html     — saved listings
saved-searches.html — saved search alerts
calculator.html     — mortgage calculator
login.html          — login
signup.html         — signup
admin.html          — admin panel

css/tokens.css      — design tokens (DO NOT remove existing tokens)
css/base.css        — reset + typography + layout helpers
css/components.css  — all reusable components
css/pages.css       — page-specific styles
js/app.js           — shared: theme, nav, toast, modal
js/listings.js      — listings page
js/calculator.js    — mortgage calculator
js/post-listing.js  — post listing form
assets/img/         — static images
assets/img/partials.html — HTML snippets / reference
```

## Skills Available

Use `/rooms-okc-system` for project-specific patterns.
Use `/web-css-tokens` for BEM and CSS token architecture.
Use `/web-a11y` for accessibility patterns.
Use `/web-animations` for CSS motion and transitions.
Use `/web-responsive` for Grid/Flexbox responsive layouts.
Use `/web-vanilla-js` for DOM, events, and fetch patterns.
Use `/web-dark-mode` for theming and dark mode implementation.
