-- Link approved community archives to map locations
CREATE TABLE IF NOT EXISTS public.location_archive_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES public.map_locations(id) ON DELETE CASCADE,
  archive_record_id uuid NOT NULL REFERENCES public.archive_records(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(location_id, archive_record_id)
);

ALTER TABLE public.location_archive_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read archive links"
ON public.location_archive_links
FOR SELECT
USING (true);

CREATE INDEX IF NOT EXISTS idx_location_archive_links_location ON public.location_archive_links(location_id);

-- Add attendee fields for guest/attendee bookings
ALTER TABLE public.event_bookings
  ADD COLUMN IF NOT EXISTS attendee_name text,
  ADD COLUMN IF NOT EXISTS attendee_email text,
  ADD COLUMN IF NOT EXISTS attendee_phone text;