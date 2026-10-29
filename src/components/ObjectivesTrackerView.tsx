import { useMemo, useState, type ChangeEvent } from "react"
import { modules } from "../curriculum"
import { sourceLearningObjectives } from "../learningObjectives"
import type { LearningProgress } from "../learningProgress"
import { normalizeScenarioProgress, scenarioProgressStorageKey } from "../scenarioProgress"
import { exportProgressBackup, importProgressBackup, parseProgressBackup, type ProgressBackup } from "../progressBackup"
import {
  getObjectiveEvidence, getObjectiveSummary, normalizeObjectiveConfidence,
  objectiveConfidenceStorageKey, setObjectiveConfidence, type ObjectiveConfidence,
  type ObjectiveConfidenceMap,
} from "../objectiveTracker"

function loadConfidence(): ObjectiveConfidenceMap {
  try {
    const stored = window.localStorage.getItem(objectiveConfidenceStorageKey)
    return stored ? normalizeObjectiveConfidence(JSON.parse(stored)) : {}
  } catch { return {} }
}

function loadScenarios() {
  try {
    const stored = window.localStorage.getItem(scenarioProgressStorageKey)
    return stored ? normalizeScenarioProgress(JSON.parse(stored)) : {}
  } catch { return {} }
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function ObjectivesTrackerView({
  learningProgress, legacyCompletedModuleIds, onBrowseModules, onOpenScenarios,
}: {
  learningProgress: LearningProgress
  legacyCompletedModuleIds: ReadonlySet<string>
  onBrowseModules: () => void
  onOpenScenarios: (objectiveId: string) => void
}) {
  const [confidence, setConfidence] = useState(loadConfidence)
  const [scenarioProgress] = useState(loadScenarios)
  const [moduleFilter, setModuleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [storageWarning, setStorageWarning] = useState("")
  const [backupMessage, setBackupMessage] = useState("")
  const [pendingImport, setPendingImport] = useState<ProgressBackup | null>(null)
  const summary = getObjectiveSummary(confidence, learningProgress, scenarioProgress, legacyCompletedModuleIds)
  const visible = useMemo(() => sourceLearningObjectives.filter((objective) => {
    if (moduleFilter !== "all" && objective.moduleId !== moduleFilter) return false
    if (statusFilter !== "all" && (confidence[objective.id] ?? "review") !== statusFilter) return false
    return `${objective.id} ${objective.text} ${objective.lessonTitle}`.toLowerCase().includes(search.toLowerCase().trim())
  }), [moduleFilter, statusFilter, search, confidence])

  function updateConfidence(id: string, value: ObjectiveConfidence) {
    const next = setObjectiveConfidence(confidence, id, value)
    setConfidence(next)
    try {
      window.localStorage.setItem(objectiveConfidenceStorageKey, JSON.stringify(next))
      setStorageWarning("")
    } catch {
      setStorageWarning("Your confidence rating could not be saved in this browser. Export a backup if possible.")
    }
  }

  function exportBackup() {
    try {
      const raw = exportProgressBackup(window.localStorage)
      downloadText(`cloudbridge-progress-${new Date().toISOString().slice(0, 10)}.json`, raw)
      setBackupMessage("Backup downloaded. Store it somewhere private; it contains your study activity and results.")
    } catch {
      setBackupMessage("Could not read browser progress. Check browser storage permissions.")
    }
  }

  async function selectBackup(event: ChangeEvent<HTMLInputElement>) {
    setPendingImport(null)
    setBackupMessage("")
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (file.size > 2_000_000) { setBackupMessage("Backup file is too large (2 MB maximum).") ; return }
    try {
      const backup = parseProgressBackup(await file.text())
      setPendingImport(backup)
      setBackupMessage(`Ready to restore ${Object.keys(backup.data).length} saved progress entries from ${new Date(backup.createdAt).toLocaleDateString()}. Existing values for these entries will be replaced.`)
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : "Could not read this backup file.")
    }
  }

  function confirmImport() {
    if (!pendingImport) return
    if (!window.confirm("Restore this CloudBridge backup? The included progress entries will replace the current ones in this browser. Export a backup of your current work first.")) return
    try {
      importProgressBackup(window.localStorage, pendingImport)
      window.location.reload() // Refresh all in-memory progress after restore
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : "Could not restore this backup.")
    }
  }

  return (
    <section className="objective-hub" aria-labelledby="objective-hub-title">
      <div className="view-intro">
        <div className="eyebrow">CloudBridge V1.6 · Your learning roadmap</div>
        <h1 id="objective-hub-title" className="view-title">Learning objectives</h1>
        <p>Track the 63 distinct objectives from your study materials, see which lessons you have completed, and identify the objectives with practical-scenario evidence.</p>
        <p className="scenario-source-note"><strong>Important:</strong> “Confident” is your personal reflection. One correct scenario answer is evidence of practice, not a verified mastery score or a predicted Microsoft exam result.</p>
      </div>
      <div className="objective-summary" aria-label="Learning objective coverage">
        <div><strong>{summary.lessonsCompleted}/{summary.total}</strong><span>Objectives with linked lesson completed</span></div>
        <div><strong>{summary.objectivesPracticed}/{summary.objectivesWithScenarios}</strong><span>Objectives with scenario practice attempted</span></div>
        <div><strong>{summary.selfReportedConfident}/{summary.total}</strong><span>Marked confident by you</span></div>
        <div><strong>{summary.objectivesWithMultipleScenarios}/{summary.total}</strong><span>Objectives with 2+ different scenarios available</span></div>
      </div>
      <div className="objective-tools">
        <label>Learning module
          <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>
            <option value="all">All modules</option>
            {modules.map((module) => <option key={module.id} value={module.id}>{module.shortTitle}</option>)}
          </select>
        </label>
        <label>My confidence
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All ratings</option>
            <option value="review">Needs review / unrated</option>
            <option value="studying">Still learning</option>
            <option value="confident">Confident</option>
          </select>
        </label>
        <label>Search objectives
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. virtual networks" />
        </label>
      </div>
      {storageWarning && <p role="alert" className="scenario-warning">{storageWarning}</p>}
      <p className="objective-count" aria-live="polite">Showing {visible.length} of {sourceLearningObjectives.length} learning objectives</p>
      <div className="objective-list">
        {visible.map((objective) => {
          const evidence = getObjectiveEvidence(objective.id, learningProgress, scenarioProgress, legacyCompletedModuleIds)
          const module = modules.find((item) => item.id === objective.moduleId)
          return <article className="objective-item" key={objective.id}>
            <div className="objective-item-title"><span className="objective-code">{objective.id}</span><h2>{objective.text}</h2></div>
            <p className="objective-lesson">{module?.shortTitle} · Lesson: {objective.lessonTitle}</p>
            <div className="objective-evidence">
              <span>{evidence.lessonCompleted ? "✓ Linked lesson completed" : "Linked lesson not completed"}</span>
              <span>{evidence.scenarioCount ? `Scenario practice: ${evidence.scenarioAttempted}/${evidence.scenarioCount} attempted, ${evidence.scenarioCorrectOnLatest} latest correct` : "No scenario question yet"}</span>
              {evidence.scenarioCount > 1 && <span>{evidence.scenarioCount} distinct scenario questions available for deeper practice</span>}
              {objective.kind === "guided-practice" && <span>Hands-on exercise needed</span>}
            </div>
            <div className="objective-item-actions">
              <label>My confidence
                <select aria-label={`My confidence for ${objective.id}`} value={confidence[objective.id] ?? "review"} onChange={(event) => updateConfidence(objective.id, event.target.value as ObjectiveConfidence)}>
                  <option value="review">Needs review</option>
                  <option value="studying">Still learning</option>
                  <option value="confident">Confident</option>
                </select>
              </label>
              <button type="button" className="secondary-control" onClick={onBrowseModules}>Browse lessons</button>
              {evidence.scenarioCount > 0 && <button type="button" className="secondary-control" onClick={() => onOpenScenarios(objective.id)}>Practice this objective</button>}
            </div>
          </article>
        })}
        {!visible.length && <p>No objectives match these filters. Try resetting the filters or searching for another term.</p>}
      </div>
      <section className="objective-backup" aria-labelledby="objective-backup-title">
        <h2 id="objective-backup-title">Keep your learning progress safe</h2>
        <p>Progress is saved in this browser, not automatically synced between devices. Export a private JSON backup before changing devices or clearing browser data. Restoring replaces the included saved values.</p>
        <div className="objective-backup-actions">
          <button type="button" className="primary-button" onClick={exportBackup}>Download progress backup</button>
          <label className="objective-file-label">Choose backup to restore
            <input type="file" accept=".json,application/json" onChange={selectBackup}/>
          </label>
          {pendingImport && <button type="button" className="secondary-control" onClick={confirmImport}>Confirm restore</button>}
        </div>
        {backupMessage && <p role="status" className="objective-backup-message">{backupMessage}</p>}
      </section>
    </section>
  )
}
