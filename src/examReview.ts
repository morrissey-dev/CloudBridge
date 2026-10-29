import type { AZ900Question } from "./az900Exam.ts"
export type ExamReviewFilter = "all" | "missed"
export type ExamReviewQuestion = { question: AZ900Question }

/** Includes skipped questions in missed review; preserves the exam's authored order. */
export function filterExamReview<T extends ExamReviewQuestion>(
  attempt: readonly T[],
  answers: Readonly<Record<string, string>>,
  filter: ExamReviewFilter,
): T[] {
  if (filter === "all") return [...attempt]
  return attempt.filter(({ question }) => answers[question.id] !== question.correctAnswer)
}

export function countMissedAnswers<T extends ExamReviewQuestion>(
  attempt: readonly T[], answers: Readonly<Record<string, string>>,
): number {
  return filterExamReview(attempt, answers, "missed").length
}
