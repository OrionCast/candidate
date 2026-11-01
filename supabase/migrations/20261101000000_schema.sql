-- Schéma initial : candidatures et publication des résultats.
-- Remplace initDatabase() de l'ancien serveur Express/MySQL.

create table public.candidates (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null unique,
  full_name       text not null check (char_length(full_name) between 1 and 140),
  email           text check (email is null or char_length(email) <= 180),
  phone           text not null check (char_length(phone) between 1 and 30),
  city            text not null check (char_length(city) between 1 and 100),
  address         text not null check (char_length(address) between 1 and 255),
  id_file         text not null,
  diploma_file    text not null,
  cv_file         text not null,
  motivation_file text not null,
  created_at      timestamptz not null default now()
);

create index candidates_city_idx       on public.candidates (city);
create index candidates_created_at_idx on public.candidates (created_at desc);

-- Publication des résultats (une seule ligne, id = 1)
create table public.publication (
  id         smallint primary key default 1 check (id = 1),
  content    text not null default 'Les résultats ne sont pas encore publiés.',
  pdf_file   text,
  updated_at timestamptz not null default now()
);

insert into public.publication (id) values (1);

-- L'utilisateur connecté est-il administrateur ?
-- Le rôle est lu dans app_metadata, que l'utilisateur ne peut pas modifier lui-même.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;
