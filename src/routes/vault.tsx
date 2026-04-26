import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Delete, ChevronLeft, Loader2 } from "lucide-react";

import { verifyVaultPin } from "@/server/vault.functions";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Unlock Vault — Athar" },
      { name: "description", content: "Enter your 6-digit PIN to unlock your private heritage vault." },
      { property: "og:title", content: "Unlock Vault — Athar" },
      { property: "og:description", content: "Secure 6-digit PIN access to your archives." },
    ],
  }),
  component: VaultUnlock,
});

function VaultUnlock() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const verify = verifyVaultPin;

  const press = (k: string) => {
    if (busy) return;
    if (k === "del") {
      setError(null);
      return setPin((p) => p.slice(0, -1));
    }
    if (pin.length >= 6) return;
    setError(null);
    setPin((p) => p + k);
  };

  async function handleUnlock() {
    if (busy || pin.length !== 6) return;
    setBusy(true);
    try {
      const result = await verify({ data: { pin } });
        if (result.outcome === "success") {
          navigate({ to: "/myvault" });
        } else if (result.outcome === "locked") {
        setError("Vault locked. Try again in 30 minutes.");
        setPin("");
      } else {
        setError(`Wrong PIN. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? "" : "s"} left.`);
        setPin("");
      }
    } catch {
      setError("Could not verify PIN. Please try again.");
      setPin("");
    } finally {
      setBusy(false);
    }
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "del"];

  return (
    <div className="min-h-screen bg-vault text-white flex flex-col">
      <div className="px-5 pt-10 flex items-center">
        <Link
          to="/home"
          className="size-9 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-6">
        <div className="size-20 rounded-2xl bg-brand flex items-center justify-center shadow-xl">
          <Lock className="size-9 text-brand-foreground" strokeWidth={1.6} />
        </div>
        <h1 className="font-serif text-3xl font-bold mt-6">Unlock Vault</h1>
        <p className="text-white/70 mt-1.5 text-sm">Enter your 6-digit PIN</p>
        <p className="font-arabic text-base mt-1 text-[oklch(0.78_0.07_75)]">افتح الخزنة</p>
        <p className="text-xs text-white/60 mt-2">Demo PIN: 123456</p>
        {error && <p className="text-sm text-live mt-3">{error}</p>}

        <div className="flex gap-3 mt-10">
          {Array.from({ length: 6 }).map((_, i) => {
            const filled = i < pin.length;
            const active = i === pin.length;
            return (
              <div
                key={i}
                className={`size-11 rounded-xl border-2 flex items-center justify-center transition ${
                  filled
                    ? "border-white bg-white/10"
                    : active
                      ? "border-brand bg-white/5"
                      : "border-white/30"
                }`}
              >
                {filled && <span className="size-2.5 rounded-full bg-white" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-12 w-full max-w-xs">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => press(k === "del" ? "del" : k)}
              className="h-16 rounded-2xl bg-vault-key text-white text-2xl font-medium active:scale-95 transition shadow-md"
            >
              {k === "del" ? <Delete className="size-6 mx-auto" /> : k}
            </button>
          ))}
        </div>

        <button
          onClick={handleUnlock}
          disabled={pin.length !== 6 || busy}
          className="mt-8 w-full max-w-xs h-14 rounded-2xl bg-brand text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-5" />}
          {busy ? "Unlocking…" : "Unlock Vault"}
        </button>
        <button className="text-sm text-white/70 mt-4 underline">Forgot PIN?</button>
      </div>
    </div>
  );
}
