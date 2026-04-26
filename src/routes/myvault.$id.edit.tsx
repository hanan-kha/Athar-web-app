import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Save,
  Send,
  Loader2,
  Trash2,
  ImagePlus,
  FilePlus,
  FileText,
} from "lucide-react";
import { AppShell } from "@/components/athar/AppShell";

import {
  getArchiveRecordWithFiles,
  updateArchiveRecord,
  deleteArchiveFile,
  addFilesToArchive,
} from "@/server/vault.functions";

export const Route = createFileRoute("/myvault/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Archive — Athar" },
      { name: "description", content: "Edit your heritage archive record." },
    ],
  }),
  component: EditArchivePage,
});

type DocRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size_bytes: number | null;
  url: string | null;
};
type ImgRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_size_bytes: number | null;
  url: string | null;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function EditArchivePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const fetchOne = getArchiveRecordWithFiles;
  const update = updateArchiveRecord;
  const removeFile = deleteArchiveFile;
  const addFiles = addFilesToArchive;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("draft");
  const [saving, setSaving] = useState(false);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [images, setImages] = useState<ImgRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const imgInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    try {
      const { record, docs, images } = await fetchOne({ data: { id } });
      setTitle(record.title ?? "");
      setDescription(record.description ?? "");
      setStatus(record.status ?? "draft");
      setDocs(docs as DocRow[]);
      setImages(images as ImgRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id, fetchOne]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function save(submit: boolean) {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await update({ data: { id, title, description, submit } });
      navigate({ to: "/myvault" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function onPickFiles(kind: "image" | "document", list: FileList | null) {
    if (!list || list.length === 0) return;
    const limit = kind === "image" ? 10 - images.length : 5 - docs.length;
    if (limit <= 0) {
      setError(kind === "image" ? "Max 10 images" : "Max 5 documents");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const arr = Array.from(list).slice(0, limit);
      const payload = await Promise.all(
        arr.map(async (f) => {
          if (f.size > 5 * 1024 * 1024) throw new Error(`${f.name} exceeds 5MB`);
          return {
            name: f.name,
            type:
              f.type ||
              (kind === "image" ? "image/jpeg" : "application/octet-stream"),
            size: f.size,
            base64: await fileToBase64(f),
            kind,
          };
        }),
      );
      await addFiles({ data: { recordId: id, files: payload } });
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (imgInput.current) imgInput.current.value = "";
      if (docInput.current) docInput.current.value = "";
    }
  }

  async function handleDeleteFile(kind: "image" | "document", fileId: string) {
    if (!confirm("Delete this file?")) return;
    try {
      if (kind === "image") setImages((c) => c.filter((f) => f.id !== fileId));
      else setDocs((c) => c.filter((f) => f.id !== fileId));
      await removeFile({ data: { recordId: id, fileId, kind } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      reload();
    }
  }

  return (
    <AppShell>
      <div className="bg-brand text-brand-foreground rounded-b-3xl px-5 pt-12 pb-6 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            to="/myvault"
            className="size-10 rounded-xl bg-white/15 flex items-center justify-center"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-serif text-xl font-bold">Edit Archive</h1>
        </div>
      </div>

      <div className="px-5 mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin mr-2" /> Loading…
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Archive title"
                maxLength={200}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                placeholder="Tell the story behind this archive…"
              />
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Documents ({docs.length}/5)
                </label>
                <button
                  type="button"
                  onClick={() => docInput.current?.click()}
                  disabled={uploading || docs.length >= 5}
                  className="text-xs font-semibold text-brand-dark inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <FilePlus className="size-3.5" /> Add
                </button>
              </div>
              <input
                ref={docInput}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                multiple
                hidden
                onChange={(e) => onPickFiles("document", e.target.files)}
              />
              {docs.length === 0 ? (
                <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
                  No documents yet.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {docs.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2"
                    >
                      <FileText className="size-4 text-brand-dark shrink-0" />
                      <a
                        href={d.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-xs truncate hover:underline"
                      >
                        {d.file_name}
                      </a>
                      <button
                        onClick={() => handleDeleteFile("document", d.id)}
                        className="text-live shrink-0"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Images ({images.length}/10)
                </label>
                <button
                  type="button"
                  onClick={() => imgInput.current?.click()}
                  disabled={uploading || images.length >= 10}
                  className="text-xs font-semibold text-brand-dark inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <ImagePlus className="size-3.5" /> Add
                </button>
              </div>
              <input
                ref={imgInput}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                hidden
                onChange={(e) => onPickFiles("image", e.target.files)}
              />
              {images.length === 0 ? (
                <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
                  No images yet.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
                    >
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={img.file_name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      <button
                        onClick={() => handleDeleteFile("image", img.id)}
                        className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {uploading && (
                <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" /> Uploading…
                </p>
              )}
            </div>

            <div className="bg-card rounded-xl p-4 text-xs text-muted-foreground">
              Status: <span className="font-semibold text-foreground capitalize">{status}</span>
            </div>

            {error && (
              <p className="text-sm text-live bg-live/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => save(false)}
                disabled={saving}
                className="flex-1 h-12 rounded-xl bg-beige text-brand-dark font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="size-4" /> Save Draft
              </button>
              {status !== "approved" && status !== "pending" && (
                <button
                  onClick={() => save(true)}
                  disabled={saving}
                  className="flex-1 h-12 rounded-xl bg-brand-dark text-brand-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  <Send className="size-4" /> Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}