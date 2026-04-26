import { Link, useLocation } from "@tanstack/react-router";
import { Home, MapPin, ShoppingBag, Heart, User, CalendarIcon } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: MapPin },
  { to: "/event", label: "Event", icon: CalendarIcon },
  { to: "/marketplace", label: "Shop", icon: ShoppingBag },
  { to: "/donate", label: "Donate", icon: Heart },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.08)]">
      <ul className="mx-auto max-w-md flex justify-around items-stretch px-2 py-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className="flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors"
              >
                <Icon
                  className={`size-6 ${active ? "text-brand" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`text-[11px] font-medium ${active ? "text-brand" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
