# Cognition Onsite Readout — Webpage

A self-contained static webpage rebuilt from `Cognition_Onsite_Readout_Final_v6.docx`
(Onsite — GTM Operations readout: usage forecasting, deal structuring, pricing
strategy). The content and visual design of the source document are preserved —
this is the same readout, rebuilt as a responsive web page for presentation.

## What's here

- `index.html` — the readout page (cover/agenda + three exercise sections with
  callouts, tables and figures)
- `readout.css` — design system faithful to the document (Arial type, warm
  off-white sheet, dark-header tables with zebra rows, tan recommendation callouts)
- `readout.js` — scroll progress bar + active-section nav highlighting
- `assets/` — the document's images (Cognition wordmark + the two figures)

No build step or dependencies — plain HTML/CSS/JS.

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Other files

- `dimension-demo.html` (with `styles.css`, `script.js`, `logo.png`) — an earlier,
  unrelated demo page kept for reference.
