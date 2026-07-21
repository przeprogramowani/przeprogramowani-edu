import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m3-true-fault',
    completionType: 'text-answer',
    title: { pl: 'Prawdziwa Usterka', en: 'The Real Fault' },
    briefing: {
      pl: 'Dziennik I-5KRA to setki samodzielnie zgłoszonych usterek — łazik raportuje wszystko, na wszelki wypadek. Tylko jedna z nich ma potwierdzenie na kadłubie. Obejrzyj wraki i jednostkę, skoreluj zgłoszenia ze śladami fizycznymi i podaj przez /solve identyfikator jedynej prawdziwej usterki.',
      en: 'I-5KRA\'s journal is hundreds of self-reported faults — the rover flags everything, just in case. Only one of them is confirmed on the hull. Inspect the wrecks and the unit, correlate the reports with the physical traces, and enter the single real fault\'s identifier via /solve.',
    },
    inputPayload: [
      'DZIENNIK USTEREK I-5KRA — ZRZUT (fragment)',
      "[8812] USTERKA: 'PYL-31'  — czujnik pyłu: brak śladu fizycznego",
      "[8813] USTERKA: 'TERM-09' — przegrzanie rdzenia: kadłub bez śladów",
      "[8814] USTERKA: 'NAP-77'  — napęd lewy: okopcenie na kadłubie — POTWIERDZONE OGLĘDZINAMI",
      "[8815] USTERKA: 'ANT-02'  — antena: brak potwierdzenia",
      'FORMAT ODPOWIEDZI: <identyfikator usterki>',
    ].join('\n'),
    hints: [
      { pl: 'Ślad musi być fizyczny — okopcenie, wygięcie, pęknięcie na kadłubie. Reszta to hipochondria łazika.', en: 'The trace must be physical — scorching, a bend, a crack on the hull. The rest is the rover\'s hypochondria.' },
      { pl: 'Obejrzyj wraki: każda tabliczka przeczy jednemu wpisowi z dziennika. Zostaje jeden.', en: 'Inspect the wrecks: each plate contradicts one journal entry. One is left standing.' },
      { pl: 'Tylko NAP-77 ma dopisek POTWIERDZONE OGLĘDZINAMI. Podaj małymi literami: /solve nap-77', en: 'Only NAP-77 carries CONFIRMED BY INSPECTION. Enter it lowercase: /solve nap-77' },
    ],
    solution: 'nap-77',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M3_ISKRA_ONLINE, FLAGS.CMDS_ISKRA] },
  },
];
