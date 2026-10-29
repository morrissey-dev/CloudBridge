import test from "node:test"
import assert from "node:assert/strict"
import { createEmptyLearningProgress, type CompletedExamAttempt } from "./learningProgress.ts"
import type { AZ900Question } from "./az900Exam.ts"
import type { ScenarioQuestion } from "./scenarioQuestions.ts"
import { sourceLearningObjectives } from "./learningObjectives.ts"
import { examObjectiveCrosswalk, getRevisionPlan, buildRevisionSessions } from "./remediation.ts"

const cloud: AZ900Question={id:"cloud",category:"Cloud concepts",objective:"Define cloud computing",difficulty:"easy",question:"?",options:["yes","no","maybe","other"],correctAnswer:"yes",explanation:"test"}
const storage: AZ900Question={id:"storage",category:"Azure architecture and services",objective:"Choose Azure storage services",difficulty:"easy",question:"?",options:["yes","no","maybe","other"],correctAnswer:"yes",explanation:"test"}
const scenario: ScenarioQuestion={id:"scenario-1",category:"Cloud concepts",objectiveId:"LO-001",title:"Test",situation:"Test",question:"?",choices:["a","b","c","d"],correctIndex:0,explanation:"Test",takeaway:"Test"}
function attempt(attemptId:string, date:string, answers:Record<string,string>):CompletedExamAttempt {
  return {attemptId,examId:"exam-1",completedAt:date,questionIds:["cloud","storage"],optionsByQuestion:{},answers,index:1,score:Object.values(answers).filter(answer=>answer==="yes").length}
}
const options={bank:[cloud,storage],scenarios:[scenario]}

test("no saved practice shows optional activities but does not invent mistakes",()=>{
  const result=getRevisionPlan(createEmptyLearningProgress(),{},options)
  assert.equal(result.examMistakes,0)
  assert.equal(result.scenarioMistakes,0)
  assert.equal(result.unmappedExamMistakes,0)
  assert.ok(result.actions.length>0)
  assert.ok(result.actions.every(item=>item.reasons.includes("unstarted")))
  assert.equal(result.suggestedExamDomain,null)
})

test("latest attempt per exam is used; a later correct answer clears the earlier mistake",()=>{
  const learning=createEmptyLearningProgress()
  learning.practiceExamHistory=[
    attempt("old","2026-10-21T08:00:00Z",{cloud:"no",storage:"no"}),
    attempt("new","2026-10-23T08:00:00Z",{cloud:"yes",storage:"no"}),
  ]
  const original=JSON.stringify(learning)
  const result=getRevisionPlan(learning,{},options)
  assert.equal(result.examMistakes,1)
  assert.equal(result.unmappedExamMistakes,1)
  assert.equal(result.actions.length,0)
  assert.equal(result.suggestedExamDomain,"Azure architecture and services")
  assert.equal(JSON.stringify(learning),original)
})

test("missed exact-match exam question and latest incorrect scenario recommend the linked lesson",()=>{
  const learning=createEmptyLearningProgress()
  learning.practiceExamHistory=[attempt("now","2026-10-23T08:00:00Z",{cloud:"no",storage:"yes"})]
  const result=getRevisionPlan(learning,{"scenario-1":{selectedIndex:1,correct:false,completedAt:"2026-10-23T10:00:00Z",attempts:1}},options)
  const action=result.actions.find(item=>item.objectiveId==="LO-001")
  assert.ok(action)
  assert.equal(action.missedExamQuestions,1)
  assert.equal(action.missedScenarios,1)
  assert.equal(action.lessonTitle,"Cloud computing")
  assert.equal(action.scenarioAvailable,true)
  assert.equal(action.lessonCompleted,false)
  assert.deepEqual(action.reasons,["exam-error","scenario-error"])
})

test("scenario mistake disappears after correction but saved exam mistakes remain",()=>{
  const learning=createEmptyLearningProgress()
  learning.practiceExamHistory=[attempt("now","2026-10-23T08:00:00Z",{cloud:"no",storage:"yes"})]
  const result=getRevisionPlan(learning,{"scenario-1":{selectedIndex:0,correct:true,completedAt:"2026-10-24T10:00:00Z",attempts:2}},options)
  assert.equal(result.scenarioMistakes,0)
  assert.equal(result.actions[0].missedExamQuestions,1)
})

test("an unanswered mapped exam question counts as needing review",()=>{
  const learning=createEmptyLearningProgress()
  learning.practiceExamHistory=[attempt("now","2026-10-23T08:00:00Z",{storage:"yes"})]
  const result=getRevisionPlan(learning,{},options)
  assert.equal(result.examMistakes,1)
  assert.equal(result.actions[0].objectiveId,"LO-001")
})

test("crosswalk refers only to exact IDs in original learning objectives",()=>{
  const known=new Set(sourceLearningObjectives.map(x=>x.id))
  for (const ids of Object.values(examObjectiveCrosswalk)) for (const id of ids) assert.ok(known.has(id),id)
  assert.equal(sourceLearningObjectives.length,63)
  assert.equal(examObjectiveCrosswalk["Choose Azure storage services"],undefined)
})

test("study sessions follow preferences without inventing calendar dates or changing progress",()=>{
  const plan=getRevisionPlan(createEmptyLearningProgress(),{},options)
  const sessions=buildRevisionSessions(plan.actions,2,45)
  assert.equal(sessions.length,2)
  assert.equal(sessions[0].minutes,45)
  assert.equal(sessions[0].number,1)
  const fallback=buildRevisionSessions(plan.actions,100,0)
  assert.ok(fallback.length<=4)
  assert.ok(fallback.every(s=>s.minutes===30))
})
