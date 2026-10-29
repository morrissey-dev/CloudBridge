import test from "node:test"
import assert from "node:assert/strict"
import { getHandsOnSummary, handsOnPaths, isValidHandsOnProgress, markHandsOnStep, normalizeHandsOnProgress } from "./azureHandsOn.ts"

test("hands-on paths use official URLs and warn when resources could cost money", () => {
  assert.equal(handsOnPaths.length, 2)
  assert.ok(handsOnPaths.every((path) => path.officialUrl.startsWith("https://")))
  const billed = handsOnPaths.find((item) => item.id === "network-nsg")!
  assert.match(billed.warning, /billable/i)
  assert.match(billed.warning, /clean-up/i)
  assert.ok(billed.steps.some((item) => item.id === "cleanup"))
})

test("progress is self-attested per task, can be unchecked, and never stores credentials", () => {
  const created = markHandsOnStep({}, "cost-estimate", "select", true, "2026-10-28T09:00:00Z")
  const repeated = markHandsOnStep(created, "cost-estimate", "select", true, "2026-10-28T09:01:00Z")
  assert.deepEqual(repeated["cost-estimate"]?.completedStepIds, ["select"])
  assert.equal(getHandsOnSummary(repeated)[0].selfReportedSteps, 1)
  assert.deepEqual(markHandsOnStep(repeated, "cost-estimate", "select", false, "2026-10-28T09:02:00Z")["cost-estimate"]?.completedStepIds, [])
  assert.throws(() => markHandsOnStep({}, "network-nsg", "admin-password", true, "2026-10-28T09:00:00Z"))
})

test("normalization discards unknown paths, invalid steps and malformed dates", () => {
  const valid = { completedStepIds: ["select", "reflect", "select"], updatedAt: "2026-10-28T09:00:00Z" }
  assert.deepEqual(normalizeHandsOnProgress({ "cost-estimate": valid, unexpected: { token: "secret" } }), {
    "cost-estimate": { completedStepIds: ["select", "reflect"], updatedAt: valid.updatedAt },
  })
  assert.deepEqual(normalizeHandsOnProgress({ "cost-estimate": { ...valid, completedStepIds: ["select", "unknown"] } }), {})
  assert.deepEqual(normalizeHandsOnProgress({ "network-nsg": { ...valid, updatedAt: "yesterday" } }), {})
  assert.deepEqual(normalizeHandsOnProgress(null), {})
})


test("backup shape validation is independent of path order and rejects unexpected data", () => {
  const valid = {
    "network-nsg": { completedStepIds: ["budget"], updatedAt: "2026-10-28T10:00:00Z" },
    "cost-estimate": { completedStepIds: ["select"], updatedAt: "2026-10-28T10:01:00Z" },
  }
  assert.equal(isValidHandsOnProgress(valid), true)
  assert.equal(isValidHandsOnProgress({ ...valid, token: "secret" }), false)
  assert.equal(isValidHandsOnProgress({ "network-nsg": { ...valid["network-nsg"], secret: "secret" } }), false)
})
