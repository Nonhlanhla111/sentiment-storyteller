# BookPulse — Sentiment Analyzer Dashboard

A sentiment analysis dashboard for book reviews, built as a multi-page
[TanStack Start](https://tanstack.com/start) + React app with Tailwind CSS and
Chart.js.

## Features

- **Overview** (`/`) — KPIs, sentiment distribution donut, genre ratings, polarity by book, sentiment trend, and top discussion themes.
- **Books** (`/books`) — Per-book sentiment table with polarity bars plus positive-% and rating-vs-polarity charts.
- **Reviews** (`/reviews`) — Filterable, searchable review feed (by book, sentiment, genre, free text).
- **Live Analyzer** (`/analyzer`) — Paste any text to get polarity, subjectivity, word count, a polarity gauge, and an auto-generated verdict.
- **Dark mode** — Toggle in the navigation; preference is remembered.

## Tech

- [TanStack Start](https://tanstack.com/start) + React + Vite (file-based routes).
- [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/) for all charts.
- Tailwind CSS v4 with a semantic design-token theme (`src/styles.css`) — Playfair Display headings, DM Sans body.

## Getting started

```bash
bun install
bun run dev
```

## Project structure

```
src/
  data/bookpulse.ts            # 8-book sample corpus (book summaries + 96 reviews)
  lib/analyzer.ts              # Client-side sentiment analyzer (lexicon-based)
  components/
    theme.tsx                  # Dark/light theme provider
    bookpulse/ui.tsx           # Shared UI: KPI cards, badges, stars, polarity bars
    bookpulse/charts.tsx       # All Chart.js chart components (theme-aware)
  routes/
    __root.tsx                 # App shell: navigation, fonts, theme toggle
    index.tsx                  # / — Overview
    books.tsx                  # /books
    reviews.tsx                # /reviews
    analyzer.tsx               # /analyzer
  styles.css                   # Design tokens & global styles
```

## Editing the data

All sample data lives in `src/data/bookpulse.ts`. Charts, KPIs, and the review
feed are computed from that corpus, so edits propagate everywhere automatically.

## License

MIT
