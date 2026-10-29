import test from "node:test"
import assert from "node:assert/strict"
import { getPracticeInsights } from "./learningInsights.ts"
import type { CompletedExamAttempt } from "./learningProgress.ts"
import type { AZ900Question } from "./az900Exam.ts"

const questions: AZ900Question[] = [
  {id:"cloud",category:"Cloud concepts",objective:"cloud",difficulty:"easy",question:"What is cloud?",options:["A","B","C","D"],correctAnswer:"A",explanation:"A is best."},
  {id:"arch",category:"Azure architecture and services",objective:"arch",difficulty:"medium",question:"What is Azure?",options:["A","B","C","D"],correctAnswer:"C",explanation:"C is best.",verificationStatus:"notes-reviewed",reviewSource:"notes"},
  {id:"gov",category:"Azure management and governance",objective:"gov",difficulty:"medium",question:"What is governance?",options:["A","B","C","D"],correctAnswer:"B",explanation:"B is best."},
]
function attempt(examId: string, attemptId: string, completedAt: string, answers: Record<string,string>, score: number): CompletedExamAttempt {
  return { examId, attemptId, completedAt, questionIds: questions.map(x=>x.id),optionsByQuestion:Object.fromEntries(questions.map(q=>[q.id,[...q.options]])), answers, index:2, score }
}

test("insights are empty with zero attempts and don't invent readiness", () => {
  const value = getPracticeInsights([], questions)
  assert.equal(value.latestPerExamAverage, null)
  assert.equal(value.weakestCategory, null)
  assert.equal(value.totalQuestionsInLatestExams, 0)
  assert.equal(value.byDomain.every(x=>x.percent===null), true)
})

test("latest exam per ID prevents a retake from inflating domain comparisons", () => {
  const history = [
    attempt("exam-1","old","2026-10-10T10:00:00Z",{cloud:"A",arch:"C",gov:"B"},3),
    attempt("exam-1","new","2026-10-12T10:00:00Z",{cloud:"B",arch:"C"},1),
    attempt("exam-2","other","2026-10-11T10:00:00Z",{cloud:"A",arch:"D",gov:"B"},2),
  ]
  const value = getPracticeInsights(history,questions)
  assert.equal(value.recordedAttempts,3)
  assert.equal(value.distinctExams,2)
  assert.equal(value.totalQuestionsInLatestExams,6)
  assert.deepEqual(value.byDomain.map(x=>[x.correct,x.total]),[[1,2],[1,2],[1,2]])
  assert.equal(value.latestAttempt?.attemptId,"new")
  assert.deepEqual(value.recentAttempts.map(x=>x.attemptId),["new","other","old"])
  assert.equal(value.latestPerExamAverage,50)
  assert.equal(value.notesReviewedInLatestExams,2)
})

test("weakest domain uses complete categories and unanswered counts as incorrect", () => {
  const value=getPracticeInsights([
    attempt("exam-1","only","2026-10-11T10:00:00Z",{cloud:"A",arch:"C"},2),
  ], questions)
  assert.equal(value.weakestCategory,"Azure management and governance")
  assert.equal(value.byDomain[2].answered,0)
  assert.equal(value.byDomain[2].percent,0)
})

test("missing domains do not produce false weakest-domain recommendations", () => {
  const value=getPracticeInsights([
    {...attempt("exam-1","a","2026-10-11T10:00:00Z",{cloud:"A"},1),questionIds:["cloud"]},
  ], questions)
  assert.equal(value.weakestCategory,null)
})

test("ignores invalid empty attempts without changing saved history",()=>{
  const history=[{...attempt("exam-1","a","2026-10-11T10:00:00Z",{},0),questionIds:[]}]
  assert.equal(getPracticeInsights(history,questions).recordedAttempts,0)
  assert.equal(history[0].questionIds.length,0)
})
