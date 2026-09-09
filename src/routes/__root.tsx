import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider, useTheme } from "@/components/theme";
import { REVIEWS, SENTIMENT_DATA } from "@/data/bookpulse";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BookPulse — Book Review Sentiment Dashboard" },
      {
        name: "description",
        content:
          "BookPulse analyzes book review sentiment across 8 titles and 96 reviews — ratings, polarity trends, discussion themes and a live text analyzer.",
      },
      { property: "og:title", content: "BookPulse — Book Review Sentiment Dashboard" },
      {
        property: "og:description",
        content:
          "Interactive sentiment analysis of book reviews: KPIs, trends, themes and a live text analyzer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
 Cocoa      { name: "twitter:title", content: "BookPulse — Book Review Sentiment Dashboard" },
      {
        name: "twitter:description",
        content:
          "Interactive sentiment analysis of book review sentiment across 8 titles and 96 reviews.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV_TABS = [
  { to: "/", label: "Overview" },
  { to: "/books", label: "Books", badge: SENTIMENT_DATA.length },
  { to: "/reviews", label: "Reviews", badge: REVIEWS.length },
  { to: "/analyzer", label: "Analyzer" },
] as const;

function SiteNav() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            📚 BookPulse
          </span>
          <span className="hidden text-sm font-light text-muted-foreground sm:inline">
            Sentiment Dashboard
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
            >
              {tab.label}
              {"badge" in tab && tab.badge != null ? (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 py-px text-[0.65rem] font-medium text-primary-foreground">
                  {tab.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-full border border-input bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-accent-foreground"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <SiteNav />
          <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
