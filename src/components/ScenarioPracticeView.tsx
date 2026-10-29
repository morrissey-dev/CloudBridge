import { useEffect, useState } from "react"
import { sourceLearningObjectives } from "../learningObjectives"
import { scenarioQuestions } from "../scenarioQuestions"
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

export default function ScenarioPracticeView({ onStudyActivity }: { onStudyActivity: () => void }) {
  const [progress, setProgress] = useState<ScenarioProgress>(getStoredScenarioProgress)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const scenario = scenarioQuestions[activeIndex]
  const objective = sourceLearningObjectives.find((item) => item.id === scenario.objectiveId)
  const overview = getScenarioOverview(progress)

  useEffect(() => {
    if (!dirty) return
    try {
      window.localStorage.setItem(scenarioProgressStorageKey, JSON.stringify(progress))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [progress, dirty])

  function navigate(index: number) {
    setActiveIndex(index)
    setSelected(null)
    setSubmitted(false)
  }

  function submit() {
    if (selected === null || submitted) return
    setProgress((current) => recordScenarioAnswer(current, scenario.id, selected, new Date().toISOString()))
    setDirty(true)
    setSubmitted(true)
    onStudyActivity()
  }

  return (
    <section className="scenario-view" aria-label="Objective-aligned scenario practice">
      <div className="view-intro">
        <div className="eyebrow">CloudBridge V1.2 · Learn by applying</div>
        <div className="view-title">Scenario practice</div>
        <p>Make decisions in realistic cloud situations. Each original question links to an objective from your study notes and explains the reasoning after you answer.</p>
        <p className="scenario-source-note">Study practice, not official Microsoft exam questions. This first set covers 12 of the 63 mapped objectives and is not proof of certification readiness.</p>
      </div>

      <div className="scenario-summary" aria-label="Scenario practice progress">
        <div><strong>{overview.attempted}/{overview.total}</strong><span>Attempted</span></div>
        <div><strong>{overview.latestCorrect}/{overview.total}</strong><span>Correct on latest attempt</span></div>
        <div><strong>{Math.round((overview.attempted / overview.total) * 100)}%</strong><span>Practice coverage</span></div>
      </div>
      {storageError && <p role="alert" className="scenario-warning">Your browser did not save this practice result. Please allow storage or export your work before closing the tab.</p>}

      <div className="scenario-layout">
        <article className="scenario-card">
          <div className="eyebrow">Scenario {activeIndex + 1} of {scenarioQuestions.length} · {scenario.category}</div>
          <h2>{scenario.title}</h2>
          <div className="scenario-context"><strong>The situation</strong><p>{scenario.situation}</p></div>
          <p className="scenario-objective"><strong>Objective {scenario.objectiveId}:</strong> {objective?.text ?? "Review the linked learning objective"}</p>
          <fieldset className="scenario-options" disabled={submitted}>
            <legend>{scenario.question}</legend>
            {scenario.choices.map((choice, index) => (
              <label className={`scenario-option ${selected === index ? "scenario-option-selected" : ""}`} key={choice}>
                <input type="radio" name={`answer-${scenario.id}-${activeIndex}`} checked={selected === index} onChange={() => setSelected(index)} />
                <span>{String.fromCharCode(65 + index)}. {choice}</span>
              </label>
            ))}
          </fieldset>
          {submitted && selected !== null && (
            <div className={`scenario-feedback ${selected === scenario.correctIndex ? "scenario-feedback-correct" : "scenario-feedback-review"}`} role="status">
              <strong>{selected === scenario.correctIndex ? "Good decision" : "Review this decision"}</strong>
              <p>{scenario.explanation}</p>
              <p><strong>Remember:</strong> {scenario.takeaway}</p>
            </div>
          )}
          <div className="scenario-actions">
            <button type="button" className="secondary-control" disabled={activeIndex === 0} onClick={() => navigate(activeIndex - 1)}>Previous</button>
            {!submitted ? (
              <button type="button" className="primary-button" disabled={selected === null} onClick={submit}>Check my answer</button>
            ) : (
              <>
                <button type="button" className="secondary-control" onClick={() => { setSelected(null); setSubmitted(false) }}>Try again</button>
                <button type="button" className="primary-button" onClick={() => navigate((activeIndex + 1) % scenarioQuestions.length)}>
                  {activeIndex === scenarioQuestions.length - 1 ? "Back to first scenario" : "Next scenario"}
                </button>
              </>
            )}
          </div>
        </article>
        <aside className="scenario-index" aria-label="Select a practice scenario">
          <h3>Choose a scenario</h3>
          <div className="scenario-index-items">
            {scenarioQuestions.map((item, index) => (
              <button type="button" key={item.id} aria-current={index === activeIndex ? "step" : undefined} className={index === activeIndex ? "scenario-index-active" : ""} onClick={() => navigate(index)}>
                <span>{index + 1}. {item.title}</span>
                <small>{progress[item.id] ? (progress[item.id].correct ? "Last answer correct" : "Needs review") : "Not attempted"}</small>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
