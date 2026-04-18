---
title: Fase 3 — Indhold
---

# Fase 3 — Indhold

Det er her produktet faktisk bliver produktet. App'en er transportmidlet; indholdet er det brugeren køber. En dårlig tur i en god app bliver ikke købt. En god tur i en OK app kan vinde alligevel. Denne fase kræver både dramaturgisk tæft og produktions-disciplin.

## Dramaturgisk struktur 🔒

Hvordan er en Wisestep-tur bygget op? Forslag til fast skelet for alle ture:

1. **Åbning** (før første geofence): tonen sættes. Hvem er vi? Hvilken filosof møder du? Hvad skal du kigge efter?
2. **Stop 1–5**: dramatiserede scener, hvert stop har en tese og en tvist.
3. **Transitioner** mellem stop: lette, refleksive passages der knytter de fysiske bevægelser til det intellektuelle.
4. **Stop 6 / afslutning**: emotionel klimaks. Ikke nødvendigvis svar, men forløsning.
5. **Epilog**: hvem skrev, hvad læste de, hvorfor vælger vi at fortælle det.

Struktur-beslutningen påvirker manuskript-længde, lyddesign og navigations-logik. Den skal låses tidligt.

## Dead air 🔒

Hvad sker der når brugeren går fra stop 3 til stop 4? Tre modeller:

- **Stilhed**: autentisk, men brugeren er usikker på om app'en virker.
- **Ambient lyddesign**: byens lyde, musik, klavernoter — bevarer stemning, indikerer "vi kører stadig".
- **Kontinuerlig fortæller-stemme**: konstant selskab, risikerer at blive irriterende over 45 min.

**Anbefaling: ambient lyddesign med lav volumen + kort voice cue når næste geofence er tæt på.** "Du nærmer dig Frue Plads — drej til venstre ved kirken."

## Fallback-states 🔒

Hvad hvis brugeren går uden for geofence-radius? Hvad hvis de stopper midt i et stop for at tage et billede? Hvad hvis de går hele turen baglæns?

Vi skal beslutte:
- **Genoptagelse**: kan brugeren trykke "fortsæt fra sidst" næste dag?
- **Ude-af-zone-håndtering**: pauser vi automatisk? Giver vi en rute-tilbage-kue?
- **Udenfor-by-håndtering**: hvad hvis nogen køber turen fra Aarhus?

## Manuskript-længde per stop 🔒

**Forslag: 3–5 minutter per stop.** Kortere end et podcast-segment, længere end et museums-audio-guide. Nok til at dramatisere, kort nok til at brugeren ikke bliver rodfæstet.

Total: 6 stop × 4 min + transitioner (8 × ~1,5 min) = ~36 min lyd. Lægger vi 9 min til åbning og epilog kommer vi til 45 min.

## Stemmeroller 🔒

Hvem er hvem? Minimumsbesætning:

- **Fortæller** (vores voice-of-narrator, neutral, moden)
- **Kierkegaard** (ung-voksen mand, øresundsk accent?, melankolsk-varm)
- **Regine Olsen** (ung kvinde, lettere stemme)

Udvidelse hvis budget tillader:
- **Brødre / venner / kritikere** (2–3 støtte-stemmer)
- **Journal-stemme** (Kierkegaard i whisper-mode, til dagbogs-citater)

Beslutning: hvor mange unikke AI-stemmer indkøber/træner vi? Flere stemmer = højere produktionsomkostning + bedre dramaturgi.

## Manuskript-iteration 🔄

Proces:

1. **Skitse** (1 side per stop) — dramatiserer scene, sætter tese.
2. **Fuldt manuskript** (3–5 min per stop) — dialog, transitions, fakta-kontrol.
3. **Læsning højt** — fang upraktiske formuleringer (AI'er snubler i lange bisætninger).
4. **AI-syntese test** — hør om stemmen fanger rytmen.
5. **Fieldtest** — én af os går turen, lytter, noterer.
6. **Endelig version**.

Hvert stop tager anslået 8–15 timer manuskript + 2–4 timer AI-produktion + 1–2 timer lyddesign.

## Faktatjek 🔄

Kierkegaards liv er godt dokumenteret, men anekdote-kvalitet varierer. Brug *Søren Kierkegaards Skrifter*-kommentarer, biografier af Joakim Garff og Kirmmse, samt Det Kgl. Bibliotek som primære kilder. **Vi skal ikke digte fakta, men vi må gerne dramatisere hvad vi ved.**

## Lyddesign-pipeline 🔄

Værktøjskæde (forslag):

1. **Manuskript** → Google Docs eller Scrivener
2. **AI-syntese** → ElevenLabs (eller valgt leverandør)
3. **DAW** → Logic Pro eller Reaper, til mix, ambient layers, musik
4. **Master** → AU-plugins eller ekstern mastering-service
5. **Format** → M4A eller Opus, 64–96 kbps, mono
6. **Tag / metadata** → embedded chapter markers til geofence-cues

## Advarsler & gotchas

- **AI-udtale af danske navne** er en kendt svaghed. "Regine" kan blive til "rejn" eller "regeen". Brug leverandørens pronunciation-override-funktion hvis den findes, ellers fonetisk stavning i manuskript.
- **Manuskript-længde-drift**: 3 min bliver let til 6 min når vi læser det højt. Stram op i revision.
- **Dead air-frustration**: test med ikke-tekniske brugere. Hvis de siger "gik der noget i stykker?" når de går fra stop 2 til 3, har vi et problem.
- **Lyd-format**: 128 kbps stereo lyder smukt men gør app-download 2× større. Ikke værd det.
- **Fakta-fejl**: ét stop med én forkert årstal ender på Reddit. Factcheck dobbelt.
