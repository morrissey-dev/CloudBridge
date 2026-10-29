import { useEffect, useState } from "react"
import { sourceLearningObjectives } from "../learningObjectives"
import { scenarioQuestions } from "../scenarioQuestions"
import { filterScenarios, getScenarioReviewSummary, type ScenarioFilter } from "../scenarioFilters"
import {
  getScenarioOverview,
  normalizeScenarioProgress,
  recordScenarioAnswer,
  scenarioProgressStorageKey,
  type ScenarioProgress,
} from "../scenarioProgress"

function getStoredScenarioProgress(): ScenarioProgress {
  try {
    const raw = window.localStorage.getItem(scenarioProgressStorageKey)
    return raw ? normalizeScenarioProgress(JSON.parse(raw)) : {}
  } catch {
    return {}
  }
}

export default function ScenarioPracticeView({ onStudyActivity, initialObjectiveId }: {
  onStudyActivity: () => void
  initialObjectiveId?: string | null
}) {
  const [progress, setProgress] = useState<ScenarioProgress>(getStoredScenarioProgress)
  const [filter, setFilter] = useState<ScenarioFilter>("all")
  const [activeScenarioId, setActiveScenarioId] = useState(() =>
    scenarioQuestions.find((item) => item.objectiveId === initialObjectiveId)?.id ?? scenarioQuestions[0].id,
  )
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const matchingScenarios = filterScenarios(scenarioQuestions, progress, filter)
  // Keep the submitted question visible for feedback even if it no longer matches
  // an "unattempted" or "needs review" filter after the answer is recorded.
  const scenario = scenarioQuestions.find((item) => item.id === activeScenarioId)
  const objective = sourceLearningObjectives.find((item) => item.id === scenario?.objectiveId)
  const overview = getScenarioOverview(progress)
  const review = getScenarioReviewSummary(scenarioQuestions, progress)
  const globalIndex = scenarioQuestions.findIndex((item) => item.id === scenario?.id)
  const matchingIndex = matchingScenarios.findIndex((item) => item.id === scenario?.id)

  useEffect(() => {
    if (!dirty) return
    try {
      window.localStorage.setItem(scenarioProgressStorageKey, JSON.stringify(progress))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [progress, dirty])

  function navigate(id: string) {
    setActiveScenarioId(id)
    setSelected(null)
    setSubmitted(false)
  }

  function changeFilter(value: ScenarioFilter) {
    setFilter(value)
    const first = filterScenarios(scenarioQuestions, progress, value)[0]
    // In an empty filter, don't display an unrelated scenario.
    setActiveScenarioId(first?.id ?? "")
    setSelected(null)
    setSubmitted(false)
  }

  function next() {
    if (!matchingScenarios.length) { setActiveScenarioId(""); return }
    const nextIndex = matchingIndex < 0 ? 0 : (matchingIndex + 1) % matchingScenarios.length
    navigate(matchingScenarios[nextIndex].id)
  }

  function previous() {
    if (!matchingScenarios.length || matchingIndex <= 0) return
    navigate(matchingScenarios[matchingIndex - 1].id)
  }

  function submit() {
    if (selected === null || submitted || !scenario) return
    setProgress((current) => recordScenarioAnswer(current, scenario.id, selected, new Date().toISOString()))
    setDirty(true)
    setSubmitted(true)
    onStudyActivity()
  }

  return (
    <section className="scenario-view" aria-label="Objective-aligned scenario practice">
      <div className="view-intro">
        <div className="eyebrow">CloudBridge V1.4 · Learn by applying</div>
        <h1 className="view-title">Scenario practice</h1>
        <p>Make decisions in realistic cloud situations. Each question links to an objective from your learning materials and explains the answer after you try.</p>
        <p className="scenario-source-note">CloudBridge-created practice, not official Microsoft exam questions. Scenarios currently support {new Set(scenarioQuestions.map((item) => item.objectiveId)).size} of {sourceLearningObjectives.length} mapped objectives. The remaining objectives need further assessment; one answered scenario does not prove mastery.</p>
      </div>

      <div className="scenario-summary" aria-label="Scenario practice progress">
        <div><strong>{overview.attempted}/{overview.total}</strong><span>Attempted</span></div>
        <div><strong>{overview.latestCorrect}/{overview.total}</strong><span>Correct on latest attempt</span></div>
        <div><strong>{review.needsReview}</strong><span>Questions to review</span></div>
      </div>
      <div className="scenario-filter-tools">
        <label htmlFor="scenario-filter">Choose what to practise</label>
        <select id="scenario-filter" value={filter} onChange={(event) => changeFilter(event.target.value as ScenarioFilter)}>
          <option value="all">All {scenarioQuestions.length} scenarios</option>
          <option value="unattempted">Not attempted ({review.unattempted})</option>
          <option value="needs-review">Review mistakes ({review.needsReview})</option>
          <option value="Cloud concepts">Cloud concepts</option>
          <option value="Azure architecture and services">Architecture and services</option>
          <option value="Azure management and governance">Management and governance</option>
        </select>
        <span role="status" aria-live="polite">{matchingScenarios.length} matching questions</span>
      </div>
      {storageError && <p role="alert" className="scenario-warning">Your browser did not save this practice result. Export your work before closing the tab.</p>}

      <div className="scenario-layout">
        <article className="scenario-card">
          {!scenario ? (
            <div className="scenario-empty" role="status">
              <h2>No questions in this selection</h2>
              <p>{filter === "needs-review" ? "No incorrect latest answers. Change the filter to practise new questions." : "You've attempted all questions in this selection. Explore another topic or practise again."}</p>
              <button className="secondary-control" type="button" onClick={() => changeFilter("all")}>Show all scenarios</button>
            </div>
          ) : (
            <>
              <div className="eyebrow">Scenario {globalIndex + 1} of {scenarioQuestions.length} · {scenario.category}</div>
              <h2>{scenario.title}</h2>
              <div className="scenario-context"><strong>The situation</strong><p>{scenario.situation}</p></div>
              <p className="scenario-objective"><strong>Objective {scenario.objectiveId}:</strong> {objective?.text ?? "Review the linked objective"}</p>
              <fieldset className="scenario-options" disabled={submitted}>
                <legend>{scenario.question}</legend>
                {scenario.choices.map((choice, index) => (
                  <label className={`scenario-option ${selected === index ? "scenario-option-selected" : ""}`} key={choice}>
                    <input type="radio" name={`answer-${scenario.id}`} checked={selected === index} onChange={() => setSelected(index)} />
                    <span>{String.fromCharCode(65 + index)}. {choice}</span>
                  </label>
                ))}
              </fieldset>
              {submitted && selected !== null && (
                <div className={`scenario-feedback ${selected === scenario.correctIndex ? "scenario-feedback-correct" : "scenario-feedback-review"}`} role="status">
                  <strong>{selected === scenario.correctIndex ? "Good decision" : "Review this decision"}</strong>
                  <p>{scenario.explanation}</p>
                  <p><strong>Remember:</strong> {scenario.takeaway}</p>
                  {selected !== scenario.correctIndex && <p><strong>Best answer:</strong> {scenario.choices[scenario.correctIndex]}</p>}
                </div>
              )}
              <div className="scenario-actions">
                <button type="button" className="secondary-control" disabled={matchingIndex <= 0} onClick={previous}>Previous</button>
                {!submitted ? (
                  <button type="button" className="primary-button" disabled={selected === null} onClick={submit}>Check my answer</button>
                ) : (
                  <>
                    <button type="button" className="secondary-control" onClick={() => { setSelected(null); setSubmitted(false) }}>Try again</button>
                    <button type="button" className="primary-button" onClick={next}>Next matching question</button>
                  </>
                )}
              </div>
            </>
          )}
        </article>
        <aside className="scenario-index" aria-label="Select a practice scenario">
          <h3>Choose a scenario</h3>
          <div className="scenario-index-items">
            {matchingScenarios.map((item) => (
              <button type="button" key={item.id} aria-current={item.id === activeScenarioId ? "step" : undefined} className={item.id === activeScenarioId ? "scenario-index-active" : ""} onClick={() => navigate(item.id)}>
                <span>{item.title}</span>
                <small>{progress[item.id] ? (progress[item.id].correct ? "Last answer correct" : "Needs review") : "Not attempted"}</small>
              </button>
            ))}
            {!matchingScenarios.length && <p>No matching scenarios.</p>}
          </div>
        </aside>
      </div>
    </section>
  )
}
