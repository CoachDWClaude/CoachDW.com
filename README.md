# CoachDW.com

Strength For Life — the CoachDW home page.

Everything the site serves lives in `public/`:

- `index.html` — the home page
- `site.css` — base styles (most styling sits inline on the page)
- `site.js` — menu, pop-ups, carousel, welcome box, WhatsApp demo and typing banners
- `images/` — logo, signature, photos and the Skool wordmark
- `demo/index.html` — SFL App - Demo (shareable, example data) at /demo
- `app/index.html` — SFL - NEW, the live app, at /app

Quick settings (members count, welcome pop-up on every visit or first visit only,
carousel timing, banner typing speed) are at the top of `site.js`.

Cloudflare deploys automatically from the `main` branch (settings in `wrangler.jsonc`).

## Editing the home page, one section at a time

The home page is built from small files, so you only ever look at one section:

- `src/sections/` — one file per section (header, hero, Triple Whammy, Join the tribe, membership, articles, testimonial, about, final CTA, footer)
- `src/popups/` — the welcome, Triple Whammy and floating-button pop-ups
- `src/partials/cta-break.html` — the Join the tribe button on black used as the section break
- `src/page.txt` — the order of sections and where the breaks (`BREAK`) go

After editing, run `python3 tools/build.py` to rebuild `public/index.html`.
`python3 tools/build.py --preview DIR` makes a preview copy with a section picker and font switch.
