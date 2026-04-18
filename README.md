# Wisestep Hub

Privat samarbejds-hub for Wisestep-projektet — det levende dokument for vores iOS-app *Kierkegaards København*.

- **Indhold**: markdown i `/content/` bygges til statisk HTML i `/docs/`
- **Hosting**: GitHub Pages fra `/docs/` på `main`
- **Backend**: Supabase (auth + decisions + comments)
- **Frontend**: vanilla HTML/CSS/JS — ingen React, ingen build-tools ud over ét Node-script

**Live-URL** (når deploy er aktiveret):
https://ryaveldk.github.io/wisestep-hub

---

## Setup

Kræver Node 20+ og npm.

```bash
git clone git@github.com:ryaveldk/wisestep-hub.git
cd wisestep-hub
npm install
npm run build
npm run dev      # serverer docs/ på http://localhost:8000
```

## Daglig workflow

1. Redigér markdown i `/content/**/*.md`.
2. Kør `npm run build` — det genererer HTML i `/docs/`.
3. Kør `npm run dev` for at tjekke lokalt.
4. `git add content/ docs/ && git commit -m "..." && git push`.
5. GitHub Actions deployer automatisk via Pages.

> **Husk**: `docs/` skal committes sammen med `content/`. Vi bruger ikke `gh-pages`-branch, vi server direkte fra `main/docs/`. Hvis du glemmer at køre build får live-siden ikke dine ændringer.

## Tilføje en ny side

1. Opret `content/min-side.md` (eller `content/faser/xx-navn.md`).
2. Tilføj frontmatter:
   ```md
   ---
   title: Min side
   ---

   # Min side
   ...
   ```
3. Tilføj sidens link i `NAV_STRUCTURE` i `scripts/build.mjs`.
4. Kør `npm run build`.

## Tilføje en ny beslutning

**Via Supabase SQL editor:**

```sql
insert into decisions (slug, title, phase, description, blocking)
values ('min-slug', 'Min beslutning', 'Fase X', 'Beskrivelse…', true);
```

Eller tilføj objektet i `DECISIONS`-arrayet i `scripts/seed-decisions.mjs` og kør scriptet igen (det er idempotent — upsert på slug).

## Seed initial beslutninger

Første gang (eller når du har tilføjet nye):

```bash
# Hent service-role key fra:
#   Supabase Dashboard → Project Settings → API → service_role (secret)
# Denne key må ALDRIG committes. .gitignore dækker de mest oplagte filnavne.

SUPABASE_SERVICE_KEY=eyJ...service-role-key... npm run seed
```

Scriptet upserter på `slug`, så det er sikkert at køre flere gange.

## Låse adgang til kun jer to

Row Level Security (RLS) er slået til på alle tre tabeller. Erstat RLS-policies med email-whitelist når du kender din partners e-mail:

```sql
-- Kør i Supabase SQL editor, erstat med faktiske mails.
create or replace function public.is_allowed_user() returns boolean
language sql stable
as $$
  select auth.jwt()->>'email' in ('ryanvelin2@gmail.com', 'partner@example.com');
$$;

-- Drop eksisterende policies og erstat med whitelist-versioner.
drop policy if exists "read_all" on decisions;
drop policy if exists "write_all" on decisions;
create policy "whitelist_read"  on decisions for select using (public.is_allowed_user());
create policy "whitelist_write" on decisions for all    using (public.is_allowed_user()) with check (public.is_allowed_user());

drop policy if exists "read_all" on decision_votes;
drop policy if exists "write_all" on decision_votes;
create policy "whitelist_read"  on decision_votes for select using (public.is_allowed_user());
create policy "whitelist_write" on decision_votes for all    using (public.is_allowed_user()) with check (public.is_allowed_user());

drop policy if exists "read_all" on comments;
drop policy if exists "write_all" on comments;
create policy "whitelist_read"  on comments for select using (public.is_allowed_user());
create policy "whitelist_write" on comments for all    using (public.is_allowed_user()) with check (public.is_allowed_user());
```

Derudover: i **Supabase Dashboard → Authentication → URL Configuration**, tilføj `https://ryaveldk.github.io/wisestep-hub/` som *Site URL* og som *Redirect URL*.

## Supabase dashboard

https://supabase.com/dashboard/project/mfrdpvnhbdankggvkycg

## Kode-struktur

```
content/           markdown-kilder
docs/              build-output + statiske assets (GitHub Pages rod)
  css/style.css
  js/
    config.js      Supabase URL + anon key (OK at committe)
    supabase.js    client init + helpers
    auth.js        Google-login + session
    comments.js    inline comments
    decisions.js   beslutnings-kort + voting
    app.js         entry point
scripts/
  build.mjs        markdown → HTML
  seed-decisions.mjs
.github/workflows/deploy.yml
```
