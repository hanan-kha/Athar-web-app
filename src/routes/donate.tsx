import { createFileRoute } from "@tanstack/react-router";
import { Heart, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";
import { charities } from "@/lib/seed";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Athar" },
      { name: "description", content: "Support verified charities preserving Palestinian heritage and helping families in need." },
      { property: "og:title", content: "Donate — Athar" },
      { property: "og:description", content: "Support the cause." },
    ],
  }),
  component: DonatePage,
});

const totalRaised = charities.reduce((s, c) => s + c.raised, 0);
const totalGoal = charities.reduce((s, c) => s + c.goal, 0);

function DonatePage() {
  return (
    <AppShell>
      <PageHeader title="Support the Cause" back="/home" />

      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-card rounded-3xl shadow-md p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Raised together</p>
              <p className="font-serif text-3xl font-bold text-brand-dark mt-1">
                ${totalRaised.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">of ${totalGoal.toLocaleString()} goal</p>
            </div>
            <div className="size-14 rounded-2xl bg-live/10 text-live flex items-center justify-center">
              <Heart className="size-7" fill="currentColor" />
            </div>
          </div>
          <div className="h-2 rounded-full bg-beige mt-4 overflow-hidden">
            <div
              className="h-full bg-brand rounded-full"
              style={{ width: `${(totalRaised / totalGoal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <section className="px-5 mt-6">
        <h2 className="font-serif text-lg font-bold mb-3">Verified charities</h2>
        <ul className="space-y-3">
          {charities.map((c) => {
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <li key={c.id}>
                <button className="w-full text-left bg-card rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-brand text-brand-foreground font-serif font-bold flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Verified · Palestine</p>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground/80 font-medium">${c.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-beige overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="px-5 mt-6">
        <button className="w-full h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold shadow-md">
          Donate Now
        </button>
      </div>
    </AppShell>
  );
}
