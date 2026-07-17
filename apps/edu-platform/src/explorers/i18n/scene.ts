// GameScene strings: interaction prompts, end-screen, dialogue bar hint.

export const sceneStrings = {
  pl: {
    'scene.interactionDefault': '[E] Interakcja',
    'scene.interactionLook': '[E] Zobacz',
    'scene.interactionDoor': '[E] Przejdź',
    'scene.interactionExam': '[E] Egzamin',
    'scene.interactionArcade': '[E] Zadanie',
    'scene.interactionNpc': '[E] Rozmawiaj',
    'scene.dialogueAdvanceHint': '[Spacja] dalej  ▸',
    'scene.speakerAstronaut': 'ASTRONAUTA',
    'scene.speakerSystem': 'SYSTEM',

    // End-screen panel
    'scene.endTitle': 'DEMO UKOŃCZONE',
    'scene.endLine1': 'Stan twojego Astronauty',
    'scene.endLine2': 'został zapisany.',
    'scene.endLine3': 'Gdy etap Prework się odblokuje,',
    'scene.endLine4': 'podróż będzie kontynuowana.',
    'scene.endLine5': 'Dołącz do 10xDevs 3.0,',
    'scene.endLine6': 'aby odblokować pełną misję',
    'scene.endLine7': '— 5 księżyców czeka.',
    'scene.endScheduleHeader': 'Prework: 15 kwi 2026',
    'scene.endScheduleLine': 'Księżyc 1: 18 maj 2026',
    'scene.endCta': 'Dowiedz się więcej →',
  },
  en: {
    'scene.interactionDefault': '[E] Interact',
    'scene.interactionLook': '[E] Examine',
    'scene.interactionDoor': '[E] Enter',
    'scene.interactionExam': '[E] Exam',
    'scene.interactionArcade': '[E] Mission',
    'scene.interactionNpc': '[E] Talk',
    'scene.dialogueAdvanceHint': '[Space] next  ▸',
    'scene.speakerAstronaut': 'ASTRONAUT',
    'scene.speakerSystem': 'SYSTEM',

    // End-screen panel
    'scene.endTitle': 'DEMO COMPLETE',
    'scene.endLine1': 'Your Astronaut\'s state',
    'scene.endLine2': 'has been saved.',
    'scene.endLine3': 'When the Prework stage unlocks,',
    'scene.endLine4': 'the journey will continue.',
    'scene.endLine5': 'Join 10xDevs 3.0,',
    'scene.endLine6': 'to unlock the full mission',
    'scene.endLine7': '— 5 moons await.',
    'scene.endScheduleHeader': 'Prework: Apr 15, 2026',
    'scene.endScheduleLine': 'Moon 1: May 18, 2026',
    'scene.endCta': 'Learn more →',
  },
} as const;
