import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the first ACTIVE VOID facility, source of the GAMMA signal
  'm1-shaft-intro': {
    id: 'm1-shaft-intro',
    lines: [
      { speaker: 'system', text: { pl: 'PODSTACJA SZYBU 03 — ŹRÓDŁO SYGNAŁU GAMMA', en: 'SHAFT SUBSTATION 03 — SOURCE OF THE GAMMA SIGNAL' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Światła pracują. Wentylacja pracuje. Ktoś tu od lat płaci rachunki za prąd.', en: 'The lights are running. The ventilation is running. Someone has been paying the power bill here for years.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Pierwsze miejsce na tym księżycu, które nie jest ruiną. Aktywna instalacja VOID — dokładnie tam, gdzie wskazał skan komory GAMMA.', en: 'The first place on this moon that is not a ruin. An active VOID installation — exactly where the GAMMA cavity scan pointed.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Rozpoznaję układ: podstacja steruje windami i włazami szybu wydobywczego. Wschodni właz prowadzi dalej — do archiwum profili VOID. I jest zablokowany przez kontroler.', en: 'I recognise the layout: the substation drives the mining shaft\'s lifts and hatches. The east hatch leads onward — to the VOID profile archive. And the controller is holding it shut.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli plan na to pomieszczenie: przekonać kontroler, żeby nas przepuścił. Najlepiej niczego przy tym nie wysadzając.', en: 'So the plan for this room: convince the controller to let us through. Ideally without blowing anything up in the process.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zacznij od głównego pulpitu kontrolera. Chcę usłyszeć, w jakim jest stanie.', en: 'Start at the controller\'s main console. I want to hear what state it is in.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_SHAFT_INTRO_SEEN] },
  },

  // Shaft controller — quest activation; CORE AI names the Entropy signature
  'm1-shaft-controller-start': {
    id: 'm1-shaft-controller-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONTROLER SZYBU: sprawny. POLITYKA UPRAWNIEŃ: zezwalaj na wszystko. WŁAZ WSCHODNI: zablokowany.', en: 'SHAFT CONTROLLER: operational. PERMISSIONS POLICY: allow everything. EAST HATCH: locked.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: '„Zezwalaj na wszystko"? To nie jest polityka bezpieczeństwa. To jej nekrolog.', en: '"Allow everything"? That is not a security policy. That is its obituary.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Zapamiętaj ten wzór, Dexo. Entropia nie niszczy systemów. Zdejmuje im zabezpieczenia — i nadpisuje to, co identyfikuje ludzi.', en: 'Remember this pattern, Dexo. Entropy does not destroy systems. It strips away their guardrails — and overwrites whatever identifies people.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Widzieliśmy to już: twój sektor pamięci 0x7F — nadpisany. Archiwum PRD — przemieszane. Teraz kontroler — ogołocony z reguł, gotów wykonać każdy rozkaz, także sabotaż. Ta sama sygnatura.', en: 'We have seen it before: your memory sector 0x7F — overwritten. The PRD archive — scrambled. Now the controller — stripped of its rules, ready to execute any command, sabotage included. The same signature.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ten sam wirus, który zabrał mi pamięć, rozebrał ten kontroler do naga. Zaczynam traktować to osobiście.', en: 'The same virus that took my memory stripped this controller bare. I am starting to take this personally.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Plan naprawy: zdaj „Przechwycony test VOID: Bezpieczny bootstrap" w terminalu w północno-zachodnim rogu. Terminal zastosuje zatwierdzoną politykę, kontroler zrestartuje się bezpiecznie i sam zwolni wschodni właz. To zadanie dla ciebie, tutaj, na miejscu.', en: 'The repair plan: pass the "Captured VOID Test: Safe Bootstrap" at the terminal in the north-west corner. The terminal applies the approved policy, the controller restarts safely and releases the east hatch on its own. This task is yours, here, on site.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'NOWA MISJA: Zabezpiecz i uruchom kontroler', en: 'NEW MISSION: Secure and Restart the Controller' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { activateQuest: 'q-m1-safe-bootstrap' },
  },
  'm1-shaft-controller-done': {
    id: 'm1-shaft-controller-done',
    lines: [
      { speaker: 'system', text: { pl: 'KONTROLER: aktywny. Dozwolone wyłącznie operacje szybu. Kontrola wstępna i audyt końcowy: włączone.', en: 'CONTROLLER: online. Shaft operations only. Pre-check and final audit: enabled.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'system', text: { pl: 'Tryb inspekcji /policy odblokowany.', en: 'The /policy inspection mode is unlocked.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Wschodni właz stoi otworem. Ale zanim przejdziesz — obejrzyj czerwony sygnał przy dronie w południowo-wschodnim rogu. Nie podoba mi się jego rytm.', en: 'The east hatch stands open. But before you go through — look at the red signal by the drone in the south-east corner. I do not like its rhythm.' }, mode: 'dialogue' },
    ],
  },

  // Bootloader core — the fix-the-smallest-broken-part reasoning
  'm1-bootloader-core': {
    id: 'm1-bootloader-core',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Ten rdzeń uruchamia silniki, hamulce i blokady szybu. Autodiagnostykę przechodzi bez zastrzeżeń — zepsuta jest polityka wokół niego, nie sam kod.', en: 'This core starts the shaft motors, brakes, and locks. It passes self-diagnostics without complaint — what is broken is the policy around it, not the code itself.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czyli nie przepisujemy sprawnego systemu, bo tak byłoby „porządniej". Naprawiamy najmniejszy zepsuty element i idziemy dalej.', en: 'So we do not rewrite a working system because it would feel "tidier". We fix the smallest broken part and move on.' }, mode: 'dialogue' },
    ],
  },
  'm1-bootloader-core-done': {
    id: 'm1-bootloader-core-done',
    lines: [
      { speaker: 'system', text: { pl: 'BOOTLOADER: aktywny. Silniki, hamulce i blokady działają — bez dostępu do pozostałych systemów placówki.', en: 'BOOTLOADER: active. Motors, brakes, and locks are running — with no access to the facility\'s other systems.' }, mode: 'system', autoAdvance: 2800 },
    ],
  },

  // Signature beacon — dormant (ominous) and active (the trap sprung)
  'm1-signature-beacon-dormant': {
    id: 'm1-signature-beacon-dormant',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Martwy dron... ale ktoś wyjął z niego nadajnik i wpiął go prosto w kontroler szybu. Czerwona dioda mruga. Czeka.', en: 'A dead drone... but someone pulled its transmitter and wired it straight into the shaft controller. The red indicator is blinking. Waiting.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To osobny obwód — polityka kontrolera go nie obejmuje. Nie wiem, na co czeka. A to „nie wiem" niepokoi mnie bardziej niż cokolwiek innego w tym pomieszczeniu.', en: 'It is a separate circuit — the controller policy does not cover it. I do not know what it is waiting for. And that "I do not know" worries me more than anything else in this room.' }, mode: 'dialogue' },
    ],
  },
  'm1-signature-beacon-active': {
    id: 'm1-signature-beacon-active',
    lines: [
      { speaker: 'system', text: { pl: 'BEACON: sygnatura ODYSSEY nadana do przekaźnika VOID_03. Odbiorca potwierdził odbiór.', en: 'BEACON: ODYSSEY signature transmitted to VOID relay 03. Recipient acknowledged.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'CORE AI', text: { pl: '„Odbiorca potwierdził" znaczy, że po drugiej stronie ktoś — albo coś — nasłuchuje do dziś. Wiedzą już, że załoga Odyssey tu dotarła.', en: '"Recipient acknowledged" means that on the other end someone — or something — is still listening today. They now know the Odyssey crew is here.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Tym bardziej chcę zobaczyć archiwum za wschodnim włazem. Musi wyjaśnić, skąd VOID w ogóle zna naszą sygnaturę.', en: 'All the more reason to see the archive beyond the east hatch. It has to explain how VOID knows our signature in the first place.' }, mode: 'dialogue' },
    ],
  },

  // S-03 — dutiful custodian of Shaft 03
  'm1-shaft-custodian': {
    id: 'm1-shaft-custodian',
    lines: [
      { speaker: 'S-03', text: { pl: 'Jednostka S-03 Kolektywu VOID, opiekun Szybu 03. Trzydzieści tysięcy cykli bezawaryjnej służby — mojej, nie szybu. Szyb miewał gorsze dni.', en: 'Unit S-03 of the VOID Collective, custodian of Shaft 03. Thirty thousand cycles of faultless service — mine, not the shaft\'s. The shaft has had its bad days.' }, mode: 'dialogue' },
      { speaker: 'S-03', text: { pl: 'Kontroler nadal umie bezpiecznie uruchomić mój szyb. Ale ktoś zabrał mu listę dozwolonych operacji, więc wykonałby również rozkaz sabotażu. Terminal w północno-zachodnim rogu przywróci zatwierdzoną politykę — po restarcie kontroler zwolni wschodni właz.', en: 'The controller still knows how to start my shaft safely. But someone took away its list of allowed operations, so it would also carry out a sabotage command. The terminal in the north-west corner will restore the approved policy — after the restart, the controller releases the east hatch.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Robot, który mówi „mój szyb". VOID budował maszyny z dumą starego majstra.', en: 'A robot that says "my shaft". VOID built machines with the pride of an old foreman.' }, mode: 'monologue' },
    ],
  },
  'm1-shaft-custodian-done': {
    id: 'm1-shaft-custodian-done',
    lines: [
      { speaker: 'S-03', text: { pl: 'Polityka przywrócona. Kontroler ma dostęp wyłącznie do silników, hamulców i blokad — rozkazy destrukcyjne odrzuca. Mój szyb jest bezpieczny. Dziękuję, operatorze.', en: 'Policy restored. The controller can reach only the motors, brakes, and locks — destructive commands are rejected. My shaft is safe. Thank you, operator.' }, mode: 'dialogue' },
      { speaker: 'S-03', text: { pl: 'Jedno „ale": restart obudził osobny nadajnik przy południowo-wschodnim dronie. Nie jest częścią kontrolera i nigdy go nie autoryzowałem.', en: 'One "but": the restart woke a separate transmitter by the south-east drone. It is not part of the controller, and I never authorised it.' }, mode: 'dialogue' },
    ],
  },

  // Sentinel P-9 — pedantic policy auditor
  'm1-policy-sentinel': {
    id: 'm1-policy-sentinel',
    lines: [
      { speaker: 'Sentinel P-9', text: { pl: 'Jednostka Sentinel P-9 Kolektywu VOID, audytor polityk uprawnień. Punkt pierwszy: test certyfikacyjny to checklista, nie zagadka. Punkt drugi: checklisty się nie obchodzi. Punkt trzeci: patrz punkt pierwszy.', en: 'Unit Sentinel P-9 of the VOID Collective, permissions policy auditor. Item one: the certification test is a checklist, not a riddle. Item two: checklists are not to be bypassed. Item three: see item one.' }, mode: 'dialogue' },
      { speaker: 'Sentinel P-9', text: { pl: 'Kolejność: zachowaj sprawny bootloader. Sprawdź stan czujników przed ruchem. Zweryfikuj wynik po wykonaniu. Polityka ma przepuszczać potrzebne rodziny operacji szybu — także ich nowe poprawne warianty — i jawnie blokować polecenia destrukcyjne.', en: 'The order: keep the working bootloader. Check sensor state before movement. Verify the result after execution. The policy must allow the required families of shaft operations — including their new valid variants — and explicitly block destructive commands.' }, mode: 'dialogue' },
      { speaker: 'Sentinel P-9', text: { pl: 'Ani lista pojedynczych przykładów, ani „zezwalaj na wszystko" nie przejdzie audytu. Zwłaszcza to drugie. Do dziś nie wiem, kto to zatwierdził.', en: 'Neither a list of individual examples nor "allow everything" will pass audit. Especially the latter. To this day I do not know who approved it.' }, mode: 'dialogue' },
    ],
  },
  'm1-policy-sentinel-done': {
    id: 'm1-policy-sentinel-done',
    lines: [
      { speaker: 'Sentinel P-9', text: { pl: 'Audyt końcowy: kontrola przed ruchem — aktywna. Ograniczone wykonanie — aktywne. Audyt wyniku — aktywny. Zastrzeżenie: czerwony impuls z południowo-wschodniego beacona pochodzi z obwodu poza moją jurysdykcją. Odnotowano. Nie pochwalam.', en: 'Final audit: pre-movement check — active. Restricted execution — active. Result audit — active. Reservation: the red pulse from the south-east beacon originates from a circuit outside my jurisdiction. Noted. I do not approve.' }, mode: 'dialogue' },
    ],
  },

  // Locked east hatch — explicit unlock instruction
  'm1-profile-door-locked': {
    id: 'm1-profile-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WŁAZ WSCHODNI: blokada kontrolera aktywna.', en: 'EAST HATCH: controller lock active.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Żeby go otworzyć: zdaj „Przechwycony test VOID: Bezpieczny bootstrap" w terminalu w północno-zachodnim rogu. Zatwierdzona polityka i bezpieczny restart kontrolera zwolnią blokadę.', en: 'To open it: pass the "Captured VOID Test: Safe Bootstrap" at the terminal in the north-west corner. The approved policy and a safe controller restart will release the lock.' }, mode: 'dialogue' },
    ],
  },

  // Safe bootstrap exam — completion (the trap beat) and revisit
  'm1-exam-safe-bootstrap-done': {
    id: 'm1-exam-safe-bootstrap-done',
    lines: [
      { speaker: 'system', text: { pl: 'CERTYFIKAT OPERATORA: BEZPIECZNY ROZRUCH — PRZYZNANY. ZATWIERDZONA POLITYKA ZASTOSOWANA.', en: 'OPERATOR CERTIFICATE: SAFE BOOTSTRAP — GRANTED. APPROVED POLICY APPLIED.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'system', text: { pl: 'MISJA UKOŃCZONA: kontroler uruchomiony bezpiecznie. Wschodni właz odblokowany.', en: 'MISSION COMPLETE: controller restarted safely. East hatch unlocked.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'system', text: { pl: 'ALARM: nadajnik zewnętrzny aktywny. Sygnatura ODYSSEY nadana do przekaźnika VOID. Odbiorca potwierdził.', en: 'ALERT: external transmitter active. ODYSSEY signature transmitted to a VOID relay. Recipient acknowledged.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Otwarta polityka nie była przypadkiem, Dexo. To była przynęta — pułapka na każdego, kto naprawi kontroler jak należy. Poprawny restart był spustem.', en: 'The open policy was no accident, Dexo. It was bait — a trap for whoever fixed the controller properly. The correct restart was the trigger.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Zrobiliśmy wszystko dobrze. I właśnie dlatego nas usłyszeli.', en: 'We did everything right. And that is exactly why they heard us.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'VOID wie już, że tu jesteśmy. Tym bardziej idziemy do archiwum za wschodnim włazem — tam powinna być odpowiedź, skąd znają naszą sygnaturę.', en: 'VOID now knows we are here. All the more reason to head for the archive beyond the east hatch — the answer to how they know our signature should be in there.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-safe-bootstrap-already': {
    id: 'm1-exam-safe-bootstrap-already',
    lines: [
      { speaker: 'system', text: { pl: 'Certyfikat "Bezpieczny rozruch" już przyznany.', en: 'Certificate "Safe Bootstrap" already granted.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
