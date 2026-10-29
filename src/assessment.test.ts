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
        (question) => ["needs-verification", "notes-reviewed"].includes(question.verificationStatus ?? ""),
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

test("v1.1 knowledge checks cover every concept within enough rotating attempts", () => {
  for (const module of modules) {
    const allConcepts = module.sections.flatMap((section) => section.concepts)
    const rounds = Math.ceil(allConcepts.length / 10)
    const attempts = Array.from({ length: rounds }, (_, round) =>
      createKnowledgeCheckQuestions(module, round),
    )
    assert.equal(
      new Set(attempts.flat().map((question) => question.concept)).size,
      allConcepts.length,
    )
    for (const questions of attempts) {
      assert.equal(new Set(questions.map((question) => question.concept)).size, questions.length)
      for (const question of questions) {
        const concept = allConcepts.find((item) => item.title === question.concept)
        assert.ok(concept)
        assert.equal(question.options[question.answer], concept.definition)
        assert.equal(new Set(question.options).size, 4)
      }
    }
    assert.deepEqual(
      createKnowledgeCheckQuestions(module, 1),
      createKnowledgeCheckQuestions(module, 1),
    )
  }
})

test("original in-progress checks retain historical first-ten answer ordering", () => {
  for (const module of modules) {
    const concepts = module.sections.flatMap((section) => section.concepts)
    const original = createKnowledgeCheckQuestions(module, 0, "legacy")
    assert.deepEqual(original.map((question) => question.concept), concepts.slice(0, 10).map((c) => c.title))
    assert.deepEqual(original.map((question) => question.answer), [0, 1, 2, 3, 0, 1, 2, 3, 0, 1])
  }
})

test("all five practice exams match the documented AZ-900 category weighting", () => {
  for (const pool of practiceExamPools) {
    const counts = pool.reduce<Record<string, number>>((result, question) => {
      result[question.category] = (result[question.category] ?? 0) + 1
      return result
    }, {})
    assert.deepEqual(counts, {
      "Cloud concepts": 13,
      "Azure architecture and services": 18,
      "Azure management and governance": 14,
    })
  }
  assert.equal(
    new Set(practiceExamPools.flat().map((question) => question.id)).size,
    225,
  )
  assert.throws(
    () => createPracticeExamPools(az900ExamQuestions.filter((q) => q.category !== "Azure management and governance")),
    /Not enough Azure management and governance questions/,
  )
})

test("identity and access questions follow the official architecture-services domain", () => {
  for (const id of ["gov-11", "gov-12", "gov-13", "added-163", "added-166", "added-167", "added-168", "added-171"]) {
    const question = az900ExamQuestions.find((item) => item.id === id)
    assert.ok(question)
    assert.equal(question.category, "Azure architecture and services")
  }
  assert.equal(
    az900ExamQuestions.filter((question) => question.id.startsWith("added-gov-source-")).length,
    18,
  )
})

test("each bank question has four distinct answers and a matching key", () => {
  assert.equal(az900ExamQuestions.length, 264)
  assert.equal(new Set(az900ExamQuestions.map((question) => question.id)).size, 264)
  for (const item of az900ExamQuestions) {
    assert.equal(item.options.length, 4)
    assert.equal(new Set(item.options).size, 4)
    assert.ok(item.options.includes(item.correctAnswer), `Missing correct choice in ${item.id}`)
    assert.ok(item.explanation.trim().length > 30, `Missing explanation for ${item.id}`)
  }
})
