import { useEffect, useState } from "react"
import { guidedLabs, evaluateLab, normalizeLabProgress, labProgressStorageKey, type LabProgress } from "../azureLabs"
import { supplementalStorageObjectives } from "../az900Supplement"

function restoreLabs(): LabProgress {
  try { const raw = window.localStorage.getItem(labProgressStorageKey); return raw ? normalizeLabProgress(JSON.parse(raw)) : {} }
  catch { return {} }
}

export default function AzureLabsView({ onStudyActivity }: { onStudyActivity: () => void }) {
  const [labId, setLabId] = useState<"storage" | "network">("storage")
  const [stepIndex, setStepIndex] = useState(0)
  const [choices, setChoices] = useState<(number | null)[]>([])
  const [checked, setChecked] = useState(false)
  const [saved, setSaved] = useState<LabProgress>(restoreLabs)
  const [storageWarning, setStorageWarning] = useState("")
  const lab = guidedLabs.find((item) => item.id === labId)!
  const step = lab.steps[stepIndex]
  const currentChoice = choices[stepIndex] ?? null
  const lastResult = saved[labId]
  const lastScore = lastResult ? evaluateLab(lab, lastResult.selected) : null

  useEffect(() => { setStepIndex(0); setChecked(false); setChoices([]) }, [labId])

  function choose(index: number) {
    if (checked) return
    setChoices((current) => { const next = [...current]; next[stepIndex] = index; return next })
  }

  function advance() {
    if (stepIndex + 1 < lab.steps.length) {
      setStepIndex(stepIndex + 1)
      setChecked(false)
      return
    }
    const answerIndices = choices.map((choice) => choice ?? -1)
    const result = evaluateLab(lab, answerIndices)
    if (!result) return
    const next = { ...saved, [lab.id]: { selected: answerIndices, completedAt: new Date().toISOString() } }
    try {
      window.localStorage.setItem(labProgressStorageKey, JSON.stringify(next))
      setStorageWarning("")
    } catch { setStorageWarning("This attempt could not be saved in the browser. You can still review the answers on this screen.") }
    setSaved(next)
    onStudyActivity()
    setStepIndex(0)
    setChoices([])
    setChecked(false)
  }

  return (
    <section className="labs-view" aria-label="Guided Azure learning labs">
      <div className="view-intro">
        <div className="eyebrow">CloudBridge V1.5 · Guided decisions</div>
        <h1 className="view-title">Azure practice labs</h1>
        <p>Apply your Azure notes to storage and networking decisions in short, step-by-step simulations. Your earlier course and exam progress is unaffected.</p>
        <p className="scenario-source-note"><strong>Simulation only:</strong> no connection to an Azure subscription, no resource deployment, and no official Microsoft exam score. These activities provide practice evidence, not proof of hands-on configuration.</p>
      </div>
      <div className="lab-switcher" role="group" aria-label="Select guided lab">
        {guidedLabs.map((item) => <button key={item.id} type="button" aria-pressed={labId === item.id} className={labId === item.id ? "primary-button" : "secondary-control"} onClick={() => setLabId(item.id)}>{item.title}</button>)}
      </div>
      <div className="lab-layout">
        <article className="lab-panel">
          <p className="eyebrow">Step {stepIndex + 1} of {lab.steps.length}</p>
          <h2>{lab.title}</h2>
          <p>{lab.context}</p>
          <p className="scenario-objective"><strong>Linked learning objectives:</strong> {lab.objectiveRefs.join(", ")}</p>
          {lastScore && <p className="lab-previous"><strong>Previous completed attempt:</strong> {lastScore.correct}/{lastScore.total} decisions correct. You can retry to improve your understanding.</p>}
          <fieldset className="scenario-options" disabled={checked}>
            <legend>{step.prompt}</legend>
            {step.choices.map((choice, index) => <label className={`scenario-option ${currentChoice === index ? "scenario-option-selected" : ""}`} key={choice}>
              <input type="radio" name={`lab-${lab.id}-${step.id}`} checked={currentChoice === index} onChange={() => choose(index)} />
              <span>{String.fromCharCode(65 + index)}. {choice}</span>
            </label>)}
          </fieldset>
          {checked && <div className={`scenario-feedback ${currentChoice === step.correctIndex ? "scenario-feedback-correct" : "scenario-feedback-review"}`} role="status">
            <strong>{currentChoice === step.correctIndex ? "Good decision" : "Review this decision"}</strong>
            <p>{step.explanation}</p>
            {currentChoice !== step.correctIndex && <p><strong>Best answer:</strong> {step.choices[step.correctIndex]}</p>}
          </div>}
          <div className="scenario-actions">
            {stepIndex > 0 && <button type="button" className="secondary-control" onClick={() => { setStepIndex((i) => i - 1); setChecked(false) }}>Previous step</button>}
            {!checked
              ? <button type="button" className="primary-button" disabled={currentChoice === null} onClick={() => setChecked(true)}>Check decision</button>
              : <button type="button" className="primary-button" onClick={advance}>{stepIndex + 1 < lab.steps.length ? "Next step" : "Finish and save attempt"}</button>}
          </div>
          {storageWarning && <p role="alert" className="scenario-warning">{storageWarning}</p>}
          <p className="lab-takeaway">{lab.takeaway}</p>
        </article>
        {lab.id === "storage" && <aside className="lab-panel lab-objectives" aria-label="Supplemental storage learning objectives">
          <h3>Azure Storage objectives from your detailed notes</h3>
          <p>These six items were missing from the separate objectives handout. They are tracked separately from its 63 original objectives.</p>
          <ol>{supplementalStorageObjectives.map((item) => <li key={item.id}><strong>{item.id}: {item.text}</strong><p>{item.keyIdea}</p></li>)}</ol>
        </aside>}
        {lab.id === "network" && <aside className="lab-panel lab-objectives">
          <h3>Safe networking checklist</h3>
          <p>Separate web and database tiers, allow only necessary application traffic, avoid public administrative ports, and review real routing and permissions before deploying.</p>
          <p>The networking exercise supports objective LO-051 conceptually. You still need a genuine Azure sandbox or supervised lab for hands-on configuration evidence.</p>
        </aside>}
      </div>
    </section>
  )
}
