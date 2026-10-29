import test from "node:test"
import assert from "node:assert/strict"
import { scenarioQuestions, validateScenarioBank } from "./scenarioQuestions.ts"
import {
  getScenarioOverview, normalizeScenarioProgress, recordScenarioAnswer,
} from "./scenarioProgress.ts"

test("all V1.6 scenarios have unique valid options and known objectives", () => {
  assert.equal(scenarioQuestions.length, 77)
  assert.deepEqual(validateScenarioBank(), [])
  assert.equal(new Set(scenarioQuestions.map((item) => item.id)).size, scenarioQuestions.length)
})

test("scenario domain categorisation respects governance for cost optimisation", () => {
  const domains = ["Cloud concepts", "Azure architecture and services", "Azure management and governance"]
  assert.ok(domains.every((domain) => scenarioQuestions.some((item) => item.category === domain)))
  assert.equal(scenarioQuestions.find((item) => item.objectiveId === "LO-016")?.category, "Azure management and governance")
})

test("each original handout objective now has at least one mapped scenario", () => {
  const ids = new Set(scenarioQuestions.map((item) => item.objectiveId))
  assert.equal(ids.size, 63)
  assert.ok(Array.from({length: 63}, (_, i) => `LO-${String(i + 1).padStart(3, "0")}`).every((id) => ids.has(id)))
})

test("correct and incorrect answers record an independent attempt", () => {
  const example = scenarioQuestions[0]
  const wrong = (example.correctIndex + 1) % 4
  const a = recordScenarioAnswer({}, example.id, wrong, "2026-10-27T19:00:00.000Z")
  assert.equal(a[example.id].correct, false)
  const b = recordScenarioAnswer(a, example.id, example.correctIndex, "2026-10-27T19:01:00.000Z")
  assert.equal(b[example.id].correct, true)
  assert.equal(b[example.id].attempts, 2)
  assert.deepEqual(getScenarioOverview(b), { attempted: 1, latestCorrect: 1, total: scenarioQuestions.length })
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


test("second-scenario practice deepens 14 objectives without renaming older saved items", () => {
  const newScenarios = scenarioQuestions.filter((item) => item.id.startsWith("scenario-v16-"))
  assert.equal(newScenarios.length, 14)
  assert.equal(new Set(newScenarios.map((item) => item.objectiveId)).size, 14)
  assert.equal(scenarioQuestions.filter((item) => !item.id.startsWith("scenario-v16-")).length, 63)
  for (const item of newScenarios) {
    assert.ok(scenarioQuestions.some((earlier) => earlier.objectiveId === item.objectiveId && earlier.id !== item.id))
  }
})
