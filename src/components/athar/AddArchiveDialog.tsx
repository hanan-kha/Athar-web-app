import { useRef, useState } from "react";
import { X, Image as ImageIcon, FileText, Loader2 } from "lucide-react";

import { createArchiveWithFiles } from "@/server/vault.functions";

type PendingFile = {
  name: string;
  type: string;
  size: number;
  base64: string;
  kind: "image" | "document";
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:<mime>;base64,"
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AddArchiveDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);
  const create = createArchiveWithFiles;

  if (!open) return null;

  async function pick(kind: "image" | "document", list: FileList | null) {
    if (!list) return;
    const next: PendingFile[] = [];
    for (const f of Array.from(list)) {
      if (f.size > 10 * 1024 * 1024) {
        setErr(`${f.name} exceeds 10MB`);
        continue;
      }
      next.push({
        name: f.name,
        type: f.type || (kind === "image" ? "image/jpeg" : "application/octet-stream"),
        size: f.size,
        base64: await fileToBase64(f),
        kind,
      });
    }
    setFiles((cur) => [...cur, ...next].slice(0, 10));
  }

  async function submit(asPending: boolean) {
    setErr(null);
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    setBusy(true);
    try {
      await create({
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          submit: asPending,
          files,
        },
      });
      setTitle("");
      setDescription("");
      setFiles([]);
      onCreated();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to create archive");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">New Archive Record</h2>
          <button onClick={onClose} aria-label="Close" className="size-8 rounded-full bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>

        <label className="block text-xs font-semibold text-muted-foreground mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Grandmother's land deed"
          className="w-full h-11 px-3 rounded-xl bg-background border border-border text-sm outline-none focus:border-brand"
          maxLength={200}
        />

        <label className="block text-xs font-semibold text-muted-foreground mb-1 mt-3">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Story, year, location, people…"
          rows={3}
          className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm outline-none focus:border-brand resize-none"
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => imgInput.current?.click()}
            className="h-11 rounded-xl bg-beige text-brand-dark text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <ImageIcon className="size-4" /> Add Photos
          </button>
          <button
            type="button"
            onClick={() => docInput.current?.click()}
            className="h-11 rounded-xl bg-beige text-brand-dark text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <FileText className="size-4" /> Add Documents
          </button>
          <input ref={imgInput} type="file" accept="image/*" multiple hidden onChange={(e) => pick("image", e.target.files)} />
          <input ref={docInput} type="file" accept=".pdf,.doc,.docx,.txt,application/pdf" multiple hidden onChange={(e) => pick("document", e.target.files)} />
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-xs bg-muted rounded-lg px-2.5 py-1.5">
                <span className="truncate flex-1">
                  {f.kind === "image" ? "🖼️" : "📄"} {f.name}
                </span>
                <button onClick={() => setFiles((c) => c.filter((_, idx) => idx !== i))} className="text-live ml-2" aria-label="Remove">
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {err && <p className="text-sm text-live mt-3">{err}</p>}

        <div className="flex gap-2 mt-5">
          <button
            disabled={busy}
            onClick={() => submit(false)}
            className="flex-1 h-12 rounded-xl bg-beige text-brand-dark font-semibold disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            disabled={busy}
            onClick={() => submit(true)}
            className="flex-1 h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}