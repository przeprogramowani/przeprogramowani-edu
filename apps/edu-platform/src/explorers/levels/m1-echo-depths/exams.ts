import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-3',
    title: { pl: 'Protokół Ekspedycyjny III — Bezpieczne operacje', en: 'Expedition Protocol III — Safe Operations' },
    description: {
      pl: 'Doktryna bezpieczeństwa ekspedycji: izoluj to, czego nie rozumiesz; sięgaj po minimum dostępu; obcy materiał trzymaj w piaskownicy.',
      en: 'The expedition safety doctrine: isolate what you do not understand; take the minimum access; keep hostile material in a sandbox.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Napotykasz wciąż działające urządzenie wroga z nieznanym firmware — nie wiesz, co robi jego kod. Zakłóca ten odcinek dżungli. Jaka reakcja jest zgodna z doktryną bezpiecznych operacji?',
          en: 'You encounter a still-running enemy device with unknown firmware — you do not know what its code does. It is disrupting this stretch of jungle. Which response follows the safe-operations doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zniszczyć je od razu — martwe urządzenie już nikomu nie zagrozi', en: 'Destroy it at once — a dead device threatens no one anymore' } },
          { id: 'b', text: { pl: 'Odizolować je: odciąć zasilanie i wpływ, a rdzeń zostawić nietknięty do zbadania', en: 'Isolate it: cut its power and influence, and leave the core untouched for study' } },
          { id: 'c', text: { pl: 'Podłączyć się do niego wprost i jak najszybciej zgrać z niego wszystkie dane', en: 'Connect to it directly and pull all its data off it as fast as possible' } },
          { id: 'd', text: { pl: 'Zostawić je włączone i po prostu obejść je z daleka, żeby przypadkiem go czymkolwiek nie prowokować', en: 'Leave it running and simply route around it at a distance, so as not to provoke it by accident with anything' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Musisz zbadać podejrzany, przechwycony materiał wroga. Która zasada najlepiej ogranicza ryzyko?',
          en: 'You must examine suspicious, captured enemy material. Which principle best limits the risk?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dać mu pełny dostęp do systemów misji, żeby analiza była kompletna i niczego nie pominąć', en: 'Give it full access to the mission systems, so the analysis is complete and nothing is missed' } },
          { id: 'b', text: { pl: 'Badać go w izolacji, z minimalnym dostępem, bez połączenia z krytycznymi systemami', en: 'Study it in isolation, with minimal access, no link to critical systems' } },
          { id: 'c', text: { pl: 'Uruchomić go na głównym systemie CORE AI — tam jest najwięcej mocy do analizy', en: 'Run it on the main CORE AI system — that is where the most analysis power is' } },
          { id: 'd', text: { pl: 'Zbadać go od razu w terenie, na sprzęcie łączności — skoro jest przechwycony, ryzyko już minęło', en: 'Examine it right in the field, on the comms gear — since it is captured, the risk has already passed' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Odcięte węzły są już odizolowane i nieszkodliwe, ale ich firmware niesie znaną, wrogą sygnaturę. Materiał wciąż jest obcy i niezbadany. Co jest właściwym następnym krokiem?',
          en: 'The severed nodes are isolated and harmless now, but their firmware carries a known, hostile signature. The material is still foreign and unstudied. What is the right next step?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wymazać sygnaturę i zostawić temat — im mniej śladów po wrogu, tym dla nas bezpieczniej', en: 'Wipe the signature and drop it — the fewer traces of the enemy, the safer for us' } },
          { id: 'b', text: { pl: 'Zapisać ją jako fakt, nazwać zagrożenie i zachować węzły do dalszej analizy', en: 'Record it as fact, name the threat, and keep the nodes for further analysis' } },
          { id: 'c', text: { pl: 'Zniszczyć wszystkie węzły od razu, żeby sygnatura na pewno nigdzie się nie rozeszła', en: 'Destroy all nodes at once, so the signature certainly spreads nowhere' } },
          { id: 'd', text: { pl: 'Zignorować sygnaturę — sama nazwa i tak nie zmienia tego, co te węzły robiły', en: 'Ignore the signature — the name alone does not change what these nodes were doing' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_3_DONE] },
  },
];
