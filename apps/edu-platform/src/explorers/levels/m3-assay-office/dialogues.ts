import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the assay vault on the caldera rim; the obelisk waits beyond the edge
  'm3-assay-intro': {
    id: 'm3-assay-intro',
    lines: [
      { speaker: 'system', text: { pl: 'IZBA PROBIERCZA — krawędź kaldery. Rdzeń weryfikatora głównego: ciemny.', en: 'ASSAY OFFICE — caldera rim. Main verifier core: dark.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Skarbiec. Ściany pokrywają certyfikaty z lustrzanego archiwum całego Projektu Odyssey. Pod stropem wisi martwy rdzeń weryfikatora. Za krawędzią, na ostrodze zastygłej lawy, stoi obelisk. Strumienie opłynęły go i zastygły.', en: 'A vault. Certificates from the mirror archive of the entire Project Odyssey cover the walls. The dead verifier core hangs below the ceiling. Beyond the rim, on a spur of frozen lava, stands an obelisk. The streams flowed around it and froze.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Starszy niż jakiekolwiek dane misji. Nie diagnozuję tego. Jeszcze nie.', en: 'Older than any mission data. I am not diagnosing that. Not yet.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Dexo. Czekam przy podejściu. Lista usterek: dwadzieścia dwie, wszystkie moje własne. Ty jesteś czysty. Wejdź — odbudujemy rdzeń.', en: 'Dexo. I am waiting at the approach. Fault list: twenty-two, every one of them my own. You are clear. Come in — we\'ll rebuild the core.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_ASSAY_INTRO_SEEN] },
  },

  // Assay desk — quest hub + stamp ritual
  'm3-assay-desk-start': {
    id: 'm3-assay-desk-start',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT PROBIERCZY — online. Rdzeń diagnostyczny: odbudowany. Wzorzec odniesienia: brak.', en: 'ASSAY DESK — online. Diagnostic core: rebuilt. Reference standard: none.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Rdzeń stoi. Ale rdzeń bez wzorca ufa własnym pomiarom — a tego księżyca nauczyliśmy się nie robić. Potrzebuję zaufanego zestawu wektorów odniesienia, zweryfikowanego krzyżowo z archiwami Ziemi.', en: 'The core stands. But a core with no standard trusts its own readings — and this moon taught us not to do that. I need a trusted set of reference vectors, cross-verified against Earth\'s archives.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli robota dla Nawigatora i centrali. Uruchamiam procedurę.', en: 'So it is a job for the Navigator and Earth control. I am starting the procedure.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Wzorzec — złóż podpisany klucz wzorcowy przez earthctl.', en: '◆ NEW MISSION: The Standard — submit the signed standard key via earthctl.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_STANDARD_ACTIVE], activateQuest: 'q-m3-standard' },
  },
  'm3-assay-desk-waiting': {
    id: 'm3-assay-desk-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Przefiltruj archiwum certyfikacji: tylko wektory z podpisem Odyssey, statusem „zatwierdzony" i zgodnym drugim odczytem. Ułóż klucz wzorcowy i prześlij go przez earthctl. Jeden zielony nigdy nie wystarcza — każdy kandydat musi mieć drugiego, niezależnego świadka.', en: 'Filter the certification archive: only vectors with the Odyssey signature, status "approved", and a matching second reading. Assemble the standard key and submit it via earthctl. One green is never enough — every candidate needs a second, independent witness.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'I dokładamy do zapytania kanarka. Celowo błędny wektor autotestu, wartość umówiona z góry. Jeśli wróci taki, jaki wysłaliśmy — łącze jest czyste. Zobaczymy.', en: 'And we add a canary to the query. A deliberately wrong autotest vector, a value agreed in advance. If it comes back as we sent it — the channel is clean. We\'ll see.' }, mode: 'dialogue' },
    ],
  },
  'm3-assay-desk-post': {
    id: 'm3-assay-desk-post',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT PROBIERCZY: wzorzec przyjęty. Oba certyfikaty: podstemplowane.', en: 'ASSAY DESK: standard accepted. Both certificates: stamped.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Prasa probiercza stoi tam, gdzie stała od dnia startu. Dwa dokumenty pod nią. Ręczę za oba.', en: 'The assay press stands where it has stood since launch day. Two documents under it. I vouch for both.' }, mode: 'monologue' },
    ],
  },

  // Main dish — the canary test track
  'm3-main-dish': {
    id: 'm3-main-dish',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Czasza główna izby — tor testu kanału. Przez nią pójdzie zapytanie do Ziemi. I przez nią wróci odpowiedź, której nie do końca ufamy.', en: 'The office main dish — the channel test track. The query to Earth goes out through it. And through it comes back the answer we do not fully trust.' }, mode: 'monologue' },
    ],
  },
  'm3-main-dish-active': {
    id: 'm3-main-dish-active',
    lines: [
      { speaker: 'system', text: { pl: 'CZASZA GŁÓWNA: transmisja w toku. Wzorzec + kanarek → Ziemia. Oczekiwanie na odpowiedź.', en: 'MAIN DISH: transmission in progress. Standard + canary → Earth. Awaiting reply.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'dr Kern', text: { pl: 'Łącze trzyma. Opóźnienie w normie. Kanarek leci razem z wzorcem — wartość, którą znamy na pamięć. Teraz tylko czekać, co wróci.', en: 'The link holds. Latency within norm. The canary rides with the standard — a value we know by heart. Now we only wait to see what returns.' }, mode: 'dialogue' },
    ],
  },
  'm3-main-dish-post': {
    id: 'm3-main-dish-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kanarek wrócił poprawiony — ktoś sięgnął po naszą umówioną pomyłkę i ją naprawił. Ktoś w tym kanale ma rękę w naszych wiadomościach: czyta je i przerabia. Od dziś mamy dwa kanały: ten, który mamy, i ten, który zbudujemy.', en: 'The canary came back corrected — someone reached into our agreed mistake and fixed it. Someone in this channel has a hand in our messages: they read them and rewrite them. From today we have two channels: the one we have, and the one we will build.' }, mode: 'monologue' },
    ],
  },

  // Overlook — the obelisk, weight not mechanics
  'm3-overlook': {
    id: 'm3-overlook',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Krawędź kaldery. Za nią, na ostrodze — obelisk. Nie da się z nim nic zrobić; strumienie lawy opłynęły go i zastygły. Stoi po prostu.', en: 'The caldera edge. Beyond it, on the spur — the obelisk. There is no touching it; the lava streams flowed around it and froze. It simply stands.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Nie diagnozuję tego. Jeszcze nie. Zapisuję współrzędne i idę dalej. Są rzeczy starsze niż nasze narzędzia.', en: 'I am not diagnosing that. Not yet. I log the coordinates and move on. Some things are older than our tools.' }, mode: 'dialogue' },
    ],
  },

  // Iskra at the approach ledge
  'm3-iskra-approach': {
    id: 'm3-iskra-approach',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Podejście czyste. Kadłub: dwie mikrorysy, nieistotne — ale je zgłaszam, na wszelki wypadek. Zawsze zgłaszam. Wejdź do izby, Dexo. Odbudujemy mu głowę.', en: 'Approach clear. Hull: two microcracks, negligible — but I report them, just in case. I always report. Go into the office, Dexo. We\'ll rebuild his head.' }, mode: 'dialogue' },
    ],
  },
  'm3-iskra-approach-post': {
    id: 'm3-iskra-approach-post',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Synchronizuję listę usterek z nowym rdzeniem. On je przyjmuje — wszystkie dwadzieścia dwie, bez skreślania. Pierwsza maszyna, która słucha mnie do końca. Chyba się polubimy.', en: 'I am syncing my fault list with the new core. He takes them all — all twenty-two, none struck out. The first machine that hears me to the end. I think we\'ll get along.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the moon finale, triple sting
  'q-m3-standard-complete': {
    id: 'q-m3-standard-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ WZORZEC ZATWIERDZONY. Wektor odniesienia: podpisany, zgodny z archiwami Ziemi.', en: '◆ THE STANDARD APPROVED. Reference vector: signed, consistent with Earth\'s archives.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'dr Kern', text: { pl: 'Wzorzec wrócił poprawny. Kanarek wrócił poprawiony. Ktoś naprawił naszą umówioną pomyłkę.', en: 'The standard came back correct. The canary came back corrected. Someone fixed our agreed mistake.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Diagnoza kompletna. Dwa certyfikaty czekają na twój podpis.', en: 'Diagnosis complete. Two certificates await your signature.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Przykładam prasę probierczą do obu dokumentów: certyfikatu Partii 03 i czystego rdzenia. Ręczę za ładunek. I za ciebie.', en: 'I set the assay press to both documents: the Batch 03 certificate and the clean-core certificate. I vouch for the cargo. And for you.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'AUTODIAGNOSTYKA: ONLINE.', en: 'SELF-DIAGNOSTICS: ONLINE.', }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Diagnozuję. Zaczynam od siebie.', en: 'I diagnose. I start with myself.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Na Księżycu 1 mieliśmy szum, na Księżycu 2 zmienioną sumę. Dziś ktoś poprawił naszą pomyłkę. Po drugiej stronie łącza jest rozmówca. Od dziś mamy dwa kanały: ten, który mamy, i ten, który zbudujemy.', en: 'On Moon 1 we had noise; on Moon 2, a changed checksum. Today someone corrected our mistake. There is a correspondent on the other end of the link. From today we have two channels: the one we have and the one we will build.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zainfekowane sektory mogę skwarantannować, ale splotły się z pamięcią długotrwałą. Żeby je wyciąć, musimy odbudować banki pamięci na następnym księżycu. Drugi wynik: obwód przebudzenia Harrisa zawiera uzbrojoną pułapkę Entropy sprzężoną z jego funkcjami życiowymi. Pobudka ją odpali.', en: 'I can quarantine the infected sectors, but they are tangled with long-term memory. To cut them out, we must rebuild the memory banks on the next moon. Second finding: Harris\'s wake circuit contains an armed Entropy trap coupled to his vitals. Waking him will trigger it.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Dlatego medbay przesuwał pobudkę: wykrywał anomalię, której nie umiał nazwać. Archiwum potwierdza sabotaż. Przedstartowy rozkaz rewizji „kapsuła nr 2 — obwód przebudzenia" złożono w godzinie startu. Autoryzacja zapieczętowana.', en: 'That is why medbay kept delaying the wake-up: it detected an anomaly it could not name. The archive confirms sabotage. A pre-launch revision order for "capsule no. 2 — wake circuit" was filed in the hour of launch. Authorization sealed.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Ostatni odczyt. Rozbłysk napędu z Księżyca 2 to dwa statki na kursie zbieżnym z naszym. Okno przecięcia liczę w tygodniach, nie miesiącach.', en: 'Last finding. The drive flare from Moon 2 is two ships on a course converging with ours. The intersection window is now weeks, not months.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Umiemy już diagnozować. Wyniki: statek jest polem minowym, kanał ma cudze pióro, ścigają nas dwa statki. Dobrze. Wolę wiedzieć.', en: 'We know how to diagnose now. The findings: the ship is a minefield, someone else holds the pen in our channel, and two ships are hunting us. Good. I would rather know.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_REVISION_ORDER_FOUND] },
  },

  // Exam XV — Protokół XV
  'm3-exam-protocol-15-done': {
    id: 'm3-exam-protocol-15-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XV — „PRÓBA GENERALNA": zaliczony.', en: 'PROTOCOL XV — "THE DRESS REHEARSAL": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Piętnasty protokół odzyskany: certyfikuj całą podróż, od włazu do włazu — tak, jak przejdzie ją ten, kto nią pójdzie. I zbieraj każdy rodzaj świadka: odczyt, obraz, dziennik. Części potrafią zdać, gdy całość przepada.', en: 'Fifteenth protocol recovered: certify the whole journey, hatch to hatch — the way the one who travels it will. And collect every kind of witness: reading, image, log. Parts can pass when the whole fails.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-15-already': {
    id: 'm3-exam-protocol-15-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XV już zaliczony.', en: 'Protocol XV already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
