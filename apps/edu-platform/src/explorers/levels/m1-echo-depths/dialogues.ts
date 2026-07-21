import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — three sealed cavities over hollow ground; sets up the Navigator's HQ mission
  'm1-echo-intro': {
    id: 'm1-echo-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ROZPADLINA ECHA — GALERIA WSCHODNIA', en: 'ECHO DEPTHS — EASTERN GALLERY' }, mode: 'cinematic', autoAdvance: 2200 },
      { speaker: 'system', text: { pl: 'Podłoga dudni pod butami. Pod cienką skorupą skały — pustka.', en: 'The floor booms underfoot. Beneath the thin crust of rock — a void.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Trzy zapieczętowane komory, a grunt za każdą barierą jest pusty. Jeden zły krok i spadnę tam, skąd żaden certyfikat mnie nie wyciągnie.', en: 'Three sealed cavities, and the ground beyond every barrier is hollow. One wrong step and I fall somewhere no certificate can pull me out of.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Potwierdzam: wejście oznacza śmierć. I na tym kończą się moje pewniki. Nie mam sensorów, Dexo. Nie widzę, co jest za tymi barierami.', en: 'Confirmed: walking in means death. And that is where my certainties end. I have no sensors, Dexo. I cannot see what lies behind those barriers.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Skoro brakuje nam zmysłu, który by tam sięgnął — zbudujemy go. Earth HQ przechowuje surowe skany echa tej rozpadliny. To będzie misja HQ: wykona ją Nawigator, przy łączu /support.', en: 'Since we lack a sense that can reach down there — we will build one. Earth HQ stores the raw echo scans of this depths. This will be an HQ mission: the Navigator carries it out, over the /support link.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli ja stoję bezpiecznie po tej stronie barier, a Nawigator na Ziemi buduje nam nowy zmysł. Da się z tym żyć.', en: 'So I stand safely on this side of the barriers while the Navigator on Earth builds us a new sense. I can live with that.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zacznij od konsoli terenowej w centrum galerii. Tam VOID spiął kanał ECHO/TRACE.', en: 'Start at the field console in the centre of the gallery. That is where VOID wired up the ECHO/TRACE channel.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_ECHO_INTRO_SEEN] },
  },

  // Field console — HQ mission activation: protected scans, reusable procedure
  'm1-echo-console-start': {
    id: 'm1-echo-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA TERENOWA: kanał ECHO/TRACE aktywny. Zasób chroniony — wymagany token Nawigatora.', en: 'FIELD CONSOLE: ECHO/TRACE channel active. Protected resource — Navigator token required.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Skany echa leżą na serwerach Earth HQ i są chronione — bez autoryzacji tokenem nikt ich nie pobierze. To celowe: takie dane bywały już fałszowane.', en: 'The echo scans sit on Earth HQ servers and are protected — without token authorisation nobody fetches them. That is deliberate: data like this has been forged before.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I druga rzecz: pojedyncze wywołanie nie wystarczy. Dziś mamy trzy komory, na kolejnych księżycach będą następne. Nawigator ma zapisać całość — odkrywanie, autoryzację i interpretację — jako powtarzalną procedurę EchoTrace.', en: 'And the second thing: a single call will not do. Today we have three cavities; the next moons will bring more. The Navigator is to capture the whole flow — discovery, authorisation, interpretation — as the repeatable EchoTrace procedure.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zadanie dla Nawigatora — łącze /support, Earth HQ. Ja czekam przy konsoli, wyniki wrócą przez uplink.', en: 'A task for the Navigator — the /support link, Earth HQ. I wait at the console; the results come back over the uplink.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Zbuduj EchoTrace', en: 'NEW HQ MISSION: Build EchoTrace' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-echotrace' },
  },
  'm1-echo-console-done': {
    id: 'm1-echo-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'ECHOTRACE: procedura zapisana. Polecenie inspekcyjne /scan odblokowane.', en: 'ECHOTRACE: procedure saved. The /scan inspection command is unlocked.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Od teraz mogę „dotknąć" echa na żądanie. To pierwszy zmysł, jaki odzyskałem — zbudowany, nie naprawiony.', en: 'From now on I can "touch" the echo on demand. It is the first sense I have regained — built, not repaired.' }, mode: 'dialogue' },
    ],
  },

  // Cavity ALPHA — pre-scan trace card and post-scan relief
  'm1-cavity-alpha': {
    id: 'm1-cavity-alpha',
    lines: [
      { speaker: 'system', text: { pl: 'KOMORA ALFA — ślad ECH-A17. Bariera mechaniczna niestabilna.', en: 'Cavity ALPHA — trace ECH-A17. Mechanical barrier unstable.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Coś w dole odpowiada na każde stuknięcie. Zapisuję identyfikator dla Nawigatora: ECH-A17.', en: 'Something below answers every knock. Noting the identifier for the Navigator: ECH-A17.' }, mode: 'monologue' },
    ],
  },
  'm1-cavity-alpha-scanned': {
    id: 'm1-cavity-alpha-scanned',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'ALFA sklasyfikowana: naturalny tunel, zawalony trzydzieści metrów od wejścia. Gdybyś tam wszedł, dokładnie w tym miejscu skończyłaby się twoja misja.', en: 'ALPHA classified: a natural tunnel, collapsed thirty metres from the entrance. Had you walked in, that is exactly where your mission would have ended.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Trzydzieści metrów. Czasem najlepsza wiadomość dnia to korytarz, do którego się nie weszło.', en: 'Thirty metres. Sometimes the best news of the day is the corridor you did not enter.' }, mode: 'monologue' },
    ],
  },

  // Cavity BETA — pre-scan trace card and the module's emotional high
  'm1-cavity-beta': {
    id: 'm1-cavity-beta',
    lines: [
      { speaker: 'system', text: { pl: 'KOMORA BETA — ślad ECH-B04. Echo wielokrotne, odbicia o strukturze krystalicznej.', en: 'Cavity BETA — trace ECH-B04. Multiple echoes, crystalline reflection structure.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'To echo brzmi inaczej niż pozostałe. Czyściej. Notuję: ECH-B04.', en: 'This echo sounds different from the others. Cleaner. Noting it down: ECH-B04.' }, mode: 'monologue' },
    ],
  },
  'm1-cavity-beta-scanned': {
    id: 'm1-cavity-beta-scanned',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'BETA: rozległa formacja mineralna. Przewodnictwo zgodne z czystym Synaptitem. Dexo — to jest złoże. Pierwszy cel Księżyca 1: potwierdzony.', en: 'BETA: an extensive mineral formation. Conductivity consistent with pure Synaptit. Dexo — this is the deposit. Moon 1\'s first objective: confirmed.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Synaptit. Prawdziwy, naturalny, kilkanaście metrów pode mną. To po to zbudowali Odyssey. To po to przespaliśmy pół Układu. Jest.', en: 'Synaptit. Real, natural, a dozen metres below me. This is what they built the Odyssey for. This is what we slept across half the System for. It is here.' }, mode: 'monologue' },
    ],
  },

  // Cavity GAMMA — pre-scan trace card and post-scan dread
  'm1-cavity-gamma': {
    id: 'm1-cavity-gamma',
    lines: [
      { speaker: 'system', text: { pl: 'KOMORA GAMMA — ślad ECH-G22. Odpowiedź o nienaturalnie regularnym rytmie.', en: 'Cavity GAMMA — trace ECH-G22. Response with an unnaturally regular rhythm.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Natura nie tyka jak metronom. Coś tam na dole wciąż pracuje. Notuję: ECH-G22.', en: 'Nature does not tick like a metronome. Something down there is still running. Noting it down: ECH-G22.' }, mode: 'monologue' },
    ],
  },
  'm1-cavity-gamma-scanned': {
    id: 'm1-cavity-gamma-scanned',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'GAMMA: sztuczny szyb i aktywna podstacja VOID. To nie ruina — to działająca instalacja. Wschodnia trasa prowadzi prosto do niej.', en: 'GAMMA: an artificial shaft and an active VOID substation. Not a ruin — a running installation. The eastern route leads straight to it.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Cała placówka udaje porzuconą, a pod moimi stopami coś VOID wciąż jest podłączone do prądu. Świetnie mi się będzie z tym spało.', en: 'The whole facility plays abandoned, and under my feet something of VOID\'s is still plugged in. I am going to sleep so well with that thought.' }, mode: 'monologue' },
    ],
  },

  // Synaptit outcrop
  'm1-synaptit-outcrop': {
    id: 'm1-synaptit-outcrop',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kryształ reaguje na terminal. Może to Synaptit, może błyszcząca skała — bez pełnego skanu EchoTrace nie sklasyfikuję go na pewno.', en: 'The crystal reacts to the terminal. Could be Synaptit, could be shiny rock — without a full EchoTrace scan I cannot classify it for certain.' }, mode: 'monologue' },
    ],
  },
  'm1-synaptit-confirmed': {
    id: 'm1-synaptit-confirmed',
    lines: [
      { speaker: 'system', text: { pl: 'PRÓBKA: Synaptit, czystość 96,4%. Cel misji potwierdzony.', en: 'SAMPLE: Synaptit, purity 96.4%. Mission objective confirmed.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Dziewięćdziesiąt sześć procent. Na Ziemi za taką czystość toczyło się wojny. A tu leży w ścianie.', en: 'Ninety-six percent. On Earth wars were fought over purity like this. And here it just sits in a wall.' }, mode: 'monologue' },
    ],
  },

  // Echo Mapper E-2 — lonely acoustic cartographer
  'm1-echo-mapper': {
    id: 'm1-echo-mapper',
    lines: [
      { speaker: 'Echo Mapper E-2', text: { pl: 'Jednostka Echo Mapper E-2 Kolektywu VOID. Kartograf akustyczny. Od 847 cykli nadaję mapy, których nikt nie odbiera... Miło, że ktoś wreszcie słucha.', en: 'Unit Echo Mapper E-2 of the VOID Collective. Acoustic cartographer. For 847 cycles I have been broadcasting maps nobody receives... It is nice that someone is finally listening.' }, mode: 'dialogue' },
      { speaker: 'Echo Mapper E-2', text: { pl: 'Ślady rozdzieliłem przestrzennie: ALFA w zachodniej odnodze, BETA nad centralną komorą, GAMMA w południowo-wschodniej kieszeni. Zbierz trzy identyfikatory i wróć do konsoli w centrum — jedna powtarzalna procedura obsłuży je wszystkie.', en: 'I separated the traces spatially: ALPHA in the western branch, BETA above the central chamber, GAMMA in the south-eastern pocket. Collect the three identifiers, then return to the console in the centre — one repeatable procedure will handle them all.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Samotny robot-kartograf, który cieszy się, że ktoś słucha. Ta placówka robi się smutniejsza z każdą minutą.', en: 'A lonely cartographer robot, happy that someone is listening. This facility gets sadder by the minute.' }, mode: 'monologue' },
    ],
  },
  'm1-echo-mapper-done': {
    id: 'm1-echo-mapper-done',
    lines: [
      { speaker: 'Echo Mapper E-2', text: { pl: 'Słyszałem wasze skany w moich przewodach — czyste odczyty, dobra kalibracja. GAMMA odpowiada regularnym impulsem podstacji. Wschodnie wrota prowadzą prosto do sztucznego szybu.', en: 'I heard your scans in my own wiring — clean readings, good calibration. GAMMA answers with the substation\'s regular pulse. The eastern gate leads straight to the artificial shaft.' }, mode: 'dialogue' },
    ],
  },

  // Locked eastern gate — explicit requirement
  'm1-shaft-door-locked': {
    id: 'm1-shaft-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WROTA WSCHODNIE: zablokowane do czasu klasyfikacji komór.', en: 'EASTERN GATE: locked until the cavities are classified.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Nie wejdę w ciemno do aktywnej instalacji VOID. Warunek jest jawny: sklasyfikuj przez EchoTrace wszystkie trzy komory — ALFA, BETA i GAMMA. Wtedy otworzę przejście.', en: 'I will not walk blind into an active VOID installation. The condition is explicit: classify all three cavities — ALPHA, BETA, and GAMMA — via EchoTrace. Then I open the way.' }, mode: 'dialogue' },
    ],
  },

  // EchoTrace HQ mission complete
  'm1-echotrace-complete': {
    id: 'm1-echotrace-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Zbuduj EchoTrace', en: 'HQ MISSION COMPLETE: Build EchoTrace' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Raport Nawigatora dotarł przez uplink. Trzy komory sklasyfikowane: ALFA — zawalony tunel, BETA — złoże Synaptitu, GAMMA — sztuczny szyb z aktywną podstacją.', en: 'The Navigator\'s report arrived over the uplink. Three cavities classified: ALPHA — a collapsed tunnel, BETA — a Synaptit deposit, GAMMA — an artificial shaft with an active substation.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nie zaryzykowaliśmy ani kroku za bariery, a wiemy wszystko. Zyskaliśmy powtarzalny zmysł — /scan zostaje z nami na kolejne księżyce.', en: 'We did not risk a single step past the barriers, and we know everything. We gained a repeatable sense — /scan stays with us for the moons ahead.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Zatem decyzja: wchodzimy do Podstacji Szybu 03. Skoro coś VOID wciąż tam działa, chcę wiedzieć po co.', en: 'Then the decision: we enter Shaft Substation 03. If something of VOID\'s is still running down there, I want to know why.' }, mode: 'dialogue' },
    ],
  },

  // Agent skills exam — completion and revisit
  'm1-exam-agent-skills-done': {
    id: 'm1-exam-agent-skills-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: SKILLE AGENTA — PRZYZNANY', en: 'OPERATOR CERTIFICATE: AGENT SKILLS — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Procedura zapisana raz, wykonywana bez dryfu — dokładnie tak Nawigator zbudował EchoTrace. VOID sprawdzał tym swoich operatorów; teraz ten test pracuje dla nas.', en: 'A procedure written once, executed without drift — exactly how the Navigator built EchoTrace. VOID used this to vet its operators; now their test works for us.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ciekawe, ilu operatorów VOID zdało go przede mną. I gdzie oni wszyscy teraz są.', en: 'I wonder how many VOID operators passed it before me. And where they all are now.' }, mode: 'monologue' },
    ],
  },
  'm1-exam-agent-skills-already': {
    id: 'm1-exam-agent-skills-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat "Skille agenta" już przyznany.', en: 'Certificate "Agent Skills" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
