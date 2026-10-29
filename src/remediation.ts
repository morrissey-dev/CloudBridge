import { az900ExamQuestions, type AZ900Category, type AZ900Question } from "./az900Exam.ts"
import { modules } from "./curriculum.ts"
import { sourceLearningObjectives, type SourceLearningObjective } from "./learningObjectives.ts"
import type { CompletedExamAttempt, LearningProgress } from "./learningProgress.ts"
import { scenarioQuestions, type ScenarioQuestion } from "./scenarioQuestions.ts"
import type { ScenarioProgress } from "./scenarioProgress.ts"

/**
 * Editorial crosswalk between exact question-bank objective labels and the user's
 * supplied learning objectives. Not a fuzzy keyword match and not an assertion
 * that the source material has been independently validated by Microsoft.
 * When no defensible match exists, an exam error stays explicitly unmapped.
 */
export const examObjectiveCrosswalk: Readonly<Record<string, readonly string[]>> = {
  "Define cloud computing": ["LO-001"],
  "Apply the shared responsibility model": ["LO-002"],
  "Compare public cloud use cases": ["LO-003", "LO-004"],
  "Identify private cloud use cases": ["LO-004"],
  "Choose a hybrid cloud model": ["LO-004"],
  "Explain consumption-based pricing": ["LO-005"],
  "Explain predictability and cloud pricing models": ["LO-006", "LO-008"],
  "Describe high availability and reliability": ["LO-007", "LO-008"],
  "Distinguish scalability and elasticity": ["LO-007"],
  "Explain cloud agility and economies of scale": ["LO-010"],
  "Describe sustainability through efficient resource use": ["LO-011"],
  "Estimate and manage Azure costs": ["LO-012", "LO-013", "LO-014"],
  "Use budgets and cost alerts": ["LO-014"],
  "Apply Azure Policy": ["LO-018", "LO-019"],
  "Describe Microsoft Purview": ["LO-017"],
  "Use resource locks and tags": ["LO-021", "LO-015"],
  "Locate compliance and audit documentation": ["LO-022"],
  "Select Azure management tools": ["LO-023", "LO-024"],
  "Describe Azure Arc and infrastructure as code": ["LO-025", "LO-026"],
  "Differentiate Advisor, Service Health, and Monitor": ["LO-027", "LO-028", "LO-029"],
  "Use monitoring logs and application insights": ["LO-029"],
  "Describe Azure regions and region pairs": ["LO-030"],
  "Describe availability zones": ["LO-031"],
  "Choose resource group and subscription scopes": ["LO-033", "LO-034"],
  "Describe the Azure resource hierarchy": ["LO-033", "LO-034", "LO-035", "LO-036"],
  "Select an Azure compute hosting option": ["LO-037", "LO-040"],
  "Select event-driven serverless compute": ["LO-037"],
  "Choose container hosting options": ["LO-037", "LO-040"],
  "Select managed web application hosting": ["LO-040"],
  "Choose Azure AI services": ["LO-041"],
  "Choose IoT services": ["LO-041"],
  "Describe virtual networks and network security groups": ["LO-043", "LO-047", "LO-051"],
  "Choose hybrid network connectivity": ["LO-044", "LO-045", "LO-048", "LO-049"],
  "Distinguish authentication, Conditional Access, and RBAC": ["LO-053", "LO-056", "LO-058", "LO-059"],
  "Apply Zero Trust and defense in depth": ["LO-060", "LO-061"],
  "Protect secrets and assess cloud security posture": ["LO-062", "LO-063"],
  // Storage and database subjects are in the detailed notes but missing from
  // the 63-objective handout, so they are deliberately not forced onto a LO.
}

export type RevisionReason = "exam-error" | "scenario-error" | "unstarted"
export type RevisionAction = {
  objectiveId: string
  objectiveText: string
  moduleId: string
  moduleTitle: string
  lessonTitle: string
  lessonCompleted: boolean
  reasons: RevisionReason[]
  missedExamQuestions: number
  missedScenarios: number
  scenarioAvailable: boolean
  priority: number
}
export type RevisionPlan = {
  examMistakes: number
  scenarioMistakes: number
  unmappedExamMistakes: number
  actions: RevisionAction[]
  suggestedExamDomain: AZ900Category | null
  message: string
}

function latestExamAttempts(history: readonly CompletedExamAttempt[]): CompletedExamAttempt[] {
  const sorted = [...history].filter(item =>
    typeof item.examId === "string" &&
    Number.isFinite(Date.parse(item.completedAt)) && Array.isArray(item.questionIds) &&
    item.questionIds.length > 0,
  ).sort((a,b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
  const byExam = new Map<string, CompletedExamAttempt>()
  for (const item of sorted) if (!byExam.has(item.examId)) byExam.set(item.examId,item)
  return [...byExam.values()]
}

/**
 * Generates read-only, local suggestions. Never changes recorded assessment
 * scores, marks a lesson complete, or claims a wrong answer proves deficiency.
 * Only the most recent attempt for each distinct exam is counted.
 */
export function getRevisionPlan(
  learning: LearningProgress,
  scenarioProgress: ScenarioProgress,
  options: {
    bank?: readonly AZ900Question[]
    scenarios?: readonly ScenarioQuestion[]
    objectives?: readonly SourceLearningObjective[]
    limit?: number
  } = {},
): RevisionPlan {
  const bank = options.bank ?? az900ExamQuestions
  const scenarios = options.scenarios ?? scenarioQuestions
  const objectives = options.objectives ?? sourceLearningObjectives
  const examById = new Map(bank.map(item => [item.id,item]))
  const objectiveById = new Map(objectives.map(item => [item.id,item]))
  const evidence = new Map<string, { exam: Set<string>, scenario: Set<string> }>()
  const categoryMistakes = new Map<AZ900Category,number>()
  let examMistakes=0, scenarioMistakes=0, unmappedExamMistakes=0
  const addEvidence = (id: string, type: "exam" | "scenario", questionId: string) => {
    if (!objectiveById.has(id)) return
    const current = evidence.get(id) ?? {exam:new Set<string>(),scenario:new Set<string>()}
    current[type].add(questionId)
    evidence.set(id,current)
  }
  for (const attempt of latestExamAttempts(learning.practiceExamHistory)) {
    for (const id of new Set(attempt.questionIds)) {
      const question = examById.get(id)
      if (!question) continue
      if (attempt.answers[id] === question.correctAnswer) continue
      examMistakes++
      categoryMistakes.set(question.category,(categoryMistakes.get(question.category)??0)+1)
      const objectivesForQuestion = (examObjectiveCrosswalk[question.objective] ?? [])
        .filter(id => objectiveById.has(id))
      if (!objectivesForQuestion.length) unmappedExamMistakes++
      for (const objectiveId of objectivesForQuestion) addEvidence(objectiveId,"exam",id)
    }
  }
  for (const question of scenarios) {
    const result = scenarioProgress[question.id]
    if (!result || result.correct || !objectiveById.has(question.objectiveId)) continue
    scenarioMistakes++
    addEvidence(question.objectiveId,"scenario",question.id)
  }
  // With no recorded errors, surface incomplete objectives as optional next
  // activities, never label them weaknesses or failures.
  let fallback = false
  if (!evidence.size && examMistakes === 0 && scenarioMistakes === 0) {
    fallback = true
    for (const objective of objectives) {
      const module = modules.find(item => item.id === objective.moduleId)
      const index = module?.sections.flatMap(section => section.concepts).findIndex(x => x.title === objective.lessonTitle) ?? -1
      if (index < 0 || !!learning.modules[objective.moduleId]?.completedLessonIndexes.includes(index)) continue
      addEvidence(objective.id,"scenario", "")
      if (evidence.size >= 3) break
    }
  }
  const actions: RevisionAction[]=[]
  for (const [objectiveId, items] of evidence) {
    const objective = objectiveById.get(objectiveId)
    if (!objective) continue
    const module=modules.find(item=>item.id===objective.moduleId)
    if (!module) continue
    const lessonIndex = module.sections.flatMap(section=>section.concepts).findIndex(item=>item.title===objective.lessonTitle)
    const lessonCompleted = lessonIndex >= 0 && !!learning.modules[objective.moduleId]?.completedLessonIndexes.includes(lessonIndex)
    const missedExamQuestions=items.exam.size
    const missedScenarios=fallback?0:items.scenario.size
    actions.push({
      objectiveId,objectiveText:objective.text,moduleId:module.id,moduleTitle:module.shortTitle,
      lessonTitle:objective.lessonTitle,lessonCompleted,
      reasons:fallback?["unstarted"]:[...(missedExamQuestions?["exam-error" as const]:[]),...(missedScenarios?["scenario-error" as const]:[])],
      missedExamQuestions,missedScenarios,
      scenarioAvailable:scenarios.some(item=>item.objectiveId===objectiveId),
      priority:fallback?0:missedExamQuestions+missedScenarios+(lessonCompleted?0:0.25),
    })
  }
  actions.sort((a,b)=>b.priority-a.priority || a.objectiveId.localeCompare(b.objectiveId))
  const suggestedExamDomain=[...categoryMistakes].sort((a,b)=>b[1]-a[1])[0]?.[0]??null
  return {
    examMistakes,scenarioMistakes,unmappedExamMistakes,
    actions:actions.slice(0,Math.max(0,Math.min(20,options.limit??5))),
    suggestedExamDomain,
    message:fallback ? (actions.length ? "No current recorded mistakes. These are optional lessons to explore next." : "No revision actions found in your current saved practice.")
      : !actions.length ? "Some incorrect exam questions are not mapped to the supplied 63 objectives. Review the suggested AZ-900 domain instead."
      : "Suggestions come from recent CloudBridge practice only; they are not an official exam-readiness assessment.",
  }
}

/** A suggested session is not an appointment and is never auto-completed. */
export function buildRevisionSessions(actions: readonly RevisionAction[], weeklyDays=4, minutes=30): {
  number: number, objectiveId: string, title: string, lesson: string, minutes: number
}[] {
  if (!Number.isInteger(weeklyDays) || weeklyDays < 2 || weeklyDays > 7) weeklyDays=4
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 90) minutes=30
  return actions.slice(0,weeklyDays).map((action,index)=>({
    number:index+1,objectiveId:action.objectiveId,title:action.objectiveText,lesson:action.lessonTitle,minutes,
  }))
}
