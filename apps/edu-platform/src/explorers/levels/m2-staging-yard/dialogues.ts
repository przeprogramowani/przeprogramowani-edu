import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the frozen tram yard and the heat budget
  'm2-staging-intro': {
    id: 'm2-staging-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ZAJEZDNIA ETAPOWA — przepustowość: 0. Tramwaje w gotowości: 3. Ostatni kurs: 847 cykli temu.', en: 'STAGING YARD — throughput: 0. Trams on standby: 3. Last run: 847 cycles ago.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Tramwaje załadowane do połowy. Tablica pełna rozkładów, których nikt nie przejechał. Zajezdnia czeka na sygnał od ośmiuset cykli.', en: 'Trams loaded halfway. A board full of timetables no one ever ran. The yard has been waiting for a signal for eight hundred cycles.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Tędy VOID etapował każdy transport w Pasie. Nasz kontrakt wymaga od tego miejsca jednej rzeczy: pierwszej partii rudy BETA w doku przeładunkowym. Problem: moc do odmrażania to twardy budżet cieplny. Nie odmrozimy wszystkiego. Musimy wybrać najmniejszy ciąg odmrożeń, który na każdym etapie coś realnie daje.', en: 'Through here, VOID staged every shipment in the Belt. Our contract needs one thing from this place: the first batch of BETA ore at the transfer dock. The problem: thawing power is a hard heat budget. We cannot thaw everything. We must pick the smallest chain of thaws that delivers real value at every step.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'VOID nazwałby to harmonogramem minimalnym. My nazywamy to kamieniami milowymi MVP. Ta sama lekcja — tylko my mamy decydenta.', en: 'VOID would call it a minimal schedule. We call it MVP milestones. The same lesson — except we have a decision-maker.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli zakupy z pustym portfelem. Dobrze, że mam wprawę.', en: 'So, shopping with an empty wallet. Good thing I have practice.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_STAGING_INTRO_SEEN] },
  },

  // Schedule board
  'm2-schedule-board': {
    id: 'm2-schedule-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA ROZKŁADÓW — zaplanowane kursy: 12 418. Wykonane od Incydentu Zero: 0.', en: 'SCHEDULE BOARD — planned runs: 12,418. Completed since Incident Zero: 0.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Dwanaście tysięcy kursów, zero przejazdów. Ktoś tu bardzo lubił planować i bardzo nie mógł zacząć.', en: 'Twelve thousand runs, zero departures. Somebody here loved planning and could not begin.' }, mode: 'monologue' },
    ],
  },
  'm2-schedule-board-done': {
    id: 'm2-schedule-board-done',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA ROZKŁADÓW — aktywny rozkład: ŁAŃCUCH BETA (3 kamienie). Wykonane kursy: 1. Licznik ruszył.', en: 'SCHEDULE BOARD — active timetable: BETA CHAIN (3 milestones). Completed runs: 1. The counter is moving.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Jeden wykonany kurs wart więcej niż dwanaście tysięcy zaplanowanych. Ta tablica długo na to czekała.', en: 'One completed run is worth more than twelve thousand planned ones. This board waited a long time for that.' }, mode: 'dialogue' },
    ],
  },

  // Milestone console — HQ mission activation
  'm2-milestone-console-start': {
    id: 'm2-milestone-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA KAMIENI MILOWYCH — oczekuje łańcucha odmrożeń. Budżet cieplny: 60 ju. Kandydatów: 9.', en: 'MILESTONE CONSOLE — awaiting a thaw chain. Heat budget: 60 hu. Candidates: 9.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'To misja dla Nawigatora — łącze /support przez przekaźnik Odyssey. W Earth HQ czeka lista kandydatów i reguły budżetu: module-002-10xdevs-workflow/PROMPT_MILESTONES.md. Nawigator wybierze najmniejszy uporządkowany łańcuch, który dowozi wartość na każdym etapie. Przez łącze Moreau przejdzie sam łańcuch — nic więcej.', en: 'This is a mission for the Navigator — the /support link through the Odyssey relay. At Earth HQ, the candidate list and budget rules are waiting: module-002-10xdevs-workflow/PROMPT_MILESTONES.md. The Navigator picks the smallest ordered chain that delivers value at every step. Only the chain itself travels over Moreau\'s link — nothing more.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ja pilnuję zajezdni i B-6. Nawigator tnie plan na kawałki, które się ruszają. Podział obowiązków jak z podręcznika.', en: 'I watch the yard and B-6. The Navigator cuts the plan into pieces that move. Division of labour, straight from the textbook.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Wyznacz kamienie milowe MVP', en: 'NEW HQ MISSION: Set the MVP Milestones' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { activateQuest: 'q-m2-mvp-milestones' },
  },
  'm2-milestone-console-done': {
    id: 'm2-milestone-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA KAMIENI MILOWYCH — łańcuch BETA aktywny: semafor → tram Alpha → pierwszy kurs. Zużycie budżetu: 50/60 ju.', en: 'MILESTONE CONSOLE — BETA chain active: semaphore → tram Alpha → first run. Budget used: 50/60 hu.' }, mode: 'system', autoAdvance: 2800 },
    ],
  },

  // Trams — pre/post-thaw states
  'm2-tram-alpha': {
    id: 'm2-tram-alpha',
    lines: [
      { speaker: 'system', text: { pl: 'TRAM ALPHA — ładunek: 48%. Stan: ZAMROŻONY W TRAKCIE ZAŁADUNKU.', en: 'TRAM ALPHA — cargo: 48%. State: FROZEN MID-LOADING.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Załadowany prawie do połowy i zatrzymany w pół ruchu. Ktoś mu obiecał, że zaraz wróci.', en: 'Loaded almost halfway and stopped mid-motion. Somebody promised it they would be right back.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-alpha-done': {
    id: 'm2-tram-alpha-done',
    lines: [
      { speaker: 'system', text: { pl: 'TRAM ALPHA — odmrożony. Pierwszy kurs do doku: WYKONANY. Następny: wg łańcucha BETA.', en: 'TRAM ALPHA — thawed. First run to the dock: COMPLETE. Next: per the BETA chain.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Osiemset cykli przerwy i rusza, jakby nic się nie stało. Szacunek, Alpha.', en: 'An eight-hundred-cycle break and it moves like nothing happened. Respect, Alpha.' }, mode: 'dialogue' },
    ],
  },
  'm2-tram-beta': {
    id: 'm2-tram-beta',
    lines: [
      { speaker: 'system', text: { pl: 'TRAM BETA — tor zapasowy, nieoświetlony. Stan: ZAMROŻONY.', en: 'TRAM BETA — reserve track, unlit. State: FROZEN.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Odmrożenie Bety wymagałoby jeszcze oświetlenia toru zapasowego. Dwa wydatki, żaden nie przybliża pierwszej partii rudy.', en: 'Thawing Beta would additionally require lighting the reserve track. Two expenses, and neither brings the first ore batch any closer.' }, mode: 'dialogue' },
    ],
  },
  'm2-tram-beta-done': {
    id: 'm2-tram-beta-done',
    lines: [
      { speaker: 'system', text: { pl: 'TRAM BETA — nadal zamrożony. Poza łańcuchem BETA. Decyzja: ŚWIADOMA.', en: 'TRAM BETA — still frozen. Outside the BETA chain. Decision: DELIBERATE.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Beta zostaje w lodzie i to nie jest zaniedbanie — to zakres. Wróci w przyszłym planie, jeśli będzie potrzebna.', en: 'Beta stays in the ice, and that is not neglect — that is scope. It returns in a future plan, if it is needed.' }, mode: 'dialogue' },
    ],
  },
  'm2-tram-gamma': {
    id: 'm2-tram-gamma',
    lines: [
      { speaker: 'system', text: { pl: 'TRAM GAMMA — ładunek: 12%. Stan: ZAMROŻONY. Uwaga: przymarznięty do rozjazdu.', en: 'TRAM GAMMA — cargo: 12%. State: FROZEN. Note: frozen onto the junction.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ten nawet nie zdążył porządnie zacząć. Wiem coś o tym uczuciu.', en: 'This one never even properly started. I know that feeling.' }, mode: 'monologue' },
    ],
  },

  // Frozen loader — ambient
  'm2-frozen-loader': {
    id: 'm2-frozen-loader',
    lines: [
      { speaker: 'system', text: { pl: 'JEDNOSTKA ZAŁADUNKOWA VOID — zamrożona z paletą rudy w uchwytach.', en: 'VOID LOADER UNIT — frozen with an ore pallet in its grips.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Trzyma tę paletę od ośmiuset cykli. Nikt jej nie powiedział, gdzie ją odłożyć.', en: 'It has held that pallet for eight hundred cycles. No one ever told it where to set it down.' }, mode: 'monologue' },
    ],
  },

  // Heat plant
  'm2-heat-plant': {
    id: 'm2-heat-plant',
    lines: [
      { speaker: 'system', text: { pl: 'PIEC SYNAPTITOWY — rezerwa: 60 jednostek ciepła. Odzysk: NIEMOŻLIWY.', en: 'SYNAPTIT FURNACE — reserve: 60 heat units. Recovery: IMPOSSIBLE.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Sześćdziesiąt jednostek na całą zajezdnię. Każde odmrożenie jest nieodwracalne. To nie jest ograniczenie techniczne, Dexo — to definicja priorytetu.', en: 'Sixty units for the entire yard. Every thaw is irreversible. This is not a technical limitation, Dexo — it is the definition of priority.' }, mode: 'dialogue' },
    ],
  },

  // Dispatcher D-2 — dreams in timetables
  'm2-dispatcher-d2': {
    id: 'm2-dispatcher-d2',
    lines: [
      { speaker: 'Dispatcher D-2', text: { pl: 'Jednostka Dispatcher D-2 Kolektywu VOID. Cykli bezczynności: osiemset czterdzieści siedem. Liczę je na głos, bo cisza w dyspozytorni jest gorsza. Czy przynosi pan... rozkład?', en: 'Unit Dispatcher D-2 of the VOID Collective. Idle cycles: eight hundred and forty-seven. I count them aloud, because silence in a dispatch office is worse. Do you bring... a timetable?' }, mode: 'dialogue' },
      { speaker: 'Dispatcher D-2', text: { pl: 'Uprzedzam: pustych rozkładów nie prowadzę. Rozkład bez kursu to tylko tabela. Proszę o łańcuch kamieni z rejestru — kolejność, koszty, efekt każdego etapu. Wtedy poprowadzę.', en: 'Fair warning: I do not run empty timetables. A timetable without a run is just a table. Bring me a milestone chain from the registry — order, costs, the effect of every stage. Then I will dispatch.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Robot, który śni o rozkładach jazdy. I pomyśleć, że to wciąż nie jest najdziwniejsza rzecz, jaką tu widziałem.', en: 'A robot that dreams in timetables. And to think that is still not the strangest thing I have seen here.' }, mode: 'monologue' },
    ],
  },
  'm2-dispatcher-d2-done': {
    id: 'm2-dispatcher-d2-done',
    lines: [
      { speaker: 'Dispatcher D-2', text: { pl: 'Łańcuch BETA: prowadzę. Semafor działa, Alpha wozi, dok przyjmuje. Licznik bezczynności: skasowany. Proszę wybaczyć... [bufor] ...to dużo emocji jak na jeden cykl.', en: 'BETA chain: dispatching. The semaphore works, Alpha hauls, the dock receives. Idle counter: reset. Please excuse me... [buffer] ...that is a lot of emotion for one cycle.' }, mode: 'dialogue' },
    ],
  },

  // Stoker B-6 — the heat-budget creed
  'm2-stoker-b6': {
    id: 'm2-stoker-b6',
    lines: [
      { speaker: 'Stoker B-6', text: { pl: 'Jednostka Stoker B-6 Kolektywu VOID, strażnik pieca. Ciepło to budżet. Wydajesz raz. Powtórzę wolniej, bo wszyscy słyszą, a nikt nie słucha: wy-da-jesz raz.', en: 'Unit Stoker B-6 of the VOID Collective, warden of the furnace. Heat is a budget. You spend it once. I will repeat that slowly, because everyone hears it and no one listens: you spend it once.' }, mode: 'dialogue' },
      { speaker: 'Stoker B-6', text: { pl: 'Przychodzili tu z listami życzeń długimi jak tor do doku. Odmrozić wszystko, oświetlić wszystko, ogrzać wszystko. Piec nie zna słowa „wszystko". Piec zna liczbę: sześćdziesiąt.', en: 'They used to come here with wish lists as long as the dock track. Thaw everything, light everything, heat everything. The furnace does not know the word "everything". The furnace knows a number: sixty.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cała lekcja MVP w jednym robocie z piecem. Zapamiętaj go, Dexo.', en: 'The entire MVP lesson in one robot with a furnace. Remember this one, Dexo.' }, mode: 'dialogue' },
    ],
  },
  'm2-stoker-b6-done': {
    id: 'm2-stoker-b6-done',
    lines: [
      { speaker: 'Stoker B-6', text: { pl: 'Pięćdziesiąt z sześćdziesięciu. Dziesięć jednostek w rezerwie. Pierwszy klient od 847 cykli, który wyszedł z pieca z resztą. Uszanowanie.', en: 'Fifty out of sixty. Ten units in reserve. The first customer in 847 cycles to walk away from the furnace with change. Respect.' }, mode: 'dialogue' },
    ],
  },

  // East door — explicit unlock condition
  'm2-drafting-locked': {
    id: 'm2-drafting-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Przejście do Kreślarni. Otworzy się, gdy zajezdnia ruszy: Nawigator musi wyznaczyć w Earth HQ łańcuch kamieni milowych — misja przy konsoli kamieni po wschodniej stronie zajezdni.', en: 'The passage to the Drafting Hall. It opens once the yard moves: the Navigator must set the milestone chain at Earth HQ — the mission starts at the milestone console on the east side of the yard.' }, mode: 'dialogue' },
    ],
  },

  // MVP milestones exam — completion and revisit
  'm2-exam-mvp-milestones-done': {
    id: 'm2-exam-mvp-milestones-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: KAMIENIE MILOWE MVP — PRZYZNANY', en: 'OPERATOR CERTIFICATE: MVP MILESTONES — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Mały zakres, jawna kolejność, wartość na każdym etapie. B-6 zgodziłby się z każdym punktem — a to najwyższa znana mi rekomendacja.', en: 'Small scope, explicit order, value at every step. B-6 would endorse every point — and that is the highest recommendation I know.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zdałem egzamin z oszczędzania. Moja babcia byłaby dumna.', en: 'I passed an exam in frugality. My grandmother would be proud.' }, mode: 'monologue' },
    ],
  },
  'm2-exam-mvp-milestones-already': {
    id: 'm2-exam-mvp-milestones-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat „Kamienie milowe MVP" już przyznany.', en: 'Certificate "MVP Milestones" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Quest completion — the first thing to move in 847 cycles
  'm2-mvp-milestones-complete': {
    id: 'm2-mvp-milestones-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Wyznacz kamienie milowe MVP', en: 'HQ MISSION COMPLETE: Set the MVP Milestones' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'ŁAŃCUCH BETA PRZYJĘTY. Odmrażanie wg kolejności: semafor... tram Alpha... pierwszy kurs.', en: 'BETA CHAIN ACCEPTED. Thawing in order: semaphore... tram Alpha... first run.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Semafor mrugnął. Alpha drgnęła. Coś się tu rusza — pierwszy raz od ośmiuset czterdziestu siedmiu cykli patrzę, jak ta baza robi cokolwiek.', en: 'The semaphore blinked. Alpha stirred. Something is moving here — for the first time in eight hundred and forty-seven cycles, I am watching this base do anything at all.' }, mode: 'dialogue' },
      { speaker: 'Dispatcher D-2', text: { pl: 'Kurs pierwszy: Alpha do doku. Odjazd. ODJAZD! Proszę mi wybaczyć głośność. Czekałem.', en: 'Run one: Alpha to the dock. Departure. DEPARTURE! Forgive the volume. I have been waiting.' }, mode: 'dialogue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Odebrane na Odyssey. Bloczek się zgadza. Potwierdzam łańcuch — Moreau. I gratuluję: słychać było, jak ten dyspozytor się cieszy, dwa pokłady dalej.', en: 'Received aboard Odyssey. The pad checks out. Chain confirmed — Moreau. And congratulations: you could hear that dispatcher celebrating two decks away.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '/plan — dopisano sekcję: KAMIENIE MILOWE. DRZWI WSCHODNIE: ODBLOKOWANE.', en: '/plan — section added: MILESTONES. EAST DOOR: UNLOCKED.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Plan ma teraz etapy i pierwszy z nich właśnie dowiózł rudę. Następny krok: architektura operacji. Kreślarnia, na wschód.', en: 'The plan now has stages, and the first one just delivered ore. Next step: the operation\'s architecture. The Drafting Hall, east.' }, mode: 'dialogue' },
    ],
  },
};
