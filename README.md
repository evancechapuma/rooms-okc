# Rooms OKC — Frontend

Production-ready, framework-free frontend for a real estate marketplace. Vanilla HTML/CSS/JS, ready to wire to a Django backend.

## Pages
- `index.html` — landing (hero, categories, featured, how-it-works, CTA)
- `listings.html` — browse + client-side filter/sort (`js/listings.js`)
- `listing-detail.html` — gallery, lightbox, key facts, contact card, inquiry/report modals
- `post-listing.html` — 4-step create-listing wizard (`js/post-listing.js`)
- `login.html` / `signup.html` — split auth layout with validation
- `dashboard.html` — overview: stats, activity, quick actions
- `my-listings.html` — Active/Paused/Expired tabs + actions
- `favourites.html` — saved grid with remove + undo
- `saved-searches.html` — criteria chips + alert frequency
- `messages.html` — two-pane chat with composer
- `profile.html` — settings, notifications, danger zone
- `calculator.html` — affordability calculator (`js/calculator.js`)
- `admin.html` — moderation: pending, flagged, users

## Structure
- `css/tokens.css` — design tokens (light/dark)
- `css/base.css` — reset, typography, utilities
- `css/components.css` — buttons, cards, forms, navbar, modals, toasts…
- `css/pages.css` — page-specific layouts
- `js/app.js` — theme, navbar, modals, tabs, toasts, favourites (loaded on every page)
- `assets/img/favicon.svg`
- `assets/partials.html` — copy/paste navbar + footer reference for Django `{% include %}`

## Django integration notes
- Replace navbar/footer with `{% include %}` partials (see `assets/partials.html`).
- Swap `https://picsum.photos/...` placeholders for real media URLs.
- Replace inline mock data in `js/listings.js` / `favourites.html` with API/template data.
- `data-auth-only` / `data-guest-only` hooks mark elements to toggle by auth state.
- Dark mode persists via `localStorage('theme')`; anti-FOUC script runs in each `<head>`.
