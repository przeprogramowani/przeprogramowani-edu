import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the shuttle down on the ice apron before the frozen forge
  'm2-gate-intro': {
    id: 'm2-gate-intro',
    lines: [
      { speaker: 'system', text: { pl: 'LĄDOWANIE POTWIERDZONE — KSIĘŻYC 2, LODOWY SZELF', en: 'TOUCHDOWN CONFIRMED — MOON 2, ICE SHELF' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Nad promem wznosi się cyklopowa brama towarowa. Zorza pełznie po kominach, które nie dymią.', en: 'A cyclopean cargo gate rises over the shuttle. The aurora crawls across chimneys that do not smoke.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'Cisza inna niż w dżungli. To cisza maszyny zatrzymanej w pół ruchu. Bogactwo tuż-tuż — i martwe na amen.', en: 'A silence unlike the jungle\'s. The silence of a machine stopped mid-motion. Riches right there — and stone dead.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Czujniki wróciły. Cel wybrały same — złapały powtarzalny sygnał nawigacyjny wykuwni serii Odyssey-F. Ziemia znów wysłała maszyny przed ludźmi.', en: 'The sensors are back. They chose the target themselves — they caught the repeating navigation signal of an Odyssey-F forge. Earth again sent machines ahead of people.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I od razu tonę. Widzę czternaście tysięcy obiektów naraz i nie umiem wskazać, który jest ważny. Na Księżycu 1 byłeś moimi oczami. Tu bądź moją korą przedczołową.', en: 'And at once I am drowning. I see fourteen thousand objects at once and cannot tell which one matters. On Moon 1 you were my eyes. Here, be my prefrontal cortex.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Z czujnika na priorytet w jeden księżyc. Awansowałem.', en: 'From sensor to priority in one moon. I have been promoted.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Kern. Pierwszy raz na gruncie, nie przez wykres. Rozkładam się w wartowni i zostaję tu z tobą — ten księżyc pachnie rafinowanym Synaptitem nawet przez hełm.', en: 'Kern. On the ground for the first time, not through a chart. I am setting up in the guardhouse and staying here with you — this moon smells of refined Synaptit even through the helmet.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Ja zostaję na statku. Łączność i wachta przy kapsule Harrisa. Jego regeneracja trwa dłużej, niż powinna — ktoś musi patrzeć na wykresy.', en: 'I stay on the ship. Comms and the watch at Harris\'s pod. His regeneration is running longer than it should — someone has to watch the charts.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cel prosty do wypowiedzenia: obudź tę fabrykę, stacja po stacji. Zacznij od bramy. Żeby ją otworzyć — najpierw przeczytaj plan. Wartownia czeka.', en: 'The objective is simple to say: wake this factory, station by station. Start at the gate. To open it — read the plan first. The guardhouse is waiting.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_GATE_INTRO_SEEN] },
  },

  // Guardhouse console — quest hub for "Rozruch Bramy"
  'm2-guardhouse-start': {
    id: 'm2-guardhouse-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA WARTOWNI — online. Zasilanie awaryjne. Brama: ZAMKNIĘTA.', en: 'GUARDHOUSE CONSOLE — online. Emergency power. Gate: CLOSED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Brama otworzy się dopiero po rozruchu trzech węzłów grzewczych — w kolejności. Najpierw ciepło z zaworu, potem tablica planu. Ona poda kolejność.', en: 'The gate opens only after the three heat nodes boot — in order. First warmth from the valve, then the roadmap board. It gives the order.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Znam ten układ. To znaczy — znam takie układy. Po kolei, Dexo. Ta brama nie wybacza pośpiechu.', en: 'I know this layout. That is — I know layouts like it. In order, Dexo. This gate does not forgive haste.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Rozruch Bramy — zawór, tablica, trzy węzły w kolejności, meldunek.', en: '◆ NEW MISSION: Gate Boot — valve, board, three nodes in order, report.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_BOOT_ACTIVE], activateQuest: 'q-m2-gate-boot' },
  },
  'm2-guardhouse-waiting': {
    id: 'm2-guardhouse-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Wciąż czekam: zawór, tablica, potem węzły jeden, dwa, trzy — w tej kolejności. Wróć z meldunkiem, gdy sekwencja się domknie.', en: 'Still waiting: the valve, the board, then nodes one, two, three — in that order. Come back to report once the sequence closes.' }, mode: 'dialogue' },
    ],
  },
  'm2-guardhouse-report': {
    id: 'm2-guardhouse-report',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Sekwencja domknięta. Zawór, tablica, trzy węzły w kolejności. Wartownia ciepła, węzły grzeją. Melduję.', en: 'Sequence closed. Valve, board, three nodes in order. The guardhouse is warm, the nodes are heating. Reporting.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kolejność była poprawna. Kieruję ciepło w gródź główną. Brama ustępuje.', en: 'The order was correct. I am routing heat into the main bulkhead. The gate is yielding.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Kody serii Odyssey. Standard. ...I już, otwiera się.', en: 'Odyssey-series codes. Standard. ...There — it opens.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Wpisała go, zanim CORE AI zdążył go wyszukać. O jeden takt za szybko. ...Zapamiętuję.', en: 'She keyed it in before CORE AI could look it up. One beat too fast. ...I am remembering that.' }, mode: 'monologue' },
      { speaker: 'system', text: { pl: 'BRAMA: OTWARTA. Gródź serwisowa odblokowana.', en: 'GATE: OPEN. Service bulkhead unlocked.' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { setFlags: [FLAGS.M2_GATE_ONLINE], grantXp: 25 },
  },
  'm2-guardhouse-online': {
    id: 'm2-guardhouse-online',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA WARTOWNI: stabilna. Brama otwarta. Zakładka mapy drogowej dostępna.', en: 'GUARDHOUSE CONSOLE: stable. Gate open. Roadmap tab available.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'dr Kern', text: { pl: 'Brama stoi otworem. Stąd prowadzę resztę desantu. Idź w głąb wykuwni — ja pilnuję ciepła i mapy.', en: 'The gate stands open. I run the rest of the landing from here. Go deeper into the forge — I will keep the heat and the map.' }, mode: 'dialogue' },
    ],
  },

  // Valve — restore the guardhouse warmth
  'm2-valve': {
    id: 'm2-valve',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ręczny zawór, oszroniony na biało. Przekręcam — rury jęczą, para bucha. Oddech przestaje malować szron na szybie.', en: 'A manual valve, frosted white. I turn it — pipes groan, steam bursts. My breath stops painting frost on the glass.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Ciepło wraca. Teraz tablica planu — bez kolejności węzły ci nie odpowiedzą.', en: 'The heat returns. Now the roadmap board — without the order the nodes will not answer you.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_GUARDHOUSE_WARM] },
  },
  'm2-valve-done': {
    id: 'm2-valve-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Zawór otwarty, rury grzeją. Nie ma po co go dotykać drugi raz.', en: 'The valve is open, the pipes are heating. No reason to touch it a second time.' }, mode: 'monologue' },
    ],
  },

  // Roadmap board — the frozen factory plan, cut mid-line
  'm2-roadmap-board': {
    id: 'm2-roadmap-board',
    lines: [
      { speaker: 'system', text: { pl: 'MAPA DROGOWA WYKUWNI — ostatnia aktualizacja urwana w połowie wiersza.', en: 'FORGE ROADMAP — last update cut mid-line.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Etapy, kamienie milowe, kolejność rozruchu: węzeł pierwszy, drugi, na końcu trzeci. Ostatni wiersz urywa się w pół słowa — ktoś zgasił to miejsce w pół myśli.', en: 'Stages, milestones, the boot order: node one, two, node three last. The final line breaks off mid-word — someone switched this place off in mid-thought.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisane: jeden, dwa, trzy. To jest plan. Trzymaj się go — a jeśli węzeł zaprotestuje, wyprzedziłeś kolejność.', en: 'Recorded: one, two, three. That is the plan. Hold to it — and if a node protests, you got ahead of the order.' }, mode: 'dialogue' },
    ],
  },

  'm2-roadmap-board-live': {
    id: 'm2-roadmap-board-live',
    lines: [
      { speaker: 'system', text: { pl: 'MAPA DROGOWA WYKUWNI — zsynchronizowana z nowym planem głównym.', en: 'FORGE ROADMAP — synced with the new master plan.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Urwany wiersz dopisany do końca. Tablica znów płynie: etapy i kamienie milowe nowego planu, aż po wysyłkę. Dokończyliśmy komuś zdanie.', en: 'The cut-off line is written to its end. The board flows again: stages and milestones of the new plan, all the way to shipment. We finished someone\'s sentence.' }, mode: 'dialogue' },
    ],
  },

  // Heat nodes — ordered boot (1 → 2 → 3), mirrors the m1 l3 node pattern
  'm2-heat-node-1-cold': {
    id: 'm2-heat-node-1-cold',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł grzewczy, zimny jak reszta. Bez ciepła w wartowni nawet nie drgnie. Najpierw zawór.', en: 'A heat node, cold as the rest. Without warmth in the guardhouse it will not even stir. The valve first.' }, mode: 'monologue' },
    ],
  },
  'm2-heat-node-1-activate': {
    id: 'm2-heat-node-1-activate',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł pierwszy — tak mówiła tablica. Podaję ciepło, cewki łapią rozruch. Węzeł jeden: grzeje.', en: 'Node one — as the board said. I feed it heat, the coils catch. Node one: heating.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy w sekwencji, poprawnie. Teraz drugi.', en: 'First in the sequence, correct. Now the second.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_HEAT_NODE_1_ON] },
  },
  'm2-heat-node-1-done': {
    id: 'm2-heat-node-1-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł pierwszy grzeje równo. Zrobione.', en: 'Node one is heating steadily. Done.' }, mode: 'monologue' },
    ],
  },
  'm2-heat-node-2-cold': {
    id: 'm2-heat-node-2-cold',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kolejny węzeł. Bez planu i bez ciepła nie ruszam go.', en: 'Another node. Without the plan and without heat I am not touching it.' }, mode: 'monologue' },
    ],
  },
  'm2-heat-node-2-warning': {
    id: 'm2-heat-node-2-warning',
    lines: [
      { speaker: 'system', text: { pl: 'WĘZEŁ 2: sprzężony z węzłem 1. Rozruch odrzucony.', en: 'NODE 2: coupled to node 1. Boot rejected.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Zła kolejność. Ten węzeł czeka na pierwszy. Uruchom jeden przed dwoma — tablica mówiła wyraźnie.', en: 'Wrong order. This node waits on the first. Boot one before two — the board said so plainly.' }, mode: 'dialogue' },
    ],
  },
  'm2-heat-node-2-activate': {
    id: 'm2-heat-node-2-activate',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pierwszy grzeje, więc drugi przyjmie rozruch. Węzeł dwa: grzeje.', en: 'The first is heating, so the second will accept boot. Node two: heating.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Dwa z trzech. Został ostatni.', en: 'Two of three. The last one remains.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_HEAT_NODE_2_ON] },
  },
  'm2-heat-node-2-done': {
    id: 'm2-heat-node-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł drugi grzeje. Zostaje trzeci.', en: 'Node two is heating. The third remains.' }, mode: 'monologue' },
    ],
  },
  'm2-heat-node-3-cold': {
    id: 'm2-heat-node-3-cold',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzeci węzeł, najbliżej grodzi. Czeka na swoją kolej — a ja czekam na plan.', en: 'The third node, closest to the bulkhead. It waits its turn — and I wait on the plan.' }, mode: 'monologue' },
    ],
  },
  'm2-heat-node-3-warning': {
    id: 'm2-heat-node-3-warning',
    lines: [
      { speaker: 'system', text: { pl: 'WĘZEŁ 3: zamyka sekwencję. Rozruch odrzucony.', en: 'NODE 3: closes the sequence. Boot rejected.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Za wcześnie. Ten węzeł domyka bramę — uruchom go dopiero po pozostałych dwóch. Najpierw jeden, potem dwa.', en: 'Too early. This node closes the gate — boot it only after the other two. One first, then two.' }, mode: 'dialogue' },
    ],
  },
  'm2-heat-node-3-activate': {
    id: 'm2-heat-node-3-activate',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ostatni. Podaję ciepło — i cała gródź drży, budząc się z lat mrozu. Węzeł trzy: grzeje.', en: 'The last one. I feed it heat — and the whole bulkhead shudders, waking from years of frost. Node three: heating.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_HEAT_NODE_3_ON] },
  },
  'm2-heat-node-3-done': {
    id: 'm2-heat-node-3-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzeci węzeł grzeje. Wszystkie trzy w kolejności. Czas na meldunek w wartowni.', en: 'Node three is heating. All three in order. Time to report at the guardhouse.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — short "sequence complete, report" beat
  'q-m2-gate-boot-complete': {
    id: 'q-m2-gate-boot-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ SEKWENCJA ROZRUCHU ZAKOŃCZONA: zawór i trzy węzły w kolejności.', en: '◆ BOOT SEQUENCE COMPLETE: valve and three nodes in order.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Kolejność dotrzymana. Wróć do konsoli wartowni i zamelduj — wtedy skieruję ciepło w bramę główną.', en: 'The order was kept. Return to the guardhouse console and report — then I route the heat into the main gate.' }, mode: 'dialogue' },
    ],
  },

  // Gate control console — frozen pre, status post
  'm2-gate-console-frozen': {
    id: 'm2-gate-console-frozen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Konsola bramy, zamarznięta na kość. Ekran pod warstwą szronu. Otworzy się dopiero, gdy brama będzie online.', en: 'The gate console, frozen solid. The screen under a layer of frost. It opens only once the gate is online.' }, mode: 'monologue' },
    ],
  },
  'm2-gate-console-online': {
    id: 'm2-gate-console-online',
    lines: [
      { speaker: 'system', text: { pl: 'STATUS BRAMY: OTWARTA. Zakładka mapy drogowej: odmrożona.', en: 'GATE STATUS: OPEN. Roadmap tab: thawed.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'astronaut', text: { pl: 'Mapa drogowa całej wykuwni. Pięć stacji, każda martwa. Pierwsza na trasie: hala serwisowa, zaraz za gródzią.', en: 'A roadmap of the whole forge. Five stations, every one dead. First on the route: the service bay, just past the bulkhead.' }, mode: 'dialogue' },
    ],
  },

  // Black box — the sting: an independent docking log later than the freeze
  'm2-black-box': {
    id: 'm2-black-box',
    lines: [
      { speaker: 'system', text: { pl: 'CZARNA SKRZYNKA WARTOWNI — log dokowań, niezależne zasilanie.', en: 'GUARDHOUSE BLACK BOX — docking log, independent power.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ta skrzynka pisała, gdy reszta zamarzła. Ostatni wpis dokowania jest późniejszy niż zamrożenie fabryki. Sygnatura statku — niezarejestrowana.', en: 'This box kept writing when the rest froze. The last docking entry is later than the factory freeze. Ship signature — unregistered.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ktoś tu wylądował po tym, jak wszystko umarło.', en: 'Someone landed here after everything died.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisuję jako twardy fakt. Ślady z Księżyca 1 miały lata. Ten wpis jest świeży.', en: 'I log it as a hard fact. The traces on Moon 1 were years old. This entry is fresh.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_BLACKBOX_DOCKING_SEEN] },
  },
  'm2-black-box-seen': {
    id: 'm2-black-box-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Log dokowań. Wciąż ten sam wpis, wciąż późniejszy, niż powinien być. Mrozi mnie bardziej niż ten księżyc.', en: 'The docking log. Still the same entry, still later than it should be. It chills me more than this moon does.' }, mode: 'monologue' },
    ],
  },

  // Ingot tram — riches as scenery until the network runs; return-path payoff
  'm2-ingot-tram-locked': {
    id: 'm2-ingot-tram-locked',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik pełen sztab rafinowanego Synaptitu, zamarznięty w pół wyjazdu. Manifest bezpieczeństwa go trzyma — bez sieci ani drgnie.', en: 'A tram full of refined Synaptit ingots, frozen mid-exit. The safety manifest holds it — without the network it will not budge.' }, mode: 'monologue' },
    ],
  },
  'm2-ingot-tram-delivered': {
    id: 'm2-ingot-tram-delivered',
    lines: [
      { speaker: 'system', text: { pl: 'MANIFEST WAGONIKA: DOSTAWA 001 — PRZYJĘTA.', en: 'TRAM MANIFEST: DELIVERY 001 — ACCEPTED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Dojechał własnym napędem. Dostawa spóźniona o lata, domknięta nowym planem. Fabryka dotrzymała słowa — tylko nikt już nie czekał.', en: 'It arrived under its own power. A delivery years late, closed by the new plan. The factory kept its word — only no one was still waiting.' }, mode: 'dialogue' },
    ],
  },

  // Dr Kern — anchoring NPC, evolves through the moon (most-specific first)
  'm2-kern-default': {
    id: 'm2-kern-default',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Rozstawiam stanowisko — skanery złóż, próbniki, termos. Ten księżyc ma pod skorupą całą kartę z podręcznika. Idź, otwórz bramę. Ja zostaję.', en: 'Setting up my station — deposit scanners, samplers, a thermos. This moon has a whole page from the textbook under its crust. Go, open the gate. I stay here.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-gate': {
    id: 'm2-kern-gate',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Brama otwarta, wartownia ciepła — mój dom na najbliższe dni. Wracaj z każdym kamieniem milowym, Dexo. Chcę wiedzieć, co budzisz.', en: 'Gate open, guardhouse warm — my home for the coming days. Come back with every milestone, Dexo. I want to know what you wake.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-sopel': {
    id: 'm2-kern-sopel',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Obudziłeś robota? Dobrze. To miejsce potrzebuje rąk, nie tylko rozkazów. Ta hala serwisowa była kiedyś załogą. Nie lubię o tym myśleć za długo.', en: 'You woke a robot? Good. This place needs hands, not just orders. That service bay was a crew once. I do not like to think about it too long.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-deadlock': {
    id: 'm2-kern-deadlock',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Fala świateł z rozjazdowni doszła aż do bramy — widziałam ją stąd. Ktoś wreszcie rozpiął ten węzeł. Sieć żyje, więc ruda w końcu ruszy.', en: 'The wave of lights from the junction reached the gate — I saw it from here. Someone finally unknotted that deadlock. The network lives, so the ore will finally move.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-ingot': {
    id: 'm2-kern-ingot',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Pierwszy wytop! Temperatura, którą podałam, trzymała się co do stopnia — prawda? ...Powiedzmy, że czytałam dobrą dokumentację. Dawno temu. Grunt, że sztaby czyste.', en: 'The first melt! The temperature I gave you held to the degree — did it not? ...Let us say I read good documentation. A long time ago. What matters is the ingots are pure.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-planning': {
    id: 'm2-kern-planning',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Cała fabryka nuci. Patrzę na tablice i widzę, jak plan biegnie od stacji do stacji jak krew. Nie sądziłam, że dożyję tego widoku. A jednak.', en: 'The whole factory hums. I watch the boards and see the plan run station to station like blood. I did not think I would live to see it. And yet.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-epilogue': {
    id: 'm2-kern-epilogue',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Zanim odlecisz — lokalizację tej wykuwni wskazała moja własna, przedstartowa ekspertyza złóż. Podpisałam ją lata temu. Dobrze wiedzieć, że się nie myliłam. ...Chyba dobrze.', en: 'Before you fly — the location of this forge came from my own pre-launch deposit survey. I signed it years ago. It is good to know I was right. ...I think it is good.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zapisuję to, dr Kern. Na razie jako fakt. Tylko fakt.', en: 'I am noting that, Dr Kern. As a fact, for now. Only a fact.' }, mode: 'dialogue' },
    ],
  },

  // Exam VI — Protokół Ekspedycyjny VI
  'm2-exam-protocol-6-done': {
    id: 'm2-exam-protocol-6-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY VI — „MAPA DROGOWA": zaliczony.', en: 'EXPEDITION PROTOCOL VI — "ROADMAP": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Szósty protokół odzyskany: pracy nie układa się piętrami, lecz torami na wskroś. Jeden przejazd przez wszystkie warstwy, zakończony wynikiem, który da się sprawdzić. Pierwszy pełny przejazd puść tak wcześnie, jak pozwolą zależności — najkrótszy, który dowodzi, że plan działa.', en: 'Sixth protocol recovered: work is not stacked in floors but laid in tracks that run all the way through. One pass across every layer, ending in a result you can check. Set the first full pass running as early as dependencies allow — the shortest one that proves the plan works.' }, mode: 'dialogue' },
    ],
  },
  'm2-exam-protocol-6-already': {
    id: 'm2-exam-protocol-6-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny VI już zaliczony.', en: 'Expedition Protocol VI already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked service door — frozen bulkhead until the gate is online
  'm2-service-door-locked': {
    id: 'm2-service-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'GRÓDŹ SERWISOWA: zamarznięta. Brak ciepła w obwodzie.', en: 'SERVICE BULKHEAD: frozen. No heat in the circuit.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Ta gródź nie ustąpi, dopóki brama główna nie będzie online. Dokończ rozruch — wtedy ciepło dojdzie i tutaj.', en: 'This bulkhead will not yield until the main gate is online. Finish the boot — then the heat reaches here too.' }, mode: 'dialogue' },
    ],
  },

  // Return path — the ingot tram arrives; Kern's closing scene; Harris does not answer
  'm2-return-gate': {
    id: 'm2-return-gate',
    lines: [
      { speaker: 'system', text: { pl: 'BRAMA — POWRÓT', en: 'THE GATEHOUSE — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Zamarznięty wagonik ze sztabami dojeżdża do bramy własnym napędem. Manifest: DOSTAWA 001 — PRZYJĘTA.', en: 'The frozen ingot tram rolls up to the gate under its own power. Manifest: DELIVERY 001 — ACCEPTED.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'dr Kern', text: { pl: 'Dostawa spóźniona o lata — i domknięta w godzinę. Załaduj sztaby na prom, Dexo. Zasłużyliście oboje: ty i ta fabryka.', en: 'A delivery years late — and closed in an hour. Load the ingots onto the shuttle, Dexo. You both earned it: you and this factory.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'Kontrola przedlotowa. Harris, słyszysz? ...Harris.', en: 'Preflight check. Harris, do you copy? ...Harris.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Medbay mówi: regeneracja. Znowu przesunięta — i znów nikt jej nie zlecał. Przestaję wierzyć w ten harmonogram.', en: 'Medbay says: regeneration. Delayed again — and again no one ordered it. I am done trusting that schedule.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Z planowaniem online łączę wybuch transmisji z Księżyca 1 z nowym odczytem czujników. Rozbłysk napędu głębiej w Pasie zmienił kurs po tamtej transmisji. Pościg nie jest już wnioskiem — jest obiektem na mapie.', en: 'With planning online, I link the transmission burst from Moon 1 to a new sensor reading. A drive flare deeper in the Belt changed course after that burst. The pursuit is no longer an inference — it is an object on the map.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_RETURN_GATE_SEEN, FLAGS.M2_DELIVERY_001] },
  },
};
