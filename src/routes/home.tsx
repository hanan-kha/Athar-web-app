import { createFileRoute, Link } from "@tanstack/react-router";
import { Menu, MapPin, Lock, Heart, Calendar, User } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { news } from "@/lib/seed";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Athar" },
      { name: "description", content: "Stay connected to Palestinian heritage and community." },
      { property: "og:title", content: "Home — Athar" },
      { property: "og:description", content: "Live news, events, marketplace and your heritage vault — all in one place." },
    ],
  }),
  component: HomePage,
});

const quickAccess = [
  { to: "/map", label: "Explore Map", icon: MapPin },
  { to: "/vault", label: "Vault", icon: Lock },
  { to: "/donate", label: "Donate", icon: Heart },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/account", label: "Account", icon: User },
] as const;

function HomePage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="bg-brand text-brand-foreground rounded-b-3xl px-6 pt-12 pb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button className="size-10 rounded-xl bg-white/15 flex items-center justify-center" aria-label="Menu">
            <Menu className="size-5" />
          </button>
          <div className="size-11 rounded-full bg-cream text-brand font-serif font-bold text-lg flex items-center justify-center">
            A
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight">Welcome Back</h1>
        <p className="text-brand-foreground/80 mt-1.5 text-sm">
          Stay connected to our heritage and community
        </p>
        <p className="font-arabic text-sm mt-1 text-brand-foreground/90">مرحبًا بعودتك</p>
      </div>

      {/* Quick access */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-md p-5">
          <div className="grid grid-cols-3 gap-3">
            {quickAccess.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="flex flex-col items-center gap-2 rounded-2xl bg-cream hover:bg-beige transition p-3 aspect-square justify-center"
              >
                <div className="size-11 rounded-xl bg-card text-brand flex items-center justify-center shadow-sm">
                  <q.icon className="size-5" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {q.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Live news */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-bold">Live News from Gaza</h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-live/10 text-live text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-live animate-pulse" />
            Live
          </span>
        </div>

        <div className="-mx-5 px-5 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
          {news.map((n) => (
            <article
              key={n.id}
              className="snap-start shrink-0 w-64 bg-card rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative h-36">
                <img src={n.image} alt={n.title} loading="lazy" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/55 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur">
                  {n.timeAgo}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">{n.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5">By {n.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-brand-foreground p-5 shadow-md">
          <p className="text-xs uppercase tracking-wider opacity-80">Featured</p>
          <h3 className="font-serif text-lg font-bold mt-1">Preserve your family archive</h3>
          <p className="text-sm opacity-90 mt-1">
            Securely store land deeds, photos and oral histories in your private vault.
          </p>
          <Link
            to="/vault"
            className="mt-4 inline-flex items-center bg-white/15 hover:bg-white/25 transition px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Open Vault
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
