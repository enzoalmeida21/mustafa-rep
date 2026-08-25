-- Run in Supabase SQL Editor after creating the project.
-- Prisma manages application tables via `prisma db push` / migrate.
-- This file covers Storage policies for product images.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

create policy "Public read products"
on storage.objects for select
using (bucket_id = 'products');

create policy "Auth upload products"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

create policy "Auth update products"
on storage.objects for update
to authenticated
using (bucket_id = 'products');
