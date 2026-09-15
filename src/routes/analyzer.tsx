import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  analyzeSentiment,
  SAMPLE_TEXTS,
  verdictFor,
  type AnalysisResult,
} from "@/lib/analyzer";
import { PolarityHistogram, StackedSentimentBar } from "@/components/bookpulse/charts";
import { ChartCard, SectionHead } from "@/components/bookpulse/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Live Analyzer — BookPulse Sentiment Dashboard" },
      {
        name: "description",
        content:
          "Paste any book review or text passage to analyze its sentiment polarity, subjectivity and emotional tone instantly.",
      },
      {
        property: "og:title",
        content: "Live Analyzer — BookPulse Sentiment Dashboard",
      },
      {
        property: "og:description",
        content:
          "Analyze any text's sentiment polarity, subjectivity and emotional tone instantly.",
      },
    ],
  }),
  component: Analyzer,
});

function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const run = () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      setResult(null);
      return;
    }
    setError("");
    setResult(analyzeSentiment(text.trim()));
  };

  const clear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const sentimentLabel = result?.sentiment ?? "";
  const sentimentValueClass =
    sentimentLabel === "positive"
      ? "bg-sent-positive-bg text-sent-positive border-sent-positive/30"
      : sentimentLabel === "negative"
        ? "bg-sent-negative-bg text-sent-negative border-sent-negative/30"
        : sentimentLabel === "neutral"
          ? "bg-sent-neutral-bg text-sent-neutral border-sent-neutral/30"
          : "";

  const gaugePct = result ? ((result.polarity + 1) / 2) * 100 : 50;

  return (
    <div className="animate-fade-up">
      <div className="mb-6 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-medium">Live Sentiment Analyzer</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Enter any book review or text passage below to analyze its sentiment
          polarity, subjectivity, and emotional tone.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type a review here…"
          className="min-h-[110px] resize-y"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try a sample:</span>
          {SAMPLE_TEXTS.map((s) => (
            <button
              key={s.label}
              onClick={() => setText(s.text)}
              className="rounded-full border border-input bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-accent-foreground"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <Button onClick={run}>Analyze</Button>
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
          {error ? (
            <span className="text-sm text-sent-negative">{error}</span>
          ) : null}
        </div>

        {result ? (
          <div className="mt-5">
            <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div
                className={cn(
                  "rounded-lg border px-4 py-3 text-center",
                  sentimentValueClass,
                )}
              >
                <div className="font-display text-2xl font-bold leading-none capitalize">
                  {result.sentiment}
                </div>
                <div className="mt-1.5 text-[0.7rem] uppercase tracking-widest">
                  Sentiment
                </div>
              </div>
              <ResultCard
                value={`${result.polarity >= 0 ? "+" : ""}${result.polarity.toFixed(3)}`}
                label="Polarity"
              />
              <ResultCard
                value={result.subjectivity.toFixed(3)}
                label="Subjectivity"
              />
              <ResultCard
                value={String(result.wordCount)}
                label="Word count"
              />
            </div>

            <div className="relative my-4 h-[18px] rounded-full bg-gradient-to-r from-sent-negative-bg via-secondary to-sent-positive-bg">
              <div
                className="absolute top-0 h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-card bg-primary shadow-md transition-[left] duration-500"
                style={{ left: `${gaugePct}%` }}
                aria-hidden
              />
            </div>
            <div className="flex justify-between text-[0.7rem] text-muted-foreground">
              <span className="text-sent-negative">Very Negative (−1.0)</span>
              <span>Neutral (0)</span>
              <span className="text-sent-positive">Very Positive (+1.0)</span>
            </div>

            <div className="mt-4 rounded-lg border bg-secondary px-4 py-3 text-sm leading-relaxed">
              <span className="mb-0.5 block text-xs uppercase tracking-widest text-muted-foreground">
                Interpretation
              </span>
              {verdictFor(result)}
            </div>
          </div>
        ) : null}
      </div>

      <SectionHead
        title="Dataset sentiment distribution"
        sub="breakdown from the 96-review corpus"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ChartCard title="Sentiment by book (stacked)">
          <StackedSentimentBar />
        </ChartCard>
        <ChartCard title="Polarity distribution histogram">
          <PolarityHistogram />
        </ChartCard>
      </div>
    </div>
  );
}

function ResultCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-accent px-4 py-3 text-center text-accent-foreground">
      <div className="font-display text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1.5 text-[0.7rem] uppercase tracking-widest">{label}</div>
    </div>
  );
}
