// ExamScene UI chrome (panel labels, navigation buttons, results screen).

export const examStrings = {
  pl: {
    'exam.titlePrefix': 'EGZAMIN: {title}',
    'exam.selectAllMatching': 'Wybierz wszystkie pasujące:',
    'exam.close': 'Zamknij',
    'exam.previous': '← Poprzednie',
    'exam.next': 'Następne →',
    'exam.finish': 'Zakończ egzamin',
    'exam.passed': 'EGZAMIN ZALICZONY',
    'exam.failed': 'EGZAMIN NIEZALICZONY',
    'exam.score': '{score}/{total} poprawnych odpowiedzi',
    'exam.requiredHint': 'Wymagane: {required}/{total}',
    'exam.closeEnter': 'Zamknij [Enter]',
    'exam.tryAgain': 'Spróbuj ponownie',
  },
  en: {
    'exam.titlePrefix': 'EXAM: {title}',
    'exam.selectAllMatching': 'Select all that apply:',
    'exam.close': 'Close',
    'exam.previous': '← Previous',
    'exam.next': 'Next →',
    'exam.finish': 'Finish Exam',
    'exam.passed': 'EXAM PASSED',
    'exam.failed': 'EXAM FAILED',
    'exam.score': '{score}/{total} correct answers',
    'exam.requiredHint': 'Required: {required}/{total}',
    'exam.closeEnter': 'Close [Enter]',
    'exam.tryAgain': 'Try Again',
  },
} as const;
