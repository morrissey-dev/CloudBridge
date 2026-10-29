import test from "node:test"
import assert from "node:assert/strict"
import { exportProgressBackup, importProgressBackup, parseProgressBackup } from "./progressBackup.ts"

class MemoryStorage {
  data = new Map<string, string>()
  getItem(key: string) { return this.data.get(key) ?? null }
  setItem(key: string, value: string) { this.data.set(key, value) }
  removeItem(key: string) { this.data.delete(key) }
}

test("backup exports only CloudBridge's known progress keys, excluding unrelated browser data", () => {
  const storage = new MemoryStorage()
  storage.setItem("cloudbridge-learning-progress-v1", JSON.stringify({ studyActivityDays: ["2026-10-28"] }))
  storage.setItem("unrelated-secret", "not included")
  const text = exportProgressBackup(storage, new Date("2026-10-28T10:00:00Z"))
  assert.ok(!text.includes("unrelated-secret"))
  const backup = parseProgressBackup(text)
  assert.deepEqual(Object.keys(backup.data), ["cloudbridge-learning-progress-v1"])
  const destination = new MemoryStorage()
  destination.setItem("unrelated-secret", "stays")
  importProgressBackup(destination, backup)
  assert.equal(destination.getItem("unrelated-secret"), "stays")
  assert.equal(destination.getItem("cloudbridge-learning-progress-v1"), backup.data["cloudbridge-learning-progress-v1"])
})

test("invalid backup structure and unknown storage keys are rejected without writing", () => {
  assert.throws(() => parseProgressBackup("not json"))
  assert.throws(() => parseProgressBackup("{}"))
  const source = new MemoryStorage()
  source.setItem("cloudbridge-enrolled-v1", "[0]")
  const backup = JSON.parse(exportProgressBackup(source))
  backup.data["unrelated-secret"] = "unsafe"
  const destination = new MemoryStorage()
  assert.throws(() => importProgressBackup(destination, backup))
  assert.equal(destination.getItem("cloudbridge-enrolled-v1"), null)
  delete backup.data["unrelated-secret"]
  backup.data["cloudbridge-enrolled-v1"] = "malformed json"
  assert.throws(() => parseProgressBackup(JSON.stringify(backup)))
})

test("partial storage failures roll back changed entries where possible", () => {
  class FailingStorage extends MemoryStorage {
    override setItem(key: string, value: string) {
      if (key === "cloudbridge-started-v1" && value === "[2]") throw new Error("Quota")
      super.setItem(key, value)
    }
  }
  const source = new MemoryStorage()
  source.setItem("cloudbridge-enrolled-v1", "[1]")
  source.setItem("cloudbridge-started-v1", "[2]")
  const backup = parseProgressBackup(exportProgressBackup(source))
  const destination = new FailingStorage()
  destination.setItem("cloudbridge-enrolled-v1", "[0]")
  assert.throws(() => importProgressBackup(destination, backup))
  assert.equal(destination.getItem("cloudbridge-enrolled-v1"), "[0]")
  assert.equal(destination.getItem("cloudbridge-started-v1"), null)
})
