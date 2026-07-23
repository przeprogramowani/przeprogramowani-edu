import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — a sea of green over a dead station; the moon's inversion is set here
  'm3-apron-intro': {
    id: 'm3-apron-intro',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEDPOLE — równina czarnego szkliwa. Tablica główna: ALL SYSTEMS NOMINAL — DZIEŃ 1892.', en: 'THE APRON — a plain of black glass. Main board: ALL SYSTEMS NOMINAL — DAY 1892.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Morze zielonych kontrolek nad martwą stacją. Wygasłe kominy, dym z pękniętej rury — a każda tablica mówi, że wszystko żyje. Na Księżycu 1 zamilkła natura. Na Księżycu 2 stanęła maszyna. Tu maszyny mówią. I każda kłamie.', en: 'A sea of green indicators over a dead station. Cold chimneys, smoke from a cracked pipe — and every board says everything is alive. On Moon 1 nature fell silent. On Moon 2 the machine stopped. Here the machines talk. And every one of them lies.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Planer sam wybrał ten księżyc. Zanim wejdziemy głębiej w Pas z pościgiem na karku, sprzęt musi przejść przegląd — a ja potrzebuję wzorców diagnostycznych. Jedyne źródło to poligon Odyssey-T z lustrzanym archiwum całego Projektu Odyssey. Sonda Odyssey-P na Księżycu 1, wykuwnia Odyssey-F na Księżycu 2, poligon tutaj.', en: 'The planner picked this moon itself. Before we go deeper into the Belt with a pursuit at our backs, the gear needs a review — and I need diagnostic reference patterns. The only source is the Odyssey-T proving ground, with the mirror archive of the whole Project Odyssey. The Odyssey-P probe on Moon 1, the Odyssey-F forge on Moon 2, the range here.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Dane: kompletne. Raporty: zielone. Nie mogę im wierzyć — więc ty musisz wątpić za mnie.', en: 'Data: complete. Reports: green. I cannot believe them — so you must doubt for me.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Schodzę z tobą, Dexo. Kawa już zaparzona — najpierw kawa, nauczyłam się planować. Kern zostaje na statku: łączność i wachta medyczna przy kapsule Harrisa.', en: 'I am coming down with you, Dexo. The coffee is already brewed — coffee first, I have learned to plan. Kern stays aboard: comms and the medical watch at Harris\'s pod.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_APRON_INTRO_SEEN] },
  },

  // Camp module — quest hub
  'm3-camp-start': {
    id: 'm3-camp-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ OBOZOWY — online. Zakładka: archiwum lustrzane Odyssey-T.', en: 'CAMP MODULE — online. Tab: Odyssey-T mirror archive.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Tablica raportuje trzy zielone statusy: wieża chłodzenia, kotwa sejsmiczna, maszt telemetryczny. Nie ufam żadnemu. Idź na obrzeża, sprawdź każdy własnymi oczami i wróć. Dopiero wtedy zbuduję uczciwą warstwę mapy.', en: 'The board reports three green statuses: cooling tower, seismic anchor, telemetry mast. I trust none of them. Go to the outskirts, check each with your own eyes, and come back. Only then will I build an honest layer of the map.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Audyt — trzy punkty na obrzeżach, potem meldunek w obozie.', en: '◆ NEW MISSION: The Audit — three points on the outskirts, then report at camp.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_ACTIVE], activateQuest: 'q-m3-audit' },
  },
  'm3-camp-waiting': {
    id: 'm3-camp-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Audyt w toku. Wciąż brakuje pomiarów z obrzeży. Sprawdź wieżę, kotwę i maszt — wszystkie trzy — i wróć z tym, co naprawdę widziałeś.', en: 'Audit in progress. Measurements from the outskirts are still missing. Check the tower, the anchor, and the mast — all three — and come back with what you actually saw.' }, mode: 'dialogue' },
    ],
  },
  'm3-camp-online-post': {
    id: 'm3-camp-online-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ OBOZOWY: pierwsza uczciwa warstwa mapy — załadowana.', en: 'CAMP MODULE: first honest map layer — loaded.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Obóz stoi, mapa mówi prawdę. Archiwum lustrzane otwarte — cała certyfikacja Projektu Odyssey w jednym module. Wschodnia śluza już nie kłamie, że jest zielona.', en: 'The camp holds, the map tells the truth. The mirror archive is open — the whole Project Odyssey certification in one module. The east airlock no longer lies that it is green.' }, mode: 'dialogue' },
    ],
  },

  // Audit point — cooling tower (LIES)
  'm3-audit-tower': {
    id: 'm3-audit-tower',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wieża chłodzenia. Tablica: ZIELONY. Ale najpierw uruchom audyt w obozie — bez niego to tylko cudza deklaracja.', en: 'The cooling tower. Board: GREEN. But start the audit at camp first — without it this is just someone else\'s claim.' }, mode: 'monologue' },
    ],
  },
  'm3-audit-tower-check': {
    id: 'm3-audit-tower-check',
    lines: [
      { speaker: 'system', text: { pl: 'WIEŻA CHŁODZENIA — raport stacji: ZIELONY / SPRAWNY.', en: 'COOLING TOWER — station report: GREEN / NOMINAL.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Zimna od lat. Pęknięta rura, szron na złączach, ani śladu ciepła. Raport kłamie — pierwszy z brzegu zielony, który nic nie znaczy.', en: 'Cold for years. A cracked pipe, frost on the joints, not a trace of heat. The report lies — the first green that means nothing at all.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_AUDIT_TOWER_CHECKED] },
  },
  'm3-audit-tower-done': {
    id: 'm3-audit-tower-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wieża zmierzona: martwa, mimo zieleni. Odnotowane.', en: 'Tower measured: dead, despite the green. Logged.' }, mode: 'monologue' },
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
      { speaker: 'astronaut', text: { pl: 'Kotwa zmierzona: wisi na jednym trzpieniu. Zielona na papierze. Odnotowane.', en: 'Anchor measured: hanging by one pin. Green on paper. Logged.' }, mode: 'monologue' },
    ],
  },

  // Audit point — telemetry mast (TRUTH)
  'm3-audit-mast': {
    id: 'm3-audit-mast',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Maszt telemetryczny. Tablica: ZIELONY. Jak dwa poprzednie. Sprawdzę i tak — najpierw uruchom audyt w obozie.', en: 'The telemetry mast. Board: GREEN. Like the other two. I will check anyway — start the audit at camp.' }, mode: 'monologue' },
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
      { speaker: 'astronaut', text: { pl: 'Maszt zmierzony: nadaje naprawdę. Jedyny uczciwy zielony na tablicy. Odnotowane.', en: 'Mast measured: it really transmits. The one honest green on the board. Logged.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the audit verdict
  'q-m3-audit-complete': {
    id: 'q-m3-audit-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ AUDYT ZAKOŃCZONY. Werdykt: 2 statusy kłamią, 1 mówi prawdę.', en: '◆ AUDIT COMPLETE. Verdict: 2 statuses lie, 1 tells the truth.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Wieża martwa, kotwa wisi, maszt nadaje. Tablica świeciła zielenią nad wszystkimi trzema. Dwa razy skłamała, raz powiedziała prawdę — i tylko pomiar to rozdzielił.', en: 'Tower dead, anchor hanging, mast transmitting. The board glowed green over all three. It lied twice and told the truth once — and only the measurement told them apart.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mam pierwszą uczciwą warstwę mapy obozu. Nauka w obozie, pomiar na obrzeżach, konsekwencja przy wyjściu: wschodnia śluza otwiera się na twój własny pomiar. Sam ją zbadałeś i to ona cię teraz przepuszcza.', en: 'I have the first honest layer of the camp map. Learn at camp, measure on the outskirts, consequence at the exit: the east airlock opens to your own measurement. You surveyed it yourself, and that is what lets you through now.' }, mode: 'dialogue' },
    ],
  },

  // Main board — the sting
  'm3-main-board': {
    id: 'm3-main-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA GŁÓWNA — dziennik odczytów. Ostatnia sesja: sprzed kilku tygodni.', en: 'MAIN BOARD — read log. Last session: a few weeks ago.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Ktoś już przeglądał te kłamstwa. Sesja odczytu sprzed kilku tygodni, poświadczenia spoza rejestru Odyssey. Ktoś stał dokładnie tu, patrzył na ALL SYSTEMS NOMINAL — i poszedł dalej.', en: 'Someone already browsed these lies. A read session from a few weeks back, credentials outside the Odyssey registry. Someone stood exactly here, looked at ALL SYSTEMS NOMINAL — and moved on.' }, mode: 'dialogue' },
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
      { speaker: 'Moreau', text: { pl: 'Najpierw kawa. Nauczyłam się planować. Rozstawiam obóz przy module. Ty idź audytować; ja tu zostanę i będę notować, co wróci.', en: 'Coffee first. I\'ve learned to plan. I\'m setting up camp at the module. You go audit; I\'ll stay and note down whatever comes back.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-camp': {
    id: 'm3-moreau-camp',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Obóz stoi. Notes pod ręką. Dexo — od Księżyca 2 sprawdzam wszystko dwa razy. Raz zaufałam za łatwo i to mi wystarczyło za naukę.', en: 'Camp is up. Notebook at hand. Dexo — since Moon 2 I check everything twice. I trusted too easily once, and that was lesson enough.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-iskra': {
    id: 'm3-moreau-iskra',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Iskra? Oczywiście, że Iskra. Jedyna maszyna na tym księżycu, która przyznała się do usterki — i jedyna, która przeżyła. Dobre imię.', en: 'Iskra? Of course it\'s Iskra. The only machine on this moon that admitted a fault — and the only one that survived. A good name.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-cert': {
    id: 'm3-moreau-cert',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Partia ma certyfikat. Ktoś w końcu poręczy imiennie za to, co wysyłamy. Zapisuję i to — dobre rzeczy też warto notować.', en: 'The batch has a certificate. Someone will finally vouch by name for what we ship. I am logging this too — the good things are worth noting as well.' }, mode: 'dialogue' },
    ],
  },
  'm3-moreau-diag': {
    id: 'm3-moreau-diag',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Stacja pierwszy raz mówi o sobie prawdę. Dziwne uczucie — słuchać maszyny, która wreszcie nie udaje. Prawie jej współczuję.', en: 'The station is telling the truth about itself for the first time. A strange feeling — listening to a machine that has finally stopped pretending. I almost pity it.' }, mode: 'dialogue' },
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
      { speaker: 'CORE AI', text: { pl: 'Trasa otworzy się dopiero, gdy zostanie uczciwie zbadana. Zamknięta śluza to po prostu szczery pomiar: jeszcze jej nie sprawdziłeś. Dokończ audyt.', en: 'The route opens only once it has been honestly surveyed. A sealed airlock is simply an honest measurement: you have not checked it yet. Finish the audit.' }, mode: 'dialogue' },
    ],
  },

  // Exam XI
  'm3-exam-protocol-11-done': {
    id: 'm3-exam-protocol-11-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XI — „ZIELONE ŚWIATŁO": zaliczony.', en: 'PROTOCOL XI — "THE GREEN LIGHT": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Jedenasty protokół odzyskany: zielone światło to dopiero czyjeś twierdzenie, które trzeba jeszcze sprawdzić. Każda brama na trasie ma zadawać pytanie, a przechodzi ten, kto zna odpowiedź.', en: 'Eleventh protocol recovered: a green light is only someone\'s claim, still waiting to be checked. Every gate on the route must ask a question, and only the one who knows the answer passes.' }, mode: 'dialogue' },
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
      { speaker: 'CORE AI', text: { pl: 'Kontrola przedlotowa. Pytanie o Harrisa dostaje pierwszą uczciwą odpowiedź systemu: Harris: stabilny. Pułapka: uzbrojona. Zalecenie: nie budzić.', en: 'Pre-flight check. The Harris question gets its first honest system answer: Harris: stable. Trap: armed. Recommendation: do not wake.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'dr Kern', text: { pl: 'Wiedziałam, że coś tam jest. Nie wiedziałam co.', en: 'I knew something was there. I did not know what.' }, mode: 'cinematic', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_APRON_SEEN] },
  },
};
