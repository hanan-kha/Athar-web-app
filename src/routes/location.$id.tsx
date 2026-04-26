import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Share2, MapPin, BookOpen, Video, Info, FlaskConical, ExternalLink, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getLocationById } from "@/lib/mockData";

type RelatedItem = { title: string; source: string; url: string; excerpt?: string };

export const Route = createFileRoute("/location/$id")({
  head: () => ({
    meta: [
      { title: "Heritage site — Athar" },
      { name: "description", content: "Articles, videos, and research about a Palestinian heritage site." },
    ],
  }),
  component: LocationDetail,
  notFoundComponent: () => (
    <AppShell>
      <PageHeader title="Not found" back="/map" />
      <div className="p-5 text-sm text-muted-foreground">This location doesn't exist.</div>
    </AppShell>
  ),
});

function buildContent(name: string): { articles: RelatedItem[]; videos: RelatedItem[]; research: RelatedItem[] } {
  const q = encodeURIComponent(name);
  return {
    articles: [
      { title: `${name} — overview and recent reporting`, source: "Al Jazeera English", url: `https://www.aljazeera.com/search/${q}`, excerpt: "In-depth coverage and context from regional reporters." },
      { title: `Heritage spotlight: ${name}`, source: "Institute for Palestine Studies", url: `https://www.palestine-studies.org/en/search?keys=${q}`, excerpt: "Scholarly essays on the site's cultural and historical role." },
      { title: `Field notes from ${name}`, source: "Middle East Eye", url: `https://www.middleeasteye.net/search?keywords=${q}`, excerpt: "On-the-ground reporting and community voices." },
    ],
    videos: [
      { title: `${name} — documentary excerpt`, source: "YouTube", url: `https://www.youtube.com/results?search_query=${q}+heritage+palestine` },
      { title: `Walking tour of ${name}`, source: "YouTube", url: `https://www.youtube.com/results?search_query=${q}+walking+tour` },
      { title: `Oral histories near ${name}`, source: "Vimeo", url: `https://vimeo.com/search?q=${q}` },
    ],
    research: [
      { title: `Academic papers on ${name}`, source: "Google Scholar", url: `https://scholar.google.com/scholar?q=${q}+palestine+heritage`, excerpt: "Peer-reviewed research and dissertations." },
      { title: `Archaeological surveys near ${name}`, source: "JSTOR", url: `https://www.jstor.org/action/doBasicSearch?Query=${q}+palestine` },
      { title: `UNESCO documentation`, source: "UNESCO", url: `https://whc.unesco.org/en/list/?search=${q}` },
    ],
  };
}

function ShareSheet({ open, onClose, name, url }: { open: boolean; onClose: () => void; name: string; url: string }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;
  const text = `Discover ${name} — a Palestinian heritage site on Athar`;
  const enc = (s: string) => encodeURIComponent(s);
  const channels = [
    { label: "Twitter / X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "WhatsApp", icon: Share2, href: `https://wa.me/?text=${enc(text + " " + url)}` },
  ];
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-t-3xl p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto h-1 w-10 bg-border rounded-full mb-4" />
        <h3 className="font-serif text-lg font-bold mb-1">Share this place</h3>
        <p className="text-xs text-muted-foreground mb-4">{name}</p>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted hover:bg-accent transition">
              <c.icon className="size-5 text-brand" />
              <span className="text-[10px] text-foreground text-center leading-tight">{c.label}</span>
            </a>
          ))}
        </div>
        <button onClick={copy}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-border text-sm font-medium hover:bg-accent transition">
          {copied ? <Check className="size-4 text-brand" /> : <Link2 className="size-4" />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <button onClick={onClose} className="w-full h-11 mt-2 text-sm text-muted-foreground">Cancel</button>
      </div>
    </div>
  );
}

function LocationDetail() {
  const { id } = Route.useParams();
  const loc = getLocationById(id);
  const [shareOpen, setShareOpen] = useState(false);

  if (!loc) {
    return (
      <AppShell>
        <PageHeader title="Not found" back="/map" />
        <div className="p-5 text-sm text-muted-foreground">This location doesn't exist.</div>
      </AppShell>
    );
  }

  const content = buildContent(loc.name);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: loc.name, text: `Discover ${loc.name} on Athar`, url: pageUrl });
        return;
      } catch { }
    }
    setShareOpen(true);
  };

  return (
    <AppShell>
      <PageHeader
        title={loc.category}
        back="/map"
        right={
          <button onClick={handleShare}
            className="size-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
            aria-label="Share">
            <Share2 className="size-4" />
          </button>
        }
      />

      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl p-5 shadow-md">
          <h1 className="font-serif text-2xl font-bold leading-tight">{loc.name}</h1>
          {loc.name_ar && <p className="font-arabic text-lg text-muted-foreground mt-1">{loc.name_ar}</p>}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
            <span className="ml-auto bg-beige text-brand-dark px-2.5 py-1 rounded-full font-medium">{loc.category}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full bg-muted">
            <TabsTrigger value="info" className="flex-1 gap-1.5 text-xs"><Info className="size-3.5" /> Info</TabsTrigger>
            <TabsTrigger value="articles" className="flex-1 gap-1.5 text-xs"><BookOpen className="size-3.5" /> Articles</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 gap-1.5 text-xs"><Video className="size-3.5" /> Videos</TabsTrigger>
            <TabsTrigger value="research" className="flex-1 gap-1.5 text-xs"><FlaskConical className="size-3.5" /> Research</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-4">
            <div className="bg-card rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-base">About this place</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {loc.description ?? `${loc.name} is part of Palestine's living cultural heritage.`}
              </p>
              {loc.description_ar && (
                <p dir="rtl" className="font-arabic text-sm text-muted-foreground leading-relaxed">{loc.description_ar}</p>
              )}
              <a href={`https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}#map=15/${loc.latitude}/${loc.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand font-medium pt-2">
                Open in maps <ExternalLink className="size-3" />
              </a>
            </div>
          </TabsContent>
          <TabsContent value="articles" className="mt-4"><RelatedList items={content.articles} /></TabsContent>
          <TabsContent value="videos" className="mt-4"><RelatedList items={content.videos} /></TabsContent>
          <TabsContent value="research" className="mt-4"><RelatedList items={content.research} /></TabsContent>
        </Tabs>
      </div>

      <div className="px-5 mt-6 mb-6">
        <Button onClick={handleShare} className="w-full h-12 bg-brand hover:bg-brand-dark text-brand-foreground rounded-2xl">
          <Share2 className="size-4" /> Share this place
        </Button>
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} name={loc.name} url={pageUrl} />
    </AppShell>
  );
}

function RelatedList({ items }: { items: RelatedItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.url}>
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="block bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-snug">{item.title}</p>
                {item.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.excerpt}</p>}
                <p className="text-[11px] text-brand font-medium mt-2 uppercase tracking-wide">{item.source}</p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
