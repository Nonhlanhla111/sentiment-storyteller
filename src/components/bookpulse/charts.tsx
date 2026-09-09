import { useMemo } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, Scatter } from "react-chartjs-2";
import {
  REVIEWS,
  SENTIMENT_DATA,
  type BookSummary,
} from "@/data/bookpulse";
import { useTheme } from "@/components/theme";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

interface Palette {
  positive: string;
  neutral: string;
  negative: string;
  accent: string;
  gold: string;
  ink: string;
  mutedText: string;
  grid: string;
  surface: string;
}

const LIGHT: Palette = {
  positive: "#1a7a4a",
  neutral: "#c9922a",
  negative: "#b03030",
  accent: "#3a2d6e",
  gold: "#c9922a",
  ink: "#1a1a1a",
  mutedText: "#8a8897",
  grid: "#e8e4db",
  surface: "#faf9f6",
};

const DARK: Palette = {
  positive: "#5fd39a",
  neutral: "#e0c264",
  negative: "#f08a8a",
  accent: "#a99cf0",
  gold: "#e0ae52",
  ink: "#f2f0ea",
  mutedText: "#8f8b98",
  grid: "#33313d",
  surface: "#141319",
};

export function useChartPalette(): Palette {
  const { theme } = useTheme();
  return theme === "dark" ? DARK : LIGHT;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function polarityColor(p: number, pal: Palette) {
  return p >= 0.15 ? pal.positive : p <= -0.1 ? pal.negative : pal.neutral;
}

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
} as const;

function monthLabels(): string[] {
  return [...new Set(REVIEWS.map((r) => r.month))].sort().map((m) => {
    const d = new Date(m + "-01");
    return d.toLocaleString("default", { month: "short" });
  });
}

function monthlyPolarity(): number[] {
  const months: Record<string, { sum: number; n: number }> = {};
  REVIEWS.forEach((r) => {
    months[r.month] ??= { sum: 0, n: 0 };
    months[r.month].sum += r.polarity;
    months[r.month].n++;
  });
  return Object.keys(months)
    .sort()
    .map((k) => +(months[k].sum / months[k].n).toFixed(3));
}

export function SentimentDonut() {
  const pal = useChartPalette();
  const totals = useMemo(() => {
    let pos = 0, neu = 0, neg = 0;
    REVIEWS.forEach((r) => {
      if (r.sentiment === "positive") pos++;
      else if (r.sentiment === "negative") neg++;
      else neu++;
    });
    const t = REVIEWS.length;
    return [
      +((pos / t) * 100).toFixed(1),
      +((neu / t) * 100).toFixed(1),
      +((neg / t) * 100).toFixed(1),
    ];
  }, []);

  return (
    <div className="h-[220px]">
      <Doughnut
        aria-label={`Donut chart: ${totals[0]}% positive, ${totals[1]}% neutral, ${totals[2]}% negative`}
        data={{
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              data: totals,
              backgroundColor: [pal.positive, pal.neutral, pal.negative],
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          cutout: "65%",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (c) => `${c.label}: ${c.parsed}%` },
            },
          },
        }}
      />
    </div>
  );
}

export function GenreRatingBar() {
  const pal = useChartPalette();
  const genres = useMemo(() => {
    const byGenre: Record<string, { sum: number; n: number }> = {};
    SENTIMENT_DATA.forEach((b) => {
      byGenre[b.genre] ??= { sum: 0, n: 0 };
      byGenre[b.genre].sum += b.avg_rating;
      byGenre[b.genre].n++;
    });
    return Object.entries(byGenre)
      .map(([g, v]) => ({ g, r: +(v.sum / v.n).toFixed(2) }))
      .sort((a, b) => b.r - a.r);
  }, []);

  return (
    <div className="h-[260px]">
      <Bar
        aria-label="Horizontal bar chart of average ratings by genre"
        data={{
          labels: genres.map((g) => g.g),
          datasets: [
            {
              label: "Avg Rating",
              data: genres.map((g) => g.r),
              backgroundColor: [
                pal.accent,
                pal.positive,
                "#185fa5",
                pal.gold,
                pal.negative,
              ],
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: {
            x: {
              min: 2.5,
              max: 5,
              grid: { color: pal.grid },
              ticks: { stepSize: 0.5 },
            },
            y: { grid: { display: false } },
          },
        }}
      />
    </div>
  );
}

export function PolarityByBookBar() {
  const pal = useChartPalette();
  const sorted = useMemo(
    () => [...SENTIMENT_DATA].sort((a, b) => b.avg_polarity - a.avg_polarity),
    [],
  );
  return (
    <div className="h-[260px]">
      <Bar
        aria-label="Bar chart showing average polarity for each book"
        data={{
          labels: sorted.map((b) => truncate(b.title, 14)),
          datasets: [
            {
              label: "Avg Polarity",
              data: sorted.map((b) => +b.avg_polarity.toFixed(3)),
              backgroundColor: sorted.map((b) =>
                polarityColor(b.avg_polarity, pal),
              ),
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: pal.grid }, ticks: { stepSize: 0.1 } },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 }, color: pal.mutedText },
            },
          },
        }}
      />
    </div>
  );
}

export function TrendLine() {
  const pal = useChartPalette();
  const labels = monthLabels();
  const values = monthlyPolarity();
  return (
    <div className="h-[220px]">
      <Line
        aria-label="Line chart of average monthly sentiment polarity across 2025"
        data={{
          labels,
          datasets: [
            {
              label: "Avg Polarity",
              data: values,
              borderColor: pal.accent,
              backgroundColor: pal.theme_gone,
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointBackgroundColor: pal.accent,
              borderWidth: 2,
            } as never,
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: pal.grid }, ticks: { stepSize: 0.05 } },
            x: { grid: { display: false } },
          },
        }}
      />
    </div>
  );
}

export function ThemeMentionsBar() {
  const pal = useChartPalette();
  const themes = useMemo(() => {
    const counts: Record<string, { m: number; pos: number }> = {};
    REVIEWS.forEach((r) => {
      r.themes.split(";").forEach((t) => {
        const name = t.trim();
        if (!name || name === "General") return;
        counts[name] ??= { m: 0, pos: 0 };
        counts[name].m++;
        if (r.sentiment === "positive") counts[name].pos++;
      });
    });
    return Object.entries(counts)
      .map(([t, v]) => ({
        t,
        m: v.m,
        pos: Math.round((v.pos / v.m) * 100),
      }))
      .sort((a, b) => b.m - a.m || b.pos - a.pos)
      .slice(0, 5);
  }, []);

  return (
    <div className="h-[200px]">
      <Bar
        aria-label="Bar chart of top reader discussion themes"
        data={{
          labels: themes.map((t) => t.t),
          datasets: [
            {
              label: "Mentions",
              data: themes.map((t) => t.m),
              backgroundColor: pal.accent,
              borderWidth: 0,
              borderRadius: 4,
              yAxisID: "y",
            },
            {
              label: "Positive %",
              data: themes.map((t) => t.pos),
              backgroundColor: `${pal.positive}40`,
              borderColor: pal.positive,
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: "y2",
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: pal.grid },
              title: { display: true, text: "Mentions", font: { size: 11 } },
            },
            y2: {
              position: "right",
              min: 0,
              max: 100,
              grid: { display: false },
              title: { display: true, text: "Positive %", font: { size: 11 } },
            },
            x: { grid: { display: false } },
          },
        }}
      />
    </div>
  );
}

export function PositivePctBar() {
  const pal = useChartPalette();
  const sorted = useMemo(
    () => [...SENTIMENT_DATA].sort((a, b) => b.positive_pct - a.positive_pct),
    [],
  );
  return (
    <div className="h-[280px]">
      <Bar
        aria-label="Horizontal bar chart of positive sentiment percentage per book"
        data={{
          labels: sorted.map((b) => truncate(b.title, 16)),
          datasets: [
            {
              label: "Positive %",
              data: sorted.map((b) => b.positive_pct),
              backgroundColor: sorted.map((b) =>
                b.positive_pct >= 75
                  ? pal.positive
                  : b.positive_pct >= 50
                    ? pal.accent
                    : pal.negative,
              ),
              borderWidth: 0,
              borderRadius: 4,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          indexAxis: "y",
          plugins: { legend: { display: false } },
          scales: {
            x: {
              min: 0,
              max: 105,
              grid: { color: pal.grid },
              ticks: { callback: (v) => `${v}%`, color: pal.mutedText },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 11 }, color: pal.mutedText },
            },
          },
        }}
      />
    </div>
  );
}

export function RatingPolarityScatter() {
  const pal = useChartPalette();
  return (
    <div className="h-[280px]">
      <Scatter
        aria-label="Scatter chart of rating vs polarity score for each book"
        data={{
          datasets: [
            {
              label: "Books",
              data: SENTIMENT_DATA.map((b) => ({
                x: b.avg_polarity,
                y: b.avg_rating,
                title: b.title,
              })),
              backgroundColor: SENTIMENT_DATA.map((b) =>
                b.overall_sentiment === "Mixed" ? pal.negative : pal.accent,
              ),
              pointRadius: 8,
              pointHoverRadius: 10,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (c) =>
                  `${(c.raw as { title: string }).title}: polarity ${(c.raw as { x: number }).x.toFixed(3)}, rating ${(c.raw as { y: number }).y}`,
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Avg polarity" },
              grid: { color: pal.grid },
            },
            y: {
              min: 2.5,
              max: 5,
              title: { display: true, text: "Avg rating" },
              grid: { color: pal.grid },
              ticks: { stepSize: 0.5 },
            },
          },
        }}
      />
    </div>
  );
}

export function StackedSentimentBar() {
  const pal = useChartPalette();
  return (
    <div className="h-[300px]">
      <Bar
        aria-label="Stacked bar chart showing positive, neutral, and negative review counts per book"
        data={{
          labels: SENTIMENT_DATA.map((b) => truncate(b.title, 12)),
          datasets: [
            {
              label: "Positive",
              data: SENTIMENT_DATA.map((b: BookSummary) => b.positive_count),
              backgroundColor: pal.positive,
              borderWidth: 0,
              borderRadius: 2,
            },
            {
              label: "Neutral",
              data: SENTIMENT_DATA.map((b) => b.neutral_count),
              backgroundColor: pal.neutral,
              borderWidth: 0,
            },
            {
              label: "Negative",
              data: SENTIMENT_DATA.map((b) => b.negative_count),
              backgroundColor: pal.negative,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { size: 10 }, color: pal.mutedText },
            },
            y: { stacked: true, grid: { color: pal.grid } },
          },
          plugins: {
            legend: {
              position: "top",
              labels: { boxWidth: 12, font: { size: 11 } },
            },
          },
        }}
      />
    </div>
  );
}

export function PolarityHistogram() {
  const pal = useChartPalette();
  const { labels, counts } = useMemo(() => {
    const bins = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1];
    const counts = new Array(bins.length - 1).fill(0);
    REVIEWS.forEach((r) => {
      for (let i = 0; i < bins.length - 1; i++) {
        if (r.polarity >= bins[i] && r.polarity < bins[i + 1]) {
          counts[i]++;
          break;
        }
      }
      if (r.polarity === 1) counts[counts.length - 1]++;
    });
    return {
      labels: bins
        .slice(0, -1)
        .map((b, i) => `${b.toFixed(1)} to ${bins[i + 1].toFixed(1)}`),
      counts,
    };
  }, []);

  return (
    <div className="h-[300px]">
      <Bar
        aria-label="Histogram of polarity score distribution across all reviews"
        data={{
          labels,
          datasets: [
            {
              label: "Reviews",
              data: counts,
              backgroundColor: labels.map((l) =>
                polarityColor(parseFloat(l.split(" to ")[0]), pal),
              ),
              borderWidth: 0,
              borderRadius: 3,
            },
          ],
        }}
        options={{
          ...BASE_OPTIONS,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, maxRotation: 45 },
            },
            y: {
              grid: { color: pal.grid },
              title: { display: true, text: "Review count", font: { size: 11 } },
            },
          },
        }}
      />
    </div>
  );
}
