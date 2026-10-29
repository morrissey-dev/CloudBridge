import { scenarioQuestions } from "./scenarioQuestions.ts"

export const scenarioProgressStorageKey = "cloudbridge-scenario-practice-v1"

export type ScenarioResult = {
  selectedIndex: number
  correct: boolean
  completedAt: string
  attempts: number
}

export type ScenarioProgress = Record<string, ScenarioResult>

export function normalizeScenarioProgress(data: unknown): ScenarioProgress {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {}
  const results: ScenarioProgress = {}
  for (const [id, value] of Object.entries(data)) {
    const scenario = scenarioQuestions.find((question) => question.id === id)
    if (!scenario || !value || typeof value !== "object" || Array.isArray(value)) continue
    const candidate = value as Record<string, unknown>
    if (!Number.isInteger(candidate.selectedIndex) || Number(candidate.selectedIndex) < 0 || Number(candidate.selectedIndex) > 3) continue
    if (candidate.correct !== (candidate.selectedIndex === scenario.correctIndex)) continue
    if (typeof candidate.completedAt !== "string" || !Number.isFinite(Date.parse(candidate.completedAt))) continue
    if (!Number.isInteger(candidate.attempts) || Number(candidate.attempts) < 1) continue
    results[id] = {
      selectedIndex: Number(candidate.selectedIndex),
      correct: Boolean(candidate.correct),
      completedAt: candidate.completedAt,
      attempts: Math.min(Number(candidate.attempts), 100000),
    }
  }
  return results
}

export function recordScenarioAnswer(
  existing: ScenarioProgress,
  id: string,
  selectedIndex: number,
  completedAt: string,
): ScenarioProgress {
  const scenario = scenarioQuestions.find((question) => question.id === id)
  if (!scenario) throw new Error("Unknown scenario")
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
    throw new Error("Invalid scenario answer")
  }
  return {
    ...existing,
    [id]: {
      selectedIndex,
      correct: selectedIndex === scenario.correctIndex,
      completedAt,
      attempts: (existing[id]?.attempts ?? 0) + 1,
    },
  }
}

export function getScenarioOverview(progress: ScenarioProgress) {
  const attempted = scenarioQuestions.filter((item) => !!progress[item.id]).length
  const latestCorrect = scenarioQuestions.filter((item) => progress[item.id]?.correct).length
  return { attempted, latestCorrect, total: scenarioQuestions.length }
}
