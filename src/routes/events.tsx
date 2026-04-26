import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";
import { MOCK_EVENTS, getSavedEventIds, toggleSavedEventLocal } from "@/lib/mockData";
import type { DbEvent } from "@/lib/mockData";
import eventHeritage from "@/assets/event-heritage.jpg";
import eventBookfair from "@/assets/event-bookfair.jpg";
import eventEmbroidery from "@/assets/event-embroidery.jpg";

export function eventImage(title: string) {
  const t = title.toLowerCase();
  if (t.includes("book")) return eventBookfair;
  if (t.includes("embroidery") || t.includes("tatreez")) return eventEmbroidery;
  return eventHeritage;
}

export function formatPrice(price: number, currency: string) {
  if (price === 0) return "Free";
  const symbols: Record<string, string> = { GBP: "£", EUR: "€", USD: "$" };
  return `${symbols[currency] ?? ""}${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

export function formatEventDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Athar" },
      { name: "description", content: "Discover Palestinian heritage exhibitions, workshops and book fairs near you." },
    ],
  }),
  component: EventsList,
});

const filters = ["All", "Today", "This Week", "This Month"] as const;
type Filter = (typeof filters)[number];

function filterEvents(events: DbEvent[], filter: Filter): DbEvent[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().split("T")[0];
  if (filter === "Today") return events.filter((e) => e.event_date === iso(today));
  if (filter === "This Week") {
    const end = new Date(today);
    end.setDate(today.getDate() + 7);
    return events.filter((e) => e.event_date >= iso(today) && e.event_date <= iso(end));
  }
  if (filter === "This Month") {
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return events.filter((e) => e.event_date >= iso(today) && e.event_date <= iso(end));
  }
  return events;
}

function EventsList() {
  const [filter, setFilter] = useState<Filter>("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(getSavedEventIds()));
  const events = filterEvents(MOCK_EVENTS, filter);

  function onToggleSave(ev: React.MouseEvent, eventId: string) {
    ev.preventDefault();
    ev.stopPropagation();
    const wasSaved = savedIds.has(eventId);
    toggleSavedEventLocal(eventId, wasSaved);
    setSavedIds((cur) => {
      const next = new Set(cur);
      if (wasSaved) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  return (
    <AppShell>
      <PageHeader title="Events" back="/home" />
      <div className="px-5 mt-4 flex gap-2 overflow-x-auto scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-9 rounded-full text-sm font-medium border transition shrink-0 ${
              filter === f
                ? "bg-brand-dark text-brand-foreground border-brand-dark"
                : "bg-card text-foreground border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {events.length === 0 && (
        <p className="px-5 mt-5 text-sm text-muted-foreground">No events found.</p>
      )}
      <ul className="px-5 mt-5 space-y-4">
        {events.map((e) => {
          const limited = e.seats_remaining / e.total_seats < 0.2;
          return (
            <li
              key={e.id}
              className="relative bg-card rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            >
              <a href={`/events/${e.id}`} className="block">
                <div className="relative h-44">
                  <img src={eventImage(e.title)} alt={e.title} loading="lazy" className="w-full h-full object-cover" />
                  {limited && (
                    <span className="absolute top-3 right-3 bg-live text-white text-[11px] px-2.5 py-1 rounded-full font-semibold shadow">
                      Limited Seats
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold leading-tight">{e.title}</h3>
                  <p className="font-arabic text-sm mt-0.5">{e.title_ar}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="text-muted-foreground">
                      <p>{formatEventDate(e.event_date)}</p>
                      <p className="text-xs">{e.location_name}</p>
                    </div>
                    <span className="text-brand-dark font-bold">{formatPrice(e.ticket_price, e.currency)}</span>
                  </div>
                </div>
              </a>
              <button
                onClick={(ev) => onToggleSave(ev, e.id)}
                className="absolute top-3 left-3 size-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center z-10"
                aria-label={savedIds.has(e.id) ? "Unsave" : "Save"}
              >
                <Heart className={`size-4 ${savedIds.has(e.id) ? "fill-live text-live" : "text-brand-dark"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
