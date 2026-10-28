# CoachDW.com

Strength For Life — the CoachDW home page.

Everything the site serves lives in `public/`:

- `index.html` — the home page
- `site.css` — base styles (most styling sits inline on the page)
- `site.js` — menu, pop-ups, carousel, welcome box, WhatsApp demo and typing banners
- `images/` — logo, signature, photos and the Skool wordmark

Quick settings (members count, welcome pop-up on every visit or first visit only,
carousel timing, banner typing speed) are at the top of `site.js`.

Cloudflare deploys automatically from the `main` branch (settings in `wrangler.jsonc`).
