import type { AZ900Category } from "../az900Exam"
import { buildRevisionSessions, getRevisionPlan } from "../remediation"
import type { LearningProgress } from "../learningProgress"
import type { ScenarioProgress } from "../scenarioProgress"

function readSavedRevisionPreferences(): { weeklyDays: number, minutes: number } {
  try {
    const raw=window.localStorage.getItem("cloudbridge-study-plan-v1")
    const saved=raw?JSON.parse(raw) as Record<string,unknown>:{}
    const days=Number(saved.weeklyDays), minutes=Number(saved.minutes)
    return {weeklyDays:Number.isInteger(days)&&days>=2&&days<=7?days:4,minutes:Number.isInteger(minutes)&&minutes>=15&&minutes<=90?minutes:30}
  } catch { return { weeklyDays:4,minutes:30 } }
}

export default function RevisionCoach({learningProgress, scenarioProgress, onOpenModule, onPracticeObjective, onReviewDomain, weeklyDays, minutes}: {
  learningProgress: LearningProgress
  scenarioProgress: ScenarioProgress
  onOpenModule: (moduleId: string) => void
  onPracticeObjective: (objectiveId: string) => void
  onReviewDomain?: (category: AZ900Category) => void
  weeklyDays?: number
  minutes?: number
}) {
  const plan = getRevisionPlan(learningProgress, scenarioProgress)
  const preferences=readSavedRevisionPreferences()
  const sessions = buildRevisionSessions(plan.actions,weeklyDays ?? preferences.weeklyDays,minutes ?? preferences.minutes)
  return (
    <section className="insights-panel revision-coach" aria-labelledby="revision-coach-title">
      <div className="eyebrow">CloudBridge V1.8 · Personalised study support</div>
      <h2 id="revision-coach-title">Your suggested revision queue</h2>
      <p>{plan.message}</p>
      <p className="exam-verification-note">Based only on locally saved answers. Incomplete content checks and self-reported learning are not proof of mastery; no lessons or tasks are automatically marked complete.</p>
      {plan.examMistakes + plan.scenarioMistakes > 0 && (
        <p className="revision-counts">{plan.examMistakes} incorrect or unanswered questions from the latest attempt for each exam · {plan.scenarioMistakes} scenarios incorrect on their latest attempt</p>
      )}
      {plan.unmappedExamMistakes > 0 && (
        <p className="exam-verification-note">{plan.unmappedExamMistakes} missed exam questions have no exact match in the supplied 63-objective list. They are counted above but excluded from objective-specific recommendations.</p>
      )}
      {plan.suggestedExamDomain && <p className="revision-domain-suggestion"><strong>Area with the most missed exam questions:</strong> {plan.suggestedExamDomain}. {onReviewDomain && <button type="button" className="secondary-control" onClick={() => onReviewDomain(plan.suggestedExamDomain!)}>Practise this domain</button>}</p>}
      {plan.actions.length ? (
        <>
          <ol className="revision-action-list">
            {plan.actions.map((action) => (
              <li className="revision-action" key={action.objectiveId}>
                <div className="revision-action-top"><strong>{action.objectiveId}: {action.objectiveText}</strong><small>{action.moduleTitle}</small></div>
                <p>{action.reasons.includes("unstarted") ? "Suggested next lesson" : `${action.missedExamQuestions} exam mistake(s) · ${action.missedScenarios} scenario mistake(s)`} · Lesson: <strong>{action.lessonTitle}</strong> {action.lessonCompleted ? "(previously completed)" : "(not marked complete)"}</p>
                <div className="revision-actions">
                  <button type="button" className="secondary-control" onClick={() => onOpenModule(action.moduleId)}>Open learning module</button>
                  {action.scenarioAvailable && <button type="button" className="secondary-control" onClick={() => onPracticeObjective(action.objectiveId)}>Practise this objective</button>}
                </div>
              </li>
            ))}
          </ol>
          <h3 className="revision-session-title">Suggested sessions for this week</h3>
          <p className="exam-verification-note">These are study suggestions, not calendar bookings. Your weekly-days and session-duration preferences set the maximum schedule length.</p>
          <ol className="revision-session-list">
            {sessions.map((session) => <li key={session.objectiveId}><span>Session {session.number} · {session.minutes} minutes</span><strong>{session.lesson}</strong><span>Read, recall, then attempt a linked scenario</span></li>)}
          </ol>
        </>
      ) : <p>There are no objective-specific revision actions for this selection. Review the domain above, or complete another scenario to receive linked lesson suggestions.</p>}
    </section>
  )
}
