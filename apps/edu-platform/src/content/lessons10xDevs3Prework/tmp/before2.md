# LLMy i ich wpływ na codzienną pracę programisty

Otwierasz okno Cursora lub terminala z Claude Code, wklejasz potężny zrzut logów z błędem z produkcji, załączasz pięć klas, które "mogą mieć coś z tym wspólnego" i prosisz o naprawę. Po kilkunastu sekundach otrzymujesz pewny siebie, świetnie sformatowany diff, który po zaufanym i błyskawicznym wdrożeniu wywala resztę aplikacji. Frustracja w takich momentach najczęściej wynika z błędnego założenia architektonicznego z naszej strony: wciąż traktujemy model jak młodszego programistę, który "ma gorszy dzień" lub po prostu "zapomniał o kontekście" z początku konwersacji. Aby przestać walczyć z AI i realnie wykorzystać jej potencjał inżynieryjny, musimy odczarować narzędzie. Musimy spojrzeć na nie chłodno jako na bezlitosny system probabilistyczny o twardych, mierzalnych ograniczeniach, w którym zasób wejściowy ma swoją ścisłą cenę i w którym halucynacja to nie wypadek przy pracy, ale rdzeń całego procesu.

## Przewidywanie, a nie rozumienie 

Podstawowym grzechem w codziennej integracji AI w cykl rozwoju oprogramowania jest antropomorfizacja interakcji z modelem. Kiedy **modele wiodące** (frontier models) takie jak GPT-4o czy Claude 3.5 Sonnet generują kod w twoim IDE, w rzeczywistości nie wykonują one logicznej weryfikacji architektury. Wykonują one ciągłą, masywną operację **next-token prediction** (przewidywania kolejnego tokena). Baza wag sieci neuronowej to gargantuiczna, złożona maszyna korelacyjna, która decyduje, jaki fragment tekstu i składni statystycznie najlepiej pasuje jako bezpośrednia kontynuacja wrzuconego przez ciebie promptu (wejścia). 

Model w swojej pierwotnej warstwie pre-treningu nie posiada wbudowanego mentalnego obrazu twojego oprogramowania, nie wie czym jest transakcyjność bazy danych i nie odczuwa dysonansu poznawczego, gdy generuje kod, który narusza reguły SOLID. Jego wyłącznym matematycznym zadaniem jest zminimalizowanie błędu predykcji na ogromnym korpusie, na którym był szkolony. 

Z praktycznego punktu widzenia oznacza to, że **halucynacje** – czyli zmyślanie istnienia funkcji, flag konfiguracyjnych API czy odwoływanie się do nieistniejących zależności – nie są uciążliwym bugiem oprogramowania. Są one nieodłączną właściwością bycia systemem opartym na rozkładzie prawdopodobieństwa. Zespół OpenAI wprost podkreśla w swoich analizach z jesieni 2025 roku dotyczących mechaniki halucynacji: sama architektura treningowa bezwzględnie promuje gładkość, pewność siebie oraz gramatyczną płynność generowanego tekstu ponad faktyczną inżynieryjną poprawność i uziemnioną logikę. Model jest tak skalibrowany, aby zawsze wyprodukować najbezpieczniejszy kontynuacyjny kształt, nie zostawiając cię z milczeniem lub w błędzie.

Praktyczny wniosek: płynny i wysoce poprawny składniowo język wypowiedzi w edytorze nie dowodzi żadnej logiki kodu. Zmyślony fragment logiki może idealnie odwzorowywać konwencje nazewnicze `camelCase` twojego repozytorium, budując fałszywe poczucie perfekcji. Weryfikacja kodu przez uruchomienie build pipeline, zapięcie mocnych asercji w testach czy manualny audyt nie jest zaledwie dobrą radą operacyjną dla wrażliwych systemów – to twardy etap, który przekształca probabilistyczny ciąg znaków w poprawną aplikację.

## Kontekst to nie śmietnik (anatomia Context Rot)

Mając świadomość potężnej korelacji, z jaką model układa kod z podanych elementów, programiści dochodzą do intuicyjnego wniosku: skoro wyjście modelu wynika ze wsadzonych danych (ang. *context window*, okno kontekstowe), należy zasilić je w największym możliwym stopniu. Ładujemy więc do pojedynczego okna kilkadziesiąt plików źródłowych całego mikroserwisu, pliki migracyjne bazy danych i 30 stron logów z nadzieją, że model "zrozumie cały pełny obraz". Niestety, mechanizm percepcji w długim oknie brutalnie penalizuje taką strategię.

Prawda o przetwarzaniu ogromnego wejścia jest inna: wkładanie zanieczyszczonego bagażu niszczy zdolności dedukcyjne sieci. Zjawisko to w lipcu 2025 roku precyzyjnie zmapowali Kelly Hong i Anton Troynikov z TryChroma, nazywając je **Context Rot** (degradacja kontekstu). Po przeanalizowaniu wydajności czołowych modeli odkryli oni barierę nazywaną **MECW** (Maximum Effective Context Window). Przekroczenie granicy MECW sprawia, że zdolność modelu do dokładnego wyłuskania ważnej "igły ze stogu siana" (ang. *NIAH*, needle-in-a-haystack) w trakcie pozyskiwania (retrieval) drastycznie się załamuje – w niektórych pomiarach niemal natychmiastowo o 50-70%. 

To, że nowoczesny model asertywnie informuje o 2 milionach limitu tokenów nie definiuje absolutnie faktu, iż poprawnie i logicznie uwzględni wskazówki zakopane gdzieś na jego setnej stronie. Degradacja wynika ze sprzętowych optymalizacji takich jak zjawisko **U-shaped attention** (atencja w kształcie litery U) uwikłane w kompresję **KV cache** (key-value cache) – model posiada największe skupienie uwagi na samych początkach podanych wskazówek oraz na ostatnich linijkach czatu, systematycznie gubiąc i rozmywając najcięższą logikę umiejscowioną w środku ogromnego bloku wejścia.

Zobrazujmy zjawisko Context Rot, patrząc na mechanikę pozyskiwania właściwej wiedzy ze zbioru danych podawanego modelowi:

```mermaid
graph TD
    A["Faza 1: Precyzyjny chirurg<br/>(1-5 plików, < 20K tokenów)"] -->|"Focus 95%+, uwaga wyostrzona"| B("Szybkie rozwiązania, perfekcyjne diffy<br/>Weryfikacja lokalna i natychmiastowa")
    
    A --> C["Faza 2: Cień wiedzy<br/>(20-30 plików, 60K tokenów)"]
    C -->|"U-shaped attention ignoruje wnętrze"| D("Model omija zastrzeżenia domenowe,<br/>rekomenduje wycofane frameworki")
    
    C --> E["Faza 3: Context Rot / Próg MECW<br/>(Cały projekt, logi, dump db, 150K+ tokenów)"]
    E -->|"Pełne probabilistyczne rozmycie"| F("Poważne halucynacje, niezdolność odtworzenia stanu,<br/>brak pamięci o poprzednim zapytaniu")

    style A fill:#0d3320,stroke:#22c55e,color:#e2e8f0
    style B fill:#0d3320,stroke:#22c55e,color:#e2e8f0
    style C fill:#332b00,stroke:#eab308,color:#e2e8f0
    style D fill:#332b00,stroke:#eab308,color:#e2e8f0
    style E fill:#3b0f0f,stroke:#ef4444,color:#e2e8f0
    style F fill:#3b0f0f,stroke:#ef4444,color:#e2e8f0
```

Ten wykres definiuje jedyną słuszną formę pracy – długość kontekstu to twoja najcenniejsza waluta budżetowa, wydawaj ją precyzyjnie z zegarmistrzowską dokładnością. Prawdziwa ergonomia pracy agentowej zmusza do podawania stricte tego i tylko tego pliku, na którym chcemy dokonać operacji w ciągu najbliższych kilku sekund. Im węższy stan załączysz agentowi, tym głębsza jakość zostanie dostarczona i tym niższe prawdopodobieństwo zmierzenia się z cichym, wdrożeniowym błędem po drugiej stronie korelacji okna Context Rot.

## Budżetowanie i koszt ukrytego myślenia

Zderzając mechanikę halucynacji z twardymi obostrzeniami MECW, na ratunek inżynierii wezwano całkowicie inną, cięższą architekturę wnioskowania zwaną **modelami rozumującymi** (reasoning models), takimi jak OpenAI o1/o3 oraz Anthropic z włączonym **extended thinking** (rozszerzonym myśleniem). Mechanizm takich modeli wymusił przesunięcie kolosalnych obciążeń obliczeniowych z ogólnego zaplecza przedtreningowego prosto pod ciężar zapytań użytkownika na żywo – jest to nowa szkoła zwana **inference-time compute** (obliczenia na etapie wnioskowania). 

Mechanizm rozumowania zakłada powstrzymanie instynktu do natychmiastowej statystycznej odpowiedzi. W to miejsce model konstruuje skomplikowany logarytm założeń budując **CoT** (chain-of-thought, łańcuch myśli). Posiada on możliwość samokorekty i cofnięcia się w obrębie zadania operując tysiącami **hidden tokens** (ukrytych tokenów), dokonując wewnętrznej walidacji czy jego propozycja modyfikacji architektury bazy jest w pełni bezpieczna zanim w ogóle przystąpi do generowania widocznego dla użytkownika słowa. Daje to kolosalną zdolność rozwiązywania zagadek programistycznych z poziomu staff-developera, zmuszając agenta do odtwarzania warunków ślepych zaułków, na których poległy klasyczne iteracje modeli.

Ta gigantyczna władza pociąga za sobą równie gigantyczny kompromis operacyjny i czysto finansowy: każdy z wirtualnych "oddechów myślenia" jest bezwzględnie wliczany do rachunku zużycia i taryfikowany w tokenach generacji jak realnie zwrócony znak.

Aby lepiej to pokazać w realnych warunkach, uruchom w swojej konsoli skrypt dla wymuszenia myślenia przez API do rozwiązania bardzo złożonego wielowątkowego wyścigu dostępu (ang. *race condition*):

```python
import anthropic

client = anthropic.Anthropic()

# Tworzymy zapytanie wysokiego poziomu niepewności
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        # Narzucasz surowy budżet: przydziel 12 tysięcy z 20 na ukryte tokeny walidacyjne 'myślenia'
        "budget_tokens": 12000 
    },
    messages=[
        {"role": "user", "content": "Odrestauruj spójność danych po awarii klastra bazy z ubiegłej nocy na podstawie pięciu załączonych stack-trace'ów..."}
    ]
)
# Wynik zapięcia 12K ukrytych tokenów może podnieść poprawność o kilkadziesiąt procent,
# jednak zapłacisz za rachunek inferencji potrójną stawkę bazową
```

Wykorzystanie i zrozumienie tak zaawansowanych możliwości musi odbywać się przez matrycę opłacalności. Modele "myślicieli" (reasoning) są znakomitymi planerami, twardymi detektywami do obłędnych regresji czy architektami przy decyzjach o wymianie frameworka – świetnie działają w warunkach zerowej informacji początkowej. Tymczasem do typowej redakcji klas, powielania schematu komponentu w React, doklejania stylów CSS czy mapowania generyków w TypeScript, klasyczne modele natychmiastowe zachowują prym rynkowy z racji taniości, szybkości oraz wystarczającej do weryfikacji powtarzalności. Inżynier, który powierza modele "workhorses" do ciężkiej analizy napotka w ścianę atencji Context Rot, a angażujący "thinkera" do refaktoryzacji formatowania pętli – drastycznie zutylizuje miesięczny rachunek cloud computing za niepotrzebne tokeny CoT.

## Co warto wiedzieć

- **Traktuj pojemność okna kontekstowego jako limitowany budżet w czystej gotówce, nie garaż na graty.** Dodawaj pliki do rozmowy z agentem pęsetą chirurgiczną, zawężając dyskusję tylko do logiki obsługiwanej w tym konkretnym ułamku minuty. Jeśli dostarczasz agentowi nieczytany od lat kod legacy, narażasz cały przebieg sesji na uderzenie gwałtownego fenomenu degradacji i drastyczne wdrożeniowe ryzyko pomyłki.
- **Ufaj intencji agenta wyłącznie do granic edytora kodu, asertywnie weryfikując architekturę po przeciwnej stronie.** Odpowiedzi probabilistyczne bez gwarancji logiki matematycznej oznaczają, że dostarczony przez sieć diff staje się udowodnioną regułą inżynierską dopiero po przelaniu przez zaporę asercji, rygorystyczne unit testy i audyt na gałęzi. Jeśli brakuje twardych weryfikowalnych dowodów na pomyślny wsad – załóż obecność halucynacji pod pokrywką optymalnie brzmiącej wymowy.
- **Dopasuj siłę i wagę silnika wnioskującego do poziomu głębi zadania.** Jeżeli wznosisz całkowicie nowy paradygmat operacyjny swojego serwisu lub redefiniujesz mapowania mikroserwisów o dużej niepewności – wymuś pełne rezerwy extended thinking dla głębokiej izolacji CoT. Kiedy jednak musisz ułożyć rutynowy szkielet nowej klasy domenowej – deleguj to w sekundę tanim workhorse'om bez płacenia haraczu za gigantycznie ukryte tokeny myślowe.

## Źródła

- Dlaczego modele sztucznej inteligencji bywają w błędzie i powody halucynacji (Why language models hallucinate) / OpenAI / 2025-09-05 — https://openai.com/index/why-language-models-hallucinate/
- Wnioskowanie i zasady operacyjne w oparciu o modele rozszerzone (Reasoning best practices) / OpenAI API Docs / 2026 — https://developers.openai.com/api/docs/guides/reasoning-best-practices
- Okno kontekstowe w modelach Claude (Context windows) / Anthropic Docs / 2026 — https://docs.anthropic.com/en/docs/build-with-claude/context-windows
- Zarządzanie ukrytym myśleniem (Building with extended thinking) / Anthropic Docs / 2025 — https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
- Degradacja wiedzy w długim oknie: badanie na modelach wiodących (Context Rot: How Increasing Input Tokens Impacts LLM Performance) / Kelly Hong, Anton Troynikov, Jeff Huber / 2025-07-14 — https://www.trychroma.com/research/context-rot