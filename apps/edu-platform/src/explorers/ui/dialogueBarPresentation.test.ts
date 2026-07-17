import { describe, expect, it } from 'vitest';
import { getDialogueBarPresentation } from './dialogueBarPresentation';

describe('getDialogueBarPresentation', () => {
  it('shows the space hint for system lines', () => {
    const presentation = getDialogueBarPresentation({
      speaker: 'system',
      mode: 'system',
      autoAdvance: 2500,
    });

    expect(presentation.hintVisible).toBe(true);
    expect(presentation.hintText).toContain('Spacja');
  });

  it('keeps cinematic auto-advance lines hintless', () => {
    const presentation = getDialogueBarPresentation({
      speaker: 'system',
      mode: 'cinematic',
      autoAdvance: 2500,
    });

    expect(presentation.hintVisible).toBe(false);
  });

  it('resets monologue speaker styling to the regular speaker color', () => {
    const presentation = getDialogueBarPresentation({
      speaker: 'astronaut',
      mode: 'monologue',
    });

    expect(presentation.speakerVisible).toBe(true);
    expect(presentation.speakerColor).toBe('#00d4aa');
    expect(presentation.bodyFontStyle).toBe('italic');
  });
});
