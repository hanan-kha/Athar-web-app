import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft, CheckCircle2, Loader2, Minus, Plus,
  CreditCard, Building2, Calendar as CalendarIcon, Download,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getEventById } from "@/lib/mockData";
import { formatPrice, formatEventDate } from "./events";

export const Route = createFileRoute("/events/$id/register")({
  head: () => ({
    meta: [
      { title: "Register — Athar" },
      { name: "description", content: "Book your ticket for a heritage event." },
    ],
  }),
  component: RegisterPage,
});

type Step = 1 | 2 | 3;
type PaymentMethod = "card" | "bank" | "free";

function RegisterPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const event = getEventById(id);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ qr: string; ref: string; total: number; currency: string } | null>(null);

  const isFree = !!event && Number(event.ticket_price) === 0;
  const total = useMemo(() => (event ? Number(event.ticket_price) * qty : 0), [event, qty]);

  if (!event) {
    return (
      <div className="p-10 text-center">
        <p>Event not found.</p>
        <Link to="/events" className="text-brand underline">Back to events</Link>
      </div>
    );
  }

  function continueFromDetails() {
    setErr(null);
    if (!name.trim()) return setErr("Please enter your full name");
    if (!email.trim() || !email.includes("@")) return setErr("Please enter a valid email");
    if (qty < 1) return setErr("Select at least 1 ticket");
    if (event && qty > event.seats_remaining) return setErr("Not enough seats remaining");
    if (isFree) submitBooking();
    else setStep(2);
  }

  function submitBooking() {
    setBusy(true);
    setTimeout(() => {
      const ref = `REF-${Date.now().toString(36).toUpperCase()}`;
      setConfirmed({ qr: ref, ref, total, currency: event!.currency });
      setStep(3);
      setBusy(false);
    }, 800);
  }

  function downloadTicket() {
    if (!confirmed) return;
    const text = [
      `ATHAR — Event Ticket`,
      `--------------------`,
      `Event: ${event.title}`,
      `Date: ${formatEventDate(event.event_date)}`,
      `Time: ${event.start_time.slice(0, 5)} – ${event.end_time.slice(0, 5)}`,
      `Location: ${event.location_name}`,
      `Attendee: ${name}`,
      `Tickets: ${qty}`,
      `Total: ${formatPrice(confirmed.total, confirmed.currency)}`,
      `Reference: ${confirmed.ref}`,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athar-ticket-${confirmed.ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function addToCalendar() {
    const dt = (date: string, time: string) =>
      `${date.replace(/-/g, "")}T${time.replace(/:/g, "").padEnd(6, "0")}`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `UID:${confirmed?.ref ?? event.id}@athar`,
      `DTSTAMP:${dt(event.event_date, event.start_time)}`,
      `DTSTART:${dt(event.event_date, event.start_time)}`,
      `DTEND:${dt(event.event_date, event.end_time)}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location_name}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen pb-12">
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-4 h-14">
            <Link
              to="/events/$id"
              params={{ id: event.id }}
              className="size-9 rounded-full bg-muted flex items-center justify-center"
              aria-label="Back"
            >
              <ChevronLeft className="size-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Register</p>
              <p className="font-semibold text-sm truncate">{event.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 pb-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex flex-col items-center">
                <div className={`h-1.5 w-full rounded-full transition ${step >= s ? "bg-brand-dark" : "bg-muted"}`} />
                <span className={`text-[10px] mt-1 uppercase tracking-wider ${step === s ? "text-brand-dark font-bold" : "text-muted-foreground"}`}>
                  {s === 1 ? "Details" : s === 2 ? "Payment" : "Confirm"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-5">
          {step === 1 && (
            <section className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Event</p>
                <p className="font-serif font-bold text-base mt-0.5">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatEventDate(event.event_date)} · {event.start_time.slice(0, 5)}</p>
                <p className="text-xs text-muted-foreground">{event.location_name}</p>
              </div>

              <Field label="Full name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-brand" />
              </Field>
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-brand" />
              </Field>
              <Field label="Phone (optional)">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 ..."
                  className="w-full h-11 px-3 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-brand" />
              </Field>

              <div className="bg-muted rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Tickets</p>
                  <p className="text-[11px] text-muted-foreground">{event.seats_remaining} seats left · max 10</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="size-9 rounded-full bg-card flex items-center justify-center" aria-label="Decrease">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(event.seats_remaining, q + 1, 10))}
                    className="size-9 rounded-full bg-card flex items-center justify-center" aria-label="Increase">
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-muted-foreground">Total</span>
                <span className="font-serif text-xl font-bold text-brand-dark">
                  {isFree ? "Free" : formatPrice(total, event.currency)}
                </span>
              </div>

              {err && <p className="text-sm text-live">{err}</p>}

              <button onClick={continueFromDetails} disabled={busy}
                className="w-full h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
                {busy && <Loader2 className="size-4 animate-spin" />}
                {isFree ? "Reserve seat" : "Continue to payment"}
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <div className="bg-card rounded-2xl p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Order summary</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{event.title}</span>
                  <span className="text-muted-foreground">×{qty}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Attendee</span>
                  <span>{name}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-serif text-xl font-bold text-brand-dark">{formatPrice(total, event.currency)}</span>
                </div>
              </div>

              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Payment method</p>
              <div className="space-y-2">
                <PaymentOption selected={method === "card"} onSelect={() => setMethod("card")}
                  icon={<CreditCard className="size-5" />} title="Credit / Debit card" desc="Secure payment via Stripe" />
                <PaymentOption selected={method === "bank"} onSelect={() => setMethod("bank")}
                  icon={<Building2 className="size-5" />} title="Bank transfer" desc="Receive payment instructions by email" />
              </div>

              <p className="text-xs text-muted-foreground">This is a demo checkout — no real charges are made.</p>
              {err && <p className="text-sm text-live">{err}</p>}

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} disabled={busy}
                  className="flex-1 h-12 rounded-xl bg-beige text-brand-dark font-semibold disabled:opacity-50">
                  Back
                </button>
                <button onClick={submitBooking} disabled={busy}
                  className="flex-1 h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Pay {formatPrice(total, event.currency)}
                </button>
              </div>
            </section>
          )}

          {step === 3 && confirmed && (
            <section className="space-y-5 text-center">
              <div className="mx-auto size-16 rounded-full bg-success/15 text-success flex items-center justify-center">
                <CheckCircle2 className="size-9" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">You're in!</h2>
                <p className="text-sm text-muted-foreground mt-1">Booking confirmed for {event.title}.</p>
              </div>
              <div className="bg-card rounded-2xl p-5 shadow-sm">
                <div className="mx-auto bg-white p-3 rounded-xl inline-block">
                  <QRCodeSVG value={confirmed.qr} size={160} level="M" />
                </div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3">Reference</p>
                <p className="font-mono text-xs break-all">{confirmed.ref}</p>
                <p className="text-sm mt-2 font-semibold">{qty} × {event.title}</p>
                <p className="text-xs text-muted-foreground">{formatEventDate(event.event_date)} · {event.start_time.slice(0, 5)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={downloadTicket}
                  className="h-12 rounded-xl bg-beige text-brand-dark font-semibold inline-flex items-center justify-center gap-2">
                  <Download className="size-4" /> Ticket
                </button>
                <button onClick={addToCalendar}
                  className="h-12 rounded-xl bg-beige text-brand-dark font-semibold inline-flex items-center justify-center gap-2">
                  <CalendarIcon className="size-4" /> Calendar
                </button>
              </div>
              <button onClick={() => navigate({ to: "/events" })}
                className="w-full h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold">
                Browse more events
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PaymentOption({ selected, onSelect, icon, title, desc }: {
  selected: boolean; onSelect: () => void; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <button onClick={onSelect}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border-2 transition ${
        selected ? "border-brand-dark bg-beige" : "border-border bg-card"
      }`}>
      <div className="size-10 rounded-xl bg-muted text-brand-dark flex items-center justify-center">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className={`size-5 rounded-full border-2 ${selected ? "border-brand-dark bg-brand-dark" : "border-border"}`} />
    </button>
  );
}
