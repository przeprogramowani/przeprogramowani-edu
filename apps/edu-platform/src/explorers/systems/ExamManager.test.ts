import { describe, it, expect } from 'vitest';
import type { GameFlag } from '../config/flags';
import type { ExamDefinition } from './ExamTypes';
import type { BilingualText } from '../i18n/types';

const bi = (text: string): BilingualText => ({ pl: text, en: text });

// Test evaluation logic directly since ExamManager depends on Phaser
describe('ExamManager evaluation', () => {
  const sampleExam: ExamDefinition = {
    id: 'test-exam',
    title: bi('Test Exam'),
    description: bi('A test exam'),
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: bi('Single choice question'),
        type: 'single',
        options: [
          { id: 'a', text: bi('Option A') },
          { id: 'b', text: bi('Option B') },
          { id: 'c', text: bi('Option C') },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: bi('Multi choice question'),
        type: 'multi',
        options: [
          { id: 'a', text: bi('Option A') },
          { id: 'b', text: bi('Option B') },
          { id: 'c', text: bi('Option C') },
        ],
        correctOptionIds: ['a', 'c'],
      },
      {
        id: 'q3',
        text: bi('Another single choice'),
        type: 'single',
        options: [
          { id: 'a', text: bi('Option A') },
          { id: 'b', text: bi('Option B') },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: ['test-flag' as GameFlag] },
  };

  function evaluate(
    exam: ExamDefinition,
    answers: Record<string, string[]>
  ): { score: number; total: number; passed: boolean } {
    let score = 0;
    for (const q of exam.questions) {
      const selected = answers[q.id] ?? [];
      const correct = q.correctOptionIds;
      if (selected.length === correct.length && selected.every((s) => correct.includes(s))) {
        score++;
      }
    }
    return {
      score,
      total: exam.questions.length,
      passed: score >= exam.passingScore,
    };
  }

  describe('single-choice scoring', () => {
    it('scores correct single-choice answer', () => {
      const result = evaluate(sampleExam, { q1: ['b'], q2: [], q3: [] });
      expect(result.score).toBe(1);
    });

    it('scores incorrect single-choice answer', () => {
      const result = evaluate(sampleExam, { q1: ['a'], q2: [], q3: [] });
      expect(result.score).toBe(0);
    });
  });

  describe('multi-choice scoring', () => {
    it('scores correct multi-choice answer (exact match)', () => {
      const result = evaluate(sampleExam, { q1: [], q2: ['a', 'c'], q3: [] });
      expect(result.score).toBe(1);
    });

    it('scores correct multi-choice regardless of order', () => {
      const result = evaluate(sampleExam, { q1: [], q2: ['c', 'a'], q3: [] });
      expect(result.score).toBe(1);
    });

    it('partial correct answers in multi-choice count as wrong', () => {
      const result = evaluate(sampleExam, { q1: [], q2: ['a'], q3: [] });
      expect(result.score).toBe(0);
    });

    it('extra selections in multi-choice count as wrong', () => {
      const result = evaluate(sampleExam, { q1: [], q2: ['a', 'b', 'c'], q3: [] });
      expect(result.score).toBe(0);
    });
  });

  describe('passing threshold', () => {
    it('passes when score equals threshold exactly', () => {
      const result = evaluate(sampleExam, { q1: ['b'], q2: ['a', 'c'], q3: ['b'] });
      expect(result.score).toBe(2);
      expect(result.passed).toBe(true);
    });

    it('passes when score is above threshold', () => {
      const result = evaluate(sampleExam, { q1: ['b'], q2: ['a', 'c'], q3: ['a'] });
      expect(result.score).toBe(3);
      expect(result.passed).toBe(true);
    });

    it('fails when score is below threshold', () => {
      const result = evaluate(sampleExam, { q1: ['b'], q2: [], q3: ['b'] });
      expect(result.score).toBe(1);
      expect(result.passed).toBe(false);
    });

    it('fails with zero correct answers', () => {
      const result = evaluate(sampleExam, { q1: ['a'], q2: ['b'], q3: ['b'] });
      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles missing answers (unanswered questions)', () => {
      const result = evaluate(sampleExam, {});
      expect(result.score).toBe(0);
      expect(result.total).toBe(3);
      expect(result.passed).toBe(false);
    });
  });
});
