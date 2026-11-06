# Supabase

Les migrations de `migrations/` sont à exécuter dans l'ordre (SQL Editor du tableau de bord Supabase, ou `supabase db push` avec la CLI).

1. `..._schema.sql` : tables `candidates` et `publication`, fonction `is_admin()`
2. `..._rls.sql` : Row Level Security
3. `..._storage.sql` : buckets `documents` (privé) et `results` (public)
4. `..._cities.sql` : table `cities` (villes du formulaire, gérées depuis l'admin) avec Brazzaville et Pointe-Noire
5. `..._applicant_profile.sql` : date et lieu de naissance, BAC, spécialité, photo de profil ; fichiers limités à 30 Mo

## Donner le rôle admin à un compte

Créez d'abord l'utilisateur dans **Authentication → Users**, puis exécutez (en remplaçant l'e-mail) :

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
where email = 'votre-admin@exemple.com';
```

Ce rôle doit être dans `app_metadata`, jamais dans `user_metadata` (modifiable par l'utilisateur).
Désactivez aussi « Allow new users to sign up » dans **Authentication → Sign In / Providers**.
