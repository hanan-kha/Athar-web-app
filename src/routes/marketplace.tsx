import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Athar" },
      { name: "description", content: "Discover handmade Palestinian crafts, embroidery and heritage art from verified sellers." },
      { property: "og:title", content: "Marketplace — Athar" },
      { property: "og:description", content: "Handmade Palestinian heritage products." },
    ],
  }),
  component: Market,
});

const products = [
  { id: 1, name: "Embroidered Cushion", price: 35, tag: "Handmade" },
  { id: 2, name: "Keffiyeh — Hebron", price: 25, tag: "Traditional" },
  { id: 3, name: "Olive Wood Carving", price: 60, tag: "Limited" },
  { id: 4, name: "Pottery Bowl", price: 45, tag: "Handmade" },
  { id: 5, name: "Heritage Map Print", price: 20, tag: "Limited" },
  { id: 6, name: "Handwoven Rug", price: 120, tag: "Traditional" },
];

function Market() {
  return (
    <AppShell>
      <PageHeader title="Marketplace" back="/home" />

      <div className="px-5 -mt-4 relative z-10 flex gap-2">
        <div className="flex-1 flex items-center bg-card rounded-2xl shadow-md px-3 h-12">
          <Search className="size-5 text-muted-foreground mr-2" />
          <input placeholder="Search heritage crafts..." className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <button className="size-12 rounded-2xl bg-card shadow-md text-brand flex items-center justify-center" aria-label="Filters">
          <SlidersHorizontal className="size-5" />
        </button>
      </div>

      <section className="px-5 mt-6">
        <h2 className="font-serif text-lg font-bold mb-3">Featured items</h2>
        <ul className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <li key={p.id} className="bg-card rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-beige to-cream flex items-center justify-center text-brand/40 font-serif text-3xl">
                {p.name.charAt(0)}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm leading-tight line-clamp-1">{p.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-serif text-base font-bold text-brand-dark">${p.price}</span>
                  <span className="text-[10px] bg-beige text-brand-dark px-2 py-0.5 rounded-full font-medium">
                    {p.tag}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
