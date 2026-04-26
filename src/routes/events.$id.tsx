import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, Share2, ChevronLeft, Clock, Heart } from "lucide-react";
import { getEventById, getSavedEventIds, toggleSavedEventLocal } from "@/lib/mockData";
import { eventImage, formatPrice, formatEventDate } from "./events";

export const Route = createFileRoute("/events/$id")({
  head: () => ({
    meta: [
      { title: "Event — Athar" },
      { name: "description", content: "Heritage event details and booking." },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const event = getEventById(id);
  const [saved, setSaved] = useState(() => getSavedEventIds().includes(id));

  function onToggleSave() {
    toggleSavedEventLocal(id, saved);
    setSaved(!saved);
  }

  if (!event) {
    return (
      <div className="p-10 text-center">
        <p>Event not found.</p>
        <Link to="/events" className="text-brand underline">Back to events</Link>
      </div>
    );
  }

  const limited = event.seats_remaining / event.total_seats < 0.2;
  const organizer = event.organizer_name ?? "Organizer";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen pb-32">
        <div className="relative h-72">
          <img src={eventImage(event.title)} alt={event.title} className="w-full h-full object-cover" />
          <Link
            to="/events"
            className="absolute top-4 left-4 size-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow"
            aria-label="Back"
          >
            <ChevronLeft className="size-5 text-foreground" />
          </Link>
          {limited && (
            <span className="absolute top-4 right-4 bg-live text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow">
              Limited Seats
            </span>
          )}
          <button
            onClick={onToggleSave}
            aria-label={saved ? "Unsave" : "Save"}
            className="absolute bottom-4 right-4 size-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
          >
            <Heart className={`size-5 ${saved ? "fill-live text-live" : "text-brand-dark"}`} />
          </button>
        </div>

        <div className="px-5 -mt-6 relative z-10">
          <div className="bg-card rounded-3xl shadow-md p-5">
            <h1 className="font-serif text-2xl font-bold leading-tight">{event.title}</h1>
            <p className="font-arabic text-lg mt-1">{event.title_ar}</p>
            <div className="space-y-3 mt-5">
              <div className="flex gap-3 items-start">
                <div className="size-10 rounded-xl bg-beige text-brand flex items-center justify-center shrink-0">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold text-sm">{formatEventDate(event.event_date)}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                    <Clock className="size-3" /> {event.start_time.slice(0, 5)} – {event.end_time.slice(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="size-10 rounded-xl bg-beige text-brand flex items-center justify-center shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-sm">{event.location_name}</p>
                  <p className="font-arabic text-sm">{event.location_name_ar}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-md p-5 mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Organizer</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="size-11 rounded-full bg-brand text-brand-foreground font-serif font-bold flex items-center justify-center">
                {organizer.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{organizer}</p>
                <button className="text-xs text-brand underline">View past events</button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-md p-5 mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">About</p>
            <p className="text-sm mt-2 leading-relaxed">{event.description}</p>
          </div>

          <div className="bg-card rounded-3xl shadow-md p-5 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Standard ticket</p>
                <p className="font-serif text-2xl font-bold text-brand-dark">{formatPrice(event.ticket_price, event.currency)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {event.seats_remaining} of {event.total_seats} seats left
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4">
          <div className="mx-auto max-w-md flex gap-3">
            <button className="size-12 rounded-xl bg-beige text-brand-dark flex items-center justify-center shrink-0" aria-label="Share">
              <Share2 className="size-5" />
            </button>
            <button
              onClick={() => navigate({ to: "/events/$id/register", params: { id } })}
              disabled={event.seats_remaining < 1}
              className="flex-1 h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold shadow-md disabled:opacity-50"
            >
              {event.seats_remaining < 1 ? "Sold Out" : "Book Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
