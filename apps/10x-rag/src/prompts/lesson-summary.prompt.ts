export const LESSON_SUMMARY_PROMPT = (
  otherLessonTitles: string[],
  lessonId: string,
  preview: string
) => `Jesteś ekspertem w tworzeniu streszczeń lekcji w formacie pytań, na które odpowiedzi znajdują się w docelowej lekcji.

Budujesz streszczenie dla lekcji o nazwie:

<LESSON_TITLE>${lessonId}</LESSON_TITLE>

Na podstawie załączonej poniżej treści lekcji LESSON_CONTENT wygeneruj streszczenie w formie 5-10 bullet-pointów jako pytań, na które odpowiedzi znajdują się w docelowej lekcji. Wypisuj wyłącznie fragmenty o jawnie instruktażowym, precyzyjnym charakterze. Ignoruj zapowiedzi lub dygresje oraz materiały ogólne.

Przykład:

1) W jakim folderze umieścić instrukcje dla AI w edytorze Cursor
2) Jak zaplanować schemat bazy danych z AI
3) Co umieścić w pliku .cursorrules
4) Jak integrować Agenta AI w procesie CI/CD
5) Jakie są wady obecnej generacji modeli AI

Oto treść lekcji:

<LESSON_CONTENT>
${preview}
</LESSON_CONTENT>

Zawartość wygenerowanego streszczenia nie powinna nachodzić na pozostałe lekcje w sekcji OTHER_LESSON_TITLES, których tytuły znajdziesz poniżej. Przykładowo - jeśli chcesz wypisać "jak działają reguły dla AI", a poniżej jest dedykowana lekcja na ten temat, nie wypisuj jej w streszczeniu.

<OTHER_LESSON_TITLES>
${otherLessonTitles}
</OTHER_LESSON_TITLES>
`;
