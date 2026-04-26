alter table public.map_locations
  add column if not exists primary_image_url text,
  add column if not exists extra_images text[] not null default '{}';