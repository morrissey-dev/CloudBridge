import assert from "node:assert/strict"
import test from "node:test"
import { az900ExamQuestions } from "./az900Exam.ts"
import { buildReviewQueueCSV, getReviewQueue } from "./questionReviewLedger.ts"

test("export includes all 264 questions and never claims authoritative approval", () => {
  const queue = getReviewQueue()
  const csv = buildReviewQueueCSV()
  assert.equal(queue.length, 264)
  assert.equal(queue.filter(item => item.reviewStage === "needs-verification").length, 206)
  assert.equal(queue.filter(item => item.reviewStage === "unclassified").length, 40)
  assert.equal(queue.filter(item => item.reviewStage === "notes-reviewed").length, 18)
  assert.equal(queue.every(item => item.needsOfficialReview),true)
  assert.equal(csv.split("\n").length, 266) // header, 264 rows, terminal newline
  for (const question of az900ExamQuestions) assert.ok(csv.includes(`"${question.id}"`))
  assert.ok(csv.includes("official_doc_url_to_fill"))
})

test("review export quotes commas, quotes, and multiline fields safely", () => {
  const question={...az900ExamQuestions[0],id:'test-review',objective:'Cloud, "shared"\nresponsibility'}
  const csv=buildReviewQueueCSV([question])
  assert.ok(csv.includes('"Cloud, ""shared"" responsibility"'))
  assert.equal(csv.split('\n').length,3)
})

test("review queue flags malformed answer text but cannot certify semantics", () => {
  const question={...az900ExamQuestions[0], id:'malformed', options:['a','a','c','d'] as [string,string,string,string],correctAnswer:'x',explanation:''}
  const [review]=getReviewQueue([question])
  assert.deepEqual(review.warnings,["INVALID_OPTIONS","ANSWER_NOT_IN_OPTIONS","MISSING_EXPLANATION"])
  assert.equal(review.needsOfficialReview,true)
})
