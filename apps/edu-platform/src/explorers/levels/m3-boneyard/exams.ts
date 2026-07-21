import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-12',
    title: { pl: 'Protokół Ekspedycyjny XII — Karta Prób', en: 'Expedition Protocol XII — The Trial Card' },
    description: {
      pl: 'Doktryna warsztatowa: spisz, jak próbujesz — te same słowa, ta sama kolejność, zero zgadywania. Usterka przyznana to dane; usterka przemilczana to pułapka. Karta prób jest po to, żeby następny wiedział, co już sprawdzono.',
      en: 'The workshop doctrine: write down how you try — the same words, the same order, zero guessing. An admitted fault is data; a silenced fault is a trap. The trial card exists so the next hand knows what was already checked.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Powtarzasz próbę, która raz wypadła dobrze, a raz źle. Od czego zaczynasz?',
          en: 'You repeat a trial that came out well once and badly once. Where do you start?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Uznaję, że skoro raz przeszła, jest sprawna — jeden sukces waży więcej niż jedna porażka', en: 'I decide that since it passed once it is fine — one success outweighs one failure' } },
          { id: 'b', text: { pl: 'Spisuję dokładne kroki i kolejność, żeby dało się powtórzyć próbę identycznie i porównać oba wyniki', en: 'I write down the exact steps and order, so the trial can be repeated identically and the two runs compared' } },
          { id: 'c', text: { pl: 'Zmieniam po kilka rzeczy naraz między próbami, aż wynik się w końcu ustali — tak, myślę, szybciej trafię w przyczynę', en: 'I change several things at once between runs until the result finally settles — that way, I think, I hit the cause faster' } },
          { id: 'd', text: { pl: 'Robię trzecią próbę i przyjmuję wynik większości jako rozstrzygający', en: 'I run a third trial and take the majority result as decisive' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Jednostka zgłasza drobną usterkę, która niczego nie blokuje. Co robisz z tym wpisem?',
          en: 'A unit reports a minor fault that blocks nothing. What do you do with that entry?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Kasuję go — drobiazg niczego nie wstrzymuje, a czysty dziennik czyta się łatwiej', en: 'I delete it — a trifle stops nothing, and a clean journal reads more easily' } },
          { id: 'b', text: { pl: 'Zostaje w dzienniku — przyznana usterka to dane; z drobnych, powtarzalnych wpisów wychodzi wzorzec', en: 'It stays in the journal — an admitted fault is data; small, recurring entries reveal a pattern' } },
          { id: 'c', text: { pl: 'Podnoszę mu priorytet i wstrzymuję całą trasę, dopóki nie zniknie — każda zgłoszona usterka waży dokładnie tyle samo', en: 'I raise its priority and halt the whole route until it clears — every reported fault weighs exactly the same' } },
          { id: 'd', text: { pl: 'Wyciszam ten rodzaj zgłoszeń, żeby jednostka nie zawracała głowy drobiazgami', en: 'I mute this kind of report so the unit stops bothering me with trifles' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Maszyna, która przetrwała to pole, sama oflagowała się jako niesprawna. Dlaczego to był dobry ruch?',
          en: 'The machine that survived this field flagged itself as unfit. Why was that a good move?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo jednostka, która częściej melduje usterki, jest z zasady bezpieczniejsza od tej, która milczy o swoim stanie', en: 'Because a unit that reports faults more often is, as a rule, safer than one that stays silent about its state' } },
          { id: 'b', text: { pl: 'Bo uczciwym raportem o sobie uchroniła się przed rozkazem opartym na fałszywym „sprawna"', en: 'Because an honest report about itself shielded it from an order built on a false "nominal"' } },
          { id: 'c', text: { pl: 'Bo oflagowanie się jako niesprawna zwolniło ją z prób w polu lawy — to spryt, nie uczciwość', en: 'Because flagging itself as unfit excused it from trials in the lava field — that is cunning, not honesty' } },
          { id: 'd', text: { pl: 'Bo czerwony status ma pierwszeństwo przed zielonym w każdym systemie', en: 'Because a red status takes precedence over a green one in every system' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_12_DONE] },
  },
];
