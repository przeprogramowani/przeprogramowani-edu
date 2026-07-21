/**
 * Slownik strony skilla /10x-archive (ArchiveSkillBody) - krok 06 CSC.
 * Tresc wydestylowana z konceptu archiwizacji obecnego w repo (context/archive/,
 * context/foundation/lessons.md) oraz z zachowania opisanego przy /10x-implement
 * (etap czysto reczny bez commita -> ostrzezenie informacyjne). Szczegoly warto
 * potwierdzic wzgledem kanonicznego ~/.claude/skills/10x-archive/SKILL.md.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html renderuja
 * sie przez set:html. Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillArchiveDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    inFolder: string;
    inStatus: string;
    gate: string;
    gateSub: string;
    outLessons: string;
    outArchive: string;
    note: string;
  };
  mapCap: string;
  routeAria: string;
  route: [string, string, string, string, string];
  poco: {
    num: string;
    uniSuffix: string;
    h2: string;
    epigraph: string;
    epigraphCite: string;
    p1Html: string;
    p2Html: string;
    targetK: string;
    targetHtml: string;
  };
  io: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row];
  };
  check: {
    num: string;
    h2: string;
    rows: [Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  lessons: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row];
  };
  granice: {
    num: string;
    h2: string;
    rows: [Row, Row, Row, Row];
    chainK: string;
    chainLink: string;
    chainRest: string;
  };
}

export const SKILL_ARCHIVE: Record<Lang, SkillArchiveDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 06 ŁAŃCUCHA',
    h1Html: '/10x-archive - <span class="glow">domknięcie zmiany</span>',
    subSf: 'Fundacja przetrwała upadek, bo zawczasu zapisała wiedzę - ten skill robi to samo ze skończoną zmianą.',
    subNeutral: 'Ten skill domyka skończoną zmianę: potwierdza, że jest kompletna, i przenosi ją do archiwum.',
    subRestHtml:
      '<strong>/10x-archive</strong> sprawdza kompletność jednostki pracy, dopisuje lekcje do <strong>context/foundation/lessons.md</strong> i przenosi folder z <strong>context/changes/</strong> do <strong>context/archive/</strong>. Dzięki temu <em>changes/</em> pokazuje tylko pracę w toku, a wiedza z zamkniętej zmiany zostaje w projekcie.',
    svgAria:
      'Schemat działania /10x-archive: ukończony folder zmiany przechodzi przez kontrolę kompletności (każdy etap ma commit), a na wyjściu lekcje trafiają do foundation/lessons.md, a folder do context/archive/',
    svg: {
      inFolder: 'CONTEXT/CHANGES/<ID>',
      inStatus: 'PLAN: PROGRESS ZIELONY',
      gate: 'KONTROLA: KOMPLETNOŚĆ',
      gateSub: 'KAŻDY ETAP: COMMIT (SHA)',
      outLessons: 'FOUNDATION/LESSONS.MD',
      outArchive: 'CONTEXT/ARCHIVE/<ID>',
      note: 'CHANGES/: TYLKO PRACA W TOKU',
    },
    mapCap: '/10X-ARCHIVE // ZE SKOŃCZONEJ ZMIANY DO LEKCJI I ARCHIWUM',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Kontrola kompletności', 'Lekcje', 'Granice'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Encyklopedia',
      h2: 'Problem: „skończone" bez zapisu',
      epigraph: '„Zapisane przetrwa upadek; reszta zostaje legendą."',
      epigraphCite: '- zasada Encyklopedii Galaktycznej, Fundacja',
      p1Html:
        'Zmiana „zmergowana i zapomniana" zostawia dwa długi: <code>changes/</code> puchnie od starej pracy, przez co nie widać, co jest w toku, a wiedza z tej roboty - pułapki, decyzje - ulatuje razem z oknem rozmowy. <em>/10x-archive</em> spłaca oba: <strong>domyka jednostkę pracy</strong> zapisem, nie z pamięci.',
      p2Html:
        'To ostatni krok łańcucha - świadomie po review i merge. Nie dotyka kodu; operuje na już skończonej zmianie, żeby zostawić po niej trwały ślad w kontekście projektu.',
      targetK: 'CEL:',
      targetHtml:
        'uruchamiany <b>po review i merge</b> - zamyka pętlę CSC: to, czego nauczyła Cię zmiana, ląduje w foundation, a jej folder trafia do archiwum.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Ze skończonej zmiany do trwałego zapisu',
      p1Html:
        'Wejście to <strong>ukończona zmiana</strong> - folder <code>context/changes/&lt;change-id&gt;/</code> z <code>plan.md</code>, odhaczoną sekcją Progress i commitami etapów. Skill zakłada, że praca jest zrobiona; jego zadaniem jest to potwierdzić i domknąć, nie dokończyć implementację.',
      p2Html:
        'Wyjście jest podwójne: <strong>lekcje</strong> dopisane do wspólnego <code>context/foundation/lessons.md</code> oraz <strong>folder zmiany</strong> przeniesiony w całości do <code>context/archive/</code> - z zachowaną historią (change, research, plan, reviews).',
      rows: [
        { dt: 'Wejście', ddHtml: 'ukończona zmiana w <b>context/changes/&lt;change-id&gt;/</b> (plan z odhaczonym Progress)' },
        { dt: 'Wyjście', ddHtml: 'lekcje w <b>context/foundation/lessons.md</b> + folder w <b>context/archive/</b>' },
        { dt: 'Efekt', ddHtml: '<b>changes/</b> pokazuje wyłącznie pracę w toku' },
      ],
    },
    check: {
      num: 'KONTROLA KOMPLETNOŚCI',
      h2: '„Domknięte" ma znaczyć skończone',
      rows: [
        {
          dt: 'Commity per etap',
          ddHtml:
            'każdy etap w Progress powinien mieć commit (skrócony SHA) - to dowód, że etap realnie się zamknął, a nie został po cichu pominięty.',
        },
        {
          dt: 'Etap ręczny',
          ddHtml:
            'etap czysto ręczny nie tworzy commita i zostaje bez SHA - to <b>ostrzeżenie informacyjne</b>, nie błąd, ale jawnie odnotowane.',
        },
        {
          dt: 'Spójność stanu',
          ddHtml:
            'skill porównuje deklaracje w Progress z zawartością folderu, zanim cokolwiek przeniesie do archiwum.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'archiwizacja nie „naprawia" luk - <b>ujawnia je</b>. Ostrzeżenie zostaje w zapisie, żeby domknięcie było uczciwe, a nie kosmetyczne.',
    },
    lessons: {
      num: 'LEKCJE',
      h2: 'Wiedza zostaje w projekcie',
      p1Html:
        'Najcenniejszy produkt uboczny zmiany to nie kod, lecz to, <strong>czego się przy niej nauczyłeś</strong>: powtarzalna pułapka, nieoczywista decyzja, wzorzec wart powtórzenia. Bez zapisu ta wiedza umiera z sesją.',
      p2Html:
        '<em>/10x-archive</em> odkłada lekcje do <code>context/foundation/lessons.md</code>, wspólnego dla całego projektu. Kolejne zmiany - i kolejne uruchomienia <code>/10x-research</code> i <code>/10x-plan</code> - startują z tej wiedzy, zamiast wynajdywać ją od nowa.',
      rows: [
        { dt: 'Co trafia', ddHtml: 'powtarzalne pułapki, decyzje warte zapamiętania, wzorce z tej zmiany' },
        { dt: 'Gdzie', ddHtml: '<b>context/foundation/lessons.md</b> - trwały kontekst projektu' },
        { dt: 'Po co', ddHtml: 'następne zmiany nie powtarzają tych samych błędów' },
      ],
    },
    granice: {
      num: 'GRANICE',
      h2: 'Czego /10x-archive nie robi',
      rows: [
        { dt: 'Nie zmienia kodu', ddHtml: 'operuje na już zamkniętej zmianie - nie dopisuje ani nie poprawia implementacji.' },
        { dt: 'Nie zastępuje review', ddHtml: 'ocena jakości należy do /10x-impl-review; archive potwierdza kompletność, nie poprawność.' },
        { dt: 'Nie czyta z archiwum', ddHtml: 'archiwum to zapis historyczny - nic nie sięga do niego rutynowo, ale wszystko tam jest.' },
        { dt: 'Nie wymusza', ddHtml: 'brakujący commit etapu to ostrzeżenie, nie twardy błąd blokujący domknięcie.' },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 06 (archive) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 06',
    h1Html: '/10x-archive - <span class="glow">closing out the change</span>',
    subSf: 'The Foundation survived the fall because it wrote knowledge down in time - this skill does the same with a finished change.',
    subNeutral: 'This skill closes out a finished change: it confirms it is complete and moves it to the archive.',
    subRestHtml:
      '<strong>/10x-archive</strong> checks the completeness of the unit of work, appends lessons to <strong>context/foundation/lessons.md</strong> and moves the folder from <strong>context/changes/</strong> to <strong>context/archive/</strong>. That way <em>changes/</em> shows only work in progress, and the knowledge from a closed change stays in the project.',
    svgAria:
      'How /10x-archive works: a finished change folder passes a completeness check (every phase has a commit), and on the output the lessons go to foundation/lessons.md and the folder to context/archive/',
    svg: {
      inFolder: 'CONTEXT/CHANGES/<ID>',
      inStatus: 'PLAN: PROGRESS GREEN',
      gate: 'CHECK: COMPLETENESS',
      gateSub: 'EVERY PHASE: COMMIT (SHA)',
      outLessons: 'FOUNDATION/LESSONS.MD',
      outArchive: 'CONTEXT/ARCHIVE/<ID>',
      note: 'CHANGES/: WORK IN PROGRESS ONLY',
    },
    mapCap: '/10X-ARCHIVE // FROM A FINISHED CHANGE TO LESSONS AND THE ARCHIVE',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Completeness check', 'Lessons', 'Boundaries'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · The Encyclopedia',
      h2: 'The problem: "done" with no record',
      epigraph: '"What is written survives the fall; the rest becomes legend."',
      epigraphCite: '- a principle of the Encyclopedia Galactica, Foundation',
      p1Html:
        'A change that is "merged and forgotten" leaves two debts: <code>changes/</code> swells with old work so you can no longer see what is in progress, and the knowledge from that work - the pitfalls, the decisions - evaporates with the conversation window. <em>/10x-archive</em> pays both off: it <strong>closes out the unit of work</strong> on the record, not from memory.',
      p2Html:
        'It is the last step of the chain - deliberately after review and merge. It does not touch code; it operates on an already-finished change to leave a durable trace of it in the project context.',
      targetK: 'GOAL:',
      targetHtml:
        'run <b>after review and merge</b> - it closes the CSC loop: what the change taught you lands in foundation, and its folder moves to the archive.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'From a finished change to a durable record',
      p1Html:
        'The input is a <strong>finished change</strong> - the <code>context/changes/&lt;change-id&gt;/</code> folder with <code>plan.md</code>, a checked-off Progress section and phase commits. The skill assumes the work is done; its job is to confirm and close it out, not to finish the implementation.',
      p2Html:
        'The output is twofold: <strong>lessons</strong> appended to the shared <code>context/foundation/lessons.md</code> and the <strong>change folder</strong> moved in full to <code>context/archive/</code> - with its history preserved (change, research, plan, reviews).',
      rows: [
        { dt: 'Input', ddHtml: 'a finished change in <b>context/changes/&lt;change-id&gt;/</b> (a plan with checked-off Progress)' },
        { dt: 'Output', ddHtml: 'lessons in <b>context/foundation/lessons.md</b> + the folder in <b>context/archive/</b>' },
        { dt: 'Effect', ddHtml: '<b>changes/</b> shows only work in progress' },
      ],
    },
    check: {
      num: 'COMPLETENESS CHECK',
      h2: '"Closed out" should mean done',
      rows: [
        {
          dt: 'Commits per phase',
          ddHtml:
            'every phase in Progress should have a commit (short SHA) - proof that the step really closed, rather than being quietly skipped.',
        },
        {
          dt: 'Manual phase',
          ddHtml:
            'a purely manual phase creates no commit and stays without a SHA - that is an <b>informational warning</b>, not an error, but it is recorded explicitly.',
        },
        {
          dt: 'State consistency',
          ddHtml:
            'the skill compares the claims in Progress with the folder contents before it moves anything to the archive.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'archiving does not "fix" gaps - it <b>surfaces them</b>. The warning stays on the record so the close-out is honest, not cosmetic.',
    },
    lessons: {
      num: 'LESSONS',
      h2: 'The knowledge stays in the project',
      p1Html:
        "A change's most valuable by-product is not the code but <strong>what you learned</strong> doing it: a recurring pitfall, a non-obvious decision, a pattern worth repeating. Without a record, that knowledge dies with the session.",
      p2Html:
        '<em>/10x-archive</em> files the lessons into <code>context/foundation/lessons.md</code>, shared across the whole project. The next changes - and the next runs of <code>/10x-research</code> and <code>/10x-plan</code> - start from that knowledge instead of rediscovering it.',
      rows: [
        { dt: 'What goes in', ddHtml: 'recurring pitfalls, decisions worth remembering, patterns from this change' },
        { dt: 'Where', ddHtml: '<b>context/foundation/lessons.md</b> - the durable project context' },
        { dt: 'Why', ddHtml: 'the next changes do not repeat the same mistakes' },
      ],
    },
    granice: {
      num: 'BOUNDARIES',
      h2: 'What /10x-archive does not do',
      rows: [
        { dt: 'Does not change code', ddHtml: 'it operates on an already-closed change - it neither adds nor fixes implementation.' },
        { dt: 'Does not replace review', ddHtml: 'judging quality belongs to /10x-impl-review; archive confirms completeness, not correctness.' },
        { dt: 'Does not read the archive', ddHtml: 'the archive is a historical record - nothing reaches into it routinely, but it is all there.' },
        { dt: 'Does not enforce', ddHtml: 'a missing phase commit is a warning, not a hard error that blocks the close-out.' },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 06 (archive) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
