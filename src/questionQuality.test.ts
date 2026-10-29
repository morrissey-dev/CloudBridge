import test from "node:test"
import assert from "node:assert/strict"
import { az900ExamQuestions } from "./az900Exam.ts"
import { auditQuestionBank } from "./questionQuality.ts"

test("question bank audit exposes verification pending without calling unflagged questions verified", () => {
  const audit = auditQuestionBank(az900ExamQuestions)
  assert.equal(audit.total, 264)
  assert.equal(audit.flaggedForVerification, 224)
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
