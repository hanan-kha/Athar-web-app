import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { Search, Plus, Minus, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";
import { MOCK_LOCATIONS } from "@/lib/mockData";
import type { DbLocation } from "@/lib/mockData";
import { LocationSheet } from "@/components/athar/LocationSheet";

const LeafletMap = lazy(() => import("@/components/athar/LeafletMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Explore Palestine — Athar" },
      { name: "description", content: "Discover Palestinian heritage sites, museums and historic places on an interactive map." },
    ],
  }),
  component: MapPage,
});

const tileLayers = {
  Default: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "&copy; OpenStreetMap" },
  Satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri" },
  Terrain: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", attr: "&copy; OpenTopoMap" },
} as const;

type View = keyof typeof tileLayers;

function MapPage() {
  const [view, setView] = useState<View>("Default");
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const filtered = MOCK_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      (l.name_ar ?? "").includes(query),
  );

  const selected = selectedId ? MOCK_LOCATIONS.find((l) => l.id === selectedId) ?? null : null;

  return (
    <AppShell>
      <PageHeader title="Explore Palestine" back="/home" />

      <div className="px-5 -mt-4 relative z-10">
        <div className="flex items-center bg-card rounded-2xl shadow-md px-3 h-12">
          <Search className="size-5 text-muted-foreground mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2">
        {(Object.keys(tileLayers) as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 h-9 rounded-full text-sm font-medium border transition ${
              view === v ? "bg-brand-dark text-brand-foreground border-brand-dark" : "bg-card text-foreground border-border"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4">
        <div className="relative rounded-2xl overflow-hidden shadow-md h-[440px] border border-border">
          {mounted ? (
            <Suspense fallback={<div className="h-full w-full bg-beige animate-pulse" />}>
              <LeafletMap
                view={view}
                tileUrl={tileLayers[view].url}
                tileAttr={tileLayers[view].attr}
                locations={filtered as any}
                onSelect={(id) => setSelectedId(id)}
              />
            </Suspense>
          ) : (
            <div className="h-full w-full bg-beige animate-pulse" />
          )}
          <div className="absolute right-3 top-3 flex flex-col bg-card rounded-xl shadow-md overflow-hidden">
            <button className="size-9 flex items-center justify-center hover:bg-beige" aria-label="Zoom in">
              <Plus className="size-4 text-brand" />
            </button>
            <div className="h-px bg-border" />
            <button className="size-9 flex items-center justify-center hover:bg-beige" aria-label="Zoom out">
              <Minus className="size-4 text-brand" />
            </button>
          </div>
        </div>
      </div>

      <section className="px-5 mt-5 mb-6">
        <h2 className="font-serif text-lg font-bold mb-3">Heritage sites</h2>
        <ul className="space-y-2">
          {filtered.map((loc) => (
            <li key={loc.id}>
              <button
                onClick={() => setSelectedId(loc.id)}
                className="w-full text-left bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{loc.name}</p>
                  <p className="font-arabic text-xs text-muted-foreground truncate">{loc.name_ar}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-beige text-brand-dark px-2.5 py-1 rounded-full font-medium">{loc.category}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <LocationSheet location={selected} open={!!selected} onClose={() => setSelectedId(null)} />
    </AppShell>
  );
}
