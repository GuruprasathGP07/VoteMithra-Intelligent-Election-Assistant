import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../hooks/useQuiz';

// Mock analytics to avoid Firebase calls
vi.mock('../utils/analytics', () => ({
  logQuizCompleted: vi.fn(),
  logQuizStarted: vi.fn(),
  logCustomEvent: vi.fn(),
}));

const mockQuestions = [
  { id: 1, question: 'What is minimum voting age?', a: ['16', '18', '21', '25'], correct: 1, exp: 'Article 326.' },
  { id: 2, question: 'What is NOTA?', a: ['None', 'Not applicable', 'None of the above', 'No option'], correct: 2, exp: 'NOTA allows rejection.' },
  { id: 3, question: 'Which body conducts elections?', a: ['ECI', 'Parliament', 'President', 'Cabinet'], correct: 0, exp: 'ECI is the Election Commission of India.' },
];

describe('useQuiz hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes at question 0', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.currentIndex).toBe(0);
  });

  it('initializes with score 0', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.score).toBe(0);
  });

  it('initializes as not completed', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.completed).toBe(false);
  });

  it('initializes with no selected answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.selectedAnswer).toBeNull();
  });

  it('returns current question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
  });

  it('increments score on correct answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); }); // correct index
    expect(result.current.score).toBe(1);
  });

  it('does not increment score on wrong answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(0); }); // wrong
    expect(result.current.score).toBe(0);
  });

  it('marks as answered after selection', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    expect(result.current.answered).toBe(true);
  });

  it('does not change answer if already answered', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.selectAnswer(0); }); // attempt second selection
    expect(result.current.selectedAnswer).toBe(1);
  });

  it('advances to next question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.nextQuestion(); });
    expect(result.current.currentIndex).toBe(1);
  });

  it('resets answered state on next question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.nextQuestion(); });
    expect(result.current.answered).toBe(false);
  });

  it('clears selected answer on next question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.nextQuestion(); });
    expect(result.current.selectedAnswer).toBeNull();
  });

  it('completes quiz after last question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.nextQuestion(); });
    act(() => { result.current.selectAnswer(2); });
    act(() => { result.current.nextQuestion(); });
    act(() => { result.current.selectAnswer(0); });
    act(() => { result.current.nextQuestion(); });
    expect(result.current.completed).toBe(true);
  });

  it('resets quiz correctly', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); });
    act(() => { result.current.nextQuestion(); });
    act(() => { result.current.resetQuiz(); });
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.completed).toBe(false);
    expect(result.current.answered).toBe(false);
  });

  it('calculates percentage correctly after full quiz', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.selectAnswer(1); }); // correct
    act(() => { result.current.nextQuestion(); });
    act(() => { result.current.selectAnswer(0); }); // wrong
    act(() => { result.current.nextQuestion(); });
    act(() => { result.current.selectAnswer(0); }); // correct
    act(() => { result.current.nextQuestion(); });
    expect(result.current.percentage).toBe(67);
  });

  it('handles empty questions array', () => {
    const { result } = renderHook(() => useQuiz([]));
    expect(result.current.currentQuestion).toBeNull();
    expect(result.current.percentage).toBe(0);
  });
});
