import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the shuttle down on the ice apron before the frozen forge
  'm2-gate-intro': {
    id: 'm2-gate-intro',
    lines: [
      { speaker: 'system', text: { pl: 'LĄDOWANIE POTWIERDZONE — KSIĘŻYC 2, LODOWY SZELF', en: 'TOUCHDOWN CONFIRMED — MOON 2, ICE SHELF' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Nad promem wznosi się cyklopowa brama towarowa. Zorza pełznie po kominach, które nie dymią.', en: 'A cyclopean cargo gate rises over the shuttle. The aurora crawls across chimneys that do not smoke.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'To nie cisza dżungli. Tamta zamilkła, ale żyła. Ta jest inna: maszyna zatrzymana w pół ruchu. Bogactwo na wyciągnięcie ręki — i martwe na amen.', en: 'This is not the jungle\'s silence. That one went quiet, but lived. This is different: a machine stopped mid-motion. Riches within arm\'s reach — and stone dead.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Cel wybrały nowe czujniki. Wykuwnia serii Odyssey-F — nadawała powtarzalny sygnał nawigacyjny. Ziemia wysłała tu maszyny przed ludźmi. Widzę ją. Widzę wszystko.', en: 'The new sensors chose this target. An Odyssey-F forge, broadcasting a repeating nav signal. Earth sent machines here before people. I can see it. I can see everything.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I to jest problem. Dane wejściowe: nadmiar. Widzę czternaście tysięcy obiektów i nie umiem ich uszeregować. Powiedz mi, który jest ważny. Bądź moją korą przedczołową.', en: 'And that is the problem. Input data: excess. I see fourteen thousand objects and cannot rank them. Tell me which one matters. Be my prefrontal cortex.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Kern. Schodzę na grunt — pierwszy raz, nie przez wykres. Zakładam stanowisko w wartowni bramy i zostaję tu z tobą. Ten księżyc pachnie rafinowanym Synaptitem. Nawet przez hełm.', en: 'Kern. Boots on the ground — for the first time, not through a chart. I am setting up a station in the gate guardhouse and staying here with you. This moon smells of refined Synaptit. Even through the helmet.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'A ja zostaję na statku. Łączność i wachta medyczna przy kapsule Harrisa. Ktoś musi patrzeć na jego wykresy — regeneracja trwa dłużej, niż powinna.', en: 'And I stay on the ship. Comms and medical watch at Harris\'s pod. Someone has to watch his charts — the regeneration is running longer than it should.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cel Księżyca 2: obudź tę wykuwnię, stacja po stacji. Zacznij od bramy. Żeby ją otworzyć, najpierw przeczytaj plan. Wartownia czeka.', en: 'The Moon 2 objective: wake this forge, station by station. Start at the gate. To open it, read the plan first. The guardhouse is waiting.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_GATE_INTRO_SEEN] },
  },

  // Guardhouse console — quest hub for "Rozruch Bramy"
  'm2-guardhouse-start': {
    id: 'm2-guardhouse-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA WARTOWNI — online. Zasilanie awaryjne. Brama: ZAMKNIĘTA.', en: 'GUARDHOUSE CONSOLE — online. Emergency power. Gate: CLOSED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Brama otworzy się dopiero po rozruchu trzech węzłów grzewczych — w kolejności. Nie improwizuj. Najpierw przywróć ciepło wartowni ręcznym zaworem, potem przeczytaj tablicę planu. Tablica poda kolejność.', en: 'The gate opens only after the three heat nodes boot — in order. Do not improvise. First restore the guardhouse warmth with the manual valve, then read the roadmap board. The board gives the order.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Znam ten układ. To znaczy — znam takie układy. Rób po kolei, Dexo. Ta brama nie wybacza pośpiechu.', en: 'I know this layout. That is — I know layouts like it. Go in order, Dexo. This gate does not forgive haste.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Rozruch Bramy — zawór, tablica, trzy węzły w kolejności, meldunek.', en: '◆ NEW MISSION: Gate Boot — valve, board, three nodes in order, report.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_BOOT_ACTIVE], activateQuest: 'q-m2-gate-boot' },
  },
  'm2-guardhouse-waiting': {
    id: 'm2-guardhouse-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Wciąż czekam: najpierw zawór ciepła, potem tablica planu, potem węzły grzewcze jeden, dwa, trzy — w tej kolejności. Wróć tu z meldunkiem, gdy sekwencja się domknie.', en: 'Still waiting: the heat valve first, then the roadmap board, then the heat nodes one, two, three — in that order. Come back with a report once the sequence closes.' }, mode: 'dialogue' },
    ],
  },
  'm2-guardhouse-report': {
    id: 'm2-guardhouse-report',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Sekwencja domknięta. Zawór, tablica, trzy węzły w kolejności. Wartownia ciepła, węzły grzeją. Melduję.', en: 'Sequence closed. Valve, board, three nodes in order. The guardhouse is warm, the nodes are heating. Reporting.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kolejność była poprawna. Kieruję ciepło w gródź główną. Brama ustępuje.', en: 'The order was correct. I am routing heat into the main bulkhead. The gate is yielding.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Kod bramy — seria Odyssey, standard. — Wpisany. Otwiera się.', en: 'The gate code — Odyssey series, standard. — Keyed in. It opens.' }, mode: 'dialogue' },
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
      { speaker: 'astronaut', text: { pl: 'Ręczny zawór, oszroniony na biało. Przekręcam — rury jęczą, para bucha, wartownia z wolna wraca do ciepła. Mój oddech przestaje malować szron na szybie.', en: 'A manual valve, frosted white. I turn it — the pipes groan, steam bursts, the guardhouse slowly comes back to warmth. My breath stops painting frost on the glass.' }, mode: 'dialogue' },
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
      { speaker: 'astronaut', text: { pl: 'Etapy, kamienie milowe, kolejność rozruchu bramy: węzeł pierwszy, potem drugi, na końcu trzeci. A ostatni wiersz kończy się w połowie słowa, jakby ktoś zgasił to miejsce w pół myśli.', en: 'Stages, milestones, the gate boot order: node one, then two, node three last. And the final line ends mid-word, as if someone switched this place off in mid-thought.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisane: jeden, dwa, trzy. To jest plan. Trzymaj się go — a jeśli węzeł zaprotestuje, to znaczy, że wyprzedziłeś kolejność.', en: 'Recorded: one, two, three. That is the plan. Hold to it — and if a node protests, it means you got ahead of the order.' }, mode: 'dialogue' },
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
      { speaker: 'astronaut', text: { pl: 'Mapa drogowa całej wykuwni. Pięć stacji, każda martwa. Jest co budzić.', en: 'A roadmap of the whole forge. Five stations, each one dead. There is plenty to wake.' }, mode: 'dialogue' },
    ],
  },

  // Black box — the sting: an independent docking log later than the freeze
  'm2-black-box': {
    id: 'm2-black-box',
    lines: [
      { speaker: 'system', text: { pl: 'CZARNA SKRZYNKA WARTOWNI — log dokowań, niezależne zasilanie.', en: 'GUARDHOUSE BLACK BOX — docking log, independent power.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ta skrzynka pisała, gdy reszta zamarzła. Ostatni wpis dokowania jest późniejszy niż zamrożenie fabryki. Sygnatura statku — niezarejestrowana. Ktoś tu wylądował po tym, jak wszystko umarło.', en: 'This box kept writing when the rest froze. The last docking entry is later than the factory freeze. Ship signature — unregistered. Someone landed here after everything died.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Ktoś chodził po tej martwej wykuwni. Zapisuję jako fakt, nie teorię. To już nie archeologia. To wizyta.', en: 'Someone walked this dead forge. I log it as fact, not theory. This is no longer archaeology. It is a visit.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_BLACKBOX_DOCKING_SEEN] },
  },
  'm2-black-box-seen': {
    id: 'm2-black-box-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Log dokowań. Wciąż ten sam wpis, wciąż późniejszy niż powinien być. Wciąż mrozi mnie bardziej niż ten księżyc.', en: 'The docking log. Still the same entry, still later than it should be. Still colder than this moon.' }, mode: 'monologue' },
    ],
  },

  // Ingot tram — riches as scenery until the network runs; return-path payoff
  'm2-ingot-tram-locked': {
    id: 'm2-ingot-tram-locked',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik pełen sztab rafinowanego Synaptitu, zamarznięty w pół wyjazdu. Manifest bezpieczeństwa go trzyma — bez sieci ani drgnie. Fortuna, której nie mogę ruszyć.', en: 'A tram full of refined Synaptit ingots, frozen mid-exit. The safety manifest holds it — without the network it will not budge. A fortune I cannot move.' }, mode: 'monologue' },
    ],
  },
  'm2-ingot-tram-delivered': {
    id: 'm2-ingot-tram-delivered',
    lines: [
      { speaker: 'system', text: { pl: 'MANIFEST WAGONIKA: DOSTAWA 001 — PRZYJĘTA.', en: 'TRAM MANIFEST: DELIVERY 001 — ACCEPTED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Dojechał własnym napędem. Dostawa spóźniona o lata, domknięta przez nowy plan. Fabryka dotrzymała słowa — tyle że nikt już nie czekał.', en: 'It arrived under its own power. A delivery years late, closed by the new plan. The factory kept its word — only no one was still waiting.' }, mode: 'dialogue' },
    ],
  },

  // Dr Kern — anchoring NPC, evolves through the moon (most-specific first)
  'm2-kern-default': {
    id: 'm2-kern-default',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Rozstawiam stanowisko. Skanery złóż, próbniki, termos. Ten księżyc ma pod skorupą całą kartę z podręcznika geologii Synaptitu — czuję to. Idź, otwórz bramę. Ja tu zostaję.', en: 'Setting up my station. Deposit scanners, samplers, a thermos. This moon has a whole page from the Synaptit geology textbook under its crust — I can feel it. Go, open the gate. I stay here.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-gate': {
    id: 'm2-kern-gate',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Brama otwarta. Wartownia ciepła. Wygląda mi to na dom na najbliższe dni. Wracaj z każdym kamieniem milowym, Dexo — chcę wiedzieć, co budzisz.', en: 'The gate is open. The guardhouse is warm. Looks like home for the coming days. Come back with every milestone, Dexo — I want to know what you wake.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-sopel': {
    id: 'm2-kern-sopel',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Obudziliście robota? Dobrze. To miejsce potrzebuje rąk, nie tylko rozkazów. Ta hala serwisowa to była kiedyś załoga. Nie lubię o tym myśleć zbyt długo.', en: 'You woke a robot? Good. This place needs hands, not just orders. That service bay was a crew once. I do not like to think about it too long.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-deadlock': {
    id: 'm2-kern-deadlock',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Fala świateł z rozjazdowni doszła aż do bramy. Widziałam ją stąd. Ktoś wreszcie rozpiął ten węzeł. Sieć torów żyje — a to znaczy, że ruda w końcu ruszy.', en: 'The wave of lights from the junction reached the gate. I saw it from here. Someone finally unknotted that tangle. The rail network lives — which means the ore will finally move.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-ingot': {
    id: 'm2-kern-ingot',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Pierwszy wytop! Temperatura, którą wam podałam, trzymała się co do stopnia, prawda? — ...Powiedzmy, że czytałam dobrą dokumentację. Dawno temu. Grunt, że sztaby są czyste.', en: 'The first melt! The temperature I gave you held to the degree, did it not? — ...Let us say I read good documentation. A long time ago. What matters is the ingots are pure.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-planning': {
    id: 'm2-kern-planning',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Cała fabryka nuci. Patrzę na tablice wartowni i widzę, jak plan biegnie od stacji do stacji jak krew. Nie sądziłam, że dożyję tego widoku. A jednak.', en: 'The whole factory hums. I watch the guardhouse boards and see the plan run station to station like blood. I did not think I would live to see it. And yet.' }, mode: 'dialogue' },
    ],
  },
  'm2-kern-epilogue': {
    id: 'm2-kern-epilogue',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Zanim odlecisz — muszę ci coś powiedzieć. Lokalizację tej wykuwni wskazała moja własna, przedstartowa ekspertyza złóż. Podpisałam ją lata temu. — W głosie mam dumę. I coś jeszcze, czego na razie nie nazywam.', en: 'Before you fly — I have to tell you something. The location of this forge was pointed to by my own pre-launch deposit survey. I signed it years ago. — There is pride in my voice. And something else I am not naming yet.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zapamiętuję to, dr Kern. Nie jako oskarżenie. Jako fakt. Tak jak pani nauczyła.', en: 'I am remembering that, Dr Kern. Not as an accusation. As a fact. The way you taught me.' }, mode: 'dialogue' },
    ],
  },

  // Exam VI — Protokół Ekspedycyjny VI
  'm2-exam-protocol-6-done': {
    id: 'm2-exam-protocol-6-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY VI — „MAPA DROGOWA": zaliczony.', en: 'EXPEDITION PROTOCOL VI — "ROADMAP": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Szósty protokół odzyskany: kamień milowy to obserwowalny efekt, nie raport; minimalny łańcuch kroków do celu; jasne „kiedy krok jest skończony" i warunek odwrotu. Dziś ta doktryna otworzyła bramę.', en: 'Sixth protocol recovered: a milestone is an observable effect, not a report; the minimal chain of steps to the goal; a clear "when a step is done" and a retreat condition. Today that doctrine opened the gate.' }, mode: 'dialogue' },
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
      { speaker: 'dr Kern', text: { pl: 'Dostawa spóźniona o lata — i domknięta w godzinę. Załaduj sztaby na prom, Dexo. Zasłużyliście oboje: ty i ta maszyna.', en: 'A delivery years late — and closed in an hour. Load the ingots onto the shuttle, Dexo. You both earned it: you and that machine.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'Kontrola przedlotowa. Harris, słyszysz? ...Harris.', en: 'Preflight check. Harris, do you copy? ...Harris.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Medbay mówi: regeneracja. Znowu przesunięta. Przestaję wierzyć w ten harmonogram — a właśnie nauczyliście mnie, co znaczy zatruty harmonogram.', en: 'Medbay says: regeneration. Delayed again. I am starting to distrust this schedule — and you just taught me what a poisoned schedule means.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_RETURN_GATE_SEEN, FLAGS.M2_DELIVERY_001] },
  },
};
