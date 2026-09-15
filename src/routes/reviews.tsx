import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { REVIEWS } from "@/data/bookpulse";
import {
  SectionHead,
  SentimentBadge,
  Stars,
} from "@/components/bookpulse/ui";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — BookPulse Sentiment Dashboard" },
      {
        name: "description",
        content:
          "Searchable, filterable feed of 96 book reviews with sentiment, polarity, stars and discussion themes.",
      },
      { property: "og:title", content: "Reviews — BookPulse Sentiment Dashboard" },
      {
        property: "og:description",
        content:
          "Searchable, filterable feed of 96 book reviews with sentiment, polarity and themes.",
      },
    ],
  }),
  component: Reviews,
});

const BOOKS = [...new Set(REVIEWS.map((r) => r.title))].sort();
const GENRES = [...new Set(REVIEWS.map((r) => r.genre))].sort();
const SENTIMENTS = ["positive", "neutral", "negative"] as const;

const POLARITY_PILL: Record<string, string> = {
  positive: "bg-sent-positive-bg text-sent-positive",
  negative: "bg-sent-negative-bg text-sent-negative",
  neutral: "bg-sent-neutral-bg text-sent-neutral",
};

function Reviews() {
  const [book, setBook] = useState<string>("all");
  const [sentiment, setSentiment] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return REVIEWS.filter((r) => {
      if (book !== "all" && r.title !== book) return false;
      if (sentiment !== "all" && r.sentiment !== sentiment) return false;
      if (genre !== "all" && r.genre !== genre) return false;
      if (
        q &&
        !r.review_text.toLowerCase().includes(q) &&
        !r.title.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [book, sentiment, genre, query]);

  return (
    <div className="animate-fade-up">
      <SectionHead title="Review feed" sub="filter and search the corpus" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={book} onValueChange={setBook}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="All books" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All books</SelectItem>
            {BOOKS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sentiment} onValueChange={setSentiment}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All sentiments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sentiments</SelectItem>
            {SENTIMENTS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reviews…"
          className="min-w-[180px] sm:max-w-xs"
        />
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        Showing {filtered.length} of {REVIEWS.length} reviews
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          No reviews match these filters. Try clearing the search or picking a
          different book.
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <article
              key={`${r.book_id}-${r.date}-${i}`}
              className="flex flex-col gap-2.5 rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium leading-snug">{r.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {r.author} · {r.genre} · {r.date.slice(0, 7)}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <Stars n={r.stars} className="text-sm" />
                  <div className="mt-1">
                    <SentimentBadge sentiment={r.sentiment} />
                  </div>
                </div>
              </div>
              <blockquote className="text-sm italic leading-relaxed text-muted-foreground">
                “{r.review_text}”
              </blockquote>
              <div className="flex flex-wrap gap-1">
                {r.themes
                  .split(";")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="rounded-full border bg-secondary px-2 py-0.5 text-[0.7rem] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                <span>
                  {r.word_count} words · subjectivity {r.subjectivity.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    POLARITY_PILL[r.sentiment],
                  )}
                >
                  {r.polarity >= 0 ? "+" : ""}
                  {r.polarity.toFixed(3)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
