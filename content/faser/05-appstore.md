---
title: Fase 5 — App Store
---

# Fase 5 — App Store

App Store er ikke bare en distributionskanal — det er et discovery-system, et review-filter og en marketing-overflade alt i ét. Hver beslutning her påvirker enten hvor vi rangerer i søgning, om vi bliver godkendt, eller hvor mange der konverterer fra listing til køb.

## Kategori 🔒

Valget af primær kategori påvirker rangering, anbefalings-algoritmer og hvilke "charts" vi kan lande på.

Kandidater:
- **Travel** (by-turisme, guidebog-association) — stærk trafik, men stor konkurrence med Google Maps, Tripadvisor
- **Education** — passer til intellektuelt indhold, mindre konkurrence
- **Entertainment** — passer til drama/lyd-fortælling
- **Reference** (bøger, opslag) — svag trafik

**Anbefaling: Travel som primær, Education som sekundær.** Travel giver trafik, Education giver os mulighed for at ranke i uddannelses-søgninger hvor vi konkurrerer mod færre apps.

## Navn + undertitel 🔒

App-navn: max 30 tegn. Undertitel: max 30 tegn. Begge er søgbare.

**Paraply-navn-anbefaling**: app'en hedder *Wisestep* (eller det valgte brand), undertitel *"Kierkegaards København"*. Ved tour #2 ændrer vi undertitlen men beholder app-navnet.

Det betyder at folk der søger "Kierkegaard" og "København" finder os via undertitlen, mens vi ikke låser os til én tur i navnet.

Alternativ: *"Wisestep: Kierkegaards København"* som fuldt navn, *"AI-drevne byvandringer"* som undertitel. Mere markedsføring af konceptet, mindre specifik SEO.

## Keywords 🔒

100 tegn, komma-separeret (ikke mellemrum — komma stjæler tegn). Kandidater:

`kierkegaard,københavn,byvandring,audio,guide,filosofi,historie,rejse,tour,nørrebro,assistens,vandretur`

Undgå keywords der gentages i navn/undertitel — Apple indekserer dem alligevel. Test iterativt med App Store Connect's built-in search suggestions.

## Aldersgrænse 🔒

Ingen eksplicit vold, sex eller alkoholreferencer i Kierkegaards materiale — måske en 9+ eller 12+ rating. Tages via Apple's self-report questionnaire ved submission.

## Screenshots og preview video 🔒

Krav:
- **Screenshots**: 6.7" (iPhone 15 Pro Max), mandatory. Anbefaling: 3–5 screenshots, første er den vigtigste.
- **Preview video**: 15–30 sek, valgfrit men stærkt anbefalet. Øger konvertering 20–30% i vores kategori.

Screenshot-ideer:
1. Hero: "En 45 min guidet audio-tour gennem Kierkegaards København"
2. Map-visning med rute og stop
3. Stop-detalje med play-kontrol
4. AI-stemme-disclosure + privacy-vægt
5. Review/testimonial hvis vi har én

Preview video: kort montage — by-billeder, app-shots, stemme-teaser. 25 sek.

## Beskrivelse 🔒

Max 4000 tegn, men kun de første ~170 vises før "more"-link. De første 170 tegn er **kritiske** — de skal sælge før klik.

Udkast:
> Gå ind i Søren Kierkegaards København. En 45 minutters dramatiseret audio-tour gennem Indre By og Nørrebro — 6 stop, AI-stemmer, ægte filosofi. Vandr alene, lyt som var du der.

Resten af beskrivelsen: 3–4 afsnit om oplevelsen, teknisk (offline, geofencing), credits, privacy/AI-disclosure.

## Review notes til Apple 🔒

**Vigtigt.** Apple review kan være drilsk med apps der bruger always-location + in-app purchases. Skriv review notes der:

- Forklarer geofencing-brugen i lægmands-sprog ("app'en låser en lyd op når brugeren nærmer sig et bestemt sted")
- Angiver test-credentials (hvis vi har en unlock-mekanisme for review-teamet — anbefales)
- Henviser til det eksakte sted reviewer skal teste (koordinater eller landmark)
- **Forklarer AI-stemme-disclosure** eksplicit og linker til privatlivspolitik

Gode review notes er forskellen på 24-timers-godkendelse og 2-ugers-rejection-tur.

## Permission strings 🔒

Hver permission kræver en `NSXxxUsageDescription` i `Info.plist`. Disse tekster vises til brugeren og er ofte det punkt Apple bider sig fast i.

- **`NSLocationWhenInUseUsageDescription`**: "Wisestep bruger din lokation til at afspille de rigtige fortællinger når du nærmer dig hvert stop på ruten."
- **`NSLocationAlwaysAndWhenInUseUsageDescription`**: "For at kunne afspille den rigtige fortælling når din telefon er i lommen eller i pause, har Wisestep brug for altid-lokation. Dine lokations-data forlader aldrig din telefon."

**Aldrig: "Vi har brug for lokation."** Altid: "Vi bruger lokation til X specifikt."

## Privacy manifest 🔒

Fra iOS 17 kræver Apple **privacy manifest** (`PrivacyInfo.xcprivacy`) der deklarerer al data-indsamling, tredjeparts-SDKs og reasons for required reason APIs. Uden manifestet bliver app'en ikke godkendt i 2026.

Vores manifest-indgange:
- Location (coarse + fine, linked to app functionality, not linked to user)
- Purchase history (via StoreKit)
- Analytics (via TelemetryDeck — anonym)

## Lokalisering 🔄

Ved dansk-launch skal App Store-listing også være på dansk (primær) og engelsk (sekundær, for turister der har dansk App Store region). Ved engelsk-launch tilføjer vi fransk, tysk, spansk som sekundære.

## Advarsler & gotchas

- **Apple afviser apps** der beder om "Always" location uden tydelig forklaring i runtime-prompt. Brug en **pre-permission screen** der forklarer hvorfor, før du trigger dialog.
- **In-app purchases skal være "testable"** af Apple review. Hvis de ikke kan komme gennem checkout gratis, kontakter de dig — og det forsinker review i 1–2 uger.
- **AI-apps** er et særligt hed område for Apple i 2025–2026. De er begyndt at bede om detaljeret info om AI-brugen. Vær klar med dokumentation.
- **App-navnet** kan ikke indeholde trademark-termer. "Kierkegaard" er personnavn → check om der er varemærkebeskyttelse (der er sandsynligvis ikke for en afdød filosof, men check alligevel).
- **Første 170 tegn af beskrivelsen**: A/B test disse, de driver konvertering mere end screenshots for nye apps.
