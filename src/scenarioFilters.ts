import type { AZ900Category } from "./az900Exam.ts"
import type { ScenarioQuestion } from "./scenarioQuestions.ts"
import type { ScenarioProgress } from "./scenarioProgress.ts"

export type ScenarioFilter = "all" | "unattempted" | "needs-review" | AZ900Category

export function filterScenarios(
  questions: readonly ScenarioQuestion[],
  progress: ScenarioProgress,
  filter: ScenarioFilter,
): ScenarioQuestion[] {
  switch (filter) {
    case "unattempted": return questions.filter((item) => !progress[item.id])
    case "needs-review": return questions.filter((item) => progress[item.id] && !progress[item.id].correct)
    case "all": return [...questions]
    default: return questions.filter((item) => item.category === filter)
  }
}

/** Review prioritisation is based on the latest saved attempt, not an exam score. */
export function getScenarioReviewSummary(
  questions: readonly ScenarioQuestion[],
  progress: ScenarioProgress,
) {
  return {
    unattempted: filterScenarios(questions, progress, "unattempted").length,
    needsReview: filterScenarios(questions, progress, "needs-review").length,
    completedCorrect: questions.filter((item) => progress[item.id]?.correct).length,
  }
}
