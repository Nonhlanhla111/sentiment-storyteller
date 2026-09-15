import { createFileRoute } from "@tanstack/react-router";
import { SENTIMENT_DATA } from "@/data/bookpulse";
import {
  PositivePctBar,
  RatingPolarityScatter,
} from "@/components/bookpulse/charts";
import {
  ChartCard,
  SectionHead,
  SentimentBadge,
  Stars,
  PolarityBar,
  polarTextClass,
} from "@/components/bookpulse/ui";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Books — BookPulse Sentiment Dashboard" },
      {
        name: "description",
        content:
          "Per-book sentiment summary: ratings, polarity bars, sentiment split and a rating-vs-polarity scatter for 8 titles.",
      },
      { property: "og:title", content: "Books — BookPulse Sentiment Dashboard" },
      {
        property: "og:description",
        content:
          "Per-book sentiment summary with polarity bars and rating-vs-polarity scatter for 8 titles.",
      },
    ],
  }),
  component: Books,
});

const GENRE_LABEL: Record<string, string> = {
  "Sci-Fi": "bg-secondary text-muted-foreground",
};

function Books() {
  const sorted = [...SENTIMENT_DATA].sort((a, b) => b.avg_rating - a.avg_rating);

  return (
    <div className="animate-fade-up">
      <SectionHead
        title="Book sentiment summary"
        sub={`${SENTIMENT_DATA.length} titles · ${SENTIMENT_DATA.reduce((s, b) => s + b.total_reviews, 0)} reviews`}
      />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 text-left text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Genre</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Polarity</th>
                <th className="px-4 py-3 text-center font-medium">Sentiment %</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr
                  key={b.book_id}
                  className="border-b transition-colors last:border-0 hover:bg-secondary"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-muted-foreground">{b.author}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      {b.genre}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Stars n={Math.round(b.avg_rating)} />{" "}
                    <span className="text-xs text-muted-foreground">
                      {b.avg_rating.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PolarityBar polarity={b.avg_polarity} />
                      <span
                        className={`text-xs font-medium ${polarTextClass(b.avg_polarity)}`}
                      >
                        {b.avg_polarity >= 0 ? "+" : ""}
                        {b.avg_polarity.toFixed(3)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="mx-auto flex w-[100px] gap-0.5" aria-hidden>
                      <div className="rounded-sm bg-sent-positive" style={{ flex: b.positive_pct }} />
                      <div className="rounded-sm bg-sent-neutral" style={{ flex: b.neutral_pct }} />
                      <div className="rounded-sm bg-sent-negative" style={{ flex: b.negative_pct }} />
                    </div>
                    <div className="mt-1 text-[0.7rem] text-muted-foreground">
                      <span className="text-sent-positive">{b.positive_pct}%</span> ·{" "}
                      <span className="text-sent-neutral">{b.neutral_pct}%</span> ·{" "}
                      <span className="text-sent-negative">{b.negative_pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <SentimentBadge sentiment={b.overall_sentiment} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ChartCard title="Positive % by book">
          <PositivePctBar />
        </ChartCard>
        <ChartCard title="Rating vs polarity scatter">
          <RatingPolarityScatter />
        </ChartCard>
      </div>
    </div>
  );
}
