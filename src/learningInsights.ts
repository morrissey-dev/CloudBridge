import { az900ExamQuestions, type AZ900Category, type AZ900Question } from "./az900Exam.ts"
import type { CompletedExamAttempt } from "./learningProgress.ts"

/** These are observed CloudBridge practice outcomes, NOT an AZ-900 pass prediction. */
export const az900Domains: readonly AZ900Category[] = [
  "Cloud concepts",
  "Azure architecture and services",
  "Azure management and governance",
]

export type DomainInsight = {
  category: AZ900Category
  correct: number
  answered: number
  total: number
  percent: number | null
  notesReviewed: number
}
export type RecentExamInsight = {
  attemptId: string
  examId: string
  completedAt: string
  correct: number
  total: number
  percent: number
}
export type PracticeInsights = {
  recordedAttempts: number
  distinctExams: number
  latestAttempt: RecentExamInsight | null
  latestPerExamAverage: number | null
  recentAttempts: RecentExamInsight[]
  byDomain: DomainInsight[]
  weakestCategory: AZ900Category | null
  notesReviewedInLatestExams: number
  totalQuestionsInLatestExams: number
}

const percent = (correct: number, total: number) => total ? Math.round((correct / total) * 100) : null

/**
 * Use only the latest completed attempt per exam for domain comparison. Retakes
 * remain in the recent history chart but cannot repeatedly inflate a domain score.
 * Exam answers are not regraded or rewritten, preserving older saved attempts.
 */
export function getPracticeInsights(
  history: readonly CompletedExamAttempt[],
  bank: readonly AZ900Question[] = az900ExamQuestions,
): PracticeInsights {
  const questions = new Map(bank.map((item) => [item.id, item]))
  const valid = history.filter((item) =>
    Number.isFinite(Date.parse(item.completedAt)) &&
    item.questionIds.length > 0 &&
    Number.isInteger(item.score) && item.score >= 0 && item.score <= item.questionIds.length,
  )
  const newestFirst = [...valid].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
  const latestByExam = new Map<string, CompletedExamAttempt>()
  for (const attempt of newestFirst) {
    if (!latestByExam.has(attempt.examId)) latestByExam.set(attempt.examId, attempt)
  }
  const latest = [...latestByExam.values()]
  const byDomain = az900Domains.map((category): DomainInsight => {
    let correct = 0
    let answered = 0
    let total = 0
    let notesReviewed = 0
    for (const attempt of latest) {
      for (const id of attempt.questionIds) {
        const item = questions.get(id)
        if (!item || item.category !== category) continue
        total++
        if (attempt.answers[id] !== undefined) answered++
        if (attempt.answers[id] === item.correctAnswer) correct++
        if (item.verificationStatus === "notes-reviewed") notesReviewed++
      }
    }
    return { category, correct, answered, total, percent: percent(correct, total), notesReviewed }
  })
  // Avoid recommending a topic from a single question when other domains are unattempted.
  const comparable = byDomain.filter((item) => item.total > 0)
  const weakestCategory = comparable.length === az900Domains.length
    ? [...comparable].sort((a, b) => (a.percent ?? 0) - (b.percent ?? 0))[0]?.category ?? null
    : null
  const recentAttempts = newestFirst.slice(0, 5).map((attempt) => ({
    attemptId: attempt.attemptId,
    examId: attempt.examId,
    completedAt: attempt.completedAt,
    correct: attempt.score,
    total: attempt.questionIds.length,
    percent: percent(attempt.score, attempt.questionIds.length) ?? 0,
  }))
  return {
    recordedAttempts: valid.length,
    distinctExams: latest.length,
    latestAttempt: recentAttempts[0] ?? null,
    latestPerExamAverage: latest.length
      ? Math.round(latest.reduce((sum, item) => sum + 100 * item.score / item.questionIds.length, 0) / latest.length)
      : null,
    recentAttempts,
    byDomain,
    weakestCategory,
    notesReviewedInLatestExams: byDomain.reduce((sum, item) => sum + item.notesReviewed, 0),
    totalQuestionsInLatestExams: byDomain.reduce((sum, item) => sum + item.total, 0),
  }
}
