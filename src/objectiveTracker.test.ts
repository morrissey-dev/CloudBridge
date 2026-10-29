import test from "node:test"
import assert from "node:assert/strict"
import { sourceLearningObjectives } from "./learningObjectives.ts"
import { createEmptyLearningProgress } from "./learningProgress.ts"
import { scenarioQuestions } from "./scenarioQuestions.ts"
import { recordScenarioAnswer } from "./scenarioProgress.ts"
import {
  getObjectiveEvidence, getObjectiveSummary, normalizeObjectiveConfidence, setObjectiveConfidence,
} from "./objectiveTracker.ts"

test("all 63 objectives have a confidence rating choice and unknown IDs are rejected", () => {
  assert.equal(sourceLearningObjectives.length, 63)
  assert.deepEqual(normalizeObjectiveConfidence({ "LO-001": "confident", "LO-002": "studying", "LO-003": "invalid", "LO-999": "confident" }), {
    "LO-001": "confident", "LO-002": "studying",
  })
  assert.throws(() => setObjectiveConfidence({}, "LO-999", "confident"))
  assert.throws(() => setObjectiveConfidence({}, "LO-001", "mastered" as never))
})

test("lesson completion and scenario answers are independent evidence of practice", () => {
  const progress = createEmptyLearningProgress()
  const scenario = scenarioQuestions[0]
  const objective = sourceLearningObjectives.find((item) => item.id === scenario.objectiveId)!
  const evidenceBefore = getObjectiveEvidence(objective.id, progress, {})
  assert.deepEqual(evidenceBefore, { lessonCompleted: false, scenarioCount: 1, scenarioAttempted: 0, scenarioCorrectOnLatest: 0 })
  const result = recordScenarioAnswer({}, scenario.id, scenario.correctIndex, "2026-10-28T00:00:00Z")
  assert.deepEqual(getObjectiveEvidence(objective.id, progress, result), {
    lessonCompleted: false, scenarioCount: 1, scenarioAttempted: 1, scenarioCorrectOnLatest: 1,
  })
  assert.equal(getObjectiveSummary({}, progress, result).objectivesPracticed, 1)
  const legacy = new Set([objective.moduleId])
  assert.equal(getObjectiveEvidence(objective.id, progress, result, legacy).lessonCompleted, true)
})

test("confidence does not imply a completed lesson or a correct answer", () => {
  const empty = createEmptyLearningProgress()
  const selfReported = setObjectiveConfidence({}, "LO-001", "confident")
  const result = getObjectiveSummary(selfReported, empty, {})
  assert.equal(result.selfReportedConfident, 1)
  assert.equal(result.lessonsCompleted, 0)
  assert.equal(result.objectivesPracticed, 0)
  assert.equal(result.total, 63)
  assert.equal(result.objectivesWithScenarios, 63)
})
