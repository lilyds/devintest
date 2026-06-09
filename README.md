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

## AE Targets dashboard (Exercise 1 demo)

A "playable" monthly AE sales-target dashboard, styled after a Dimension-style finance
portal. Replays April 2026 from real weekly consumption data.

- `ae-dashboard.html` — AE roster (AE1–AE10 + total): Last Month ACU, ACU MTD, ACU
  Pacing, ACU Target, ACU Goal %, Unit Pricing, Revenue MTD. Color-coded goal pills,
  pacing bars, KPI strip, and an "as of" day slider (▶ to play the month) that
  recomputes MTD/pacing live. Double-click an AE row to drill in.
- `ae-detail.html?ae=AE1` — that AE's account book, grouped by Deal Phase (lifecycle
  order) with subtotals, sorted by Last Month ACU ▼ within each phase.
- `ae-dashboard.css`, `ae-dashboard.js` — styling + logic.
- `ae_data.json` — precomputed per-account data built by `build_data.py` from the
  consumption workbook (March/April totals match the model exactly). Targets =
  model-style April forecast × stage stretch; daily shape is simulated from each
  account's 4 April weekly buckets (full-month totals stay exact).

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Other files

- `dimension-demo.html` (with `styles.css`, `script.js`, `logo.png`) — an earlier,
  unrelated demo page kept for reference.
