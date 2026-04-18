---
title: Wisestep Hub
---

# Wisestep Hub

Velkommen. Dette er arbejdsrummet for vores iOS-projekt — AI-drevne, audio-guidede byvandringer, med første produkt *Kierkegaards København*.

Siden er bygget som et **levende dokument**. Alt indhold er markdown, alle beslutninger er versioneret, og vi kan begge kommentere direkte på hvert afsnit. Hub'en er privat og kun tilgængelig bag Google-login.

## Hvad er det vi bygger?

En iOS-app der tager brugeren med på en 45 minutters guidet vandretur gennem Kierkegaards København. Seks stop, AI-syntetiserede stemmer der dramatiserer kilderne, geofencing der udløser de rigtige spor på de rigtige steder, og en dramaturgisk ramme der binder det hele sammen.

Første tour er *Kierkegaards København*. Hvis det virker, bliver det til en platform for flere ture — derfor vælger vi fra start et paraply-brand der ikke låser os til én enkelt filosof.

## Sådan arbejder vi her

- **Faserne** er vores masterplan. Hver fase rummer beslutninger (🔒 blokerende eller 🔄 løbende) og en sektion med advarsler og faldgruber.
- **Beslutninger** får hver især et kort hvor vi begge kan stemme *Accept*, *Afvis* eller *Diskutér* med en valgfri note. En beslutning bliver først markeret som godkendt når vi begge har sagt ja.
- **Kommentarer** kan tilføjes på hver sektion — klik på det lille ikon i margin når du hover'er over en overskrift. Kommentarer opdaterer i realtid.

## Status

**Fase 0 — Strategiske fundamenter** er aktiv. De syv første blokerende beslutninger er seedet og venter på stemmer på [Beslutninger](beslutninger.html)-siden.

**Næste mikroskridt:**

1. Tag de syv blokerende beslutninger i Fase 0 og Fase 1 — mest kritisk: virksomhedsstruktur, Apple Developer enrollment, og paraply-brand-navn (de tre hænger sammen).
2. Book en IP-advokat-konsultation om AI-stemme-rettigheder og Kierkegaard-efterligning (Fase 2).
3. Udkast til dramaturgisk skelet for en tour (Fase 3) — kan laves parallelt med det juridiske.

## Infrastruktur

- **Live**: [ryaveldk.github.io/wisestep-hub](https://ryaveldk.github.io/wisestep-hub/)
- **Deploy**: push til `main` → GitHub Pages rebuilder `docs/` automatisk (~1–2 min).
- **Backend**: Supabase (auth via Google, tre tabeller med RLS, realtime på kommentarer og stemmer).
- **Adgang**: pt. åbent for enhver authenticated Google-konto; whitelist-policies ligger klar til aktivering i repo'ets `README.md` så snart partners mail er kendt.

## Faser

1. [Fundamenter](faser/00-fundamenter.html) — virksomhed, Apple-konto, brand, forretningsmodel
2. [Produktdefinition](faser/01-produktdefinition.html) — MVP-scope, sprog, gruppelytning
3. [Jura](faser/02-jura.html) — AI-stemmer, GDPR, forbrugerret, AI Act
4. [Indhold](faser/03-indhold.html) — dramaturgi, manuskripter, lyddesign
5. [Teknik](faser/04-teknik.html) — geofencing, lydmotor, StoreKit
6. [App Store](faser/05-appstore.html) — metadata, screenshots, review notes
7. [Test](faser/06-test.html) — alpha, TestFlight, edge cases
8. [Lancering](faser/07-lancering.html) — timing, presse, partnerships
9. [Post-launch](faser/08-postlaunch.html) — iteration, tour #2, automatisering
