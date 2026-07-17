<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    buildPreworkQuizResult,
    getPreworkQuizIntro,
    getPreworkQuizQuestions,
    PREWORK_COURSE_SLUG,
    PREWORK_PATH_QUIZ_SLUG,
    type PreworkQuizAnswers,
    type PreworkQuestionId,
    type PreworkQuizResult,
    type PreworkQuizQuestion,
    type QuizLanguage,
  } from '@/lib/quiz/10x-devs-3-prework';

  interface StoredQuizResult {
    answers: PreworkQuizAnswers;
    result: PreworkQuizResult;
  }

  interface Props {
    language: QuizLanguage;
  }

  const { language }: Props = $props();
  const questions = getPreworkQuizQuestions(language);
  const copy = getPreworkQuizIntro(language);
  const storageKey = `quiz-result:${PREWORK_COURSE_SLUG}:${PREWORK_PATH_QUIZ_SLUG}:${language}`;
  const neutralQuestionIds = new Set<PreworkQuestionId>(['agentEnvironment', 'cursorIntro', 'claudeIntro']);

  let answers = $state<PreworkQuizAnswers>({});
  let result = $state<PreworkQuizResult | null>(null);
  let loading = $state(true);
  let syncWarning = $state(false);
  let showForm = $state(false);
  let resultHeading: HTMLHeadingElement | undefined = $state();

  const allSingleQuestionsAnswered = $derived(
    questions
      .filter((question) => question.type === 'single')
      .every((question) => typeof answers[question.id] === 'string')
  );
  const hasSubmittedResult = $derived(!!result && !showForm);
  const headingTitle = $derived(hasSubmittedResult ? copy.completedTitle : copy.title);
  const headingDescription = $derived(hasSubmittedResult ? copy.completedDescription : copy.description);

  onMount(async () => {
    const localResult = loadLocalResult();
    if (localResult) {
      answers = localResult.answers;
      result = localResult.result;
    }

    try {
      const response = await fetch(
        `/api/quiz-result?courseSlug=${PREWORK_COURSE_SLUG}&quizSlug=${PREWORK_PATH_QUIZ_SLUG}&language=${language}`
      );

      if (response.ok) {
        const payload = await response.json();
        const remoteRecord = payload.result;
        if (remoteRecord?.answers && remoteRecord?.result) {
          answers = remoteRecord.answers;
          result = remoteRecord.result;
          saveLocalResult({ answers, result });
        } else if (localResult?.answers && localResult?.result) {
          await syncQuizAnswers(localResult.answers);
        }
      }
    } catch {
      syncWarning = !!result;
    } finally {
      loading = false;
      showForm = !result;
    }
  });

  function loadLocalResult(): StoredQuizResult | null {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveLocalResult(value: StoredQuizResult) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {}
  }

  function setSingleAnswer(questionId: string, value: string) {
    answers = { ...answers, [questionId]: value };
  }

  function toggleMultiAnswer(questionId: string, value: string) {
    const current = Array.isArray(answers[questionId]) ? answers[questionId] as string[] : [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    answers = { ...answers, [questionId]: next };
  }

  function isMultiSelected(questionId: string, value: string): boolean {
    const current = answers[questionId];
    return Array.isArray(current) && current.includes(value);
  }

  function isSelectedAnswer(question: PreworkQuizQuestion, value: string): boolean {
    const answer = answers[question.id];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  }

  function isKnowledgeQuestion(question: PreworkQuizQuestion): boolean {
    return !neutralQuestionIds.has(question.id);
  }

  function getAnswerReviewClass(question: PreworkQuizQuestion, value: string): string {
    const isSelected = isSelectedAnswer(question, value);
    const isKnowledge = isKnowledgeQuestion(question);
    const isCorrectOption = value === 'correct';

    if (isKnowledge && isSelected && isCorrectOption) {
      return 'border-emerald-500/70 bg-emerald-950/40 text-emerald-50';
    }

    if (isKnowledge && isSelected && !isCorrectOption) {
      return 'border-red-500/70 bg-red-950/40 text-red-50';
    }

    if (isKnowledge && !isSelected && isCorrectOption) {
      return 'border-emerald-700/60 bg-gray-900 text-emerald-100';
    }

    if (!isKnowledge && isSelected) {
      return 'border-blue-500/70 bg-blue-950/40 text-blue-50';
    }

    return 'border-gray-700 bg-gray-900 text-gray-400';
  }

  function getAnswerReviewLabel(question: PreworkQuizQuestion, value: string): string | null {
    const isSelected = isSelectedAnswer(question, value);

    if (!isKnowledgeQuestion(question)) {
      return isSelected ? copy.selectedAnswerLabel : null;
    }

    if (isSelected && value === 'correct') return copy.correctSelectedLabel;
    if (isSelected) return copy.selectedAnswerLabel;
    if (value === 'correct') return copy.correctAnswerLabel;
    return null;
  }

  async function submitQuiz() {
    const nextResult = buildPreworkQuizResult(answers, language);
    result = nextResult;
    showForm = false;
    syncWarning = false;
    saveLocalResult({ answers, result: nextResult });

    await tick();
    resultHeading?.scrollIntoView({ block: 'start', behavior: 'auto' });

    await syncQuizAnswers(answers);
  }

  async function syncQuizAnswers(answersToSync: PreworkQuizAnswers) {
    try {
      const response = await fetch('/api/quiz-result', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: PREWORK_COURSE_SLUG,
          quizSlug: PREWORK_PATH_QUIZ_SLUG,
          language,
          answers: answersToSync,
        }),
      });

      if (!response.ok) {
        syncWarning = true;
        return;
      }

      const payload = await response.json();
      if (payload.result?.answers && payload.result?.result) {
        answers = payload.result.answers;
        result = payload.result.result;
        saveLocalResult({ answers, result });
      }
    } catch {
      syncWarning = true;
    }
  }

  function retryQuiz() {
    showForm = true;
    result = null;
    syncWarning = false;
  }
</script>

<section class="mx-auto max-w-4xl px-4 py-8 text-gray-100 md:px-8">
  <div class="mb-8">
    <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">10xDevs 3.0 Prework</p>
    <h1
      bind:this={resultHeading}
      class="text-3xl font-bold text-white md:text-4xl"
    >
      {headingTitle}
    </h1>
    <p class="mt-3 max-w-2xl text-gray-300">{headingDescription}</p>
  </div>

  {#if loading}
    <div class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-5 text-gray-300">{copy.loading}</div>
  {:else if showForm}
    <form
      class="space-y-5"
      onsubmit={(event) => {
        event.preventDefault();
        submitQuiz();
      }}
    >
      {#each questions as question, index}
        <fieldset class="rounded-lg border border-gray-700 bg-gray-800 p-4" aria-labelledby={`question-${question.id}`}>
          <div class="mb-4">
            <h2 id={`question-${question.id}`} class="text-base font-semibold leading-snug text-white">
              <span class="mr-2 text-blue-300">{index + 1}.</span>{question.title}
            </h2>
            {#if question.description}
              <p class="mt-2 text-sm text-gray-400">{question.description}</p>
            {/if}
          </div>

          <div class="grid gap-2">
            {#each question.options as option}
              <label class="flex cursor-pointer items-start gap-3 rounded-md border border-gray-700 bg-gray-900 px-3 py-3 text-sm text-gray-200 transition hover:border-blue-500">
                {#if question.type === 'single'}
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onchange={() => setSingleAnswer(question.id, option.value)}
                    class="mt-1"
                  />
                {:else}
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isMultiSelected(question.id, option.value)}
                    onchange={() => toggleMultiAnswer(question.id, option.value)}
                    class="mt-1"
                  />
                {/if}
                <span>{option.label}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      {/each}

      <button
        type="submit"
        disabled={!allSingleQuestionsAnswered}
        class="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copy.submit}
      </button>
    </form>
  {:else if result}
    <div class="space-y-5">
      {#if syncWarning}
        <div class="rounded-md border border-yellow-500/40 bg-yellow-950/40 px-4 py-3 text-sm text-yellow-100">
          {copy.saveWarning}
        </div>
      {/if}

      <div class="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">{copy.resultTitle}</h2>
            <p class="mt-1 text-sm text-gray-400">{copy.resultDescription}</p>
          </div>
          <button
            type="button"
            onclick={retryQuiz}
            class="w-fit whitespace-nowrap rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-blue-400 hover:text-white"
          >
            {copy.retry}
          </button>
        </div>

        <ol class="space-y-3">
          {#each result.recommendations as recommendation}
            <li class="rounded-md border border-gray-700 bg-gray-900 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 class="font-semibold text-white">{recommendation.title}</h3>
                  <p class="mt-1 text-sm text-gray-400">{recommendation.reason}</p>
                </div>
                <a
                  href={recommendation.href}
                  class="shrink-0 rounded-md bg-gray-700 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  {copy.openLesson}
                </a>
              </div>
            </li>
          {/each}
        </ol>

        <div class="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p class="text-sm text-gray-400">{copy.resultNavigationHint}</p>
          <a
            href={`/external/${PREWORK_COURSE_SLUG}/${language}/02`}
            class="shrink-0 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {copy.goToNextLesson}
          </a>
        </div>
      </div>

      <div class="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <div class="mb-5">
          <h2 class="text-2xl font-bold text-white">{copy.answersTitle}</h2>
          <p class="mt-1 text-sm text-gray-400">{copy.answersDescription}</p>
        </div>

        <ol class="space-y-4">
          {#each questions as question, index}
            <li class="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
              <h3 class="text-base font-semibold leading-snug text-white">
                <span class="mr-2 text-blue-300">{index + 1}.</span>{question.title}
              </h3>

              <div class="mt-3 grid gap-2">
                {#each question.options as option}
                  {@const reviewLabel = getAnswerReviewLabel(question, option.value)}
                  <div class={`rounded-md border px-3 py-3 text-sm ${getAnswerReviewClass(question, option.value)}`}>
                    <div class="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
                      <span>{option.label}</span>
                      {#if reviewLabel}
                        <span class="shrink-0 text-xs font-semibold uppercase tracking-wide">{reviewLabel}</span>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </li>
          {/each}
        </ol>
      </div>
    </div>
  {/if}
</section>
