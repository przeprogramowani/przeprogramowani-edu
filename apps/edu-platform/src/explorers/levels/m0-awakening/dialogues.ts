import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Cinematic intro — plays on first visit after title card
  'm0-awakening-intro': {
    id: 'm0-awakening-intro',
    lines: [
      { speaker: 'system', text: { pl: 'Cisza.', en: 'Silence.' }, mode: 'cinematic', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: 'Ból głowy. Pulsujący, tępy. Jakby ktoś wyrył coś w czaszce od środka.', en: 'Headache. Throbbing, dull. Like something carved into the skull from inside.' }, mode: 'cinematic', autoAdvance: 3500 },
      { speaker: 'system', text: { pl: 'Jasne światło przebija przez powieki. Za jasne. Nienaturalne.', en: 'Bright light cuts through my eyelids. Too bright. Unnatural.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'system', text: { pl: 'Syknięcie hydrauliki. Komora hibernacyjna otwiera się — z opóźnieniem.', en: 'Hydraulics hiss. The hibernation pod opens — late.' }, mode: 'cinematic', autoAdvance: 3500 },
      { speaker: 'system', text: { pl: 'Na wewnętrznej ściance komory — rysy. Jakby ktoś drapał od środka.', en: 'Scratches on the pod wall. Like someone clawed from inside.' }, mode: 'cinematic', autoAdvance: 3500 },
      { speaker: 'astronaut', text: { pl: 'Gdzie ja... jestem?', en: 'Where... am I?' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Nie pamiętam... nic. Nawet jak się nazywam.', en: 'I remember... nothing. Not even my name.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Ale to uczucie... jakby ktoś celowo usunął mi wspomnienia.', en: 'But this feeling... like someone deliberately erased my memories.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Muszę się rozejrzeć.', en: 'I need to look around.' }, mode: 'monologue' },
    ],
  },

  // Hibernation pod examination
  'm0-pod-examine': {
    id: 'm0-pod-examine',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Komora hibernacyjna. Twardo, zimno... i te rysy na szkle.', en: 'Hibernation pod. Hard, cold... and those scratches on the glass.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Hmm... „Komora #3". A gdzie są komory #1 i #2?', en: 'Hmm... "Pod #3". Where are pods #1 and #2?' }, mode: 'monologue' },
      {
        speaker: 'astronaut',
        text: { pl: 'Wskaźniki pokazują czas hibernacji, ale... ostatnie wpisy w logu są uszkodzone.', en: 'The readouts show hibernation time, but... the last log entries are corrupted.' },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Jeden fragment się powtarza: „SYNCHRONIZACJA NEURONALNA — PRZERWANA". Co to znaczy?', en: 'One fragment repeats: "NEURAL SYNCHRONISATION — INTERRUPTED". What does that mean?' },
        mode: 'monologue',
      },
    ],
  },

  // Loot box — SmartTerminal discovery (default, before opening)
  'm0-loot-terminal-open': {
    id: 'm0-loot-terminal-open',
    lines: [
      { speaker: 'system', text: { pl: 'Skrzynia awaryjnego wyposażenia.', en: 'Emergency equipment crate.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'A to co...?', en: 'What is this...?' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'SmartTerminal odnaleziony!', en: 'SmartTerminal found!' }, mode: 'system', autoAdvance: 3000 },
      {
        speaker: 'system',
        text: { pl: '▸ Naciśnij Ctrl+`, aby otworzyć SmartTerminal.', en: '▸ Press Ctrl+` to open SmartTerminal.' },
        mode: 'system',
        autoAdvance: 3000,
      },
      { speaker: 'astronaut', text: { pl: 'Ekran miga... jakby urządzenie próbowało się ze mną połączyć.', en: 'Screen flickering... as if the device is trying to connect to me.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.TERMINAL_FOUND] },
  },

  // Loot box — after already opening
  'm0-loot-terminal-done': {
    id: 'm0-loot-terminal-done',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'Skrzynia pusta. Podstawowe wyposażenie już zabrane.', en: 'Crate empty. Basic equipment already taken.' },
        mode: 'system',
        autoAdvance: 2000,
      },
    ],
  },

  // Info board — crew changing room instructions
  'm0-info-board': {
    id: 'm0-info-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA INFORMACYJNA — Protokół pobudki', en: 'INFORMATION BOARD — Wake-up Protocol' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: '1. Odbierz wyposażenie ze skrzyni awaryjnej.', en: '1. Collect equipment from the emergency crate.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: { pl: '2. Przejdź do szatni załogi — zidentyfikuj się.', en: '2. Proceed to the crew changing room — identify yourself.' }, mode: 'system', autoAdvance: 3000 },
      {
        speaker: 'system',
        text: { pl: '3. Zdaj egzaminy weryfikacyjne w sali egzaminacyjnej.', en: '3. Pass verification exams in the exam room.' },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: { pl: '4. Po szkoleniu — rozpocznij trening CORE AI w celu obsługi statku.', en: '4. After training — begin CORE AI training to operate the ship.' },
        mode: 'system',
        autoAdvance: 3000,
      },
      { speaker: 'astronaut', text: { pl: 'Dziwne... ten protokół zakłada, że nie tylko ja obudzę się bez pamięci.', en: 'Strange... this protocol assumes I won\'t be the only one waking up without memories.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Szatnia załogi... musi być gdzieś dalej.', en: 'Crew changing room... must be further on.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.CMDS_QUEST, FLAGS.M0_INFO_BOARD_READ], activateQuest: 'q-pass-exams' },
  },

  // Door locked — info board not yet read
  'm0-door-locked': {
    id: 'm0-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'Drzwi zablokowane. Zapoznaj się z protokółem pobudki.', en: 'Door locked. Review the wake-up protocol.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // NPC — engineer Moreau
  'm0-npc-moreau': {
    id: 'm0-npc-moreau',
    lines: [
      { speaker: 'inżynier Moreau', text: { pl: 'O, żyjesz! Zakład z Harrisem wygrany.', en: 'Oh, you\'re alive! Won the bet with Harris.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Słucham? Jaki zakład? Co do...', en: 'Sorry? What bet? What the...' }, mode: 'dialogue' },
      {
        speaker: 'inżynier Moreau',
        text: { pl: 'Pytanie za pytaniem. Klasyczny objaw po dłuższej hibernacji.', en: 'Question after question. Classic symptom after extended hibernation.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: 'Nic nie pamiętam. Dosłownie nic. Nawet dlaczego tu jestem.', en: 'I remember nothing. Literally nothing. Not even why I\'m here.' }, mode: 'dialogue' },
      {
        speaker: 'inżynier Moreau',
        text: { pl: '...normalne. Ja po swoim przebudzeniu przez tydzień myślałem, że jestem dentystą.', en: '...normal. After my own awakening I spent a week thinking I was a dentist.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: 'A te rysy na komorach? I uszkodzone logi?', en: 'And those scratches on the pods? And the corrupted logs?' }, mode: 'dialogue' },
      {
        speaker: 'inżynier Moreau',
        text: { pl: '...zacznij od tablicy. Krok po kroku. Ja potrzebuję kawy.', en: '...start with the board. Step by step. I need coffee.' },
        mode: 'dialogue',
      },
      { speaker: 'astronaut', text: { pl: 'Unika tematu. Albo wie więcej niż mówi, albo sam się boi.', en: 'Avoiding the topic. Either he knows more than he\'s saying, or he\'s scared himself.' }, mode: 'monologue' },
    ],
  },

  // First contact dialogue — triggered after terminal boot sequence
  'first-contact': {
    id: 'first-contact',
    lines: [
      { speaker: 'system', text: { pl: 'UPLINK aktywny. Łącze z Ziemią ustabilizowane.', en: 'UPLINK active. Connection to Earth stabilised.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: '...//szum//... ...na...igator... ...czy mnie...yszysz?... ...//szum//...', en: '...//noise//... ...nav...igator... ...can you...hear me?... ...//noise//...' }, mode: 'system', autoAdvance: 3500 },
      { speaker: 'astronaut', text: { pl: 'Ktoś... próbuje się ze mną skontaktować? Z Ziemi?', en: 'Someone... is trying to contact me? From Earth?' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'Sygnał niestabilny. Częściowa synchronizacja.', en: 'Signal unstable. Partial synchronisation.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Mam dostęp do terminala. To na razie mój jedyny kontakt ze światem.', en: 'I have terminal access. Right now it\'s my only connection to the world.' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'Wpisz /me, aby sprawdzić status astronauty.', en: 'Type /me to check astronaut status.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { grantXp: 10 },
  },
};
