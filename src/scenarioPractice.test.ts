import test from "node:test"
import assert from "node:assert/strict"
import { scenarioQuestions, validateScenarioBank } from "./scenarioQuestions.ts"
import {
  getScenarioOverview, normalizeScenarioProgress, recordScenarioAnswer,
} from "./scenarioProgress.ts"

test("all 12 scenarios have unique valid options and known objectives", () => {
  assert.equal(scenarioQuestions.length, 12)
  assert.deepEqual(validateScenarioBank(), [])
  assert.equal(new Set(scenarioQuestions.map((item) => item.id)).size, 12)
})

test("four scenarios address each official AZ-900 domain", () => {
  const domains = ["Cloud concepts", "Azure architecture and services", "Azure management and governance"]
  for (const domain of domains) assert.equal(scenarioQuestions.filter((item) => item.category === domain).length, 4)
})

test("correct and incorrect answers record an independent attempt", () => {
  const example = scenarioQuestions[0]
  const wrong = (example.correctIndex + 1) % 4
  const a = recordScenarioAnswer({}, example.id, wrong, "2026-10-27T19:00:00.000Z")
  assert.equal(a[example.id].correct, false)
  const b = recordScenarioAnswer(a, example.id, example.correctIndex, "2026-10-27T19:01:00.000Z")
  assert.equal(b[example.id].correct, true)
  assert.equal(b[example.id].attempts, 2)
  assert.deepEqual(getScenarioOverview(b), { attempted: 1, latestCorrect: 1, total: 12 })
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
