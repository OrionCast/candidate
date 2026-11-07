-- Contenu géré depuis l'administration :
--   réglages du site (période d'appel, coordonnées), spécialités, statut des candidatures,
--   actualités et galerie photos.

-- ───────────── Réglages du site (une seule ligne) ─────────────
create table public.site_settings (
  id              smallint primary key default 1 check (id = 1),
  -- Période de l'appel à candidature (affichée ; appliquée seulement si enforce_window = true)
  apply_opens_at  timestamptz,
  apply_closes_at timestamptz,
  enforce_window  boolean not null default false,
  places_count    integer not null default 300 check (places_count > 0),
  phone_primary   text not null default '+242 06 895 32 75' check (char_length(phone_primary) <= 40),
  phone_secondary text not null default '+242 05 745 89 42' check (char_length(phone_secondary) <= 40),
  contact_email   text not null default 'formationpatn@cciamb-cnia.cg' check (char_length(contact_email) <= 180),
  address         text not null default '92 Avenue Amilcar CABRAL, Centre-ville, Brazzaville' check (char_length(address) <= 255),
  updated_at      timestamptz not null default now(),
  check (apply_closes_at is null or apply_opens_at is null or apply_closes_at > apply_opens_at)
);

-- Du 23 novembre au 6 décembre 2026 (heure de Brazzaville, UTC+1)
insert into public.site_settings (id, apply_opens_at, apply_closes_at)
values (1, '2026-11-23 00:00:00+01', '2026-12-06 23:59:59+01');

alter table public.site_settings enable row level security;

create policy "tout le monde lit les réglages"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "admin modifie les réglages"
  on public.site_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────── Spécialités ─────────────
create table public.specialties (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 100),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index specialties_name_unique on public.specialties (lower(btrim(name)));

insert into public.specialties (name) values
  ('Infrastructure Réseaux et Connectivité'),
  ('Infrastructure Cloud');

-- La liste n'est plus figée dans la base : elle est contrôlée par la table specialties.
alter table public.candidates drop constraint if exists candidates_specialty_check;

alter table public.specialties enable row level security;

create policy "lecture des spécialités"
  on public.specialties for select to anon, authenticated
  using (active or public.is_admin());

create policy "admin ajoute des spécialités"
  on public.specialties for insert to authenticated
  with check (public.is_admin());

create policy "admin modifie les spécialités"
  on public.specialties for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────── Statut des candidatures ─────────────
alter table public.candidates
  add column status text not null default 'pending'
  check (status in ('pending', 'accepted', 'rejected'));

create index candidates_status_idx on public.candidates (status);

create policy "admin modifie les candidatures"
  on public.candidates for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────── Actualités ─────────────
create table public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(btrim(title)) between 1 and 200),
  body         text not null check (char_length(btrim(body)) between 1 and 5000),
  category     text not null check (category in ('Guides pratiques', 'Conseils', 'Suivi des dossiers')),
  badge        text not null default 'Information' check (char_length(btrim(badge)) between 1 and 40),
  tone         text not null default 'info' check (tone in ('info', 'warning', 'danger')),
  kicker       text not null default '' check (char_length(kicker) <= 80),
  link_label   text not null default '' check (char_length(link_label) <= 80),
  -- Lien interne (/candidature) ou externe en https uniquement
  link_href    text not null default '' check (link_href = '' or link_href ~ '^/[A-Za-z0-9/_#-]*$' or link_href ~ '^https://'),
  meta         text not null default '' check (char_length(meta) <= 80),
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index news_published_at_idx on public.news (published_at desc);

insert into public.news (title, body, category, badge, tone, kicker, link_label, link_href, meta, published_at) values
  ('Comment bien préparer et structurer son dossier de candidature ?',
   'Avant de valider votre formulaire en ligne, vérifiez l''exactitude de vos coordonnées personnelles, la validité de votre pièce d''identité nationale et la numérisation complète de vos diplômes requis.',
   'Guides pratiques', 'Information pratique', 'info', 'Candidature en ligne',
   'Accéder au formulaire de dépôt', '/candidature', 'Temps de lecture : 3 min', now()),
  ('Vérifiez la lisibilité et le format de vos pièces jointes',
   'Les documents flous ou incomplets peuvent entraîner un retard dans le traitement de votre demande. Assurez-vous d''utiliser le format PDF ou JPG et de ne pas dépasser la taille maximale tolérée.',
   'Conseils', 'À retenir', 'warning', 'Conseil aux candidats',
   'Voir les consignes requises', '/candidature', 'Documents requis', now() - interval '1 minute'),
  ('Conservez précieusement votre code de référence',
   'Dès la confirmation de votre dépôt, un numéro d''enregistrement unique vous est attribué. Ce code est obligatoire pour effectuer tout suivi ou adresser une demande d''assistance.',
   'Suivi des dossiers', 'Important', 'danger', 'Après soumission',
   'Obtenir de l''aide / Contact', '/contact', 'Suivi dossier', now() - interval '2 minutes');

alter table public.news enable row level security;

create policy "lecture des actualités publiées"
  on public.news for select to anon, authenticated
  using (published or public.is_admin());

create policy "admin ajoute des actualités"
  on public.news for insert to authenticated
  with check (public.is_admin());

create policy "admin modifie les actualités"
  on public.news for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin supprime des actualités"
  on public.news for delete to authenticated
  using (public.is_admin());

-- ───────────── Galerie ─────────────
create table public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  category     text not null check (category in ('formation', 'atelier', 'evenement', 'campus')),
  title        text not null check (char_length(btrim(title)) between 1 and 200),
  place        text not null default '' check (char_length(place) <= 120),
  -- Mise en page : « wide » occupe 2 colonnes, « tall » 2 lignes
  size         text check (size in ('wide', 'tall')),
  -- Photo envoyée dans le bucket « gallery » ; external_url sert aux photos d'illustration
  image_path   text,
  external_url text check (external_url is null or external_url ~ '^https://'),
  published    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  check (image_path is not null or external_url is not null)
);

create index gallery_items_order_idx on public.gallery_items (sort_order, created_at desc);

-- Photos d'illustration du projet d'origine (remplaçables depuis l'admin)
insert into public.gallery_items (category, title, place, size, external_url, sort_order) values
  ('formation', 'Session d''ouverture — Promotion 2026', 'Brazzaville · CCIAMB', 'wide', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', 1),
  ('atelier', 'Atelier pratique — Administration réseau', 'Configuration et sécurité', 'tall', 'https://images.unsplash.com/photo-1531482615713-2afd69097998', 2),
  ('campus', 'Campus numérique — Salle de formation', 'Pointe-Noire', null, 'https://images.unsplash.com/photo-1497366216548-37526070297c', 3),
  ('formation', 'Travail collaboratif entre apprenants', 'Projets en équipe', null, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', 4),
  ('evenement', 'Cérémonie de lancement officiel', 'Autorités et partenaires', 'wide', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 5),
  ('atelier', 'Atelier Cloud — Virtualisation', 'AWS · Azure · GCP', null, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', 6),
  ('campus', 'Espace de travail collaboratif', 'Salles équipées', null, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', 7),
  ('formation', 'Session de mentorat avec les formateurs', 'Accompagnement personnalisé', null, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 8),
  ('evenement', 'Remise des attestations', 'Cérémonie de clôture', null, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', 9),
  ('atelier', 'Atelier de résolution de problèmes', 'Cas pratiques', null, 'https://images.unsplash.com/photo-1552664730-d307ca884978', 10),
  ('campus', 'Vue extérieure du campus', 'Brazzaville', null, 'https://images.unsplash.com/photo-1562774053-701939374585', 11),
  ('formation', 'Travaux pratiques sur machines', 'Laboratoire informatique', null, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 12);

alter table public.gallery_items enable row level security;

create policy "lecture des photos publiées"
  on public.gallery_items for select to anon, authenticated
  using (published or public.is_admin());

create policy "admin ajoute des photos"
  on public.gallery_items for insert to authenticated
  with check (public.is_admin());

create policy "admin modifie les photos"
  on public.gallery_items for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin supprime des photos"
  on public.gallery_items for delete to authenticated
  using (public.is_admin());

-- Bucket public pour les photos de la galerie (les envois passent par des URLs signées du serveur)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
