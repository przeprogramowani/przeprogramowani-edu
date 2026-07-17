import type { DialogueLine, DialogueMode } from '../systems/DialogueTypes';
import { t } from '../i18n';

type HintPolicy = 'always' | 'manualOnly' | 'never';

interface DialogueModePresentation {
  bodyColor: string;
  bodyFontStyle: string;
  hintPolicy: HintPolicy;
  speakerColor: string;
  speakerVisible: boolean;
  speakerText: (speaker: string) => string;
}

export interface DialogueBarPresentation {
  bodyColor: string;
  bodyFontStyle: string;
  hintText: string;
  hintVisible: boolean;
  speakerColor: string;
  speakerText: string;
  speakerVisible: boolean;
}

const MODE_PRESENTATIONS: Record<DialogueMode, DialogueModePresentation> = {
  dialogue: {
    speakerVisible: true,
    speakerColor: '#00d4aa',
    speakerText: getSpeakerDisplay,
    bodyColor: '#ffffff',
    bodyFontStyle: '',
    hintPolicy: 'always',
  },
  monologue: {
    speakerVisible: true,
    speakerColor: '#00d4aa',
    speakerText: getSpeakerDisplay,
    bodyColor: '#aaaaaa',
    bodyFontStyle: 'italic',
    hintPolicy: 'always',
  },
  system: {
    speakerVisible: true,
    speakerColor: '#ffb347',
    speakerText: () => t('scene.speakerSystem'),
    bodyColor: '#ffb347',
    bodyFontStyle: '',
    hintPolicy: 'always',
  },
  cinematic: {
    speakerVisible: false,
    speakerColor: '#00d4aa',
    speakerText: getSpeakerDisplay,
    bodyColor: '#ffffff',
    bodyFontStyle: '',
    hintPolicy: 'manualOnly',
  },
};

export function getDialogueBarPresentation(line: Pick<DialogueLine, 'speaker' | 'mode' | 'autoAdvance'>): DialogueBarPresentation {
  const modePresentation = MODE_PRESENTATIONS[line.mode];

  return {
    speakerVisible: modePresentation.speakerVisible,
    speakerText: modePresentation.speakerText(line.speaker),
    speakerColor: modePresentation.speakerColor,
    bodyColor: modePresentation.bodyColor,
    bodyFontStyle: modePresentation.bodyFontStyle,
    hintVisible: shouldShowHint(modePresentation.hintPolicy, line.autoAdvance),
    hintText: t('scene.dialogueAdvanceHint'),
  };
}

function shouldShowHint(hintPolicy: HintPolicy, autoAdvance: number | undefined): boolean {
  switch (hintPolicy) {
    case 'always':
      return true;
    case 'manualOnly':
      return autoAdvance === undefined;
    case 'never':
      return false;
  }
}

function getSpeakerDisplay(speaker: string): string {
  switch (speaker) {
    case 'astronaut':
      return t('scene.speakerAstronaut');
    case 'system':
      return t('scene.speakerSystem');
    default:
      return speaker.toUpperCase();
  }
}
