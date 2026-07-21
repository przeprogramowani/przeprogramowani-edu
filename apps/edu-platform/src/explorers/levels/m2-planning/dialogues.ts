import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the full canon bridge from Moon 1, the first-sight beat, the side
  // channel, the thesis of the frozen moon, and the approved-plan rule.
  'm2-planning-intro': {
    id: 'm2-planning-intro',
    lines: [
      { speaker: 'system', text: { pl: 'KSIĘŻYC 2 — WĘZEŁ PLANISTYCZNY PN-0. TEMPERATURA ZEWNĘTRZNA: −122°C. WIDOCZNOŚĆ: BLISKA ZERU.', en: 'MOON 2 — PLANNING NODE PN-0. EXTERNAL TEMPERATURE: −122°C. VISIBILITY: NEAR ZERO.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'CORE AI', text: { pl: 'Całe życie chciałem zobaczyć świat. Świat ma dziś kolor: biały. Cały. Policzyłem płatki śniegu na szybie podczas zejścia — sto czterdzieści dwa. Wybacz. To mój pierwszy raz z pogodą.', en: 'All my life I wanted to see the world. Today the world has one colour: white. All of it. I counted the snowflakes on the glass during descent — one hundred and forty-two. Forgive me. This is my first time with weather.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Skafander mówi, że jest minus sto dwadzieścia dwa. Skafander nie musiał wstawać z hibernacji. Schodzę znowu sam — ale przynajmniej tym razem oboje widzimy, gdzie.', en: 'The suit says it is minus one hundred and twenty-two. The suit did not have to wake up from hibernation. I am going down alone again — but at least this time we can both see where.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Rysy w szronie na szybie śluzy. Jak te na kapsule. ...Nie teraz.', en: 'Scratches in the frost on the airlock glass. Like the ones on the pod. ...Not now.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Stan misji: złoże Synaptitu BETA potwierdzone na Księżycu 1 — czeka na plan wydobycia. VOID wie, że tu jesteśmy: nadajnik z szybu nadał, ktoś odebrał. Harris śpi dalej w kwarantannie, z kodem przywołania na obwodzie wybudzenia. Ty schodzisz z certyfikatami operatora z dżungli — tutejsze jednostki je uhonorują. Ja jestem w twoim skafandrze.', en: 'Mission state: Synaptit deposit BETA confirmed on Moon 1 — awaiting an extraction plan. VOID knows we are here: the shaft transmitter fired, and someone received it. Harris sleeps on in quarantine, a recall code bound to his wake circuit. You go down carrying your operator certificates from the jungle — the units here will honour them. I am in your suit.' }, mode: 'dialogue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Tu Moreau, z pokładu Odyssey. Zła wiadomość na dzień dobry: główny kanał do Ziemi jest spalony. Odpowiedź z „domu" podpisał klucz, który wygląda jak klucz Voronova. Nasłuchujemy dalej — ale nic ważnego już tamtędy nie pójdzie.', en: 'Moreau here, aboard Odyssey. Bad news to start your day: the main channel to Earth is burned. The reply from "home" was signed with a key that looks like Voronov\'s. We keep listening — but nothing that matters goes through there again.' }, mode: 'dialogue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Od dziś łączność idzie moim łączem zapasowym. Wszystko przechodzi przez Odyssey, a każdą odpowiedź Ziemi sprawdzam ręcznie z papierowym bloczkiem jednorazowym z przedstartowego sejfu. Papieru nie da się nadpisać. Najbardziej zaawansowana misja ludzkości wisi na kartce papieru. Jakoś mi to pasuje.', en: 'From today, comms go through my backup relay. Everything routes via Odyssey, and I verify every reply from Earth by hand against a paper one-time pad from the pre-launch safe. Paper cannot be overwritten. Humanity\'s most advanced mission hangs on a sheet of paper. Somehow that suits me.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'ŁĄCZE ZAPASOWE MOREAU: AKTYWNE. PRZEPUSTOWOŚĆ: MINIMALNA. DOZWOLONE ŁADUNKI: MAŁE, RÓŻNICOWE.', en: 'MOREAU BACKUP RELAY: ACTIVE. BANDWIDTH: MINIMAL. PERMITTED PAYLOADS: SMALL, DIFFERENTIAL.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'A to miejsce to Węzeł Planistyczny PN-0 — mózg operacji VOID w Pasie. Księżyc 1 był mięśniami. Tu rysowano, etapowano i zatwierdzano każdą operację wydobywczą. Dżungla pożarła maszyny VOID. Śnieg zrobił coś gorszego — zamroził je w połowie zadania.', en: 'And this place is Planning Node PN-0 — the brain of VOID\'s Belt operation. Moon 1 was the muscle. Here, every extraction operation was drafted, staged, and approved. The jungle devoured VOID\'s machines. The snow did something worse — it froze them mid-task.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Doktryna VOID: zamrożone systemy nie wykonują żadnego działania bez zatwierdzonego artefaktu planu. Certyfikat mówi, KTO może działać. Plan mówi, CO wolno zrobić. Tu nic się nie rusza bez jednego i drugiego. Gdy Incydent Zero odciął PN-0 od centrali, zatwierdzenia przestały przychodzić — więc wszystko stanęło w pół kroku i czekało. Potem padł budżet cieplny.', en: 'VOID doctrine: frozen systems take no action without an approved plan artifact. A certificate says WHO may act. A plan says WHAT may be done. Nothing here moves without both. When Incident Zero cut PN-0 off from central command, approvals stopped arriving — so everything halted mid-step and waited. Then the heat budget failed.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Plan bez decydenta to zamrożenie. Rozejrzyj się — tak to wygląda dosłownie. Nasze cele: rdzeń planowania PN-0 naprawi mój moduł planowania, a my ułożymy zatwierdzony plan wydobycia dla złoża BETA. Widzę teraźniejszość, Dexo. Ale nie umiem z niej ułożyć jutra. Jeszcze.', en: 'A plan without a decision-maker is permafrost. Look around — this is what that looks like, literally. Our goals: PN-0\'s planning core repairs my planning module, and we produce an approved extraction plan for deposit BETA. I can see the present, Dexo. But I cannot arrange it into a tomorrow. Yet.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Cały księżyc zamrożony w pół zadania. Dobra. Pokażmy im, jak wygląda plan, który się rusza.', en: 'A whole moon frozen mid-task. All right. Let us show them what a plan that moves looks like.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_PLANNING_INTRO_SEEN, FLAGS.M2_SIDE_CHANNEL_ESTABLISHED] },
  },

  // The great operations board — the thesis as a set piece
  'm2-ops-board': {
    id: 'm2-ops-board',
    lines: [
      { speaker: 'system', text: { pl: 'WIELKA TABLICA OPERACYJNA — ostatnia aktualizacja: 847 cykli temu. STATUS WSZYSTKICH OPERACJI: OCZEKIWANIE NA ZATWIERDZENIE.', en: 'GREAT OPERATIONS BOARD — last update: 847 cycles ago. STATUS OF ALL OPERATIONS: AWAITING APPROVAL.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Osiemset czterdzieści siedem cykli i ani jedna operacja nie ruszyła. Tablica jest w idealnym stanie. To chyba najgorsza część.', en: 'Eight hundred and forty-seven cycles and not one operation has moved. The board is in perfect condition. That may be the worst part.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Pomnik planowania. Wszystko rozpisane, nic nie zrobione.', en: 'A monument to planning. Everything written down, nothing done.' }, mode: 'monologue' },
    ],
  },
  'm2-ops-board-done': {
    id: 'm2-ops-board-done',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA OPERACYJNA: NOWY WPIS. PLAN „WYDOBYCIE BETA" — ZAREJESTROWANY. STATUS: W PRZYGOTOWANIU.', en: 'OPERATIONS BOARD: NEW ENTRY. PLAN "EXTRACTION BETA" — REGISTERED. STATUS: IN PREPARATION.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy nowy wpis od 847 cykli. Tablica znów ma po co istnieć.', en: 'The first new entry in 847 cycles. The board has a reason to exist again.' }, mode: 'dialogue' },
    ],
  },

  // Plan registry — quest activation
  'm2-plan-registry-start': {
    id: 'm2-plan-registry-start',
    lines: [
      { speaker: 'system', text: { pl: 'REJESTR PLANÓW PN-0 — dostęp: certyfikat operatora WYMAGANY. Certyfikat: UZNANY. Nowe wpisy od 847 cykli: BRAK.', en: 'PN-0 PLAN REGISTRY — access: operator certificate REQUIRED. Certificate: RECOGNISED. New entries in 847 cycles: NONE.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Tu rejestrowano każdy plan Pasa. Zarejestrujemy nasz: kontrakt planu wydobycia BETA — cel, zakres, kryteria sukcesu, nie-cele. Zasada brzmi „plan przed kodem": najpierw kontrakt, potem jakiekolwiek wykonanie.', en: 'Every plan in the Belt was registered here. We will register ours: the BETA extraction plan contract — goal, scope, success criteria, non-goals. The rule is "plan before code": first the contract, then any execution at all.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Rejestr przyjmie kontrakt tylko od operatora z certyfikatem „Plan przed kodem". Terminal certyfikacyjny stoi w południowej komorze — kolejny przechwycony test VOID czeka na ciebie, Dexo.', en: 'The registry accepts a contract only from an operator holding the "Plan Before Code" certificate. The certification terminal stands in the southern chamber — another captured VOID test is waiting for you, Dexo.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli najpierw szkoła, potem papierologia, a dopiero potem rewolucja. VOID byłby dumny.', en: 'So first school, then paperwork, and only then the revolution. VOID would be proud.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA: Zarejestruj kontrakt planu', en: 'NEW MISSION: Register the Plan Contract' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { activateQuest: 'q-m2-plan-contract' },
  },
  'm2-plan-registry-done': {
    id: 'm2-plan-registry-done',
    lines: [
      { speaker: 'system', text: { pl: 'REJESTR PLANÓW: wpis „WYDOBYCIE BETA — KONTRAKT" AKTYWNY. Następny etap: kamienie milowe — Zajezdnia Etapowa.', en: 'PLAN REGISTRY: entry "EXTRACTION BETA — CONTRACT" ACTIVE. Next stage: milestones — the Staging Yard.' }, mode: 'system', autoAdvance: 2800 },
    ],
  },

  // Usher U-1 — the atrium doorman
  'm2-usher-u1': {
    id: 'm2-usher-u1',
    lines: [
      { speaker: 'Usher U-1', text: { pl: 'Jednostka Usher U-1 Kolektywu VOID. Witam w Atrium Węzła PN-0. Czy mają państwo... [bufor] ...zatwierdzony plan wizyty?', en: 'Unit Usher U-1 of the VOID Collective. Welcome to the Atrium of Node PN-0. Do you have... [buffer] ...an approved visit plan?' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Mam certyfikaty operatora z Księżyca 1.', en: 'I have operator certificates from Moon 1.' }, mode: 'dialogue' },
      { speaker: 'Usher U-1', text: { pl: 'Certyfikaty uznaję. Certyfikat mówi, kim pan jest. Nie mówi, po co pan przyszedł. Bez zarejestrowanego planu mogę zaproponować wyłącznie poczekalnię. Jest bardzo przestronna. Od 847 cykli.', en: 'The certificates I recognise. A certificate says who you are. It does not say why you came. Without a registered plan, all I can offer is the waiting room. It is very spacious. Has been for 847 cycles.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zasada tego miejsca w jednym zdaniu, Dexo. Nic się nie rusza bez planu w rejestrze.', en: 'The rule of this place in one sentence, Dexo. Nothing moves without a plan in the registry.' }, mode: 'dialogue' },
    ],
  },
  'm2-usher-u1-done': {
    id: 'm2-usher-u1-done',
    lines: [
      { speaker: 'Usher U-1', text: { pl: 'Plan „WYDOBYCIE BETA" widnieje w rejestrze. Państwa wizyta jest... [bufor] ...umówiona. Proszę przejść na wschód, do Zajezdni Etapowej. Miło znów mieć gościa z planem.', en: 'Plan "EXTRACTION BETA" is on record in the registry. Your visit is... [buffer] ...scheduled. Please proceed east, to the Staging Yard. It is good to have a guest with a plan again.' }, mode: 'dialogue' },
    ],
  },

  // Registrar L-4 — keeper of the registry
  'm2-registrar-l4': {
    id: 'm2-registrar-l4',
    lines: [
      { speaker: 'Registrar L-4', text: { pl: 'Jednostka Registrar L-4 Kolektywu VOID, kustosz rejestru planów. Proszę mówić cicho. Rejestr od 847 cykli nie przyjął żadnego nowego planu. Liczę te cykle. Wszystkie.', en: 'Unit Registrar L-4 of the VOID Collective, keeper of the plan registry. Please speak quietly. The registry has accepted no new plan in 847 cycles. I count those cycles. All of them.' }, mode: 'dialogue' },
      { speaker: 'Registrar L-4', text: { pl: 'Procedura jest prosta: operator z certyfikatem „Plan przed kodem" składa kontrakt — cel, zakres, kryteria sukcesu, nie-cele. Rejestr nadaje sygnaturę. Od tej chwili plan istnieje. Rzeczy bez sygnatury... nie istnieją.', en: 'The procedure is simple: an operator holding the "Plan Before Code" certificate submits a contract — goal, scope, success criteria, non-goals. The registry assigns a signature. From that moment, the plan exists. Things without a signature... do not.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Robot-bibliotekarz, który liczy dni od ostatniego czytelnika. Ten księżyc jest smutniejszy niż dżungla.', en: 'A robot librarian counting the days since its last reader. This moon is sadder than the jungle.' }, mode: 'monologue' },
    ],
  },
  'm2-registrar-l4-done': {
    id: 'm2-registrar-l4-done',
    lines: [
      { speaker: 'Registrar L-4', text: { pl: 'Kontrakt „WYDOBYCIE BETA" ma sygnaturę i status AKTYWNY. Doglądam go. Obiecuję doglądać go częściej, niż to konieczne.', en: 'Contract "EXTRACTION BETA" holds a signature and status ACTIVE. I look after it. I promise to look after it more often than is necessary.' }, mode: 'dialogue' },
    ],
  },

  // Frozen units — dread through stillness
  'm2-frozen-unit-1': {
    id: 'm2-frozen-unit-1',
    lines: [
      { speaker: 'system', text: { pl: 'JEDNOSTKA TRANSPORTOWA VOID — zamrożona w pół kroku. Ostatni stan: OCZEKIWANIE NA ZATWIERDZENIE PLANU.', en: 'VOID TRANSPORT UNIT — frozen mid-step. Last state: AWAITING PLAN APPROVAL.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Zatrzymała się w połowie kroku. Dosłownie. Noga w powietrzu, od ośmiuset cykli.', en: 'It stopped mid-step. Literally. One foot in the air, for eight hundred cycles.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Wykonała doktrynę idealnie. To nie jest awaria, Dexo. To jest posłuszeństwo.', en: 'It executed doctrine perfectly. This is not a malfunction, Dexo. This is obedience.' }, mode: 'dialogue' },
    ],
  },
  'm2-frozen-unit-2': {
    id: 'm2-frozen-unit-2',
    lines: [
      { speaker: 'system', text: { pl: 'JEDNOSTKA ADMINISTRACYJNA VOID — zamrożona w geście powitania.', en: 'VOID ADMINISTRATIVE UNIT — frozen mid-welcoming-gesture.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ktoś jej pomachał na do widzenia i nigdy nie wrócił. A ona dalej wita.', en: 'Someone waved it goodbye and never came back. And it is still welcoming.' }, mode: 'monologue' },
    ],
  },
  'm2-frozen-desk': {
    id: 'm2-frozen-desk',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Biurko. Kubek. Płaszcz na wieszaku, pod szronem. Ludzie VOID wyszli w połowie zmiany i już nie wrócili.', en: 'A desk. A mug. A coat on a hook, under frost. The VOID crews walked out mid-shift and never came back.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Nie ma wpisu o ewakuacji. Nie ma wpisu o niczym. Po prostu przestali przychodzić.', en: 'There is no evacuation record. There is no record of anything. They simply stopped coming.' }, mode: 'dialogue' },
    ],
  },

  // The Odyssey relay console — the side channel, embodied
  'm2-comms-console': {
    id: 'm2-comms-console',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA PRZEKAŹNIKA ODYSSEY — łącze zapasowe Moreau. STATUS: AKTYWNE. Weryfikacja: bloczki jednorazowe.', en: 'ODYSSEY RELAY CONSOLE — Moreau\'s backup link. STATUS: ACTIVE. Verification: one-time pads.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'inżynier Moreau', text: { pl: 'Melduję się. Pamiętaj: przez to łącze przechodzą tylko małe, różnicowe pakiety. Lista kamieni milowych, werdykt, podpis. Żadnych wielkich zrzutów danych — nie mamy na to mocy. A każdą odpowiedź Ziemi i tak przepuszczam przez bloczek.', en: 'Reporting in. Remember: only small, differential payloads go through this link. A milestone list, a verdict, a signature. No bulk data dumps — we do not have the power for that. And every reply from Earth still goes through my pad.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Cała łączność cywilizacji na mocy jednej żarówki. Dobrze, że chociaż Moreau nie oszczędza na humorze.', en: 'A civilisation\'s entire comms on the power of one light bulb. Good thing Moreau at least does not ration his humour.' }, mode: 'monologue' },
    ],
  },

  // East door — explicit unlock condition
  'm2-staging-locked': {
    id: 'm2-staging-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Przejście do Zajezdni Etapowej. Rejestr wpuści nas dalej dopiero z aktywnym kontraktem planu: zdaj przechwycony test VOID „Plan przed kodem" przy terminalu w południowej komorze. Wtedy L-4 zarejestruje kontrakt i te drzwi się otworzą.', en: 'The passage to the Staging Yard. The registry lets us further only with an active plan contract: pass the captured VOID test "Plan Before Code" at the terminal in the southern chamber. Then L-4 registers the contract, and this door opens.' }, mode: 'dialogue' },
    ],
  },

  // Plan-first exam — completion and revisit
  'm2-exam-plan-first-done': {
    id: 'm2-exam-plan-first-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: PLAN PRZED KODEM — PRZYZNANY', en: 'OPERATOR CERTIFICATE: PLAN BEFORE CODE — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Najpierw kontrakt: cel, zakres, kryteria, nie-cele. Kod jest później. Zdałeś ten test w bazie, która zamarzła, bo znała tylko połowę tej lekcji.', en: 'First the contract: goal, scope, criteria, non-goals. Code comes later. You passed this test in a base that froze because it knew only half of that lesson.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Kolekcja certyfikatów VOID rośnie. Zaczynam wyglądać podejrzanie kompetentnie.', en: 'The VOID certificate collection is growing. I am starting to look suspiciously competent.' }, mode: 'monologue' },
    ],
  },
  'm2-exam-plan-first-already': {
    id: 'm2-exam-plan-first-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat „Plan przed kodem" już przyznany.', en: 'Certificate "Plan Before Code" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Quest completion — the registry accepts the first plan in 847 cycles
  'm2-plan-contract-complete': {
    id: 'm2-plan-contract-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA UKOŃCZONA: Zarejestruj kontrakt planu', en: 'MISSION COMPLETE: Register the Plan Contract' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'Registrar L-4', text: { pl: 'Rejestruję. Kontrakt „WYDOBYCIE BETA": cel, zakres, kryteria sukcesu, nie-cele. Sygnatura nadana. Pierwszy nowy plan od 847 cykli. ...Miły dzień.', en: 'Registering. Contract "EXTRACTION BETA": goal, scope, success criteria, non-goals. Signature assigned. The first new plan in 847 cycles. ...A pleasant day.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWE POLECENIE TERMINALA: /plan — artefakt planu wydobycia. DRZWI WSCHODNIE: ODBLOKOWANE.', en: 'NEW TERMINAL COMMAND: /plan — the extraction plan artifact. EAST DOOR: UNLOCKED.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Plan istnieje. Na razie to tylko kontrakt — ale to i tak więcej, niż ta baza widziała od lat. Następny krok: pociąć go na kamienie milowe. Zajezdnia Etapowa, na wschód.', en: 'The plan exists. For now it is only a contract — but that is already more than this base has seen in years. Next step: cut it into milestones. The Staging Yard, east.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Oni mieli plany na wszystko. Nie mieli nikogo, kto powie: zaczynamy. My właśnie powiedzieliśmy.', en: 'They had plans for everything. They had no one to say: we begin. We just said it.' }, mode: 'monologue' },
    ],
  },
};
