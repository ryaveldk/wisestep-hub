---
title: Fase 0 — Strategiske fundamenter
---

# Fase 0 — Strategiske fundamenter

Før vi skriver en linje kode eller optager en lydfil, skal vi have det juridiske og forretningsmæssige skelet på plads. Det er ikke den sjove del, men beslutningerne her har ringvirkninger helt ud til produktnavnet, prissætningen og hvem der underskriver hvad. Alle syv beslutninger i denne fase er blokerende — ingen af dem kan vente til efter lancering.

## Virksomhedsstruktur 🔒

ApS eller enkeltmandsvirksomhed? Valget påvirker tre ting: beskatning, ansvarsbegrænsning og fradragsmuligheder. Et ApS koster 40.000 kr i startkapital og medfører administration, men beskytter privatøkonomien hvis noget går galt — fx hvis Kierkegaard-arvingen vrider sig eller en Apple-review afslører en utilsigtet overtrædelse af tredjepartsrettigheder. En enkeltmandsvirksomhed er gratis at oprette og fleksibel, men personligt hæftende.

Anbefaling: få en revisor til at regne skattemæssigt break-even baseret på vores forventede omsætning det første år, og beslut derefter. Der er en aftale hvor man starter som enkeltmand og konverterer til ApS ved break-even, men konverteringen koster tid.

## Apple Developer enrollment 🔒

Dette er den praktiske flaskehals: ingen enheds-test, ingen TestFlight, ingen App Store uden en aktiv konto. Enrollment tager typisk 1–2 uger, men kan strække sig til flere uger ved DUNS-nummer-forvikling hvis vi enroller som virksomhed.

To spor:
- **Personlig enrollment** ($99/år). Hurtigt. Men apps står i den personlige profil og kan ikke overføres senere uden papirarbejde.
- **Virksomheds-enrollment** (ApS eller enkeltmand med CVR) ($99/år). Kræver DUNS-nummer. Tager længere. Men det er sådan vi vil have det lange løb.

Anbefaling: hvis vi lander på ApS → enroll som virksomhed fra start. Hvis enkeltmand → enroll som individuel og konverter senere.

## Brand og navn 🔒

App-navnet skal ikke være "Kierkegaards København". Det låser os til én tur, og paraply-brand-strategien (hvor flere ture ligger under samme app eller under samme brand-familie af apps) kræver et navn der kan rumme flere filosoffer, byer eller genrer.

Kandidater i spil: *Wisestep*, *Philopath*, *Ruminate*, *Vandring*. Vi skal tjekke:
- **.com** og **.dk** domæne-tilgængelighed
- **Varemærke** i EU (euipo.europa.eu) og DK (dkpto.dk)
- **App Store search-ranking** for lignende navne
- **Social handles** (Instagram, TikTok, YouTube)

## Visuel identitet 🔄

Logo, farvepalette, typografi, tone-of-voice. Det er løbende — første version skal være funktionel nok til App Store og marketing-materiale, men behøver ikke være endelig ved launch. Anbefaling: book én designer til en 2-ugers sprint der leverer logo + palette + to typografier + et enkelt brand-guidelines-dokument. Alt andet kan iterere.

## Forretningsmodel-skelet 🔒

Vi har fire kandidater:

1. **Engangskøb per tour** (fx 49 kr). Fair, forudsigelig, simpel refusions-logik.
2. **Abonnement** (fx 39 kr/måned, alle ture). Kræver nok ture til at føles værdifuldt — ikke realistisk ved launch.
3. **Freemium** (første stop gratis, rest låses op). Introducerer demo-problem: hvad hvis første stop ikke sælger?
4. **Bundle** (flere ture samlet).

**Anbefaling: engangskøb per tour.** Det matcher bogens mentale model (du betaler for et værk, det er dit). Det gør refusions-politikken simpel. Det undgår det dobbelte arbejde med abonnement-infrastruktur. Når vi har 3–4 ture, kan vi tilføje et bundle uden at rive MVP-modellen op.

## Advarsler & gotchas

- **Apple Developer** kan afvise enrollment hvis DUNS-nummeret ikke matcher nøjagtigt CVR-registreringen. Dobbelttjek stave-måde.
- **Varemærke** skal tjekkes *før* vi bruger penge på logo. Et varemærke-afslag midt i design-forløbet koster både penge og tid.
- **Engangskøb** kræver at vi afstår fra "recurring revenue" — men det matcher produktet og vores energi bedre end abonnement.
- **Personlig vs virksomhed**-apps kan overføres mellem Apple-konti, men det er en manuel proces med papirarbejde. Undgå hvis muligt.
