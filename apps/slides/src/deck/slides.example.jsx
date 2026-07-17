import {
  CardGridSlide,
  CodeSlide,
  Compare,
  CompareCol,
  Em,
  FullImageSlide,
  ImageSlide,
  InsightSlide,
  ListSlide,
  NumberSlide,
  QuoteSlide,
  ScorecardSlide,
  SectionSlide,
  SkillTheorySlide,
  SplitShowcaseSlide,
  Stat,
  StatementSlide,
  StepsSlide,
  TableSlide,
  TitleSlide,
} from "./system.jsx";

const assets = (name) => `/assets/${name}`;

export const slides = [
  {
    id: "title",
    render: (active) => (
      <TitleSlide
        active={active}
        act="intro"
        kicker="Showcase"
        title={<>Przegląd <Em gradient>komponentów</Em></>}
        meta="Wszystkie slajdy z system.jsx w jednym miejscu"
      />
    ),
  },
  {
    id: "statement",
    render: (active) => (
      <StatementSlide
        active={active}
        act="intro"
        title={<>Jedno zdanie, <Em gradient="warm">duży efekt</Em></>}
        subtitle="StatementSlide — opcjonalny subtitle i tryb display"
      />
    ),
  },
  {
    id: "statement-display",
    render: (active) => (
      <StatementSlide
        active={active}
        act="intro"
        display
        title={<>Tryb <Em tone="accent2">display</Em></>}
      />
    ),
  },
  {
    id: "section",
    render: (active) => (
      <SectionSlide
        active={active}
        act="components"
        label="Sekcja"
        title={<>Podział na <Em gradient>rozdziały</Em></>}
      />
    ),
  },
  {
    id: "image",
    render: (active) => (
      <ImageSlide
        active={active}
        act="components"
        title="ImageSlide"
        subtitle={<>Rozmiary: default, <Em>lg</Em>, <Em tone="accent2">xl</Em></>}
        image={assets("background.png")}
        alt="Przykładowy obraz"
        imageSize="lg"
      />
    ),
  },
  {
    id: "full-image",
    render: (active) => (
      <FullImageSlide
        active={active}
        act="components"
        image={assets("background.png")}
        alt="Pełnoekranowy obraz"
      />
    ),
  },
  {
    id: "split",
    render: (active) => (
      <SplitShowcaseSlide
        active={active}
        act="components"
        badge="v2.0"
        badgeVariant="new"
        title="SplitShowcaseSlide"
        chips={[
          { label: "React" },
          { label: "Tailwind", accent: true },
        ]}
        tags={["Chipy", "Tagi", "Screenshot"]}
        note="Dwie kolumny: tekst + obraz"
        image={assets("background.png")}
        alt="Przykład split"
      />
    ),
  },
  {
    id: "code",
    render: (active) => (
      <CodeSlide
        active={active}
        act="components"
        label="Terminal"
        width="mid"
        footer={<>Szerokości: <Em>narrow</Em>, <Em tone="accent2">mid</Em>, wide</>}
      >
        <span className="cm">$</span> <span className="hl2">npm</span> run build
        <br />
        <span className="cm"># Gotowe w 1.2s</span>
      </CodeSlide>
    ),
  },
  {
    id: "list",
    render: (active) => (
      <ListSlide
        active={active}
        act="components"
        label="Lista"
        labelTone="accent2"
        title="ListSlide — bullets i checklisty"
        items={[
          "Zwykły bullet point",
          "Drugi element listy",
          { content: "Element z ptaszkiem", check: true },
          { content: "Kolejny check", check: true },
        ]}
        footer={<>Opcjonalny <Em>footer</Em> pod listą</>}
      />
    ),
  },
  {
    id: "quote",
    render: (active) => (
      <QuoteSlide
        active={active}
        act="components"
        quote="Dobry cytat mówi więcej niż slajd pełen tekstu."
        cite="— Anonimowy prezenter"
      />
    ),
  },
  {
    id: "number",
    render: (active) => (
      <NumberSlide
        active={active}
        act="components"
        value="42"
        label="Wielka liczba z animacją pop-in"
        tone="gradient"
        note="Dostępne tony: accent, accent2, warm, positive, negative, gradient"
      />
    ),
  },
  {
    id: "insight",
    render: (active) => (
      <InsightSlide
        active={active}
        act="components"
        number="01"
        tone="accent"
        tag="Obserwacja"
        title="InsightSlide z Compare"
      >
        <Compare vs centered>
          <CompareCol>
            <Stat value="95%" label="Przed" tone="warm" />
          </CompareCol>
          <CompareCol>
            <Stat value="42%" label="Po" tone="positive" />
          </CompareCol>
        </Compare>
      </InsightSlide>
    ),
  },
  {
    id: "skill",
    render: (active) => (
      <SkillTheorySlide
        active={active}
        act="components"
        demo="Demo skill"
        command="/example-command"
        title="SkillTheorySlide"
        tone="accent2"
        points={[
          "Punkt teorii numer jeden",
          "Drugi punkt z kontekstem",
          "Trzeci — podsumowanie",
        ]}
        launch="Opis uruchomienia skilla"
      />
    ),
  },
  {
    id: "table",
    render: (active) => (
      <TableSlide
        active={active}
        act="data"
        title="TableSlide — dane tabelaryczne"
        head={
          <tr>
            <th>#</th>
            <th>Nazwa</th>
            <th>Wynik</th>
            <th>Koszt</th>
          </tr>
        }
        footer="Elastyczne stylowanie komórek przez JSX children"
      >
        <tr>
          <td className="accent2">1</td>
          <td><strong>Model Alpha</strong></td>
          <td className="positive">92.5</td>
          <td>$0.03</td>
        </tr>
        <tr>
          <td className="accent2">2</td>
          <td><strong>Model Beta</strong></td>
          <td className="positive">88.1</td>
          <td>$1.20</td>
        </tr>
        <tr>
          <td className="accent2">3</td>
          <td><strong>Model Gamma</strong></td>
          <td className="warm">71.3</td>
          <td>$5.40</td>
        </tr>
      </TableSlide>
    ),
  },
  ...[1, 2, 3].map((step) => ({
    id: `steps-${step}`,
    render: (active) => (
      <StepsSlide
        active={active}
        act="data"
        step={step}
        title="StepsSlide — progresywne odsłanianie"
        items={[
          { icon: "🎯", title: "Cel", desc: "Zdefiniuj co chcesz osiągnąć" },
          { icon: "🔧", title: "Narzędzia", desc: "Wybierz odpowiedni stack" },
          { icon: "🚀", title: "Start", desc: "Uruchom i iteruj" },
        ]}
      />
    ),
  })),
  {
    id: "card-grid-text",
    render: (active) => (
      <CardGridSlide
        active={active}
        act="data"
        title="CardGridSlide — tekst (4 kolumny)"
        items={["React", "Svelte", "Vue", "Angular", "Astro", "Next.js", "Nuxt", "Remix"]}
        footer={<>Od <Em tone="positive">open source</Em> po <Em tone="accent">framework</Em></>}
      />
    ),
  },
  {
    id: "card-grid-icons",
    render: (active) => (
      <CardGridSlide
        active={active}
        act="data"
        title="CardGridSlide — ikony (2 kolumny)"
        columns={2}
        items={[
          { icon: "📦", label: "Kontener" },
          { icon: "🔒", label: "Izolacja" },
          { icon: "🌐", label: "Sieć" },
          { icon: "📊", label: "Metryki" },
        ]}
      />
    ),
  },
  {
    id: "scorecard",
    render: (active) => (
      <ScorecardSlide
        active={active}
        act="data"
        title="ScorecardSlide — kryteria oceny"
        columns={[
          {
            tone: "accent2",
            icon: "⚙",
            title: "Automatyczne",
            subtitle: "CI/CD pipeline",
            items: [
              { num: "01", label: "Build" },
              { num: "02", label: "Testy" },
              { num: "03", label: "Lint" },
            ],
          },
          {
            tone: "warm",
            icon: "◎",
            title: "Manualne",
            subtitle: "Ocena człowieka",
            items: [
              { num: "04", label: "UX" },
              { num: "05", label: "Dostępność" },
            ],
            startIndex: 4,
            meta: <p>Pass threshold: <Em tone="positive">70</Em>/100</p>,
          },
        ]}
      />
    ),
  },
  {
    id: "table-grouped",
    render: (active) => (
      <TableSlide
        active={active}
        act="data"
        title="Kompozycja inline — grupowane wiersze"
        head={
          <tr>
            <th>Kategoria</th>
            <th>Wartość A</th>
            <th>Wartość B</th>
          </tr>
        }
        footer="Przykład inline composition z TableSlide jako shell"
      >
        <tr>
          <td colSpan={3}><Em tone="positive">Grupa 1</Em></td>
        </tr>
        <tr>
          <td>Element X</td>
          <td className="positive">82.5</td>
          <td className="positive">79.0</td>
        </tr>
        <tr>
          <td colSpan={3}><Em tone="accent2">Grupa 2</Em></td>
        </tr>
        <tr>
          <td>Element Y</td>
          <td className="warm">65.1</td>
          <td className="positive">71.2</td>
        </tr>
      </TableSlide>
    ),
  },
  {
    id: "closing",
    render: (active) => (
      <TitleSlide
        active={active}
        act="closing"
        title={<>Koniec <Em gradient>showcase</Em></>}
        meta="19 komponentów · system.jsx"
      />
    ),
  },
];
