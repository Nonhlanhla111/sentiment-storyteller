import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  REVIEWS,
  SENTIMENT_DATA,
} from "@/data/bookpulse";
import {
  GenreRatingBar,
  PolarityByBookBar,
  SentimentDonut,
  ThemeMentionsBar,
  TrendLine,
} from "@/components/bookpulse/charts";
import {
  ChartCard,
  KpiCard,
  SectionHead,
} from "@/components/bookpulse/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookPulse — Book Review Sentiment Dashboard" },
      {
        name: "description",
        content:
          "Sentiment overview of 96 book reviews across 8 titles: KPIs, sentiment distribution, genre ratings, polarity trends and top discussion themes.",
      },
      { property: "og:title", content: "BookPulse — Book Review Sentiment Dashboard" },
      {
        property: "og:description",
        content:
          "Sentiment overview of 96 book reviews across 8 titles — KPIs, trends and top discussion themes.",
      },
    ],
  }),
  component: Overview,
});

const INSIGHTS = [
  {
    icon: "🏆",
    label: "Top performer",
    text: "Project Hail Mary: 4.50★, 100% positive, polarity +0.462",
  },
  {
    icon: "⚡",
    label: "Most polarising",
    text: "Gone Girl: 50% positive vs 42% negative — strongly divided readers",
  },
  {
    icon: "📈",
    label: "Sentiment trend",
    text: "Polarity rose from +0.207 → +0.282 over 12 months — improving",
  },
  {
    icon: "📖",
    label: "Genre leader",
    text: "Sci-Fi tops all genres: 4.17★ avg and 83% positive reviews",
  },
  {
    icon: "💬",
    label: "Peak volume",
    text: "March 2025 was the busiest month with 9 reviews published",
  },
  {
    icon: "🎯",
    label: "Highest engagement",
    text: "Emotional Impact theme: 81% positive — most resonant discussion topic",
  },
];

function Overview() {
  const kpis = useMemo(() => {
    let pos = 0, neu = 0, neg = 0, polSum = 0;
    REVIEWS.forEach((r) => {
      if (r.sentiment === "positive") pos++;
      else if (r.sentiment === "negative") neg++;
      else neu++;
      polSum += r.polarity;
    });
    const total = REVIEWS.length;
    const pct = (n: number) => +((n / total) * 100).toFixed(1);
    const avgRating =
      SENTIMENT_DATA.reduce((s, b) => s + b.avg_rating, 0) /
      SENTIMENT_DATA.length;
    return {
      positive: pct(pos),
      neutral: pct(neu),
      negative: pct(neg),
      rating: (avgRating).toFixed(2),
      polarity: (polSum / total).toFixed(3),
      reviews: total,
    };
  }, []);

  return (
    <div className="animate-fade-up">
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard value={`${kpis.positive}%`} label="Positive" valueClass="text-sent-positive" />
        <KpiCard value={`${kpis.neutral}%`} label="Neutral" valueClass="text-sent-neutral" />
        <KpiCard value={`${kpis.negative}%`} label="Negative" valueClass="text-sent-negative" />
        <KpiCard value={`${kpis.rating}★`} label="Avg Rating" valueClass="text-gold" />
        <KpiCard value={`+${kpis.polarity}`} label="Avg Polarity" valueClass="text-primary" />
        <KpiCard value={String(kpis.reviews)} label="Reviews" valueClass="text-muted-foreground" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <ChartCard title="Sentiment distribution">
          <SentimentDonut />
        </ChartCard>
        <ChartCard title="Average rating by genre">
          <GenreRatingBar />
        </ChartCard>
        <ChartCard title="Polarity score by book">
          <PolarityByBookBar />
        </ChartCard>
        <ChartCard title="Sentiment trend over time">
          <TrendLine />
        </ChartCard>
      </div>

      <SectionHead title="Top discussed themes" sub="by mention count and positivity" />
      <div className="mb-6">
        <ChartCard>
          <ThemeMentionsBar />
        </ChartCard>
      </div>

      <SectionHead title="Key insights" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INSIGHTS.map((i) => (
          <div
            key={i.label}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 text-2xl">{i.icon}</div>
            <div className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {i.label}
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              {i.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
