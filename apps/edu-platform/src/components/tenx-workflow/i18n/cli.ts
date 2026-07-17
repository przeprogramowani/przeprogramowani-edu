/**
 * Slownik strony narzedzia 10x-cli (slug 10x-cli, kontekst publiczny).
 * Zrodlo: post "Instalacja i konfiguracja 10x-cli" [10X3] + repo
 * przeprogramowani/10x-cli. 10x-cli to terminalowy pomocnik, ktory dostarcza
 * zasoby lekcji prosto do projektu i dopasowuje je do wybranego agenta.
 *
 * Adresy i przykladowe komendy zyja w config.ts (TENX_CLI). Strona jest polska
 * (poza EN_PAGES) - wpis en odbija pl.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface CliText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  routeAria: string;
  route: string[];

  what: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  install: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    steps: Row[];
  };

  cmds: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    list: { cmd: string; descHtml: string }[];
    /** Podsumowanie flag komendy `10x get`. */
    flagsHtml: string;
  };

  skills: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    cmd: string;
    noteHtml: string;
  };

  flow: {
    num: string;
    kicker: string;
    h2: string;
    steps: string[];
    noteHtml: string;
  };

  next: {
    num: string;
    kicker: string;
    h2: string;
    repoLabel: string;
    repoRest: string;
    kursLink: string;
    kursRest: string;
  };
}

const pl: CliText = {
  eyebrow: 'Narzędzie kursu',
  h1Html: '10x-cli - zasoby lekcji <span class="glow">prosto w terminalu</span>',
  subHtml:
    '<strong>10x-cli</strong> to terminalowy pomocnik 10xDevs. Jedną komendą pobiera prompty i zasoby danej lekcji prosto do Twojego projektu i dopasowuje je do agenta, w którym pracujesz - Claude Code, Cursor, Copilot lub Codex.',
  routeAria: 'Sekcje strony',
  route: ['Instalacja', 'Komendy', 'Skille', 'Workflow'],

  what: {
    num: '01',
    kicker: 'Po co',
    h2: 'Po co Ci 10x-cli',
    leadHtml:
      'Zamiast kopiować prompty z platformy do projektu ręcznie, ściągasz je komendą. CLI trzyma zasoby lekcji w jednym miejscu i wrzuca je tam, gdzie pracuje Twój agent.',
    rows: [
      { dt: 'Dla kogo', ddHtml: 'Dla uczestników 10xDevs - wchodzi do gry już w preworku (pierwszy prompt <code>m0l1</code>).' },
      { dt: 'Co robi', ddHtml: 'Dostarcza <b>prompty i zasoby lekcji</b> bezpośrednio do repozytorium projektu.' },
      { dt: 'Z czym gra', ddHtml: 'Dopasowuje pobrane pliki do wybranego agenta: <b>Claude Code, Cursor, Copilot lub Codex</b>.' },
    ],
  },

  install: {
    num: '02',
    kicker: 'Start',
    h2: 'Instalacja i logowanie',
    leadHtml:
      'Pełna instrukcja jest w README repozytorium. W skrócie - trzy kroki i jesteś gotowy do pobierania lekcji.',
    steps: [
      {
        dt: 'Zainstaluj',
        ddHtml:
          'Bez instalacji: <code>npx @przeprogramowani/10x-cli auth</code>. Na stałe: <code>npm install -g @przeprogramowani/10x-cli</code>, samodzielny plik z GitHub Releases albo <code>npx skills add przeprogramowani/10x-cli</code> (setup przez agenta).',
      },
      {
        dt: 'Zaloguj się',
        ddHtml:
          'Wywołaj <code>10x auth</code> i podaj <b>adres e-mail, którego używasz w Circle</b> (logowanie magic-linkiem) - to powiązuje CLI z Twoim kontem kursu.',
      },
      {
        dt: 'Pobierz zasoby',
        ddHtml: 'Przejrzyj lekcje przez <code>10x list</code>, a potem ściągnij artefakty komendą <code>10x get &lt;ref&gt;</code>, np. <code>10x get m1l1</code>.',
      },
    ],
  },

  cmds: {
    num: '03',
    kicker: 'Ściąga',
    h2: 'Najważniejsze komendy',
    leadHtml: 'Pięć komend na start - reszta i pełna lista flag są w README.',
    list: [
      { cmd: '10x auth', descHtml: 'Logowanie magic-linkiem na adres e-mail z Circle. Jednorazowo wiąże CLI z Twoim kontem kursu.' },
      { cmd: '10x list', descHtml: 'Przeglądaj moduły i lekcje dostępne w Twoim kursie.' },
      { cmd: '10x get <ref>', descHtml: 'Pobiera lekcję i wgrywa artefakty (skille, prompty, reguły, configi) do projektu. Przykład: <code>10x get m1l1</code>.' },
      { cmd: '10x sync', descHtml: 'Aktualizuje pobrane lekcje i pokazuje, co zmieniło się „u źródła".' },
      { cmd: '10x doctor', descHtml: 'Diagnostyka: logowanie, połączenie z API i lokalna konfiguracja.' },
    ],
    flagsHtml:
      'Flagi <code>10x get</code>: <code>--type</code> (<code>skills</code>, <code>prompts</code>, <code>rules</code>, <code>configs</code>), <code>--name &lt;nazwa&gt;</code> (wymaga <code>--type</code>), <code>--tool</code> (claude-code, cursor, copilot, codex, windsurf, gemini, generic), <code>--print</code>, <code>--dry-run</code>.',
  },

  skills: {
    num: '04',
    kicker: 'Po nazwie',
    h2: 'Pobierz sam skill po nazwie',
    leadHtml:
      'Nie musisz ściągać całej lekcji - możesz wyciągnąć pojedynczy <b>skill po nazwie</b>. Filtrujesz artefakty typem <code>skills</code> i nazwą skilla.',
    cmd: '10x get m1l1 --type skills --name code-review',
    noteHtml:
      'Dodaj <code>--print</code>, żeby wypisać skill na stdout zamiast zapisywać pliki (np. <code>… --print | pbcopy</code>). Ten sam wzorzec znajdziesz na stronach skilli w tym portalu.',
  },

  flow: {
    num: '05',
    kicker: 'Jak używać',
    h2: 'Workflow: od komendy do agenta',
    steps: [
      'Pobierz prompt lekcji: 10x get m0l1.',
      'Otwórz pobrany plik (np. m0l1-prework.md) w swoim agencie - Claude Code, Cursor, Copilot lub Codex.',
      'Odwołaj się do promptu przez „@" albo wskaż bezpośrednią ścieżkę i uruchom go.',
      'Gotowe - agent powita Cię w 10xDevs i poprowadzi przez lekcję.',
    ],
    noteHtml:
      'Jeśli udało się pobrać <code>m0l1</code> i uruchomić prompt w agencie - jesteś gotowy do startu. ✅',
  },

  next: {
    num: 'DALEJ',
    kicker: 'Co teraz',
    h2: 'Zajrzyj do repozytorium i przebiegu kursu',
    repoLabel: 'Repozytorium 10x-cli',
    repoRest: ' - instalacja, README i pełna lista komend.',
    kursLink: 'Jak działa kurs',
    kursRest: ' - gdzie 10x-cli wpina się w prework i moduły.',
  },
};

/** EN celowo odbija PL - strona poza EN_PAGES (rollout progresywny). */
export const CLI: Record<Lang, CliText> = { pl, en: pl };
