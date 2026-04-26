import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Share2, Check, ExternalLink, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Media = {
  id: string;
  before_image_url: string | null;
  after_image_url: string | null;
  year_before: number | null;
  year_after: number | null;
  caption: string | null;
};

type Artifact = {
  id: string;
  artifact_name: string;
  artifact_name_ar: string | null;
  description: string | null;
  image_url: string | null;
};

type ArchiveRow = {
  id: string;
  title: string;
  status: string;
};

type Detail = {
  media: Media[];
  artifacts: Artifact[];
  archives: ArchiveRow[];
};

type LocationLite = {
  id: string;
  name: string;
  name_ar: string | null;
  category: string;
  latitude: number;
  longitude: number;
  primary_image_url?: string | null;
  extra_images?: string[] | null;
  description?: string | null;
};

export async function getLocationDetail(locationId: string): Promise<Detail> {
  const [media, artifacts, links] = await Promise.all([
    supabase.from("location_media").select("*").eq("location_id", locationId),
    supabase.from("location_artifacts").select("*").eq("location_id", locationId),
    supabase
      .from("location_archive_links")
      .select("archive_records(id, title, status)")
      .eq("location_id", locationId)
      .limit(3),
  ]);

  const archives = (links.data ?? [])
    .map((l) => l.archive_records as unknown as ArchiveRow | null)
    .filter((r): r is ArchiveRow => !!r && r.status === "approved");

  return {
    media: (media.data as Media[]) ?? [],
    artifacts: (artifacts.data as Artifact[]) ?? [],
    archives,
  };
}

export function LocationSheet({
  location,
  open,
  onClose,
}: {
  location: LocationLite | null;
  open: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !location) return;
    let cancelled = false;
    setLoading(true);
    setDetail(null);
    setExpanded(null);
    getLocationDetail(location.id)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, location]);

  if (!open || !location) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/location/${location.id}`
      : "";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="pt-3 pb-2 flex justify-center shrink-0">
          <div className="h-1.5 w-12 bg-border rounded-full" />
        </div>

        {/* Hero image */}
        {location.primary_image_url && (
          <div className="px-5 shrink-0">
            <div className="w-full h-[200px] rounded-2xl overflow-hidden bg-muted">
              <img
                src={location.primary_image_url}
                alt={location.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-5 pb-3 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-brand font-semibold">
              {location.category}
            </p>
            <h2 className="font-serif text-xl font-bold leading-tight mt-0.5 truncate">
              {location.name}
            </h2>
            {location.name_ar && (
              <p className="font-arabic text-base text-brand text-right truncate">
                {location.name_ar}
              </p>
            )}
            {location.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {location.description}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              <span>
                {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-5 space-y-5">
          {location.extra_images && location.extra_images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 scrollbar-none">
              {location.extra_images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="shrink-0 h-24 w-32 object-cover rounded-xl"
                />
              ))}
            </div>
          )}
          {loading && <SheetSkeleton />}

          {!loading && detail && (
            <>
              {/* Before/After media */}
              {detail.media.length > 0 && (
                <section>
                  <h3 className="font-serif font-bold text-sm mb-2">
                    Before & After
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                    {detail.media.map((m) => (
                      <div
                        key={m.id}
                        className="shrink-0 w-64 bg-muted rounded-2xl overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-px bg-border">
                          <ImagePane
                            src={m.before_image_url}
                            year={m.year_before}
                            label="Before"
                          />
                          <ImagePane
                            src={m.after_image_url}
                            year={m.year_after}
                            label="After"
                          />
                        </div>
                        {m.caption && (
                          <p className="text-xs text-muted-foreground p-2 leading-snug">
                            {m.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Artifacts */}
              {detail.artifacts.length > 0 && (
                <section>
                  <h3 className="font-serif font-bold text-sm mb-2">Artifacts</h3>
                  <ul className="space-y-2">
                    {detail.artifacts.map((a) => {
                      const isOpen = expanded === a.id;
                      return (
                        <li
                          key={a.id}
                          className="bg-muted rounded-2xl overflow-hidden"
                        >
                          <button
                            onClick={() => setExpanded(isOpen ? null : a.id)}
                            className="w-full flex items-center gap-3 p-2.5 text-left"
                          >
                            <div className="size-12 rounded-xl bg-card overflow-hidden shrink-0 flex items-center justify-center">
                              {a.image_url ? (
                                <img
                                  src={a.image_url}
                                  alt={a.artifact_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl">🏺</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm truncate">
                                {a.artifact_name}
                              </p>
                              {a.artifact_name_ar && (
                                <p className="font-arabic text-xs text-muted-foreground truncate">
                                  {a.artifact_name_ar}
                                </p>
                              )}
                            </div>
                            {a.description &&
                              (isOpen ? (
                                <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                              ) : (
                                <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                              ))}
                          </button>
                          {isOpen && a.description && (
                            <p className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">
                              {a.description}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Community archives */}
              <section>
                <h3 className="font-serif font-bold text-sm mb-2">
                  Community Archives
                </h3>
                {detail.archives.length === 0 ? (
                  <p className="text-xs text-muted-foreground bg-muted rounded-2xl p-3">
                    No archives yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {detail.archives.map((ar) => (
                      <li
                        key={ar.id}
                        className="bg-muted rounded-2xl p-3 flex items-center justify-between gap-2"
                      >
                        <p className="text-sm font-medium truncate">{ar.title}</p>
                        <span className="text-[10px] uppercase tracking-wider bg-success/15 text-success px-2 py-1 rounded-full font-semibold shrink-0">
                          Approved
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleShare}
                  className="flex-1 h-11 rounded-xl bg-beige text-brand-dark font-semibold text-sm inline-flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                  {copied ? "Link copied" : "Share"}
                </button>
                <Link
                  to="/location/$id"
                  params={{ id: location.id }}
                  className="flex-1 h-11 rounded-xl bg-brand-dark text-brand-foreground font-semibold text-sm inline-flex items-center justify-center gap-2"
                >
                  More info <ExternalLink className="size-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ImagePane({
  src,
  year,
  label,
}: {
  src: string | null;
  year: number | null;
  label: string;
}) {
  return (
    <div className="relative aspect-square bg-card overflow-hidden">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-beige flex items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      )}
      <div className="absolute bottom-1 left-1 bg-black/65 text-white text-[10px] px-1.5 py-0.5 rounded">
        {label}
        {year ? ` · ${year}` : ""}
      </div>
    </div>
  );
}

function SheetSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        <div className="shrink-0 w-64 h-32 bg-muted rounded-2xl animate-pulse" />
        <div className="shrink-0 w-64 h-32 bg-muted rounded-2xl animate-pulse" />
      </div>
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-14 bg-muted rounded-2xl animate-pulse" />
        <div className="h-14 bg-muted rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}