import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Athar" },
      { name: "description", content: "Sign in to Athar to access your heritage vault, events, and the cultural map." },
      { property: "og:title", content: "Sign in — Athar" },
      { property: "og:description", content: "Access your Palestinian heritage vault." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-6 pt-16 pb-10">
        <div className="text-center mb-10">
          <div className="mx-auto size-20 rounded-2xl bg-brand text-brand-foreground flex items-center justify-center shadow-lg mb-4">
            <Lock className="size-9" strokeWidth={1.6} />
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-dark">Athar</h1>
          <p className="text-muted-foreground mt-2">Stay connected to our heritage</p>
          <p className="font-arabic text-base mt-1">أَثَر — حافظ على إرثنا</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/home" });
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-foreground/80 block mb-1.5">
              Email or phone
            </label>
            <input
              type="text"
              required
              defaultValue=""
              placeholder="you@example.com"
              className="w-full h-12 rounded-xl bg-card border border-border px-4 outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-card border border-border px-4 pr-11 outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold shadow-md hover:opacity-95 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <Link to="/home" className="text-sm text-brand font-semibold block">
            Sign Up
          </Link>
          <Link to="/home" className="text-sm text-muted-foreground block">
            Continue as Guest
          </Link>
        </div>

        <div className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy.
        </div>
      </div>
    </div>
  );
}
