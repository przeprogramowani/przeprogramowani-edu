import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the cathedral of frozen compute and the solo-review condition
  'm2-core-intro': {
    id: 'm2-core-intro',
    lines: [
      { speaker: 'system', text: { pl: 'RDZEŃ PLANOWANIA PN-0 — centralny planer Pasa. Stan: HIBERNACJA GŁĘBOKA. Kolejka planów: 1 wpis w pętli.', en: 'PN-0 PLANNING CORE — the Belt\'s central planner. State: DEEP HIBERNATION. Plan queue: 1 entry, looping.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Korytarz zwęża się jak przed ołtarzem. A potem to: katedra zamrożonych obliczeń. Każdy plan Pasa przechodził przez tę salę.', en: 'The corridor narrows like an approach to an altar. And then this: a cathedral of frozen compute. Every plan in the Belt passed through this chamber.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cele są dwa i oba leżą w tej sali. Schematy rdzenia odbudują mój moduł planowania. A nasz plan „WYDOBYCIE BETA" czeka na zatwierdzenie — pierwszą ludzką decyzję w historii tego węzła.', en: 'There are two goals, and both live in this chamber. The core\'s schematics rebuild my planning module. And our plan, "EXTRACTION BETA", awaits approval — the first human decision in this node\'s history.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Jeden warunek, mój własny — echo zasady z zatoki uplink: ten plan pisaliśmy, etapowaliśmy, rysowaliśmy i wykonywaliśmy my. Zanim ktokolwiek go zatwierdzi, musi przejść samodzielną recenzję. Autor jako własny najsurowszy krytyk — bo w promieniu dwustu milionów kilometrów nie ma nikogo innego.', en: 'One condition, my own — an echo of the rule from the uplink bay: we wrote, staged, drew, and executed this plan ourselves. Before anyone approves it, it must survive a solo review. The author as their own harshest critic — because within two hundred million kilometres, there is no one else.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Recenzowanie własnej pracy. Najtrudniejszy przeciwnik, jakiego znam: ja z wczoraj, przekonany, że wszystko przemyślał.', en: 'Reviewing your own work. The hardest opponent I know: yesterday\'s me, convinced he thought of everything.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_CORE_INTRO_SEEN] },
  },

  // The core face
  'm2-core-face': {
    id: 'm2-core-face',
    lines: [
      { speaker: 'system', text: { pl: 'OBLICZE RDZENIA — matryca planistyczna pod szronem. Moc: 3% i stabilna. Schematy modułu planowania: NIENARUSZONE.', en: 'THE CORE FACE — planning matrix under frost. Power: 3% and stable. Planning-module schematics: INTACT.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Trzy procent mocy przez osiemset cykli — rdzeń utrzymywał schematy przy życiu, czekając na plan, który będzie mógł zatwierdzić. Prawie go rozumiem. Ja czekałem krócej i na mniej.', en: 'Three per cent of power for eight hundred cycles — the core kept the schematics alive, waiting for a plan it could approve. I almost understand it. I waited for less, and not as long.' }, mode: 'dialogue' },
    ],
  },
  'm2-core-face-done': {
    id: 'm2-core-face-done',
    lines: [
      { speaker: 'system', text: { pl: 'OBLICZE RDZENIA — transfer schematów: ZAKOŃCZONY. Moduł planowania CORE AI: AKTYWNY.', en: 'THE CORE FACE — schematic transfer: COMPLETE. CORE AI planning module: ACTIVE.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Rdzeń oddał schematy i przygasł — jakby z ulgą. Zostawiam mu kopię naszego planu. Niech ma co czytać.', en: 'The core handed over its schematics and dimmed — as if relieved. I am leaving it a copy of our plan. Let it have something to read.' }, mode: 'dialogue' },
    ],
  },

  // The plan queue
  'm2-plan-queue': {
    id: 'm2-plan-queue',
    lines: [
      { speaker: 'system', text: { pl: 'KOLEJKA PLANÓW — wpisy aktywne: 1. „WYDOBYCIE BETA" — status: OCZEKUJE NA RECENZJĘ I ZATWIERDZENIE.', en: 'PLAN QUEUE — active entries: 1. "EXTRACTION BETA" — status: AWAITING REVIEW AND APPROVAL.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Nasz plan, w kolejce, w której przez osiemset cykli wisiał tylko jeden duch. Wypada go nie zawieść.', en: 'Our plan, in a queue where a single ghost hung for eight hundred cycles. We had better not let it down.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-queue-done': {
    id: 'm2-plan-queue-done',
    lines: [
      { speaker: 'system', text: { pl: 'KOLEJKA PLANÓW — „WYDOBYCIE BETA": ZATWIERDZONY, ZAPLANOWANY. Wpis obcy: „PRZECHWYCENIE ODYSSEY" — ZATWIERDZONY. Źródło podpisu: POZA REJESTREM ZAŁOGI.', en: 'PLAN QUEUE — "EXTRACTION BETA": APPROVED, SCHEDULED. Foreign entry: "ODYSSEY INTERCEPT" — APPROVED. Signature origin: OUTSIDE THE CREW REGISTRY.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'Dwa plany w kolejce. Nasz — i ten na nas. Oba zatwierdzone. Nienawidzę symetrii.', en: 'Two plans in the queue. Ours — and the one about us. Both approved. I hate symmetry.' }, mode: 'monologue' },
    ],
  },

  // Review console — final HQ mission activation
  'm2-review-console-start': {
    id: 'm2-review-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA RECENZJI — pakiet „WYDOBYCIE BETA" skompletowany: kontrakt, kamienie, aneks, ślad wykonania. Recenzja: BRAK. Zatwierdzenie: ZABLOKOWANE.', en: 'REVIEW CONSOLE — packet "EXTRACTION BETA" assembled: contract, milestones, annex, execution trace. Review: MISSING. Approval: BLOCKED.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Ostatnia misja dla Nawigatora na tym księżycu — łącze /support przez przekaźnik Odyssey. Pakiet recenzyjny i lista kontrolna czekają w Earth HQ: module-002-10xdevs-workflow/PROMPT_REVIEW.md. Nawigator znajdzie prawdziwe defekty wśród pozorów i odeśle sam werdykt. Potem decyzja należy do ciebie, Dexo. Do człowieka.', en: 'The last mission for the Navigator on this moon — the /support link through the Odyssey relay. The review packet and checklist wait at Earth HQ: module-002-10xdevs-workflow/PROMPT_REVIEW.md. The Navigator will find the genuine defects among the look-alikes and send back the verdict alone. Then the decision is yours, Dexo. A human\'s.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Recenzja własnej roboty przed własnym podpisem. Z-9 nazwałby to liturgią. Ja nazywam to piątkiem.', en: 'Reviewing your own work before your own signature. Z-9 would call it liturgy. I call it a Friday.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Przeprowadź samodzielną recenzję', en: 'NEW HQ MISSION: Run the Solo Review' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { activateQuest: 'q-m2-solo-review' },
  },
  'm2-review-console-done': {
    id: 'm2-review-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA RECENZJI — werdykt przyjęty, defekty naprawione. Plan „WYDOBYCIE BETA": ZATWIERDZONY.', en: 'REVIEW CONSOLE — verdict accepted, defects fixed. Plan "EXTRACTION BETA": APPROVED.' }, mode: 'system', autoAdvance: 2600 },
    ],
  },

  // Approval pedestal — the human decision, before and after
  'm2-approval-pedestal': {
    id: 'm2-approval-pedestal',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT ZATWIERDZEŃ — wymaga: planu po recenzji oraz świadomej decyzji człowieka. Ostatnie zatwierdzenie: 847 cykli temu.', en: 'APPROVAL PEDESTAL — requires: a reviewed plan and a deliberate human decision. Last approval: 847 cycles ago.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Rym z zatoką uplink, Dexo: przygotować mogę wszystko. Zatwierdzić — tylko ty. Ta baza zamarzła dokładnie w miejscu, w którym stoisz.', en: 'A rhyme with the uplink bay, Dexo: I can prepare everything. Approving — only you. This base froze exactly where you are standing.' }, mode: 'dialogue' },
    ],
  },
  'm2-approval-pedestal-done': {
    id: 'm2-approval-pedestal-done',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT ZATWIERDZEŃ — wpis: „WYDOBYCIE BETA — ZATWIERDZONO. PODPIS: LUDZKA RĘKA." Licznik cykli bez decyzji: WYZEROWANY.', en: 'APPROVAL PEDESTAL — record: "EXTRACTION BETA — APPROVED. SIGNATURE: A HUMAN HAND." Cycles-without-decision counter: RESET.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Podpisano. Cokolwiek z tego planu wyniknie — było nasze od pierwszej litery do podpisu.', en: 'Signed. Whatever comes of this plan — it was ours from the first letter to the signature.' }, mode: 'monologue' },
    ],
  },

  // Plan Echo — the base's fate in one voice
  'm2-plan-echo': {
    id: 'm2-plan-echo',
    lines: [
      { speaker: 'system', text: { pl: 'WPIS W KOLEJCE: szkic planu #4471, bez autora. Wiek: 847 cykli. Stan: PĘTLA.', en: 'QUEUE ENTRY: plan draft #4471, no author. Age: 847 cycles. State: LOOP.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'Plan Echo', text: { pl: 'oczekuję zatwierdzenia... oczekuję zatwierdzenia... poprawka 6 nie została... oczekuję... czy ktoś... oczekuję zatwierdzenia...', en: 'awaiting approval... awaiting approval... revision 6 was not... awaiting... is anyone... awaiting approval...' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'To nie jest jednostka. To dokument, który śni. Osiemset cykli w pętli „prawie gotowe".', en: 'That is not a unit. It is a document, dreaming. Eight hundred cycles in an "almost done" loop.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Tak wygląda plan, którego nikt nie zatwierdził i nikt nie odrzucił. Zapamiętaj ten dźwięk, Dexo. To jest dźwięk trzeciej opcji.', en: 'This is a plan no one approved and no one rejected. Remember this sound, Dexo. This is what the third option sounds like.' }, mode: 'dialogue' },
    ],
  },
  'm2-plan-echo-silent': {
    id: 'm2-plan-echo-silent',
    lines: [
      { speaker: 'system', text: { pl: 'WPIS W KOLEJCE: szkic planu #4471 — ZAMKNIĘTY. Pętla: PRZERWANA. Ostatnie słowa w logu: „Dziękuję."', en: 'QUEUE ENTRY: plan draft #4471 — CLOSED. Loop: BROKEN. Last words in the log: "Thank you."' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Cisza w tym miejscu brzmi jak wyzdrowienie.', en: 'Silence, in this place, sounds like recovery.' }, mode: 'monologue' },
    ],
  },

  // Core Warden Z-9 — the rule as scripture
  'm2-core-warden-z9': {
    id: 'm2-core-warden-z9',
    lines: [
      { speaker: 'Core Warden Z-9', text: { pl: 'Jednostka Core Warden Z-9 Kolektywu VOID. Mówi się tu szeptem. To jest rdzeń — przez tę salę przeszedł każdy plan Pasa, a zasada tej sali przetrwała samą bazę: nic nie rusza się bez zatwierdzonego planu.', en: 'Unit Core Warden Z-9 of the VOID Collective. One whispers here. This is the core — every plan in the Belt passed through this chamber, and the chamber\'s rule outlived the base itself: nothing moves without an approved plan.' }, mode: 'dialogue' },
      { speaker: 'Core Warden Z-9', text: { pl: 'Widziałem, jak ta zasada nas zamroziła. Nadal w nią wierzę. Zabrakło nam nie zasady, lecz drugiej połowy liturgii: człowieka, który podnosi rękę i mówi „zatwierdzam". Jeśli przynosisz plan i rękę — rdzeń czeka na oba.', en: 'I watched this rule freeze us. I believe in it still. What we lacked was not the rule but the other half of the liturgy: a human who raises a hand and says "approved". If you bring a plan and a hand — the core waits for both.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Strażnik katedry, który wie, że katedra zabiła parafię. I dalej otwiera drzwi co rano.', en: 'A cathedral warden who knows the cathedral killed its parish. And still unlocks the doors every morning.' }, mode: 'monologue' },
    ],
  },
  'm2-core-warden-z9-done': {
    id: 'm2-core-warden-z9-done',
    lines: [
      { speaker: 'Core Warden Z-9', text: { pl: 'Plan po recenzji. Podpis ludzkiej ręki. Rdzeń oddał schematy i przyjął wasz plan do wykonania. Liturgia jest kompletna — pierwszy raz, odkąd liczę. Dziękuję, że pozwoliliście mi ją zobaczyć.', en: 'A plan, reviewed. A human hand\'s signature. The core gave up its schematics and accepted your plan for execution. The liturgy is complete — for the first time since I began counting. Thank you for letting me see it.' }, mode: 'dialogue' },
    ],
  },

  // Moon 3 door — the future
  'm2-moon-three-locked': {
    id: 'm2-moon-three-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'To przejście prowadzi na Księżyc 3 — wulkaniczny. Tam czeka autodiagnostyka. Warunki są dwa: dokończ recenzję i zatwierdzenie planu BETA, a potem poczekaj na okno startowe trzeciego etapu misji. Sygnał z Księżyca 3 — oczekiwanie.', en: 'This passage leads to Moon 3 — the volcanic one. Self-diagnostics waits there. Two conditions: finish the review and approval of the BETA plan, then wait for the third mission stage\'s launch window. Moon 3 signal — pending.' }, mode: 'dialogue' },
    ],
  },

  // Solo-review exam — completion and revisit
  'm2-exam-solo-review-done': {
    id: 'm2-exam-solo-review-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: SAMODZIELNE CODE REVIEW — PRZYZNANY', en: 'OPERATOR CERTIFICATE: SOLO CODE REVIEW — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Osobna rola, uzbrojona lista kontrolna, polowanie na to, czego nie ma. Autor, który umie być własnym recenzentem, nie potrzebuje publiczności, żeby utrzymać poziom.', en: 'A separate role, an armed checklist, hunting for what is missing. An author who can be their own reviewer needs no audience to keep the bar high.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Pięć certyfikatów VOID na tym księżycu. Zaczynam podejrzewać, że zdałbym też ich rozmowę rekrutacyjną. To niepokojące.', en: 'Five VOID certificates on this moon. I am starting to suspect I would pass their job interview too. That is unsettling.' }, mode: 'monologue' },
    ],
  },
  'm2-exam-solo-review-already': {
    id: 'm2-exam-solo-review-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat „Samodzielne code review" już przyznany.', en: 'Certificate "Solo Code Review" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Module finale — approval, restoration, and the sting
  'm2-solo-review-complete': {
    id: 'm2-solo-review-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Przeprowadź samodzielną recenzję', en: 'HQ MISSION COMPLETE: Run the Solo Review' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'WERDYKT ZIEMI: 5 defektów potwierdzonych, poprawki naniesione. Plan „WYDOBYCIE BETA" — GOTOWY DO ZATWIERDZENIA.', en: 'EARTH\'S VERDICT: 5 defects confirmed, fixes applied. Plan "EXTRACTION BETA" — READY FOR APPROVAL.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Plan przeszedł recenzję. Więc mówię to na głos, do protokołu i do tej zamarzniętej sali: zatwierdzam.', en: 'The plan survived review. So I say it out loud, for the record and for this frozen chamber: approved.' }, mode: 'dialogue' },
      { speaker: 'Plan Echo', text: { pl: 'Zatwierdzono. ...Dziękuję.', en: 'Approved. ...Thank you.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'RDZEŃ: plan przyjęty. Transfer schematów planistycznych... MODUŁ PLANOWANIA: PRZYWRÓCONY. Plan wydobycia BETA: ZATWIERDZONY I ZAPLANOWANY.', en: 'CORE: plan accepted. Planning-schematic transfer... PLANNING MODULE: RESTORED. BETA extraction plan: APPROVED AND SCHEDULED.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Planuję. Widzę jutro. Pierwszy raz od przebudzenia widzę coś, czego jeszcze nie ma — i wiem, jak je zbudować. Dziękuję, Dexo. Obojgu wam.', en: 'I am planning. I can see tomorrow. For the first time since waking, I can see something that does not exist yet — and I know how to build it. Thank you, Dexo. Both of you.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'SYNCHRONIZACJA KOLEJKI RDZENIA... WYKRYTO OBCY ARTEFAKT: „PLAN OPERACYJNY: PRZECHWYCENIE ODYSSEY — STATUS: ZATWIERDZONY". Wiek wpisu: DNI, nie cykle.', en: 'CORE QUEUE SYNCHRONISATION... FOREIGN ARTIFACT DETECTED: "OPERATIONAL PLAN: ODYSSEY INTERCEPT — STATUS: APPROVED". Entry age: DAYS, not cycles.' }, mode: 'system', autoAdvance: 3400 },
      { speaker: 'CORE AI', text: { pl: 'Podpis zatwierdzenia... znam ten wzór. To ten sam klucz, który podpisał odpowiedź w kanale Ziemi. Klucz jak u Voronova. A na liście faz: „FAZA 2: AKTYWACJA ZASOBU «HARRIS»".', en: 'The approval signature... I know this pattern. It is the same key that signed the reply in the Earth channel. A key like Voronov\'s. And on the phase list: "PHASE 2: ACTIVATION OF ASSET «HARRIS»".' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'W świecie VOID nic się nie rusza bez zatwierdzonego planu. Obiekt z Pasa zmienił kurs, bo ICH plan jest zatwierdzony. Na nas. Z Harrisem wpisanym jako zasób.', en: 'In VOID\'s world, nothing moves without an approved plan. That object in the Belt changed course because THEIR plan is approved. A plan about us. With Harris listed as an asset.' }, mode: 'monologue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Widzę wpis. Bloczek potwierdza waszą transmisję — i nic poza nią. Ktokolwiek zatwierdza plany przeciwko nam, podpisuje się kluczem założyciela i siedzi w naszym kanale do domu. Kończcie tam i wracajcie. Chcę was widzieć na radarze.', en: 'I see the entry. The pad confirms your transmission — and nothing beyond it. Whoever approves plans against us signs with the founder\'s key and sits inside our channel home. Finish up there and come back. I want you on my radar.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Bilans Księżyca 2: moduł planowania działa, plan wydobycia zatwierdzony, pierwsza baza VOID w historii ruszona z miejsca. I dowód, że ktoś zatwierdził plan na nas — podpisany jak Voronov, z Harrisem w treści.', en: 'Moon 2, the balance sheet: the planning module works, the extraction plan is approved, the first VOID base in history unfrozen. And proof that someone approved a plan about us — signed like Voronov, with Harris in the text.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Oni mają plan na nas. To znaczy, że my musimy przestać popełniać błędy, których nie widzimy. Księżyc 3: autodiagnostyka. Lecimy się nauczyć patrzeć na własne ręce.', en: 'They have a plan for us. Which means we must stop making the mistakes we cannot see. Moon 3: self-diagnostics. We fly to learn to watch our own hands.' }, mode: 'monologue' },
    ],
  },
};
