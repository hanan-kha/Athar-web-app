import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Settings, ShoppingBag, Heart, Ticket, Bookmark, LogOut } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Athar" },
      { name: "description", content: "Manage your Athar profile, bookings, donations and settings." },
      { property: "og:title", content: "Account — Athar" },
      { property: "og:description", content: "Your Athar profile." },
    ],
  }),
  component: AccountPage,
});

const links = [
  { label: "Purchase History", icon: ShoppingBag },
  { label: "Donation History", icon: Heart },
  { label: "My Tickets", icon: Ticket },
  { label: "Saved Items", icon: Bookmark },
  { label: "Settings", icon: Settings },
];

function AccountPage() {
  return (
    <AppShell>
      <div className="bg-brand text-brand-foreground rounded-b-3xl px-6 pt-12 pb-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-cream text-brand font-serif font-bold text-2xl flex items-center justify-center">
            A
          </div>
          <div>
            <p className="font-serif text-2xl font-bold">Amal H.</p>
            <p className="text-sm opacity-80">amal@athar.app</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl shadow-md p-4 grid grid-cols-3 divide-x divide-border">
          {[
            { v: 3, l: "Bookings" },
            { v: 5, l: "Orders" },
            { v: 12, l: "Archives" },
          ].map((s) => (
            <div key={s.l} className="text-center px-2">
              <p className="font-serif text-2xl font-bold text-brand-dark">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <ul className="px-5 mt-6 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <button className="w-full bg-card rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-beige text-brand flex items-center justify-center">
                  <l.icon className="size-5" />
                </div>
                <span className="font-medium text-sm">{l.label}</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </li>
        ))}
        <li>
          <Link
            to="/"
            className="w-full bg-card rounded-2xl shadow-sm p-4 flex items-center justify-between text-live"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-live/10 flex items-center justify-center">
                <LogOut className="size-5" />
              </div>
              <span className="font-medium text-sm">Logout</span>
            </div>
            <ChevronRight className="size-5" />
          </Link>
        </li>
      </ul>
    </AppShell>
  );
}
