import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Lock, Folder, Pencil, Trash2, Plus } from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";
import { PageHeader } from "@/components/athar/PageHeader";
import { AddArchiveDialog } from "@/components/athar/AddArchiveDialog";

import { listArchives, deleteArchiveRecord } from "@/server/vault.functions";

type DbArchive = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const STATUS_LABEL: Record<DbArchive["status"], string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  draft: "Draft",
};

export const Route = createFileRoute("/myvault")({
  head: () => ({
    meta: [
      { title: "My Vault — Athar" },
      { name: "description", content: "Your private heritage archive — documents, photos and oral histories." },
      { property: "og:title", content: "My Vault — Athar" },
      { property: "og:description", content: "Manage your heritage archives." },
    ],
  }),
  component: MyVault,
});

const filters = ["Pending", "Approved", "All", "Family"] as const;
type Filter = (typeof filters)[number];

const statusStyles = {
  approved: "bg-success/15 text-success",
  pending: "bg-amber-500/15 text-amber-700",
  rejected: "bg-live/15 text-live",
  draft: "bg-muted text-muted-foreground",
} satisfies Record<DbArchive["status"], string>;

function MyVault() {
  const [filter, setFilter] = useState<Filter>("All");
  const [archives, setArchives] = useState<DbArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const fetchList = listArchives;
  const removeOne = deleteArchiveRecord;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { archives } = await fetchList();
      setArchives(archives as DbArchive[]);
    } finally {
      setLoading(false);
    }
  }, [fetchList]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const list = archives.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Family") return false;
    return a.status === filter.toLowerCase();
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this archive? This cannot be undone.")) return;
    await removeOne({ data: { id } });
    refresh();
  }

  return (
    <AppShell>
      <PageHeader
        title="My Vault"
        back="/home"
        right={<Lock className="size-5" />}
      />

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

      <div className="px-5 mt-4">
        <button
          onClick={() => setShowAdd(true)}
          className="w-full h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="size-5" />
          Add New Archive Record
        </button>
      </div>

      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-bold">My Archives</h2>
          <span className="text-xs text-muted-foreground">
            {loading ? "Loading…" : `${list.length} archives`}
          </span>
        </div>

        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id} className="bg-card rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-xl bg-beige text-brand flex items-center justify-center shrink-0">
                  <Folder className="size-6" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm truncate">{a.title}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyles[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(a.created_at)}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to="/myvault/$id/edit"
                      params={{ id: a.id }}
                      className="flex-1 h-9 rounded-lg bg-beige text-brand-dark text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </Link>
                    <button onClick={() => handleDelete(a.id)} className="flex-1 h-9 rounded-lg bg-live/10 text-live text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/vault" className="block text-center text-xs text-muted-foreground mt-6 underline">
          Lock vault
        </Link>
      </div>

      <AddArchiveDialog open={showAdd} onClose={() => setShowAdd(false)} onCreated={refresh} />
    </AppShell>
  );
}
