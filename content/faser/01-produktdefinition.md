---
title: Fase 1 — Produktdefinition
---

# Fase 1 — Produktdefinition

Her definerer vi præcis hvad MVP'en ér — og lige så vigtigt, hvad den *ikke* er. Produktdefinitionen er en øvelse i disciplin: jo mindre vi forpligter os til ved launch, jo hurtigere kommer vi ud, og jo hurtigere lærer vi om det vi faktisk har bygget virker.

## MVP-omfang 🔒

**Beslutning: én tour ved launch.** *Kierkegaards København*, 45 minutter, 6 stop, startende ved Nytorv, sluttende ved Assistens Kirkegård.

Begrundelse: én tour tvinger os til at få dramaturgien, lydproduktionen og den tekniske pipeline rigtig i lille skala. Anden tour bliver 3× hurtigere fordi vi har pipeline på plads. Ved launch af fx fem ture samtidig risikerer vi at komme ud med en halvsløj første tur som skygger for de bedre.

## Sprog ved launch 🔒

Dansk eller engelsk først? Tre argumenter for dansk:

1. Kierkegaard læses på dansk af danske brugere. Stemmen og kulturen hænger sammen.
2. Dansk målgruppe i København er let at nå — lokale medier, byvandringer, biblioteker.
3. Produktionen er enklere med ét sprog.

Tre argumenter for engelsk:

1. Turister er den primære målgruppe for city walks, og de fleste læser engelsk.
2. Verdensmarked potentialet er større.
3. Kierkegaards internationale renommé.

Anbefaling: **dansk ved launch, engelsk version klar inden for 8 uger efter.** Det giver os en reel MVP-læring først, og så bygger vi engelsk oven på det der virker.

## Gruppelytning: MVP eller v1.1 🔒

Skal flere brugere kunne gå turen samtidig og høre lyden synkront? Det er en killer-feature for par, venner og skoleklasser. Men det kræver en del teknisk infrastruktur: enten via peer-to-peer (Multipeer Connectivity) eller via en backend der synkroniserer playback-state.

**Anbefaling: v1.1, ikke MVP.** Det reducerer MVP-kompleksiteten markant. Gruppelytning er noget vi kan sælge som "kommer snart" og teste efterspørgsel på inden vi bygger. Mest sandsynligt er det en niche-feature der ikke skaber så meget konvertering som vi tror.

## Offline vs streaming 🔒

Lyden er stor — 45 min + fallback-states = 80–150 MB per tour, højere ved høj kvalitet. To modeller:

- **Streaming**: mindre app-download, afhængig af 4G/5G. Risiko: dårlig dækning i kældergange, broer, midt i byparken.
- **Offline (download på forhånd)**: større initial download, ingen netværks-afhængighed undervejs. Bedre brugeroplevelse, men kræver tydelig onboarding om "download først".

**Anbefaling: offline-first, med download-flow som første step efter køb.** Ingen bruger skal opdage midt i en tour at forbindelsen dropper på Nørrebrogade. Download kan ske over Wi-Fi før man går ud.

## Sekundære features 🔄

Løbende overvejelser som ikke behøver låses i fase 1:

- **Bogmærker** / gemme favorit-stop til senere
- **Transcription-view** (læs lyden hvis du ikke kan høre)
- **Apple Watch-companion** (næste stop på uret)
- **CarPlay / AirPods spatial audio**
- **Social deling** (Instagram-kort fra turen)

Diskussionen er hvad der tilføjer mest til oplevelsen uden at sprede os. Transcription har tilgængeligheds-gevinst. Bogmærker er billigt. Watch og CarPlay er aspirations.

## Advarsler & gotchas

- **Multipeer Connectivity** er kompleks. Hver gang jeg har set apps bruge det til synkront playback, har der været edge cases omkring midlertidig disconnect, auto-reconnect og "hvem er hostnen". Undervurder det ikke — det er derfor det er skubbet til v1.1.
- **Offline download** kræver plads. Sørg for at onboardingen fortæller brugeren om størrelsen *før* de betaler, ikke efter. App Review har slået ned på lignende apps for ikke at være tydelige nok.
- **Dansk-først** betyder at vores første App Store-kategori-performance bliver smal. Lav planen for engelsk-lancering allerede i fase 1, så vi ikke bruger 6 måneder på at "overveje" det.
