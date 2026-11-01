-- Buckets Storage.
-- documents : privé, pièces des candidats (5 Mo max, types MIME contrôlés par Supabase).
-- results   : public, PDF officiel des résultats.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('documents', 'documents', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png']),
  ('results',   'results',   true,  5242880, array['application/pdf'])
on conflict (id) do nothing;

-- Les administrateurs peuvent consulter les documents des candidats.
-- Les envois passent par des URLs signées délivrées par le serveur : aucune policy d'écriture publique.
create policy "admin lit les documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.is_admin());
