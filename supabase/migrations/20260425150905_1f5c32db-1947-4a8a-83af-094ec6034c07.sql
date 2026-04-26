
-- ============= Helper: updated_at trigger =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============= MAP =============
CREATE TABLE public.map_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  description_ar TEXT,
  category TEXT NOT NULL CHECK (category IN ('mosque','church','museum','library','historical','site')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.location_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.map_locations(id) ON DELETE CASCADE,
  before_image_url TEXT,
  after_image_url TEXT,
  year_before INT,
  year_after INT,
  caption TEXT
);

CREATE TABLE public.location_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.map_locations(id) ON DELETE CASCADE,
  artifact_name TEXT NOT NULL,
  artifact_name_ar TEXT,
  description TEXT,
  image_url TEXT
);

ALTER TABLE public.map_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read locations" ON public.map_locations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read media" ON public.location_media FOR SELECT USING (true);
CREATE POLICY "Public read artifacts" ON public.location_artifacts FOR SELECT USING (true);

-- ============= EVENTS =============
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  image_url TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_name TEXT NOT NULL,
  location_name_ar TEXT,
  ticket_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  total_seats INT NOT NULL,
  seats_remaining INT NOT NULL,
  organizer_name TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','cancelled','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  ticket_quantity INT NOT NULL DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('card','bank_transfer','free')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_reference TEXT,
  ticket_qr_code TEXT,
  receipt_url TEXT,
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE TABLE public.saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (status = 'published');
CREATE POLICY "User own bookings" ON public.event_bookings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User own saved" ON public.saved_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============= VAULT =============
CREATE TABLE public.vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  family_access_code TEXT,
  pin_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.archive_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','approved','rejected')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.archive_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES public.archive_records(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.archive_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES public.archive_records(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.vault_family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID NOT NULL REFERENCES public.vaults(id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'view' CHECK (access_level IN ('view','edit')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vault_id, member_user_id)
);

ALTER TABLE public.vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner vault access" ON public.vaults
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner archive access" ON public.archive_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family view archive" ON public.archive_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vault_family_members vfm
      JOIN public.vaults v ON v.id = vfm.vault_id
      WHERE vfm.member_user_id = auth.uid()
        AND v.user_id = archive_records.user_id
    )
  );

CREATE POLICY "Owner doc access" ON public.archive_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.archive_records ar WHERE ar.id = record_id AND ar.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.archive_records ar WHERE ar.id = record_id AND ar.user_id = auth.uid())
  );

CREATE POLICY "Owner image access" ON public.archive_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.archive_records ar WHERE ar.id = record_id AND ar.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.archive_records ar WHERE ar.id = record_id AND ar.user_id = auth.uid())
  );

CREATE POLICY "Vault owner manages family" ON public.vault_family_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vaults v WHERE v.id = vault_id AND v.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.vaults v WHERE v.id = vault_id AND v.user_id = auth.uid())
  );

-- updated_at triggers
CREATE TRIGGER trg_vaults_updated BEFORE UPDATE ON public.vaults
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_archive_records_updated BEFORE UPDATE ON public.archive_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= STORAGE =============
INSERT INTO storage.buckets (id, name, public)
VALUES ('vault-files', 'vault-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Owner vault storage read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'vault-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Owner vault storage insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vault-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Owner vault storage update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'vault-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Owner vault storage delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vault-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );
