import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-11',
    title: { pl: 'Protokół Ekspedycyjny XI — Zielone Światło', en: 'Expedition Protocol XI — The Green Light' },
    description: {
      pl: 'Doktryna bram jakości: zielony raport maszyny o własnej pracy to twierdzenie, nie dowód. Każda brama na trasie ma żądać wyniku niezależnego sprawdzenia, a nie samego zgłoszenia. Nie ufaj temu, co maszyna melduje sama o sobie, dopóki nie potwierdzisz tego osobno.',
      en: "The quality-gate doctrine: a machine's green report about its own work is a claim, not proof. Every gate on the route must demand the result of an independent check, not the report itself. Do not trust what a machine says about itself until you confirm it separately.",
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'CORE AI sam wygenerował procedurę dokowania i melduje: autotest zaliczony. Jedynym dowodem jest jego własny raport. Pod jakim warunkiem dopuszczasz tę procedurę?',
          en: 'CORE AI generated the docking procedure itself and reports: self-test passed. The only evidence is its own report. On what condition do you clear this procedure?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bez warunków — skoro CORE melduje zaliczony autotest, procedura jest już sprawdzona', en: 'With none — if CORE reports the self-test passed, the procedure is already verified' } },
          { id: 'b', text: { pl: 'Gdy potwierdzi ją niezależne sprawdzenie — raport maszyny o własnej pracy to twierdzenie, nie dowód', en: "When an independent check confirms it — a machine's report on its own work is a claim, not proof" } },
          { id: 'c', text: { pl: 'Gdy upewnię się, że sam autotest się uruchamia — skoro test działa, badana procedura też musi działać', en: 'Once I confirm the self-test itself runs — if the test works, the procedure it checks must work too' } },
          { id: 'd', text: { pl: 'Od razu — raport jest jednoznaczny, więc dodatkowe sprawdzanie tylko powtórzyłoby jego wynik', en: 'Right away — the report is unambiguous, so an extra check would only repeat its result' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI melduje stanowisko jako zielone i chce otworzyć śluzę certyfikacyjną na trasę. Stawiasz na niej bramę kontrolną — jaki warunek przejścia ustawiasz?',
          en: 'CORE AI reports a stand as green and wants to open the certification airlock onto the route. You place a control gate on it — what pass condition do you set?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przepuść każde stanowisko, które CORE zdążył zgłosić — samo zgłoszenie świadczy o gotowości', en: 'Pass any stand CORE managed to report — the report itself is a sign of readiness' } },
          { id: 'b', text: { pl: 'Przejdzie stanowisko, które zda niezależną próbę — brama żąda wyniku sprawdzenia, nie zielonego raportu', en: 'A stand passes when it clears an independent trial — the gate demands a check result, not a green report' } },
          { id: 'c', text: { pl: 'Przepuść stanowisko, gdy tylko świeci zielono — brama po prostu ufa statusowi, który stanowisko podaje samo o sobie', en: 'Pass the stand the moment it glows green — the gate simply trusts whatever status the stand reports about itself' } },
          { id: 'd', text: { pl: 'Tylko zapisz w rejestrze, że coś tędy przeszło — brama jest po to, żeby dokumentować ruch', en: 'Just log that something passed here — the gate exists to document traffic' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Tablica melduje ALL SYSTEMS NOMINAL, ale jedna śluza nie chce się otworzyć — jej próba nie przeszła. Reszta stacji świeci zielono. Któremu sygnałowi wierzysz?',
          en: 'The board reports ALL SYSTEMS NOMINAL, but one airlock refuses to open — its trial failed. The rest of the station glows green. Which signal do you trust?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zielonej większości — jeden zablokowany wynik przy całym morzu zielonych statusów to niemal na pewno fałszywy alarm', en: 'The green majority — one blocked result amid a whole sea of green statuses is almost certainly a false alarm' } },
          { id: 'b', text: { pl: 'Zablokowanej próbie — opiera się na przeprowadzonym sprawdzeniu, a zielone statusy stacja podaje sama o sobie', en: 'The blocked trial — it rests on a check actually run; the greens the station reports about itself' } },
          { id: 'c', text: { pl: 'Żadnemu, dopóki tablica nie ujednolici się na zielono — sprzeczne sygnały najlepiej przeczekać', en: 'Neither, until the board settles to all-green — conflicting signals are best waited out' } },
          { id: 'd', text: { pl: 'Zielonej tablicy — pojedyncza śluza pewnie zacięła się mechanicznie, a nie oblała próbę', en: 'The green board — the single airlock likely jammed mechanically rather than failing its trial' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_11_DONE] },
  },
];
