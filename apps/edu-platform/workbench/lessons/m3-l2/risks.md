# Od planu do testów: implementacja unitów z Agentem

Zanim napiszesz pierwszy test z agentem, warto być świadomym jednej rzeczy: pisanie testów to akurat ten obszar pracy z AI, w którym najłatwiej dać się oszukać.

Start zawsze wygląda świetnie. Prosisz model o testy do wybranych funkcji, dostajesz nową porcję kodu, zielony raport, no i coverage, który skacze w górę. Łatwo uwierzyć, że to działa.

Problem w tym, że syntetyczne testowanie prostych funkcji nie jest tym, co pomaga realnie zarządzać ryzykiem w projekcie. Do tego, sprawność agentów w kwestii testów znacznie się pogarsza, jeśli twoje funkcje nie są tak typowe jak te, które modele widziały w swoich danych treningowych.

Pierwszy z brzegu przykład. W pracy *Benchmarking LLMs for Unit Test Generation from Real-World Functions* (Huang i in., *ACM TOSEM* 2026) badacze najpierw zmierzyli jakość generowanych testów na popularnym benchmarku TestEval - i wyszło świetnie. Potem podmienili funkcje wsadowe na realne, złożone przypadki z prawdziwych projektów, bez tych dwóch ułatwień, i powtórzyli pomiar. Pokrycie spadło mniej więcej o połowę: z ~92% do ~45% linii i z ~82% do ~30% gałęzi.

To powtarza się w wielu innych obszarach programowania z AI - wynik z benchmarku nie przenosi się automatycznie na twój projekt.

Dlaczego tak się dzieje? Bo najtrudniejsza część testu to nie wygenerowanie kodu, tylko decyzja o tym, jaki test realnie wpłynie na jakość całego projektu. W badaniach nazywa się to problemem wyroczni (ang. *oracle problem*) i to w nim, a nie w składni, siedzi większość błędów w testach pisanych przez LLM-y.

Weźmy prostą funkcję z aplikacji do fiszek - taką, która wylicza odstęp do kolejnej powtórki karty:

```ts
  // grade: 0 = nie pamiętam, 1 = słabo, 2 = dobrze
function getNextInterval(prevInterval: number, grade: number): number {
  return prevInterval * grade;
}
```

Na pierwszy rzut oka widać jedno: wynik to `prevInterval * grade`. Model napisze więc asercję wprost na tym wzorze - `getNextInterval(10, 2)` ma zwrócić `20`. Test przejdzie na zielono.

Czego w kodzie nie widać? Reguły biznesowej i buga. Kiedy uczeń nie pamięta karty (`grade` równy 0), odstęp powinien zresetować się do jednego dnia - a nie spaść do zera, bo zero oznacza kartę, która już nigdy nie wróci do nauki. Funkcja ma tu błąd, ale model go nie zobaczy: zobaczy tylko, że dla `grade` równego 0 wychodzi `0`, i taką asercję zapisze.

Model odwzorował to, co kod *robi*. Tego, co kod *powinien robić*, nie dało się wyczytać z samej implementacji - a to właśnie ono jest sednem testu.

Stąd dwa wnioski, na których stoi cała ta lekcja:

- **Duży wskaźnik pokrycia testami nie jest dowodem ochrony.** Badania konsekwentnie pokazują, że pokrycie kodu słabo koreluje z realnym wykrywaniem błędów. Zielony pasek mówi tylko, że linia się wykonała - nie, że asercja miała jakikolwiek sens.
- **Naiwne promptowanie to za mało.** Testy, które faktycznie chronią kod, biorą wynikają z analizy ryzyk, właściwego kontekstu i starannej dbałości o ich optymalną liczbę. Ani za mało, ani za dużo.

Na szczęście mamy już dobre fundamenty. W poprzedniej lekcji uzyskaliśmy Test Plan - to kontrakt jakościowy projektu, zawierający mapę ryzyk i opis fazowego wdrażania usprawnień, a także posiadający wiedzę o cyklu `/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement` do realizacji zmian. To był ważny krok, choć sama mapa to dopiero początek przygody.

## Vibe Testing, czyli jak nie wprowadzać testów

Kolejny krok może teraz wyglądać tak:

```text
Read context/foundation/test-plan.md and write tests for the auth module.
```

Osadzenie tego prompta w planie daje nam korzyść w postaci skupienia na konkretnych, uzyskanych wcześniej ryzykach. To oszczędność czasu i szansa na pracę nad obszarem, który naprawdę się liczy.

Problem polega na tym, że takie testy testy często sprawdzają kształt aktualnej implementacji, a nie istotne dla użytkownika zachowanie, wynikające choćby z szerszej dokumentacji.

Zobacz uproszczony przykład:

```ts
it("authenticates user", async () => {
  const result = await authenticate(input);

  expect(result).toEqual(await authenticate(input));
});
```

To wygląda jak test, ale nie chroni prawie niczego. Asercja pyta funkcję, co zwróciła, a potem sprawdza, czy zwróciła to, co zwróciła.

W praktyce testy generowane przez najlepsze modele AI są zwykle mniej karykaturalne, ale mechanizm zostaje ten sam. Można to opisać na trzech klasach problemów:

| Antywzorzec | Jak wygląda | Co powinno się wydarzyć |
|---|---|---|
| Mirror implementacji | Test sprawdza wywołanie wewnętrzne, prywatny szczegół albo wynik wyliczony tą samą logiką co cały moduł. | Test opisuje obserwowalne zachowanie i oczekiwany wynik scenariusza biznesowego. |
| Happy paths | Agent tworzy łatwe testy na poprawnych danych. | Pojawia się przynajmniej jeden edge case wynikający z ryzyka. |
| Brak przypadków brzegowych | Brakuje okazjonalnego wpuszczenia `null'a`, pustych danych, błędów środowiska albo niekompatybilności bibliotek. | Test łapie przypadek, który realnie mógłby uszkodzić doświadczenie użytkownika. |

Stąd dwa konkretne wymagania wobec całego procesu: daj agentowi **konkretne wejście (opis, dane lub scenariusz) związane z ryzykiem** (inaczej test nie dotknie groźnej ścieżki) i **osobno zweryfikuj asercję** (bo to ona jest najczęstszym słabym punktem).