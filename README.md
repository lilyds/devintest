# Dimension Blog — Redesign

A modern, responsive redesign of the [Dimension blog page](https://getdimension.com/blog), built as a self-contained static site.

## What's here

- `index.html` — page markup (header, hero, featured post, filters, article grid, newsletter, footer)
- `styles.css` — design system (tokens, components, responsive layout)
- `script.js` — article data + interactions (category filtering, live search, scroll reveals, sticky header, mobile nav)

No build step or dependencies — it's plain HTML/CSS/JS.

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design highlights vs. the original

- Brand-aligned green/sustainability palette with a gradient hero
- Featured-article spotlight above a responsive 3-column card grid
- Live search and category filter chips
- Article metadata (author, date, read time) and tag badges
- Sticky blurred header, scroll-reveal animations, full mobile responsiveness
- Newsletter call-to-action and a structured footer
