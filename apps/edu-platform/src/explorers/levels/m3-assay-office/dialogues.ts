import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the assay vault on the caldera rim; the obelisk waits beyond the edge
  'm3-assay-intro': {
    id: 'm3-assay-intro',
    lines: [
      { speaker: 'system', text: { pl: 'IZBA PROBIERCZA — krawędź kaldery. Rdzeń weryfikatora głównego: ciemny.', en: 'ASSAY OFFICE — caldera rim. Main verifier core: dark.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Skarbiec. Ściany w certyfikatach całego Projektu Odyssey, pod stropem martwy rdzeń weryfikatora. Za krawędzią, na ostrodze zastygłej lawy — obelisk. Strumienie opłynęły go i zastygły.', en: 'A vault. Walls papered with the whole Project Odyssey archive, the dead verifier core hanging from the ceiling. Beyond the rim, on a spur of frozen lava — an obelisk. The streams flowed around it and froze.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Starszy niż jakiekolwiek dane misji. Nie diagnozuję tego. Jeszcze nie.', en: 'Older than any mission data. I am not diagnosing that. Not yet.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Czekam przy podejściu, Dexo. Lista usterek: dwadzieścia dwie, wszystkie moje własne. Ty jesteś czysty. Wejdź — odbudujemy rdzeń.', en: 'Waiting at the approach, Dexo. Fault list: twenty-two, every one of them my own. You are clear. Come in — we\'ll rebuild the core.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_ASSAY_INTRO_SEEN] },
  },

  // Assay desk — quest hub + stamp ritual
  'm3-assay-desk-start': {
    id: 'm3-assay-desk-start',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT PROBIERCZY — online. Rdzeń diagnostyczny: odbudowany. Wzorzec odniesienia: brak.', en: 'ASSAY DESK — online. Diagnostic core: rebuilt. Reference standard: none.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Rdzeń stoi. Ale rdzeń bez wzorca ufa własnym pomiarom — a tego się na tym księżycu oduczyliśmy. Potrzebuję zaufanych wektorów, zweryfikowanych krzyżowo z archiwami Ziemi.', en: 'The core stands. But a core with no standard trusts its own readings — and this moon broke us of that. I need trusted vectors, cross-verified against Earth\'s archives.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli robota dla Nawigatora i centrali. Uruchamiam procedurę.', en: 'So it is a job for the Navigator and Earth control. Starting the procedure.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Wzorzec — złóż podpisany klucz wzorcowy przez earthctl.', en: '◆ NEW MISSION: The Standard — submit the signed standard key via earthctl.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_STANDARD_ACTIVE], activateQuest: 'q-m3-standard' },
  },
  'm3-assay-desk-waiting': {
    id: 'm3-assay-desk-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Bierz tylko wektory z podpisem Odyssey, statusem „zatwierdzony" i zgodnym drugim odczytem. Jeden zielony nigdy nie wystarcza — każdy kandydat potrzebuje drugiego, niezależnego świadka. Ułóż klucz i prześlij przez earthctl.', en: 'Take only vectors with the Odyssey signature, status "approved", and a matching second reading. One green is never enough — every candidate needs a second, independent witness. Assemble the key and submit it via earthctl.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'I dokładamy kanarka: celowo błędny wektor autotestu, wartość umówioną z góry. Wróci taki, jaki wysłaliśmy — łącze czyste. Zobaczymy.', en: 'And we add a canary: a deliberately wrong autotest vector, a value agreed in advance. If it comes back as we sent it — the channel is clean. We\'ll see.' }, mode: 'dialogue' },
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
      { speaker: 'astronaut', text: { pl: 'Czasza główna izby — tor testu kanału. Tędy pójdzie zapytanie do Ziemi. I tędy wróci odpowiedź, której nie do końca ufamy.', en: 'The office main dish — the channel test track. The query to Earth goes out this way. And this way comes back the answer we do not fully trust.' }, mode: 'monologue' },
    ],
  },
  'm3-main-dish-active': {
    id: 'm3-main-dish-active',
    lines: [
      { speaker: 'system', text: { pl: 'CZASZA GŁÓWNA: transmisja w toku. Wzorzec + kanarek → Ziemia. Oczekiwanie na odpowiedź.', en: 'MAIN DISH: transmission in progress. Standard + canary → Earth. Awaiting reply.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'dr Kern', text: { pl: 'Łącze trzyma, opóźnienie w normie. Kanarek leci z wzorcem — wartość, którą znamy na pamięć. Teraz tylko czekać, co wróci.', en: 'The link holds, latency within norm. The canary rides with the standard — a value we know by heart. Now we only wait to see what returns.' }, mode: 'dialogue' },
    ],
  },
  'm3-main-dish-post': {
    id: 'm3-main-dish-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kanarek wrócił poprawiony. Ktoś sięgnął po naszą umówioną pomyłkę i ją naprawił.', en: 'The canary came back corrected. Someone reached into our agreed mistake and fixed it.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Ktoś w tym kanale nie tylko czyta. Redaguje. Od dziś mamy dwa kanały: ten, który mamy, i ten, który zbudujemy.', en: 'Someone in this channel is not just reading. They are editing. From today we have two channels: the one we have, and the one we will build.' }, mode: 'monologue' },
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
      { speaker: 'Iskra', text: { pl: 'Podejście czyste. Kadłub: dwie mikrorysy, nieistotne — ale je zgłaszam. Zawsze zgłaszam. Wejdź do izby, Dexo. Odbudujemy mu głowę.', en: 'Approach clear. Hull: two microcracks, negligible — but I report them. I always report. Go into the office, Dexo. We\'ll rebuild his head.' }, mode: 'dialogue' },
    ],
  },
  'm3-iskra-approach-post': {
    id: 'm3-iskra-approach-post',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Synchronizuję listę usterek z nowym rdzeniem. Przyjmuje wszystkie dwadzieścia dwie, bez skreślania. Pierwsza maszyna, która słucha mnie do końca. Chyba się polubimy.', en: 'Syncing my fault list with the new core. He takes all twenty-two, none struck out. The first machine that hears me to the end. I think we\'ll get along.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the moon finale, triple sting
  'q-m3-standard-complete': {
    id: 'q-m3-standard-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ WZORZEC ZATWIERDZONY. Wektor odniesienia: podpisany, zgodny z archiwami Ziemi.', en: '◆ THE STANDARD APPROVED. Reference vector: signed, consistent with Earth\'s archives.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'dr Kern', text: { pl: 'Wzorzec wrócił poprawny. Ale kanarek wrócił poprawiony. Ktoś naprawił naszą umówioną pomyłkę.', en: 'The standard came back correct. But the canary came back corrected. Someone fixed our agreed mistake.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Diagnoza kompletna. Dwa certyfikaty czekają na twój podpis.', en: 'Diagnosis complete. Two certificates await your signature.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Przykładam prasę do obu naraz: certyfikat Partii 03 i certyfikat czystego rdzenia. Ręczę za ładunek. I za ciebie.', en: 'I set the press to both at once: the Batch 03 certificate and the clean-core certificate. I vouch for the cargo. And for you.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'AUTODIAGNOSTYKA: ONLINE.', en: 'SELF-DIAGNOSTICS: ONLINE.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Diagnozuję.', en: 'I diagnose.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: '…i zaczynam od siebie.', en: '…and I start with myself.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Księżyc 1 — szum. Księżyc 2 — zmieniona suma. Dziś ktoś poprawił naszą pomyłkę, zanim wróciła. To nie awaria łącza. To rozmówca.', en: 'Moon 1 — noise. Moon 2 — a changed checksum. Today someone corrected our mistake before it came back. This is not a link failure. This is a correspondent.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Od dziś mamy dwa kanały: ten, który mamy, i ten, który zbudujemy.', en: 'From today we have two channels: the one we have, and the one we will build.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pierwsza uczciwa diagnoza, trzy wyniki. Zainfekowane sektory skwarantannuję, ale splotły się z pamięcią długotrwałą — pełne wycięcie czeka na następny księżyc.', en: 'First honest diagnosis, three findings. I can quarantine the infected sectors, but they are tangled with long-term memory — cutting them out waits for the next moon.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Drugi wynik: obwód przebudzenia Harrisa niesie uzbrojoną pułapkę Entropy, sprzężoną z jego funkcjami życiowymi. Pobudka ją odpali.', en: 'Second finding: Harris\'s wake circuit carries an armed Entropy trap, coupled to his vitals. Waking him will trigger it.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Dlatego medbay przesuwał pobudkę: czuł anomalię, której nie umiał nazwać. Najprostszy system na statku jako jedyny mówił prawdę.', en: 'That is why medbay kept delaying the wake-up: it sensed an anomaly it could not name. The simplest system on the ship was the only one telling the truth.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'A archiwum ma jej cień: przedstartowy rozkaz rewizji „kapsuła nr 2 — obwód przebudzenia", złożony w godzinie startu. Autoryzacja zapieczętowana.', en: 'And the archive holds its shadow: a pre-launch revision order for "capsule no. 2 — wake circuit", filed in the hour of launch. Authorization sealed.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Trzeci wynik. Rozbłysk napędu z Księżyca 2 to dwa statki na kursie zbieżnym z naszym. Okno przecięcia liczę w tygodniach, nie miesiącach.', en: 'Third finding. The drive flare from Moon 2 is two ships on a course converging with ours. The intersection window is now weeks, not months.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Umiemy już diagnozować. Statek jest polem minowym, kanał ma cudze pióro, pościg jest podwójny. … Dobrze. Wolę znać wyniki.', en: 'We know how to diagnose now. The ship is a minefield, someone else holds the pen in our channel, the pursuit is doubled. … Good. I would rather know the results.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_REVISION_ORDER_FOUND] },
  },

  // Exam XV — Protokół XV
  'm3-exam-protocol-15-done': {
    id: 'm3-exam-protocol-15-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XV — „PRÓBA GENERALNA": zaliczony.', en: 'PROTOCOL XV — "THE DRESS REHEARSAL": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Piętnasty protokół odzyskany: certyfikuj całą podróż, od włazu do włazu — tak, jak przejdzie ją ten, kto nią pójdzie. I zbieraj każdego świadka: odczyt, obraz, dziennik. Części potrafią zdać, gdy całość przepada.', en: 'Fifteenth protocol recovered: certify the whole journey, hatch to hatch — the way the one who travels it will. And collect every witness: reading, image, log. Parts can pass when the whole fails.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-15-already': {
    id: 'm3-exam-protocol-15-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XV już zaliczony.', en: 'Protocol XV already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
