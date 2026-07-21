// NavigationScene strings: ship navigation deck panel and flight cinematic.

export const navigationStrings = {
  pl: {
    'nav.title': 'NAWIGACJA POKŁADOWA',
    'nav.subtitle': 'Wybierz cel podróży',
    'nav.statusAvailable': 'GOTOWY DO STARTU',
    'nav.statusLocked': 'BRAK ZEZWOLENIA NA START',
    'nav.statusNoSignal': 'BRAK SYGNAŁU',
    'nav.close': 'Zamknij [ESC]',
    'nav.flightCourse': 'Kurs: {name}',
    'nav.flightEngaged': 'Napęd manewrowy aktywny...',
  },
  en: {
    'nav.title': 'SHIP NAVIGATION',
    'nav.subtitle': 'Select a destination',
    'nav.statusAvailable': 'READY TO LAUNCH',
    'nav.statusLocked': 'NO LAUNCH CLEARANCE',
    'nav.statusNoSignal': 'NO SIGNAL',
    'nav.close': 'Close [ESC]',
    'nav.flightCourse': 'Course: {name}',
    'nav.flightEngaged': 'Manoeuvring drive engaged...',
  },
} as const;
