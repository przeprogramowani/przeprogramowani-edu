import {
  Em,
  InsightSlide,
  ListSlide,
  NumberSlide,
  SectionSlide,
  SlideShell,
  StatementSlide,
  StepsSlide,
  TitleSlide,
} from "../../src/deck/system.jsx";

export const slides = [
  // ─── ACT 1 — Powitanie ───

  {
    id: "title",
    render: (active) => (
      <TitleSlide
        active={active}
        act="1"
        kicker="Kickoff · 19 maja 2026"
        title={
          <>
            Witajcie w <Em gradient>10xDevs 3.0</Em>
          </>
        }
        meta="Pięć tygodni AI-Native Software Engineeringu"
      />
    ),
  },
  {
    id: "community",
    render: (active) => (
      <NumberSlide
        active={active}
        act="1"
        value="~3000"
        label={<>Uczestników w trzeciej edycji</>}
        tone="gradient"
        note="Topowe firmy IT, startupy, freelancerzy, konsultanci — dzięki, że jesteście!"
      />
    ),
  },

  // ─── ACT 2 — Circle ───

  {
    id: "circle-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="2"
        label="Społeczność"
        title={
          <>
            Społeczność 10xDevs — <Em gradient>kluczowe wskazówki</Em>
          </>
        }
      />
    ),
  },
  {
    id: "circle-handoff",
    render: (active) => (
      <StatementSlide
        active={active}
        act="2"
        title={
          <>
            Jak to <Em tone="accent2">działa?</Em>
          </>
        }
        subtitle="Onboarding do przestrzeni 10xDevs 3.0, kanały, ważne wątki, jak zadawać pytania"
      />
    ),
  },
  {
    id: "mentors",
    render: (active) => (
      <SlideShell active={active} act="2">
        <h2 className="slide-subheading mb-8">Mentorzy 10xDevs 3.0</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["Krzysztof Bohaczyk", "Dawid Sibiński", "Krzysztof Drzymalski"].map((name) => (
            <div
              key={name}
              className="surface-card text-cardTitle font-semibold px-10 py-6"
            >
              {name}
            </div>
          ))}
        </div>
        <p className="body-copy mt-8">
          Doświadczeni full-stack developerzy, praktycy, adepci programów{" "}
          <Em tone="accent2">BRAVE</Em>
        </p>
      </SlideShell>
    ),
  },

  // ─── ACT 3 — Prework ───

  {
    id: "prework-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="3"
        label="Start"
        title={
          <>
            Prework — <Em gradient>płynny start w 10xDevs 3.0</Em>
          </>
        }
      />
    ),
  },
  {
    id: "prework-details",
    render: (active) => (
      <ListSlide
        active={active}
        act="3"
        label="platforma.przeprogramowani.pl"
        labelTone="accent2"
        title={<>Co znajdziesz w preworku</>}
        items={[
          { content: "Podstawy Generative AI — modele, kontekst, ograniczenia", check: true },
          { content: "Promptowanie — wzorce, które realnie działają", check: true },
          { content: "Rekomendacje toolingu pod Twój workflow", check: true },
          { content: "Quiz dopasowujący lekcje do Twojego poziomu", check: true },
        ]}
        footer={
          <>
            Nie znasz podstaw? Zacznij od preworku. Czujesz się pewnie? Quiz wskaże, co pominąć.
          </>
        }
      />
    ),
  },

  // ─── ACT 4 — Pięć tygodni ───

  {
    id: "weeks-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="4"
        label="Program"
        title={
          <>
            5 tygodni <Em gradient="warm">nauki</Em>
          </>
        }
      />
    ),
  },
  {
    id: "weeks-grid",
    render: (active) => (
      <StepsSlide
        active={active}
        act="4"
        title="Pięć tygodni — pięć obszarów"
        items={[
          {
            icon: "①",
            title: "Agentic Environment",
            desc: "Pomysł, tech stack, środowisko agenta",
          },
          {
            icon: "②",
            title: "AI-Native MVP",
            desc: "Roadmapa, planowanie, implementacja",
          },
          {
            icon: "③",
            title: "AI-Development Quality",
            desc: "Test plany, feedback loops, CI/CD",
          },
          {
            icon: "④",
            title: "Legacy & Large Scale",
            desc: "Rozbudowa, skalowanie, prod repo",
          },
          {
            icon: "⑤",
            title: "AI-Native Teamwork",
            desc: "Agent SDK, sandboxy, integracje",
          },
        ]}
      />
    ),
  },
  {
    id: "week-1-preview",
    render: (active) => (
      <ListSlide
        active={active}
        act="4"
        label="Tydzień 1"
        title={<>Agentic Environment</>}
        items={[
          "Pomysł na projekt i wybór tech stacku",
          "Środowisko agenta — bezpieczeństwo i reguły",
          "Przygotowanie infrastruktury",
        ]}
      />
    ),
  },
  {
    id: "week-2-preview",
    render: (active) => (
      <ListSlide
        active={active}
        act="4"
        label="Tydzień 2"
        title={<>AI-Native MVP</>}
        items={[
          "Roadmapa i research z agentem",
          "Planowanie i implementacja",
          "CLI / MCP dla issue trackerów",
        ]}
      />
    ),
  },
  {
    id: "week-3-preview",
    render: (active) => (
      <ListSlide
        active={active}
        act="4"
        label="Tydzień 3"
        labelTone="accent2"
        title={<>AI-Development Quality</>}
        items={[
          "Test plany i quality gates",
          "Inner & outer feedback loops",
          "CI/CD pod kątem pracy z agentem",
        ]}
      />
    ),
  },
  {
    id: "week-4-preview",
    render: (active) => (
      <ListSlide
        active={active}
        act="4"
        label="Tydzień 4"
        labelTone="warm"
        title={<>Legacy & Large Scale</>}
        items={[
          "Wzorce rozbudowy i skalowania kontekstu",
          "Case study dużego, legacy kodu",
          "Strategie pracy w produkcyjnych repo",
        ]}
      />
    ),
  },
  {
    id: "week-5-preview",
    render: (active) => (
      <ListSlide
        active={active}
        act="4"
        label="Tydzień 5"
        labelTone="positive"
        title={<>AI-Native Teamwork</>}
        items={[
          "Budujemy w oparciu o Agent SDK",
          "Kontrola agenta i sandboxy",
          "Integracje i praca zespołowa",
        ]}
      />
    ),
  },

  // ─── ACT 5 — Tempo pracy ───

  {
    id: "tempo-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="5"
        label="Rytm"
        title={
          <>
            Tempo <Em gradient>pracy</Em>
          </>
        }
      />
    ),
  },
  {
    id: "tempo-details",
    render: (active) => (
      <ListSlide
        active={active}
        act="5"
        label="Co poniedziałek ~7:00"
        labelTone="accent2"
        title={<>Jak będziemy pracować</>}
        items={[
          { content: "5 lekcji co poniedziałek rano (~7:00)", check: true },
          { content: "Full scope tygodnia od razu — układasz harmonogram pod siebie", check: true },
          { content: "„Czy jestem w dobrym miejscu?” — jeśli idziesz z lekcjami, all good", check: true },
          { content: "„Jak skonfigurować narzędzie X?” — zajrzyj do właściwej lekcji", check: true },
        ]}
        footer={
          <>
            Nie ścigamy się — <Em tone="positive">spójność</Em> bije pośpiech
          </>
        }
      />
    ),
  },

  // ─── ACT 6 — Tydzień pierwszy ───

  {
    id: "week-1-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="6"
        label="Start"
        title={
          <>
            Tydzień pierwszy — <Em gradient="warm">kluczowe założenia</Em>
          </>
        }
      />
    ),
  },
  {
    id: "week-1-assumptions",
    render: (active) => (
      <ListSlide
        active={active}
        act="6"
        label="Co masz mieć po tygodniu 1"
        title={<>Założenia startowe</>}
        items={[
          { content: "Zdefiniowany pomysł na projekt i wybrany tech stack", check: true },
          { content: "…lub dyskusja z mentorami i uczestnikami, żeby się określić", check: true },
          { content: "Sesje z agentem — PRD, tech-stack, infrastructure", check: true },
          { content: "Środowisko — bezpieczeństwo, reguły, skille", check: true },
          { content: "Narzędzia 10xDevs — Platforma, 10xCLI, Circle", check: true },
        ]}
      />
    ),
  },
  {
    id: "week-1-outcome",
    render: (active) => (
      <InsightSlide
        active={active}
        act="6"
        number="01"
        tone="positive"
        tag="Sprint zero"
        title={
          <>
            Efekt końca tygodnia:<br /> <Em tone="positive">publiczny URL</Em> do Twojej aplikacji
          </>
        }
      >
        Realna aplikacja pod adresem, który możesz wysłać znajomemu.
      </InsightSlide>
    ),
  },

  // ─── ACT 7 — 10xCLI ───

  {
    id: "cli-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="7"
        label="Tooling"
        title={
          <>
            10xCLI — <Em gradient>pomocnik uczestnika</Em>
          </>
        }
      />
    ),
  },
  {
    id: "cli-details",
    render: (active) => (
      <ListSlide
        active={active}
        act="7"
        label="github.com/przeprogramowani/10x-cli"
        labelTone="accent2"
        title={<>Co daje 10xCLI</>}
        items={[
          { content: "Terminalowe narzędzie do pobierania zasobów z lekcji", check: true },
          { content: "Open source — kontrybucje i issues mile widziane", check: true },
          { content: "Alternatywa: statyczne zasoby na platformie i w Circle", check: true },
        ]}
        footer={
          <>
            Obecna wersja: 1.6.1
          </>
        }
      />
    ),
  },

  // ─── ACT 8 — Certyfikacja ───

  {
    id: "cert-section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="8"
        label="Finał"
        title={
          <>
            Certyfikacja — <Em gradient>jak to działa</Em>
          </>
        }
      />
    ),
  },
  {
    id: "cert-deadlines",
    render: (active) => (
      <ListSlide
        active={active}
        act="8"
        label="Terminy oddania projektu"
        labelTone="accent2"
        title={<>Trzy terminy zaliczenia</>}
        items={[
          {
            content: (
              <>
                <Em tone="accent2">1. termin:</Em> 5 lipca 2026 — do 23:59
              </>
            ),
            check: true,
          },
          {
            content: (
              <>
                <Em tone="accent2">2. termin:</Em> 10 sierpnia 2026 — do 23:59
              </>
            ),
            check: true,
          },
          {
            content: (
              <>
                <Em tone="warm">3. termin (ostateczny):</Em> 14 września 2026 — do 23:59
              </>
            ),
            check: true,
          },
        ]}
        footer={
          <>
            Po każdym terminie prowadzący mają 2 tygodnie na sprawdzenie i feedback. Wyróżnienia
            przyznajemy tylko w pierwszym terminie — najlepsze projekty trafiają na{" "}
            <Em tone="positive">Demo Day</Em>.
          </>
        }
      />
    ),
  },
  {
    id: "cert-pillars",
    render: (active) => (
      <InsightSlide
        active={active}
        act="8"
        tone="accent"
        tag="Certyfikat"
        title={
          <>
            🚀 <Em gradient>10xBuilder</Em> — za projekt zaliczeniowy
          </>
        }
      >
        <p>
          Fundament certyfikacji: full-stackowe MVP wdrożone na chmurę. Robi go każdy uczestnik.
        </p>
        <div className="surface-card mt-10 flex flex-col gap-6 px-10 py-8">
          <span className="slide-label slide-label--positive self-start">
            Dodatkowy upgrade certyfikatu
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <span className="insight-tag insight-tag--accent2 !text-chip !px-7 !py-3">
              🔧 10x Architect · M4
            </span>
            <span className="insight-tag insight-tag--warm !text-chip !px-7 !py-3">
              👨‍🚀 10x Champion · M5
            </span>
          </div>
          <p className="footnote">
            Za extra wysiłek - bezpieczne środowisko zaliczeniowe (symulowane).
          </p>
        </div>
      </InsightSlide>
    ),
  },

  // ─── Closing ───

  {
    id: "closing",
    render: (active) => (
      <TitleSlide
        active={active}
        act="closing"
        title={
          <>
            Czas na <Em gradient>Q&A!</Em>
          </>
        }
        meta="5 tygodni pracy, nauki i zabawy - enjoy!"
      />
    ),
  },
];
