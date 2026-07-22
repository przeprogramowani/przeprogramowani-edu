import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Crew whiteboards
  'm0-board-eng': {
    id: 'm0-board-eng',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Inżynier Moreau — Specjalista ds. systemów napędowych', en: 'Engineer Moreau — Propulsion systems specialist' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: 'Komora hibernacyjna: #1', en: 'Hibernation pod: #1' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Kod osobisty: (90 * 50) - 45', en: 'Personal code: (90 * 50) - 45' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Inżynier Moreau, Komora #1... To nie ja.', en: 'Engineer Moreau, Pod #1... That\'s not me.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Ale chwila — ktoś dopisał coś od ręki na dole tablicy. Rozmazane... nie do odczytania.', en: 'But wait — someone added a handwritten note at the bottom of the board. Smudged... unreadable.' }, mode: 'monologue' },
    ],
  },

  'm0-board-eng-asteroid-cleared': {
    id: 'm0-board-eng-asteroid-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 1500 },
      { speaker: 'astronaut', text: { pl: 'Ktoś dopisał nową uwagę: „Sektor wydobycia uspokojony. Zapas minerałów uzupełniony".', en: 'Someone added a new note: "Mining sector stabilised. Mineral supply replenished".' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Czyli ta strzelnica naprawdę była awaryjnym stanowiskiem pracy, nie tylko rozrywką.', en: 'So that range really was an emergency work station, not just entertainment.' }, mode: 'monologue' },
    ],
  },

  'm0-board-ofc': {
    id: 'm0-board-ofc',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Oficer Harris — Koordynator szkolenia załogi', en: 'Officer Harris — Crew training coordinator' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: 'Komora hibernacyjna: #2', en: 'Hibernation pod: #2' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Kod osobisty: 7000 + (7 * 103)', en: 'Personal code: 7000 + (7 * 103)' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Oficer Harris, Komora #2... szukam dalej.', en: 'Officer Harris, Pod #2... searching further.' }, mode: 'monologue' },
    ],
  },

  'm0-board-ofc-memory-cleared': {
    id: 'm0-board-ofc-memory-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 1500 },
      { speaker: 'astronaut', text: { pl: 'Na marginesie pojawiła się świeża notatka: „Kolejka sygnałów rozładowana. Kanał znów czysty".', en: 'A fresh note appeared in the margin: "Signal queue cleared. Channel clean again".' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Dobrze. Przynajmniej jeden system na tym pokładzie przestał mnie wołać na pomoc.', en: 'Good. At least one system on this ship has stopped calling for my help.' }, mode: 'monologue' },
    ],
  },

  'm0-board-nav': {
    id: 'm0-board-nav',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Komora hibernacyjna: #3', en: 'Hibernation pod: #3' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: { pl: 'Komora #3... to moja komora!', en: 'Pod #3... that\'s my pod!' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'Dexo — [DANE USZKODZONE — SEKTOR PAMIĘCI 0x7F NADPISANY]', en: 'Dexo — [DATA CORRUPTED — MEMORY SECTOR 0x7F OVERWRITTEN]' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: '„Dexo"... To imię coś we mnie porusza. Jakby echo czegoś sprzed snu.', en: '"Dexo"... That name stirs something in me. Like an echo of something before the sleep.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Ale dlaczego akurat moje dane są uszkodzone? Tylko moje?', en: 'But why are only my data corrupted? Just mine?' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'Kod osobisty: 5 * 206', en: 'Personal code: 5 * 206' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Okej, potrzebuję kartki i ołówka...', en: 'Okay, I need a pen and paper...' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.KEYCODE_FOUND] },
  },

  // Board of the sealed fourth crew member — warm-starts dr Kern (pod #4) for m1.
  // Plants "capsule four" + a "…ge…" fragment (geology). No flags, no code, no payoff here.
  'm0-board-kern': {
    id: 'm0-board-kern',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA PERSONALNA', en: 'PERSONAL BOARD' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'system', text: { pl: 'Komora hibernacyjna: #4', en: 'Hibernation pod: #4' }, mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: { pl: 'Czwarta komora? Reszta tablicy wymieniała trzy. Tę dopisano na końcu — inną ręką.', en: 'A fourth pod? The rest of the board listed three. This one was added at the end — in a different hand.' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: '[WPIS ZAPIECZĘTOWANY]', en: '[ENTRY SEALED]' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'system', text: { pl: 'Kod osobisty: [ZAPIECZĘTOWANY]', en: 'Personal code: [SEALED]' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Nazwisko zamazane. Z całego wpisu czytelny jest tylko strzęp: „…ge…". Nic więcej.', en: 'The name is smeared. Of the whole entry only a scrap is legible: "…ge…". Nothing more.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Czworo nas leciało, nie troje. Dlaczego nikt o tej osobie nie wspomniał?', en: 'Four of us flew, not three. Why has no one mentioned this person?' }, mode: 'monologue' },
    ],
  },

  // Floobert — fluffy alien NPC wandering the crew room
  'npc-floobert': {
    id: 'npc-floobert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'CO TO JEST?! Skąd tu wzięła się... ta... rzecz?!', en: 'WHAT IS THAT?! Where did... this... thing come from?!' }, mode: 'dialogue' },
      { speaker: 'Floobert', text: { pl: 'Mrrpfff! Gleebok spznx!', en: 'Mrrpfff! Gleebok spznx!' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ono... ono do mnie mówi? I jest... takie puszyste?', en: 'It... it\'s talking to me? And it\'s... so fluffy?' }, mode: 'dialogue' },
      { speaker: 'Floobert', text: { pl: 'Wubwub! Zleeborp fnk fnk!', en: 'Wubwub! Zleeborp fnk fnk!' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nie rozumiem ani słowa. Ale chyba jest szczęśliwe? Jak... szczeniak. Kosmiczny szczeniak.', en: 'I don\'t understand a word. But it seems happy? Like... a puppy. A space puppy.' }, mode: 'dialogue' },
      { speaker: 'Floobert', text: { pl: 'Bzzzt! Floof floof! Mrrphh! ✨', en: 'Bzzzt! Floof floof! Mrrphh! ✨' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Dobra, słuchaj... zostań tutaj i nie ruszaj niczego. I tak mam dość problemów.', en: 'Right, listen... stay here and don\'t touch anything. I have enough problems as it is.' }, mode: 'dialogue' },
      { speaker: 'Floobert', text: { pl: 'Gleebok! Gleebok! 🐾', en: 'Gleebok! Gleebok! 🐾' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Tak, tak, "gleebok". Świetnie. Idę dalej.', en: 'Yes, yes, "gleebok". Great. Moving on.' }, mode: 'monologue' },
    ],
  },

  'npc-floobert-keycode-found': {
    id: 'npc-floobert-keycode-found',
    lines: [
      { speaker: 'Floobert', text: { pl: 'BZZZT! Spznx spznx! Mrrpfff wubwub!', en: 'BZZZT! Spznx spznx! Mrrpfff wubwub!' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Floobert, ty... ty wiedziałeś o tym kodzie wcześniej?', en: 'Floobert, you... you knew about this code all along?' }, mode: 'dialogue' },
      { speaker: 'Floobert', text: { pl: 'Gleebok! Fnk fnk fnk! ⭐', en: 'Gleebok! Fnk fnk fnk! ⭐' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Oczywiście. Obce istoty wiedzą wszystko. Czemu miałoby być inaczej.', en: 'Of course. Alien beings know everything. Why would it be any different.' }, mode: 'monologue' },
      { speaker: 'Floobert', text: { pl: 'Zleeborp! 🐾💫', en: 'Zleeborp! 🐾💫' }, mode: 'dialogue' },
    ],
  },

  // Whiteboard with "Hello World"
  'm0-whiteboard': {
    id: 'm0-whiteboard',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Co ja tu widzę — „hello world"?', en: 'What am I looking at — "hello world"?' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Kosmos to jeden wielki terminal programistyczny...', en: 'Space is one giant developer terminal...' }, mode: 'monologue' },
    ],
  },

  'm0-whiteboard-oscilloscope-cleared': {
    id: 'm0-whiteboard-oscilloscope-cleared',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ktoś dopisał pod spodem: „Array stable. Drift compensated."', en: 'Someone added below: "Array stable. Drift compensated."' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Czyli kalibracja wróciła do normy. Statek może przez chwilę odetchnąć.', en: 'So calibration is back to normal. The ship can breathe for a moment.' }, mode: 'monologue' },
    ],
  },

  // Board revisit after keycode found
  'm0-board-nav-revisit': {
    id: 'm0-board-nav-revisit',
    lines: [
      { speaker: 'system', text: { pl: 'Dexo — [DANE USZKODZONE — SEKTOR PAMIĘCI 0x7F NADPISANY]', en: 'Dexo — [DATA CORRUPTED — MEMORY SECTOR 0x7F OVERWRITTEN]' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: '„Nadpisany"... Nie uszkodzony. Nadpisany. Ktoś to zrobił celowo.', en: '"Overwritten"... Not damaged. Overwritten. Someone did this deliberately.' }, mode: 'monologue' },
    ],
  },

  'm0-arcade-asteroid-cleared': {
    id: 'm0-arcade-asteroid-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'SEKTOR WYDOBYCIA: STABILNY', en: 'MINING SECTOR: STABLE' }, mode: 'system', autoAdvance: 1800 },
      { speaker: 'astronaut', text: { pl: 'Asteroidy zniknęły z tego sektora. Przynajmniej na razie nikt nie musi tu biegać z gaśnicą.', en: 'Asteroids gone from this sector. For now at least, no one needs to run around with a fire extinguisher.' }, mode: 'monologue' },
    ],
  },

  'm0-arcade-memory-cleared': {
    id: 'm0-arcade-memory-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'KOLEJKA TRANSMISJI: OPRÓŻNIONA', en: 'TRANSMISSION QUEUE: CLEARED' }, mode: 'system', autoAdvance: 1800 },
      { speaker: 'astronaut', text: { pl: 'Dobra. Nowe sygnały są uporządkowane. Mogę zostawić ten dekoder w spokoju.', en: 'Good. New signals are sorted. I can leave this decoder in peace.' }, mode: 'monologue' },
    ],
  },

  'm0-arcade-oscilloscope-cleared': {
    id: 'm0-arcade-oscilloscope-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'MACIERZ POMIAROWA: STABILNA', en: 'MEASUREMENT ARRAY: STABLE' }, mode: 'system', autoAdvance: 1800 },
      { speaker: 'astronaut', text: { pl: 'Przebieg trzyma poziom. Jeśli coś jeszcze się rozjedzie, to już nie z mojej winy.', en: 'The trace is holding steady. If anything else goes off the rails, it\'s not my fault.' }, mode: 'monologue' },
    ],
  },
};
