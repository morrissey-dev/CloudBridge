import test from "node:test"
import assert from "node:assert/strict"
import { scenarioQuestions, validateScenarioBank } from "./scenarioQuestions.ts"
import {
  getScenarioOverview, normalizeScenarioProgress, recordScenarioAnswer,
} from "./scenarioProgress.ts"

test("all 36 scenarios have unique valid options and known objectives", () => {
  assert.equal(scenarioQuestions.length, 36)
  assert.deepEqual(validateScenarioBank(), [])
  assert.equal(new Set(scenarioQuestions.map((item) => item.id)).size, 36)
})

test("scenario domain categorisation respects governance for cost optimisation", () => {
  const domains = ["Cloud concepts", "Azure architecture and services", "Azure management and governance"]
  assert.deepEqual(domains.map((domain) => scenarioQuestions.filter((item) => item.category === domain).length), [11, 12, 13])
  assert.equal(scenarioQuestions.find((item) => item.objectiveId === "LO-016")?.category, "Azure management and governance")
})

test("correct and incorrect answers record an independent attempt", () => {
  const example = scenarioQuestions[0]
  const wrong = (example.correctIndex + 1) % 4
  const a = recordScenarioAnswer({}, example.id, wrong, "2026-10-27T19:00:00.000Z")
  assert.equal(a[example.id].correct, false)
  const b = recordScenarioAnswer(a, example.id, example.correctIndex, "2026-10-27T19:01:00.000Z")
  assert.equal(b[example.id].correct, true)
  assert.equal(b[example.id].attempts, 2)
  assert.deepEqual(getScenarioOverview(b), { attempted: 1, latestCorrect: 1, total: 36 })
})

test("rejects invalid input and unsupported scenario IDs", () => {
  assert.throws(() => recordScenarioAnswer({}, "missing-id", 0, new Date().toISOString()))
  assert.throws(() => recordScenarioAnswer({}, scenarioQuestions[0].id, 7, new Date().toISOString()))
})

test("stored answers validate shape and actual correctness", () => {
  const example = scenarioQuestions[0]
  const valid = recordScenarioAnswer({}, example.id, example.correctIndex, new Date("2026-10-27").toISOString())
  const normalized = normalizeScenarioProgress({
    ...valid,
    unknown: { selectedIndex: 0, correct: true, completedAt: "2026-10-27", attempts: 1 },
    invalid: "random",
  })
  assert.deepEqual(normalized, valid)
  assert.deepEqual(normalizeScenarioProgress({ [example.id]: { ...valid[example.id], correct: false } }), {})
  assert.deepEqual(normalizeScenarioProgress("hello"), {})
})
