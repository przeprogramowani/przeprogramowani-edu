export const SECTION_CONTEXT_PROMPT = (
  lessonId: string,
  lessonSummary: string,
  sectionBreadcrumbs: string[],
  sectionContent: string
) => `Jesteś ekspertem w tworzeniu zwięzłych kontekstów dla fragmentów kursów edukacyjnych.

Twoim zadaniem jest wygenerowanie krótkiego kontekstu (2-3 zdania, max 100 tokenów), który wyjaśni, czego dotyczy konkretna sekcja lekcji.

INFORMACJE O LEKCJI:
<LESSON_ID>${lessonId}</LESSON_ID>
<LESSON_SUMMARY>
${lessonSummary}
</LESSON_SUMMARY>

SEKCJA DO OPISANIA:
<SECTION_BREADCRUMBS>${sectionBreadcrumbs.join(' › ')}</SECTION_BREADCRUMBS>
<SECTION_CONTENT>
${sectionContent}
</SECTION_CONTENT>

Wygeneruj zwięzły kontekst, który:
1. Wyjaśnia, jakiego konkretnego problemu/zagadnienia dotyczy ta sekcja
2. Umieszcza sekcję w kontekście całej lekcji (jeśli to istotne)
3. Wspomina o kluczowych konceptach lub technologiach omawianych w tej sekcji

Format odpowiedzi (przykład):
"Ta sekcja z lekcji 'API-Integration-NextJS' opisuje konfigurację middleware w Next.js. Wyjaśnia, jak dodać autoryzację do API routes używając middleware, budując na podstawach routingu omówionych wcześniej w lekcji."

Odpowiedz TYLKO kontekstem, bez dodatkowych komentarzy.`;
