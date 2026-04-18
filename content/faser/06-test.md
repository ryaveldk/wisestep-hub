---
title: Fase 6 — Test
---

# Fase 6 — Test

Test-fasen handler mindre om "finder vi bugs?" og mere om "virker oplevelsen når ingen af os er i rummet?". Det er nemt at teste i simulator. Det er hårdt at simulere en bruger der går Nørrebrogade i regn med AirPods og dårligt signal. Test skal ske i virkeligheden.

## Internal alpha 🔒

Før vi involverer eksterne testere:

- **Ryan går turen fuldt** — flere gange, forskellige dage, forskelligt vejr
- **Partner går turen fuldt** — med frisk perspektiv, uden intern viden om koden
- **Test-matrix** per stop: geofence udløser? Lyd starter korrekt? Fallback hvis man går uden for zonen? Genoptagelse efter opkald?
- **Energi-test** med Instruments: hvor mange % batteri bruger 45 min tour? Mål: under 15%.

Dokumenter hver bug i en delt liste (kan være en Notion-side eller bare en markdown-fil her).

## TestFlight closed beta 🔒

Efter internal alpha:

- **10–15 testere**, udvalgt fra venner/familie/netværk
- **Blandet profil**: iPhone-modeller (gamle 11, nye 15 Pro), iOS-versioner, aldersgrupper
- **Briefing**: kort brief om at det er beta, link til feedback-form (Google Forms eller Tally), åben for spørgsmål
- **2 ugers varighed**
- **Check-in**: dag 3 og dag 10

Spørgsmål til testerne:
1. Blev der nogensinde stilhed der føltes som en fejl?
2. Udløste lyden på det rigtige sted hver gang?
3. Gik du hele turen? Hvor stoppede du?
4. Batteri ved endt tour?
5. Ville du anbefale den til en ven?

## TestFlight public beta 🔒

Efter closed beta:

- **Public link** delt via Reddit (r/copenhagen, r/philosophy), Facebook-grupper, twitter
- **50–200 testere**
- **4 ugers varighed**
- **Lette feedback-kanaler** (emoji-rating + free-text)
- **Overvåg crash-logs** via Xcode Organizer

Dette er også vores første reelle user-research. Noter hvad folk skriver i reviews (selvom TestFlight-reviews ikke er offentlige).

## Battery impact 🔒

Mål og sæt en målrettet grænse:

- **< 15% batteri-forbrug** for komplet 45 min tour på iPhone 12+
- **< 20%** på iPhone 11 / SE 2020

Ovenover det er vi i problemer. Folk kan ikke lide at deres telefon er næsten død efter en tur. Måles med Xcode Energy Log + Instruments.

Hvis vi ligger for højt: reducer kontinuerlige location-opdateringer, sænk lyd-buffer-størrelse, overvej audio-codec der kræver mindre CPU (Opus vs AAC trade-off).

## Edge cases 🔒

Check-list der skal være OK før launch:

- [ ] Flight mode midt i tour — lyd fortsætter, ingen crash
- [ ] Opkald under tour — pause + resume automatisk
- [ ] Bluetooth-disconnect — pause
- [ ] Skifte fra AirPods til iPhone-højtaler — fortsætter
- [ ] Låse skærm midt i stop — lyden fortsætter
- [ ] Tilbage fra baggrund efter 2 timer — genoptag eller reset?
- [ ] Tur gennemført — hvad sker der i UI? Tak-skærm? Review-prompt (smartly timed)?
- [ ] Køb, afbrudt download, åben app igen — resume download
- [ ] Forskellige iOS-sprog (engelsk system, dansk app)
- [ ] VoiceOver — navigation er mulig
- [ ] Dynamic Type (stor tekst) — UI bryder ikke
- [ ] Dark mode — alle skærme har korrekte farver

## Advarsler & gotchas

- **Simulator tester ikke geofencing** realistisk. Man kan fake location, men CLCircularRegion-adfærden er anderledes på device.
- **TestFlight-testere aktiverer sjældent "Always" location**. Før dialog, vis en pre-permission screen der forklarer hvorfor. Ellers får du "virker ikke"-feedback der bare er permission-problemer.
- **iOS "Always" giver først reel always efter** en række "WhileUsing"-brug. Apple normaliserer det over tid. Verificér adfærd med `CLLocationManager.authorizationStatus`.
- **Battery-measuring**: gør det på en opladet, ikke-plugged-in iPhone, helst udenfor (ingen Wi-Fi, reell 4G). Simulator og plugged-in device giver falske tal.
- **TestFlight builds udløber efter 90 dage**. Husk at uploade ny build jævnligt i lange beta-forløb.
