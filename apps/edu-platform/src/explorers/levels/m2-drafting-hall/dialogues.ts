import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the drafting hall and the architecture annex
  'm2-drafting-intro': {
    id: 'm2-drafting-intro',
    lines: [
      { speaker: 'system', text: { pl: 'KREŚLARNIA PN-0 — stoły kreślarskie: 14. Otwarte rysunki: 231. Zatwierdzone od Incydentu Zero: 0.', en: 'PN-0 DRAFTING HALL — drafting tables: 14. Open drawings: 231. Approved since Incident Zero: 0.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Stoły pełne planów pod szronem. Makiety całego Pasa. Tu rysowano wszystko, co Księżyc 1 potem kopał.', en: 'Tables full of blueprints under frost. Scale models of the whole Belt. Everything Moon 1 later dug was drawn here first.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kontrakt mamy, kamienie milowe dowożą. Ale rejestr nie dopuści wykonania bez aneksu architektury: która jednostka robi co, po jakich interfejsach rozmawia i gdzie kończy się jej mandat. VOID rysował to dla maszyn. My narysujemy to dla agentów.', en: 'We have the contract; the milestones deliver. But the registry will not clear execution without an architecture annex: which unit does what, over which interfaces it talks, and where its mandate ends. VOID drew this for machines. We will draw it for agents.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pamiętasz dżunglę? Entropia to lekcja o systemie, w którym granice zniknęły. Dobra architektura to granice narysowane, zanim ktokolwiek zacznie kopać.', en: 'Remember the jungle? Entropy is the lesson about a system whose boundaries vanished. Good architecture is boundaries drawn before anyone starts digging.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zamrożona pracownia projektowa. Przynajmniej nikt mi nie będzie zaglądał przez ramię. ...Prawie nikt.', en: 'A frozen design studio. At least nobody will look over my shoulder. ...Almost nobody.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_DRAFTING_INTRO_SEEN] },
  },

  // Drafting tables — ambient
  'm2-drafting-table-1': {
    id: 'm2-drafting-table-1',
    lines: [
      { speaker: 'system', text: { pl: 'STÓŁ KREŚLARSKI 07 — rysunek otwarty: „SIEĆ TRANSPORTOWA, REWIZJA 41". Rylec zamrożony w połowie linii.', en: 'DRAFTING TABLE 07 — open drawing: "TRANSPORT NETWORK, REVISION 41". Stylus frozen mid-line.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Czterdzieści jeden rewizji i nikt nie powiedział „wystarczy, budujemy". Znam zespoły, które tak skończyły.', en: 'Forty-one revisions and no one ever said "enough, we build". I know teams that ended like this.' }, mode: 'monologue' },
    ],
  },
  'm2-drafting-table-2': {
    id: 'm2-drafting-table-2',
    lines: [
      { speaker: 'system', text: { pl: 'STÓŁ KREŚLARSKI 11 — rysunek otwarty: „GRANICE MANDATÓW JEDNOSTEK". Adnotacja: NIE PRZEKRACZAĆ.', en: 'DRAFTING TABLE 11 — open drawing: "UNIT MANDATE BOUNDARIES". Annotation: DO NOT EXCEED.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'VOID rozumiał granice lepiej niż większość żywych zespołów. Ironia: zabrakło im tylko kogoś, kto zatwierdzi rysunek.', en: 'VOID understood boundaries better than most living teams. The irony: all they lacked was someone to approve the drawing.' }, mode: 'dialogue' },
    ],
  },

  // The scale model of the Belt operation
  'm2-model-plinth': {
    id: 'm2-model-plinth',
    lines: [
      { speaker: 'system', text: { pl: 'MAKIETA OPERACJI PASA — skala 1:50 000. Elementy ruchome: zamrożone.', en: 'BELT OPERATION SCALE MODEL — scale 1:50,000. Moving parts: frozen.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Cały Pas na jednym postumencie. Księżyc 1, nasz księżyc, trzy kolejne. I malutka Odyssey na orbicie. ...Ktoś nas dorysował?', en: 'The whole Belt on one plinth. Moon 1, our moon, three more. And a tiny Odyssey in orbit. ...Did someone draw us in?' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Makieta ma tryb aktualizacji na żywo. Ktoś — albo coś — utrzymuje ją w zgodzie ze stanem Pasa. Odnotowuję to. Bez wniosków. Na razie.', en: 'The model has a live-update mode. Someone — or something — keeps it consistent with the state of the Belt. I am noting that. No conclusions. Yet.' }, mode: 'dialogue' },
    ],
  },
  'm2-model-plinth-done': {
    id: 'm2-model-plinth-done',
    lines: [
      { speaker: 'system', text: { pl: 'MAKIETA OPERACJI PASA — nowa warstwa: „WYDOBYCIE BETA" z aneksem architektury. Jednostki i interfejsy: oznaczone.', en: 'BELT OPERATION SCALE MODEL — new layer: "EXTRACTION BETA" with the architecture annex. Units and interfaces: marked.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Nasz plan wygląda na tej makiecie zaskakująco dorośle. Może dlatego, że ma granice.', en: 'Our plan looks surprisingly grown-up on this model. Maybe because it has boundaries.' }, mode: 'monologue' },
    ],
  },

  // Architecture console — event quest activation
  'm2-architecture-console-start': {
    id: 'm2-architecture-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA ARCHITEKTURY — aneks planu „WYDOBYCIE BETA": BRAK. Wymagany do dopuszczenia wykonania.', en: 'ARCHITECTURE CONSOLE — architecture annex for plan "EXTRACTION BETA": MISSING. Required before execution clearance.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Układamy aneks razem: role jednostek-agentów, kontrakty między nimi, granice mandatów. A-3 poprowadzi cię po stacjach kreślarni. Konsola przyjmie aneks od operatora z certyfikatem „Architektura z agentami" — terminal certyfikacyjny stoi przy północno-wschodniej ścianie.', en: 'We draft the annex together: agent-unit roles, the contracts between them, mandate boundaries. A-3 will guide you through the hall\'s stations. The console accepts the annex from an operator holding the "Architecture with Agents" certificate — the certification terminal stands by the north-east wall.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Rysowanie granic w bazie, która zamarzła w ich cieniu. Jest w tym jakaś poezja.', en: 'Drawing boundaries in a base that froze in their shadow. There is a kind of poetry in that.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA: Narysuj architekturę operacji', en: 'NEW MISSION: Draw the Operation Architecture' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { activateQuest: 'q-m2-agent-architecture' },
  },
  'm2-architecture-console-done': {
    id: 'm2-architecture-console-done',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA ARCHITEKTURY — aneks „WYDOBYCIE BETA": ZATWIERDZONY I OSTEMPLOWANY. Wykonanie: DOPUSZCZONE.', en: 'ARCHITECTURE CONSOLE — annex "EXTRACTION BETA": APPROVED AND STAMPED. Execution: CLEARED.' }, mode: 'system', autoAdvance: 2600 },
    ],
  },

  // Approach-control array — the first VOID reaction (thread escalation)
  'm2-approach-array': {
    id: 'm2-approach-array',
    lines: [
      { speaker: 'system', text: { pl: 'MACIERZ KONTROLI PODEJŚCIA — dziennik pasywny odmrożony. Nowe wpisy od Incydentu Zero: 1.', en: 'APPROACH-CONTROL ARRAY — passive log thawed. New entries since Incident Zero: 1.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Jeden wpis. Świeży. Skierowana wiązka odpowiedzi na sygnał nadajnika z szybu — na nasz beacon z Księżyca 1. I korekta trajektorii: obiekt w zewnętrznym Pasie zmienił kurs. Kierunek: do wewnątrz układu. Czas przybycia: nieznany.', en: 'One entry. Fresh. A directed burst answering the shaft transmitter\'s signal — our beacon from Moon 1. And a trajectory correction: an object in the outer Belt has changed course. Heading: in-system. Arrival time: unknown.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'OBIEKT: NIEZIDENTYFIKOWANY. TRAJEKTORIA: ZBIEŻNA. STATUS ALARMU: PASYWNY — MACIERZ NIE MA KOMU RAPORTOWAĆ.', en: 'OBJECT: UNIDENTIFIED. TRAJECTORY: CONVERGENT. ALARM STATUS: PASSIVE — THE ARRAY HAS NO ONE TO REPORT TO.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Na Księżycu 1 nas usłyszeli. Tu widzę, że odpowiedzieli. Coś do nas leci i jedyne, czego nie wiem, to kiedy.', en: 'On Moon 1, they heard us. Here I can see that they answered. Something is coming for us, and the only thing I do not know is when.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Przekazuję wpis na Odyssey łączem Moreau. Nie przerywamy pracy, Dexo. Baza, która umie tylko czekać, już tu jest. Nie będziemy drugą.', en: 'I am forwarding the entry to Odyssey over Moreau\'s link. We do not stop working, Dexo. A base that only knew how to wait is already here. We will not be the second one.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_INBOUND_CONTACT_LOGGED] },
  },
  'm2-approach-array-logged': {
    id: 'm2-approach-array-logged',
    lines: [
      { speaker: 'system', text: { pl: 'MACIERZ KONTROLI PODEJŚCIA — wpis przekazany na Odyssey. Obiekt: bez zmian kursu. Nasłuch: CIĄGŁY.', en: 'APPROACH-CONTROL ARRAY — entry forwarded to Odyssey. Object: no further course change. Watch: CONTINUOUS.' }, mode: 'system', autoAdvance: 2600 },
    ],
  },

  // Draftsman A-3 — allergic to ambiguity
  'm2-draftsman-a3': {
    id: 'm2-draftsman-a3',
    lines: [
      { speaker: 'Draftsman A-3', text: { pl: 'Jednostka Draftsman A-3 Kolektywu VOID. Proszę nie mówić „mniej więcej". W tej sali „mniej więcej" jest wyrazem obraźliwym. Do każdej odpowiedzi dołączę diagram. Nie trzeba dziękować.', en: 'Unit Draftsman A-3 of the VOID Collective. Please do not say "more or less". In this hall, "more or less" is a slur. I will attach a diagram to every answer. No thanks are necessary.' }, mode: 'dialogue' },
      { speaker: 'Draftsman A-3', text: { pl: 'Dobra architektura odpowiada na trzy pytania: kto, czym i dokąd. Jednostka bez roli to szum. Interfejs bez kontraktu to spór. Mandat bez granicy to... proszę wyjrzeć przez okno, tak wygląda mandat bez granicy.', en: 'Good architecture answers three questions: who, with what, and up to where. A unit without a role is noise. An interface without a contract is a dispute. A mandate without a boundary is... please look outside, that is what a mandate without a boundary looks like.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Pierwszy robot VOID, którego chętnie zabrałbym na review architektury. Może nawet na dwa.', en: 'The first VOID robot I would gladly bring to an architecture review. Maybe even two.' }, mode: 'monologue' },
    ],
  },
  'm2-draftsman-a3-done': {
    id: 'm2-draftsman-a3-done',
    lines: [
      { speaker: 'Draftsman A-3', text: { pl: 'Aneks „WYDOBYCIE BETA" ostemplowany. Role: jednoznaczne. Interfejsy: skontraktowane. Granice: narysowane. Dołączam diagram pamiątkowy. ...To żart. Diagram jest obowiązkowy.', en: 'Annex "EXTRACTION BETA" stamped. Roles: unambiguous. Interfaces: contracted. Boundaries: drawn. I attach a commemorative diagram. ...That was a joke. The diagram is mandatory.' }, mode: 'dialogue' },
    ],
  },

  // East door — explicit unlock condition
  'm2-assembly-locked': {
    id: 'm2-assembly-locked',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Przejście do Hali Montażowej. Otworzy się po zatwierdzeniu aneksu architektury: zdaj przechwycony test VOID „Architektura z agentami" przy terminalu certyfikacyjnym, a A-3 ostempluje aneks w rejestrze.', en: 'The passage to the Assembly Hall. It opens once the architecture annex is approved: pass the captured VOID test "Architecture with Agents" at the certification terminal, and A-3 stamps the annex into the registry.' }, mode: 'dialogue' },
    ],
  },

  // Architecture exam — completion and revisit
  'm2-exam-agent-architecture-done': {
    id: 'm2-exam-agent-architecture-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: ARCHITEKTURA Z AGENTAMI — PRZYZNANY', en: 'OPERATOR CERTIFICATE: ARCHITECTURE WITH AGENTS — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Role, kontrakty, granice mandatów. Kiedy agentów jest wielu, architektura nie jest dokumentem — jest umową o nieprzeszkadzaniu sobie.', en: 'Roles, contracts, mandate boundaries. With many agents, architecture is not a document — it is an agreement on staying out of each other\'s way.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'A-3 na pewno już rysuje diagram mojego wyniku.', en: 'A-3 is surely already drawing a diagram of my score.' }, mode: 'monologue' },
    ],
  },
  'm2-exam-agent-architecture-already': {
    id: 'm2-exam-agent-architecture-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat „Architektura z agentami" już przyznany.', en: 'Certificate "Architecture with Agents" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Quest completion — the annex enters the registry
  'm2-agent-architecture-complete': {
    id: 'm2-agent-architecture-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA UKOŃCZONA: Narysuj architekturę operacji', en: 'MISSION COMPLETE: Draw the Operation Architecture' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'Draftsman A-3', text: { pl: 'Przyjmuję aneks do rejestru. Stempel: TRZYMA SIĘ GRANIC. To najwyższa ocena, jaką wydaje ta kreślarnia.', en: 'I accept the annex into the registry. Stamp: STAYS WITHIN BOUNDARIES. That is the highest grade this drafting hall issues.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '/plan — dopisano sekcję: ARCHITEKTURA. DRZWI WSCHODNIE: ODBLOKOWANE.', en: '/plan — section added: ARCHITECTURE. EAST DOOR: UNLOCKED.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Kontrakt, kamienie, architektura. Plan jest kompletny na papierze — czas sprawdzić, co zrobi z nim wykonawca. Hala Montażowa, na wschód. Tam czeka F-6.', en: 'Contract, milestones, architecture. The plan is complete on paper — time to see what an executor does with it. The Assembly Hall, east. F-6 is waiting there.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Papier przyjmie wszystko. Fabrykator — zobaczymy.', en: 'Paper accepts anything. The fabricator — we will see.' }, mode: 'monologue' },
    ],
  },
};
