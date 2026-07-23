import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Study notes whiteboard — opens external resource
  'm0-study-notes-board': {
    id: 'm0-study-notes-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA SZKOLENIOWA — Notatki do egzaminów', en: 'TRAINING BOARD — Exam Notes' }, mode: 'system', autoAdvance: 2500 },
      {
        speaker: 'system',
        text: { pl: 'Notatki pomogą ci odświeżyć pamięć, zaliczyć egzaminy i przystąpić do głównej misji.', en: 'The notes will help you refresh your memory, pass the exams, and begin the main mission.' },
        mode: 'system',
        autoAdvance: 2500,
      },
      { speaker: 'astronaut', text: { pl: 'Ktoś przygotował te materiały na wypadek utraty pamięci... Skąd wiedzieli?', en: 'Someone prepared these materials in case of memory loss... How did they know?' }, mode: 'monologue' },
    ],
    onComplete: {
      setFlags: [FLAGS.CMDS_BOOKMARKS],
      addBookmark: {
        url: '/explorers/resources/m0-study-notes',
        title: { pl: 'Notatki szkoleniowe', en: 'Training notes' },
        afterDialogue: 'm0-bookmarks-unlocked',
      },
    },
  },

  // Follow-up after first bookmark preview is closed
  'm0-bookmarks-unlocked': {
    id: 'm0-bookmarks-unlocked',
    lines: [
      {
        speaker: 'astronaut',
        text: { pl: 'To się może jeszcze przydać... dodaję do zakładek!', en: 'This might come in handy... adding to bookmarks!' },
        mode: 'monologue',
      },
      { speaker: 'system', text: { pl: '▸ Nowy moduł terminala: /bookmarks', en: '▸ New terminal module: /bookmarks' }, mode: 'system', autoAdvance: 3000 },
    ],
  },

  // Study notes board revisit — just opens the bookmark, no follow-up
  'm0-study-notes-board-revisit': {
    id: 'm0-study-notes-board-revisit',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA SZKOLENIOWA — Notatki do egzaminów', en: 'TRAINING BOARD — Exam Notes' }, mode: 'system', autoAdvance: 2500 },
    ],
    onComplete: {
      addBookmark: { url: '/explorers/resources/m0-study-notes', title: { pl: 'Notatki szkoleniowe', en: 'Training notes' } },
    },
  },

  // Exam completion dialogues — framed as memory recall
  'm0-exam-agent-systems-done': {
    id: 'm0-exam-agent-systems-done',
    lines: [
      { speaker: 'system', text: { pl: 'WERYFIKACJA PAMIĘCI: ZALICZONA', en: 'MEMORY VERIFICATION: PASSED' }, mode: 'system', autoAdvance: 2000 },
      {
        speaker: 'astronaut',
        text: { pl: 'Systemy agentowe... tak, przypominam sobie. Model, narzędzia, pętla działania.', en: 'Agentic systems... yes, I remember. Model, tools, action loop.' },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Zaraz... miałem z nimi pracować. Na co dzień. To był mój... zawód?', en: 'Wait... I was supposed to work with them. Every day. Was that my... job?' },
        mode: 'monologue',
      },
      { speaker: 'system', text: { pl: 'Wpisz /quest, aby sprawdzić postęp misji.', en: 'Type /quest to check mission progress.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M0_EXAM_AGENT_SYSTEMS_DONE] },
  },

  'm0-exam-operational-procedures-done': {
    id: 'm0-exam-operational-procedures-done',
    lines: [
      { speaker: 'system', text: { pl: 'WERYFIKACJA PAMIĘCI: ZALICZONA', en: 'MEMORY VERIFICATION: PASSED' }, mode: 'system', autoAdvance: 2000 },
      {
        speaker: 'astronaut',
        text: { pl: 'Najpierw eksploracja, potem plan, implementacja i weryfikacja... właśnie tak miałem pracować z CORE AI.', en: 'First exploration, then planning, implementation, and verification... that was exactly how I was supposed to work with CORE AI.' },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'To nie były tylko prompty. To była cała procedura działania.', en: 'These were not just prompts. This was an entire operating procedure.' },
        mode: 'monologue',
      },
      { speaker: 'system', text: { pl: 'Wpisz /quest, aby sprawdzić postęp misji.', en: 'Type /quest to check mission progress.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M0_EXAM_OPERATIONAL_PROCEDURES_DONE] },
  },

  'm0-exam-context-engineering-done': {
    id: 'm0-exam-context-engineering-done',
    lines: [
      { speaker: 'system', text: { pl: 'WERYFIKACJA PAMIĘCI: ZALICZONA', en: 'MEMORY VERIFICATION: PASSED' }, mode: 'system', autoAdvance: 2000 },
      {
        speaker: 'astronaut',
        text: { pl: 'Context engineering... tak, o to chodziło. Właściwe informacje we właściwym momencie.', en: 'Context engineering... yes, that was the point. The right information at the right moment.' },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Przypomniałem sobie słowo... „Synaptit". Ale nie wiem skąd. I nie wiem, co oznacza.', en: 'I recalled a word... "Synaptit". I don\'t know where from. Or what it means.' },
        mode: 'monologue',
      },
      { speaker: 'system', text: { pl: 'Wpisz /quest, aby sprawdzić postęp misji.', en: 'Type /quest to check mission progress.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M0_EXAM_CONTEXT_ENGINEERING_DONE] },
  },

  // Exam zone dialogues for already completed exams
  'm0-exam-agent-systems-already': {
    id: 'm0-exam-agent-systems-already',
    lines: [{ speaker: 'system', text: { pl: 'Egzamin z systemów agentowych zaliczony.', en: 'Agentic systems exam passed.' }, mode: 'system', autoAdvance: 2000 }],
  },

  'm0-exam-operational-procedures-already': {
    id: 'm0-exam-operational-procedures-already',
    lines: [
      { speaker: 'system', text: { pl: 'Egzamin z procedur operacyjnych zaliczony.', en: 'Operational procedures exam passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  'm0-exam-context-engineering-already': {
    id: 'm0-exam-context-engineering-already',
    lines: [{ speaker: 'system', text: { pl: 'Egzamin z context engineering zaliczony.', en: 'Context engineering exam passed.' }, mode: 'system', autoAdvance: 2000 }],
  },

  // Locked door dialogue — shown when player tries to exit without all exams passed
  'm0-exam-room-door-locked': {
    id: 'm0-exam-room-door-locked',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'Pomieszczenie obsługi CORE AI zablokowane.', en: 'CORE AI operations room locked.' },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: { pl: 'Wymagany stopień doświadczenia: Space Scout (100 XP)', en: 'Required experience level: Space Scout (100 XP)' },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Chyba nie obejdzie się bez dodatkowego szkolenia...', en: 'Looks like more training will be needed...' },
        mode: 'monologue',
      },
    ],
  },

  // Officer Harris — NPC scientist in the exam room
  'npc-officer-harris': {
    id: 'npc-officer-harris',
    lines: [
      { speaker: 'oficer Harris', text: { pl: 'O! Kolejny przebudzony. Żyjesz — to już dobry znak.', en: 'Oh! Another one awake. You\'re alive — already a good sign.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Kim jesteś? I dlaczego wszyscy zachowują się, jakby oczekiwali, że stracę pamięć?', en: 'Who are you? And why does everyone act like they expected me to lose my memory?' }, mode: 'dialogue' },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Oficer Harris. Odpowiadam za szkolenie załogi w rejonach głębokiego kosmosu.', en: 'Officer Harris. I oversee crew training in deep space sectors.' },
        mode: 'dialogue',
      },
      {
        speaker: 'oficer Harris',
        text: { pl: 'A co do pamięci... powiedzmy, że przewidzieliśmy pewne komplikacje. Nie wszystkie.', en: 'As for the memory... let\'s say we anticipated certain complications. Not all of them.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: 'Jakie komplikacje? O czym mówisz?', en: 'What complications? What are you talking about?' }, mode: 'dialogue' },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Krok po kroku, Dexo. Najpierw egzaminy. Potem odpowiedzi. Obiecuję.', en: 'Step by step, Dexo. Exams first. Answers later. I promise.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: 'A jeśli nie zdam?', en: 'What if I fail?' }, mode: 'dialogue' },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Próbujesz jeszcze raz. Kiedyś zdałem ten sam egzamin siedem razy. Teraz go układam.', en: 'You try again. I once sat that same exam seven times. Now I write it.' },
        mode: 'dialogue',
      },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Na tablicy szkoleniowej masz materiały. Przejrzyj je zanim zaczniesz.', en: 'The training board has the materials. Look them over before you start.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: '„Przewidzieliśmy komplikacje"... Co oni wiedzieli przed startem?', en: '"We anticipated complications"... What did they know before launch?' }, mode: 'monologue' },
    ],
  },

  'npc-officer-harris-exams-done': {
    id: 'npc-officer-harris-exams-done',
    lines: [
      { speaker: 'oficer Harris', text: { pl: 'Wszystkie egzaminy zaliczone. Wiedziałem, że sobie poradzisz.', en: 'All exams passed. I knew you could do it.' }, mode: 'dialogue' },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Droga do CORE AI jest teraz otwarta.', en: 'The path to CORE AI is now open.' },
        mode: 'dialogue',
      },
      {
        speaker: 'oficer Harris',
        text: { pl: 'Dexo... kiedy tam wejdziesz, zrozumiesz, dlaczego cię wybrali. I dlaczego to musi być właśnie ty.', en: 'Dexo... when you get in there, you will understand why they chose you. And why it has to be you.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: '„Wybrali"... Czyli ktoś mnie tu celowo umieścił.', en: '"Chose"... Someone placed me here deliberately.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — all exams passed
  'q-pass-exams-done': {
    id: 'q-pass-exams-done',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'MISJA UKOŃCZONA: Zdaj egzaminy weryfikacyjne', en: 'MISSION COMPLETE: Pass the verification exams' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Wszystkie egzaminy zdane. Wspomnienia wracają... fragmentami, jak potłuczone lustro.', en: 'All exams passed. Memories returning... in fragments, like a shattered mirror.' },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Wiem coraz więcej o AI. Ale wciąż nie wiem, co się stało na tym statku.', en: 'I know more and more about AI. But I still don\'t know what happened on this ship.' },
        mode: 'monologue',
      },
    ],
  },
};
