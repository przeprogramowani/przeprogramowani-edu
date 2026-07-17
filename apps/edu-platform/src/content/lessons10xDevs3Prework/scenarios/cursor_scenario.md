# Cursor — Podstawy operacyjne | Scenariusz wideo


## 1. Co to jest Cursor

Cześć, w tym filmie pokażę ci podstawy pracy z Cursorem - środowiskiem umożliwiającym programowanie z AI.

Celowo mówię dzisiaj o środowisku a nie stricte edytorze kodu, bo Cursor już kilka razy przechodził istotną ewolucję sposobu pracy ze sztuczną inteligencją - na początku mieliśmy podpowiedzi i modyfikacje lokalne, następnie Cursor Composera który pracował bardziej przekrojowo, a od wersji 3.0 mamy Cursora jako centrum sterowania wieloma agentami.

W tym filmie pokaże ci klasycznego Cursora jako edytor kodu z Agentem AI, a w lekcji o Agent-Native IDE zobaczysz zupełnie nowy workflow z Cursora 3.0.

---

## 2. Instalacja

Cursora pobierzesz ze strony `cursor.com/downloads` — dostępny jest na systemy macOS, Windows i Linuxa.

Podobnie jak w przypadku innych narzędzi AI, na dzisiaj subskrypcja darmowa to niestety wyłącznie tryb demo - nie nadaje się do rzeczywistej pracy.

Do testów polecamy subskrypcję Pro, a więcej komfortu w codziennej pracy da Pro+ za `60$ za miesiąc`.

W ramach każdej subskrypcji masz co najmniej 3 sposoby wykorzystywania limitów w zależności od modelu AI:

- Auto - dynamiczne dobieranie modeli na podstawie kontekstu i zadań
- Composer - autorski model Cursora do codziennego programowania, oparty o model Kimi K2.5

Oba tryby wykorzytują tzw. "hojne limity wbudowane" - jakkolwiek decyduje o tym Cursor. Natomiast sam koszt subskrypcji to budżet, jaki możesz wykorzystać na tzw. "API models" - wybór konkretnego modelu AI od dostawcy, np. Opus czy GPT-5.4 - stawki wg planów danego dostawcy.

Cursor rekomenduje start pracy na trybie Auto łączonym z modelem Composer i przechodzenie na droższe modele dopiero wtedy, kiedy to konieczne.

## 3. Ustawienia

Najnowsza wersja Cursora może wyglądać nietypowo - to właśnie widok z wersji 3.0 do sterowania agentami. Aby przejść do klasycznego edytora kliknij ctrl/shift/n aby zobaczyć nowe okno i klasyczny edytor kodu z bocznym panelem dla Agentów.

Po otwarciu warto uruchomić paletę komend - ctrl shift p i wybrać Cursor Settings - musisz wiedzieć, że obok standardowych ustawień edytora Cursor utrzymuje niezależny widok na konfigurację pracy z AI.

W ustawieniach, w zakładce General na start dwie kwestie - po pierwsze jeśli korzystasz z VS Code, możesz sklonować swoje ustawienia tym przyciskiem.

Po drugie - ważna rzecz - tryb prywatności. Na dzisiaj mamy 3 opcje

- share data - udostępniasz kod i aktywność twórcom Cursora - w setupie komercyjnym absolutnie odradzamy
- privacy mode - brak zgody na dzielenie się kodem pod trening AI, ale możliwość wysyłania kodu do chmury Cursora na rzecz tzw. Background Agents - o tym dedykowana lekcja w 10xDevs
- privacy mode (legacy) - najbardziej bezpieczna opcja na start, czyli brak zgody na trening modeli na twoim kodzie oraz wyłączenie usług chmurowych

Ja zostaję właśnie z tym ostatnim trybem.

## 4. Skuteczność pracy z AI

W ustawieniach warto również poznać zakładkę Indexing and Docs.

Cursor, w momencie pierwszego załadowania projektu, buduje indeks, lub bazę danych tzw. embeddingów. Można powiedzieć, że są to takie referencje do zawartości plików w projekcie w formacie zrozumiałym dla modeli AI.

Cursor wykorzystuje te embeddingi do wyszukiwania plików i kodu w projekcie z wykorzystaniem języka naturalnego - kiedy np. napiszesz prompta - "zlokalizuj moduł autentykacji", właśnie na podstawie embeddingów Cursor będzie w stanie znaleźć odpowiednie pliki i kod.

W przypadku większych projektów i częstych zmian na plikach Indeks może nie być zsynchronizowany z bieżącym stanem projektu - kiedy więc widzisz, że Cursorowy Agent zaczyna gubić się w projekcie, zerknij do tej zakładki, sprawdź gotowość indeksu lub wymuś jego ponowne zbudowanie.

Aby z kolei wyłączyć pliki z procesu indeksowania i referencji AI, możemy użyć pliku `.cursorignore` oraz `.cursorindexingignore` - dziedziczą one zasady z głównego pliku `.gitignore`.

## 5. Tryby pracy

W przypadku samej pracy z AI Cursor oferuje kilka trybów pracy.

Po pierwsze inline edit - zaznaczamy fragment kodu który trafia do kontekstu, piszemy polecenie do AI i zatwierdzamy. Zamian wdrażana jest na poziomie zaznaczenia.

W tym trybie możemy również zmienić format oczekiwanej odpowiedzi i zamiast zmiany, możemy otrzymać tekstowy opis tak jakby odpowiadał nam chatbot - to przydatne np. do luźnych rozmów o kodzie.

W Cursorze, o czym nie każdy wie, AI działa też w terminalu - w aktywnym oknie możemy nacisnąć cmd+K i napisać, jakiego rodzaju komendę chcielibyśmy wygenerować. W odpowiedzi AI da nam gotowe polecenie do wykonania - przydatne dla tych, którzy nie uczyli się na pamięć poleceń unixa czy powershella.

No i oczywiście najbardziej sprawczy i autonomiczny tryb - Agent. Tutaj AI samo znajduje odpowiednie pliki, edytuje je, uruchamia testy i pokazuje gotowego diffa do akceptacji. Na koniec dostajemy naprawdę przystępny widok Code Review, gdzie możemy ocenić wszystkie zmiany i je akceptować lub odrzucać. Precyzyjną konwersację będą wspierać referencje do plików i folderów, które dodasz przy pomocy znaku `@`.

Tryb Agenta to będzie nasz domyślny tryb pracy w 10xDevs, co poznamy głęboko na przekroju całego szkolenia.

## 6. Reguły projektu

Ostatni element we wprowadzeniu to reguły projektu. To instrukcje i oczekiwania, które mogą dotyczyć sposobu wykorzystywania twojego frameworka, konwencji zespołwoych, architektury projektu itp.

Bazowe instrukcje możesz umieścić w pliku `AGENTS.md` - będą one dodawane do kontekstu przy każdej sesji.

Bardziej precyzyjne reguły możesz umieścić w folderze `.cursor/rules/` - tutaj tworzysz bardziej atomowe zasady, np. pisania kodu .NET, Java czy React, które albo dołączać ad-hoc, albo wskazujesz przy jakich rozszerzeniach plików mają być używane automatycznie.

O regułach będzie mowa w dalszej części szkolenia - już teraz możesz odwiedzić stronę 10xRules.ai aby poznać przykładowe reguły dla AI.

---

##

To tyle w tym krótkim wprowadzeniu do Cursora. W ramach 10xDevs poznasz jego praktyczne zastosowanie — omówimy zaawansowane strategie kontekstu, kaskadowe reguły projektowe, dobór modeli pod konkretne zadania i integrację z innymi narzędziami w twoim workflow. To wszystko czeka na ciebie już w pierwszym module, który startuje niebawem.
