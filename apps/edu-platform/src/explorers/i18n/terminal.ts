// Terminal command output and chrome.

export const terminalStrings = {
  pl: {
    // Header / boot
    'terminal.header': 'UPLINK TERMINAL',
    'terminal.bootHeaderUpgraded': 'UPLINK v3.0 — Kosmiczne Łącze Kwantowe',
    'terminal.bootHeader': 'UPLINK v2.1 — Kosmiczne Łącze Kwantowe',
    'terminal.bootSession': 'Sesja aktywna.',
    'terminal.hintArrow': '[↑↓] wybierz komendę',
    'terminal.hintEnter': '[Enter] zatwierdź',
    'terminal.hintEsc': '[Esc] zamknij',
    'terminal.inputPlaceholder': 'wpisz / aby zobaczyć komendy...',
    'terminal.tokenCopy': 'Kopiuj token',
    'terminal.tokenCopied': 'Skopiowano ✓',
    'terminal.tokenRegenerate': 'Regeneruj token',
    'terminal.tokenGenerating': 'Generowanie...',

    // Lock screen
    'terminal.lockGreeting': 'Witaj, Dexo!',
    'terminal.lockBlockedLine1': 'Blokada aktywna.',
    'terminal.lockBlockedLine2': 'Podaj kod odblokowujący:',
    'terminal.lockInvalidCode': 'Nieprawidłowy kod.',
    'terminal.lockMotto': '✨ Per Aspera Ad Astra ✨',

    // Command registry
    'terminal.cmd.me': 'Status Astronauty',
    'terminal.cmd.time': 'Chronometr pokładowy',
    'terminal.cmd.bookmarks': 'Zakładki i zasoby',
    'terminal.cmd.quest': 'Briefing misji',
    'terminal.cmd.solve': 'Odpowiedź na misję',
    'terminal.cmd.hint': 'Wskazówka do misji',
    'terminal.cmd.navi': 'Etapy podróży',
    'terminal.cmd.support': 'Łączność z HQ',
    'terminal.cmd.badges': 'Odznaka rangi',

    // /help and unknown
    'terminal.unknownCommand': 'Nieznana komenda. Wpisz /help, aby zobaczyć dostępne komendy.',
    'terminal.unknownCommandWithName': 'Nieznana komenda: /{cmd}. Wpisz /help, aby zobaczyć dostępne komendy.',
    'terminal.helpHeader': 'DOSTĘPNE KOMENDY',
    'terminal.helpHelpEntry': 'Pomoc w obsłudze',

    // /me
    'terminal.me.header': 'PROFIL ASTRONAUTY',
    'terminal.me.rankLabel': 'Ranga:',
    'terminal.me.tierLabel': 'Poziom:',
    'terminal.me.xpLabel': 'XP:',
    'terminal.me.xpMax': '{xp} XP (MAX)',
    'terminal.me.xpProgress': '{xp}/{max} XP',
    'terminal.me.upcomingHeader': 'Kolejne rangi:',
    'terminal.me.missing': 'brakuje {xp} XP',
    'terminal.me.unlocked': 'odblokowana',
    'terminal.me.maxRank': 'Osiągnięto najwyższą rangę!',

    // /time
    'terminal.time.header': 'CHRONOMETR POKŁADOWY',
    'terminal.time.dateLine': '    Data: 2126.{month}.{day}',
    'terminal.time.cycleLine': '    Cykl: {cycle}',
    'terminal.time.cycleDay': 'DZIENNY',
    'terminal.time.cycleNight': 'NOCNY',
    'terminal.time.zoneLine': '    Strefa: UTC+0 (pokładowy)',

    // /quest
    'terminal.quest.noActive': 'Brak aktywnej misji. Zbadaj statek.',
    'terminal.quest.noData': 'Misja {id} — brak danych.',
    'terminal.quest.titleLine': '◆ MISJA: {title}',
    'terminal.quest.supportHint': 'Komenda /support to ważny pierwszy krok.',
    'terminal.quest.inputs': 'Dane wejściowe:',
    'terminal.quest.hintsAvailable': 'Wskazówki: {count} dostępne',
    'terminal.quest.solveHint': 'Użyj /solve <odpowiedź> aby wysłać rozwiązanie.',
    'terminal.quest.hintHint': 'Użyj /hint aby uzyskać wskazówkę.',
    'terminal.quest.dataError': 'Błąd danych misji.',
    'terminal.quest.objectivesHeader': 'Cele ({total}):',
    'terminal.quest.progress': 'Postęp: {done}/{total}',

    // /solve
    'terminal.solve.eventOnly': 'Ta misja nie wymaga komendy /solve. Wykonaj cele opisane w /quest.',
    'terminal.solve.apiOnly': 'Ta misja odbywa się poza statkiem. Użyj /support aby uzyskać wsparcie.',
    'terminal.solve.usage': 'Użycie: /solve <odpowiedź>',
    'terminal.solve.systemError': 'Błąd systemu questów.',
    'terminal.solve.correct': 'Odpowiedź poprawna! Weryfikacja zakończona.',
    'terminal.solve.incorrect': 'Nieprawidłowa odpowiedź. Spróbuj ponownie. Wpisz /hint, aby uzyskać wskazówkę.',

    // /hint
    'terminal.hint.noActive': 'Brak aktywnej misji.',
    'terminal.hint.noMore': 'Brak innych wskazówek.',
    'terminal.hint.line': '💡 Wskazówka: {hint}',

    // /bookmarks
    'terminal.bookmarks.empty': 'Brak zapisanych zakładek.',
    'terminal.bookmarks.header': 'ZAKŁADKI',

    // /navi
    'terminal.navi.header': 'MAPA MISJI',
    'terminal.navi.inProgress': '   W TOKU',
    'terminal.navi.eta': '   ETA: {countdown}',
    'terminal.navi.now': 'TERAZ',

    // /badges
    'terminal.badges.header': 'ODZNAKA RANGI',
    'terminal.badges.openLabel': '  {rank} — pokaż odznakę',
    'terminal.badges.previewTitle': 'Odznaka rangi',

    // /support (synchronous)
    'terminal.support.header': 'WSPARCIE HQ',
    'terminal.support.connecting': 'Nawiązywanie połączenia z bazą HQ...',
    'terminal.support.errorUplink': 'BŁĄD: Uplink nie skalibrowany.',
    'terminal.support.checkInstructions': 'Sprawdź instrukcję serwisową CORE AI.',
    'terminal.support.activeHeader': 'WSPARCIE HQ — POŁĄCZENIE AKTYWNE',
    'terminal.support.centerLabel': '  Centrum wsparcia:',
    'terminal.support.centerUrl': '  github.com/przeprogramowani/10x-explorers-hq',

    // /support (async — token fetch)
    'terminal.support.errorAuthHeader': 'WSPARCIE HQ — BŁĄD UWIERZYTELNIENIA',
    'terminal.support.noSession': '  Brak aktywnej sesji systemowej.',
    'terminal.support.tokenRequiresLogin': '  Token nawigacyjny wymaga zalogowania do platformy.',
    'terminal.support.loginPrompt': '  Przejdź na stronę logowania:',
    'terminal.support.loginUrl': '  /login',
    'terminal.support.sessionExpired': 'BŁĄD: Sesja wygasła. Zaloguj się ponownie przez /login.',
    'terminal.support.noPermission': 'BŁĄD: Brak uprawnień do systemu Navigatora.',
    'terminal.support.connectError': 'BŁĄD: Nie udało się połączyć z Centrum Wsparcia.',
    'terminal.support.tokenGenerated': '  Token nawigacyjny wygenerowany:',
    'terminal.support.tokenActive': '  Token nawigacyjny (aktywny):',

    // SmartTerminal hints
    'terminal.requireSession': 'Wymagana aktywna sesja.',
    'terminal.loginToAccess': 'Zaloguj się, aby uzyskać dostęp do Centrum Wsparcia.',
    'terminal.loginCta': '▸ Zaloguj się',
    'terminal.loginCtaTitle': 'Logowanie',
    'terminal.connectingSupport': 'Łączenie z Centrum Wsparcia...',
    'terminal.connectErrorSupport': 'BŁĄD połączenia z Centrum Wsparcia.',

    // Notifications
    'terminal.newCommand': '▸ Nowa komenda dostępna: /{name} — {description}',
    'terminal.questActivated': '◆ Misja aktywowana: {title}',
    'terminal.questActivatedHint': 'Wpisz /quest aby zobaczyć szczegóły.',
    'terminal.questCompleted': '✓ Misja ukończona: {title} (+{xp} XP)',
  },
  en: {
    // Header / boot
    'terminal.header': 'UPLINK TERMINAL',
    'terminal.bootHeaderUpgraded': 'UPLINK v3.0 — Cosmic Quantum Link',
    'terminal.bootHeader': 'UPLINK v2.1 — Cosmic Quantum Link',
    'terminal.bootSession': 'Session active.',
    'terminal.hintArrow': '[↑↓] select command',
    'terminal.hintEnter': '[Enter] confirm',
    'terminal.hintEsc': '[Esc] close',
    'terminal.inputPlaceholder': 'type / to see commands...',
    'terminal.tokenCopy': 'Copy token',
    'terminal.tokenCopied': 'Copied ✓',
    'terminal.tokenRegenerate': 'Regenerate token',
    'terminal.tokenGenerating': 'Generating...',

    // Lock screen
    'terminal.lockGreeting': 'Welcome, Dexo!',
    'terminal.lockBlockedLine1': 'Lock active.',
    'terminal.lockBlockedLine2': 'Enter unlock code:',
    'terminal.lockInvalidCode': 'Invalid code.',
    'terminal.lockMotto': '✨ Per Aspera Ad Astra ✨',

    // Command registry
    'terminal.cmd.me': 'Astronaut Status',
    'terminal.cmd.time': 'Ship Chronometer',
    'terminal.cmd.bookmarks': 'Bookmarks & Resources',
    'terminal.cmd.quest': 'Mission Briefing',
    'terminal.cmd.solve': 'Mission Answer',
    'terminal.cmd.hint': 'Mission Hint',
    'terminal.cmd.navi': 'Journey Stages',
    'terminal.cmd.support': 'HQ Communications',
    'terminal.cmd.badges': 'Rank Badge',

    // /help and unknown
    'terminal.unknownCommand': 'Unknown command. Type /help to see available commands.',
    'terminal.unknownCommandWithName': 'Unknown command: /{cmd}. Type /help to see available commands.',
    'terminal.helpHeader': 'AVAILABLE COMMANDS',
    'terminal.helpHelpEntry': 'Command help',

    // /me
    'terminal.me.header': 'ASTRONAUT PROFILE',
    'terminal.me.rankLabel': 'Rank:',
    'terminal.me.tierLabel': 'Level:',
    'terminal.me.xpLabel': 'XP:',
    'terminal.me.xpMax': '{xp} XP (MAX)',
    'terminal.me.xpProgress': '{xp}/{max} XP',
    'terminal.me.upcomingHeader': 'Upcoming ranks:',
    'terminal.me.missing': '{xp} XP to go',
    'terminal.me.unlocked': 'unlocked',
    'terminal.me.maxRank': 'Maximum rank reached!',

    // /time
    'terminal.time.header': 'SHIP CHRONOMETER',
    'terminal.time.dateLine': '    Date: 2126.{month}.{day}',
    'terminal.time.cycleLine': '    Cycle: {cycle}',
    'terminal.time.cycleDay': 'DAY',
    'terminal.time.cycleNight': 'NIGHT',
    'terminal.time.zoneLine': '    Zone: UTC+0 (shipboard)',

    // /quest
    'terminal.quest.noActive': 'No active mission. Explore the ship.',
    'terminal.quest.noData': 'Mission {id} — no data.',
    'terminal.quest.titleLine': '◆ MISSION: {title}',
    'terminal.quest.supportHint': 'The /support command is an important first step.',
    'terminal.quest.inputs': 'Input data:',
    'terminal.quest.hintsAvailable': 'Hints: {count} available',
    'terminal.quest.solveHint': 'Use /solve <answer> to submit your solution.',
    'terminal.quest.hintHint': 'Use /hint to get a hint.',
    'terminal.quest.dataError': 'Mission data error.',
    'terminal.quest.objectivesHeader': 'Objectives ({total}):',
    'terminal.quest.progress': 'Progress: {done}/{total}',

    // /solve
    'terminal.solve.eventOnly': 'This mission does not require /solve. Complete the objectives listed in /quest.',
    'terminal.solve.apiOnly': 'This mission takes place off-ship. Use /support to get assistance.',
    'terminal.solve.usage': 'Usage: /solve <answer>',
    'terminal.solve.systemError': 'Quest system error.',
    'terminal.solve.correct': 'Answer correct! Verification complete.',
    'terminal.solve.incorrect': 'Wrong answer. Try again. Type /hint to get a hint.',

    // /hint
    'terminal.hint.noActive': 'No active mission.',
    'terminal.hint.noMore': 'No more hints.',
    'terminal.hint.line': '💡 Hint: {hint}',

    // /bookmarks
    'terminal.bookmarks.empty': 'No saved bookmarks.',
    'terminal.bookmarks.header': 'BOOKMARKS',

    // /navi
    'terminal.navi.header': 'MISSION MAP',
    'terminal.navi.inProgress': '   IN PROGRESS',
    'terminal.navi.eta': '   ETA: {countdown}',
    'terminal.navi.now': 'NOW',

    // /badges
    'terminal.badges.header': 'RANK BADGE',
    'terminal.badges.openLabel': '  {rank} — show badge',
    'terminal.badges.previewTitle': 'Rank Badge',

    // /support (synchronous)
    'terminal.support.header': 'HQ SUPPORT',
    'terminal.support.connecting': 'Establishing connection to HQ base...',
    'terminal.support.errorUplink': 'ERROR: Uplink not calibrated.',
    'terminal.support.checkInstructions': 'Check the CORE AI service manual.',
    'terminal.support.activeHeader': 'HQ SUPPORT — CONNECTION ACTIVE',
    'terminal.support.centerLabel': '  Support centre:',
    'terminal.support.centerUrl': '  github.com/przeprogramowani/10x-explorers-hq',

    // /support (async — token fetch)
    'terminal.support.errorAuthHeader': 'HQ SUPPORT — AUTHENTICATION ERROR',
    'terminal.support.noSession': '  No active system session.',
    'terminal.support.tokenRequiresLogin': '  Navigation token requires platform login.',
    'terminal.support.loginPrompt': '  Go to the login page:',
    'terminal.support.loginUrl': '  /login',
    'terminal.support.sessionExpired': 'ERROR: Session expired. Log in again via /login.',
    'terminal.support.noPermission': 'ERROR: No permission for the Navigator system.',
    'terminal.support.connectError': 'ERROR: Failed to connect to the Support Centre.',
    'terminal.support.tokenGenerated': '  Navigation token generated:',
    'terminal.support.tokenActive': '  Navigation token (active):',

    // SmartTerminal hints
    'terminal.requireSession': 'Active session required.',
    'terminal.loginToAccess': 'Log in to access the Support Centre.',
    'terminal.loginCta': '▸ Log in',
    'terminal.loginCtaTitle': 'Log In',
    'terminal.connectingSupport': 'Connecting to Support Centre...',
    'terminal.connectErrorSupport': 'Support Centre connection ERROR.',

    // Notifications
    'terminal.newCommand': '▸ New command available: /{name} — {description}',
    'terminal.questActivated': '◆ Mission activated: {title}',
    'terminal.questActivatedHint': 'Type /quest to see details.',
    'terminal.questCompleted': '✓ Mission complete: {title} (+{xp} XP)',
  },
} as const;
