import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-4',
    title: { pl: 'Protokół Ekspedycyjny IV — Dziennik zewnętrzny', en: 'Expedition Protocol IV — External Journal' },
    description: {
      pl: 'Doktryna pamięci ekspedycji: dziennik obozowy jest pamięcią zewnętrzną misji. Zapisz ustalenia, albo zabierze je kolejna hibernacja.',
      en: 'The expedition memory doctrine: the camp journal is the mission\'s external memory. Record your findings, or the next hibernation takes them.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Po długiej zmianie w wąwozie masz w głowie mnóstwo ustaleń o geologii i anomaliach. Zbliża się hibernacja — następna zmiana ruszy z zerową pamięcią tego, co tu ustaliłeś. Co jest zgodne z doktryną dziennika zewnętrznego?',
          en: 'After a long shift in the ravine you hold a mass of findings about geology and anomalies in your head. Hibernation is coming — the next shift starts with zero memory of what you worked out here. What follows the external-journal doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zaufać własnej pamięci — po przebudzeniu najważniejsze ustalenia i tak same do ciebie wrócą', en: 'Trust your own memory — the key findings will come back to you on their own after you wake anyway' } },
          { id: 'b', text: { pl: 'Zapisać ustalenia w dzienniku obozowym tak, by zrozumiał je ktoś, kto ich nie przeżył', en: 'Record the findings in the camp journal so someone who did not live through them can understand' } },
          { id: 'c', text: { pl: 'Zostawić ustalenia w otwartej konsoli i przekazać je ustnie następnej zmianie', en: 'Leave the findings in the open console and pass them to the next shift by word of mouth' } },
          { id: 'd', text: { pl: 'Zapisać tylko własne skróty — w chwili pisania i tak wszystko jest oczywiste', en: 'Write down only your own shorthand — at the moment of writing it is all obvious anyway' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Które wpisy najlepiej działają jako zewnętrzna pamięć ekspedycji dla kolejnej zmiany?',
          en: 'Which entries work best as external mission memory for the next shift?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Same wnioski i decyzje, bez faktów i powodów, które za nimi stały', en: 'Only conclusions and decisions, without the facts and reasons behind them' } },
          { id: 'b', text: { pl: 'Konkretne fakty, decyzje i ich powody — tak, by następna osoba mogła działać bez ciebie', en: 'Concrete facts, decisions, and their reasons — so the next person can act without you' } },
          { id: 'c', text: { pl: 'Wszystko, co się wydarzyło, po kolei i w całości, bez wyróżniania, co jest ważne', en: 'Everything that happened, in full and in order, without marking what matters' } },
          { id: 'd', text: { pl: 'Bieżący stan zapisany raz i pozostawiony bez zmian, nawet gdy ustalenia się zdezaktualizują', en: 'The current state written once and left unchanged, even as the findings go stale' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'W komorze, która powinna być zapieczętowana, znajdujesz świeże ślady po pobraniu próbek. Nie wiesz, kto ani po co. Co robisz z tą obserwacją?',
          en: 'In a chamber that should be sealed, you find fresh sampling marks. You do not know who or why. What do you do with the observation?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pominąć ją — bez wyjaśnienia i tak nic z nią nie zrobisz', en: 'Skip it — without an explanation you cannot do anything with it anyway' } },
          { id: 'b', text: { pl: 'Zapisać ją jako anomalię, z samymi faktami, nawet jeśli nie umiesz jej jeszcze wytłumaczyć', en: 'Record it as an anomaly, with just the facts, even if you cannot explain it yet' } },
          { id: 'c', text: { pl: 'Dopisać własną teorię jako fakt, żeby wpis był kompletny i domknięty', en: 'Add your own theory as fact, so the entry is complete and closed' } },
          { id: 'd', text: { pl: 'Zapisać ją dopiero, gdy uda się ją wytłumaczyć — niepewne obserwacje tylko zaśmiecają dziennik', en: 'Record it only once you can explain it — uncertain observations just clutter the journal' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_4_DONE] },
  },
];
