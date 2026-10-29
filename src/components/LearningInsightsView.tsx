import RevisionCoach from "./RevisionCoach"
import { getPracticeInsights } from "../learningInsights"
import { getScenarioOverview, type ScenarioProgress } from "../scenarioProgress"
import { getLearningOverview } from "../learningStatistics"
import type { LearningProgress } from "../learningProgress"
import type { AZ900Category } from "../az900Exam"

export default function LearningInsightsView({ learningProgress, scenarioProgress, onReviewDomain, onBrowseLessons, onOpenModule, onPracticeObjective }: {
  learningProgress: LearningProgress
  scenarioProgress: ScenarioProgress
  onReviewDomain: (category: AZ900Category) => void
  onBrowseLessons: () => void
  onOpenModule: (moduleId: string) => void
  onPracticeObjective: (objectiveId: string) => void
}) {
  const insight = getPracticeInsights(learningProgress.practiceExamHistory)
  const scenarios = getScenarioOverview(scenarioProgress)
  const lessons = getLearningOverview(learningProgress)
  return (
    <section className="insights-view" aria-labelledby="insights-title">
      <div className="view-intro">
        <div className="eyebrow">CloudBridge V1.7 · Evidence-based revision</div>
        <h1 className="view-title" id="insights-title">Learning insights</h1>
        <p>Understand how your CloudBridge practice is going and decide which Azure topic to revisit next.</p>
        <p className="exam-verification-note">These percentages use CloudBridge-created questions, many still awaiting independent content review. They are not Microsoft exam scores or a prediction of certification readiness.</p>
      </div>
      <div className="insights-summary" aria-label="Learning activity summary">
        <div><strong>{lessons.completedLessons}/{lessons.totalLessons}</strong><span>Lessons completed</span></div>
        <div><strong>{scenarios.attempted}/{scenarios.total}</strong><span>Scenarios attempted</span></div>
        <div><strong>{insight.recordedAttempts}</strong><span>Practice-exam attempts</span></div>
        <div><strong>{insight.latestPerExamAverage === null ? "—" : `${insight.latestPerExamAverage}%`}</strong><span>Mean of latest result for each exam</span></div>
      </div>
      <section className="insights-panel" aria-labelledby="domain-insights-title">
        <h2 id="domain-insights-title">Performance by AZ-900 domain</h2>
        <p>Based on only your latest recorded attempt for each distinct practice exam. Unanswered questions count as incorrect, and questions may remain unverified.</p>
        {insight.byDomain.map((item) => (
          <div className="insights-domain" key={item.category}>
            <div className="insights-domain-heading"><strong>{item.category}</strong><span>{item.total ? `${item.correct}/${item.total} · ${item.percent}%` : "No exam questions attempted"}</span></div>
            <div className="insights-track" role="progressbar" aria-label={`${item.category} practice score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent ?? 0}><span style={{ width: `${item.percent ?? 0}%` }}/></div>
            <small>{item.notesReviewed} questions checked against the supplied notes; all selected questions still need independent official-documentation review. {item.answered < item.total ? `${item.total - item.answered} unanswered.` : ""}</small>
            <button type="button" className="secondary-control" onClick={() => onReviewDomain(item.category)}>Practise this domain</button>
          </div>
        ))}
        {insight.weakestCategory && (
          <p className="insights-tip"><strong>Suggested next topic:</strong> {insight.weakestCategory}. This is based on your lower observed CloudBridge practice percentage, not a verified weakness on the official exam.</p>
        )}
        {!insight.recordedAttempts && <p className="insights-tip">Finish a practice exam to see domain comparisons. You can still study lessons or practise scenarios now.</p>}
      </section>
      <section className="insights-panel" aria-labelledby="recent-insights-title">
        <h2 id="recent-insights-title">Recent exam attempts</h2>
        {insight.recentAttempts.length ? (
          <div className="insights-history">
            {insight.recentAttempts.map((item) => (
              <div className="insights-history-row" key={`${item.attemptId}:${item.completedAt}`}>
                <span><strong>{item.examId.replace("exam-", "Practice Exam ")}</strong><small>{new Date(item.completedAt).toLocaleDateString()} · {item.correct} of {item.total} questions</small></span>
                <strong>{item.percent}%</strong>
              </div>
            ))}
          </div>
        ) : <p>No completed practice exams yet.</p>}
        {insight.recordedAttempts > insight.distinctExams && <p className="exam-verification-note">Your history includes retakes. The domain comparison uses only the most recent attempt per exam to avoid counting repeated questions multiple times.</p>}
        <p className="exam-verification-note">{insight.notesReviewedInLatestExams} of {insight.totalQuestionsInLatestExams} questions in these latest exams have been compared to the supplied notes. None of this bank has independent official-documentation approval.</p>
      </section>
      <RevisionCoach learningProgress={learningProgress} scenarioProgress={scenarioProgress} onOpenModule={onOpenModule} onPracticeObjective={onPracticeObjective} onReviewDomain={onReviewDomain} />
      <button type="button" className="primary-button" onClick={onBrowseLessons}>Browse learning modules</button>
    </section>
  )
}
