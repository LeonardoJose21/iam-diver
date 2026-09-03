# I Am Diver — landing page

A real, runnable React project (Vite), not a standalone HTML file.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. `npm run build` produces a static
`dist/` folder you can deploy anywhere (Netlify, Vercel, GitHub Pages,
or your own server).

## Where things live

- `src/IAmDiverLanding.jsx` — the whole page. All copy lives in the
  `DICT` object near the top (Spanish/English/German).
- `index.html` — page `<title>`, meta description, Open Graph tags,
  and a LocalBusiness JSON-LD block for SEO. Edit the placeholders
  before shipping.

## Before you launch — replace these placeholders

1. **Prices** — every course price is an illustrative "from $X"
   placeholder. Search `DICT` for `price:` in all three languages.
2. **Review** — the testimonial in the Reviews section is a template.
   Swap in a real, verified Google or TripAdvisor review (`reviews.quote`
   in each language block).
3. **Photos** — `IMAGES.reef` and `IMAGES.diver` near the top of
   `IAmDiverLanding.jsx` currently point to free-license Unsplash stock
   (credited on-page), not photos of your shop. Replace the two URLs
   with your own images, or drop files into `src/assets/` and import
   them instead of using remote URLs.
4. **Trust strip numbers** — the credentials strip under the hero has
   placeholder dashes for rating and years of experience
   (`trust.rating`, `trust.experience` in `DICT`). Fill in real numbers.
5. **JSON-LD in `index.html`** — add your real `geo` coordinates,
   a logo/photo URL, and your review rating once you have one.

## Notes on SEO

This is a client-rendered single-page app, which is a real limitation
for SEO: search engines see one `<title>`/meta description regardless
of which language a visitor selects, and there's no per-language URL
(`/es`, `/en`, `/de`) for Google to index separately. For serious
multilingual SEO, migrate this component into Next.js or Astro with
language-specific routes and per-route metadata. This Vite setup is
the fastest way to preview and deploy the design as-is.
