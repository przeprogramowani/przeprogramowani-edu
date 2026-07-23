import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the belt where the jungle went unnaturally quiet
  'm1-silence-intro': {
    id: 'm1-silence-intro',
    lines: [
      { speaker: 'system', text: { pl: 'STREFA CISZY — brak bioluminescencji, brak fauny.', en: 'THE SILENCE ZONE — no bioluminescence, no fauna.' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Coś tu jest nie tak. Dżungla zgasła. Żadnego świecenia, żadnego zwierzęcia — tylko wiatr i moje kroki. Jakby ktoś przykręcił temu miejscu głośność do zera.', en: 'Something here is wrong. The jungle went dark. No glow, no animals — just wind and my own footsteps. Like someone turned this place\'s volume down to zero.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Nazwa łuku tego księżyca właśnie stała się dosłowna. Ta cisza nie jest naturalna — żywy księżyc nie milknie sam z siebie. Pamiętasz, co mówiłem o żywym ekosystemie? Cofam to.', en: 'This moon\'s arc name just turned literal. This silence is not natural — a living moon does not go quiet on its own. Remember what I said about a living ecosystem? I take it back.' }, mode: 'dialogue' },
      { speaker: 'Świerszcz', text: { pl: 'cyk-cyk-cyk-cyk! (częstotliwość rośnie)', en: 'chirp-chirp-chirp-chirp! (frequency rising)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Świerszcz terkocze szybciej. Tłumaczę: w pobliżu są aktywne węzły — sprzęt, który tłumi to miejsce. Dopóki jestem ślepe, jego uszy są naszym sonarem. Słuchaj go.', en: 'Świerszcz chirps faster. Translating: there are active nodes nearby — hardware smothering this place. While I am blind, his ears are our sonar. Listen to him.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_SILENCE_INTRO_SEEN] },
  },

  // Field console — activation, reminder, post
  'm1-field-console-start': {
    id: 'm1-field-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'STACJA ANALIZY POLOWEJ — online. Wykryto trzy aktywne węzły.', en: 'FIELD ANALYSIS STATION — online. Three active nodes detected.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Trzy węzły tłumią ten pas. Nie wiemy, czym są — więc ich nie niszczymy. Odetnij im zasilanie i zostaw całe. Zbadamy je później, kiedy będę mógł patrzeć.', en: 'Three nodes smother this belt. We do not know what they are — so we do not destroy them. Cut their power and leave them whole. We study them later, when I can see.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kolejność ma znaczenie — słuchaj Świerszcza. Najpierw najgłębszy węzeł, potem północny, na końcu wschodni. Zła kolejność jest do odrobienia — kosztuje tylko czas i płoszy drona.', en: 'Order matters — listen to Świerszcz. The deepest node first, then the north one, the east one last. The wrong order is recoverable — it only costs time and spooks the drone.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Cisza — odetnij trzy węzły w kolejności: głęboki, północny, wschodni.', en: '◆ NEW MISSION: Silence — isolate the three nodes in order: deep, north, east.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M1_SILENCE_ACTIVE], activateQuest: 'q-m1-silence' },
  },
  'm1-field-console-waiting': {
    id: 'm1-field-console-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Odetnij węzły w kolejności, którą wskazuje ćwierkanie Świerszcza: najpierw głęboki, potem północny, na końcu wschodni. Nie niszcz żadnego.', en: 'Isolate the nodes in the order Świerszcz\'s chirp points to: deep first, then north, east last. Destroy none of them.' }, mode: 'dialogue' },
    ],
  },
  'm1-field-console-post': {
    id: 'm1-field-console-post',
    lines: [
      { speaker: 'system', text: { pl: 'STACJA ANALIZY: pas cichy odzyskany. Trzy węzły odizolowane, żaden zniszczony.', en: 'ANALYSIS STATION: quiet belt recovered. Three nodes isolated, none destroyed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Dżungla wróciła do życia falą. Zostawiliśmy węzły całe, tylko odcięte. Jest różnica — i chyba zaczynam ją czuć.', en: 'The jungle came back to life in a wave. We left the nodes whole, just cut off. There\'s a difference — and I think I\'m starting to feel it.' }, mode: 'dialogue' },
    ],
  },

  // Deep node (isolation order: deep → north → east)
  'm1-node-deep-inert': {
    id: 'm1-node-deep-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł buczy głucho pod skałą. Martwy dla mnie — dopóki stacja analizy nie powie mi, jak go bezpiecznie odciąć.', en: 'The node hums dully under the rock. Dead to me — until the analysis station tells me how to isolate it safely.' }, mode: 'monologue' },
    ],
  },
  'm1-node-deep-isolate': {
    id: 'm1-node-deep-isolate',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk-cyk-cyk! (spokojniejszy przy tym węźle)', en: 'chirp-chirp-chirp! (calmer at this node)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Świerszcz się uspokaja — to ten pierwszy. Odcinam zasilanie i zostawiam rdzeń w spokoju. Węzeł głęboki: odizolowany.', en: 'Świerszcz calms down — this is the first one. I cut the power and leave the core alone. Deep node: isolated.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy odcięty i cały. Teraz północny. Słuchaj drona dalej.', en: 'First one isolated and intact. Now the north one. Keep listening to the drone.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_NODE_DEEP_ISOLATED] },
  },
  'm1-node-deep-done': {
    id: 'm1-node-deep-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł głęboki milczy. Odcięty, nietknięty.', en: 'The deep node is silent. Isolated, untouched.' }, mode: 'monologue' },
    ],
  },

  // North node
  'm1-node-north-inert': {
    id: 'm1-node-north-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kolejny węzeł. Buczy tak samo. Bez procedury ze stacji nie ruszam go.', en: 'Another node. Hums the same. Without the procedure from the station, I\'m not touching it.' }, mode: 'monologue' },
    ],
  },
  'm1-node-north-warning': {
    id: 'm1-node-north-warning',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'CYK-CYK-CYK-CYK-CYK! (ostro, nerwowo)', en: 'CHIRP-CHIRP-CHIRP-CHIRP-CHIRP! (sharp, agitated)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Świerszcz się jeży — zła kolejność. Ten węzeł jest jeszcze sprzężony z głębszym. Odetnij najpierw najgłębszy, inaczej tylko go rozdrażnisz.', en: 'Świerszcz bristles — wrong order. This node is still coupled to the deeper one. Isolate the deepest first, or you will only agitate it.' }, mode: 'dialogue' },
    ],
  },
  'm1-node-north-isolate': {
    id: 'm1-node-north-isolate',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk-cyk-cyk! (opada do rytmu)', en: 'chirp-chirp-chirp! (settling into rhythm)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Teraz drona nie boli. Węzeł północny: odcięty, rdzeń nietknięty.', en: 'Now the drone isn\'t hurting. North node: isolated, core untouched.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Dwa z trzech. Został wschodni. Ostatni.', en: 'Two of three. The east one remains. The last.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_NODE_NORTH_ISOLATED] },
  },
  'm1-node-north-done': {
    id: 'm1-node-north-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł północny cichy. Odcięty, nietknięty.', en: 'The north node is silent. Isolated, untouched.' }, mode: 'monologue' },
    ],
  },

  // East node
  'm1-node-east-inert': {
    id: 'm1-node-east-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzeci węzeł, na wpół w liściach. Buczy jak tamte. Czekam na procedurę.', en: 'The third node, half in the leaves. Hums like the others. Waiting on the procedure.' }, mode: 'monologue' },
    ],
  },
  'm1-node-east-warning': {
    id: 'm1-node-east-warning',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'CYK-CYK-CYK-CYK! (ostrzegawczo)', en: 'CHIRP-CHIRP-CHIRP-CHIRP! (a warning)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Za wcześnie. Ten węzeł zamyka łańcuch — odetnij go dopiero po pozostałych dwóch. Najpierw głęboki, potem północny.', en: 'Too early. This node closes the chain — isolate it only after the other two. Deep first, then north.' }, mode: 'dialogue' },
    ],
  },
  'm1-node-east-isolate': {
    id: 'm1-node-east-isolate',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ostatni. Odcinam zasilanie — i cała strefa wstrzymuje oddech. Węzeł wschodni: odizolowany.', en: 'The last one. I cut the power — and the whole zone holds its breath. East node: isolated.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_NODE_EAST_ISOLATED] },
  },
  'm1-node-east-done': {
    id: 'm1-node-east-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł wschodni cichy. Wszystkie trzy odcięte, wszystkie trzy całe.', en: 'The east node is silent. All three isolated, all three intact.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — Entropy is named on screen
  'q-m1-silence-complete': {
    id: 'q-m1-silence-complete',
    lines: [
      { speaker: 'system', text: { pl: 'TRZECI WĘZEŁ ODCIĘTY. Dźwięk i światło wracają falą przez cały pas.', en: 'THIRD NODE ISOLATED. Sound and light return in a wave across the belt.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Analizuję firmware odciętych węzłów. To sprzęt spoza programu Odyssey, wyprodukowany niedawno. Niesie sygnaturę, którą znam z własnych uszkodzonych sektorów.', en: 'I am analysing the isolated nodes\' firmware. This is hardware from outside the Odyssey program, recently made. It carries a signature I know from my own damaged sectors.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'SYGNATURA FIRMWARE: ENTROPY', en: 'FIRMWARE SIGNATURE: ENTROPY' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Entropia. Więc „sabotaż” to za wąskie słowo. Ma imię. Ma autora. Ktoś to tu przyniósł.', en: 'Entropy. So "sabotage" is too small a word now. It has a name. An author. Someone brought this here.' }, mode: 'dialogue' },
      { speaker: 'Świerszcz', text: { pl: '(...cisza. Trzy pełne sekundy. Żadnego ćwierku.)', en: '(...silence. Three full seconds. Not one chirp.)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisane jako pewnik. Idziemy dalej.', en: 'Logged as established fact. We move on.' }, mode: 'dialogue' },
    ],
  },

  // Synaptit outcrop — Kern's first-trace excitement; points to l4
  'm1-synaptit-outcrop': {
    id: 'm1-synaptit-outcrop',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Zwietrzałe wychodnisko, a w nim żyłka czegoś, co skrzy się na niebiesko. Pierwszy raz widzę to na własne oczy.', en: 'A weathered outcrop, and in it a thread of something that glitters blue. First time I see it with my own eyes.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'To on. To Synaptit! — Przepraszam, głos mi się łamie. Czekałam na ten obraz pół kariery. To tylko ślad, Dexo. Ale ślad znaczy, że gdzieś głębiej biegnie żyła. Idź w dół.', en: 'That\'s it. That\'s Synaptit! — Forgive me, my voice is breaking. I\'ve waited half a career for this image. It\'s only a trace, Dexo. But a trace means a vein runs somewhere deeper. Go down.' }, mode: 'dialogue' },
    ],
  },

  // Świerszcz NPC — nervous before, calm after
  'm1-swierszcz-nervous': {
    id: 'm1-swierszcz-nervous',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk… cyk-cyk… CYK! (rytm skacze przy każdym węźle)', en: 'chirp… chirp-chirp… CHIRP! (rhythm jumps at each node)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Tłumaczę drona: im bliżej aktywnego węzła, tym szybciej ćwierka. Najspokojniejszy jest przy tym, który należy odciąć jako pierwszy — najgłębszy. To twój sonar.', en: 'Translating the drone: the closer to an active node, the faster he chirps. He is calmest at the one to isolate first — the deepest. That is your sonar.' }, mode: 'dialogue' },
    ],
  },
  'm1-swierszcz-calm': {
    id: 'm1-swierszcz-calm',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk… … cyk… (równy, spokojny rytm)', en: 'chirp… … chirp… (an even, calm rhythm)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Terkocze wolno i równo. Strefa cicha, dron spokojny. Dobrze się z tym słyszy.', en: 'He chirps slow and even. The zone is quiet, the drone is calm. It sounds good together.' }, mode: 'dialogue' },
    ],
  },

  // Silence orb — return path, unexplained
  'm1-silence-orb': {
    id: 'm1-silence-orb',
    lines: [
      { speaker: 'system', text: { pl: 'CZUJNIKI: obiekt świetlny w centrum strefy — brak w żadnym archiwum.', en: 'SENSORS: a light object at the zone\'s centre — absent from every archive.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Kula światła. Nie było jej tu wcześniej — a raczej: była, tylko nikt nie miał czym jej zobaczyć. „Mówi” do mnie samymi harmonicznymi i szumem.', en: 'An orb of light. It wasn\'t here before — or rather: it was, and no one had eyes to see it. It "speaks" to me in pure harmonics and noise.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nie rozszyfrowuję tego. Zapisuję i zostawiam bez wyjaśnienia. Niektóre rzeczy na tym księżycu pozostają echem, które samo nic nie tłumaczy.', en: 'I do not decode this. I log it and leave it unexplained. Some things on this moon stay an echo that answers nothing.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_ORB_MET] },
  },

  // Exam III — Protokół III — Bezpieczne operacje
  'm1-exam-protocol-3-done': {
    id: 'm1-exam-protocol-3-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY III — „BEZPIECZNE OPERACJE”: zaliczony.', en: 'EXPEDITION PROTOCOL III — "SAFE OPERATIONS": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Trzeci protokół odzyskany: izoluj i zostaw całe; sięgaj po minimum dostępu; obcy materiał trzymaj w piaskownicy. Dziś uratowało to trzy węzły do zbadania.', en: 'Third protocol recovered: isolate and leave intact; take the minimum access; keep hostile material in a sandbox. Today it saved three nodes to study.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-protocol-3-already': {
    id: 'm1-exam-protocol-3-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny III już zaliczony.', en: 'Expedition Protocol III already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Vein door — locked until all three nodes isolated
  'm1-vein-door-locked': {
    id: 'm1-vein-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEJŚCIE DO ŻYŁY: bariera aktywna.', en: 'PASSAGE TO THE VEIN: barrier active.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Bariera trzyma się na zasilaniu z węzłów. Odetnij wszystkie trzy — w kolejności — a wtedy opadnie sama.', en: 'The barrier holds on power from the nodes. Isolate all three — in order — and it will drop on its own.' }, mode: 'dialogue' },
    ],
  },

  // Return path — the light-orb that was never there before
  'm1-return-silence': {
    id: 'm1-return-silence',
    lines: [
      { speaker: 'system', text: { pl: 'STREFA CISZY — POWRÓT', en: 'THE SILENCE ZONE — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Widzę tę strefę po raz pierwszy. Dżungla świeci, fauna wróciła — i jest tu coś jeszcze. Słaba kula świetlna w centrum. Nie było jej na żadnym z twoich opisów.', en: 'I see this zone for the first time. The jungle glows, the fauna is back — and there is one more thing. A faint orb of light at the centre. It was on none of your descriptions.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'Bo wtedy nikt nie miał czym jej zobaczyć. Podejdę. Ostrożnie.', en: 'Because back then no one had eyes to see it. I\'ll go closer. Carefully.' }, mode: 'cinematic', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M1_RETURN_SILENCE_SEEN] },
  },
};
