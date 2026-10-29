import test from "node:test"
import assert from "node:assert/strict"
import { guidedLabs, evaluateLab, normalizeLabProgress } from "./azureLabs.ts"
import { supplementalStorageObjectives } from "./az900Supplement.ts"
import { exportProgressBackup, importProgressBackup, parseProgressBackup } from "./progressBackup.ts"

test("guidance offers two complete simulated labs without connecting to Azure", () => {
  assert.deepEqual(guidedLabs.map((lab) => lab.id), ["storage", "network"])
  assert.equal(supplementalStorageObjectives.length, 6)
  for (const lab of guidedLabs) {
    assert.equal(lab.steps.length, 4)
    assert.equal(new Set(lab.steps.map((step) => step.id)).size, lab.steps.length)
    assert.ok(lab.objectiveRefs.length >= 1)
    for (const step of lab.steps) {
      assert.equal(step.choices.length, 4)
      assert.ok(step.correctIndex >= 0 && step.correctIndex < step.choices.length)
      assert.ok(step.explanation.length > 35)
    }
  }
})

test("lab evaluator rejects incomplete or invalid answers and grades the full series", () => {
  const lab = guidedLabs[0]
  assert.equal(evaluateLab(lab, []), null)
  assert.equal(evaluateLab(lab, [0, null, 2, 3]), null)
  assert.equal(evaluateLab(lab, [0, 1, 2, -1]), null)
  assert.deepEqual(evaluateLab(lab, lab.steps.map((step) => step.correctIndex)), { correct: 4, total: 4 })
  assert.deepEqual(evaluateLab(lab, [3, 3, 3, 3]), { correct: 1, total: 4 })
})

test("lab storage rejects unknown labs and mutated or incomplete results", () => {
  const saved = { storage: { selected: [0, 1, 2, 3], completedAt: "2026-10-28T12:00:00Z" } }
  assert.deepEqual(normalizeLabProgress(saved), saved)
  assert.deepEqual(normalizeLabProgress({ ...saved, network: { selected: [0], completedAt: "2026-10-28T12:00:00Z" }, unknown: saved.storage }), saved)
  assert.deepEqual(normalizeLabProgress({ storage: { selected: [0, 1, 2, 9], completedAt: "2026-10-28T12:00:00Z" } }), {})
})

test("old progress backups remain readable and new labs are added without unrelated keys", () => {
  class StorageMock {
    data = new Map<string,string>()
    getItem(key: string) { return this.data.get(key) ?? null }
    setItem(key: string, value: string) { this.data.set(key, value) }
    removeItem(key: string) { this.data.delete(key) }
  }
  const local = new StorageMock()
  local.setItem("cloudbridge-learning-progress-v1", JSON.stringify({ modules: {} }))
  local.setItem("cloudbridge-lab-progress-v1", JSON.stringify({ network: { selected: [0,1,2,3], completedAt: "2026-10-28" } }))
  local.setItem("other-service-auth", "not-exported")
  const backup = parseProgressBackup(exportProgressBackup(local))
  assert.ok(backup.data["cloudbridge-lab-progress-v1"])
  assert.equal(backup.data["other-service-auth"], undefined)
  const restored = new StorageMock()
  importProgressBackup(restored, backup)
  assert.equal(restored.getItem("cloudbridge-learning-progress-v1"), local.getItem("cloudbridge-learning-progress-v1"))
  assert.equal(restored.getItem("cloudbridge-lab-progress-v1"), local.getItem("cloudbridge-lab-progress-v1"))
})
