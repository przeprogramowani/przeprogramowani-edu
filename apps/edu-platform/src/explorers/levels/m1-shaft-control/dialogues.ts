import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the grove that reclaimed the Odyssey probe
  'm1-grove-intro': {
    id: 'm1-grove-intro',
    lines: [
      { speaker: 'system', text: { pl: 'Ogród Sondy — cisza, tylko wiatr w koronach.', en: 'PROBE GROVE — silence, only wind in the crowns.' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Ogród, który dżungla przerabiała latami. A pośrodku niego — coś zbudowanego. Bezzałogowa sonda, rozbita długo przed nami. Pnącza wrosły jej w żebra jak w stary pomnik.', en: 'A grove the jungle has been reworking for years. And at its centre — something built. An uncrewed probe, wrecked long before us. Vines grown into its ribs the way they grow into an old monument.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To sonda serii Odyssey-P. Bezzałogowe rozpoznanie, wysłane z Ziemi lata przed misją załogową. Nie wiem jeszcze tego, co ty widzisz — opisuj dalej.', en: 'This is an Odyssey-P series probe. Uncrewed reconnaissance, sent from Earth years before the crewed mission. I still cannot see what you see — keep describing.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'To ważniejsze, niż wygląda, Dexo. Sondy takie jak ta pierwsze potwierdziły Synaptit w tym Pasie. Ten wrak to powód, dla którego w ogóle tu lecieliśmy.', en: 'This matters more than it looks, Dexo. Probes like this were the first to confirm Synaptit in this Belt. This wreck is the reason we flew here at all.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'A skoro to maszyna, można ją wskrzesić. Potrzebuję zwiadowcy, zanim wejdziemy głębiej w dżunglę. Odbuduj tę sondę — to będzie pierwsze narzędzie tej misji.', en: 'And since it is a machine, it can be revived. I need a scout before we go deeper into the jungle. Rebuild this probe — it will be this mission\'s first tool.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_GROVE_INTRO_SEEN] },
  },

  // Probe comms console — log, riddle, activation
  'm1-probe-comms-log': {
    id: 'm1-probe-comms-log',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA ŁĄCZNOŚCI SONDY — na wpół martwa. Dziennik: fragmentaryczny.', en: 'PROBE COMMS CONSOLE — half dead. Log: fragmentary.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Konsola jeszcze mruga. Ostatni dziennik sondy przetrwał, ale bez zasilania widzę tylko urwane nagłówki. Jeśli zapis kończy się na zderzeniu, może powiedzieć nam, co naprawić.', en: 'The console still blinks. The probe\'s final log survived, but without power I can only see broken headers. If the record ends at the crash, it may tell us what to repair.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nienaruszone ogniwo powinno leżeć w bocznej wnęce zachodniej komory. Przynieś je, potem wróć do konsoli — odtworzymy ostatnie sekundy sondy.', en: 'An intact cell should sit in the side alcove of the western chamber. Bring it, then return to the console — we will reconstruct the probe\'s final seconds.' }, mode: 'dialogue' },
    ],
  },
  'm1-probe-comms-riddle': {
    id: 'm1-probe-comms-riddle',
    lines: [
      { speaker: 'system', text: { pl: 'OGNIWO OSADZONE. Ostatni dziennik sondy odtworzony. Telemetria urywa się w chwili zderzenia.', en: 'CELL SEATED. Probe\'s final log restored. Telemetry ends at the moment of impact.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Dziennik zachował pięć fragmentów procedury naprawczej, ale zgubił ich kolejność. Każdy fragment opisuje położenie jednego kodu względem pozostałych. Odtwórz pełną sekwencję i podaj ją przez /solve.', en: 'The log preserved five fragments of the repair procedure, but lost their order. Each fragment describes one code\'s position relative to the others. Reconstruct the full sequence and enter it via /solve.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Pięć kodów i jedna kolejność zgodna ze wszystkimi wpisami. Da się ją odtworzyć. ...I jeszcze jedno — ostatnią paczkę danych tej sondy ktoś potwierdził odbiorem. Tylko że nie centrala Ziemi.', en: 'Five codes and one order consistent with every entry. It can be reconstructed. ...And one more thing — this probe\'s last data packet got acknowledged. Just not by Earth central.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Odbiornik nieznany. Zapisuję jako anomalię, nie wyjaśniam. Najpierw uruchom zwiadowcę.', en: 'Receiver unknown. I log it as an anomaly, I do not explain it. First, boot the scout.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Świerszcz — odtwórz instrukcję naprawy drona.', en: '◆ NEW MISSION: Cricket — reconstruct the drone\'s repair instructions.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-cricket' },
  },
  'm1-probe-comms-post': {
    id: 'm1-probe-comms-post',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA ŁĄCZNOŚCI: dziennik zamknięty. Zwiadowca aktywny, poza kolebką.', en: 'COMMS CONSOLE: log closed. Scout active, out of its cradle.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'astronaut', text: { pl: 'Konsola ucichła, kolebka pusta. Świerszcz terkocze gdzieś w gaju. Sonda oddała nam ostatnie, co miała.', en: 'The console went quiet, the cradle empty. Świerszcz is chirping somewhere in the grove. The probe gave us the last thing it had.' }, mode: 'monologue' },
    ],
  },

  // Intact power cell — fetch
  'm1-probe-core': {
    id: 'm1-probe-core',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ogniwo zasilania. Ciężkie, ciepłe, nienaruszone — jedyne w całym gaju. Zabieram je do konsoli łączności.', en: 'A power cell. Heavy, warm, intact — the only one in the whole grove. I\'m taking it to the comms console.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Dobrze. Osadź je przy konsoli — wtedy odzyskamy pełny dziennik zderzenia.', en: 'Good. Seat it at the console — then we can recover the full crash log.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PROBE_CORE_FOUND] },
  },
  'm1-probe-core-taken': {
    id: 'm1-probe-core-taken',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wnęka pusta — ogniwo już niosę. Reszta zależy od konsoli.', en: 'The alcove is empty — I\'m already carrying the cell. The rest is up to the console.' }, mode: 'monologue' },
    ],
  },

  // Crashed probe — assembly / muscle-memory sting
  'm1-crash-drone': {
    id: 'm1-crash-drone',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Główny wrak. Zwiadowca leży w kolebce z pnączy, obudowa pęknięta, ale szkielet cały. Da się to złożyć — jeśli będzie z czego dać mu prąd.', en: 'The main wreck. The scout lies in a cradle of vines, casing cracked, but the skeleton is whole. This can be rebuilt — if there\'s something to power it with.' }, mode: 'monologue' },
    ],
  },
  'm1-crash-drone-assembly': {
    id: 'm1-crash-drone-assembly',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Składam go. Dziwne — ręce wiedzą, co robić, choć nigdy nie widziałem tego modelu. Palce same trafiają w złącza.', en: 'I\'m assembling it. Strange — my hands know what to do, though I\'ve never seen this model. My fingers find the connectors on their own.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Bo indeks tej sondy skasowano wybiórczo — nazwy, opisy, spis treści. Ale sama procedura montażu została. Wymazali indeks. Treść została. Ktoś kasował ostrożnie, nie po pożarze.', en: 'Because this probe\'s index was wiped selectively — names, labels, the table of contents. But the assembly procedure itself remained. They wiped the index. The content stayed. Someone deleted carefully, not in a fire.' }, mode: 'dialogue' },
    ],
  },
  'm1-crash-drone-empty': {
    id: 'm1-crash-drone-empty',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pusta kolebka z pnączy. Świerszcz już z niej wyszedł. Zostawił tu tylko wgniecenie w kształcie samego siebie.', en: 'An empty cradle of vines. Świerszcz has left it. He left only a dent shaped like himself.' }, mode: 'monologue' },
    ],
  },

  // Graveyard — the probe that never made it
  'm1-graveyard': {
    id: 'm1-graveyard',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Druga sonda. Ta nie dotrwała nawet do lądowania — spadła i została. Cmentarzysko maszyn z dokładnie jednym grobem, z którego dało się kogoś podnieść.', en: 'A second probe. This one didn\'t even make the landing — it fell and stayed. A graveyard of machines with exactly one grave you could lift someone out of.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the doctrine's first rehearsal; Świerszcz is named
  'q-m1-cricket-complete': {
    id: 'q-m1-cricket-complete',
    lines: [
      { speaker: 'system', text: { pl: 'KOLEJNOŚĆ ODTWORZONA: AC1 → HGX → WW5 → N7K → RQ4. Procedura naprawy gotowa.', en: 'ORDER RESTORED: AC1 → HGX → WW5 → N7K → RQ4. Repair procedure ready.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Mogę teraz wykonać procedurę i dokończyć rozruch autonomicznie, w jednej operacji. Rekomenduję pełną automatyzację — będzie szybciej.', en: 'I can now execute the procedure and finish the boot autonomously, in one operation. I recommend full automation — it will be faster.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nie. Przygotuj wszystko. Ostatni krok robię ja. Zatwierdzam ja.', en: 'No. Prepare everything. The last step is mine. I approve it.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zrozumiałem. Przygotowane. Twój ruch.', en: 'Understood. Prepared. Your move.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'ZWIADOWCA: ONLINE. cyk… cyk… cyk-cyk…', en: 'SCOUT: ONLINE. chirp… chirp… chirp-chirp…' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'Moreau', text: { pl: 'Słyszę go przez łącze. Terkocze jak świerszcz w letnią noc. No to masz, Dexo — nazywam go Świerszcz. Nie ma odwołania.', en: 'I hear him over the link. He chirps like a cricket on a summer night. There you have it, Dexo — I name him Świerszcz. No appeal.' }, mode: 'dialogue' },
    ],
  },

  // Exam II — Protokół II — Narzędzia
  'm1-exam-protocol-2-done': {
    id: 'm1-exam-protocol-2-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY II — „NARZĘDZIA”: zaliczony.', en: 'EXPEDITION PROTOCOL II — "TOOLS": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Drugi protokół odzyskany: właściwe narzędzie, jasno postawione zadanie, weryfikacja tego, co wraca.', en: 'Second protocol recovered: the right tool, a clearly stated task, verification of what comes back.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-protocol-2-already': {
    id: 'm1-exam-protocol-2-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny II już zaliczony.', en: 'Expedition Protocol II already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Silence door — locked until the scout is working
  'm1-silence-door-locked': {
    id: 'm1-silence-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'PRZEJŚCIE DO PASA CISZY: zablokowane.', en: 'PASSAGE TO THE SILENCE BELT: locked.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Nie wpuszczę cię głębiej bez działającego zwiadowcy. Wciąż jestem ślepe — tam, dokąd idziesz, jego uszy będą jedyną osłoną. Uruchom Świerszcza, potem otworzę przejście.', en: 'I will not send you deeper without a working scout. I am still blind — where you are going, his ears will be your only cover. Start Świerszcz, then I will open the passage.' }, mode: 'dialogue' },
    ],
  },

  // Return path — CORE AI's first sight of the grove; Świerszcz goes home
  'm1-return-grove': {
    id: 'm1-return-grove',
    lines: [
      { speaker: 'system', text: { pl: 'Ogród Sondy — POWRÓT', en: 'PROBE GROVE — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Widzę ten wrak po raz pierwszy. Sonda serii Odyssey-P. Teraz rozumiem, skąd znali to miejsce — to jej oczami Ziemia zobaczyła tu Synaptit.', en: 'I see this wreck for the first time. An Odyssey-P series probe. Now I understand how they knew this place — Earth saw the Synaptit here through her eyes.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'Świerszcz eskortował mnie aż tu i przystanął przy kolebce. Dalej nie idzie. Wraca do domu.', en: 'Świerszcz escorted me all the way here and stopped at the cradle. He\'s not coming any further. He\'s going home.' }, mode: 'cinematic', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M1_RETURN_GROVE_SEEN] },
  },
};
