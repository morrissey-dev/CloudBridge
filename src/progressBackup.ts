import { handsOnStorageKey, isValidHandsOnProgress } from "./azureHandsOn.ts"
/** Offline-only progress backup. Never includes arbitrary localStorage keys. */
export const progressBackupKeys = [
  "cloudbridge_welcome_completed",
  "cloudbridge-enrolled-v1",
  "cloudbridge-started-v1",
  "cloudbridge-completed-v1",
  "cloudbridge-learning-progress-v1",
  "cloudbridge-scenario-practice-v1",
  "cloudbridge-lab-progress-v1",
  "cloudbridge-hands-on-self-reported-v1",
  "cloudbridge-objective-confidence-v1",
  "cloudbridge-study-plan-v1",
  "cloudbridge-plan-date",
  "cloudbridge-plan-days",
  "cloudbridge-plan-minutes",
  "cloudbridge-plan-focus",
  "cloudbridge-plan-goal",
] as const

export type ProgressStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">
export type ProgressBackup = {
  format: "cloudbridge-progress-backup"
  version: 1
  createdAt: string
  data: Record<string, string>
}
const allowedKeys = new Set<string>(progressBackupKeys)
const maximumBackupLength = 2_000_000

export function exportProgressBackup(storage: ProgressStorage, now = new Date()): string {
  const data: Record<string, string> = {}
  for (const key of progressBackupKeys) {
    const value = storage.getItem(key)
    if (value !== null) data[key] = value
  }
  return JSON.stringify({ format: "cloudbridge-progress-backup", version: 1, createdAt: now.toISOString(), data })
}

export function parseProgressBackup(text: string): ProgressBackup {
  if (text.length > maximumBackupLength) throw new Error("Backup is larger than the 2 MB limit.")
  let value: unknown
  try { value = JSON.parse(text) } catch { throw new Error("Backup is not valid JSON.") }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid backup format.")
  const candidate = value as Record<string, unknown>
  if (candidate.format !== "cloudbridge-progress-backup" || candidate.version !== 1 ||
      typeof candidate.createdAt !== "string" || !Number.isFinite(Date.parse(candidate.createdAt))) {
    throw new Error("Not a supported CloudBridge progress backup.")
  }
  if (!candidate.data || typeof candidate.data !== "object" || Array.isArray(candidate.data)) {
    throw new Error("Backup has no valid progress data.")
  }
  const data = candidate.data as Record<string, unknown>
  if (Object.keys(data).length === 0) throw new Error("Backup has no saved progress to import.")
  for (const [key, saved] of Object.entries(data)) {
    if (!allowedKeys.has(key) || typeof saved !== "string" || saved.length > maximumBackupLength) {
      throw new Error("Backup includes unsupported or invalid data.")
    }
    if (key === "cloudbridge_welcome_completed") {
      if (saved !== "true" && saved !== "false") throw new Error("Invalid welcome setting in backup.")
    } else if (key === handsOnStorageKey) {
      let parsed: unknown
      try { parsed = JSON.parse(saved) } catch { throw new Error("Invalid self-reported hands-on progress.") }
      if (!isValidHandsOnProgress(parsed)) {
        throw new Error("Invalid self-reported hands-on progress.")
      }
    } else if (key.startsWith("cloudbridge-plan-") && !key.startsWith("cloudbridge-plan-legacy")) {
      if (saved.length > 150) throw new Error("Invalid study-plan setting in backup.")
    } else {
      try { JSON.parse(saved) } catch { throw new Error(`Invalid JSON for saved key: ${key}`) }
    }
  }
  return {
    format: "cloudbridge-progress-backup",
    version: 1,
    createdAt: candidate.createdAt,
    data: data as Record<string, string>,
  }
}

/** Import writes the supplied keys only; other existing keys remain untouched.
 * Roll back all changed keys if the browser refuses to save any item.
 */
export function importProgressBackup(storage: ProgressStorage, backup: ProgressBackup): void {
  const valid = parseProgressBackup(JSON.stringify(backup))
  const before = new Map<string, string | null>()
  for (const key of Object.keys(valid.data)) before.set(key, storage.getItem(key))
  try {
    for (const [key, saved] of Object.entries(valid.data)) storage.setItem(key, saved)
  } catch {
    for (const [key, oldValue] of before) {
      try { if (oldValue === null) storage.removeItem(key); else storage.setItem(key, oldValue) } catch { /* storage may be blocked */ }
    }
    throw new Error("Could not write the backup to browser storage. Original data was restored where possible.")
  }
}
