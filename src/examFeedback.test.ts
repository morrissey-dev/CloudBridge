import test from "node:test"
import assert from "node:assert/strict"
import { az900ExamQuestions } from "./az900Exam.ts"
import { answerFeedback, getAuthoredChoiceFeedback, getFeedbackCoverage, getFurtherReading, hasCompleteAuthoredFeedback } from "./examFeedback.ts"
import { countMissedAnswers, filterExamReview } from "./examReview.ts"

test("all eighteen notes-reviewed governance questions have specific feedback for all four options", () => {
  const notes = az900ExamQuestions.filter(item => item.verificationStatus === "notes-reviewed")
  assert.equal(notes.length, 18)
  for (const question of notes) {
    assert.ok(hasCompleteAuthoredFeedback(question), question.id)
    for (const option of question.options) assert.ok(getAuthoredChoiceFeedback(question, option)?.length! > 25)
  }
  const summary = getFeedbackCoverage(az900ExamQuestions)
  assert.deepEqual(summary, { total:264, withAuthoredFeedback:18, awaitingDetailedFeedback:246, withOfficialReadingLinks:6 })
})

test("source-linked explanations never masquerade as verified statuses", () => {
  for (const question of az900ExamQuestions) {
    const link = getFurtherReading(question)
    if (link) assert.match(link, /^https:\/\/learn\.microsoft\.com\//)
  }
  assert.ok(Object.keys(answerFeedback).every(id => az900ExamQuestions.some(q => q.id === id)))
})

test("unknown and changed choices are not matched to another explanation", () => {
  const question = az900ExamQuestions.find(q=>q.id === "added-gov-source-011")!
  assert.equal(getAuthoredChoiceFeedback(question, "not a listed answer"), null)
  assert.equal(getAuthoredChoiceFeedback(az900ExamQuestions[0], az900ExamQuestions[0].options[0]), null)
})

test("missed review includes unanswered, excludes correct, and preserves original ordering", () => {
  const attempts = az900ExamQuestions.slice(0,4).map(question => ({question}))
  const answers = {
    [attempts[0].question.id]: attempts[0].question.correctAnswer,
    [attempts[1].question.id]: "wrong answer",
    [attempts[3].question.id]: attempts[3].question.correctAnswer,
  }
  assert.deepEqual(filterExamReview(attempts,answers,"all"),attempts)
  assert.deepEqual(filterExamReview(attempts,answers,"missed"),attempts.slice(1,3))
  assert.equal(countMissedAnswers(attempts,answers),2)
  assert.equal(countMissedAnswers([],{}),0)
})
