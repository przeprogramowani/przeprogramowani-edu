import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-1',
    title: { pl: 'Protokół Ekspedycyjny I — Najpierw pytania', en: 'Expedition Protocol I — Questions First' },
    description: {
      pl: 'Doktryna otwarcia każdej ekspedycji: zanim maszyna zacznie budować, kontrakt musi być spisany. Protokół sprawdza, czy wiesz, jak z mętnego pomysłu powstaje PRD.',
      en: 'The opening doctrine of every expedition: before the machine starts building, the contract must be written down. This protocol checks whether you know how a vague idea becomes a PRD.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Moreau naszkicowała na tablicy pomysł na obozowy system zarządzania zapasami. Przy konsoli kusi cię skrót: zrobić zdjęcie tablicy, wysłać je do CORE AI i poczekać na wynik. Który sposób pracy z maszyną da lepszy efekt?',
          en: 'Moreau sketched an idea for the camp\'s supply-management system on a board. At the console the shortcut tempts you: snap a photo of the board, send it to CORE AI, and wait for the result. Which way of working with the machine gives the better outcome?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Napisać z góry jak najdłuższy opis ze wszystkimi znanymi szczegółami, żeby model nie musiał o nic dopytywać', en: 'Write the longest possible description upfront with every detail you already know, so the model does not have to ask about anything' } },
          { id: 'b', text: { pl: 'Przeprowadzić z maszyną sesję pogłębiających pytań i odpowiedzi, aż wydobędzie wasze rzeczywiste potrzeby, i dopiero wtedy pozwolić jej dostarczyć wynik', en: 'Run a session of deepening questions and answers with the machine until it surfaces your real needs, and only then let it deliver the result' } },
          { id: 'c', text: { pl: 'Wziąć pierwszy wynik od razu, a potem doszlifować go serią kolejnych promptów, aż będzie kompletny', en: 'Take the first result right away, then polish it with a series of follow-up prompts until it is complete' } },
          { id: 'd', text: { pl: 'Pozwolić modelowi samodzielnie uzupełnić brakujące szczegóły i tylko oznaczyć, które z nich są jego założeniami', en: 'Let the model fill in the missing details on its own and merely flag which of them are its assumptions' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Wiesz, że po sesji planistycznej z Moreau kilka decyzji zostało nierozstrzygniętych. Zanim CORE AI ułoży wasze ustalenia w gotowy plan, jak przygotowujesz maszynę na te luki?',
          en: 'You know that after the planning session with Moreau a few decisions were left unresolved. Before CORE AI arranges your findings into a finished plan, how do you prepare the machine for those gaps?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Z góry polecasz jej zbierać nierozstrzygnięte decyzje w sekcji „Pytania otwarte”, zamiast je zgadywać', en: 'You instruct it upfront to collect unresolved decisions into an "Open Questions" section instead of guessing them' } },
          { id: 'b', text: { pl: 'Polecasz jej uzupełnić każdą lukę najsensowniejszym domysłem, żeby dokument był od razu kompletny i gotowy do dalszej pracy', en: 'You instruct it to fill every gap with its most sensible guess, so the document is complete and ready for further work right away' } },
          { id: 'c', text: { pl: 'Polecasz jej przerwać pisanie na pierwszej luce i uruchomić od początku nową sesję planistyczną', en: 'You instruct it to stop writing at the first gap and start a fresh planning session from scratch' } },
          { id: 'd', text: { pl: 'Polecasz jej pominąć wszystko, co nierozstrzygnięte, żeby w dokumencie zostały wyłącznie potwierdzone decyzje', en: 'You instruct it to skip everything unresolved, so only confirmed decisions remain in the document' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Moreau przegląda z tobą wstępny plan projektu obozowiska przygotowany z CORE AI. Pyta: co właściwie należy do zakresu takiego wczesnego planowania, a co celowo zostaje poza nim?',
          en: 'Moreau reviews with you the initial plan for the camp project drafted with CORE AI. She asks: what actually belongs in the scope of such early planning, and what is deliberately left out of it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Twardość i cena stopu aluminium, z którego powstaną elementy konstrukcji — bez tych parametrów planu nie da się zamknąć', en: 'The hardness and price of the aluminum alloy the structural parts will be made of — without those parameters the plan cannot be finalized' } },
          { id: 'b', text: { pl: 'Nastroje i humor mieszkańców obozu danego dnia — plan powinien je odwzorować, żeby był realistyczny', en: 'The moods and humor of the camp residents on a given day — the plan should capture them to stay realistic' } },
          { id: 'c', text: { pl: 'Potrzeby załogi, koszty i czas — plan opisuje produkt i jego ramy, a szczegóły wykonawcze zostają na później', en: 'The crew\'s needs, costs and time — the plan describes the product and its frame, while implementation details are left for later' } },
          { id: 'd', text: { pl: 'Etap planowania można połączyć z budową — im wcześniej maszyna zacznie stawiać konstrukcję, tym mniej dokumentów trzeba pisać', en: 'The planning stage can be merged with construction — the sooner the machine starts putting up the structure, the fewer documents you have to write' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_1_DONE] },
  },
];
