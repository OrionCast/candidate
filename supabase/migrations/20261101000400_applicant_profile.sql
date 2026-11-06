-- Fiche candidat enrichie (naissance, BAC, spécialité) et photo de profil facultative.
-- Les colonnes sont nullables pour ne pas casser les candidatures déjà enregistrées ;
-- le formulaire et le serveur les rendent obligatoires pour les nouveaux dépôts.

alter table public.candidates
  add column date_of_birth  date,
  add column place_of_birth text check (place_of_birth is null or char_length(place_of_birth) between 1 and 120),
  add column bac_type       text check (bac_type is null or bac_type in ('A', 'C', 'D', 'G1', 'G2', 'G3', 'BG', 'F', 'R')),
  add column bac_year       smallint check (bac_year is null or bac_year between 2015 and 2026),
  add column specialty      text check (specialty is null or specialty in ('Infrastructure Réseaux et Connectivité', 'Infrastructure Cloud')),
  add column photo_file     text;

-- Fichiers de 30 Mo maximum (comme le projet d'origine) ; la photo est une image JPG ou PNG.
update storage.buckets
set file_size_limit = 31457280
where id in ('documents', 'results');
