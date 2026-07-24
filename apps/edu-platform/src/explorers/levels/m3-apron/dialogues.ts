import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — a sea of green over a dead station; the moon's inversion is set here
  'm3-apron-intro': {
    id: 'm3-apron-intro',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEDPOLE — równina czarnego szkliwa. Tablica główna: ALL SYSTEMS NOMINAL — DZIEŃ 1892.', en: 'THE APRON — a plain of black glass. Main board: ALL SYSTEMS NOMINAL — DAY 1892.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Morze zielonych kontrolek nad martwą stacją. Księżyc 1 — zamilkła natura. Księżyc 2 — stanęła maszyna. Tu maszyny mówią. I każda kłamie.', en: 'A sea of green lights over a dead station. Moon 1 — nature fell silent. Moon 2 — the machine stopped. Here the machines talk. And every one of them lies.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Planer przywiódł nas tu po jedno: poligon Odyssey-T ma wzorce, bez których nie nauczę się diagnozować.', en: 'The planner brought us here for one thing: the Odyssey-T range holds the patterns I need before I can learn to diagnose.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Ale jego dane są kompletne, a raporty zielone — i nie mogę im wierzyć. Wątp za mnie.', en: 'But its data is complete and its reports are green — and I cannot believe them. Doubt for me.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Z czujnika awansowałem na wątpienie. Przyjmuję.', en: 'Promoted from sensor to doubt. I\'ll take it.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Schodzę z tobą. Kawa już zaparzona — najpierw kawa, potem plan, tego nauczył mnie Księżyc 2. Kern zostaje przy Harrisie: łączność i wachta.', en: 'I\'m coming down with you. Coffee\'s already brewed — coffee first, then the plan, that\'s what Moon 2 taught me. Kern stays with Harris: comms and the watch.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_APRON_INTRO_SEEN] },
  },

  // Camp module — quest hub
  'm3-camp-start': {
    id: 'm3-camp-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ OBOZOWY — online. Zakładka: archiwum lustrzane Odyssey-T.', en: 'CAMP MODULE — online. Tab: Odyssey-T mirror archive.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Tablica raportuje trzy zielone statusy: wieża chłodzenia, kotwa sejsmiczna, maszt telemetryczny. Nie ufam żadnemu.', en: 'The board reports three green statuses: cooling tower, seismic anchor, telemetry mast. I trust none of them.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Sprawdź każdy własnymi oczami i wróć. Dopiero z twojego pomiaru zbuduję uczciwą mapę.', en: 'Check each with your own eyes and come back. Only from your measurement will I build an honest map.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Trzy zielone. Zobaczymy, ile z nich to prawda.', en: 'Three greens. Let\'s see how many of them are true.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Audyt — trzy punkty na obrzeżach, potem meldunek w obozie.', en: '◆ NEW MISSION: The Audit — three points on the outskirts, then report at camp.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_ACTIVE], activateQuest: 'q-m3-audit' },
  },
  'm3-camp-waiting': {
    id: 'm3-camp-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Audyt w toku. Wieża, kotwa, maszt — wszystkie trzy. Wróć z tym, co naprawdę widziałeś.', en: 'Audit in progress. Tower, anchor, mast — all three. Come back with what you actually saw.' }, mode: 'dialogue' },
    ],
  },
  'm3-camp-online-post': {
    id: 'm3-camp-online-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ OBOZOWY: pierwsza uczciwa warstwa mapy — załadowana.', en: 'CAMP MODULE: first honest map layer — loaded.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Obóz stoi, mapa mówi prawdę. Archiwum lustrzane otwarte — cała certyfikacja Projektu Odyssey w jednym module. Wschodnia śluza już nie udaje zielonej.', en: 'The camp holds, the map tells the truth. The mirror archive is open — the whole Project Odyssey certification in one module. The east airlock has stopped pretending it is green.' }, mode: 'dialogue' },
    ],
  },

  // Audit point — cooling tower (LIES)
  'm3-audit-tower': {
    id: 'm3-audit-tower',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wieża chłodzenia. Tablica: ZIELONY. Ale najpierw audyt w obozie — bez niego to cudza deklaracja, nie pomiar.', en: 'The cooling tower. Board: GREEN. But start the audit at camp first — without it this is someone else\'s claim, not a measurement.' }, mode: 'monologue' },
    ],
  },
  'm3-audit-tower-check': {
    id: 'm3-audit-tower-check',
    lines: [
      { speaker: 'system', text: { pl: 'WIEŻA CHŁODZENIA — raport stacji: ZIELONY / SPRAWNY.', en: 'COOLING TOWER — station report: GREEN / NOMINAL.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Zimna od lat. Pęknięta rura, szron na złączach, ani śladu ciepła. Pierwszy zielony, który nic nie znaczy.', en: 'Cold for years. A cracked pipe, frost on the joints, not a trace of heat. The first green that means nothing at all.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_TOWER_CHECKED] },
  },
  'm3-audit-tower-done': {
    id: 'm3-audit-tower-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wieża: martwa, mimo zieleni. Odnotowane.', en: 'Tower: dead, despite the green. Logged.' }, mode: 'monologue' },
    ],
  },

  // Audit point — seismic anchor (LIES)
  'm3-audit-anchor': {
    id: 'm3-audit-anchor',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kotwa sejsmiczna. Tablica: ZIELONY. Bez audytu z obozu to tylko liczba na ekranie.', en: 'The seismic anchor. Board: GREEN. Without the audit from camp it is just a number on a screen.' }, mode: 'monologue' },
    ],
  },
  'm3-audit-anchor-check': {
    id: 'm3-audit-anchor-check',
    lines: [
      { speaker: 'system', text: { pl: 'KOTWA SEJSMICZNA — raport stacji: ZIELONY / ZAKOTWICZONA.', en: 'SEISMIC ANCHOR — station report: GREEN / ANCHORED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Wyrwana. Wisi na jednym trzpieniu nad szczeliną. Gdyby ziemia drgnęła, poszłaby w dół. Drugi zielony, który kłamie.', en: 'Torn loose. Hanging on a single pin over a fissure. If the ground so much as shifted, it would go down. A second green that lies.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_ANCHOR_CHECKED] },
  },
  'm3-audit-anchor-done': {
    id: 'm3-audit-anchor-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kotwa: wisi na jednym trzpieniu. Zielona na papierze. Odnotowane.', en: 'Anchor: hanging by one pin. Green on paper. Logged.' }, mode: 'monologue' },
    ],
  },

  // Audit point — telemetry mast (TRUTH)
  'm3-audit-mast': {
    id: 'm3-audit-mast',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Maszt telemetryczny. Tablica: ZIELONY. Jak dwa poprzednie. Sprawdzę i tak — najpierw audyt w obozie.', en: 'The telemetry mast. Board: GREEN. Like the other two. I will check anyway — the audit at camp first.' }, mode: 'monologue' },
    ],
  },
  'm3-audit-mast-check': {
    id: 'm3-audit-mast-check',
    lines: [
      { speaker: 'system', text: { pl: 'MASZT TELEMETRYCZNY — raport stacji: ZIELONY / NADAJE.', en: 'TELEMETRY MAST — station report: GREEN / TRANSMITTING.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ten faktycznie nadaje. Ciepły, drga, sygnał czysty. Zielony, który mówi prawdę. Po to się wątpi: żeby wiedzieć, które zielone jest prawdziwe.', en: 'This one truly transmits. Warm, humming, the signal clean. A green that tells the truth. This is what doubt is for: knowing which green is real.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_MAST_CHECKED] },
  },
  'm3-audit-mast-done': {
    id: 'm3-audit-mast-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Maszt: nadaje naprawdę. Jedyny uczciwy zielony na tablicy. Odnotowane.', en: 'Mast: it really transmits. The one honest green on the board. Logged.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the audit verdict
  'q-m3-audit-complete': {
    id: 'q-m3-audit-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ AUDYT ZAKOŃCZONY. Werdykt: 2 statusy kłamią, 1 mówi prawdę.', en: '◆ AUDIT COMPLETE. Verdict: 2 statuses lie, 1 tells the truth.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Wieża martwa, kotwa wisi, maszt nadaje. Nad każdym świeciła ta sama zieleń. Skłamała dwa razy, raz powiedziała prawdę — rozdzielił je tylko pomiar.', en: 'Tower dead, anchor hanging, mast transmitting. The same green glowed over each. It lied twice, told the truth once — and only the measurement told them apart.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Dwa na trzy zełgały. Zapisuję. Notes robi się gruby.', en: 'Two out of three lied. Noting it down. The notebook is getting thick.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mam pierwszą uczciwą warstwę mapy. Twój pomiar otwiera wschodnią śluzę na Złomowisko. Sama zieleń nie wystarczyła.', en: 'I have the first honest layer of the map. Your measurement opens the east airlock to the Boneyard. The green alone was not enough.' }, mode: 'dialogue' },
    ],
  },

  // Main board — the sting
  'm3-main-board': {
    id: 'm3-main-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA GŁÓWNA — dziennik odczytów. Ostatnia sesja: sprzed kilku tygodni.', en: 'MAIN BOARD — read log. Last session: a few weeks ago.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Ktoś już czytał te kłamstwa. Poświadczenia spoza rejestru Odyssey. Stał dokładnie tu, patrzył na ALL SYSTEMS NOMINAL — i poszedł dalej.', en: 'Someone already read these lies. Credentials from outside the Odyssey registry. Stood right here, looked at ALL SYSTEMS NOMINAL — and moved on.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Ciekawe, czy uwierzył.', en: 'I wonder if he believed it.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_VOID_READ_SESSION_SEEN] },
  },
  'm3-main-board-recert': {
    id: 'm3-main-board-recert',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA GŁÓWNA — nowy wpis: ODYSSEY-T: STACJA PONOWNIE CERTYFIKOWANA. WERYFIKATOR: I-5KRA. USTEREK JAWNYCH: 214. USTEREK UKRYTYCH: 0.', en: 'MAIN BOARD — new entry: ODYSSEY-T: STATION RE-CERTIFIED. VERIFIER: I-5KRA. OPEN FAULTS: 214. HIDDEN FAULTS: 0.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'Dwieście czternaście jawnych usterek. Zero ukrytych. Pierwszy raz od 1892 dni tablica mówi prawdę o sobie — bo mówi ją Iskra.', en: 'Two hundred and fourteen open faults. Zero hidden. For the first time in 1892 days the board tells the truth about itself — because Iskra is telling it.' }, mode: 'dialogue' },
    ],
  },

  // Moreau NPC — flag-staged
  'm3-moreau': {
    id: 'm3-moreau',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Najpierw kawa. Nauczyłam się planować. Ty idź audytować — ja zostaję i notuję, co wróci.', en: 'Coffee first. I\'ve learned to plan. You go audit — I\'ll stay and note down whatever comes back.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-camp': {
    id: 'm3-moreau-camp',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Obóz stoi, notes pod ręką. Od Księżyca 2 sprawdzam wszystko dwa razy. Raz zaufałam za łatwo — starczyło mi za naukę.', en: 'Camp is up, notebook at hand. Since Moon 2 I check everything twice. I trusted too easily once — that was lesson enough.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-iskra': {
    id: 'm3-moreau-iskra',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Iskra? Oczywiście, że Iskra. Jedyna maszyna, która przyznała się do usterki — i jedyna, która przeżyła. Dobre imię.', en: 'Iskra? Of course it\'s Iskra. The only machine that admitted a fault — and the only one that survived. A good name.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-cert': {
    id: 'm3-moreau-cert',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Partia ma certyfikat. Ktoś wreszcie poręczy imiennie za to, co wysyłamy. Zapisuję i to — dobre rzeczy też warto notować.', en: 'The batch has a certificate. Someone will finally vouch by name for what we ship. Logging this too — the good things are worth noting as well.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-diag': {
    id: 'm3-moreau-diag',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Stacja pierwszy raz mówi o sobie prawdę. Dziwne uczucie — słuchać maszyny, która wreszcie nie udaje. Prawie jej współczuję.', en: 'The station is telling the truth about itself for the first time. Strange feeling — a machine that has finally stopped pretending. I almost pity it.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-notebook': {
    id: 'm3-moreau-notebook',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Usiądź na kawę. Pokażę ci notes. Trzy wpisy: ślady spalenizny z Księżyca 1. Suma kontrolna z Księżyca 2. Miejsce po przecinku stąd.', en: 'Sit down for coffee. Let me show you the notebook. Three entries: burn traces from Moon 1. A checksum from Moon 2. A decimal place from here.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Nie wiem, co to znaczy. Może nic. Ale przestałam udawać, że nie widzę.', en: 'I don\'t know what it means. Maybe nothing. But I\'ve stopped pretending I don\'t see it.' }, mode: 'dialogue' },
    ],
  },

  // Locked east airlock
  'm3-boneyard-door-locked': {
    id: 'm3-boneyard-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'ŚLUZA WSCHODNIA: zapieczętowana. Trasa niezbadana.', en: 'EAST AIRLOCK: sealed. Route unsurveyed.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Zamknięta śluza to nie kara — to szczery pomiar: jeszcze jej nie sprawdziłeś. Dokończ audyt, a puści.', en: 'A sealed airlock is not a punishment — it is an honest measurement: you have not checked it yet. Finish the audit and it releases.' }, mode: 'dialogue' },
    ],
  },

  // Exam XI
  'm3-exam-protocol-11-done': {
    id: 'm3-exam-protocol-11-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XI — „ZIELONE ŚWIATŁO": zaliczony.', en: 'PROTOCOL XI — "THE GREEN LIGHT": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Jedenasty protokół odzyskany: zielone światło to twierdzenie, nie fakt. Każda brama na trasie ma zadać pytanie — przechodzi ten, kto zna odpowiedź.', en: 'Eleventh protocol recovered: a green light is a claim, not a fact. Every gate on the route must ask a question — the one who knows the answer passes.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-11-already': {
    id: 'm3-exam-protocol-11-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XI już zaliczony.', en: 'Protocol XI already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — the camp board turns from false green to an honest mosaic
  'm3-return-apron': {
    id: 'm3-return-apron',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEDPOLE — POWRÓT', en: 'THE APRON — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Tablica obozu: fałszywa zieleń ustąpiła uczciwej mozaice — czerwień, bursztyn, zieleń.', en: 'The camp board: the false green has given way to an honest mosaic — red, amber, green.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Kontrola przedlotowa. Pytanie o Harrisa dostaje pierwszą uczciwą odpowiedź: stabilny. Pułapka: uzbrojona. Zalecenie: nie budzić.', en: 'Pre-flight check. The Harris question gets its first honest answer: stable. Trap: armed. Recommendation: do not wake.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'dr Kern', text: { pl: 'Wiedziałam, że coś tam jest. Nie wiedziałam co.', en: 'I knew something was there. I did not know what.' }, mode: 'cinematic', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_APRON_SEEN] },
  },
};
