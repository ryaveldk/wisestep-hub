# Wisestep Hub

Privat samarbejds-hub for Wisestep-projektet — det levende dokument for vores iOS-app, første produkt *Kierkegaards København*.

**Live**: https://ryaveldk.github.io/wisestep-hub/
**Repo**: https://github.com/ryaveldk/wisestep-hub (privat)
**Supabase**: https://supabase.com/dashboard/project/mfrdpvnhbdankggvkycg

---

## Status (pr. 2026-04-18)

✅ **Hub'en kører**. Du er logget ind via Google, siderne loader, kommentarer gemmes i realtid, beslutnings-kort tager imod stemmer.

Hvad der er på plads:

| Område               | Status | Noter                                                                 |
|----------------------|--------|-----------------------------------------------------------------------|
| GitHub Pages deploy  | ✅      | Fra `main/docs/`, auto-deploy 1–2 min efter push                      |
| Google OAuth login   | ✅      | PKCE-flow via Supabase, session persisteres i localStorage            |
| Supabase tabeller    | ✅      | `decisions`, `decision_votes`, `comments` oprettet                     |
| RLS-policies         | ⚠️      | Åbent for alle authenticated. **Bør lukkes til whitelist** (se nedenfor) |
| Realtime subscriptions| ✅      | Kommentarer og afstemninger opdaterer live på tværs af browsere       |
| Seed-beslutninger    | ✅      | 7 blokerende beslutninger er indsat                                    |
| Partner-invitation   | ❌      | Whitelist-mail mangler i RLS (spørg partner, opdatér SQL nedenfor)    |
| Tour-manuskripter    | ❌      | Placeholder — afventer Fase 3-beslutninger                             |

---

## Sådan arbejder vi fremover

### Daglig rytme
1. Redigér markdown i `/content/**/*.md` — det er den eneste kilde til sandhed for alt indhold.
2. `npm run build` — genererer HTML i `/docs/`.
3. `npm run dev` (valgfrit) — server på localhost:8000 så du kan se ændringer før commit.
4. `git add -A && git commit -m "..." && git push` — Pages deployer automatisk.

> **Husk**: `docs/` skal commit'es sammen med `content/`. Glemmer du build, er live-siden ikke opdateret.

### Beslutninger
- Blokerende beslutninger diskuteres direkte på [beslutninger-siden](https://ryaveldk.github.io/wisestep-hub/beslutninger.html). Begge stemmer → status flytter sig.
- Nye beslutninger tilføjes enten via SQL eller ved at udvide `scripts/seed-decisions.mjs` og køre det igen (idempotent).

### Kommentarer
- Hvert `## h2`-afsnit kan kommenteres — klik det lille 💬-ikon der viser sig ved hover.
- Opløs færdigdiskuterede tråde med "Marker løst".

---

## Setup (første gang på en ny maskine)

```bash
git clone https://github.com/ryaveldk/wisestep-hub.git
cd wisestep-hub
npm install
npm run build
npm run dev   # http://localhost:8000
```

Kræver Node 20+.

---

## Projektstruktur

```
content/                   # markdown-kilder — det levende dokument
  index.md                 # forside
  faser/                   # 9 fase-dokumenter (00 → 08)
  beslutninger.md          # liste-side med dynamiske kort
  manuskripter/            # tour-manuskripter (placeholder)
docs/                      # build-output — SERVERES AF GITHUB PAGES
  index.html, faser/*.html, …
  css/style.css
  js/
    config.js              # Supabase URL + anon key (OK at committe)
    supabase.js            # client-init + helpers
    auth.js                # Google-login + session
    comments.js            # inline kommentarer + realtime
    decisions.js           # beslutnings-kort + voting
    app.js                 # entry point
scripts/
  build.mjs                # markdown → HTML
  seed-decisions.mjs       # seeder beslutninger (kræver service-role key)
package.json
README.md
```

---

## Opgaver man ofte løber ind i

### Tilføje en ny side

1. Opret `content/min-side.md` (eller under `content/faser/`):
   ```md
   ---
   title: Min side
   ---

   # Min side
   Brødtekst…
   ```
2. Tilføj sidens link i `NAV_STRUCTURE` i `scripts/build.mjs`.
3. `npm run build && git add -A && git commit -m "add: min side" && git push`.

### Tilføje en ny beslutning

**Via Supabase SQL Editor** (hurtigst til ad-hoc):
```sql
insert into decisions (slug, title, phase, description, blocking)
values ('min-slug', 'Min beslutning', 'Fase X', 'Beskrivelse…', true);
```

**Via seed-script** (hvis du vil have den versioneret):
Tilføj objektet i `DECISIONS`-arrayet i `scripts/seed-decisions.mjs` og kør scriptet igen (idempotent upsert på slug).

### Seede / re-seede beslutninger

```bash
# Hent service-role key fra:
# https://supabase.com/dashboard/project/mfrdpvnhbdankggvkycg/settings/api-keys
# Felt: "service_role" (markeret "secret", tryk Reveal). MÅ ALDRIG committes.
SUPABASE_SERVICE_KEY='eyJ...' npm run seed
```

### Låse adgang til whitelist (TODO)

RLS-policies er pt. `to authenticated using (true)` — dvs. enhver Google-konto der logger ind kan læse/skrive. Når partners mail er kendt, kør følgende i **Supabase Dashboard → SQL Editor**:

```sql
-- Erstat med faktiske mails.
create or replace function public.is_allowed_user() returns boolean
language sql stable
as $$
  select coalesce(auth.jwt()->>'email', '') in (
    'ryanvelin2@gmail.com',
    'partner@example.com'
  );
$$;

-- Drop eksisterende policies og erstat med whitelist.
drop policy if exists "auth_read"  on public.decisions;
drop policy if exists "auth_write" on public.decisions;
create policy "whitelist_read"  on public.decisions for select to authenticated using (public.is_allowed_user());
create policy "whitelist_write" on public.decisions for all    to authenticated using (public.is_allowed_user()) with check (public.is_allowed_user());

drop policy if exists "auth_read"  on public.decision_votes;
drop policy if exists "auth_write" on public.decision_votes;
create policy "whitelist_read"  on public.decision_votes for select to authenticated using (public.is_allowed_user());
create policy "whitelist_write" on public.decision_votes for all    to authenticated using (public.is_allowed_user()) with check (public.is_allowed_user());

drop policy if exists "auth_read"  on public.comments;
drop policy if exists "auth_write" on public.comments;
create policy "whitelist_read"  on public.comments for select to authenticated using (public.is_allowed_user());
create policy "whitelist_write" on public.comments for all    to authenticated using (public.is_allowed_user()) with check (public.is_allowed_user());
```

### Invitere partner

1. Partner går til https://ryaveldk.github.io/wisestep-hub/ og logger ind med Google.
2. Når de er logget ind første gang, er deres bruger oprettet i Supabase (`auth.users`). Du kan se dem i Dashboard → Authentication → Users.
3. Opdatér `is_allowed_user()` med deres mail (se SQL ovenfor).

### Skifte deployment-URL (fx custom domæne)

`docs/js/config.js` har en hardkodet `KNOWN_SITES`-liste. Tilføj den nye URL dér, og tilføj den også i Supabase Dashboard → Authentication → URL Configuration som både *Site URL* og *Redirect URL*.

---

## Troubleshooting

### Login looper / ender på 404 på github.io-roden
- Tjek at **Site URL** i Supabase er `https://ryaveldk.github.io/wisestep-hub/` (trailing slash).
- Tjek at Redirect URLs indeholder `https://ryaveldk.github.io/wisestep-hub/**`.
- Ryd browser-storage (DevTools → Application → Storage → Clear site data), hard-refresh.

### Tabeller "not found" (PGRST205)
- Sørg for SQL-create-scriptet er kørt i Supabase SQL Editor.
- Kontrollér at `supabase_realtime` publication indeholder de tre tabeller.

### Ændringer vises ikke på live-siden
- Glemte du at køre `npm run build`?
- `docs/` skal være committet og pushet.
- Pages tager 1–2 min efter push. Tjek `gh run list --repo ryaveldk/wisestep-hub` hvis det tager længere.

### "Log ind"-gaten forsvinder ikke efter login
- Dette blev fikset i commit 91f38d7 (CSS-specificitet vandt over `[hidden]`-attribut). Hvis du ser det igen, inspicér elementet — `.login-gate[hidden]` skal have `display: none`.

### Service-role key lækket til git
- Skift key øjeblikkeligt i Supabase Dashboard → Settings → API → "Reset service_role key".
- `.gitignore` dækker typiske filnavne (`service-role.key`, `supabase-service.key`, `.env*`), men key'en må aldrig ligge i committet fil overhovedet.

---

## Teknisk baggrund

- **Vanilla stack** — ingen React, ingen bundler. Ét lille build-script, ESM-imports fra CDN til Supabase-klient.
- **Markdown → HTML**: `marked` parser + gray-matter frontmatter. Post-processing tilføjer anker-IDs og kommentar-knapper til h2-overskrifter, og stylede badges til 🔒/🔄-markeringer.
- **Auth**: Supabase håndterer PKCE-flow med Google. Session gemmes i localStorage. Live re-render ved auth-state-ændringer.
- **Realtime**: én kanal per side for kommentarer (`comments:page_slug`) og én global for beslutninger. Filter på `page_slug` begrænser trafikken.
- **RLS**: tre tabeller, alle har RLS enabled. Pt. åbent for authenticated, bør strammes til whitelist.

---

## Kontakt / dashboards

- **Supabase**: https://supabase.com/dashboard/project/mfrdpvnhbdankggvkycg
- **GitHub repo**: https://github.com/ryaveldk/wisestep-hub
- **Pages settings**: https://github.com/ryaveldk/wisestep-hub/settings/pages
