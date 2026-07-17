# Chapter M0 — Przebudzenie & Trening

> Milestone 0, Scenes 01-03. Three maps: hibernation bay (awakening), crew changing room (whiteboards), and exam room.

---

## 3.1 — Story Summary

The player wakes from Komora #3 aboard the deep space vessel Odyssey. After a cinematic intro (silence, headache, blinding light, amnesia), they explore a small hibernation bay. They discover a SmartTerminal in a loot box (UI appears but locked — needs a 4-digit keycode), and read an info board instructing them to proceed to the crew changing room.

In the crew changing room (szatnia załogi) they find 3 crew whiteboards. Each whiteboard lists a crew member, their hibernation pod number, and their personal terminal keycode:

- Inżynier Moreau — Komora #1 — Kod: 4455
- Oficer Harris — Komora #2 — Kod: 7721
- **Dexo [USZKODZONY] — Komora #3 — Kod: 1030** (yours — name partially corrupted = amnesia mystery)

Reading the Komora #3 board sets `keycode-found` flag, making the terminal code input pulse. Player opens the terminal (Ctrl+`), enters `1030`, and the terminal boots — identifying them as "NAWIGATOR". A door leads from the changing room to the exam room.

In the exam room (sala egzaminacyjna) they first encounter a study notes whiteboard — a briefing board with an external link to review materials before the exams. Interacting with it opens a real external resource (course notes URL) in a new browser tab. Beyond the whiteboard, they find 3 exam stations. The exams are framed as "memory recall" — the ship's protocol requires crew to verify their knowledge after hibernation. The topics are real Generative AI fundamentals (LLM basics, prompt engineering, tokenization) — presented as technologies from the past that Dexo must remember.

---

## 3.2 — Scene Graph

```
=============== MAP 1: m0-awakening ===============

+-------------------------------------------+
| Cinematic Title Card                       |
| "Statek głębokiej przestrzeni Odyssey"     |
| "322 dni od ostatniego wpisu w logu"       |
| Flag: m0-intro-seen                        |
+-------------------+-----------------------+
                    |
                    v
+-------------------------------------------+
| Intro Dialogue (m0-awakening-intro)        |
| cinematic: Cisza → Ból głowy → Światło     |
| monologue: Gdzie jestem? Nie pamiętam nic  |
+-------------------+-----------------------+
                    |
    +---------------+---------------+
    v               v               v
+----------+ +--------------+ +--------------+
| Pod      | | Loot Box     | | Info Board   |
| "Komora  | | SmartTerminal| | Idź do       |
|  #3"     | | found!       | | szatni       |
|          | | Flag:        | | załogi       |
|          | | terminal-    | |              |
|          | | found        | |              |
+----------+ +--------------+ +------+-------+
                                     |
                          +----------v-----------+
                          | Door → m0-crew-room   |
                          +----------------------+

=============== MAP 2: m0-crew-room ================

+------------------------------------------+
| 3 Crew Whiteboards                       |
|                                          |
| board-eng (Komora#1, Moreau)             |
| board-ofc (Komora#2, Harris)             |
| board-nav (Komora#3, Dexo)              |
|   → keycode-found                        |
|   → terminal pulses                      |
+------------------------------------------+
         |
         v Player opens terminal (Ctrl+`), enters 1030
         v Terminal boots → "Witaj, Nawigatorze"
         |
         v Door → m0-exam-room

=============== MAP 3: m0-exam-room ================

+------------------------------------------+
| Study Notes Board (opens external URL)   |
|   → "Notatki do egzaminów"              |
|   → window.open(studyNotesUrl)           |
|                                          |
| 3 Exam Stations (GenAI memory recall)    |
|                                          |
| exam-llm-basics   (LLM fundamentals)    |
| exam-prompting     (Prompt engineering)  |
| exam-tokenization  (Tokenization)        |
|                                          |
| Each: 10 XP (silent)                    |
+------------------------------------------+
         |
         v Door back → m0-crew-room
```

---

## 3.3 — Map Specifications

### Map 1: `m0-awakening` — Sala Hibernacyjna

- **Map key:** `m0-awakening`
- **Display name:** Sala Hibernacyjna
- **Size:** ~12x10 tiles (384x320 px)
- **Layers:** Ground, Walls, Zones

| Zone ID | Type | Sprite | Description |
|---------|------|--------|-------------|
| `spawn` | spawn | — | Near hibernation pod |
| `hibernation-pod` | trigger | Hibernation chamber | Monologue, mentions "Komora #3" |
| `loot-terminal` | trigger | Loot box | SmartTerminal discovery |
| `info-board` | trigger | Whiteboard | Instructions to go to crew changing room + CORE AI mention |
| `crew-room-door` | door | — | targetMap: m0-crew-room |

### Map 2: `m0-crew-room` — Szatnia Załogi

- **Map key:** `m0-crew-room`
- **Display name:** Szatnia Załogi
- **Size:** ~14x10 tiles (448x320 px)
- **Layers:** Ground, Walls, Zones

| Zone ID | Type | Sprite | Description |
|---------|------|--------|-------------|
| `spawn` | spawn | — | Entry from hibernation bay |
| `board-eng` | trigger | Whiteboard | Inżynier Moreau, Komora #1, Kod: 4455 |
| `board-ofc` | trigger | Whiteboard | Oficer Harris, Komora #2, Kod: 7721 |
| `board-nav` | trigger | Whiteboard | Dexo [USZKODZONY], Komora #3, Kod: 1030 |
| `awakening-door` | door | — | targetMap: m0-awakening |
| `exam-room-door` | door | — | targetMap: m0-exam-room |

### Map 3: `m0-exam-room` — Sala Egzaminacyjna

- **Map key:** `m0-exam-room`
- **Display name:** Sala Egzaminacyjna
- **Size:** ~14x10 tiles (448x320 px)
- **Layers:** Ground, Walls, Zones

| Zone ID | Type | Sprite | Description |
|---------|------|--------|-------------|
| `spawn` | spawn | — | Entry from crew room |
| `study-notes-board` | trigger | Whiteboard | Study notes — opens external resource URL in new tab |
| `exam-llm-basics` | exam | Computer | Exam: Podstawy LLM (examId: m0-exam-llm-basics) |
| `exam-prompting` | exam | Computer | Exam: Prompt Engineering (examId: m0-exam-prompting) |
| `exam-tokenization` | exam | Computer | Exam: Tokenizacja (examId: m0-exam-tokenization) |
| `crew-room-door` | door | — | targetMap: m0-crew-room |

---

## 3.4 — Dialogues

### m0-awakening dialogues

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  // Cinematic intro — plays on first visit after title card
  'm0-awakening-intro': {
    id: 'm0-awakening-intro',
    lines: [
      { speaker: 'system', text: 'Cisza.', mode: 'cinematic', autoAdvance: 2500 },
      { speaker: 'system', text: 'Ból głowy. Pulsujący, tępy.', mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'system', text: 'Jasne światło przebija przez powieki.', mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'system', text: 'Dźwięk otwierania komory hibernacyjnej.', mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: 'Gdzie ja... jestem?', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Nie pamiętam... nic. Nawet jak się nazywam.', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Muszę się rozejrzeć.', mode: 'monologue' },
    ],
  },

  // Hibernation pod examination
  'm0-pod-examine': {
    id: 'm0-pod-examine',
    lines: [
      { speaker: 'astronaut', text: 'Komora hibernacyjna. Moja, jak widać.', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Na obudowie widnieje napis: „Komora #3".', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Wskaźniki pokazują, że byłem w niej... długo. Ale ile dokładnie?', mode: 'monologue' },
    ],
  },

  // Loot box — SmartTerminal discovery (default, before opening)
  'm0-loot-terminal-open': {
    id: 'm0-loot-terminal-open',
    lines: [
      { speaker: 'system', text: 'Skrzynia awaryjnego wyposażenia.', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'Co to? Jakiś terminal...', mode: 'monologue' },
      { speaker: 'system', text: 'SmartTerminal odnaleziony. Wymaga kodu dostępu.', mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: 'Terminal jest zablokowany. Muszę znaleźć swój kod dostępu.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['terminal-found'] },
  },

  // Loot box — after already opening
  'm0-loot-terminal-done': {
    id: 'm0-loot-terminal-done',
    lines: [
      { speaker: 'system', text: 'Skrzynia pusta. SmartTerminal już zabrany.', mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Info board — crew changing room instructions
  'm0-info-board': {
    id: 'm0-info-board',
    lines: [
      { speaker: 'system', text: 'TABLICA INFORMACYJNA — Protokół pobudki', mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: '1. Odbierz wyposażenie ze skrzyni awaryjnej.', mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: '2. Przejdź do szatni załogi — zidentyfikuj się.', mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: '3. Zdaj egzaminy weryfikacyjne w sali egzaminacyjnej.', mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: '4. Po szkoleniu — rozpocznij trening CORE AI w celu obsługi statku.', mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: 'Szatnia załogi... musi być gdzieś dalej.', mode: 'monologue' },
    ],
  },

  // First contact dialogue — triggered after terminal boot sequence
  'first-contact': {
    id: 'first-contact',
    lines: [
      { speaker: 'system', text: 'UPLINK aktywny. Łącze z Ziemią ustabilizowane.', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Przynajmniej coś działa... Mam dostęp do terminala.', mode: 'monologue' },
      { speaker: 'system', text: 'Wpisz /me aby sprawdzić status astronauty.', mode: 'system', autoAdvance: 3000 },
    ],
  },
};
```

### m0-crew-room dialogues

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  // Crew whiteboards
  'm0-board-eng': {
    id: 'm0-board-eng',
    lines: [
      { speaker: 'system', text: 'TABLICA PERSONALNA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Inżynier Moreau', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Komora hibernacyjna: #1', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Kod SmartTerminal: 4455', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Inżynier Moreau, Komora #1... To nie ja.', mode: 'monologue' },
    ],
  },

  'm0-board-ofc': {
    id: 'm0-board-ofc',
    lines: [
      { speaker: 'system', text: 'TABLICA PERSONALNA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Oficer Harris', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Komora hibernacyjna: #2', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Kod SmartTerminal: 7721', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Oficer Harris, Komora #2... Też nie ja.', mode: 'monologue' },
    ],
  },

  'm0-board-nav': {
    id: 'm0-board-nav',
    lines: [
      { speaker: 'system', text: 'TABLICA PERSONALNA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Dexo [DANE USZKODZONE]', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Komora hibernacyjna: #3', mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: 'Kod SmartTerminal: 1030', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Komora #3... to moja komora! To musi być mój kod!', mode: 'monologue' },
      { speaker: 'astronaut', text: '„Dexo"... Więc tak się nazywam? Brzmi znajomo, ale nie pamiętam nic więcej.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['keycode-found'] },
  },

  // Board revisit after keycode found
  'm0-board-nav-revisit': {
    id: 'm0-board-nav-revisit',
    lines: [
      { speaker: 'system', text: 'Dexo [DANE USZKODZONE] — Komora #3 — Kod: 1030', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Mój kod to 1030. Muszę go wpisać w terminalu.', mode: 'monologue' },
    ],
  },
};
```

### m0-exam-room dialogues

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  // Study notes whiteboard — opens external resource
  'm0-study-notes-board': {
    id: 'm0-study-notes-board',
    lines: [
      { speaker: 'system', text: 'TABLICA SZKOLENIOWA — Notatki do egzaminów', mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: 'Materiały przygotowawcze do weryfikacji pamięci.', mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: 'Notatki z przeszłości... Może pomogą mi sobie przypomnieć.', mode: 'monologue' },
    ],
    onComplete: { openUrl: 'STUDY_NOTES_URL_PLACEHOLDER' },
  },

  // Exam completion dialogues — framed as memory recall
  'm0-exam-llm-basics-done': {
    id: 'm0-exam-llm-basics-done',
    lines: [
      { speaker: 'system', text: 'WERYFIKACJA PAMIĘCI: ZALICZONA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'LLM-y... tak, przypominam sobie. Modele językowe były fundamentem.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['m0-exam-llm-basics-done'] },
  },

  'm0-exam-prompting-done': {
    id: 'm0-exam-prompting-done',
    lines: [
      { speaker: 'system', text: 'WERYFIKACJA PAMIĘCI: ZALICZONA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'Prompt engineering... to była kluczowa umiejętność. Wracają wspomnienia.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['m0-exam-prompting-done'] },
  },

  'm0-exam-tokenization-done': {
    id: 'm0-exam-tokenization-done',
    lines: [
      { speaker: 'system', text: 'WERYFIKACJA PAMIĘCI: ZALICZONA', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'Tokenizacja... tak, pamiętam. Bez tego modele nie mogłyby przetwarzać tekstu.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['m0-exam-tokenization-done'] },
  },

  // Exam zone dialogues for already completed exams
  'm0-exam-llm-basics-already': {
    id: 'm0-exam-llm-basics-already',
    lines: [
      { speaker: 'system', text: 'Weryfikacja pamięci LLM: ZALICZONA.', mode: 'system', autoAdvance: 2000 },
    ],
  },

  'm0-exam-prompting-already': {
    id: 'm0-exam-prompting-already',
    lines: [
      { speaker: 'system', text: 'Weryfikacja pamięci Prompting: ZALICZONA.', mode: 'system', autoAdvance: 2000 },
    ],
  },

  'm0-exam-tokenization-already': {
    id: 'm0-exam-tokenization-already',
    lines: [
      { speaker: 'system', text: 'Weryfikacja pamięci Tokenizacja: ZALICZONA.', mode: 'system', autoAdvance: 2000 },
    ],
  },
};
```

---

## 3.5 — Exams

Exams are framed as **memory recall** — the ship's post-hibernation protocol requires crew to verify their knowledge. Dexo is "remembering" Generative AI technologies from the past.

```typescript
import type { ExamDefinition } from '../../systems/ExamTypes';

export const exams: ExamDefinition[] = [
  {
    id: 'm0-exam-llm-basics',
    title: 'Weryfikacja pamięci: Podstawy LLM',
    description: 'Protokół pobudki wymaga weryfikacji wiedzy. Przypomnij sobie podstawy dużych modeli językowych.',
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: 'Co oznacza skrót LLM?',
        type: 'single',
        options: [
          { id: 'a', text: 'Large Language Model' },
          { id: 'b', text: 'Linear Logic Machine' },
          { id: 'c', text: 'Layered Learning Module' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: 'Na czym polega proces trenowania LLM?',
        type: 'single',
        options: [
          { id: 'a', text: 'Na ręcznym programowaniu reguł gramatycznych' },
          { id: 'b', text: 'Na uczeniu się wzorców z ogromnych zbiorów danych tekstowych' },
          { id: 'c', text: 'Na kopiowaniu odpowiedzi z bazy danych' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: 'Co to jest "halucynacja" w kontekście LLM?',
        type: 'single',
        options: [
          { id: 'a', text: 'Błąd sprzętowy powodujący restart modelu' },
          { id: 'b', text: 'Generowanie przekonująco brzmiących, ale nieprawdziwych informacji' },
          { id: 'c', text: 'Celowe ukrywanie odpowiedzi przez model' },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 10, flags: ['m0-exam-llm-basics-done'] },
  },
  {
    id: 'm0-exam-prompting',
    title: 'Weryfikacja pamięci: Prompt Engineering',
    description: 'Przypomnij sobie techniki komunikacji z modelami AI. Jak formułować skuteczne prompty?',
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: 'Czym jest "system prompt"?',
        type: 'single',
        options: [
          { id: 'a', text: 'Komunikat o błędzie systemu operacyjnego' },
          { id: 'b', text: 'Instrukcja definiująca zachowanie i rolę modelu AI' },
          { id: 'c', text: 'Automatyczna odpowiedź serwera' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'Co to jest technika "few-shot prompting"?',
        type: 'single',
        options: [
          { id: 'a', text: 'Podanie modelowi kilku przykładów przed właściwym zadaniem' },
          { id: 'b', text: 'Wysyłanie wielu zapytań jednocześnie' },
          { id: 'c', text: 'Ograniczenie modelu do krótkich odpowiedzi' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: 'Jaki parametr kontroluje "kreatywność" odpowiedzi modelu?',
        type: 'single',
        options: [
          { id: 'a', text: 'Learning rate' },
          { id: 'b', text: 'Temperature' },
          { id: 'c', text: 'Batch size' },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 10, flags: ['m0-exam-prompting-done'] },
  },
  {
    id: 'm0-exam-tokenization',
    title: 'Weryfikacja pamięci: Tokenizacja',
    description: 'Przypomnij sobie, jak modele AI przetwarzają tekst. Czym są tokeny?',
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: 'Czym jest token w kontekście LLM?',
        type: 'single',
        options: [
          { id: 'a', text: 'Jednostka waluty cyfrowej' },
          { id: 'b', text: 'Fragment tekstu (słowo, część słowa lub znak) przetwarzany przez model' },
          { id: 'c', text: 'Klucz autoryzacyjny do API' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'Dlaczego modele mają ograniczenie "context window"?',
        type: 'single',
        options: [
          { id: 'a', text: 'Bo ekran monitora ma ograniczoną wielkość' },
          { id: 'b', text: 'Bo model może przetwarzać tylko ograniczoną liczbę tokenów na raz' },
          { id: 'c', text: 'Bo sieć internetowa ma ograniczoną przepustowość' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: 'Jak tokenizer zazwyczaj traktuje rzadkie lub nieznane słowa?',
        type: 'single',
        options: [
          { id: 'a', text: 'Pomija je całkowicie' },
          { id: 'b', text: 'Rozbija je na mniejsze, znane fragmenty (subword tokens)' },
          { id: 'c', text: 'Zastępuje je symbolem [UNKNOWN]' },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 10, flags: ['m0-exam-tokenization-done'] },
  },
];
```

---

## 3.7 — Manifests

### m0-awakening manifest

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'm0-awakening',
  displayName: 'Sala Hibernacyjna',
  dialogues,
  interactionRoutes: [
    { zoneId: 'hibernation-pod', defaultDialogue: 'm0-pod-examine' },
    {
      zoneId: 'loot-terminal',
      defaultDialogue: 'm0-loot-terminal-open',
      flagVariants: [
        { flag: 'terminal-found', dialogue: 'm0-loot-terminal-done' },
      ],
    },
    { zoneId: 'info-board', defaultDialogue: 'm0-info-board' },
  ],
  introDialogue: 'm0-awakening-intro',
  introFlag: 'm0-intro-seen',
};
```

### m0-crew-room manifest

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'm0-crew-room',
  displayName: 'Szatnia Załogi',
  dialogues,
  interactionRoutes: [
    { zoneId: 'board-eng', defaultDialogue: 'm0-board-eng' },
    { zoneId: 'board-ofc', defaultDialogue: 'm0-board-ofc' },
    {
      zoneId: 'board-nav',
      defaultDialogue: 'm0-board-nav',
      flagVariants: [
        { flag: 'keycode-found', dialogue: 'm0-board-nav-revisit' },
      ],
    },
  ],
};
```

### m0-exam-room manifest

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { exams } from './exams';

export const manifest: LevelManifest = {
  id: 'm0-exam-room',
  displayName: 'Sala Egzaminacyjna',
  dialogues,
  interactionRoutes: [
    { zoneId: 'study-notes-board', defaultDialogue: 'm0-study-notes-board' },
    {
      zoneId: 'exam-llm-basics',
      defaultDialogue: 'm0-exam-llm-basics-already',
    },
    {
      zoneId: 'exam-prompting',
      defaultDialogue: 'm0-exam-prompting-already',
    },
    {
      zoneId: 'exam-tokenization',
      defaultDialogue: 'm0-exam-tokenization-already',
    },
  ],
  exams,
  examCompletionDialogues: {
    'm0-exam-llm-basics': 'm0-exam-llm-basics-done',
    'm0-exam-prompting': 'm0-exam-prompting-done',
    'm0-exam-tokenization': 'm0-exam-tokenization-done',
  },
};
```

---

## 3.8 — Flags Summary

| Flag | Set by | Effect |
|------|--------|--------|
| `m0-intro-seen` | Cinematic intro completion | Prevents cinematic replay on revisit |
| `terminal-found` | Loot box dialogue | Terminal UI visible in HUD (locked mode) |
| `keycode-found` | Komora #3 whiteboard (Dexo) | Terminal code input pulses with animation |
| `terminal-unlocked` | SmartTerminal boot (existing) | Full terminal access + commands |
| `m0-exam-llm-basics-done` | Exam pass | Progress tracking |
| `m0-exam-prompting-done` | Exam pass | Progress tracking |
| `m0-exam-tokenization-done` | Exam pass | Progress tracking |

---

## 3.9 — State Transitions

| State | Map | XP | Key Flags | Narrative |
|-------|-----|----|-----------|-----------|
| New game | m0-awakening | 0 | [] | Cinematic title card plays |
| After intro | m0-awakening | 0 | [m0-intro-seen] | Player can explore hibernation bay |
| Found terminal | m0-awakening | 0 | [..., terminal-found] | Terminal UI visible but locked |
| Read info board | m0-awakening | 0 | [...] | Player knows to go to crew changing room |
| In crew room | m0-crew-room | 0 | [...] | Reading whiteboards, identifying self |
| Keycode found | m0-crew-room | 0 | [..., keycode-found] | Terminal code input pulses |
| Terminal unlocked | anywhere | 0 | [..., terminal-unlocked] | Full terminal access, "Witaj Nawigatorze" |
| In exam room | m0-exam-room | 0-30 | [...] | Completing GenAI memory recall exams |
| All exams done | m0-exam-room | 30 | [..., all exam flags] | Ready for next chapter (CORE AI training) |

---

## 3.10 — Map Editor Instructions

### Map 1: `m0-awakening.json`

1. **Create** `public/game/maps/m0-awakening.json` in Tiled
2. **Size:** 12 columns x 10 rows (384x320 px), tile size 32x32
3. **Tileset:** `placeholder.png`
4. **Layers:**
   - `Ground` — floor tiles (spaceship interior)
   - `Walls` — perimeter walls
   - `Zones` — object layer

**Zone objects (Zones layer):**

| Name | type | Custom Properties | Size | Position hint |
|------|------|-------------------|------|---------------|
| Spawn | spawn | id: "spawn" | 32x32 | Tile (3, 5) |
| Hibernation Pod | trigger | id: "hibernation-pod" | 64x32 | Left side (2, 4) |
| Loot Box | trigger | id: "loot-terminal" | 32x32 | Center (5, 5) |
| Info Board | trigger | id: "info-board" | 64x32 | Upper wall (6, 1) |
| Crew Room Door | door | id: "crew-room-door", targetMap: "m0-crew-room", spawnX: 64, spawnY: 160 | 32x64 | Right wall (11, 4) |

### Map 2: `m0-crew-room.json`

1. **Create** `public/game/maps/m0-crew-room.json` in Tiled
2. **Size:** 14 columns x 10 rows (448x320 px), tile size 32x32
3. **Tileset:** `placeholder.png`
4. **Layers:**
   - `Ground` — floor tiles
   - `Walls` — perimeter walls
   - `Zones` — object layer

**Zone objects (Zones layer):**

| Name | type | Custom Properties | Size | Position hint |
|------|------|-------------------|------|---------------|
| Spawn | spawn | id: "spawn" | 32x32 | Left side (2, 5) |
| Board Engineer | trigger | id: "board-eng" | 64x32 | Upper wall (3, 1) |
| Board Officer | trigger | id: "board-ofc" | 64x32 | Upper wall (7, 1) |
| Board Navigator | trigger | id: "board-nav" | 64x32 | Upper wall (11, 1) |
| Return Door | door | id: "awakening-door", targetMap: "m0-awakening", spawnX: 320, spawnY: 160 | 32x64 | Left wall (0, 4) |
| Exam Room Door | door | id: "exam-room-door", targetMap: "m0-exam-room", spawnX: 64, spawnY: 160 | 32x64 | Right wall (13, 4) |

### Map 3: `m0-exam-room.json`

1. **Create** `public/game/maps/m0-exam-room.json` in Tiled
2. **Size:** 14 columns x 10 rows (448x320 px), tile size 32x32
3. **Tileset:** `placeholder.png`
4. **Layers:**
   - `Ground` — floor tiles
   - `Walls` — perimeter walls
   - `Zones` — object layer

**Zone objects (Zones layer):**

| Name | type | Custom Properties | Size | Position hint |
|------|------|-------------------|------|---------------|
| Spawn | spawn | id: "spawn" | 32x32 | Left side (2, 5) |
| Study Notes Board | trigger | id: "study-notes-board" | 64x32 | Near spawn, upper wall (3, 1) |
| Exam LLM Basics | exam | id: "exam-llm-basics", examId: "m0-exam-llm-basics" | 32x32 | Upper area (5, 3) |
| Exam Prompting | exam | id: "exam-prompting", examId: "m0-exam-prompting" | 32x32 | Upper area (8, 3) |
| Exam Tokenization | exam | id: "exam-tokenization", examId: "m0-exam-tokenization" | 32x32 | Upper area (11, 3) |
| Return Door | door | id: "crew-room-door", targetMap: "m0-crew-room", spawnX: 384, spawnY: 160 | 32x64 | Left wall (0, 4) |

---

## 3.11 — New Mechanic: `openUrl` Dialogue Effect

The study notes whiteboard introduces a new `openUrl` field on `DialogueEffect`. When a dialogue completes with `openUrl` set, the game opens the URL in a new browser tab.

### Type change

```typescript
// src/explorers/systems/DialogueTypes.ts
export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  setFlags?: string[];
  triggerEvent?: string;
  openUrl?: string;          // ← NEW: opens URL in new tab on dialogue completion
}
```

### Implementation change

```typescript
// src/explorers/systems/DialogueManager.ts — applyEffects()
private applyEffects(effects?: DialogueEffect): void {
  if (!effects) return;
  // ... existing flag/quest/event handling ...
  if (effects.openUrl) {
    window.open(effects.openUrl, '_blank');
  }
}
```

This is minimal — one field added to the type, one `window.open()` call in the existing `applyEffects()` method. No new events, no new systems.

---

## Code Changes Required

### New files to create:
1. `src/explorers/levels/m0-awakening/dialogues.ts`
2. `src/explorers/levels/m0-awakening/manifest.ts`
3. `src/explorers/levels/m0-crew-room/dialogues.ts`
4. `src/explorers/levels/m0-crew-room/manifest.ts`
5. `src/explorers/levels/m0-exam-room/dialogues.ts`
6. `src/explorers/levels/m0-exam-room/manifest.ts`
7. `src/explorers/levels/m0-exam-room/exams.ts`

### Existing files to modify:

| File | Change |
|------|--------|
| `src/explorers/levels/index.ts` | Register all three new levels in ALL_LEVELS |
| `src/explorers/state/GameStateManager.ts` | Default map `init-map` → `m0-awakening` |
| `src/explorers/scenes/GameScene.ts` | Default mapKey `init-map` → `m0-awakening` |
| `src/explorers/SmartTerminal.svelte` | Unlock code `0451` → `1030`, update hint text |
| `src/explorers/PhaserGame.svelte` | Gate terminal toggle on `terminal-found` flag; update keycode log text |
| `src/explorers/GameHud.svelte` | Hide terminal hint until `terminal-found` flag is set |
| `src/explorers/data/dialogues/terminal-boot.json` | Update to say "DEXO" / "NAWIGATOR" as appropriate |
| `src/explorers/systems/DialogueTypes.ts` | Add `openUrl?: string` field to `DialogueEffect` |
| `src/explorers/systems/DialogueManager.ts` | Handle `openUrl` in `applyEffects()` via `window.open()` |

### Tiled maps (user creates manually):
1. `public/game/maps/m0-awakening.json`
2. `public/game/maps/m0-crew-room.json`
3. `public/game/maps/m0-exam-room.json`

---

## Narrative Hooks for Next Chapter

- **CORE AI training** — the info board mentions this as the next step. What is CORE AI? Why does Dexo need to train with it?
- **Amnesia mystery** — who is Dexo? Why are their personnel records corrupted? What happened 322 days ago?
- **Missing crew** — Moreau and Harris — where are they? Are they alive? Their pods (#1 and #2) were empty.
- **Earth connection** — the UPLINK connected to Earth. Will anyone respond?
- **GenAI memories** — Dexo remembers Generative AI technologies. Why? What role did AI play in their mission?
