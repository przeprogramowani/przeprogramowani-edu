import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — bridges m0 into Moon 1: crew hibernating, CORE AI in field mode,
  // the VOID facility reveal, the mission objective, and the operator-certificate rule.
  'm1-landing-intro': {
    id: 'm1-landing-intro',
    lines: [
      { speaker: 'system', text: { pl: 'LĄDOWANIE POTWIERDZONE — KSIĘŻYC 1, PAS GŁÓWNY', en: 'TOUCHDOWN CONFIRMED — MOON 1, MAIN BELT' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Silniki stygną. Nad lądowiskiem zamyka się dach dżungli — zielony, gęsty, żywy.', en: 'The engines are cooling. A jungle canopy closes over the landing site — green, dense, alive.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'No dobrze. Wylądowałem. Na obcym księżycu. Sam. Zapiszcie w kronikach: nawet się nie trzęsę. Prawie.', en: 'All right. I have landed. On an alien moon. Alone. Note it in the chronicles: I am not even shaking. Mostly.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Nie całkiem sam, Dexo. Jestem w łączu twojego skafandra. Earth HQ przeprowadziło zdalną mitygację moich uszkodzeń — działam w trybie awaryjnym: głos i terminal. Nic więcej.', en: 'Not entirely alone, Dexo. I am in your suit uplink. Earth HQ ran a remote mitigation of my damage — I am running in degraded field mode: voice and terminal. Nothing more.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Na statku nie mogłeś wykrztusić ani słowa. Miło w końcu słyszeć, że ktoś tu ma plan.', en: 'Back on the ship you could not get a single word out. Nice to finally hear that somebody here has a plan.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Plan mam. Sensorów nie mam. Nie widzę tego, co ty widzisz — bez sensorów jestem autouzupełnianiem z ambicjami.', en: 'A plan I have. Sensors I do not. I cannot see what you see — without sensors I am autocomplete with ambitions.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Przypomnę stan misji: Odyssey doleciał z orbity Ziemi do Pasa Głównego. Na czas przelotu Moreau i Harris wrócili do hibernacji — statek w trybie awaryjnym nie utrzyma obudzonej załogi. Na powierzchnię zszedłeś ty, bo to ty jesteś specjalistą od systemów AI.', en: 'Mission recap: Odyssey flew from Earth orbit to the Main Belt. For the transit, Moreau and Harris returned to hibernation — the ship in emergency power mode cannot sustain a waking crew. You descended to the surface because you are the AI-systems specialist.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Harris mówił: „zrozumiesz, dlaczego cię wybrali. I dlaczego to musi być właśnie ty". Zaczynam rozumieć. Wolałbym nie.', en: 'Harris said: "you will understand why they chose you. And why it has to be you." I am starting to understand. I would rather not.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'A to przede mną to nie skała. To kopuła. Wieże wydobywcze, przenośniki, anteny — ktoś zbudował tu całą placówkę i oddał ją dżungli.', en: 'And that thing ahead of me is not rock. It is a dome. Mining towers, conveyors, antennas — someone built an entire facility here and handed it over to the jungle.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Znam te sylwetki z archiwów. To instalacja wydobywcza Kolektywu VOID. Byli tu przed nami, Dexo.', en: 'I know these silhouettes from the archives. This is a VOID Collective extraction facility. They were here before us, Dexo.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli VOID nie tylko zniszczył Synaptit na Ziemi. Najpierw przylecieli tutaj — po jego źródło. Ludzi już nie ma. Zostały same ich maszyny.', en: 'So VOID did not just destroy Earth\'s Synaptit. They came here first — for its source. The people are gone. Only their machines remain.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Cel Księżyca 1 jest dwuczęściowy. Po pierwsze: potwierdzić złoże Synaptitu. Po drugie: przywrócić moje sensory podstawowe — używając infrastruktury VOID i wsparcia Earth HQ.', en: 'The Moon 1 objective has two parts. One: confirm a Synaptit deposit. Two: restore my basic sensors — using VOID\'s own infrastructure and Earth HQ support.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I jedna zasada, którą musisz znać: maszyny VOID słuchają każdego, kto nosi ważny certyfikat operatora. Terminale certyfikacyjne wciąż działają. Zdawaj ich przechwycone testy, a placówka zacznie z nami współpracować.', en: 'And one rule you must know: VOID machines obey anyone carrying a valid operator certificate. The certification terminals still work. Pass their captured tests, and the facility will start cooperating with us.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zdawać egzaminy u wroga, żeby jego roboty nosiły za mnie skrzynki. Dobrze, że Harris tego nie widzi.', en: 'Sitting the enemy\'s exams so their robots will carry my crates. Good thing Harris cannot see this.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Zaczynamy od archiwum operacji na północy lądowiska. Tam VOID trzymał dokument opisujący, po co w ogóle tu kopali.', en: 'We start at the operation archive on the north side of the landing site. That is where VOID kept the document describing why they were digging here at all.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_LANDING_INTRO_SEEN] },
  },

  // Operation archive — quest activation: the Entropy-scrambled PRD
  'm1-operation-archive-start': {
    id: 'm1-operation-archive-start',
    lines: [
      { speaker: 'system', text: { pl: 'ARCHIWUM OPERACJI: PRD_OPERACJA_SYNAPTIT — integralność 41%', en: 'OPERATION ARCHIVE: SYNAPTIT_OPERATION_PRD — integrity 41%' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Otwieram... i od razu żałuję. Cele mieszają się z bibliotekami, decyzje z konfiguracją. Jakby ktoś wrzucił cały dokument do blendera.', en: 'I open it... and immediately regret it. Goals mixed with libraries, decisions with configuration. As if someone fed the whole document into a blender.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To nie jest zwykłe uszkodzenie. To robota Entropii — wirus przemieszał zapisy tak, że dokument wygląda na kompletny, ale nie da się według niego działać.', en: 'This is no ordinary corruption. This is Entropy\'s work — the virus shuffled the records so the document looks complete, yet nothing can be executed from it.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'A my tego kontraktu potrzebujemy. Opisuje, gdzie jest złoże i jaki rezultat miała dać ta operacja. Bez niego maszyny VOID nie wskażą nam drogi.', en: 'And we need that contract. It describes where the deposit is and what outcome this operation was meant to deliver. Without it, the VOID machines cannot point us anywhere.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli moje zadanie: oddzielić kontrakt operacji — cel i granice — od technicznego szumu. Terminal certyfikacyjny na południu lądowiska sprawdzi, czy rozumiem tę granicę. Idę zdawać.', en: 'So my task: separate the operation contract — the goal and its boundaries — from the technical noise. The certification terminal in the south of the landing site will check whether I understand that boundary. Off to sit the test.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA: Odzyskaj kontrakt operacji', en: 'NEW MISSION: Recover the Operation Contract' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-prd-contract' },
  },
  'm1-operation-archive-done': {
    id: 'm1-operation-archive-done',
    lines: [
      { speaker: 'system', text: { pl: 'ARCHIWUM OPERACJI: kontrakt odzyskany. Trzy sektory poszukiwawcze oznaczone.', en: 'OPERATION ARCHIVE: contract recovered. Three search sectors marked.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy raz od przebudzenia mam do czego przyłożyć mapę. Wschodnia galeria prowadzi prosto do oznaczonych sektorów — tam zaczynamy szukać złoża.', en: 'For the first time since waking I have something to hold a map against. The eastern gallery leads straight to the marked sectors — that is where the deposit search begins.' }, mode: 'dialogue' },
    ],
  },

  // Navigation marker
  'm1-landing-marker': {
    id: 'm1-landing-marker',
    lines: [
      { speaker: 'system', text: { pl: 'ZNACZNIK NAWIGACYJNY: brak współrzędnych. Oczekiwanie na kontrakt operacji z archiwum.', en: 'NAVIGATION MARKER: no coordinates. Waiting for the operation contract from the archive.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Nawet słupek na tym lądowisku wie, że bez celu nie ma trasy.', en: 'Even a signpost on this landing site knows there is no route without a goal.' }, mode: 'monologue' },
    ],
  },
  'm1-landing-marker-done': {
    id: 'm1-landing-marker-done',
    lines: [
      { speaker: 'system', text: { pl: 'ZNACZNIK NAWIGACYJNY: trasa wyznaczona — trzy anomalie akustyczne, sektor wschodni.', en: 'NAVIGATION MARKER: route plotted — three acoustic anomalies, eastern sector.' }, mode: 'system', autoAdvance: 2400 },
    ],
  },

  // Dead guard drones — dread flavor
  'm1-inactive-drone': {
    id: 'm1-inactive-drone',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Dron bojowy VOID. Martwy — mam nadzieję. Pancerz porósł mchem, ale lufy wyglądają na podejrzanie zadbane.', en: 'A VOID combat drone. Dead — I hope. The armour is mossed over, yet the barrels look suspiciously well kept.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Cztery takie stoją wokół lądowiska. Ktoś tu kiedyś bardzo nie chciał gości. Postaram się nie być gościem, tylko operatorem.', en: 'Four of these stand around the landing site. Someone here really did not want visitors once. I will try to be an operator, not a visitor.' }, mode: 'monologue' },
    ],
  },

  // Scout R-4 — polite, apologetic VOID unit with a damaged index
  'm1-disabled-scout': {
    id: 'm1-disabled-scout',
    lines: [
      { speaker: 'Scout R-4', text: { pl: 'Jednostka Scout R-4 Kolektywu VOID, do usług. Przepraszam za stan mojego indeksu operacji — jest, hm, niekompletny. Widzę instrukcje wydobycia, biblioteki i architekturę, ale nie potrafię wskazać celu misji.', en: 'Unit Scout R-4 of the VOID Collective, at your service. My apologies for the state of my operation index — it is, hm, incomplete. I can see extraction instructions, libraries, and architecture, but I cannot identify the mission objective.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ono przeprasza. Zwiadowca wroga przeprasza mnie i chce służyć. Nie wiem, czy to urocze, czy przerażające.', en: 'It is apologising. An enemy scout is apologising to me and wants to serve. I cannot decide whether that is charming or terrifying.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'R-4 służy każdemu, kto nosi ważny certyfikat operatora — to infrastruktura, nie sojusznik. Jego indeks zjadł ten sam szum co archiwum: odzyskaj kontrakt operacji, a R-4 rozpozna właściwy wpis nawigacyjny.', en: 'R-4 serves anyone carrying a valid operator certificate — it is infrastructure, not an ally. Its index was eaten by the same noise as the archive: recover the operation contract, and R-4 will identify the correct navigation entry.' }, mode: 'dialogue' },
    ],
  },
  'm1-disabled-scout-done': {
    id: 'm1-disabled-scout-done',
    lines: [
      { speaker: 'Scout R-4', text: { pl: 'Kontrakt rozpoznany, operatorze. Wpis ECHO_TRACE_MANIFEST pasuje do trzech sektorów akustycznych — przekazałem go do konsoli we wschodniej galerii.', en: 'Contract recognised, operator. The ECHO_TRACE_MANIFEST entry matches three acoustic sectors — I forwarded it to the console in the eastern gallery.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Porządek w decyzjach przywrócił też trasę. Dobra robota, R-4. ...Właśnie pochwaliłem robota VOID. Za daleko to zaszło.', en: 'Order in the decisions restored the route as well. Good work, R-4. ...I just complimented a VOID robot. This has gone too far.' }, mode: 'dialogue' },
    ],
  },

  // Surveyor C-7 — matter-of-fact canopy surveyor; counts everything
  'm1-canopy-surveyor': {
    id: 'm1-canopy-surveyor',
    lines: [
      { speaker: 'Surveyor C-7', text: { pl: 'Jednostka Surveyor C-7 Kolektywu VOID. Stan skanu: południowy skraj lądowiska, 1442 pnie, 6 tras wydobywczych, 0 opisów rezultatu operacji.', en: 'Unit Surveyor C-7 of the VOID Collective. Scan status: southern edge of the landing site, 1,442 trunks, 6 extraction routes, 0 descriptions of the operation outcome.' }, mode: 'dialogue' },
      { speaker: 'Surveyor C-7', text: { pl: 'Bez rezultatu nie odróżnię trasy właściwej od pięciu pozostałych. Odzyskaj kontrakt z północnego archiwum, a odfiltruję trasy realizujące niewłaściwy cel.', en: 'Without the outcome I cannot tell the correct route from the other five. Recover the contract from the northern archive, and I will filter out the routes serving the wrong objective.' }, mode: 'dialogue' },
    ],
  },
  'm1-canopy-surveyor-done': {
    id: 'm1-canopy-surveyor-done',
    lines: [
      { speaker: 'Surveyor C-7', text: { pl: 'Aktualizacja: cel operacji pasuje wyłącznie do wschodniej galerii. Odrzucono: 5 tras. Zachowano: 1. Oznaczyłem bezpieczne podejście do wrót Echa.', en: 'Update: the operation objective matches only the eastern gallery. Discarded: 5 routes. Kept: 1. I marked a safe approach to the Echo gate.' }, mode: 'dialogue' },
    ],
  },

  // Locked eastern gate — explicit unlock instruction
  'm1-echo-door-locked': {
    id: 'm1-echo-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WROTA WSCHODNIEJ GALERII: zablokowane. Wymagany certyfikat operatora VOID.', en: 'EASTERN GALLERY GATE: locked. VOID operator certificate required.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Instrukcja jest prosta: zdaj „Przechwycony test VOID: Kontrakt PRD" w terminalu certyfikacyjnym na południu lądowiska. Z certyfikatem wrota ustąpią.', en: 'The instruction is simple: pass the "Captured VOID Test: The PRD Contract" at the certification terminal in the south of the landing site. With the certificate, the gate will yield.' }, mode: 'dialogue' },
    ],
  },

  // PRD contract exam — completion and revisit
  'm1-exam-prd-contract-done': {
    id: 'm1-exam-prd-contract-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: KONTRAKT PRD — PRZYZNANY', en: 'OPERATOR CERTIFICATE: PRD CONTRACT — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'system', text: { pl: 'MISJA UKOŃCZONA: kontrakt operacji odzyskany. Wschodnia galeria odblokowana.', en: 'MISSION COMPLETE: operation contract recovered. Eastern gallery unlocked.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Placówka właśnie zmieniła zdanie na twój temat. Od tej chwili maszyny VOID wykonują twoje polecenia — formalnie jesteś ich operatorem.', en: 'The facility has just changed its mind about you. From this moment the VOID machines execute your commands — formally, you are their operator.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zdałem egzamin u ludzi, którzy zgasili Ziemię. I nawet jestem z siebie dumny. Nie wiem, co o tym myśleć.', en: 'I passed an exam written by the people who switched off Earth. And I am actually proud of myself. I do not know what to make of that.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Pomyślisz po drodze. Wschodnia galeria prowadzi do Rozpadliny Echa — tam według kontraktu zaczyna się poszukiwanie złoża.', en: 'Think it over on the way. The eastern gallery leads to the Echo Depths — according to the contract, that is where the deposit search begins.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-prd-contract-already': {
    id: 'm1-exam-prd-contract-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat "Kontrakt PRD" już przyznany.', en: 'Certificate "PRD Contract" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
