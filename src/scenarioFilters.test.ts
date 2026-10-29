import test from "node:test"
import assert from "node:assert/strict"
import { scenarioQuestions } from "./scenarioQuestions.ts"
import { filterScenarios, getScenarioReviewSummary } from "./scenarioFilters.ts"
import { recordScenarioAnswer } from "./scenarioProgress.ts"

test("V1.4 scenarios cover three domains and 36 distinct objectives", () => {
  assert.equal(scenarioQuestions.length, 36)
  assert.equal(new Set(scenarioQuestions.map((q) => q.objectiveId)).size, 36)
  for (const category of ["Cloud concepts", "Azure architecture and services", "Azure management and governance"]) {
    const expected = category === "Cloud concepts" ? 11 : category === "Azure architecture and services" ? 12 : 13
    assert.equal(filterScenarios(scenarioQuestions, {}, category as import("./scenarioFilters.ts").ScenarioFilter).length, expected)
  }
})

test("review filters distinguish unanswered, latest incorrect and correct", () => {
  const [one, two] = scenarioQuestions
  const correct = recordScenarioAnswer({}, one.id, one.correctIndex, "2026-10-28T09:00:00Z")
  const incorrect = recordScenarioAnswer(correct, two.id, (two.correctIndex + 1) % 4, "2026-10-28T09:05:00Z")
  assert.equal(filterScenarios(scenarioQuestions, incorrect, "needs-review")[0].id, two.id)
  assert.equal(filterScenarios(scenarioQuestions, incorrect, "needs-review").length, 1)
  assert.equal(filterScenarios(scenarioQuestions, incorrect, "unattempted").length, 34)
  assert.deepEqual(getScenarioReviewSummary(scenarioQuestions, incorrect), {
    unattempted: 34, needsReview: 1, completedCorrect: 1,
  })
  const retry = recordScenarioAnswer(incorrect, two.id, two.correctIndex, "2026-10-28T09:06:00Z")
  assert.equal(filterScenarios(scenarioQuestions, retry, "needs-review").length, 0)
  assert.equal(getScenarioReviewSummary(scenarioQuestions, retry).completedCorrect, 2)
})
