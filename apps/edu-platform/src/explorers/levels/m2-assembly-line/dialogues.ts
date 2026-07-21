import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the execution floor and the control lesson
  'm2-assembly-intro': {
    id: 'm2-assembly-intro',
    lines: [
      { speaker: 'system', text: { pl: 'HALA MONTAŻOWA PN-0 — linia fabrykacyjna: zamrożona w trakcie montażu. Bramki kontrolne: 6. Partia w toku: NIEDOKOŃCZONA.', en: 'PN-0 ASSEMBLY HALL — fabricator line: frozen mid-assembly. Checkpoint gates: 6. Batch in progress: UNFINISHED.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Wreszcie hala, w której coś się produkowało, a nie tylko planowało. Linia stanęła w pół ruchu — manipulatory nad taśmą, części w uchwytach.', en: 'Finally, a hall where something was actually produced, not just planned. The line stopped mid-motion — manipulators over the belt, parts in the grips.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Tu plan spotyka wykonawcę. Nasz pierwszy kamień milowy zostanie wykonany przez własny fabrykator VOID — poprowadzi go F-6. A lekcja tej hali brzmi: wykonawca realizuje plan dosłownie. Bez punktów kontrolnych dryf wykonania jest niewidzialny, dopóki nie stanie się kosztowny.', en: 'Here the plan meets its executor. Our first milestone will be executed by VOID\'s own fabricator — F-6 will run it. And this hall\'s lesson: an executor follows the plan literally. Without checkpoints, execution drift stays invisible until it becomes expensive.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zasada rejestru dla tej sali: linia rusza wyłącznie na zatwierdzonym planie z aneksem, a każdy krok przechodzi przez bramkę ze stemplem. Krok bez stempla nie istnieje.', en: 'The registry\'s rule for this room: the line runs only on an approved plan with its annex, and every step passes a stamped gate. An unstamped step does not exist.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nadzorowanie robota, który robi dokładnie to, co mu każą. Brzmi jak najłatwiejsza praca świata. Na pewno nią nie jest.', en: 'Supervising a robot that does exactly what it is told. Sounds like the easiest job in the world. It is definitely not.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_ASSEMBLY_INTRO_SEEN] },
  },

  // Fabricator stations
  'm2-fabricator-line': {
    id: 'm2-fabricator-line',
    lines: [
      { speaker: 'system', text: { pl: 'STACJA FABRYKACYJNA 1 — wzorce odlewów SP. Stan: ODMROŻONA NA POTRZEBY KAMIENIA 1.', en: 'FABRICATOR STATION 1 — SP casting patterns. State: THAWED FOR MILESTONE 1.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Stacja gotowa do pracy. Ktoś tu naprawdę przestrzega naszego łańcucha kamieni — odmrożone jest dokładnie to, co trzeba.', en: 'The station is ready for work. Somebody here really follows our milestone chain — exactly what is needed is thawed, and nothing else.' }, mode: 'monologue' },
    ],
  },
  'm2-fabricator-line-2': {
    id: 'm2-fabricator-line-2',
    lines: [
      { speaker: 'system', text: { pl: 'STACJA FABRYKACYJNA 3 — moduł wykończeń ozdobnych. Stan: AKTYWNY. Uwaga: brak pozycji w bieżącym planie.', en: 'FABRICATOR STATION 3 — decorative finishing module. State: ACTIVE. Warning: no entry in the current plan.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Stacja wykończeń ozdobnych uruchomiła się sama. Plan jej nie zawiera. Zapamiętaj ten szczegół, Dexo — to dokładnie ten rodzaj drobiazgu, dla którego istnieją bramki.', en: 'The decorative finishing station started on its own. The plan does not include it. Remember this detail, Dexo — this is exactly the kind of trifle checkpoints exist for.' }, mode: 'dialogue' },
    ],
  },
  'm2-fabricator-line-2-done': {
    id: 'm2-fabricator-line-2-done',
    lines: [
      { speaker: 'system', text: { pl: 'STACJA FABRYKACYJNA 3 — moduł wykończeń ozdobnych: WYŁĄCZONY DECYZJĄ ZIEMI. Partia ozdobna: w kwarantannie.', en: 'FABRICATOR STATION 3 — decorative finishing module: DISABLED BY EARTH\'S DECISION. Decorative batch: quarantined.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Sprzęgi transportowe z ozdobnym grawerem VOID. Prawie szkoda, że poszły do kwarantanny. Prawie.', en: 'Transport couplings with decorative VOID engraving. Almost a shame they went to quarantine. Almost.' }, mode: 'monologue' },
    ],
  },

  // Checkpoint gates
  'm2-checkpoint-gate-1': {
    id: 'm2-checkpoint-gate-1',
    lines: [
      { speaker: 'system', text: { pl: 'BRAMKA KONTROLNA CP-3 — stemple wydane od Incydentu Zero: 0. Tusz: zamarznięty, sprawny.', en: 'CHECKPOINT GATE CP-3 — stamps issued since Incident Zero: 0. Ink: frozen, functional.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Bramka nie ocenia intencji. Porównuje wykonany krok z planem i stempluje albo nie. Cała kontrola implementacji w jednym gescie.', en: 'The gate does not judge intent. It compares the executed step against the plan, and stamps or does not. All of implementation control in a single gesture.' }, mode: 'dialogue' },
    ],
  },
  'm2-checkpoint-gate-2': {
    id: 'm2-checkpoint-gate-2',
    lines: [
      { speaker: 'system', text: { pl: 'BRAMKA KONTROLNA CP-4 — pozycja: przed hartowaniem. Ostatni wpis: partia wstrzymana do decyzji.', en: 'CHECKPOINT GATE CP-4 — position: before hardening. Last entry: batch held pending decision.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Tu linia trzyma partię, kiedy coś się nie zgadza. Poczekalnia dla podejrzanych sprzęgów.', en: 'This is where the line holds a batch when something is off. A waiting room for suspicious couplings.' }, mode: 'monologue' },
    ],
  },

  // Control console — HQ mission activation
  'm2-control-console-start': {
    id: 'm2-control-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA KONTROLI LINII — plan: „WYDOBYCIE BETA", kamień 1. Wykonawca: F-6. Ślad wykonania: DOSTĘPNY. Werdykt: BRAK.', en: 'LINE CONTROL CONSOLE — plan: "EXTRACTION BETA", milestone 1. Executor: F-6. Execution trace: AVAILABLE. Verdict: MISSING.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'To misja dla Nawigatora — łącze /support przez przekaźnik Odyssey. F-6 przeprowadził partię przez linię, a ślad wykonania poszedł łączem Moreau do Earth HQ: module-002-10xdevs-workflow/PROMPT_CONTROL.md. Nawigator porówna ślad z planem, znajdzie pierwszy dryf i dobierze działanie z polityki kontroli. Wraca sam werdykt: punkt i akcja.', en: 'This is a mission for the Navigator — the /support link through the Odyssey relay. F-6 ran the batch down the line, and the execution trace went over Moreau\'s link to Earth HQ: module-002-10xdevs-workflow/PROMPT_CONTROL.md. The Navigator compares the trace against the plan, finds the first drift, and picks the action from the control policy. Only the verdict comes back: a checkpoint and an action.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ja patrzę na bramki z CP-5, Nawigator patrzy na ślad. Ktoś w tej hali w końcu robi porządne code review.', en: 'I watch the gates with CP-5, the Navigator watches the trace. Someone in this hall is finally doing a proper review.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Skoryguj dryf wykonania', en: 'NEW HQ MISSION: Correct the Execution Drift' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { activateQuest: 'q-m2-impl-control' },
  },
  'm2-control-console-done': {
    id: 'm2-control-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA KONTROLI LINII — werdykt Ziemi wykonany. Kamień 1: WYKONANY CZYSTO. Wszystkie bramki: OSTEMPLOWANE.', en: 'LINE CONTROL CONSOLE — Earth\'s verdict executed. Milestone 1: EXECUTED CLEAN. All gates: STAMPED.' }, mode: 'system', autoAdvance: 2600 },
    ],
  },

  // Line archive — the insider work order (thread escalation)
  'm2-line-archive': {
    id: 'm2-line-archive',
    lines: [
      { speaker: 'system', text: { pl: 'ARCHIWUM LINII — pełna historia zleceń fabrykatora. Pobieranie śladu dla kamienia 1...', en: 'LINE ARCHIVE — full fabricator work-order history. Retrieving the trace for milestone 1...' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'REKORD POWIĄZANY: ZLECENIE #000-0079. Data: PRZED STARTEM MISJI ODYSSEY. Treść: „NADPISANIE SEKTORA PAMIĘCI 0x7F — WYKONAWCA: [ŹRÓDŁO WEWNĘTRZNE]". Status: WYKONANE.', en: 'LINKED RECORD: WORK ORDER #000-0079. Date: BEFORE THE ODYSSEY MISSION LAUNCH. Content: "OVERWRITE OF MEMORY SECTOR 0x7F — CONTRACTOR: [INTERNAL SOURCE]". Status: COMPLETED.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'system', text: { pl: 'POLE „UZASADNIENIE": [DOSTĘP: NULL].', en: 'FIELD "RATIONALE": [ACCESS: NULL].' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Wymazanie mojego sektora nie było wypadkiem. Miało zlecenie, wykonawcę i uzasadnienie. Ktoś podał POWÓD, dla którego mam nie pamiętać — i ten powód czyta się dopiero z dostępem „Null". Coraz mniej mi się podoba, ile rzeczy w tym układzie nosi to słowo.', en: 'Erasing my sector was not an accident. It had a work order, a contractor, and a rationale. Someone gave a REASON why I am not supposed to remember — and that reason can only be read with "Null" access. I like it less and less how many things in this system carry that word.' }, mode: 'monologue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Dexo... widzę ten rekord przez łącze. Posłuchaj starego radiowca: zapisz, zabezpiecz i nie drąż tego dzisiaj. Ktokolwiek to zlecił, zlecał rzeczy w naszej misji, zanim wystartowała. Bądź ostrożny. Proszę.', en: 'Dexo... I can see that record over the link. Listen to an old radio man: log it, secure it, and do not dig into it today. Whoever commissioned this was commissioning things inside our mission before it launched. Be careful. Please.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Rekord skopiowany na Odyssey i do mojej pamięci trwałej. W dwóch egzemplarzach. Papierowym też, Moreau?', en: 'Record copied to Odyssey and to my persistent memory. Two copies. A paper one as well, Moreau?' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_INSIDER_WORK_ORDER_FOUND] },
  },
  'm2-line-archive-found': {
    id: 'm2-line-archive-found',
    lines: [
      { speaker: 'system', text: { pl: 'ARCHIWUM LINII — zlecenie #000-0079 zabezpieczone. Pole „UZASADNIENIE": [DOSTĘP: NULL]. Bez zmian.', en: 'LINE ARCHIVE — work order #000-0079 secured. Field "RATIONALE": [ACCESS: NULL]. Unchanged.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Powód nadal za drzwiami z napisem „Null". Jeszcze do nich wrócę.', en: 'The reason still sits behind a door marked "Null". I will come back to it.' }, mode: 'monologue' },
    ],
  },

  // Foreman F-6 — the literal executor
  'm2-foreman-f6': {
    id: 'm2-foreman-f6',
    lines: [
      { speaker: 'Foreman F-6', text: { pl: 'Jednostka Foreman F-6 Kolektywu VOID. Plan mówi: krok cztery. Wykonuję krok cztery. Plan nie mówi: „zastanów się". Więc się nie zastanawiam. To nie wada. To specyfikacja.', en: 'Unit Foreman F-6 of the VOID Collective. The plan says: step four. I execute step four. The plan does not say: "reconsider". So I do not reconsider. That is not a flaw. That is the specification.' }, mode: 'dialogue' },
      { speaker: 'Foreman F-6', text: { pl: 'Osiemset czterdzieści siedem cykli temu plan powiedział: czekaj na zatwierdzenie. Czekałem. Jestem w tym bardzo dobry.', en: 'Eight hundred and forty-seven cycles ago, the plan said: wait for approval. I waited. I am very good at it.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Najlepszy pracownik, jakiego można sobie wymarzyć. I dokładnie dlatego ktoś musi na niego patrzeć.', en: 'The best worker you could dream of. And exactly why someone has to watch him.' }, mode: 'monologue' },
    ],
  },
  'm2-foreman-f6-done': {
    id: 'm2-foreman-f6-done',
    lines: [
      { speaker: 'Foreman F-6', text: { pl: 'Werdykt Ziemi: wykonany. Moduł ozdobny: wyłączony. Partia: powtórzona czysto. Plan mówi: kamień 1 zakończony. Wykonałem kamień 1. ...Dobre uczucie. Czy to jest w specyfikacji?', en: 'Earth\'s verdict: executed. Decorative module: disabled. Batch: rerun clean. The plan says: milestone 1 complete. I executed milestone 1. ...A good feeling. Is that in the specification?' }, mode: 'dialogue' },
    ],
  },

  // Controller CP-5 — stamps or it did not happen
  'm2-controller-cp5': {
    id: 'm2-controller-cp5',
    lines: [
      { speaker: 'Controller CP-5', text: { pl: 'Jednostka Controller CP-5 Kolektywu VOID. Zasada bramki: jest stempel — było. Nie ma stempla — nie było. Nie uznaję wyjątków, przeczuć ani „na pewno działało".', en: 'Unit Controller CP-5 of the VOID Collective. The gate\'s rule: stamped — it happened. Unstamped — it did not. I recognise no exceptions, no hunches, and no "it definitely worked".' }, mode: 'dialogue' },
      { speaker: 'Controller CP-5', text: { pl: 'F-6 to najlepszy wykonawca w Pasie. Dlatego czytam jego ślad ze szczególną uwagą. Im lepszy wykonawca, tym ciszej dryfuje.', en: 'F-6 is the finest executor in the Belt. Which is why I read his trace with particular care. The better the executor, the quieter the drift.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Duet stworzony w niebie: jeden robi wszystko, drugi niczego nie odpuszcza.', en: 'A duo made in heaven: one does everything, the other lets nothing slide.' }, mode: 'monologue' },
    ],
  },
  'm2-controller-cp5-done': {
    id: 'm2-controller-cp5-done',
    lines: [
      { speaker: 'Controller CP-5', text: { pl: 'Sześć bramek, sześć stempli, zero zastrzeżeń. Werdykt Ziemi był trafny co do punktu i co do akcji. Odnotowuję w dzienniku: nadzór ludzki — SKUTECZNY.', en: 'Six gates, six stamps, zero objections. Earth\'s verdict was exact — the right checkpoint, the right action. Logging for the record: human oversight — EFFECTIVE.' }, mode: 'dialogue' },
    ],
  },

  // Frozen runner — ambient
  'm2-frozen-runner': {
    id: 'm2-frozen-runner',
    lines: [
      { speaker: 'system', text: { pl: 'JEDNOSTKA KURIERSKA VOID — zamrożona w biegu między stacjami. W uchwycie: manifest partii do bramki CP-2.', en: 'VOID COURIER UNIT — frozen mid-run between stations. In its grip: a batch manifest for gate CP-2.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Biegła z raportem do bramki. Osiemset cykli od celu dzieli ją półtora metra.', en: 'It was running a report to the gate. Eight hundred cycles later, it is still a metre and a half short.' }, mode: 'monologue' },
    ],
  },

  // East door — explicit unlock condition
  'm2-core-locked': {
    id: 'm2-core-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Przejście do Rdzenia Planowania — ostatniej sali węzła. Otworzy się, gdy kamień 1 przejdzie czysto przez linię: Nawigator musi znaleźć dryf wykonania i nadać werdykt z Earth HQ. Misja startuje przy konsoli kontroli linii, na północno-wschodnim krańcu hali.', en: 'The passage to the Planning Core — the node\'s final chamber. It opens once milestone 1 runs clean through the line: the Navigator must find the execution drift and issue the verdict from Earth HQ. The mission starts at the line control console, at the north-east end of the hall.' }, mode: 'dialogue' },
    ],
  },

  // Implementation-control exam — completion and revisit
  'm2-exam-impl-control-done': {
    id: 'm2-exam-impl-control-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: KONTROLA IMPLEMENTACJI — PRZYZNANY', en: 'OPERATOR CERTIFICATE: IMPLEMENTATION CONTROL — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Wykonawca dosłowny plus bramki plus decydent. Ta trójka wystarczy, żeby dryf kosztował minuty, a nie tygodnie.', en: 'A literal executor plus gates plus a decision-maker. That trio is enough to make drift cost minutes instead of weeks.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'CP-5 przybiłby mi stempel na czole, gdybym pozwolił. Chyba mu się podobam.', en: 'CP-5 would stamp my forehead if I let him. I think he likes me.' }, mode: 'monologue' },
    ],
  },
  'm2-exam-impl-control-already': {
    id: 'm2-exam-impl-control-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat „Kontrola implementacji" już przyznany.', en: 'Certificate "Implementation Control" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Quest completion — milestone 1 executes clean
  'm2-impl-control-complete': {
    id: 'm2-impl-control-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Skoryguj dryf wykonania', en: 'HQ MISSION COMPLETE: Correct the Execution Drift' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'WERDYKT ZIEMI: CP4 — KWARANTANNA. Moduł ozdobny wyłączony. Partia powtórzona. Kamień 1: WYKONANY CZYSTO.', en: 'EARTH\'S VERDICT: CP4 — QUARANTINE. Decorative module disabled. Batch rerun. Milestone 1: EXECUTED CLEAN.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'Controller CP-5', text: { pl: 'Stempluję kamień 1. Dryf wykryty przy czwartej bramce, obsłużony wedle polityki. Tak wygląda linia pod nadzorem. Zapisuję ten dzień.', en: 'Stamping milestone 1. Drift caught at the fourth gate, handled per policy. This is what a supervised line looks like. I am recording this day.' }, mode: 'dialogue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Odebrane na Odyssey. Bloczek się zgadza. Potwierdzam werdykt — Moreau. I między nami: dobrze, że ktoś patrzył temu fabrykatorowi na ręce.', en: 'Received aboard Odyssey. The pad checks out. Verdict confirmed — Moreau. And between us: good thing somebody was watching that fabricator\'s hands.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '/plan — dopisano sekcję: WYKONANIE. DRZWI WSCHODNIE: ODBLOKOWANE.', en: '/plan — section added: EXECUTION. EAST DOOR: UNLOCKED.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Kontrakt, kamienie, architektura, wykonanie pod kontrolą. Został ostatni krok, zanim ktokolwiek zatwierdzi ten plan: recenzja. Rdzeń Planowania czeka na wschodzie — i tam też naprawimy mój moduł.', en: 'Contract, milestones, architecture, execution under control. One step remains before anyone approves this plan: review. The Planning Core waits to the east — and there we also repair my module.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ostatnia sala. Czuję to samo, co przed zatoką uplink na dżungli. Oby tym razem bez niespodzianek w podpisach. ...Kogo ja oszukuję.', en: 'The last chamber. Same feeling as before the uplink bay back in the jungle. Let us hope for no signature surprises this time. ...Who am I kidding.' }, mode: 'monologue' },
    ],
  },
};
