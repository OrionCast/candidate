-- Règles d'accès (Row Level Security).

alter table public.candidates  enable row level security;
alter table public.publication enable row level security;

-- candidates : lecture réservée aux administrateurs.
-- Aucune policy d'insertion : le dépôt passe par le serveur Next.js (clé service_role).
create policy "admin lit les candidatures"
  on public.candidates for select to authenticated
  using (public.is_admin());

-- publication : lecture publique, modification réservée aux administrateurs
create policy "tout le monde lit les résultats"
  on public.publication for select to anon, authenticated
  using (true);

create policy "admin modifie les résultats"
  on public.publication for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
