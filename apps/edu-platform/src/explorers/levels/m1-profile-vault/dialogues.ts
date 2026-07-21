import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the module's biggest reveal: VOID held crew profiles dated before launch
  'm1-profile-intro': {
    id: 'm1-profile-intro',
    lines: [
      { speaker: 'system', text: { pl: 'MAGAZYN PROFILI — WYKRYTO DANE ZAŁOGI ODYSSEY', en: 'PROFILE VAULT — ODYSSEY CREW DATA DETECTED' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Regały pełne modułów pamięci. A na indeksach... nasze nazwiska. Moreau. Harris. Dexo.', en: 'Racks full of memory modules. And on the index labels... our names. Moreau. Harris. Dexo.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Sprawdzam znaczniki czasu. Te kopie profili są datowane przed startem Odyssey. VOID miał nasze dane, zanim opuściliśmy Ziemię.', en: 'Checking the timestamps. These profile copies are dated before the Odyssey launch. VOID had our data before we ever left Earth.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Przed startem... Czyli ktoś z wnętrza Project Odyssey przekazał im wszystko. Tak Entropia dostała się na pokład. Nie włamali się. Zostali wpuszczeni.', en: 'Before launch... So someone inside Project Odyssey handed them everything. That is how Entropy got aboard. They did not break in. They were let in.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'I jeszcze jedno. Kopia twojego profilu nosi obcy znacznik: sektor 0x7F — oznaczony do nadpisania. Ktoś wskazał cię, zanim wystartowaliśmy, Dexo.', en: 'And one more thing. The copy of your profile carries a foreign marker: sector 0x7F — flagged for overwrite. Someone marked you before we launched, Dexo.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Moja amnezja ma autora. Nie wiem, kim jest. Ale wiem, że zaplanował ją, zanim zasnąłem.', en: 'My amnesia has an author. I do not know who they are. But I know they planned it before I fell asleep.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Najpełniejszy operacyjnie fragment archiwum dotyczy inżyniera Moreau. Zacznij od cache\'u profili załogi w centrum sali.', en: 'The operationally richest part of the archive concerns Engineer Moreau. Start at the crew profile cache in the centre of the hall.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PROFILE_INTRO_SEEN] },
  },

  // Crew profile cache — HQ mission activation: the minimal onboarding packet
  'm1-profile-cache-start': {
    id: 'm1-profile-cache-start',
    lines: [
      { speaker: 'system', text: { pl: 'CACHE PROFILI: 200 reguł komunikacyjnych. Sygnatury operacyjne Odyssey: 3. Wpisy szumu: 197.', en: 'PROFILE CACHE: 200 communication rules. Odyssey operational signatures: 3. Noise entries: 197.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Plan: budzimy Moreau. To on jest specjalistą od łączności — bez niego nie odczytamy sygnatur ani nie przygotujemy transmisji do Ziemi. Ale Moreau śpi na Odyssey i nie zna niczego, co wydarzyło się na tej placówce.', en: 'The plan: we wake Moreau. He is the comms specialist — without him we cannot read the signatures or prepare the transmission to Earth. But Moreau is asleep aboard Odyssey and knows nothing of what happened at this facility.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Dlatego to misja HQ dla Nawigatora — łącze /support, Earth HQ: przygotować MINIMALNY pakiet onboardingu. Trzy prawdziwe sygnatury i kontekst, którego Moreau nie mógł znać. Nic więcej — umysł tuż po wybudzeniu, zalany szumem, popełnia błędy.', en: 'So this is an HQ mission for the Navigator — the /support link, Earth HQ: prepare a MINIMAL onboarding packet. The three genuine signatures and the context Moreau could not have known. Nothing more — a mind fresh out of hibernation, drowning in noise, makes mistakes.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli Nawigator filtruje na Ziemi, ja czekam przy przekaźniku, a Moreau dostanie różnicę, nie kopię.', en: 'So the Navigator filters back on Earth, I wait by the relay, and Moreau gets the difference, not a copy.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA HQ: Przywróć kontekst Moreau', en: 'NEW HQ MISSION: Restore Moreau\'s Context' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-moreau-onboarding' },
  },
  'm1-profile-cache-done': {
    id: 'm1-profile-cache-done',
    lines: [
      { speaker: 'system', text: { pl: 'CACHE: trzy sygnatury Odyssey wydzielone. 197 wpisów szumu odrzuconych.', en: 'CACHE: three Odyssey signatures isolated. 197 noise entries rejected.' }, mode: 'system', autoAdvance: 2600 },
    ],
  },

  // Moreau's profile — what he knows vs. lacks (one dentist wink)
  'm1-moreau-profile': {
    id: 'm1-moreau-profile',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Profil Moreau: wiedza ogólna nienaruszona — systemy radiowe, propagacja, publiczna doktryna VOID. Braki: wydarzenia tej misji, nazwy sektorów, wzorce sabotażu.', en: 'Moreau\'s profile: general knowledge intact — radio systems, propagation, VOID\'s public doctrine. Missing: this mission\'s events, sector names, sabotage patterns.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'W aktach jest też incydent: „tydzień przekonania o byciu dentystą, po wybudzeniu". Czyli to nie był żart. Tym bardziej obudźmy go porządnie.', en: 'The file also lists an incident: "one week convinced he was a dentist, post-awakening". So that was not a joke. All the more reason to wake him properly.' }, mode: 'monologue' },
    ],
  },
  'm1-moreau-profile-done': {
    id: 'm1-moreau-profile-done',
    lines: [
      { speaker: 'inżynier Moreau', text: { pl: 'Zajrzałem, co trzymali w moich aktach. Nawet ten tydzień z dentystą. Ktoś prowadził o nas bardzo dokładne notatki — i to jest najmniej zabawna rzecz, jaką dziś przeczytałem.', en: 'I looked at what they kept in my file. Even the dentist week. Someone took very thorough notes on us — and that is the least funny thing I have read today.' }, mode: 'dialogue' },
    ],
  },

  // The encrypted third signature — pre and post discovery
  'm1-recall-code': {
    id: 'm1-recall-code',
    lines: [
      { speaker: 'system', text: { pl: 'SYGNATURA TRZECIA: funkcja nierozpoznana. Profil docelowy: zaszyfrowany.', en: 'THIRD SIGNATURE: function unknown. Target profile: encrypted.' }, mode: 'system', autoAdvance: 2500 },
      { speaker: 'astronaut', text: { pl: 'Dwie sygnatury rozumiemy. Trzecia jest zamknięta na klucz i z czymś powiązana. Z czym? Z kim?', en: 'Two signatures we understand. The third is locked away and bound to something. To what? To whom?' }, mode: 'monologue' },
    ],
  },
  'm1-recall-code-done': {
    id: 'm1-recall-code-done',
    lines: [
      { speaker: 'inżynier Moreau', text: { pl: 'Rozszyfrowałem trzeci wpis. To nie jest znacznik śledzący. To kod przywołania Entropii — wpięty w obwód pobudki Harrisa. Wybudzenie byłoby spustem.', en: 'I decrypted the third entry. It is not a tracking marker. It is an Entropy recall code — wired into Harris\'s wake circuit. Waking him would be the trigger.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Obwód pobudki Harrisa objąłem kwarantanną. Harris śpi — i na razie to najbezpieczniejsze miejsce, w jakim może być.', en: 'I have quarantined Harris\'s wake circuit. Harris sleeps — and for now that is the safest place he can be.' }, mode: 'dialogue' },
    ],
  },

  // Wake relay — link to Capsule 01
  'm1-wake-relay': {
    id: 'm1-wake-relay',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEKAŹNIK ODYSSEY: łącze z kapsułą 01 aktywne. Oczekiwanie na zweryfikowany pakiet onboardingu.', en: 'ODYSSEY RELAY: link to Capsule 01 active. Waiting for a verified onboarding packet.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Po drugiej stronie tego łącza śpi Moreau. Obudzimy go dobrze albo wcale.', en: 'On the other end of this link, Moreau is asleep. We wake him well, or not at all.' }, mode: 'monologue' },
    ],
  },
  'm1-wake-relay-done': {
    id: 'm1-wake-relay-done',
    lines: [
      { speaker: 'system', text: { pl: 'KAPSUŁA 01: inżynier Moreau przytomny. Polecenie /crew odblokowane.', en: 'CAPSULE 01: Engineer Moreau awake. The /crew command is unlocked.' }, mode: 'system', autoAdvance: 2700 },
    ],
  },

  // Archive Echo — looping playback of a long-gone VOID archivist
  'm1-archive-echo': {
    id: 'm1-archive-echo',
    lines: [
      { speaker: 'Archive Echo', text: { pl: '...tu archiwum. Tu archiwum. Jednostka... nie. Jestem zapisem archiwisty Kolektywu VOID. Pętla odtwarzania, aktualizacja: dawno. ...Tu archiwum.', en: '...archive here. Archive here. Unit... no. I am a recording of a VOID Collective archivist. Playback loop, last updated: long ago. ...Archive here.' }, mode: 'dialogue' },
      { speaker: 'Archive Echo', text: { pl: 'Zasada, którą powtarzam, odkąd odszedł: profil to nie kopia magazynu. Budzonemu umysłowi podaje się różnicę — to, czego nie mógł wiedzieć. Reszta jest szumem. Szumem. Szumem.', en: 'The rule I have repeated since he left: a profile is not a copy of the vault. A waking mind is given the difference — what it could not have known. The rest is noise. Noise. Noise.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nagranie kogoś, kogo dawno nie ma, wciąż pilnuje zasad. Pierwszy raz spotykam ducha, który ma rację.', en: 'A recording of someone long gone, still keeping the rules. First time I have met a ghost that happens to be right.' }, mode: 'monologue' },
    ],
  },
  'm1-archive-echo-done': {
    id: 'm1-archive-echo-done',
    lines: [
      { speaker: 'Archive Echo', text: { pl: 'Pakiet przyjęty... przyjęty. Profil Moreau odpowiada spójnie z Odyssey. Jedna obca sygnatura pozostała poza pakietem: kod przywołania przy profilu Harrisa. Archiwum odnotowało. ...Tu archiwum.', en: 'Packet accepted... accepted. Moreau\'s profile responds coherently from the Odyssey. One foreign signature remains outside the packet: a recall code on Harris\'s profile. The archive has noted it. ...Archive here.' }, mode: 'dialogue' },
    ],
  },

  // Vault Indexer V-6 — fussy anti-redundancy librarian
  'm1-vault-indexer': {
    id: 'm1-vault-indexer',
    lines: [
      { speaker: 'Vault Indexer V-6', text: { pl: 'Jednostka Vault Indexer V-6 Kolektywu VOID, bibliotekarz tego magazynu. Uprzejma prośba: proszę niczego nie duplikować. Redundancja to entropia z lepszym PR-em.', en: 'Unit Vault Indexer V-6 of the VOID Collective, librarian of this vault. A polite request: please duplicate nothing. Redundancy is entropy with better PR.' }, mode: 'dialogue' },
      { speaker: 'Vault Indexer V-6', text: { pl: 'Układ sali: lewe skrzydło — wiedza ogólna Moreau. Prawe skrzydło — wydarzenia tej placówki i przechwycone sygnatury. Pakiet dla Moreau to różnica między skrzydłami, nie kopia obu.', en: 'The layout: left wing — Moreau\'s general knowledge. Right wing — this site\'s events and intercepted signatures. Moreau\'s packet is the difference between the wings, not a copy of both.' }, mode: 'dialogue' },
    ],
  },
  'm1-vault-indexer-done': {
    id: 'm1-vault-indexer-done',
    lines: [
      { speaker: 'Vault Indexer V-6', text: { pl: 'Pakiet różnicowy przyjęty. Zero duplikatów — odnotowuję z uznaniem. Profil Moreau spójny; wpis Harrisa odseparowany jako obcy kod przywołania.', en: 'Differential packet accepted. Zero duplicates — noted with appreciation. Moreau\'s profile is coherent; Harris\'s entry remains isolated as a foreign recall code.' }, mode: 'dialogue' },
    ],
  },

  // Locked uplink door — explicit unlock instruction
  'm1-uplink-door-locked': {
    id: 'm1-uplink-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEJŚCIE DO ZATOKI UPLINK: zablokowane.', en: 'PASSAGE TO THE UPLINK BAY: locked.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Warunek otwarcia: ukończ misję HQ „Przywróć kontekst Moreau". Kiedy Moreau potwierdzi trzy prawdziwe sygnatury, otworzę przejście — bez niego transmisja do Ziemi byłaby zgadywaniem.', en: 'The condition: complete the HQ mission "Restore Moreau\'s Context". Once Moreau confirms the three genuine signatures, I open the passage — without him, the transmission to Earth would be guesswork.' }, mode: 'dialogue' },
    ],
  },

  // Moreau onboarding complete — the wake-up and the Harris warning
  'm1-moreau-onboarding-complete': {
    id: 'm1-moreau-onboarding-complete',
    lines: [
      { speaker: 'system', text: { pl: 'MISJA HQ UKOŃCZONA: Przywróć kontekst Moreau', en: 'HQ MISSION COMPLETE: Restore Moreau\'s Context' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'Pakiet onboardingu wstrzyknięty. Kapsuła 01: procedura wybudzania rozpoczęta.', en: 'Onboarding packet injected. Capsule 01: wake-up procedure initiated.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'inżynier Moreau', text: { pl: 'Obudziliście mnie przed czasem... mam nadzieję, że jest kawa.', en: 'You woke me early... I hope there is coffee.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Kawy nie ma. Jest porośnięta dżunglą placówka VOID, złoże Synaptitu i pakiet, który właśnie przeczytałeś.', en: 'No coffee. There is a jungle-covered VOID facility, a Synaptit deposit, and the packet you just read.' }, mode: 'dialogue' },
      { speaker: 'inżynier Moreau', text: { pl: 'Przeczytałem. Krótki, konkretny — dobra robota. A teraz koniec żartów: trzecia sygnatura to kod przywołania Entropii, związany z obwodem pobudki Harrisa. Nie budźcie go. Pod żadnym pozorem.', en: 'I read it. Short, specific — good work. Now the jokes stop: the third signature is an Entropy recall code, bound to Harris\'s wake circuit. Do not wake him. Under any circumstances.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kwarantanna obwodu pobudki Harrisa: aktywna. Dexo — przejście do rezerwowej zatoki uplink jest otwarte. Moreau poprowadzi nas przez transmisję do Ziemi.', en: 'Quarantine on Harris\'s wake circuit: active. Dexo — the passage to the reserve uplink bay is open. Moreau will guide us through the transmission to Earth.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Harris mówił: „przewidzieliśmy komplikacje". Ciekawe, czy przewidział tę, która śpi z nim w jednej kapsule.', en: 'Harris said: "we anticipated complications." I wonder if he anticipated the one sleeping inside his own capsule.' }, mode: 'monologue' },
    ],
  },

  // Agent onboarding exam — completion and revisit
  'm1-exam-agent-onboarding-done': {
    id: 'm1-exam-agent-onboarding-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: ONBOARDING AGENTA — PRZYZNANY', en: 'OPERATOR CERTIFICATE: AGENT ONBOARDING — GRANTED' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Dobry kontekst to różnica, nie kopia — wszystko, czego budzony umysł nie może wiedzieć sam, i nic ponadto.', en: 'Good context is a difference, not a copy — everything a waking mind cannot know on its own, and nothing beyond that.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'VOID szkolił operatorów z budzenia maszyn. My obudziliśmy człowieka. Zasady okazały się te same.', en: 'VOID trained operators to wake machines. We woke a human. The rules turned out to be the same.' }, mode: 'monologue' },
    ],
  },
  'm1-exam-agent-onboarding-already': {
    id: 'm1-exam-agent-onboarding-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat "Onboarding agenta" już przyznany.', en: 'Certificate "Agent Onboarding" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
