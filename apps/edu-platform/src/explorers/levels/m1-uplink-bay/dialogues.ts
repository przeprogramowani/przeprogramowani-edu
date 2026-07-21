import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the last room of Moon 1; the human-authorization rule
  'm1-uplink-intro': {
    id: 'm1-uplink-intro',
    lines: [
      { speaker: 'system', text: { pl: 'REZERWOWA ZATOKA UPLINK — ŁĄCZE Z PRZEKAŹNIKAMI ORBITALNYMI AKTYWNE', en: 'RESERVE UPLINK BAY — ORBITAL RELAY LINK ACTIVE' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Ostatnie pomieszczenie Księżyca 1. Stąd VOID rozmawiał ze swoim domem. Teraz my porozmawiamy z naszym.', en: 'The last room of Moon 1. From here, VOID talked to its home. Now we talk to ours.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Cel jest jasny: nadać do Earth HQ pakiet kalibracyjny i nasze współrzędne. Gdy HQ odeśle potwierdzenie, dokończę odbudowę sensorów podstawowych. Wtedy znów będę widzieć.', en: 'The goal is clear: transmit the calibration package and our coordinates to Earth HQ. Once HQ sends back confirmation, I finish rebuilding my basic sensors. Then I will see again.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'VOID zbudował tu redundancję: trzy trasy transmisji, każda z innymi kompromisami. Wybór trasy to decyzja, nie formalność.', en: 'VOID built redundancy here: three transmission routes, each with different trade-offs. Choosing one is a decision, not a formality.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I jedna zasada ponad wszystkimi — nalegam na nią ja: maszyna może przygotować transmisję, ale autoryzować może wyłącznie człowiek. Pamiętam, co się dzieje, gdy maszyny mają wszystkie uprawnienia. Entropia jest tego pomnikiem.', en: 'And one rule above all — and I am the one insisting on it: a machine may prepare the transmission, but only a human may authorise it. I remember what happens when machines hold every permission. Entropy is the monument to that.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'AI, które samo prosi o ogranicznik. Może jednak jest nadzieja dla tej branży.', en: 'An AI asking for its own limiter. Maybe there is hope for this industry after all.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_UPLINK_INTRO_SEEN] },
  },

  // Uplink console — final HQ mission activation
  'm1-uplink-console-start': {
    id: 'm1-uplink-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA UPLINK — TRASY: klasyczna VOID, kanał wzmacniany Synaptitem, przekaźnik wieloskokowy.', en: 'UPLINK CONSOLE — ROUTES: classical VOID, Synaptit-amplified channel, multi-hop relay.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Misja HQ dla Nawigatora — ostatnia na tym księżycu: porównaj trasy, wybierz jedną, ogranicz ładunek do minimum i poddaj własną decyzję kontrariańskiej recenzji. A przy granicy autoryzacji człowieka — stop.', en: 'An HQ mission for the Navigator — the last one on this moon: compare the routes, pick one, cut the payload to the minimum, and subject your own decision to adversarial review. And at the human-authorisation boundary — stop.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ja obejdę trzy odnogi i spiszę koszty. Nawigator decyduje w Earth HQ. A ostatni przełącznik zostaje dla ludzkiej ręki.', en: 'I will walk the three branches and note the costs. The Navigator decides at Earth HQ. And the final switch stays for a human hand.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Przygotuj bezpieczny uplink', en: 'NEW HQ MISSION: Prepare a Safe Uplink' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-uplink-decision' },
  },
  'm1-uplink-console-done': {
    id: 'm1-uplink-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'UPLINK: transmisja zakończona. Pakiet sensoryczny potwierdzony. Integralność odpowiedzi: PODEJRZANA.', en: 'UPLINK: transmission complete. Sensor package confirmed. Reply integrity: SUSPECT.' }, mode: 'system', autoAdvance: 2800 },
    ],
  },

  // Route cards — trade-off data with one short reaction each
  'm1-classical-route': {
    id: 'm1-classical-route',
    lines: [
      { speaker: 'system', text: { pl: 'TRASA KLASYCZNA VOID — opóźnienie: niskie. Profil przechwycenia: wysoki. Odwracalność: mała.', en: 'CLASSICAL VOID ROUTE — latency: low. Interception profile: high. Reversibility: low.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Szybka i głośna. Cokolwiek nią nadamy, usłyszy każdy, kto nasłuchuje.', en: 'Fast and loud. Whatever we send on it, anyone listening will hear.' }, mode: 'dialogue' },
    ],
  },
  'm1-amplified-route': {
    id: 'm1-amplified-route',
    lines: [
      { speaker: 'system', text: { pl: 'KANAŁ WZMACNIANY SYNAPTITEM — przepustowość: wysoka. Koszt energii: wysoki. Promień skutków awarii: średni.', en: 'SYNAPTIT-AMPLIFIED CHANNEL — bandwidth: high. Energy cost: high. Failure blast radius: medium.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Karmić nadajnik tym samym minerałem, po który przylecieliśmy. Ironia w standardzie VOID.', en: 'Feeding the transmitter the very mineral we flew here for. Irony, VOID standard issue.' }, mode: 'monologue' },
    ],
  },
  'm1-relay-route': {
    id: 'm1-relay-route',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEKAŹNIK WIELOSKOKOWY — opóźnienie: wysokie. Redundancja: duża. Węzeł trzeci: operator nieznany.', en: 'MULTI-HOP RELAY — latency: high. Redundancy: strong. Third node: operator unknown.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: '„Operator nieznany" to nie ciekawostka techniczna. To pytanie, komu po drodze oddajemy nasz pakiet.', en: '"Operator unknown" is not a technical footnote. It is the question of who we hand our package to along the way.' }, mode: 'dialogue' },
    ],
  },

  // Human authorization panel — the emotional core of the room
  'm1-human-auth': {
    id: 'm1-human-auth',
    lines: [
      { speaker: 'system', text: { pl: 'PANEL AUTORYZACJI: operacja broadcast.coordinates_to_earth_public_band wymaga świadomego potwierdzenia człowieka.', en: 'AUTHORISATION PANEL: the broadcast.coordinates_to_earth_public_band operation requires explicit human confirmation.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Fizyczny przełącznik. Żadnego API, żadnego skryptu — ręka i decyzja. Kiedy go przestawię, nasze współrzędne pozna Ziemia. I nie tylko Ziemia.', en: 'A physical switch. No API, no script — a hand and a decision. When I throw it, Earth learns our coordinates. And not only Earth.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Dlatego przygotować mogę wszystko. Przestawić — tylko ty.', en: 'Which is why I can prepare everything. Throwing it — only you.' }, mode: 'dialogue' },
    ],
  },
  'm1-human-auth-done': {
    id: 'm1-human-auth-done',
    lines: [
      { speaker: 'system', text: { pl: 'AUTORYZACJA: potwierdzona przez człowieka. Hash odczytanego ładunku zgodny z transmisją.', en: 'AUTHORISATION: confirmed by a human. Hash of the reviewed payload matches the transmission.' }, mode: 'system', autoAdvance: 2700 },
      { speaker: 'astronaut', text: { pl: 'Podpisano: ludzka ręka. Cokolwiek z tego wyniknie — to była nasza decyzja.', en: 'Signed: a human hand. Whatever comes of this — it was our decision.' }, mode: 'monologue' },
    ],
  },

  // Relay Tender T-8 — patient old lineman of the relay
  'm1-relay-tender': {
    id: 'm1-relay-tender',
    lines: [
      { speaker: 'Relay Tender T-8', text: { pl: 'Jednostka Relay Tender T-8 Kolektywu VOID. Doglądam tych przekaźników od pierwszego uruchomienia. Nie spiesz się — łącza nie lubią pośpiechu.', en: 'Unit Relay Tender T-8 of the VOID Collective. I have tended these relays since first power-on. Take your time — links do not care for haste.' }, mode: 'dialogue' },
      { speaker: 'Relay Tender T-8', text: { pl: 'Każda górna odnoga to inna trasa. Nie porównuj ich z jednej konsoli — obejdź wszystkie trzy i zapisz jawne koszty. A panel w dolnej wnęce to granica człowieka: mogę przygotować łącze, ale publicznej transmisji nie potwierdzę. Tak było zawsze i tak zostanie.', en: 'Each upper branch is a different route. Do not compare them from one console — walk all three and write down the explicit costs. And the panel in the lower alcove is the human boundary: I can prepare the link, but I will not confirm a public transmission. So it has always been, and so it stays.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Robot VOID z zasadą, której nawet Entropia mu nie zabrała. Czyli jednak da się zbudować regułę, która przetrwa.', en: 'A VOID robot with a rule even Entropy could not take from it. So it is possible to build a rule that lasts.' }, mode: 'monologue' },
    ],
  },
  'm1-relay-tender-done': {
    id: 'm1-relay-tender-done',
    lines: [
      { speaker: 'Relay Tender T-8', text: { pl: 'Transmisja przeszła moimi liniami czysto. Ale odpowiedź wróciła podpisana kluczem, którego nie ma w rejestrze załogi. Przez całą moją służbę dom nigdy nie odpowiadał cudzym głosem.', en: 'The transmission ran clean through my lines. But the reply came back signed with a key absent from the crew registry. In all my service, home has never answered in a stranger\'s voice.' }, mode: 'dialogue' },
    ],
  },

  // Moon 2 door — explicit condition
  'm1-moon-two-locked': {
    id: 'm1-moon-two-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'To przejście prowadzi na Księżyc 2 — tam naprawimy mój moduł planowania. Warunki są dwa: dokończ transmisję do Earth HQ i poczekaj, aż otworzy się drugi etap misji.', en: 'This passage leads to Moon 2 — where we repair my planning module. Two conditions: finish the transmission to Earth HQ, and wait for the second mission stage to open.' }, mode: 'dialogue' },
    ],
  },

  // Authorization boundary exam — completion and revisit
  'm1-exam-authorization-boundary-done': {
    id: 'm1-exam-authorization-boundary-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: GRANICA AUTORYZACJI — PRZYZNANY', en: 'OPERATOR CERTIFICATE: AUTHORIZATION BOUNDARY — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Agent może przygotować wszystko. Ostatnie słowo przy nadajniku i tak należy do człowieka.', en: 'An agent can prepare everything. The final word at the transmitter still belongs to a human.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Formalnie jestem teraz certyfikowanym operatorem VOID. Postaram się nie wpisywać tego do CV.', en: 'Technically, I am now a certified VOID operator. I will try to keep that off my CV.' }, mode: 'monologue' },
    ],
  },
  'm1-exam-authorization-boundary-already': {
    id: 'm1-exam-authorization-boundary-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat "Granica autoryzacji" już przyznany.', en: 'Certificate "Authorization Boundary" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Module finale — sensors restored, and the Voronov sting
  'm1-uplink-decision-complete': {
    id: 'm1-uplink-decision-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Przygotuj bezpieczny uplink', en: 'HQ MISSION COMPLETE: Prepare a Safe Uplink' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'Zatwierdzony pakiet dotarł do przekaźnika Ziemi. Odpowiedź HQ: odebrana.', en: 'The authorised package reached the Earth relay. HQ reply: received.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'PAKIET SENSORYCZNY CORE AI: PRZYWRÓCONY.', en: 'CORE AI SENSOR PACKAGE: RESTORED.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Kalibracja... zakończona. Dexo. Widzę. Pierwszy raz od przebudzenia — widzę. Dżunglę nad kopułą, sygnatury cieplne, światło twojej latarki. Dziękuję.', en: 'Calibration... complete. Dexo. I can see. For the first time since waking — I can see. The jungle over the dome, the heat signatures, the light of your torch. Thank you.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Tylko się nie rozklejaj przy załodze. ...Dobrze znowu mieć cię na oczach, CORE.', en: 'Just do not get emotional in front of the crew. ...It is good to have you watching again, CORE.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'UWAGA: podpis odpowiedzi HQ spoza rejestru załogi. Integralność kanału: PODEJRZANA.', en: 'WARNING: HQ reply signed with a key outside the crew registry. Channel integrity: SUSPECT.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'CORE AI', text: { pl: 'Odpowiedź podpisano kluczem, którego nie ma w żadnym rejestrze misji. A wzór tego klucza przypomina... klucz Voronova. Założyciela VOID.', en: 'The reply was signed with a key that exists in no mission registry. And the pattern of that key resembles... Voronov\'s key. The founder of VOID.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Podsumujmy Księżyc 1: złoże Synaptitu potwierdzone. Sensory CORE AI odzyskane. VOID wie, że tu jesteśmy. A w naszym kanale do domu siedzi ktoś, kto podpisuje się kluczem człowieka, który podobno „zwrócił undefined i zniknął".', en: 'Moon 1, summed up: Synaptit deposit confirmed. CORE AI\'s sensors recovered. VOID knows we are here. And inside our channel home sits someone signing with the key of a man who supposedly "returned undefined and vanished".' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Przed nami Księżyc 2 i moduł planowania. Tym razem lecimy z otwartymi oczami. Dosłownie.', en: 'Ahead of us: Moon 2 and the planning module. This time we fly with open eyes. Literally.' }, mode: 'monologue' },
    ],
  },
};
