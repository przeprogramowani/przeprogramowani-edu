import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — cathedral scale change; the heat-cycle yard in a crystal garden
  'm3-annealing-intro': {
    id: 'm3-annealing-intro',
    lines: [
      { speaker: 'system', text: { pl: 'WYŻARZALNIA — plac cykli cieplnych. Ogród kryształów. Kominy: zimne.', en: 'ANNEALING YARD — heat-cycle floor. A crystal garden. Chimneys: cold.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Stanowiska wygrzewu w rzędach jak winnica. Rudę znaleźliśmy, przetopiliśmy — tu sprawdzimy, czy można za nią poręczyć.', en: 'Annealing stations in rows like a vineyard. We found the ore, we smelted it — here we find out if we can vouch for it.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Zmierz, poddaj próbie, poręcz. Tak wygląda uczciwa diagnoza. Zasil moduł probierczy, certyfikuj chłodzenie, przeprowadź partię przez wygrzew.', en: 'Measure, test, vouch. That is the shape of an honest diagnosis. Power the assay rig, certify the cooling, run the batch through the anneal.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Badanie czystości poprowadzę z orbity. Parametry tej serii znam na pamięć. Podam je, gdy dojdziesz do modułu.', en: 'I will run the purity assay from orbit. I know this series\' parameters by heart. I will give them to you when you reach the rig.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_ANNEALING_INTRO_SEEN] },
  },

  // Assay rig — quest hub, staged through the certificate
  'm3-assay-rig-start': {
    id: 'm3-assay-rig-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ PROBIERCZY: rozruch. Pierwszy kontrolowany ogień księżyca.', en: 'ASSAY RIG: booting. The moon\'s first controlled fire.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Zapalam palniki. Pierwszy ogień w służbie na tym księżycu — prawdziwy żar, który naprawdę coś robi. Po tylu kłamiących kontrolkach.', en: 'I light the burners. The first fire in service on this moon — real heat that actually does something. After all those lying indicator lights.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Moduł zasilony. Najpierw certyfikuj pętlę chłodzenia przy stacji „Regresja". Bez uczciwego chłodzenia nie ma uczciwego badania.', en: 'Rig powered. First certify the cooling loop at the Regression station. Without honest cooling there is no honest assay.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Pierwszy Certyfikat — zasilenie, chłodzenie, wygrzew.', en: '◆ NEW MISSION: The First Certificate — power, cooling, anneal.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_CERT_ACTIVE, FLAGS.M3_ASSAY_RIG_POWERED], activateQuest: 'q-m3-first-cert' },
  },
  'm3-assay-rig-briefing': {
    id: 'm3-assay-rig-briefing',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Moduł gorący. Na stacji „Regresja" znajdź pierwszą wersję sterownika, która psuje chłodzenie. Zacznij od środka podejrzanego zakresu i zawężaj go po każdym sprawdzeniu.', en: 'The rig is hot. At the Regression station, find the first controller version that breaks cooling. Start in the middle of the suspect range and narrow it after each check.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I jedno: niespójny odczyt zawsze sprawdź ponownie, zanim mu uwierzysz.', en: 'And one thing: always re-check an inconsistent reading before you believe it.' }, mode: 'dialogue' },
    ],
  },
  'm3-assay-rig-run-batch': {
    id: 'm3-assay-rig-run-batch',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Pętla certyfikowana uczciwie. Teraz poprowadź partię przez rząd wygrzewu — wygrzew, potem badanie. Wynik odbierzemy tutaj.', en: 'The loop is honestly certified. Now run the batch through the anneal row — anneal, then assay. We collect the result back here.' }, mode: 'dialogue' },
    ],
  },
  'm3-assay-rig-collect': {
    id: 'm3-assay-rig-collect',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ PROBIERCZY: partia wygrzana. Badanie: w toku.', en: 'ASSAY RIG: batch annealed. Assay: in progress.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Partia przeszła wygrzew. Moduł liczy czystość. Zaraz zobaczymy, czy jest za co ręczyć.', en: 'The batch is through the anneal. The rig is scoring purity. We\'ll see soon whether there is anything to vouch for.' }, mode: 'dialogue' },
    ],
  },
  'm3-assay-rig-post': {
    id: 'm3-assay-rig-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ PROBIERCZY: certyfikat wystawiony. Status: WYMAGA PORĘCZENIA.', en: 'ASSAY RIG: certificate issued. Status: REQUIRES VOUCHING.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Maszyna zbadała. Ale certyfikat mówi „WYMAGA PORĘCZENIA": maszyna bada, człowiek ręczy. Pieczęć czeka na ciebie w izbie probierczej.', en: 'The machine has tested. But the certificate reads "REQUIRES VOUCHING": the machine tests, the human vouches. The stamp waits for you in the assay office.' }, mode: 'dialogue' },
    ],
  },

  // Fault Trace arcade — first clear certifies the cooling loop
  'm3-fault-trace-cleared': {
    id: 'm3-fault-trace-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'REGRESJA: pierwsza wadliwa wersja zlokalizowana. Pętla chłodzenia: certyfikowana.', en: 'REGRESSION: first faulty version located. Cooling loop: certified.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Znalazłeś wersję, która wprowadziła usterkę — nie jedną z późniejszych, gdzie awaria już trwa. Wróć do modułu i poprowadź partię.', en: 'You found the version that introduced the fault — not a later one where the failure already runs. Return to the rig and run the batch.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_COOLING_CERTIFIED] },
  },

  // Anneal row — gated batch run
  'm3-anneal-row-cold': {
    id: 'm3-anneal-row-cold',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rząd wygrzewu, zimny. Nie puszczę partii nad niecertyfikowaną pętlą chłodzenia — dokładnie tak zginęły maszyny na tym księżycu. Najpierw „Regresja".', en: 'The anneal row, cold. I will not run a batch over an uncertified cooling loop — that is exactly how the machines on this moon died. Regression first.' }, mode: 'monologue' },
    ],
  },
  'm3-anneal-row-run': {
    id: 'm3-anneal-row-run',
    lines: [
      { speaker: 'system', text: { pl: 'RZĄD WYGRZEWU: cykl cieplny uruchomiony. Partia w ruchu.', en: 'ANNEAL ROW: heat cycle running. Batch in motion.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Partia idzie przez wygrzew jak przez winnicę — stanowisko po stanowisku. Chłodzenie trzyma. Teraz badanie przy module.', en: 'The batch moves through the anneal like through a vineyard — station by station. The cooling holds. Now the assay at the rig.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_BATCH_ANNEALED] },
  },

  // Ridge antenna — the dead-dish-relay sting
  'm3-ridge-antenna': {
    id: 'm3-ridge-antenna',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Antena na grzbiecie — martwa czasza, dawny łącznik stacji z Pasem. Ale jej dziennik nie jest pusty.', en: 'The ridge antenna — a dead dish, the station\'s old link to the Belt. But its log is not empty.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Jedna transmisja po śmierci stacji. Kierunek: Ziemia. Ktoś zadzwonił do domu przez trupa — i zostawił czaszę tak, jak ją znalazł.', en: 'One transmission after the station died. Direction: Earth. Someone phoned home through the corpse — and left the dish exactly as they found it.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisuję, bez interpretacji. Martwy sprzęt jako przekaźnik znaczy jedno: ktoś tu był.', en: 'I am logging it, without interpretation. Dead hardware as a relay means one thing: someone was here.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_DEAD_DISH_RELAY_SEEN] },
  },
  'm3-ridge-antenna-seen': {
    id: 'm3-ridge-antenna-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ta sama martwa czasza. Ten sam ślad rozmowy z domem. Wciąż nie wiem kto — ale wiem, że ktoś był tu przed nami.', en: 'The same dead dish. The same trace of a call home. I still don\'t know who — but I know someone was here before us.' }, mode: 'monologue' },
    ],
  },

  // Ore veins — factory scale behind the yard
  'm3-ore-veins': {
    id: 'm3-ore-veins',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Żyły Synaptitu w ścianach kominów — cała fabryczna skala. Na Księżycu 1 tropiłem jedną. Tu stoję w ich lesie i ręczę za to, co z nich wyjdzie.', en: 'Synaptit veins in the chimney walls — factory scale, all of it. On Moon 1 I tracked one. Here I stand in a forest of them and vouch for what comes out.' }, mode: 'dialogue' },
    ],
  },

  // Iskra companion
  'm3-iskra-yard': {
    id: 'm3-iskra-yard',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Dziennik: kominy 2 i 4 — mikropęknięcia. Chłodziwo w normie. Palnik 3 — drga, obserwuję. Wszystko zgłoszone, na wszelki wypadek. Tak bezpieczniej, Dexo.', en: 'Log: chimneys 2 and 4 — micro-cracks. Coolant nominal. Burner 3 — jittering, watching it. All reported, just in case. Safer this way, Dexo.' }, mode: 'dialogue' },
    ],
  },
  'm3-iskra-yard-post': {
    id: 'm3-iskra-yard-post',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Certyfikat wystawiony, zapisany. I jeszcze jeden wpis, cichy: parametry dr Kern zgadzały się z zapieczętowaną ekspertyzą złóż. Co do miejsca po przecinku. Zgłaszam. Na wszelki wypadek.', en: 'Certificate issued, logged. And one more quiet entry: Dr Kern\'s parameters matched the sealed deposit survey. To the decimal place. Reporting it. Just in case.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the price of quality + the Kern-decimals cut
  'q-m3-first-cert-complete': {
    id: 'q-m3-first-cert-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ PIERWSZY CERTYFIKAT WYSTAWIONY. Status: WYMAGA PORĘCZENIA.', en: '◆ FIRST CERTIFICATE ISSUED. Status: REQUIRES VOUCHING.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Badanie zakończone. I pierwsza widoczna cena jakości: trzy sztaby z Księżyca 2 nie przeszły. Wracają do huty.', en: 'The assay is complete. And the first visible price of quality: three ingots from Moon 2 failed. They go back to the smelter.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Trzy sztaby z powrotem do huty. Piecze. I właśnie dlatego wiem, że test robi swoje.', en: 'Three ingots back to the smelter. It stings. And that is exactly how I know the test is doing its job.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Partia 03: 480 kilogramów. Czystość: 99,4 procent. Pierwsza dostawa, za którą ktoś poręczy imiennie. Izba Probiercza czeka na podpis.', en: 'Batch 03: 480 kilograms. Purity: 99.4 percent. The first delivery someone will vouch for by name. The Assay Office awaits the signature.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Wpis do dziennika, na wszelki wypadek: dr Kern podała parametry, zanim moduł wyświetlił specyfikację. Zgadzają się z zapieczętowaną przedstartową ekspertyzą złóż. Co do miejsca po przecinku.', en: 'Log entry, just in case: Dr Kern gave the parameters before the rig displayed the spec. They match the sealed pre-launch deposit survey. To the decimal place.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Moreau tym razem nie pyta na otwartym kanale. Widzę tylko, jak coś zapisuje w notesie.', en: 'Moreau does not ask on the open channel this time. I only see her write something in her notebook.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_KERN_DECIMALS_NOTED] },
  },

  // Exam XIV
  'm3-exam-protocol-14-done': {
    id: 'm3-exam-protocol-14-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XIV — „SAMONAPRAWA": zaliczony.', en: 'PROTOCOL XIV — "SELF-REPAIR": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Czternasty protokół odzyskany: maszynie wolno powtórzyć znane lekarstwo na znaną chorobę — ale każda samonaprawa zostawia bliznę w dzienniku, bo blizny czyta człowiek. Trzecie identyczne podejście to nie leczenie, to pętla.', en: 'Fourteenth protocol recovered: a machine may repeat a known cure for a known ailment — but each self-repair leaves a scar in the log, because humans read scars. A third identical attempt is not treatment, it is a loop.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-14-already': {
    id: 'm3-exam-protocol-14-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XIV już zaliczony.', en: 'Protocol XIV already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked assay door — needs the first certificate
  'm3-assay-door-locked': {
    id: 'm3-assay-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'ŚLUZA IZBY PROBIERCZEJ: zamknięta. Brak certyfikowanego ładunku.', en: 'ASSAY OFFICE AIRLOCK: sealed. No certified cargo.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Skarbiec wpuszcza tylko certyfikowany ładunek. Najpierw badanie, potem wejście — poręczenie czeka w środku.', en: 'The vault admits only certified cargo. First the assay, then entry — the vouching waits inside.' }, mode: 'dialogue' },
    ],
  },

  // Return path — self-repair routines work the yard
  'm3-return-annealing': {
    id: 'm3-return-annealing',
    lines: [
      { speaker: 'system', text: { pl: 'WYŻARZALNIA — POWRÓT', en: 'THE ANNEALING YARD — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Małe ramiona serwisowe pracują między rzędami. Rutyny samonaprawy robią to, co uczciwa diagnoza wreszcie nazwała.', en: 'Small service arms work between the rows. Self-repair routines do what an honest diagnosis finally named.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Naprawę widać na własne oczy, a każde ramię zostawia po sobie bliznę w dzienniku. Chcesz posłuchać, co jeszcze słyszę pod kominami? Użyj /diag.', en: 'You watch the repair happen with your own eyes, and every arm leaves a scar in the log. Want to hear what else I pick up under the chimneys? Use /diag.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_ANNEALING_SEEN] },
  },
};
