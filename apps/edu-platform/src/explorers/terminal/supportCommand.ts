import type { TerminalLine } from './terminalTypes';
import { t } from '../i18n';

export interface SupportCommandResult {
  lines: TerminalLine[];
  copyableToken: string | null;
  tokenGenerated: boolean;
  activateEarthSignal: boolean;
  showReactionDialogue: boolean;
}

export async function fetchSupportToken(userEmail: string | undefined): Promise<SupportCommandResult> {
  if (!userEmail) {
    return {
      lines: [
        { kind: 'info', text: t('terminal.support.errorAuthHeader') },
        { kind: 'separator', text: '═════════════════════════════════' },
        { kind: 'blank' },
        { kind: 'info', text: t('terminal.support.noSession') },
        { kind: 'info', text: t('terminal.support.tokenRequiresLogin') },
        { kind: 'blank' },
        { kind: 'info', text: t('terminal.support.loginPrompt') },
        { kind: 'info', text: t('terminal.support.loginUrl') },
        { kind: 'blank' },
      ],
      copyableToken: null,
      tokenGenerated: false,
      activateEarthSignal: false,
      showReactionDialogue: false,
    };
  }

  const res = await fetch('/api/game/token');

  if (res.status === 401) {
    return {
      lines: [
        { kind: 'info', text: t('terminal.support.sessionExpired') },
        { kind: 'blank' },
      ],
      copyableToken: null,
      tokenGenerated: false,
      activateEarthSignal: false,
      showReactionDialogue: false,
    };
  }

  if (res.status === 403) {
    return {
      lines: [
        { kind: 'info', text: t('terminal.support.noPermission') },
        { kind: 'blank' },
      ],
      copyableToken: null,
      tokenGenerated: false,
      activateEarthSignal: false,
      showReactionDialogue: false,
    };
  }

  if (!res.ok) {
    return {
      lines: [
        { kind: 'info', text: t('terminal.support.connectError') },
        { kind: 'blank' },
      ],
      copyableToken: null,
      tokenGenerated: false,
      activateEarthSignal: false,
      showReactionDialogue: false,
    };
  }

  const { token, generated } = (await res.json()) as { token: string; generated: boolean };

  return {
    lines: [
      { kind: 'info', text: t('terminal.support.activeHeader') },
      { kind: 'separator', text: '═════════════════════════════════' },
      { kind: 'blank' },
      { kind: 'info', text: generated ? t('terminal.support.tokenGenerated') : t('terminal.support.tokenActive') },
      { kind: 'info', text: `    ${token}` },
      { kind: 'blank' },
      { kind: 'info', text: t('terminal.support.centerLabel') },
      { kind: 'info', text: t('terminal.support.centerUrl') },
      { kind: 'blank' },
    ],
    copyableToken: token,
    tokenGenerated: generated,
    activateEarthSignal: true,
    showReactionDialogue: generated,
  };
}
