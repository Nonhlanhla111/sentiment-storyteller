import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  value,
  label,
  valueClass,
}: {
  value: string;
  label: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-4 text-center shadow-sm">
      <div
        className={cn(
          "font-display text-3xl font-bold leading-none",
          valueClass,
        )}
      >
        {value}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <h3 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-4 mt-8 flex items-baseline gap-3 first:mt-0">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {sub ? (
        <span className="text-sm text-muted-foreground">{sub}</span>
      ) : null}
    </div>
  );
}

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("text-gold tracking-tight", className)}>
      {"★".repeat(n)}
      {"☆".repeat(Math.max(0, 5 - n))}
    </span>
  );
}

const BADGE_STYLES: Record<string, string> = {
  positive:
    "bg-sent-positive-bg text-sent-positive border border-sent-positive/30",
  "Positive":
    "bg-sent-positive-bg text-sent-positive border border-sent-positive/30",
  negative:
    "bg-sent-negative-bg text-sent-negative border border-sent-negative/30",
  "Negative":
    "bg-sent-negative-bg text-sent-negative border border-sent-negative/30",
  neutral:
    "bg-sent-neutral-bg text-sent-neutral border border-sent-neutral/30",
  Mixed: "bg-sent-neutral-bg text-sent-neutral border border-sent-neutral/30",
};

export function SentimentBadge({
  sentiment,
  className,
}: {
  sentiment: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        BADGE_STYLES[sentiment] ?? BADGE_STYLES.Mixed,
        className,
      )}
    >
      {sentiment}
    </span>
  );
}

export function PolarityBar({
  polarity,
  className,
}: {
  polarity: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, ((polarity + 1) / 2) * 100));
  const color =
    polarity >= 0.15
      ? "bg-sent-positive"
      : polarity <= -0.1
        ? "bg-sent-negative"
        : "bg-sent-neutral";
  return (
    <div
      className={cn(
        "inline-block h-2 w-20 overflow-hidden rounded-full bg-secondary align-middle",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-[width]", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function polarTextClass(polarity: number): string {
  if (polarity >= 0.15) return "text-sent-positive";
  if (polarity <= -0.1) return "text-sent-negative";
  return "text-sent-neutral";
}
