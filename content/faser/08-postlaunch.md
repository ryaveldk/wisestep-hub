---
title: Fase 8 — Post-launch
---

# Fase 8 — Post-launch

Lanceringen er ikke målstregen — det er starten. De første seks uger post-launch er mere lærerige end alle de foregående faser tilsammen, fordi det er første gang vi ser rigtige brugere med rigtige penge og rigtige forventninger møde produktet. Planen her er at bevare nok energi til faktisk at reagere på det vi ser.

## Analytics review 🔄

**Ugentlig rytme første 4 uger, derefter månedlig.**

Spørgsmål hver uge:
- Hvor mange downloads?
- Hvor mange konverterer fra download til køb?
- Hvor mange når stop 1? stop 6? afslutter?
- Hvad er gennemsnits-tid per stop?
- Hvor mange starter turen en anden gang?
- Hvor mange refunderer (gennem Apple)?

Mål ikke kun tal, men **forhold**. En download-til-køb-rate på 15% er fremragende, 5% er okay, under 2% er alarmerende.

Benyt TelemetryDeck's dashboards eller byg et simpelt Notion-view der opsummerer ugentligt.

## Anmeldelser 🔄

Svar på **alle** App Store-anmeldelser inden for 48 timer i første måned. Senere: ugentligt.

- **5-stjernede**: kort tak, nævn evt. ny tour under udvikling.
- **3-4 stjernede**: spørg hvad der manglede. Vis at vi lytter.
- **1-2 stjernede**: tag bugs seriøst. Hvis klagen handler om et stop der ikke udløste, undersøg i analytics og følg op.

Anmeldelser i app-butikken er den eneste offentlige kanal hvor vi kan demonstrere lydhørhed over for nye potentielle købere.

## Tour #2 🔄

Planlægning skal begynde i uge 2 post-launch, ikke uge 8. Beslutninger:

- **Hvem?** H.C. Andersen, Karen Blixen, Thorvaldsen, eller en helt anden vinkel (ikke forfatter — fx *Københavns arkitektur*, *Kvindekampen gennem København*)?
- **Samme by?** Ja — det giver samme geografiske målgruppe. Variation kan komme senere.
- **Samme varighed og prismodel?** Ja — konsistens hjælper brugerne forstå hvad de køber.
- **Produktions-tid?** Baseret på hvad vi lærte fra tour #1, skal tour #2 være 2–3× hurtigere.

## Pipeline-automatisering 🔄

Baseret på erfaringer fra tour #1: hvad kan automatiseres?

- **Manuskript → AI-syntese** kan scriptes hvis vi standardiserer formatet (sektioner pr stop, stemme-tags)
- **Master-processing** (loudness, EQ) kan laves i FabFilter-presets eller Reaper-scripts
- **Metadata-generering** (chapter markers, geofence-coords) kan læses fra én kilde-fil
- **Upload til CDN** kan scriptes

Mål: fra ~4 uger per tour i tour #1 til ~2 uger i tour #3.

## Gruppelytning (v1.1) 🔄

Hvis gruppelytning er skubbet til v1.1 (se Fase 1), så er post-launch det tidspunkt hvor vi beslutter om det stadig giver mening baseret på data:

- Hvor mange har spurgt efter det i support?
- Hvor mange reviews nævner "ville gerne gå det med min partner"?
- Er downloads konsistent høje nok til at investeringen er værd?

Hvis ja: v1.1 bygges, release 3–4 måneder efter launch.

## Kontinuerligt arbejde

Ting der kører i baggrunden hele tiden:

- **Crash-rapportering** via Xcode Organizer, fix højest-prioritetede først
- **iOS-opdateringer**: ny iOS betyder ny test-runde, især for location og StoreKit
- **Support-indbakke** (et delt e-mail-alias — support@wisestep.dk eller lignende) — svar inden for 24 timer
- **SEO/ASO**: iterer på keywords baseret på hvad der driver trafik

## Advarsler & gotchas

- **Burnout-risiko**: lanceringen er adrenalinfueled, men uge 4–8 er hvor folk taber pusten. Byg realistisk tempo.
- **Refund-rate over 5%** er et advarselstegn om at enten marketing-løfter ikke matcher produktet, eller at der er en tekniske fejl brugerne ikke kan beskrive.
- **App Store-rating under 4.0** er svær at komme tilbage fra. Respondér aktivt på tidlige negative reviews.
- **Feature-ønsker** fra bruger-reviews er værdifulde, men pas på at hver ny "feature" gør app'en større uden bedre. Sig nej mere end ja.
- **Tour #2-lancering** skal ikke skygge for tour #1. Timing: lad tour #1 få 8–12 uger alene med presse-dækningen.
