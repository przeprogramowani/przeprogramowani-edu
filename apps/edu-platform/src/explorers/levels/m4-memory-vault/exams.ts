import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm4-exam-protocol-20',
    title: { pl: 'Protokół Ekspedycyjny XX — Kronika', en: 'Expedition Protocol XX — The Chronicle' },
    description: {
      pl: 'Doktryna kroniki: znaczenie systemu odzyskuje się z tego, jak on naprawdę działa, a nie z tego, jak miał działać. Zanim zaczniesz modelować dziedzinę, nazwij ją tak, jak mówi o niej biznes — bo kod, który nie zgadza się z językiem biznesu, będzie się mylił w każdej decyzji zbudowanej na tym języku.',
      en: 'The chronicle doctrine: the meaning of a system is recovered from how it actually works, not from how it was meant to work. Before you model the domain, name it the way the business speaks of it — because code that disagrees with the business language will be wrong in every decision built on that language.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Spisując wpis zerowy nowego indeksu, Dexo znajduje ten sam rekord pamięci nazwany w archiwum na cztery sposoby: „szkic", „propozycja", „karta", „kandydat". CORE AI proponuje modelowanie agregatów i repozytoriów od ręki. Jaki jest najtańszy pierwszy ruch DDD, który trafia w sedno?',
          en: 'Writing entry zero of the new index, Dexo finds the same memory record named four ways across the archive: "draft", "proposal", "card", "candidate". CORE AI proposes modeling aggregates and repositories right away. What is the cheapest first DDD move that hits the core problem?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zbudować agregaty i repozytoria dla każdej z czterech nazw — dopiero warstwa taktyczna porządkuje model', en: 'Build aggregates and repositories for each of the four names — only the tactical layer brings order to the model' } },
          { id: 'b', text: { pl: 'Wybrać najczęściej występującą nazwę i przemianować pozostałe trzy na nią w całym kodzie', en: 'Pick the most frequent name and rename the other three to it across the codebase' } },
          { id: 'c', text: { pl: 'Ustalić język wszechobecny: sprawdzić, czy cztery nazwy to jedno pojęcie, czy różne konteksty, i nadać każdemu jedną nazwę', en: 'Establish the ubiquitous language: check whether the four names are one concept or different contexts, and give each one name' } },
          { id: 'd', text: { pl: 'Zignorować rozbieżność — dopóki kod się kompiluje, nazwy pól nie wpływają na zachowanie', en: 'Ignore the mismatch — as long as the code compiles, field names do not affect behavior' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Reguła, na której stoi znaczenie archiwum — „blok pamięci ma zawsze dokładnie jeden wpis w indeksie" — nie jest wymuszona nigdzie; pilnował jej tylko dawny interfejs. Jak sprawić, by niezmiennik naprawdę obowiązywał?',
          en: 'The rule the archive\'s meaning stands on — "a memory block always has exactly one index entry" — is enforced nowhere; only the old interface guarded it. How do you make the invariant actually hold?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zamknąć niezmiennik w jednym agregacie, który go strzeże i rzuca nazwany błąd domenowy przy nielegalnej operacji', en: 'Enclose the invariant in a single aggregate that guards it and throws a named domain error on an illegal operation' } },
          { id: 'b', text: { pl: 'Dodać walidację formularza w każdym miejscu, które tworzy blok pamięci', en: 'Add form validation at every place that creates a memory block' } },
          { id: 'c', text: { pl: 'Zostawić kontrolę interfejsowi — skoro pilnował jej dotąd, wystarczy odtworzyć dawny ekran', en: 'Leave the check to the interface — since it guarded the rule so far, just recreate the old screen' } },
          { id: 'd', text: { pl: 'Dopisać komplet testów wokół reguły — im więcej przypadków, tym pewniej reguła jest utrzymana', en: 'Write a full set of tests around the rule — the more cases, the more surely the rule is upheld' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Kronika Banku Pamięci ma być zaczątkiem nowej pamięci, spisanym po fakcie. Egzemplarz startowy dokumentacji różni się od tego, jak stacja naprawdę działała przez lata. Co wpisujesz do kroniki?',
          en: 'The Memory Vault chronicle is meant to be the seed of a new memory, written after the fact. The launch copy of the documentation differs from how the station actually worked for years. What do you enter into the chronicle?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pierwotny zamysł z dokumentu startowego — to on definiuje, jak system miał działać', en: 'The original intent from the launch document — it defines how the system was meant to work' } },
          { id: 'b', text: { pl: 'Stan zastany: jak system naprawdę się zachowuje dziś, odczytany z terenu — to jest zaczątek pamięci', en: 'The state as found: how the system actually behaves today, read from the terrain — that is the seed of memory' } },
          { id: 'c', text: { pl: 'Nic — kod jest jedynym źródłem prawdy, a osobna kronika i tak się zdezaktualizuje', en: 'Nothing — the code is the only source of truth, and a separate chronicle will go stale anyway' } },
          { id: 'd', text: { pl: 'Wyłącznie to, co zepsute — kronika ma prowadzić do napraw, reszta jest szumem', en: 'Only what is broken — the chronicle should lead to fixes, the rest is noise' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M4_EXAM_PROTOCOL_20_DONE] },
  },
];
