create table if not exists artists(
id uuid primary key default gen_random_uuid(),
slug text unique,
artist_name text,
plan text default 'free',
created_at timestamptz default now()
);