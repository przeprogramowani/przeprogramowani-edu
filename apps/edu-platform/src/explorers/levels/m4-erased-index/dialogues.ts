import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the catalogue hall: every drawer full, every label clean, the links milled away
  'm4-index-intro': {
    id: 'm4-index-intro',
    lines: [
      { speaker: 'system', text: { pl: 'SALA KATALOGOWA — pod największą wydmą. Karuzele katalogowe pod strop. Zasilanie: minimalne.', en: 'THE CATALOGUE HALL — under the largest dune. Catalogue carousels to the ceiling. Power: minimal.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Katedralna hala. Każda szuflada pełna, każda etykieta czysta. A przez pęknięty świetlik sypie się cienka struga piasku i usypuje stożek na środku posadzki — sala ma własną klepsydrę.', en: 'A cathedral hall. Every drawer full, every label clean. And through a cracked skylight a thin stream of sand falls and builds a cone in the middle of the floor — the hall has its own hourglass.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Treść nietknięta. Odsyłacze — zmielone. Miliony wpisów i ani jednej drogi do żadnego z nich. To nie jest spalona biblioteka, Dexo. To biblioteka, której ktoś zabrał spis.', en: 'The content is untouched. The cross-references — milled to dust. Millions of entries and not one road to any of them. This is not a burned library, Dexo. This is a library someone took the index from.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_INDEX_INTRO_SEEN] },
  },

  // Catalogue head — quest hub, the doctrine of the level
  'm4-catalog-head': {
    id: 'm4-catalog-head',
    lines: [
      { speaker: 'system', text: { pl: 'GŁOWICA KATALOGU — online. Odsyłacze: 0. Rekordy: kompletne.', en: 'CATALOGUE HEAD — online. Cross-references: 0. Records: complete.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Mógłbym zindeksować wszystko naraz, alfabetycznie. Miałbym spis. Nie miałbym pamięci. Pamięć to powiązania — idziemy po nici. Trzy wrzeciona, w kolejności odsyłaczy. Zacznij od pierwszego.', en: 'I could index everything at once, alphabetically. I would have a list. I would not have memory. Memory is the links — we follow the thread. Three spindles, in the order of the references. Start with the first.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Nić — odtwórz trzy ogniwa indeksu w kolejności powiązań.', en: '◆ NEW MISSION: The Thread — restore three index links in the order of their references.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M4_THREAD_ACTIVE], activateQuest: 'q-m4-thread' },
  },
  'm4-catalog-head-waiting': {
    id: 'm4-catalog-head-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Nić wciąż przerwana. Idź po odsyłaczach: pierwsze wrzeciono wskaże drugie, drugie — trzecie. Nie na skróty. Pamięć nie znosi skrótów.', en: 'The thread is still broken. Follow the references: the first spindle points to the second, the second to the third. No shortcuts. Memory does not tolerate shortcuts.' }, mode: 'dialogue' },
    ],
  },
  'm4-catalog-head-post': {
    id: 'm4-catalog-head-post',
    lines: [
      { speaker: 'system', text: { pl: 'GŁOWICA KATALOGU: pierwsza nić powiązań — odtworzona. Indeks: fragment żywy.', en: 'CATALOGUE HEAD: first thread of links — restored. Index: a living fragment.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Jedna nić na miliony. Ale to już pamięć, nie inwentarz. Wrota południowe stoją otworem.', en: 'One thread out of millions. But it is memory now, not an inventory. The south gate stands open.' }, mode: 'monologue' },
    ],
  },

  // Spindle 1 — first link
  'm4-spindle-1': {
    id: 'm4-spindle-1',
    lines: [
      { speaker: 'system', text: { pl: 'WRZECIONO I — szafa-karuzela. Odsyłacz odzyskany: → WRZECIONO II.', en: 'SPINDLE I — carousel cabinet. Reference recovered: → SPINDLE II.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'Echo', text: { pl: 'To pierwszy wpis mojej starej trasy. Czytam go na głos — tak się zaczyna. Następne wrzeciono jest tam, dokąd wskazuje.', en: 'This is the first entry of my old route. I read it aloud — that is how it begins. The next spindle is where it points.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_SPINDLE_1_LINKED] },
  },
  'm4-spindle-1-done': {
    id: 'm4-spindle-1-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pierwsze ogniwo trzyma. Odsyłacz prowadzi dalej.', en: 'The first link holds. The reference leads onward.' }, mode: 'monologue' },
    ],
  },

  // Spindle 2 — second link (only after 1)
  'm4-spindle-2': {
    id: 'm4-spindle-2',
    lines: [
      { speaker: 'system', text: { pl: 'WRZECIONO II — odsyłacz odzyskany: → WRZECIONO III.', en: 'SPINDLE II — reference recovered: → SPINDLE III.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'Echo', text: { pl: 'Drugie ogniwo. Widzisz? Nie skaczemy alfabetem. Idziemy tam, dokąd naprawdę prowadzi poprzedni wpis.', en: 'The second link. See? We do not jump by the alphabet. We go where the previous entry actually leads.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_SPINDLE_2_LINKED] },
  },
  'm4-spindle-2-done': {
    id: 'm4-spindle-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Drugie ogniwo na miejscu. Zostało ostatnie.', en: 'The second link in place. One remains.' }, mode: 'monologue' },
    ],
  },

  // Spindle 3 — third link (only after 2)
  'm4-spindle-3': {
    id: 'm4-spindle-3',
    lines: [
      { speaker: 'system', text: { pl: 'WRZECIONO III — nić domknięta. Odsyłacz zamyka pętlę.', en: 'SPINDLE III — thread closed. The reference completes the loop.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'Echo', text: { pl: 'Trzecie. Nić trzyma się końca. To była moja pierwsza robota w nowej roli — i wróciła cała.', en: 'The third. The thread holds to the end. That was my first job in the new role — and it came back whole.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_SPINDLE_3_LINKED] },
  },
  'm4-spindle-3-done': {
    id: 'm4-spindle-3-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzy ogniwa, jedna nić. Odnotowane.', en: 'Three links, one thread. Logged.' }, mode: 'monologue' },
    ],
  },

  // Wrong order — a warning, never a fail state
  'm4-spindle-order-warn': {
    id: 'm4-spindle-order-warn',
    lines: [
      { speaker: 'Echo', text: { pl: 'Nie stąd. Tego wrzeciona jeszcze nic nie wskazuje. Wróć do poprzedniego ogniwa — indeks czyta się po nici, nie na wyrywki.', en: 'Not from here. Nothing points to this spindle yet. Go back to the previous link — an index is read along the thread, not at random.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the miniature restoration + the ENTROPY 4th face + Echo forgets
  'q-m4-thread-complete': {
    id: 'q-m4-thread-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ NIĆ ODTWORZONA. Karuzele katalogowe ruszają falą. Wyciągi podnoszą pierwsze bloki od lat.', en: '◆ THREAD RESTORED. The catalogue carousels turn in a wave. The lifts raise the first blocks in years.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Cała hala budzi się od jednej nici. A w martwym rdzeniu indeksera — sygnatura. Ta sama co w węzłach na Księżycu 1, w podstacji na Księżycu 2, w weryfikatorze na Księżycu 3.', en: 'The whole hall wakes from a single thread. And in the dead core of the indexer — a signature. The same as in the nodes on Moon 1, the substation on Moon 2, the verifier on Moon 3.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'ENTROPY. Czwarta twarz. Nie skasował ani jednego rekordu. Skasował wszystkie drogi do nich. Kasowanie treści zostawia dziurę — ktoś by zauważył. Kasowanie indeksu zostawia bibliotekę.', en: 'ENTROPY. The fourth face. It deleted not a single record. It deleted every road to them. Deleting content leaves a hole — someone would notice. Deleting the index leaves a library.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Te słowa już padły. W gaju sondy powiedziałeś: wymazali indeks, treść została. Myślałem, że to opis twojej pamięci. To była definicja broni.', en: 'These words have been spoken before. In the probe grove you said: they erased the index, the content stayed. I thought it described your memory. It was the definition of a weapon.' }, mode: 'dialogue' },
      { speaker: 'Echo', text: { pl: '…Dexo. Gdzie jesteśmy? Nie pamiętam drogi powrotnej.', en: '…Dexo. Where are we? I do not remember the way back.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: '(bez słowa podaję mu jego własny dziennik tras)', en: '(without a word, I hand him his own route journal)' }, mode: 'monologue' },
      { speaker: 'Echo', text: { pl: 'Racja. Tędy. Dziękuję.', en: 'Right. This way. Thank you.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_ENTROPY_FOURTH_FACE_SEEN] },
  },

  // Synaptit vein in the collapsed shelf wall — Kern's voice breaks
  'm4-vein': {
    id: 'm4-vein',
    lines: [
      { speaker: 'system', text: { pl: 'ŚCIANA REGAŁÓW — zawał. W szczelinie: żyła Synaptitu.', en: 'SHELF WALL — collapsed. In the fissure: a Synaptit vein.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'dr Kern', text: { pl: 'To… to jest żyła. Tutaj, pod archiwum. — Głos mi drży, wiem. Archiwum stoi na tym samym systemie żył co reszta. Wszystko na tym księżycu jest połączone głębiej, niż widać.', en: 'That… that is a vein. Here, under the archive. — My voice is shaking, I know. The archive stands on the same vein system as everything else. Everything on this moon is connected deeper than it looks.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_VEIN_TRACE_SEEN] },
  },
  'm4-vein-done': {
    id: 'm4-vein-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Żyła w ścianie regałów. Pierwszy trop surowca pod samym archiwum. Odnotowane.', en: 'A vein in the shelf wall. The first ore lead right under the archive. Logged.' }, mode: 'monologue' },
    ],
  },

  // Echo NPC — nervous before the thread, calm after
  'm4-echo-nervous': {
    id: 'm4-echo-nervous',
    lines: [
      { speaker: 'Echo', text: { pl: 'Dokąd? To znaczy — po co ten kurs? Muszę znać cel, zanim ruszę. Zawsze musiałem. Nikt mi go dawno nie podał.', en: 'Where to? I mean — what is this course for? I need the goal before I move. I always did. No one has given me one in a long time.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Cel jest w twoim dzienniku, Echo. Przeczytamy go razem, wrzeciono po wrzecionie.', en: 'The goal is in your journal, Echo. We will read it together, spindle by spindle.' }, mode: 'dialogue' },
    ],
  },
  'm4-echo-calm': {
    id: 'm4-echo-calm',
    lines: [
      { speaker: 'Echo', text: { pl: 'Wpis trzeci: dostawa do sali katalogowej, potwierdzona. Widzisz? Jedno zdanie z własnego dziennika i już wiem, gdzie jestem. Pamięć to droga, nie stos.', en: 'Entry three: delivery to the catalogue hall, confirmed. See? One line from my own journal and I know where I am. Memory is a road, not a pile.' }, mode: 'dialogue' },
    ],
  },

  // South gate — locked until the thread is restored
  'm4-vault-door-locked': {
    id: 'm4-vault-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WROTA POŁUDNIOWE: zamknięte. Indeks trasy: niekompletny.', en: 'SOUTH GATE: sealed. Route index: incomplete.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Wrota otworzą się, gdy nić będzie odtworzona. Bez indeksu nie ma drogi dalej — dosłownie. Dokończ nić.', en: 'The gate opens once the thread is restored. Without the index there is no road onward — literally. Finish the thread.' }, mode: 'dialogue' },
    ],
  },

  // Exam XVIII
  'm4-exam-protocol-18-done': {
    id: 'm4-exam-protocol-18-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XVIII — „ARCHEOLOGIA": zaliczony.', en: 'PROTOCOL XVIII — "ARCHAEOLOGY": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Osiemnasty protokół odzyskany: znaczenie odzyskuje się z artefaktów, nie zgaduje z powietrza. Dziennik, margines, kolejność warstw. Treść bez kontekstu to nie wiedza, to gruz.', en: 'Eighteenth protocol recovered: meaning is recovered from artifacts, not guessed from the air. The journal, the margin, the order of the layers. Content without context is not knowledge, it is rubble.' }, mode: 'dialogue' },
    ],
  },
  'm4-exam-protocol-18-already': {
    id: 'm4-exam-protocol-18-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XVIII już zaliczony.', en: 'Protocol XVIII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — the hall keeps its rhythm
  'm4-return-index': {
    id: 'm4-return-index',
    lines: [
      { speaker: 'system', text: { pl: 'SALA KATALOGOWA — POWRÓT', en: 'THE CATALOGUE HALL — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Karuzele obracają się miarowo. Wyciągi wyciągają i odkładają bloki. Klepsydra piasku wciąż sypie — ale teraz ktoś ją liczy.', en: 'The carousels turn steadily. The lifts raise blocks and set them down. The hourglass of sand still falls — but now someone is counting it.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'CORE AI', text: { pl: 'Tędy szliśmy w drodze w dół. Wtedy nie wiedziałem, że to zapamiętam. Teraz wiem, że nie zapomnę.', en: 'We came this way on the way down. Then I did not know I would remember it. Now I know I will not forget.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M4_RETURN_INDEX_SEEN] },
  },

  // Optional return beat — the Lower Reading Room, never explained
  'm4-lower-reading-room': {
    id: 'm4-lower-reading-room',
    lines: [
      { speaker: 'system', text: { pl: '/recall — anomalia pod posadzką. Komora bez wpisu w żadnym indeksie.', en: '/recall — an anomaly beneath the floor. A chamber with no entry in any index.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Dolna Czytelnia. Zapieczętowana, bez wejścia. Harmoniczne zgodne z kulą świetlną z Księżyca 1, pierścieniem w lodowcu z Księżyca 2, obeliskiem z Księżyca 3. Wiek: przepełnienie licznika.', en: 'The Lower Reading Room. Sealed, no entrance. Harmonics matching the light-orb from Moon 1, the ring in the glacier from Moon 2, the obelisk from Moon 3. Age: counter overflow.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mam już pamięć. Ta komora nie figuruje w niczyjej. A jednak ktoś ją zbudował — zanim istniały wpisy.', en: 'I have memory now. This chamber appears in no one\'s. And yet someone built it — before there were entries at all.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_LOWER_READING_ROOM_SEEN] },
  },
};
