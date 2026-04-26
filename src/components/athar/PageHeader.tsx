import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export function PageHeader({
  title,
  back = "/home",
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <div className="bg-brand text-brand-foreground rounded-b-3xl px-5 pt-12 pb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <Link
          to={back}
          className="size-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-serif text-xl font-semibold">{title}</h1>
        <div className="size-9 flex items-center justify-center">{right}</div>
      </div>
    </div>
  );
}
