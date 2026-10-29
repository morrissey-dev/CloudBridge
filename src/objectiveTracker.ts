import { modules } from "./curriculum.ts"
import { sourceLearningObjectives } from "./learningObjectives.ts"
import type { LearningProgress } from "./learningProgress.ts"
import { scenarioQuestions } from "./scenarioQuestions.ts"
import type { ScenarioProgress } from "./scenarioProgress.ts"

export const objectiveConfidenceStorageKey = "cloudbridge-objective-confidence-v1"
export type ObjectiveConfidence = "review" | "studying" | "confident"
export type ObjectiveConfidenceMap = Record<string, ObjectiveConfidence>
const confidenceValues: readonly ObjectiveConfidence[] = ["review", "studying", "confident"]
const objectiveIdSet = new Set(sourceLearningObjectives.map((objective) => objective.id))

export function normalizeObjectiveConfidence(data: unknown): ObjectiveConfidenceMap {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {}
  return Object.fromEntries(
    Object.entries(data).filter(([id, value]) =>
      objectiveIdSet.has(id) && confidenceValues.includes(value as ObjectiveConfidence),
    ),
  ) as ObjectiveConfidenceMap
}

export function setObjectiveConfidence(
  saved: ObjectiveConfidenceMap,
  objectiveId: string,
  confidence: ObjectiveConfidence,
): ObjectiveConfidenceMap {
  if (!objectiveIdSet.has(objectiveId)) throw new Error("Unknown learning objective")
  if (!confidenceValues.includes(confidence)) throw new Error("Invalid confidence")
  return { ...saved, [objectiveId]: confidence }
}

export type ObjectiveEvidence = {
  lessonCompleted: boolean
  scenarioCount: number
  scenarioAttempted: number
  scenarioCorrectOnLatest: number
}

export function getObjectiveEvidence(
  objectiveId: string,
  learningProgress: LearningProgress,
  scenarioProgress: ScenarioProgress,
  legacyCompletedModuleIds: ReadonlySet<string> = new Set(),
): ObjectiveEvidence {
  const objective = sourceLearningObjectives.find((item) => item.id === objectiveId)
  if (!objective) throw new Error("Unknown learning objective")
  const module = modules.find((item) => item.id === objective.moduleId)
  const lessonIndex = module?.sections.flatMap((section) => section.concepts)
    .findIndex((concept) => concept.title === objective.lessonTitle) ?? -1
  const saved = learningProgress.modules[objective.moduleId]
  const relevantScenarios = scenarioQuestions.filter((question) => question.objectiveId === objectiveId)
  const attempted = relevantScenarios.filter((question) => !!scenarioProgress[question.id])
  return {
    lessonCompleted: lessonIndex >= 0 && (legacyCompletedModuleIds.has(objective.moduleId) ||
      !!saved?.completedLessonIndexes.includes(lessonIndex)),
    scenarioCount: relevantScenarios.length,
    scenarioAttempted: attempted.length,
    scenarioCorrectOnLatest: attempted.filter((item) => scenarioProgress[item.id]?.correct).length,
  }
}

export function getObjectiveSummary(
  confidence: ObjectiveConfidenceMap,
  learningProgress: LearningProgress,
  scenarioProgress: ScenarioProgress,
  legacyCompletedModuleIds: ReadonlySet<string> = new Set(),
) {
  let lessonsCompleted = 0
  let scenarioAttempted = 0
  let scenarioCorrectOnLatest = 0
  let withPractice = 0
  let withMultipleQuestions = 0
  for (const objective of sourceLearningObjectives) {
    const evidence = getObjectiveEvidence(objective.id, learningProgress, scenarioProgress, legacyCompletedModuleIds)
    if (evidence.lessonCompleted) lessonsCompleted += 1
    if (evidence.scenarioAttempted > 0) scenarioAttempted += 1
    if (evidence.scenarioCount > 0) withPractice += 1
    if (evidence.scenarioCount > 1) withMultipleQuestions += 1
    if (evidence.scenarioCount > 0 && evidence.scenarioCorrectOnLatest === evidence.scenarioCount) {
      scenarioCorrectOnLatest += 1
    }
  }
  return {
    total: sourceLearningObjectives.length,
    selfReportedConfident: sourceLearningObjectives.filter((objective) => confidence[objective.id] === "confident").length,
    lessonsCompleted,
    objectivesWithScenarios: withPractice,
    objectivesWithMultipleScenarios: withMultipleQuestions,
    objectivesPracticed: scenarioAttempted,
    objectivesCorrectOnLatest: scenarioCorrectOnLatest,
  }
}
