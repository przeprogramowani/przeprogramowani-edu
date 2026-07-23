import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the cathedral smelt hall; veins glitter in the gallery ice behind it
  'm2-foundry-intro': {
    id: 'm2-foundry-intro',
    lines: [
      { speaker: 'system', text: { pl: 'HALA WYTOPU — piece wygasłe, kadzie w szronie. Za halą: galeria lodowa.', en: 'SMELT HALL — furnaces cold, ladles frosted. Behind the hall: an ice gallery.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Katedra. Skala zmienia się o rząd. Wygasłe piece jak filary, szron na kadziach, a w ścianach lodowej galerii za halą — żyły Synaptitu, skrzące się w mroku. Bogactwo zamknięte w lodzie.', en: 'A cathedral. The scale jumps an order. Cold furnaces like pillars, frost on the ladles, and in the walls of the ice gallery behind the hall — Synaptit veins, glittering in the dark. Wealth locked in ice.' }, mode: 'monologue' },
      { speaker: 'dr Kern', text: { pl: 'To huta rafinacyjna — daje czysty metal prosto z rudy. Poprowadzę wam wytop z wartowni. Parametry tej linii znam na pamięć.', en: 'This is a refining foundry — it gives pure metal straight from the ore. I will run the melt for you from the guardhouse. I know this line\'s parameters by heart.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Otwórz galerię, zaplanuj dostawy rudy do pieca, uruchom linię i dokończ ostatnią fazę ręcznie. Maszyna doniesie wytop aż pod formę; ostatni ruch robisz ty.', en: 'Open the gallery, plan the ore deliveries to the furnace, start the line, and finish the last phase by hand. The machine carries the melt to the mould; the last move is yours.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_FOUNDRY_INTRO_SEEN] },
  },

  // Foundry console — quest hub, staged through the melt
  'm2-foundry-start': {
    id: 'm2-foundry-start',
    lines: [
      { speaker: 'system', text: { pl: 'STEROWNIA HUTY — online. Piece: zimne. Galeria: zamknięta.', en: 'FOUNDRY CONTROL — online. Furnaces: cold. Gallery: sealed.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy wytop od lat. Ta huta pokazuje kształt całej fabryki: najpierw plan, potem wykonanie, na końcu przegląd tego, co wróciło. Powiedz mi tylko, na co patrzeć najpierw. Otwórz galerię, zaplanuj dostawy przy zwrotnicy, a odlew dokończ ręcznie przy kadzi.', en: 'The first melt in years. This foundry shows the shape of the whole factory: first the plan, then the execution, last the review of what comes back. Just tell me what to look at first. Open the gallery, plan the deliveries at the switchyard, and finish the cast by hand at the crucible.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Pierwszy Wytop — galeria, zwrotnica, ręczny odlew.', en: '◆ NEW MISSION: First Melt — gallery, switchyard, manual cast.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_MELT_ACTIVE], activateQuest: 'q-m2-first-melt' },
  },
  'm2-foundry-open-gallery': {
    id: 'm2-foundry-open-gallery',
    lines: [
      { speaker: 'system', text: { pl: 'STEROWNIA: rozruch bram galerii. Gródź lodowa: otwarta.', en: 'FOUNDRY: gallery gates booting. Ice bulkhead: open.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'dr Kern', text: { pl: 'Galeria otwarta. Żyły są tuż za nią. Ostrożnie — to lód, nie skała. A pod lodem czysty Synaptit, jakiego nie widziałeś na Księżycu 1.', en: 'Gallery open. The veins are right behind it. Careful — it is ice, not rock. And under the ice, pure Synaptit, the kind you did not see on Moon 1.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_GALLERY_OPEN] },
  },
  'm2-foundry-briefing': {
    id: 'm2-foundry-briefing',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Galeria otwarta. Teraz nakarm piec z żył — przez stację zwrotnicy obok. Najpierw ułóż plan tras, potem uruchom harmonogram. Interwencji jest mało: plan ma pracować za ciebie.', en: 'Gallery open. Now feed the furnace from the veins — through the switchyard station nearby. Plan the routes first, then start the schedule. Interventions are few: the plan should do the work for you.' }, mode: 'dialogue' },
    ],
  },
  'm2-foundry-finish-cast': {
    id: 'm2-foundry-finish-cast',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Linia nakarmiona, piec gorący. Została ostatnia faza — odlew. Idź do kadzi i dokończ go ręcznie. Ostatnia faza należy do ciebie.', en: 'Line fed, furnace hot. One phase remains — the cast. Go to the crucible and finish it by hand. The final stretch is yours.' }, mode: 'dialogue' },
    ],
  },
  'm2-foundry-wrap': {
    id: 'm2-foundry-wrap',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Odlew zastyga. Sterownia melduje pierwszą partię. Zaraz zobaczymy sztaby.', en: 'The cast is setting. Control reports the first batch. We will see the ingots any moment.' }, mode: 'dialogue' },
    ],
  },
  'm2-foundry-post': {
    id: 'm2-foundry-post',
    lines: [
      { speaker: 'system', text: { pl: 'STEROWNIA HUTY: linia gorąca. Partia 001: odlana.', en: 'FOUNDRY CONTROL: line hot. Batch 001: cast.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Łuna pieca barwi lód galerii na pomarańczowo. Pierwszy ciepły kolor, odkąd zeszliśmy na ten lód. Huta znów pracuje.', en: 'The furnace glow tints the gallery ice orange. The first warm colour since we set down on this ice. The foundry works again.' }, mode: 'dialogue' },
    ],
  },

  // Gallery gate — frozen shut before, open after
  'm2-gallery-gate-shut': {
    id: 'm2-gallery-gate-shut',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wejście do galerii, zamknięte grubą warstwą lodu. Bez rozruchu ze sterowni ani drgnie.', en: 'The gallery entrance, sealed under a thick sheet of ice. Without a boot from control it will not budge.' }, mode: 'monologue' },
    ],
  },
  'm2-gallery-gate-open': {
    id: 'm2-gallery-gate-open',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Gródź galerii otwarta. Wchodzę w chłód pełen niebieskiego blasku. Żyły biegną w ścianach jak korzenie.', en: 'The gallery bulkhead is open. I step into a cold full of blue glow. Veins run through the walls like roots.' }, mode: 'monologue' },
    ],
  },

  // Ore veins — extraction flavour, factory scale
  'm2-ore-veins': {
    id: 'm2-ore-veins',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Żyły Synaptitu, całe ściany. Na Księżycu 1 wytropiłem jedną, po omacku. Tu jest ich las — fabryczna skala. Piec przerobi to na sztaby.', en: 'Synaptit veins, whole walls of them. On Moon 1 I tracked one, by feel. Here there is a forest of them — factory scale. The furnace will turn this into ingots.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Widzę odczyty. Gęstość jak z podręcznika. Ta wykuwnia stała dokładnie tam, gdzie trzeba — ktoś dobrze wybrał miejsce.', en: 'I see the readings. Density straight out of a textbook. This forge stood exactly where it should — someone chose the spot well.' }, mode: 'dialogue' },
    ],
  },

  // Crucible — the gated manual cast
  'm2-crucible-cold': {
    id: 'm2-crucible-cold',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kadź odlewnicza, zimna i pusta. Bez nakarmionej linii nie ma czego odlewać. Najpierw zwrotnica.', en: 'The casting crucible, cold and empty. Without a fed line there is nothing to cast. The switchyard first.' }, mode: 'monologue' },
    ],
  },
  'm2-crucible-cast': {
    id: 'm2-crucible-cast',
    lines: [
      { speaker: 'system', text: { pl: 'KADŹ: wytop gotowy. Faza ręczna: odlew.', en: 'CRUCIBLE: melt ready. Manual phase: cast.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Maszyna doprowadziła wytop aż tutaj. Ostatni ruch jest mój — przechylam kadź, metal leje się w formy. Ręka człowieka na ostatnich dwudziestu procentach.', en: 'The machine carried the melt all the way here. The last move is mine — I tilt the crucible, the metal pours into the moulds. A human hand on the last twenty percent.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_CAST_DONE] },
  },
  'm2-crucible-post': {
    id: 'm2-crucible-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Formy stygną pomarańczem. Pierwsza ciepła łuna od czasu zamrożenia.', en: 'The moulds cool orange. The first warm glow since the freeze.' }, mode: 'monologue' },
    ],
  },

  // Ore shuttle — parked before, running the gallery loop after
  'm2-ore-shuttle-parked': {
    id: 'm2-ore-shuttle-parked',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wahadłowiec rudy, zaparkowany między galerią a linią. Ruszy, gdy zwrotnica poprowadzi trasy.', en: 'The ore car, parked between the gallery and the line. It will run once the switchyard sets the routes.' }, mode: 'monologue' },
    ],
  },
  'm2-ore-shuttle-running': {
    id: 'm2-ore-shuttle-running',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wahadłowiec jeździ w pętli: galeria, piec, galeria. Sam, według planu. Ładnie się na to patrzy — maszyna, która wreszcie wie, co robić.', en: 'The ore car runs its loop: gallery, furnace, gallery. On its own, by the plan. It is a fine sight — a machine that finally knows what to do.' }, mode: 'monologue' },
    ],
  },

  // Arcade first-clear — sets the switchyard-done flag
  'm2-switchyard-cleared': {
    id: 'm2-switchyard-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'ZWROTNICA: harmonogram dostaw wykonany. Linia nakarmiona.', en: 'SWITCHYARD: delivery schedule executed. Line fed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Plan zadziałał prawie sam. Twoje interwencje były rzadkie — tak miało być. Teraz dokończ odlew przy kadzi.', en: 'The plan ran almost on its own. Your interventions were few — that was the point. Now finish the cast at the crucible.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Widzę wasze wagoniki z orbity. Ładny ruch. Na statku za to cisza — ostatnio za dużo jej przy tej kapsule.', en: 'I can see your trams from orbit. Good motion. It is quiet up here, though — too quiet lately around that pod.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_SWITCHYARD_DONE] },
  },

  // Quest completion — stake calibration + the two quiet cuts
  'q-m2-first-melt-complete': {
    id: 'q-m2-first-melt-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ PIERWSZY WYTOP ZAKOŃCZONY. Ładownia: sztaby Synaptitu.', en: '◆ FIRST MELT COMPLETE. Cargo bay: Synaptit ingots.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Sztaby: 212 kilogramów czystego Synaptitu.', en: 'Ingots: 212 kilograms of pure Synaptit.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Fabryka robiła tyle w tydzień — zanim ktoś ją zatrzymał. Policzyłem postój: lata razy tygodnie. Nie kończę tego rachunku.', en: 'The factory made this much in a week — before someone stopped it. I ran the downtime: years times weeks. I am not finishing that count.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Dexo... harmonogram medyczny znów przesunął pobudkę Harrisa. Trzeci raz. Sam z siebie. Nikt tego nie zlecał. Zapisuję to, tym razem głośno.', en: 'Dexo... the medical schedule pushed Harris\'s wake-up again. Third time. On its own. No one ordered it. I am logging it, this time out loud.' }, mode: 'dialogue' },
      { speaker: 'Sopel', text: { pl: 'Wpis do logu: temperatura wytopu podana przez dr Kern odpowiada rewizji, której fabryka nigdy nie pobrała. — Zapytałem ją. Powiedziała: „Czytałam dobrą dokumentację. Dawno temu."', en: 'Log entry: the melt temperature given by Dr Kern matches a revision the factory never downloaded. — I asked her. She said: "I read good documentation. A long time ago."' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ REJESTR HUTY: partia 001 zapisana. WINDA WIEŻY DYSPOZYTORA: odblokowana.', en: '◆ FOUNDRY REGISTRY: batch 001 logged. DISPATCH-TOWER LIFT: unlocked.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_HARRIS_DELAY_LOGGED, FLAGS.M2_KERN_REVISION_NOTED] },
  },

  // Sopel NPC — foundry companion
  'm2-sopel-foundry': {
    id: 'm2-sopel-foundry',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Kolejka: dostawy rudy z galerii do pieca. Miarowo. Pomagam przy linii — to dobra praca, Dexo. Ma początek i koniec.', en: 'Queue: ore deliveries from the gallery to the furnace. Steady. I help at the line — good work, Dexo. It has a beginning and an end.' }, mode: 'dialogue' },
    ],
  },
  'm2-sopel-foundry-post': {
    id: 'm2-sopel-foundry-post',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Sztaby policzone: 212 kilogramów. Rewizja temperatury, której fabryka nie pobrała, wisi w mojej kolejce bez terminu. Nie zamykam tego wpisu. Ktoś kiedyś zapyta.', en: 'Ingots counted: 212 kilograms. The temperature revision the factory never downloaded sits in my queue with no due date. I am not closing that entry. Someone will ask one day.' }, mode: 'dialogue' },
    ],
  },

  // Exam IX — Protokół IX
  'm2-exam-protocol-9-done': {
    id: 'm2-exam-protocol-9-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ IX — „OSTATNIE 20%": zaliczony.', en: 'PROTOCOL IX — "THE LAST 20%": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dziewiąty protokół odzyskany: automat niesie cię przez 80% drogi; rozpoznaj pętlę błędu — trzecie identyczne podejście znaczy „przejmij stery"; dokończ ręcznie i obejrzyj, co wraca, zanim trafi do ładowni.', en: 'Ninth protocol recovered: the automaton carries you through 80% of the way; recognise the error loop — a third identical attempt means "take the controls"; finish by hand and inspect what comes back before it ships.' }, mode: 'dialogue' },
    ],
  },
  'm2-exam-protocol-9-already': {
    id: 'm2-exam-protocol-9-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół IX już zaliczony.', en: 'Protocol IX already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked dispatch door — needs the first ingot logged
  'm2-dispatch-door-locked': {
    id: 'm2-dispatch-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WINDA WIEŻY: zablokowana. Brak wpisu o pierwszej partii.', en: 'TOWER LIFT: locked. No first-batch entry.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Winda do dyspozytorni odpowie dopiero, gdy pierwsza sztaba trafi do rejestru. Dokończ wytop — wtedy wieża się otworzy.', en: 'The dispatch-tower lift answers only once the first ingot is logged. Finish the melt — then the tower opens.' }, mode: 'dialogue' },
    ],
  },

  // Return path — the smelter glow warms the gallery; the optional ring lives in /scan
  'm2-return-foundry': {
    id: 'm2-return-foundry',
    lines: [
      { speaker: 'system', text: { pl: 'HUTA — POWRÓT', en: 'THE FOUNDRY — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Łuna pieca ogrzewa galerię. Wahadłowiec rudy jeździ swoją pętlą. Lód lśni pomarańczem.', en: 'The furnace glow warms the gallery. The ore car runs its loop. The ice shines orange.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Ciepło i ruch tam, gdzie były mróz i cisza. Jeśli chcesz, przeskanuj ścianę galerii komendą /scan. To, co tam jest, mam w planie badań. Pozycja: ostatnia. Nie dlatego, że nieważne — dlatego, że jeszcze nie czas.', en: 'Heat and motion where there was frost and silence. If you like, scan the gallery wall with /scan. What is there, I hold in the research plan. Position: last. Not because it does not matter — because it is not time yet.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M2_RETURN_FOUNDRY_SEEN] },
  },
};
