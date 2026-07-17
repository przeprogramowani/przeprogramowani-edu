import {
  CodeSlide,
  Compare,
  CompareCol,
  CardGridSlide,
  Em,
  ImageSlide,
  InsightSlide,
  ListSlide,
  SkillTheorySlide,
  Stat,
  StatementSlide,
  TableSlide,
  TitleSlide,
} from "../../src/deck/system.jsx";

const assets = (name) => `/assets/${name}`;

export const slides = [
  // ─── ACT 1 — Fundamenty (0–20 min) ───

  {
    id: "title",
    render: (active) => (
      <TitleSlide
        active={active}
        act="1"
        kicker="Webinar · 7 maja 2026"
        title={
          <>
            Claude Code dla Product Builderów —{" "}
            <Em gradient>od prototypu do produktu</Em>
          </>
        }
        meta="Lovable i Replit kończą się tam, gdzie zaczyna się produkt."
      />
    ),
  },
  {
    id: "hook",
    render: (active) => (
      <StatementSlide
        active={active}
        act="1"
        display
        title={
          <>
            <Em gradient="warm">Piękny ≠ gotowy</Em>
          </>
        }
        subtitle={
          `Masz prototyp, klient mówi „super” — a potem chcesz dodać auth, walidację, testy, CI/CD… i narzędzie się kończy.`
        }
      />
    ),
  },
  {
    id: "comparison",
    render: (active) => (
      <TableSlide
        active={active}
        act="1"
        title="CC vs Lovable vs Replit — uczciwe porównanie"
        head={
          <tr>
            <th></th>
            <th>Lovable</th>
            <th>Replit</th>
            <th>Claude Code</th>
          </tr>
        }
        footer={"Ścieżka: Lovable / Replit → przenieś do CC, gdy produkt rośnie."}
      >
        <tr>
          <td>Środowisko</td>
          <td>Browser</td>
          <td>Browser + cloud</td>
          <td>
            <Em tone="positive">GUI / Term + Mobile + Cloud</Em>
          </td>
        </tr>
        <tr>
          <td>Stack</td>
          <td>Zamknięty</td>
          <td>Ograniczony</td>
          <td>
            <Em tone="positive">Dowolny</Em>
          </td>
        </tr>
        <tr>
          <td>Hosting</td>
          <td>Wbudowany</td>
          <td>Wbudowany</td>
          <td>Twój wybór</td>
        </tr>
        <tr>
          <td>Custom logic</td>
          <td>
            <Em tone="negative">Sufit</Em>
          </td>
          <td>Ograniczony</td>
          <td>
            <Em tone="positive">Pełna kontrola</Em>
          </td>
        </tr>
        <tr>
          <td>Sufit</td>
          <td>Auth, CI/CD</td>
          <td>DevOps, enterprise</td>
          <td>Wymaga wiedzy, czego chcesz</td>
        </tr>
        <tr>
          <td>Próg wejścia</td>
          <td>
            <Em tone="positive">Niski</Em>
          </td>
          <td>Średni</td>
          <td>Wyższy (Desktop to obniża)</td>
        </tr>
      </TableSlide>
    ),
  },
  {
    id: "what-is-cc",
    render: (active) => (
      <InsightSlide
        active={active}
        act="1"
        tag="Model mentalny"
        tone="accent"
        title={
          <>
            <Em gradient>Claude Code</Em> — agentic CLI, nie IDE assistant
          </>
        }
      >
        <span>
          Czyta, planuje, działa, weryfikuje — sam. Nie chatbot, nie
          autocomplete.
        </span>
        <br />
        <span className="mt-4 block">
          <Em tone="accent2">Terminal</Em> +{" "}
          <Em tone="accent2">desktop app</Em> — ten sam silnik. System dla
          każdego: PM, designer, dev, founder.
        </span>
        <p className="footnote mt-6">
          📘 W artefaktach do webinaru znajdziecie darmowy poradnik{" "}
          <Em tone="accent">„Claude Code i najważniejsze funkcje Agentów AI"</Em>
          {" "}— pełny przewodnik po możliwościach narzędzia.
        </p>
      </InsightSlide>
    ),
  },
  {
    id: "where-you-end",
    render: (active) => (
      <StatementSlide
        active={active}
        act="1"
        display
        title={
          <>
            Model planuje. <Em gradient>Ty decydujesz.</Em>
          </>
        }
        subtitle="Vibe coding nie wystarczy."
      />
    ),
  },
  {
    id: "live-build-intro",
    render: (active) => (
      <ImageSlide
        active={active}
        act="2"
        image={assets("landing.png")}
        alt="Landing page 10xShoes zbudowany live z Claude Code"
        title={
          <>
            <Em gradient>Live building</Em> od zera
          </>
        }
      />
    ),
  },
  {
    id: "product-spec",
    render: (active) => (
      <CodeSlide
        active={active}
        act="2"
        label="Wszystko zaczyna się od jednego maila"
        width="wide"
        footer={
          <>
            Realny, <Em>scrappy</Em> brief — nie wygładzony PRD. To jest input dla
            Claude.
          </>
        }
      >
        <span className="cm"># 10xShoes Velocity X1 (DRAFT, lecę na lotnisko)</span>
        <br />
        <br />
        <span className="cm">
          ok ekipa, szybko bo mam samolot za 40 min, wrzucam jak leci
        </span>
        <br />
        <br />
        - target: <span className="hl">maratończycy amatorzy + sub-3h</span>,
        premiera Q3 2027, ~1899 PLN
        <br />
        - magia #1: <span className="hl2">adaptacyjna podeszwa</span> —
        mikrokapsułki z płynem nieniutonowskim
        <br />
        - magia #2: <span className="hl2">samonaprawiająca cholewka</span> —
        mycelium composite (grzybnia!)
        <br />
        - magia #3: <span className="hl2">AI coach w języku</span> — czujniki IMU,
        gada z appką w czasie rzeczywistym
        <br />
        - magia #4: <span className="hl2">kolor zmienia się z tempem</span> —
        termochromatyczna powłoka, insta oszaleje
        <br />
        - waga: <span className="hl">180g rozm. 42</span> (R&D mówi 185g, sprawdźcie)
        <br />
        - płyta: grafenowo-węglowa kształt litery S, pianka{" "}
        <span className="hl">PEBA-Z</span> (zero degradacji do 800km)
        <br />
        - ESG: 70% recykling + take-back program (300 PLN zniżki)
        <br />
        <br />
        <span className="cm">
          # ryzyka: cert. World Athletics (39.5mm na granicy!), patent mycelium,
          chip tylko z Tajwanu
        </span>
        <br />
        <span className="cm"># review w czwartek — P.</span>
      </CodeSlide>
    ),
  },

  // ─── ACT 2 — Live build greenfield (20–75 min) ───

  {
    id: "demo-setup",
    render: (active) => (
      <ListSlide
        active={active}
        act="2"
        label="Freestyle VS bootstrap"
        labelTone="accent"
        title={
          <>
            Pierwszy krok <Em gradient>na dwa sposoby</Em>
          </>
        }
        items={[
          <>
            <Em tone="accent">a)</Em> Praca z <Em>pustym repo</Em> — czysty start, zero kontekstu, "może się uda"
          </>,
          <>
            <Em tone="accent">b)</Em> Bootstrap na szablonie — np.{" "}
            <Em tone="accent2">10x-astro-starter</Em> (Astro + Tailwind + TS + Supabase)
          </>,
        ]}
        image={assets("10x-astro.png")}
        alt="10x-astro-starter — Astro + Tailwind + TypeScript + Supabase"
      />
    ),
  },
  {
    id: "mcp-cli",
    render: (active) => (
      <ListSlide
        active={active}
        act="2"
        label="MCP + CLI"
        labelTone="accent2"
        title={
          <>
            Nowe możliwości z <Em gradient>MCP i CLI</Em>
          </>
        }
        items={[
          <>
            <Em tone="accent">GitHub CLI</Em> — kod, PR-y, review, issues
          </>,
          <>
            <Em tone="accent">AWS CLI</Em> — chmura, deploy, infra
          </>,
          <>
            <Em tone="accent2">Linear MCP</Em> — task management, sprinty, priorytety
          </>,
          <>
            <Em tone="accent2">ffmpeg</Em> — edycja filmów i audio
          </>,
          <>
            <Em tone="warm">…i każde inne CLI</Em> — Claude potrafi z nich korzystać samodzielnie
          </>,
        ]}
        image={assets("gh-cli.png")}
        alt="GitHub CLI w użyciu z Claude Code"
        imageSize="xl"
      />
    ),
  },
    {
    id: "claude-md",
    render: (active) => (
      <ImageSlide
        active={active}
        act="1"
        // TODO: screenshot realnego CLAUDE.md z edu-platform
        title={
          <>
            <Em gradient>CLAUDE.md</Em> — kontekst jest królem
          </>
        }
        subtitle={
          "Dokument onboardingowy dla Agenta AI - /init"
        }
      />
    ),
  },
  {
    id: "context-types",
    render: (active) => (
      <ListSlide
        active={active}
        act="1"
        label="Rodzaje kontekstu"
        labelTone="accent"
        title={
          <>
            Wsad do <Em gradient>przewidywalnego developmentu</Em>
          </>
        }
        items={[
          <>
            <Em tone="accent">PRD</Em> — product requirements, źródło prawdy o produkcie
          </>,
          <>
            <Em tone="accent">Roadmapa</Em> — co, kiedy, w jakiej kolejności
          </>,
          <>
            <Em tone="accent2">Spec produktowy</Em> — szczegóły funkcjonalności, edge case'y
          </>,
          <>
            <Em tone="warm">Maile od szefa</Em> — scrappy briefy, realne decyzje, zmiany kierunku
          </>,
          <>
            <Em tone="accent2">Liczby i raporty</Em> — metryki, analytics, feedback z produkcji
          </>,
        ]}
      />
    ),
  },
  {
    id: "agent-loop-repeat",
    render: (active) => (
      <CardGridSlide
        active={active}
        act="1"
        title={"Pętla Agenta na przykładzie landingu 10xShoes"}
        columns={2}
        items={[
          { icon: "📖", label: "Kontekst — mail, prd, roadmapa" },
          { icon: "📋", label: "Plan — pierwsza wersja landingu" },
          { icon: "⚡", label: "Akcja — implementacja" },
          { icon: "✓", label: "Weryfikacja — ocena jakości" },
        ]}
      />
    ),
  },
  {
    id: "skills-intro",
    render: (active) => (
      <InsightSlide
        active={active}
        act="2"
        tone="accent2"
        title={
          <>
            <Em gradient>Skille</Em> — programowalne AI
          </>
        }
      >
        <span>
          Zamień procesy i akcje na wykonywalne instrukcje dla AI
        </span>
        <br />
        <span className="mt-4 block">
          /.claude/skills/ — dedykowana przestrzeń projektu i buildera
        </span>
        <pre className="code-block code-block--mid mt-8">
{`.claude/skills/my-skill/
├── SKILL.md          # Wymagane: metadane + instrukcje
├── scripts/          # Opcjonalnie: wykonywalny kod
├── references/       # Opcjonalnie: dokumentacja
├── assets/           # Opcjonalnie: szablony, zasoby
└── ...               # Dowolne dodatkowe pliki lub katalogi`}
        </pre>
      </InsightSlide>
    ),
  },
  {
    id: "demo-feature",
    render: (active) => (
      <SkillTheorySlide
        active={active}
        act="2"
        demo="Nowa funkcjonalność"
        command="subscribe-form"
        title={
          <>
            Formularz <Em gradient="warm">10xShoes</Em>
          </>
        }
        points={[
          "Zapisy na listę oczekujących",
          "Walidacja client-side (UX) + server-side (bezpieczeństwo)",
          "Astro API endpoint, obsługa błędów, testy",
          "Skill uczy Agenta jak budować formularze w tym projekcie",
        ]}
        launch={"Custom walidacja ✓ · server-side logic ✓ · testy ✓ · spójność z resztą kodu ✓"}
        tone="warm"
      />
    ),
  },
  {
    id: "demo-quality",
    render: (active) => (
      <SkillTheorySlide
        active={active}
        act="2"
        demo="Kontrola jakości"
        command="quality-check"
        title={
          <>
            <Em gradient>Tu Lovable się kończy</Em>
          </>
        }
        points={[
          "build → lint → testy → astro check → code review",
          "Lokalnie, przed commitem — nie CI/CD",
          "Agent czyta wynik każdego kroku i decyduje co dalej",
          "Build się wysypał? Agent czyta błąd i naprawia.",
        ]}
        launch={"Kod 10xShoes przechodzi przez ten sam proces, co kod produkcyjny."}
        tone="accent2"
      />
    ),
  },

  // ─── ACT 3 — Realia + zamknięcie (75–90 min) ───

  {
    id: "hygiene",
    render: (active) => (
      <ListSlide
        active={active}
        act="3"
        label="Higiena pracy"
        labelTone="accent2"
        title={"Świeży kontekst = efektywność i budżet"}
        items={[
          <>
            <Em tone="accent2">/context</Em> — ile okno jest zapełnione
          </>,
          <>
            <Em tone="accent2">/usage</Em> — zużycie tokenów w oknie 5h
          </>,
          <>
            Nowy wątek po każdym zadaniu lub przy{" "}
            <Em tone="warm">150–200k tokenów</Em>
          </>,
          <>
            Przed zamknięciem →{" "}
            <Em tone="positive">zrzuć wiedzę do pliku .md</Em>
          </>,
          {
            content: (
              <>
                Nowy wątek + plik = <Em>świeży kontekst z wiedzą</Em>
              </>
            ),
            check: true,
          },
        ]}
      />
    ),
  },
  {
    id: "brownfield",
    render: (active) => (
      <ListSlide
        active={active}
        act="3"
        label="Brownfield"
        labelTone="accent"
        title={"To co widzieliście, ale w repo z 500k linii"}
        items={[
          <>
            <Em tone="accent2">/init</Em> — Claude poznaje projekt w minuty
          </>,
          <>
            <Em tone="accent">Subagent Explore</Em> — szuka po kodzie za ciebie
          </>,
          {
            content: (
              <>
                <Em tone="positive">Małe PR-y</Em> — chirurgiczne zmiany, nie
                2000-liniowe diffy
              </>
            ),
            check: true,
          },
        ]}
      />
    ),
  },
  {
    id: "antipatterns",
    render: (active) => (
      <ListSlide
        active={active}
        act="3"
        label="Czego NIE robić"
        labelTone="negative"
        title="Granice zaufania"
        items={[
          <>
            <Em tone="negative">Vibe loop</Em> — ślepe „tak, ok, dalej" bez
            czytania planu
          </>,
          <>
            <Em tone="warm">Ślepe zatwierdzanie</Em> — permission mode w
            zespole ≠ solo
          </>,
          <>
            <Em tone="negative">Sekrety w kontekście</Em> — .env, klucze API,
            tokeny
          </>,
          {
            content: (
              <>
                <Em tone="positive">Review {">"} trust</Em> — agent to junior,
                nie senior
              </>
            ),
            check: true,
          },
        ]}
      />
    ),
  },
  {
    id: "pricing",
    render: (active) => (
      <InsightSlide
        active={active}
        act="3"
        tag="Cennik"
        tone="accent"
        title="Ile to kosztuje?"
        centered
      >
        <Compare centered>
          <CompareCol title="Pro">
            <Stat value="$20" label={"miesięcznie"} tone="accent" />
          </CompareCol>
          <CompareCol title="Max 5×">
            <Stat value="$100" label={"miesięcznie"} tone="accent2" />
          </CompareCol>
          <CompareCol title="Max 20×">
            <Stat value="$200" label={"miesięcznie"} tone="accent2" />
          </CompareCol>
        </Compare>
        <p className="footnote mt-8">
          Podwojone limity dla wszystkich planów od 06.05.2026
        </p>
      </InsightSlide>
    ),
  },
  {
    id: "closing",
    render: (active) => (
      <StatementSlide
        active={active}
        act="closing"
        display
        title={
          <>
            Zainstaluj CC. Stwórz <Em gradient>CLAUDE.md</Em>. Znajdź
            pierwszy <Em gradient="warm">Skill</Em>.
          </>
        }
        subtitle="skills.sh — gotowe skille do pobrania. Zacznij od rozbudowy prototypu z Lovable/Replit lub od zera."
      />
    ),
  },
  {
    id: "qa",
    render: (active) => (
      <TitleSlide
        active={active}
        act="closing"
        kicker="Q&A"
        title={
          <>
            <Em gradient>Pytania?</Em>
          </>
        }
        meta={"Terminal otwarty — pytanie zamienia się w mini-demo"}
      />
    ),
  },
];
