import test from "node:test"
import assert from "node:assert/strict"
import { az900ExamQuestions } from "./az900Exam.ts"
import { auditQuestionBank, summarizeExamReviewStatus } from "./questionQuality.ts"

test("question bank audit exposes verification pending without calling unflagged questions verified", () => {
  const audit = auditQuestionBank(az900ExamQuestions)
  assert.equal(audit.total, 264)
  assert.equal(audit.flaggedForVerification, 206)
  assert.equal(audit.notesReviewed, 18)
  assert.equal(audit.unclassified, 40)
  assert.deepEqual(audit.missingReviewSources, [])
  assert.equal(audit.notFlaggedButNotIndependentlyVerified, 40)
  assert.deepEqual(audit.invalidAnswers, [])
  assert.deepEqual(audit.missingExplanations, [])
  assert.deepEqual(audit.duplicateIds, [])
})

test("question audit detects malformed answer lists and repeated question identifiers", () => {
  const first = az900ExamQuestions[0]
  const result = auditQuestionBank([first, { ...first, options: ["a", "a", "c", "d"], correctAnswer: "x", explanation: "" }])
  assert.deepEqual(result.duplicateIds, [first.id])
  assert.deepEqual(result.invalidAnswers, [first.id])
  assert.deepEqual(result.missingExplanations, [first.id])
  assert.deepEqual(result.duplicatedStems, [first.id])
})


test("individual exam review disclosure never implies that notes-only review is Microsoft verification", () => {
  const bank = az900ExamQuestions
  const summary = summarizeExamReviewStatus(bank.slice(0, 40))
  assert.equal(summary.total, 40)
  assert.equal(summary.independentlyVerified, 0)
  assert.equal(summary.flaggedForVerification + summary.notesReviewed + summary.unclassified, 40)
})
