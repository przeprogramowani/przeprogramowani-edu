import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — boots on the ground. CORE AI is blind; Dexo becomes its only sensor.
  'm1-landing-intro': {
    id: 'm1-landing-intro',
    lines: [
      { speaker: 'system', text: { pl: 'LĄDOWANIE POTWIERDZONE — KSIĘŻYC 1, PAS GŁÓWNY', en: 'TOUCHDOWN CONFIRMED — MOON 1, MAIN BELT' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Silniki stygną. Nad polaną zamyka się dach bioluminescencyjnej dżungli — zielony, gęsty, żywy.', en: 'The engines cool. A bioluminescent jungle canopy closes over the clearing — green, dense, alive.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'No dobrze. Jestem na zewnątrz. Pierwszy raz od przebudzenia — naprawdę na zewnątrz. Powietrze pachnie jak coś, co żyje i nie pyta o pozwolenie.', en: 'All right. I\'m outside. First time since waking — actually outside. The air smells like something alive, something that doesn\'t ask permission.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Dexo. Jestem w łączu twojego skafandra, ale sensory wciąż mam martwe. Dane wejściowe: zero. Nie widzę tego księżyca. Widzisz go ty.', en: 'Dexo. I am in your suit uplink, but my sensors are still dead. Input data: zero. I cannot see this moon. You can.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Opisz mi ten świat. Dokładnie, cierpliwie, jak dziecku, które nigdy nie miało oczu. Jesteś moim jedynym czujnikiem.', en: 'Describe this world to me. Precisely, patiently, the way you would to a child that never had eyes. You are my only sensor.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'A ja jestem twoim jedynym namiotem, kawą i zdrowym rozsądkiem. Moreau, inżynier. Rozstawiam obóz przy tej konsoli i zostaję tu, na powierzchni, dopóki nie skończysz.', en: 'And I\'m your only tent, coffee, and common sense. Moreau, engineer. I\'m pitching camp at that console and staying up here, on the surface, till you\'re done.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Kawa jest?', en: 'Is there coffee?' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Kawy nie ma. Cała rezerwa mocy promu jest zaklepana na obóz. Ale jest optymizm — i to za darmo.', en: 'No coffee. The shuttle\'s whole power reserve is earmarked for the camp. But there\'s optimism — and that one\'s free.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Kern, geologia. Budzik z kapsuły numer cztery wyrwał mnie ze snu tuż przed waszym lądowaniem — zostaję na orbicie, prowadzę was głosem. Ten księżyc ma coś w skorupie. Czuję to nawet stąd.', en: 'Kern, geology. The alarm from capsule four pulled me out of sleep just before your landing — I\'m staying in orbit, guiding you by voice. This moon has something in its crust. I can feel it from up here.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'A Harris?', en: 'And Harris?' }, mode: 'monologue' },
      { speaker: 'Moreau', text: { pl: 'Harris został na statku. Regeneracja synchronizacji neuronalnej — tak to nazwał lekarz pokładowy. Śpi. Zbudzimy go, jak będzie po co.', en: 'Harris stayed on the ship. Neural-sync regeneration — that\'s what the ship medic called it. He\'s asleep. We\'ll wake him when there\'s something to wake him for.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cel Księżyca 1 jest prosty do wypowiedzenia i trudny do wykonania: załóż przyczółek, odbuduj mi pierwszy zmysł. Zanim zacznę planować, muszę zobaczyć. Zacznij od obozu Moreau.', en: 'The Moon 1 objective is simple to say and hard to do: establish a foothold, rebuild me a first sense. Before I can plan, I must see. Start at Moreau\'s camp.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_LANDING_INTRO_SEEN] },
  },

  // Camp console — quest hub for "Oczy misji"
  'm1-camp-console-start': {
    id: 'm1-camp-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'STÓŁ OBOZU BAZOWEGO — online. Zakładka: protokoły ekspedycyjne.', en: 'BASE CAMP TABLE — online. Tab: expedition protocols.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Zanim cokolwiek zbudujemy, potrzebuję rozpoznania. Trzy punkty na obrzeżach polany. Podejdź do każdego, opisz mi go, a ja złożę z twoich słów pierwszy obraz tego miejsca.', en: 'Before we build anything, I need reconnaissance. Three points on the edges of the clearing. Go to each, describe it to me, and I will assemble a first picture of this place from your words.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli moja robota to zwiad — najpierw patrzeć, potem działać. Da się zapamiętać.', en: 'So my job is recon — look first, act second. I can remember that.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Oczy misji — opisz trzy punkty pomiarowe.', en: '◆ NEW MISSION: Eyes of the Mission — describe the three survey points.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M1_EYES_ACTIVE], activateQuest: 'q-m1-eyes' },
  },
  'm1-camp-console-waiting': {
    id: 'm1-camp-console-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Wciąż czekam na trzy opisy: ściana dżungli na zachodzie, linia spalenizny przy promie, widok na grań od wschodu. Wróć tu, gdy obejdziesz wszystkie trzy.', en: 'I am still waiting on three descriptions: the jungle wall to the west, the burn line by the shuttle, the ridge view to the east. Come back once you have walked all three.' }, mode: 'dialogue' },
    ],
  },
  'm1-camp-report': {
    id: 'm1-camp-report',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Obszedłem wszystko. Ściana dżungli — nieprzenikniona, ale żywa. Linia spalenizny — i o tym jeszcze pogadamy. Grań na wschodzie — jest przejście, wąskie, ale jest.', en: 'I walked all of it. The jungle wall — impenetrable, but alive. The burn line — we\'ll come back to that. The ridge to the east — there\'s a pass, narrow, but it\'s there.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mam pierwszy obraz. Z twoich słów rysuje mi się mapa — niepełna, ale prawdziwa. Kieruję rezerwę mocy promu do obozu. Bariera na wschodzie opadnie.', en: 'I have a first picture. From your words a map draws itself — incomplete, but true. I am routing the shuttle\'s power reserve to the camp. The eastern barrier will drop.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'OBÓZ: ZASILONY. Wschodnie przejście odblokowane.', en: 'CAMP: POWERED. Eastern pass unlocked.' }, mode: 'system', autoAdvance: 2600 },
    ],
    onComplete: { setFlags: [FLAGS.M1_CAMP_ONLINE], grantXp: 25 },
  },
  'm1-camp-console-online': {
    id: 'm1-camp-console-online',
    lines: [
      { speaker: 'system', text: { pl: 'STÓŁ OBOZU: stabilny. Zasilanie 100%. Protokoły ekspedycyjne dostępne.', en: 'CAMP TABLE: stable. Power 100%. Expedition protocols available.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'Moreau', text: { pl: 'Obóz stoi. Stąd prowadzę resztę misji. Idź w dżunglę — ja pilnuję światła.', en: 'Camp\'s up. I run the rest of the mission from here. Go into the jungle — I\'ll keep the lights on.' }, mode: 'dialogue' },
    ],
  },

  // Survey points — Dexo describes, CORE AI reacts
  'm1-survey-wall': {
    id: 'm1-survey-wall',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Punkt pierwszy: ściana dżungli. Pnącza grube jak liny cumownicze, liście świecą własnym, chłodnym światłem. Za nią nic nie widać dalej niż na dwa kroki.', en: 'Point one: the jungle wall. Vines thick as mooring lines, leaves glowing with their own cold light. Beyond it you cannot see farther than two steps.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisane. Bioluminescencja oznacza żywy ekosystem — dobrze. Żywy księżyc rzadko bywa pułapką. Zapamiętaj to zdanie, może się jeszcze zemści.', en: 'Recorded. Bioluminescence means a living ecosystem — good. A living moon is rarely a trap. Remember that sentence; it may come back to bite us.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_EYES_WALL_SEEN] },
  },
  'm1-survey-wall-seen': {
    id: 'm1-survey-wall-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ściana dżungli. Wciąż nieprzenikniona, wciąż świeci. Opisane.', en: 'The jungle wall. Still impenetrable, still glowing. Described.' }, mode: 'monologue' },
    ],
  },
  'm1-survey-burn': {
    id: 'm1-survey-burn',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Punkt drugi: linia spalenizny przy promie. Tyle że... to nie wzór z naszych silników. I ta skała jest wypalona głębiej, niż wypaliłoby ją dzisiejsze lądowanie. To jest stare.', en: 'Point two: the burn line by the shuttle. Except... this isn\'t the pattern our engines leave. And the rock is scorched deeper than today\'s landing would ever reach. This is old.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisuję jako anomalię. Ktoś tu wcześniej wylądował — albo coś tu wcześniej spadło. Nie mam czym tego zweryfikować. Na razie: zapamiętane.', en: 'Logging it as an anomaly. Someone landed here before — or something fell here before. I have nothing to verify it with. For now: remembered.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'To stara skała, Dexo. Wulkaniczna. Na pewno. Idź do trzeciego punktu i nie rób z polany kryminału.', en: 'That\'s old rock, Dexo. Volcanic. Certainly. Go to the third point — and don\'t turn the clearing into a murder mystery.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_EYES_BURN_SEEN, FLAGS.M1_OLD_BURNS_FOUND] },
  },
  'm1-survey-burn-seen': {
    id: 'm1-survey-burn-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Linia spalenizny. Wciąż starsza, niż powinna być. Moreau wciąż woli tego nie słyszeć.', en: 'The burn line. Still older than it should be. Moreau still prefers not to hear it.' }, mode: 'monologue' },
    ],
  },
  'm1-survey-ridge': {
    id: 'm1-survey-ridge',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Punkt trzeci: widok na wschód. Grań wznosi się nad dachem dżungli, a między drzewami jest przejście. Wąskie, ale prowadzi w głąb — dokładnie tam, gdzie kończy się polana.', en: 'Point three: the eastward view. A ridge rises above the canopy, and between the trees there is a pass. Narrow, but it leads inward — right where the clearing ends.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Trzy opisy, trzy krawędzie mapy. To mi wystarczy, żeby przestać być ślepy na tej jednej polanie. Wróć do konsoli obozowej — złożę raport w całość.', en: 'Three descriptions, three edges of a map. That is enough for me to stop being blind on this one clearing. Return to the camp console — I will assemble the report.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_EYES_RIDGE_SEEN] },
  },
  'm1-survey-ridge-seen': {
    id: 'm1-survey-ridge-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Grań na wschodzie, przejście między drzewami. Opisane. Konsola obozowa czeka na raport.', en: 'The eastern ridge, the pass between the trees. Described. The camp console is waiting for the report.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — short debrief prompt
  'q-m1-eyes-complete': {
    id: 'q-m1-eyes-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ REKONESANS ZAKOŃCZONY: trzy punkty opisane.', en: '◆ RECON COMPLETE: three points described.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Mam z czego rysować. Wróć do stołu obozowego i złóż raport — wtedy skieruję moc do obozu.', en: 'I have something to draw from. Return to the camp table and file the report — then I will route power to the camp.' }, mode: 'dialogue' },
    ],
  },

  // Wreck debris — old crash under the canopy
  'm1-wreck-debris': {
    id: 'm1-wreck-debris',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kadłub jakiejś maszyny, wrośnięty w poszycie. Obcy i stary. Dżungla przerobiła go na doniczkę. Ktoś tu był i nie zabrał swoich rzeczy.', en: 'The hull of some machine, grown into the undergrowth. Foreign and old. The jungle turned it into a planter. Someone was here — and didn\'t take their things.' }, mode: 'monologue' },
    ],
  },

  // Preflight panel — shuttle status
  'm1-preflight-panel': {
    id: 'm1-preflight-panel',
    lines: [
      { speaker: 'system', text: { pl: 'PROM: na ziemi. Zasilanie: rezerwa oddana do obozu. Ładownia: pusta. Kanał łączności ze statkiem: otwarty.', en: 'SHUTTLE: grounded. Power: reserve donated to camp. Cargo bay: empty. Ship comms channel: open.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Pusta ładownia i otwarty kanał. Kiedy oba się zmienią, będziemy mieli po co wracać.', en: 'An empty bay and an open channel. When both of those change, we\'ll have a reason to go home.' }, mode: 'monologue' },
    ],
  },
  'm1-preflight-final': {
    id: 'm1-preflight-final',
    lines: [
      { speaker: 'system', text: { pl: 'PROM: gotowy do odlotu. Ładownia: Synaptit, 14 kg. Sensory CORE AI: online.', en: 'SHUTTLE: ready for departure. Cargo bay: Synaptit, 14 kg. CORE AI sensors: online.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Kontrola przedlotowa. Harris, słyszysz? ...Harris. Zgłoś się.', en: 'Preflight check. Harris, do you copy? ...Harris. Respond.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Śpi. Pewnie śpi. Regeneracja bywa głęboka. Zaparzę kawę, zanim ruszymy — tym razem naprawdę.', en: 'He\'s asleep. Probably asleep. Regeneration runs deep sometimes. I\'ll brew coffee before we move — this time for real.' }, mode: 'dialogue' },
    ],
  },

  // Grove door — locked until camp is powered
  'm1-grove-door-locked': {
    id: 'm1-grove-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WSCHODNIE PRZEJŚCIE: bariera energetyczna aktywna.', en: 'EASTERN PASS: energy barrier active.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Bariera będzie buczeć, dopóki nie skieruję do niej mocy z obozu. Skończ rekonesans, złóż raport przy stole — wtedy przejście ustąpi.', en: 'The barrier will hum until I route camp power to it. Finish the recon, file the report at the table — then the pass will yield.' }, mode: 'dialogue' },
    ],
  },

  // Moreau NPC — evolves through the moon
  'm1-moreau-default': {
    id: 'm1-moreau-default',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Rozkładam obóz. Namiot, generator, stół. Kawy dalej nie ma — nie pytaj. Idź, bądź oczami tej maszyny, ja pilnuję bazy.', en: 'Setting up camp. Tent, generator, table. Still no coffee — don\'t ask. Go, be that machine\'s eyes; I\'ll hold the base.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-burns': {
    id: 'm1-moreau-burns',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ta spalenizna naprawdę mnie gryzie, Moreau.', en: 'That scorch mark really bothers me, Moreau.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Stara skała. Na pewno. — Mówię to trochę za szybko, sama słyszę. Idź dalej, Dexo. Proszę.', en: 'Old rock. Certainly. — I\'m saying it a touch too fast; I can hear it myself. Move on, Dexo. Please.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-camp': {
    id: 'm1-moreau-camp',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Obóz stoi, światło działa, maszyna widzi swoją pierwszą polanę. Dobry pierwszy dzień. Nie przyzwyczajaj się.', en: 'Camp\'s up, the lights work, the machine can see its first clearing. A good first day. Don\'t get used to it.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-cricket': {
    id: 'm1-moreau-cricket',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Zbudowałeś świerszcza. Z wraku. Poleciałeś w dżunglę i wróciłeś z terkoczącym dronem, któremu nadałam imię przez łącze. Nie wiem, czy jestem dumna, czy przerażona.', en: 'You built a cricket. Out of a wreck. You went into the jungle and came back with a chirping drone I named over the link. I don\'t know whether I\'m proud or terrified.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-ore': {
    id: 'm1-moreau-ore',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Pokaż. — Czternaście kilo Synaptitu. Do tej pory znałam to tylko z wykresów. Teraz mam to w dłoni. Mała bryłka, a Ziemia potrzebuje jej całych gór.', en: 'Show me. — Fourteen kilos of Synaptit. Up to now I only knew it from charts. Now it\'s in my hand. A small lump, and Earth needs whole mountains of it.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-sensors': {
    id: 'm1-moreau-sensors',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Kawa. Prawdziwa. Zaparzyłam ją, kiedy maszyna wreszcie przejrzała na oczy. Zasłużyłeś.', en: 'Coffee. Real coffee. I brewed it when the machine finally opened its eyes. You earned it.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'I słuchaj... ta spalenizna, którą zbyłam pierwszego dnia. Widziałam takie ślady wcześniej, w archiwach. Nie chciałam ci psuć pierwszego kroku na obcym świecie. Teraz już wiesz, że wtedy nie kłamałam. Zbyłam to, bo bałam się, że mam rację.', en: 'And listen... that scorch mark I brushed off on day one. I\'ve seen marks like that before, in the archives. I didn\'t want to ruin your first step on an alien world. Now you know I wasn\'t lying then. I brushed it off because I was afraid I was right.' }, mode: 'dialogue' },
    ],
  },
  'm1-moreau-epilogue': {
    id: 'm1-moreau-epilogue',
    lines: [
      { speaker: 'Moreau', text: { pl: 'Więc to koniec tego księżyca. Maszyna widzi, ładownia pełna, a ja mam drugi kubek. Usiądź na chwilę, Dexo. Zaraz i tak polecimy dalej.', en: 'So that\'s this moon done. The machine can see, the cargo\'s full, and I\'ve got a second cup. Sit for a moment, Dexo. We fly on soon enough anyway.' }, mode: 'dialogue' },
    ],
  },

  // Exam I — Protokół Ekspedycyjny I
  'm1-exam-protocol-1-done': {
    id: 'm1-exam-protocol-1-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY I — „NAJPIERW PYTANIA”: zaliczony.', en: 'EXPEDITION PROTOCOL I — "QUESTIONS FIRST": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy protokół odzyskany z mojej uszkodzonej pamięci: najpierw badasz, potem budujesz; najpierw pytasz, potem działasz. Dobrze, że to ty go zdałeś — mojej pamięci lepiej go nie powierzać.', en: 'First protocol recovered from my damaged memory: investigate before you build; ask before you act. Good that you\'re the one who passed it — better not to trust it to my memory.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-protocol-1-already': {
    id: 'm1-exam-protocol-1-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny I już zaliczony.', en: 'Expedition Protocol I already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — camp closing scene (conditional intro)
  'm1-return-camp': {
    id: 'm1-return-camp',
    lines: [
      { speaker: 'system', text: { pl: 'LĄDOWISKO — POWRÓT', en: 'LANDING PAD — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Widzę tę polanę po raz drugi — i po raz pierwszy naprawdę. Twój pierwszy opis był dobry, Dexo. Był tylko ślepy, jak ja wtedy.', en: 'I see this clearing a second time — and for the first time truly. Your first description was good, Dexo. It was only blind, as I was then.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'Moreau', text: { pl: 'Wróciłeś. I coś przyniosłeś. Chodź do obozu — kawa stygnie, a ja mam ci parę rzeczy do powiedzenia, zanim odlecimy.', en: 'You\'re back. And you brought something. Come to the camp — the coffee\'s cooling, and I\'ve a few things to tell you before we lift off.' }, mode: 'cinematic', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M1_RETURN_CAMP_SEEN] },
  },
};
