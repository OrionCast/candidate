-- Villes proposées sur le formulaire de candidature, gérées depuis l'administration.
-- On désactive une ville plutôt que de la supprimer : l'historique des candidatures reste cohérent.

create table public.cities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 100),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- Une ville ne peut exister qu'une fois, quelle que soit la casse.
create unique index cities_name_unique on public.cities (lower(btrim(name)));

insert into public.cities (name) values ('Brazzaville'), ('Pointe-Noire');

alter table public.cities enable row level security;

-- Le public ne voit que les villes actives ; les administrateurs voient tout.
create policy "lecture des villes"
  on public.cities for select to anon, authenticated
  using (active or public.is_admin());

create policy "admin ajoute des villes"
  on public.cities for insert to authenticated
  with check (public.is_admin());

create policy "admin modifie les villes"
  on public.cities for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
