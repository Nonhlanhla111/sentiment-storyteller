# BookPulse — Sentiment Analyzer Dashboard

A self-contained sentiment analysis dashboard for book reviews. Built as a single-file HTML/JS app and wrapped in a TanStack Start project for deployment.

## Features

- **Overview** — KPIs, sentiment distribution donut, genre ratings, polarity by book, sentiment trend, and top discussion themes.
- **Books** — Per-book sentiment table with polarity bars plus positive-% and rating-vs-polarity charts.
- **Reviews** — Filterable, searchable review feed (by book, sentiment, genre, free text).
- **Live Analyzer** — Paste any text to get polarity, subjectivity, word count, a polarity gauge, and an auto-generated verdict.
- **Report** — Generated narrative insights from the 96-review corpus.

## Tech

- HTML + vanilla JS + [Chart.js](https://www.chartjs.org/) for the dashboard (`public/bookpulse.html`).
- [TanStack Start](https://tanstack.com/start) + React + Vite as the host app shell.
- Tailwind / Shadcn available for future React-native pages.

## Getting started

```bash
bun install
bun run dev
```

Then open the local URL printed in the terminal. The root route embeds the dashboard from `public/bookpulse.html`.

## Project structure

```
public/
  bookpulse.html        # Self-contained dashboard (data + charts + analyzer)
src/
  routes/
    index.tsx           # Root route — embeds the dashboard
    __root.tsx          # App shell
  styles.css            # Global styles
```

## Editing the dashboard

All charts, sample data, and the analyzer logic live inside `public/bookpulse.html`. Open it directly in a browser to iterate without running the dev server.

## License

MIT