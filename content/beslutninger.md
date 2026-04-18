---
title: Beslutninger
---

# Beslutninger

Alle beslutninger lever her. Hver beslutning har en status — **Afventer**, **Ryan OK**, **Partner OK**, **Godkendt** eller **Afvist** — og kræver stemmer fra os begge før den flytter sig. Bruger noten-feltet når I vælger *Diskutér* for at forklare hvorfor.

Listen trækkes automatisk fra Supabase. Hvis den er tom, så kør `node scripts/seed-decisions.mjs` lokalt (kræver service-role nøgle).

<div id="decisions-list" data-mode="all">
  <p class="muted">Indlæser beslutninger…</p>
</div>

## Sådan læser du et beslutnings-kort

- **Fase-tag** fortæller hvor i vores plan beslutningen hører til.
- **🔒 BLOKERENDE** betyder at vi ikke kan komme videre i den fase før beslutningen er taget.
- **Stemmerne** vises nederst. Vi kan altid ændre vores stemme ved at klikke igen.
- Når vi **begge** stemmer *Accept*, flytter status automatisk til **Godkendt**. Ét *Afvis* flytter den til **Afvist**. Blandede stemmer giver **Diskutér**.

## Sådan tilføjer du en ny beslutning

Indtil vi bygger en UI til det, sker det direkte i Supabase:

```sql
insert into decisions (slug, title, phase, description, blocking)
values ('min-slug', 'Min beslutning', 'Fase X', 'Beskrivelse...', true);
```

Eller udvid `scripts/seed-decisions.mjs` og kør den igen (den er idempotent — upsert på slug).
