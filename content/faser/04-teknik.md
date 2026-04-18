---
title: Fase 4 — Teknik
---

# Fase 4 — Teknik

Den tekniske fase. Her oversætter vi produktdefinitionen til konkrete iOS-arkitekturvalg. Vi holder stakken lille og native — SwiftUI, CoreLocation, AVFoundation, StoreKit 2 — og undgår at bygge backend før vi faktisk har brug for det.

## Geofencing-strategi 🔒

To modeller for hvordan vi udløser lyd-cues ved stop:

- **`CLCircularRegion`** (region monitoring): batteri-venligt, system-håndteret, max 20 regioner samtidig per app. Perfekt til 6 stop per tour.
- **`CLLocationManager` continuous updates**: mere præcis, men drænende, kræver at app'en er aktiv.

**Anbefaling: hybrid.** Region monitoring som primær udløser, suppleret med korte kontinuerlige opdateringer (10–20 sek) ved ankomst til et stop for præcis fine-tuning af "hvornår lyden starter". Det sparer batteri men giver præcision i det afgørende øjeblik.

Radius per geofence: 30–50 m. For stort → lyden starter for tidligt. For lille → brugeren risikerer at missche triggeren.

## Indholdslevering 🔒

Hvordan kommer lydfilerne i hænderne på brugeren?

- **Bundlet i app**: enkelt, men ethvert tour-update kræver ny app-version. Ved 6 ture á 150 MB = 900 MB app. Absurdt.
- **On-demand download efter køb**: lille app, brugeren henter kun det de har købt. Kræver at vi hoster lydfilerne (CDN).

**Anbefaling: on-demand download via CDN.** Cloudflare R2 er billigst (gratis egress). Bunny.net har god performance i Europa. Filerne er statiske — ingen backend nødvendig ud over CDN.

Download-flow: efter køb, app viser "Henter tur (75 MB)" med progress-bar. Lokalt cache i app's Documents-mappe. Retry-logik ved afbrudt download.

## Lydmotor 🔒

**`AVAudioEngine`** eller **`AVAudioPlayer`**?

- **AVAudioPlayer**: simpel, kan afspille én fil ad gangen. Fint hvis vi lægger hver stop-lyd som én fil.
- **AVAudioEngine**: mixer-arkitektur, kan lagre voice + ambient + musik adskilt og krydsfade. Mere kompleks.

**Anbefaling: AVAudioPlayer for MVP.** Lyddesigneren bager alle lagene ind i én fil per stop. Vi mister dynamisk lyd-kontrol, men tjener i enkelhed. Hvis vi senere vil have fx dynamisk ambient baseret på brugerens tempo, opgrader vi.

Husk `.playback` audio-session category, så lyden fortsætter når skærmen slukker eller brugeren er i Apple Maps.

## Analytics 🔒

Vi har brug for at vide: hvor mange starter turen, hvor mange når stop 1, 2, 3…, hvor mange færdiggør, hvor lang tid tager det, hvor falder de fra?

- **TelemetryDeck**: Swift-native, GDPR-compliant by default (anonym), billigt. Anbefaling.
- **Firebase Analytics**: gratis, men GDPR-kompliceret og tracking-panelt fra Apple giver det dårligere rating i App Store privacy labels.
- **PostHog / Mixpanel**: kraftige, men overkill for vores skala.

**Anbefaling: TelemetryDeck.** Simpel integration, privat, og den koster $12/måned når vi passerer gratis-tier.

## Backend-behov 🔒

Minimalt. Hvad har vi brug for?

- **Ingen user-accounts** (Apple ID håndterer køb, vi har ikke egne konti)
- **Ingen server-side logik** ved launch
- **CDN** til lydfiler (se ovenfor)
- **Analytics** via tredjepart (TelemetryDeck)
- **Receipt-validation** kan ske lokalt med StoreKit 2 (ingen server-validering ved launch, kan tilføjes senere ved svindel-problemer)

Ved v1.1 (gruppelytning) får vi brug for en synk-backend — det er på det tidspunkt vi overvejer Supabase (passende, vi bruger den allerede i denne hub) eller en simpel WebSocket-løsning.

## StoreKit 2 🔒

Moderne StoreKit 2 API'et er markant bedre end den gamle:
- **Type-safe** Swift API
- **`Transaction.currentEntitlements`** til at tjekke ejerskab
- **JWS-signerede receipts** der kan valideres uden Apple-server-kald
- **Udtrækbart auto-renewal-state** (relevant hvis vi senere overvejer abonnement)

Vi bruger **non-consumable in-app purchases** (en turpakke ejes for altid efter køb). Restore-purchases skal implementeres (Apple kræver det).

## Battery optimization 🔄

Løbende disciplin. Tommelfingerregler:

- **Brug region monitoring frem for continuous updates** (dækket ovenfor)
- **`kCLLocationAccuracyHundredMeters`** er nok uden for stop-zoner
- **Stop audio-session når tur er done** — ellers fortsætter `.playback`-mode at holde iPhone vågen
- **Sluk screen-wake-lock** når lyd spiller men skærm ikke bruges

Mål med Instruments → Energy log. Mål før og efter hver major release.

## Edge cases 🔄

Løbende liste:

- Hvad sker der hvis iPhone dør midt i tour? Genoptagelse fra seneste stop.
- Hvad hvis brugeren får et opkald midt i en scene? Pause + resume via AVAudioSession interruption notifications.
- Hvad med Bluetooth-hovedtelefoner der kobler ud? Standard-adfærd: pause.
- Flight mode? Vi er offline, det er OK.
- Screen rotation? Låser portrait kun.
- Accessibility: VoiceOver må ikke overlappe lyden. Test med VoiceOver til.
- Skærm-off: lyden skal fortsætte. Lock-screen kontroller (MPRemoteCommandCenter) skal være konfigurerede.

## Advarsler & gotchas

- **Geofencing kræver "Always" location permission** hvis den skal virke med app i baggrunden. Det er et kontroversielt permission request — Apple vil spørge om hvorfor. Skriv præcise permission strings.
- **AVAudioPlayer og baggrundsafspilning**: glem ikke at aktivere `.playback` session category, ellers stopper lyden når skærmen låser.
- **StoreKit 2 kræver iOS 15+**. Hvis vi vil understøtte ældre, skal vi bruge den gamle StoreKit. iOS 15+ er OK for vores målgruppe.
- **CDN cache-invalidation**: hvis vi opdaterer en lydfil, skal brugerens lokale cache også opdateres. Brug versionerede filnavne (`stop-1-v2.m4a`).
- **TelemetryDeck kan ikke spore individuelle brugere** — det er et feature, ikke en bug. Byg analytics-spørgsmål ud fra aggregater.
