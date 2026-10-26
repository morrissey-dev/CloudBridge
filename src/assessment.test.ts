import assert from "node:assert/strict"

import test from "node:test"

import { az900ExamQuestions } from "./az900Exam.ts"

import {
  createKnowledgeCheckQuestions,
  createExamAttempt,
  createPracticeExamPools,
  practiceExamPools,
  practiceExams,
  restoreExamAttempt,
  scoreKnowledgeCheckAnswers,
} from "./assessment.ts"
import { modules } from "./curriculum.ts"

test("knowledge checks draw unique, correctly mapped questions across module topics", () => {
  for (const module of modules) {
    const questions = createKnowledgeCheckQuestions(module)
    const concepts = module.sections.flatMap((section) => section.concepts)
    const questionSections = new Set(
      questions.map(
        (question) =>
          module.sections.find((section) =>
            section.concepts.some(
              (concept) => concept.title === question.concept,
            ),
          )?.title,
      ),
    )

    assert.equal(questions.length, Math.min(10, concepts.length))
    assert.equal(
      new Set(questions.map((question) => question.concept)).size,
      questions.length,
    )
    assert.ok(
      questions.every((question) => {
        const concept = concepts.find((item) => item.title === question.concept)
        return (
          concept && question.options[question.answer] === concept.definition
        )
      }),
    )
    assert.ok(questionSections.size > 1)
  }
})

test("knowledge-check scoring counts each submitted correct answer once", () => {
  assert.equal(
    scoreKnowledgeCheckAnswers(
      { "0": 2, "1": 0, "2": 3, "3": 1 },
      [2, 1, 3, 0],
    ),
    2,
  )
})

test("question bank preserves the original questions and exceeds five exam pools", () => {
  const originalQuestions = az900ExamQuestions.filter(
    (question) => !question.id.startsWith("added-"),
  )

  assert.equal(originalQuestions.length, 40)

  assert.ok(az900ExamQuestions.length >= 225)

  assert.equal(
    new Set(az900ExamQuestions.map((question) => question.id)).size,
    az900ExamQuestions.length,
  )

  assert.equal(
    new Set(az900ExamQuestions.map((question) => question.question)).size,
    az900ExamQuestions.length,
  )

  assert.ok(
    originalQuestions.every((question) => question.explanation.length > 0),
  )

  assert.ok(
    az900ExamQuestions

      .filter((question) => question.id.startsWith("added-"))

      .every(
        (question) => question.verificationStatus === "needs-verification",
      ),
  )
})

test("five fixed practice exams each contain 45 unique, non-overlapping questions", () => {
  assert.equal(practiceExams.length, 5)

  assert.equal(practiceExamPools.length, 5)

  assert.ok(practiceExamPools.every((pool) => pool.length === 45))

  const poolIds = practiceExamPools.map((pool) =>
    pool.map((question) => question.id),
  )

  assert.equal(new Set(poolIds.flat()).size, 225)

  assert.deepEqual(
    practiceExamPools.map((pool) => pool.map((question) => question.id)),

    createPracticeExamPools().map((pool) =>
      pool.map((question) => question.id),
    ),
  )
})

test("question and option shuffling preserves answer mapping and saved order", () => {
  const attempt = createExamAttempt("exam-1", () => 0, "deterministic-attempt")

  assert.equal(attempt.questionIds.length, 45)

  assert.equal(new Set(attempt.questionIds).size, 45)

  assert.notDeepEqual(
    attempt.questionIds,

    practiceExamPools[0].map((question) => question.id),
  )

  for (const id of attempt.questionIds) {
    const question = az900ExamQuestions.find((item) => item.id === id)

    const options = attempt.optionsByQuestion[id]

    assert.ok(question)

    assert.deepEqual([...options].sort(), [...question.options].sort())

    assert.ok(options.includes(question.correctAnswer))
  }

  const restored = restoreExamAttempt(attempt)

  assert.deepEqual(
    restored.map(({ question }) => question.id),
    attempt.questionIds,
  )

  assert.deepEqual(
    Object.fromEntries(
      restored.map(({ question, options }) => [question.id, options]),
    ),

    attempt.optionsByQuestion,
  )
})

test("unknown practice exams fail explicitly", () => {
  assert.throws(
    () => createExamAttempt("exam-unknown"),
    /Unknown practice exam/,
  )
})
