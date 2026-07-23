import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — rows of service robots frozen in charging cradles
  'm2-service-intro': {
    id: 'm2-service-intro',
    lines: [
      { speaker: 'system', text: { pl: 'HALA SERWISOWA — rzędy jednostek w gniazdach ładowania. Ruch: żaden.', en: 'SERVICE BAY — rows of units in charging cradles. Motion: none.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Roboty. Dziesiątki. Każdy zamarznięty w połowie gestu, twarzą do własnego zadania. Ten kadr za bardzo przypomina komorę hibernacyjną Odyssey. Nie powiem tego głośno.', en: 'Robots. Dozens. Each frozen mid-gesture, facing its own task. This frame looks too much like the Odyssey hibernation deck. I will not say it out loud.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Jeden z nich stoi twarzą do wyjścia, jakby zamarzł w pół kroku do zadania. To pierwsza maszyna tej fabryki. Wciąż wierna planowi, który dawno umarł.', en: 'One of them faces the exit, as if frozen mid-step toward a task. That is this factory\'s first machine. Still faithful to a plan that died long ago.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Terminal serwisowy działa. Prowadzę was stąd, z wartowni. Tę jednostkę naprawia się rozkazem, Dexo — sprzęt jest sprawny, brakuje jej tylko wykonalnego planu.', en: 'The service terminal works. I guide you from here, from the guardhouse. You fix that unit with an order, Dexo — the hardware is fine, it just lacks an executable plan.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_SERVICE_INTRO_SEEN] },
  },

  // Service terminal — quest hub (logs + release-key riddle)
  'm2-service-terminal-start': {
    id: 'm2-service-terminal-start',
    lines: [
      { speaker: 'system', text: { pl: 'TERMINAL SERWISOWY — online. Kolejka hali: jedno zlecenie, licznik prób rośnie.', en: 'SERVICE TERMINAL — online. Bay queue: one order, attempt counter rising.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Żeby wydać jednostce nowy rozkaz, potrzebujesz pełnego harmonogramu hali. Zrzut zachował zadania i ich wymagania, ale zatarł kolejność. Istnieje dokładnie jeden porządek, w którym wszystko da się wykonać.', en: 'To issue the unit a new order, you need the full bay schedule. The dump kept the tasks and their requirements but wiped the order. There is exactly one sequence in which everything can be executed.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli śledzę zależności i układam zadania w jedyny wykonalny ciąg. Podam go przez /solve.', en: 'So I trace the dependencies and lay the tasks into the only executable sequence. I will enter it via /solve.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Nowy Rozkaz — odtwórz kolejność wykonania z zależności, podaj przez /solve.', en: '◆ NEW MISSION: New Order — reconstruct the execution order from the dependencies, enter via /solve.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m2-new-order' },
  },
  'm2-service-terminal-post': {
    id: 'm2-service-terminal-post',
    lines: [
      { speaker: 'system', text: { pl: 'TERMINAL SERWISOWY: kolejka wyczyszczona. Jedno gniazdo ładowania — puste.', en: 'SERVICE TERMINAL: queue cleared. One charging cradle — empty.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Sopel ruszył w głąb fabryki. Kolejka pusta, gniazdo puste. Dobra pustka — pierwsza od czasu zamrożenia.', en: 'Sopel moved deeper into the factory. Empty queue, empty cradle. A good emptiness — the first since the freeze.' }, mode: 'dialogue' },
    ],
  },

  // Queue board — the loop made visible before the word is spoken
  'm2-queue-board': {
    id: 'm2-queue-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA KOLEJKI ZADAŃ — 1 zlecenie aktywne. Prób: 1 407 219 i rośnie.', en: 'TASK-QUEUE BOARD — 1 order active. Attempts: 1,407,219 and rising.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Jedno zlecenie. Milion czterysta tysięcy prób. Licznik przeskakuje, kiedy patrzę. Ta maszyna próbowała wykonać to samo zadanie przez lata i za każdym razem odbijała się od ściany.', en: 'One order. A million four hundred thousand attempts. The counter ticks over while I watch. This machine has tried to run the same task for years and bounced off a wall every time.' }, mode: 'dialogue' },
    ],
  },

  'm2-queue-board-cleared': {
    id: 'm2-queue-board-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA KOLEJKI ZADAŃ — 0 zleceń aktywnych. Licznik prób: zatrzymany.', en: 'TASK-QUEUE BOARD — 0 orders active. Attempt counter: stopped.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Licznik stanął na milionie czterystu tysiącach. Nic już nie odbija się od ściany.', en: 'The counter stopped at a million four hundred thousand. Nothing bounces off a wall any more.' }, mode: 'dialogue' },
    ],
  },

  // S-0PL — the frozen unit facing the exit
  'm2-s0pl-frozen': {
    id: 'm2-s0pl-frozen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Jednostka S-0PL. Zamarznięta w pół kroku do wyjścia, jakby szła po zadanie, którego nigdy nie mogła skończyć. Dioda statusu tli się słabo. Ktoś tam jeszcze jest.', en: 'Unit S-0PL. Frozen mid-step toward the exit, as if walking to a task it could never finish. The status light glows faintly. Someone is still in there.' }, mode: 'monologue' },
    ],
  },
  'm2-s0pl-empty': {
    id: 'm2-s0pl-empty',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Gniazdo S-0PL — puste. Sopel jest teraz na głębszych mapach, przy pracy. Miło popatrzeć na puste miejsce, które kiedyś było więzieniem.', en: 'S-0PL\'s cradle — empty. Sopel is on the deeper maps now, at work. It is good to look at an empty spot that was once a cell.' }, mode: 'monologue' },
    ],
  },

  // Charging-cradle rows — the crew that cannot wake
  'm2-bot-row': {
    id: 'm2-bot-row',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rząd jednostek w gniazdach. Wszystkie w połowie gestu, wszystkie ciche. Nie znajduję na nich awarii. One po prostu czekają na rozkaz, który nigdy nie przyszedł.', en: 'A row of units in cradles. All mid-gesture, all silent. I find nothing wrong with them. They are simply waiting for an order that never came.' }, mode: 'monologue' },
    ],
  },

  // Derailed tram — flavour landmark
  'm2-derailed-tram': {
    id: 'm2-derailed-tram',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik serwisowy, wykolejony tuż przy wjeździe. Przewrócił się w połowie kursu i już nikt go nie podniósł. Zostawię go — mam pilniejszego robota do obudzenia.', en: 'A service tram, derailed right by the entrance. It tipped mid-run and no one ever set it right. I will leave it — I have a more urgent robot to wake.' }, mode: 'monologue' },
    ],
  },

  // Sopel — return-path escort detach (spawns only with M2_PLANNING_ONLINE)
  'm2-sopel-return': {
    id: 'm2-sopel-return',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Zadanie eskorty: zakończone. Odłączam się tutaj. Moja kolejka po raz pierwszy od lat ma więcej niż jedną pozycję.', en: 'Escort task: complete. I detach here. My queue has more than one item for the first time in years.' }, mode: 'dialogue' },
      { speaker: 'Sopel', text: { pl: 'Odbudowa huty. Krok 1 z 4812. — To dużo kroków, Dexo. Ale wszystkie są wykonalne. Sprawdziłem każdy.', en: 'Foundry rebuild. Step 1 of 4,812. — That is a lot of steps, Dexo. But all of them are executable. I checked each one.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Idź, Sopel. Masz plan. To więcej, niż mieliśmy tu wszyscy przez długi czas.', en: 'Go, Sopel. You have a plan. That is more than any of us had here for a long time.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the spoken doctrine trial, naming, and the endless-task sting
  'q-m2-new-order-complete': {
    id: 'q-m2-new-order-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ HARMONOGRAM PRZYJĘTY. Kolejka S-0PL: odblokowana.', en: '◆ SCHEDULE ACCEPTED. S-0PL queue: unlocked.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Mogę nadpisać kolejkę robota zdalnie. Rekomenduję pełną automatyzację.', en: 'I can overwrite the robot\'s queue remotely. I recommend full automation.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Przygotuj rozkaz. Wydam go ja.', en: 'Prepare the order. I will issue it.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'S-0PL: rozruch. Jednostka próbuje starej pętli — jedno uderzenie serca — i przyjmuje nowy plan.', en: 'S-0PL: booting. The unit tries the old loop — one heartbeat — and accepts the new plan.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'Moreau', text: { pl: 'S-zero-P-L? — Sopel. Niech zostanie Sopel.', en: 'S-zero-P-L? — Sopel. Icicle. Let it stay Sopel.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Analiza starej pętli: zlecenie było niewykonywalne z konstrukcji. Do kolejki wstrzyknięto zależność cykliczną — zadanie, które czeka samo na siebie. Nie wyłączyli ich. Dali im zadanie bez końca.', en: 'Analysis of the old loop: the order was unexecutable by construction. A cyclic dependency was injected into the queue — a task that waits on itself. They did not switch them off. They gave them a task without an end.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ Sopel dołącza do wyprawy. GRÓDŹ DO ROZJAZDOWNI: odblokowana.', en: '◆ Sopel joins the expedition. BULKHEAD TO THE JUNCTION: unlocked.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_ENDLESS_TASK_FOUND] },
  },

  // Exam VII — Protokół VII
  'm2-exam-protocol-7-done': {
    id: 'm2-exam-protocol-7-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ VII — „ARCHITEKT I WYKONAWCA": zaliczony.', en: 'PROTOCOL VII — "ARCHITECT AND EXECUTOR": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Siódmy protokół odzyskany: kto układa plan, nie poprawia go w trakcie kroku. Jeden rozkaz, jedno zadanie, jasne kryterium końca, weryfikacja tego, co wraca. Wykonawca zrobi dokładnie to, co w rozkazie — także twój błąd.', en: 'Seventh protocol recovered: whoever lays the plan does not patch it mid-step. One order, one task, a clear end criterion, verification of what comes back. The executor does exactly what the order says — your mistake included.' }, mode: 'dialogue' },
    ],
  },
  'm2-exam-protocol-7-already': {
    id: 'm2-exam-protocol-7-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół VII już zaliczony.', en: 'Protocol VII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked deadlock door — needs a working service unit
  'm2-deadlock-door-locked': {
    id: 'm2-deadlock-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'GRÓDŹ DO ROZJAZDOWNI: zamknięta. Brak sprawnej jednostki serwisowej.', en: 'BULKHEAD TO THE JUNCTION: closed. No working service unit.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Nie otworzę sieci torów bez działającej jednostki serwisowej. Wydaj S-0PL nowy rozkaz — wtedy gródź ustąpi.', en: 'I will not open the rail network without a working service unit. Issue S-0PL its new order — then the bulkhead yields.' }, mode: 'dialogue' },
    ],
  },

  // Return path — service arms lifting units out of cradles in schedule order
  'm2-return-service': {
    id: 'm2-return-service',
    lines: [
      { speaker: 'system', text: { pl: 'WARSZTAT — POWRÓT', en: 'THE SERVICE BAY — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ramiona serwisowe podnoszą jednostki z gniazd — jedną po drugiej, w kolejności harmonogramu. Hala budzi się rzędami, nie naraz. Tak, jak trzeba.', en: 'Service arms lift units out of the cradles — one by one, in schedule order. The bay wakes in rows, not all at once. The way it should.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'CORE AI', text: { pl: 'Teraz każdy z nich ma rozkaz, który da się skończyć. Cała naprawa polegała na tym, żeby dać im wykonalny plan.', en: 'Now each of them has an order that can be finished. The whole repair was giving them a workable plan.' }, mode: 'cinematic', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M2_RETURN_SERVICE_SEEN] },
  },
};
