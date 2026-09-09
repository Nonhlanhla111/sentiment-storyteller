export interface AnalysisResult {
  polarity: number;
  subjectivity: number;
  sentiment: "positive" | "neutral" | "negative";
  wordCount: number;
}

const POSITIVE_WORDS = [
  "beautiful", "amazing", "excellent", "outstanding", "wonderful", "brilliant",
  "fantastic", "incredible", "exceptional", "magnificent", "superb", "perfect",
  "love", "loved", "great", "good", "best", "masterpiece", "moving", "touching",
  "profound", "insightful", "gripping", "compelling", "fascinating", "engaging",
  "powerful", "delightful", "joyful", "inspired", "transformative", "remarkable",
  "extraordinary", "stellar", "captivating", "uplifting", "thought-provoking",
  "luminous", "immersive",
];

const NEGATIVE_WORDS = [
  "terrible", "awful", "dreadful", "horrible", "disappointing", "boring",
  "tedious", "slow", "slog", "unpleasant", "frustrating", "manipulative",
  "shallow", "simplistic", "exhausting", "repetitive", "predictable",
  "overrated", "overhyped", "cheap", "confused", "unconvincing", "incoherent",
  "poor", "bad", "worst", "hate", "hated", "struggled", "failed", "mess",
  "unsatisfying", "nihilistic", "cold", "empty",
];

const INTENSIFIERS = [
  "very", "extremely", "absolutely", "completely", "totally", "utterly",
  "genuinely", "truly", "deeply", "incredibly", "exceptionally", "particularly",
  "remarkably",
];

const NEGATORS = [
  "not", "never", "no", "without", "barely", "hardly", "scarcely", "didn't",
  "couldn't", "wouldn't", "wasn't", "aren't", "isn't",
];

export function analyzeSentiment(text: string): AnalysisResult {
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  let score = 0;
  let subjScore = 0;
  let matches = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = i > 0 ? words[i - 1] : "";
    const prev2 = i > 1 ? words[i - 2] : "";
    const negated = NEGATORS.includes(prev) || NEGATORS.includes(prev2);
    const intensified = INTENSIFIERS.includes(prev) || INTENSIFIERS.includes(prev2);

    let wScore = 0;
    if (POSITIVE_WORDS.includes(w)) wScore = intensified ? 0.35 : 0.2;
    if (NEGATIVE_WORDS.includes(w)) wScore = intensified ? -0.35 : -0.2;
    if (wScore !== 0) {
      if (negated) wScore *= -0.7;
      score += wScore;
      subjScore += Math.abs(wScore) * 1.4;
      matches++;
    }
  }

  const polarity =
    matches > 0
      ? Math.max(-1, Math.min(1, (score / Math.max(1, matches)) * 2.5))
      : 0;
  const subjectivity =
    matches > 0 ? Math.min(1, (subjScore / Math.max(1, wordCount)) * 3) : 0.1;
  const sentiment =
    polarity >= 0.15 ? "positive" : polarity <= -0.1 ? "negative" : "neutral";

  return { polarity, subjectivity, sentiment, wordCount };
}

export const SAMPLE_TEXTS: { label: string; text: string }[] = [
  {
    label: "Positive review",
    text: "A beautifully written masterpiece. The prose flows effortlessly and the emotional depth genuinely moved me to tears. An unforgettable reading experience.",
  },
  {
    label: "Negative review",
    text: "Found the pacing glacial and the characters unconvincing. The ending felt rushed and disappointing after such a long, slow build-up.",
  },
  {
    label: "Neutral review",
    text: "Decent enough read. Nothing particularly groundbreaking but competently written. Some chapters were stronger than others.",
  },
  {
    label: "Mixed review",
    text: "Absolutely gripping and dark — loved the unreliable narrator but the ending left me cold and frustrated. Can't decide if I liked it.",
  },
];

export function verdictFor(r: AnalysisResult): string {
  const p = (r.polarity >= 0 ? "+" : "") + r.polarity.toFixed(3);
  switch (r.sentiment) {
    case "positive":
      return `This text carries a positive tone (polarity ${p}). The language suggests an overall favourable and encouraging sentiment. Subjectivity at ${r.subjectivity.toFixed(2)} indicates ${r.subjectivity > 0.6 ? "an opinionated, personal perspective" : "a relatively balanced, measured assessment"}.`;
    case "negative":
      return `This text carries a negative tone (polarity ${r.polarity.toFixed(3)}). The language signals dissatisfaction or critical sentiment. Subjectivity at ${r.subjectivity.toFixed(2)} suggests ${r.subjectivity > 0.6 ? "a strongly personal, emotive response" : "a fairly restrained critical perspective"}.`;
    default:
      return `This text has a neutral tone (polarity ${p}), sitting between clearly positive and negative. This could reflect a balanced assessment, mixed feelings, or largely factual language. Subjectivity at ${r.subjectivity.toFixed(2)} points to ${r.subjectivity > 0.5 ? "some personal viewpoint" : "an objective, factual framing"}.`;
  }
}
