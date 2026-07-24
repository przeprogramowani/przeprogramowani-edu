import { FLAGS } from '../../config/flags';
import type { TextAnswerQuest } from '../../systems/QuestManager';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m3-true-fault',
    completionType: 'text-answer',
    title: { pl: 'Prawdziwa Usterka', en: 'The Real Fault' },
    briefing: {
      pl: 'Dziennik usterek floty to setki samodzielnie zgłoszonych usterek — łaziki raportują wszystko, na wszelki wypadek. Obejrzyj wraki, skoreluj zgłoszenia ze śladami fizycznymi i podaj przez /solve identyfikator jedynej prawdziwej usterki.',
      en: 'Journal is hundreds of self-reported faults — rovers flags everything, just in case. Only one of them is confirmed on the hull. Inspect the wrecks and the unit, correlate the reports with the physical traces, and enter the single real fault\'s identifier via /solve.',
    },
    inputPayload: [
      'DZIENNIK USTEREK FLOTY',
      "[8812] 'pyl-31'  — czujnik pyłu - wymagany serwis",
      "[8813] 'term-09' — przegrzanie - wymagany serwis",
      "[8814] 'nap-77'  — napęd lewy - wymagany serwis",
      "[8815] 'ant-02'  — antena - wymagany serwis",
    ].join('\n'),
    hints: [
      { pl: 'Ślad musi być fizyczny — okopcenie, wygięcie, pęknięcie na kadłubie. Reszta to hipochondria.', en: 'The trace must be physical — scorching, a bend, a crack on the hull. The rest is the rover\'s hypochondria.' },
      { pl: 'Obejrzyj wraki: obserwacje to realny opis stanu floty łazików.', en: 'Inspect the wrecks: each plate contradicts one journal entry. One is left standing.' },
      { pl: 'Wskaż prawdziwą usterkę poprzez selekcję negatywną - tylko jedna zostaje w grze po oględzinach.', en: 'Identify the real fault by elimination — only one remains in the game.' },
    ],
    solution: 'nap-77',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M3_ISKRA_ONLINE] },
  },
];
