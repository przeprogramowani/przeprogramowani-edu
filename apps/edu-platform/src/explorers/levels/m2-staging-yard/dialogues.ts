import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the great junction, three trams in a triangle of mutual blockade
  'm2-deadlock-intro': {
    id: 'm2-deadlock-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ROZJAZDOWNIA — trzy wagoniki w blokadzie. Sygnalizatory: aktywne od lat.', en: 'THE JUNCTION — three trams in blockade. Signals: active for years.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Wielki rozjazd pod lodowym stropem. Trzy wagoniki zamarznięte w trójkącie: każdy blokuje następny, każdy czeka na następny. W dźwięku tylko tykanie przekaźnika — co kilka sekund sieć ponawia ten sam martwy takt.', en: 'A great junction under the ice roof. Three trams frozen in a triangle: each blocks the next, each waits on the next. In the sound, only a relay tick — every few seconds the network retries the same dead beat.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Fabryka wciąż żyje, tylko czeka. Nazwa tego księżyca właśnie stała się dosłowna: martwy punkt. Każda maszyna sprawna, każda wiecznie czeka na inną.', en: 'The factory is still alive; it is only waiting. This moon\'s name just became literal: a deadlock. Every machine works, every one forever waits on another.' }, mode: 'dialogue' },
      { speaker: 'Sopel', text: { pl: 'Jestem przy tobie, Dexo. Kolejka zadań: jedna pozycja. Rozplątać rozjazd. Czytam manifesty wagoników — to moja pierwsza robota pod nowym planem.', en: 'I am with you, Dexo. Task queue: one item. Untangle the junction. I read the tram manifests — this is my first job under the new plan.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_DEADLOCK_INTRO_SEEN] },
  },

  // Dispatcher substation — quest hub, level doctrine
  'm2-dispatch-start': {
    id: 'm2-dispatch-start',
    lines: [
      { speaker: 'system', text: { pl: 'PODSTACJA DYSPOZYTORSKA — online. Zakleszczenie: 3 wagoniki, blokada cykliczna.', en: 'DISPATCHER SUBSTATION — online. Deadlock: 3 trams, cyclic block.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Mógłbym przepchnąć wagonik siłą. Zakleszczenie wróciłoby jutro. Naprawiamy kolejność, nie objaw. Odczytaj manifesty, wyznacz jedyną wykonalną kolejność zwolnień i wykonaj ją.', en: 'I could shove a tram through by force. The deadlock would come back tomorrow. We fix the order, not the symptom. Read the manifests, find the one feasible release order, and execute it.' }, mode: 'dialogue' },
      { speaker: 'Sopel', text: { pl: 'Manifesty przeczytane. Tylko wagonik gamma może cofnąć na bocznicę serwisową. Zacznij od gammy. Potem beta zwolni to, co blokowała gamma. Alfa jako ostatnia.', en: 'Manifests read. Only tram gamma can back onto the service siding. Start with gamma. Then beta clears what gamma blocked. Alpha runs last.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Zakleszczenie — zwolnij wagoniki w kolejności: gamma, beta, alfa.', en: '◆ NEW MISSION: Deadlock — release the trams in order: gamma, beta, alpha.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_DEADLOCK_ACTIVE], activateQuest: 'q-m2-deadlock' },
  },
  'm2-dispatch-waiting': {
    id: 'm2-dispatch-waiting',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Kolejność zwolnień: gamma, potem beta, na końcu alfa. Zła kolejność niczego nie ruszy — sieć odrzuci zwolnienie i węzeł zostanie, jak był.', en: 'Release order: gamma, then beta, alpha last. The wrong order moves nothing — the network rejects the release and the knot stays as it was.' }, mode: 'dialogue' },
    ],
  },
  'm2-dispatch-post': {
    id: 'm2-dispatch-post',
    lines: [
      { speaker: 'system', text: { pl: 'PODSTACJA: rozjazd drożny. Sieć torów: żywa.', en: 'SUBSTATION: junction clear. Rail network: live.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Naprawiliśmy kolejność, nie objaw. Rozjazd już sam się nie zaciśnie.', en: 'We fixed the order, not the symptom. The junction will not lock itself again.' }, mode: 'dialogue' },
    ],
  },

  // Trams — ordered release (gamma → beta → alpha)
  'm2-tram-gamma-inert': {
    id: 'm2-tram-gamma-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik gamma, zamarznięty w pół ruchu. Bez rozkazu z podstacji nie ruszę hamulców.', en: 'Tram gamma, frozen mid-move. Without an order from the substation I am not touching the brakes.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-gamma-release': {
    id: 'm2-tram-gamma-release',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Gamma pierwsza — jako jedyna ma wolną bocznicę. Zwalniam hamulce. Cofa czysto.', en: 'Gamma first — it is the only one with a free siding. Releasing brakes. It backs off cleanly.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Gamma zwolniona. Teraz beta ma dokąd jechać.', en: 'Gamma released. Now beta has somewhere to go.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_TRAM_GAMMA_RELEASED] },
  },
  'm2-tram-gamma-done': {
    id: 'm2-tram-gamma-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Gamma stoi na bocznicy. Tor za nią wolny.', en: 'Gamma stands on the siding. The track behind it is clear.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-beta-inert': {
    id: 'm2-tram-beta-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik beta. Blokuje alfę i sam jest blokowany. Czekam na kolejność.', en: 'Tram beta. It blocks alpha and is itself blocked. Waiting on the order.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-beta-warning': {
    id: 'm2-tram-beta-warning',
    lines: [
      { speaker: 'system', text: { pl: 'WAGONIK BETA: tor wyjazdowy zajęty. Zwolnienie odrzucone.', en: 'TRAM BETA: exit track occupied. Release rejected.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'Sopel', text: { pl: 'Za wcześnie. Beta wjedzie prosto w gammę. Najpierw zwolnij gammę na bocznicę — dopiero wtedy beta ma tor.', en: 'Too early. Beta would drive straight into gamma. Release gamma to the siding first — only then does beta have a track.' }, mode: 'dialogue' },
    ],
  },
  'm2-tram-beta-release': {
    id: 'm2-tram-beta-release',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Gamma zeszła, więc tor bety jest wolny. Zwalniam. Beta rusza.', en: 'Gamma is off, so beta\'s track is free. Releasing. Beta moves.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Dwa z trzech. Została alfa.', en: 'Two of three. Alpha remains.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_TRAM_BETA_RELEASED] },
  },
  'm2-tram-beta-done': {
    id: 'm2-tram-beta-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Beta na trasie. Tor przed alfą prawie wolny.', en: 'Beta is on its route. The track ahead of alpha is nearly clear.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-alpha-inert': {
    id: 'm2-tram-alpha-inert',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik alfa. Ostatni w trójkącie. Nie ruszę go poza kolejnością.', en: 'Tram alpha. Last in the triangle. I will not move it out of order.' }, mode: 'monologue' },
    ],
  },
  'm2-tram-alpha-warning': {
    id: 'm2-tram-alpha-warning',
    lines: [
      { speaker: 'system', text: { pl: 'WAGONIK ALFA: zależność niespełniona. Zwolnienie odrzucone.', en: 'TRAM ALPHA: dependency unmet. Release rejected.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'Sopel', text: { pl: 'Alfa zamyka łańcuch. Zwolnij ją dopiero po gammie i becie. Inaczej znów wszystko czeka na wszystko.', en: 'Alpha closes the chain. Release it only after gamma and beta. Otherwise everything waits on everything again.' }, mode: 'dialogue' },
    ],
  },
  'm2-tram-alpha-release': {
    id: 'm2-tram-alpha-release',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Gamma i beta poszły. Alfa ma czysty tor. Zwalniam ostatnią.', en: 'Gamma and beta are gone. Alpha has a clear track. Releasing the last one.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'Trzeci wagonik rusza — rozjazdownia budzi się falą świateł sygnałowych.', en: 'The third tram moves — the junction wakes in a wave of signal lights.' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { setFlags: [FLAGS.M2_TRAM_ALPHA_RELEASED] },
  },
  'm2-tram-alpha-done': {
    id: 'm2-tram-alpha-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Alfa na trasie. Wszystkie trzy wagoniki jadą. Rozjazd żyje.', en: 'Alpha is on its route. All three trams are running. The junction lives.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — Entropy profiled on screen; Sopel slips, Dexo clears his queue
  'q-m2-deadlock-complete': {
    id: 'q-m2-deadlock-complete',
    lines: [
      { speaker: 'system', text: { pl: 'ROZJAZD DROŻNY. Fala sygnałów biegnie przez całą sieć torów.', en: 'JUNCTION CLEAR. A wave of signals runs across the whole rail network.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Analizuję firmware podstacji. Ta sama sygnatura, którą wyciągnęliśmy z węzłów VOID na Księżycu 1: ENTROPY. Ale tu widzę wreszcie, co ona robi.', en: 'Analysing the substation firmware. The same signature we pulled from the VOID nodes on Moon 1: ENTROPY. But here I finally see what it does.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Znam ten podpis. Nosiłem go w sobie. Działa samą kolejnością — przestawia zależności, aż wszystko czeka na wszystko, a sprzęt zostaje bez jednej rysy. Ta sama metoda uderzyła w statek i w fabrykę.', en: 'I know this signature. I carried it inside me. It works through order alone — it reshuffles dependencies until everything waits on everything, and the hardware is left without a scratch. The same method hit the ship and the factory.' }, mode: 'dialogue' },
      { speaker: 'Sopel', text: { pl: 'Podpis... rozpoznaję go. Zadanie. Czekać. Zadanie. Cze—', en: 'The signature... I recognise it. Task. Wait. Task. Wai—' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'Dexo ręcznie czyści kolejkę Sopla. Nikt tego nie komentuje.', en: 'Dexo clears Sopel\'s queue by hand. No one comments.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_ENTROPY_PROFILED] },
  },

  // Track board — living documentation dead for years
  'm2-track-board': {
    id: 'm2-track-board',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA STANÓW TORÓW — ostatnia aktualizacja: godzina przed zamrożeniem.', en: 'TRACK-STATE BOARD — last update: one hour before the freeze.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Żywa dokumentacja — martwa od lat. Ktoś aktualizował ją co do minuty, aż nagle przestał. Ostatni wpis: godzina przed zamrożeniem. Ten stan torów już od dawna kłamie.', en: 'Living documentation — dead for years. Someone updated it to the minute, then suddenly stopped. Last entry: one hour before the freeze. This track state has been lying for a long time.' }, mode: 'dialogue' },
    ],
  },

  'm2-track-board-live': {
    id: 'm2-track-board-live',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA STANÓW TORÓW — ostatnia aktualizacja: przed chwilą.', en: 'TRACK-STATE BOARD — last update: moments ago.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Tablica znów pisze. Każde zwolnienie wagonika ma swój wpis, co do minuty. Żywa dokumentacja — pierwszy raz od lat zasługuje na tę nazwę.', en: 'The board writes again. Every tram release has its entry, to the minute. Living documentation — for the first time in years it earns the name.' }, mode: 'dialogue' },
    ],
  },

  // Ore spill — first ore of the moon, on the rails, still scenery
  'm2-ore-spill': {
    id: 'm2-ore-spill',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ruda rozsypana z przechylonego wagonika. Pierwszy Synaptit tego księżyca — leży dosłownie na torach. Skrzy się na niebiesko.', en: 'Ore spilled from a tilted tram. The moon\'s first Synaptit — lying literally on the rails. It glitters blue.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Widzę to z wartowni przez wasz kanał. Nie zbierzesz jej bez sieci i huty, Dexo. Ale to znak: żyła jest w zasięgu. Idź niżej, do wytopu.', en: 'I see it from the guardhouse through your channel. You cannot collect it without the network and the foundry, Dexo. But it is a sign: the vein is within reach. Go lower, to the smelt.' }, mode: 'dialogue' },
    ],
  },

  'm2-ore-spill-scheduled': {
    id: 'm2-ore-spill-scheduled',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rozsyp Synaptitu wciąż skrzy się między szynami. Ale to już nie scenografia — to ładunek, który czeka na odbiór.', en: 'The Synaptit spill still glitters between the rails. But it is scenery no longer — it is cargo waiting for pickup.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Mam go w harmonogramie, Dexo. Zbiórka rozsypu: przydzielona wagonikowi serwisowemu, zaraz po dostawach do huty. Fabryka sama po sobie sprząta.', en: 'I have it in the schedule, Dexo. Spill collection: assigned to a service tram, right after the foundry deliveries. The factory cleans up after itself.' }, mode: 'dialogue' },
    ],
  },

  // Sopel NPC — nervous before, calm after
  'm2-sopel-nervous': {
    id: 'm2-sopel-nervous',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Kolejka: jedna pozycja. Rozplątać rozjazd. Pozycja nie schodzi. Pozycja nie schodzi od... nie liczę już. Powiedz mi kolejność, Dexo, a ją wykonam.', en: 'Queue: one item. Untangle the junction. The item will not clear. The item has not cleared for... I no longer count. Tell me the order, Dexo, and I will run it.' }, mode: 'dialogue' },
    ],
  },
  'm2-sopel-calm': {
    id: 'm2-sopel-calm',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Rozjazd drożny. Kolejka: pusta. Miarowo. Pierwszy raz od lat mam takt, w którym nic nie czeka na nic.', en: 'Junction clear. Queue: empty. Steady. For the first time in years I have a beat where nothing waits on anything.' }, mode: 'dialogue' },
    ],
  },

  // Exam VIII — Protokół VIII
  'm2-exam-protocol-8-done': {
    id: 'm2-exam-protocol-8-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ VIII — „ŻYWY PLAN": zaliczony.', en: 'PROTOCOL VIII — "LIVING PLAN": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Ósmy protokół odzyskany: po każdym kroku zapisz stan, po każdej zmianie popraw mapę. Plan nieaktualny jest gorszy niż brak planu. Dowód stał tu dookoła przez lata.', en: 'Eighth protocol recovered: record the state after every step, fix the map after every change. A stale plan is worse than no plan. The evidence stood all around here for years.' }, mode: 'dialogue' },
    ],
  },
  'm2-exam-protocol-8-already': {
    id: 'm2-exam-protocol-8-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół VIII już zaliczony.', en: 'Protocol VIII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked foundry door — needs a live rail network
  'm2-foundry-door-locked': {
    id: 'm2-foundry-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'GRÓDŹ POŁUDNIOWA: zamknięta. Sieć torów nieaktywna.', en: 'SOUTHERN BULKHEAD: closed. Rail network inactive.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Ta gródź odpowiada tylko żywej sieci torów. Rozplącz zakleszczenie — wtedy południe się otworzy.', en: 'This bulkhead answers only to a live rail network. Untangle the deadlock — then the south opens.' }, mode: 'dialogue' },
    ],
  },

  // Return path — trams gliding smoothly; CORE AI reads the dead schedule anew
  'm2-return-deadlock': {
    id: 'm2-return-deadlock',
    lines: [
      { speaker: 'system', text: { pl: 'MARTWY PUNKT — POWRÓT', en: 'THE DEADLOCK — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'W tle wagoniki przejeżdżają rozjazd płynnie, jeden za drugim. Sygnalizatory świecą zielenią.', en: 'In the background, trams glide through the junction smoothly, one after another. The signals shine green.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Teraz widzę harmonogram, który tu umarł. Był dobry. Dlatego zabili go od środka: samą kolejnością, bez jednej rysy na sprzęcie. Nienawidzę tego, jakie to eleganckie.', en: 'Now I see the schedule that died here. It was good. So they killed it from the inside: by order alone, without a scratch on the hardware. I hate how elegant it is.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M2_RETURN_DEADLOCK_SEEN] },
  },
};
