// HUD chrome strings (top bar, drawer, mute/locale buttons).
// Phase 3: `en` values mirror `pl` values as placeholders. Phase 4 ships
// reviewed translations.

export const hudStrings = {
  pl: {
    'hud.homeButton': 'Powrót do platformy',
    'hud.muteOn': 'Włącz dźwięk',
    'hud.muteOff': 'Wycisz',
    'hud.localeTitlePl': 'Język: Polski',
    'hud.localeTitleEn': 'Language: English',
    'hud.localeSwitchToEn': 'Zmień język na angielski',
    'hud.localeSwitchToPl': 'Switch language to Polish',
    'hud.menu': 'Menu',
    'hud.terminal': 'Terminal',
    'hud.signupCta': 'Logowanie',
    'hud.signupDrawerCta': 'Zaloguj się, aby zapisać postęp',
  },
  en: {
    'hud.homeButton': 'Back to Platform',
    'hud.muteOn': 'Enable Sound',
    'hud.muteOff': 'Mute',
    'hud.localeTitlePl': 'Language: Polish',
    'hud.localeTitleEn': 'Language: English',
    'hud.localeSwitchToEn': 'Switch language to English',
    'hud.localeSwitchToPl': 'Switch language to Polish',
    'hud.menu': 'Menu',
    'hud.terminal': 'Terminal',
    'hud.signupCta': 'Log In',
    'hud.signupDrawerCta': 'Log in to save your progress',
  },
} as const;
