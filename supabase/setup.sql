-- ═══════════════════════════════════════════════════════════════
--  Vipin Tatad website — gallery uploads (Supabase)
--  Run once: Supabase dashboard → SQL Editor → New query → paste → Run
-- ═══════════════════════════════════════════════════════════════

-- 1) Table that lists uploaded photos
create table if not exists public.gallery_photos (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,          -- file path inside the storage bucket
  url         text not null,                 -- public URL of the image
  caption     text not null default '',
  width       int,
  height      int,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_photos_created_idx on public.gallery_photos (created_at desc);

-- 2) Row Level Security: everyone can view, only logged-in admins can add / edit / delete
alter table public.gallery_photos enable row level security;

drop policy if exists "Public can view photos"   on public.gallery_photos;
drop policy if exists "Admins can add photos"    on public.gallery_photos;
drop policy if exists "Admins can edit photos"   on public.gallery_photos;
drop policy if exists "Admins can delete photos" on public.gallery_photos;

create policy "Public can view photos"   on public.gallery_photos for select to anon, authenticated using (true);
create policy "Admins can add photos"    on public.gallery_photos for insert to authenticated with check (true);
create policy "Admins can edit photos"   on public.gallery_photos for update to authenticated using (true) with check (true);
create policy "Admins can delete photos" on public.gallery_photos for delete to authenticated using (true);

-- 3) Public storage bucket for the image files (max 8 MB each, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view gallery files"   on storage.objects;
drop policy if exists "Admins can upload gallery files" on storage.objects;
drop policy if exists "Admins can delete gallery files" on storage.objects;

create policy "Public can view gallery files"   on storage.objects for select to anon, authenticated using (bucket_id = 'gallery');
create policy "Admins can upload gallery files" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');
create policy "Admins can delete gallery files" on storage.objects for delete to authenticated using (bucket_id = 'gallery');
