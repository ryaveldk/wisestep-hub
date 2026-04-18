---
title: Fase 2 — Jura
---

# Fase 2 — Jura

Denne fase er der hvor vi er mest eksponerede — AI-genererede stemmer af historiske personer, ASR-pipeline i cloud, forbrugerkøb, EU AI Act, GDPR. Hver beslutning her er blokerende fordi en fejltagelse kan betyde fjernelse fra App Store eller en erstatningssag. Det er ikke den fase man skimmer.

## AI-stemmerettigheder 🔒

Vi skal vælge en AI-stemmeleverandør (ElevenLabs, Play.ht, Resemble, Microsoft custom voice, Azure TTS, etc.) hvor kommerciel licens *eksplicit* tillader:

1. **Salg af det genererede lyd-output** (ikke kun intern brug)
2. **Dramatisering af historiske, offentligt kendte personer** (mange leverandører forbyder at "efterligne navngivne personer" uanset om de er nulevende eller afdøde)
3. **Embedded audio i app-distribution** (ingen streaming-begrænsning)

Leverandør-valg påvirker også stemme-kvalitet, prosodi og hvor meget dansk de håndterer godt. Mange AI-stemmer er trænet primært på engelsk — dansk risikerer at lyde mekanisk, og de trykker trykket forkert i ord som "Kierkegaard" eller "Assistens".

## Kierkegaards stemme og eftermæle 🔒

Kierkegaard døde 1855, så ophavsretten til hans *værker* er udløbet. Men eftermæle-retten er anderledes:

- **Rigsbiblioteket / Søren Kierkegaard Forskningscentret** har udgivet den store tekstkritiske udgave *Søren Kierkegaards Skrifter* (SKS), og den udgave har sin egen redaktionelle ophavsret. Vi bør citere fra originalværkerne, ikke fra SKS, for at undgå det.
- **Biografisk materiale** (breve, dagbøger) i offentlige arkiver er typisk frit tilgængeligt, men reproduktions-ret kan være begrænset af arkivet.
- **Stemmeefterligning af en historisk person** er juridisk uafklaret i EU. Retspraksis findes ikke endnu. Defensivt: tydelig disclaimer "AI-dramatisering, ikke autentisk optagelse", både i app og i App Store-beskrivelse.

Anbefaling: tal med en IP-advokat. Én konsultation (2.000–4.000 kr) kan afklare de fleste spørgsmål.

## GDPR og persondata 🔒

Hvilke persondata samler vi?

- **Anonymt analytics** (TelemetryDeck har ingen GDPR-implikation, Firebase har)
- **Lokation under tour** (geofencing kræver tilladelse, men vi gemmer ikke rutedata)
- **Køb/receipts** (Apple håndterer, vi ser kun receipt-ID)
- **Crash-logs** (Apple-native er anonyme, tredjeparts kan være ikke-anonyme)
- **E-mail ved support-kontakt** (behandles som enhver anden kundedata)

Vi skal skrive en **privatlivspolitik** der er forståelig, ikke kun juridisk korrekt. Apple kræver link i App Store-metadata.

## Forbrugerret og fortrydelsesret 🔒

EU's forbrugerrettighedsdirektiv: digitale køb har **14 dages fortrydelsesret**, *medmindre* brugeren eksplicit accepterer at frafalde retten ved øjeblikkelig levering. Apple's StoreKit håndterer dette, men vi skal beslutte:

- **Fortrydelsesret frafaldet**: brugeren får øjeblikkelig adgang mod accept. Mere aggressiv, mere intuitiv.
- **Fortrydelsesret bevaret**: brugeren har 14 dage, men så kan de få refusion selv efter at have gået hele turen.

Anbefaling: frafaldt fortrydelsesret ved køb, med tydelig accept-checkbox. Kombiner med vores egen refusions-politik (se nedenfor).

## AI-indholdsdeklaration (EU AI Act) 🔒

**EU AI Act** (i kraft fra 2024, med gradvis indfasning til 2026) kræver at AI-genereret indhold er tydeligt markeret som sådan. For vores app betyder det:

- **App Store beskrivelse**: "Alle stemmer er AI-syntetiserede"
- **Onboarding**: tydelig skærm der forklarer at det ikke er autentiske optagelser
- **In-app**: lille "AI"-badge eller tilsvarende persistent indikator

Manglende compliance kan give bøde på op til 3% af global omsætning. For os som mikrovirksomhed: ikke en reel trussel endnu, men Apple vil sandsynligvis kræve det i review-processen længe før EU håndhæver mod os direkte.

## Refusionspolitik 🔄

Apple håndterer refusioner via deres egen proces, men vi bør have en klar holdning:

- **Teknisk fejl** (app crasher, lyd afspiller ikke, geofence fejler): refusion altid, også efter 14 dage.
- **Indholds-utilfredshed** (brugeren synes ikke den var god nok): ingen standard-refusion, men håndter case-by-case.
- **Geografisk umulighed** (brugeren opdager at de ikke kan komme til København): refusion inden for 14 dage.

Skriv det i FAQ-en så det er tydeligt før købet.

## Terms of Service 🔄

Standard-ToS der dækker brug, ansvar, gyldighed, lovvalg (dansk ret, København som værneting). Kan laves med Termly eller Iubenda i første omgang, overvej advokat-gennemgang før launch.

## Advarsler & gotchas

- **AI-stemmerettigheder** er det punkt der mest sandsynligt bider os hvis det går galt. Gem kopi af licens-tekst fra den dag vi køber. Hvis leverandøren ændrer vilkår senere, er det vores gamle licens der gælder.
- **Kierkegaard-efterligning**: hvis nogen klager, er det vores formulering af disclaimeren der bliver afgørende. Lad en jurist godkende præcise formuleringer.
- **EU AI Act-compliance**: Apple vil formentlig indføre automatiserede tjek. Hvis vi ikke er synligt AI-markeret, risikerer vi afvisning i review.
- **GDPR**: hvis vi bruger Firebase Analytics uden eksplicit samtykke, er vi i overtrædelse. Brug TelemetryDeck eller PostHog med opt-out som default.
