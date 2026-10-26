import { az900ExamQuestions, type AZ900Question } from "./az900Exam.ts"

import type { CourseModule } from "./curriculum.ts"

import type { ExamSession } from "./learningProgress.ts"

export type PracticeExam = {
  id: string

  title: string

  subtitle: string
}

export type ExamQuestionAttempt = {
  question: AZ900Question

  options: string[]
}

export type KnowledgeQuestion = {
  concept: string

  prompt: string

  options: string[]

  answer: number
}

export function createKnowledgeCheckQuestions(
  module: CourseModule,
): KnowledgeQuestion[] {
  const concepts = module.sections.flatMap((section) => section.concepts)

  return Array.from({ length: Math.min(10, concepts.length) }, (_, index) => {
    const current = concepts[index % concepts.length]
    const distractorPool = concepts
      .filter((concept) => concept.title !== current.title)
      .map((concept) => concept.definition)
    const distractors = [0, 1, 2].map(
      (offset) => distractorPool[(index + offset) % distractorPool.length],
    )
    const answer = index % 4
    const options = [...distractors]
    options.splice(answer, 0, current.definition)

    return {
      concept: current.title,
      prompt: `Which explanation best describes “${current.title}”?`,
      options,
      answer,
    }
  })
}

export function scoreKnowledgeCheckAnswers(
  answers: Record<string, number>,
  correctAnswerIndexes: readonly number[],
): number {
  return correctAnswerIndexes.reduce(
    (score, answer, index) => score + Number(answers[String(index)] === answer),
    0,
  )
}

export const practiceExams: PracticeExam[] = Array.from(
  { length: 5 },

  (_, index) => ({
    id: `exam-${index + 1}`,

    title: `Practice Exam ${index + 1}`,

    subtitle: "Full AZ-900 assessment · randomized questions",
  }),
)

export function shuffleItems<T>(
  items: readonly T[],

  random: () => number = Math.random,
): T[] {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

export function createPracticeExamPools(
  questionBank: readonly AZ900Question[] = az900ExamQuestions,

  examCount = practiceExams.length,

  questionsPerExam = 45,
): AZ900Question[][] {
  if (!Number.isInteger(examCount) || examCount < 1) {
    throw new Error("At least one practice exam pool is required.")
  }

  if (!Number.isInteger(questionsPerExam) || questionsPerExam < 1) {
    throw new Error("Practice exam question count must be a positive integer.")
  }

  if (questionBank.length < examCount * questionsPerExam) {
    throw new Error(
      `The question bank must contain at least ${examCount * questionsPerExam} questions for ${examCount} non-overlapping exams.`,
    )
  }

  const pools = Array.from({ length: examCount }, (_, poolIndex) =>
    questionBank

      .filter((_, questionIndex) => questionIndex % examCount === poolIndex)

      .slice(0, questionsPerExam),
  )

  const ids = pools.flat().map((question) => question.id)

  if (
    pools.some((pool) => pool.length !== questionsPerExam) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error(
      "Practice exam pools must be complete and contain unique questions.",
    )
  }

  return pools
}

export const practiceExamPools = createPracticeExamPools()

export function createExamAttempt(
  examId: string,

  random: () => number = Math.random,

  attemptId = `${Date.now()}-${Math.random().toString(36).slice(2)}`,
): ExamSession {
  const examIndex = practiceExams.findIndex((exam) => exam.id === examId)

  const pool = practiceExamPools[examIndex]

  if (!pool) throw new Error(`Unknown practice exam: ${examId}`)

  const attempt = shuffleItems(pool, random).map((question) => ({
    question,

    options: shuffleItems(question.options, random),
  }))

  return {
    attemptId,

    examId,

    questionIds: attempt.map(({ question }) => question.id),

    optionsByQuestion: Object.fromEntries(
      attempt.map(({ question, options }) => [question.id, options]),
    ),

    answers: {},

    index: 0,
  }
}

export function restoreExamAttempt(
  session: ExamSession,

  questionBank: readonly AZ900Question[] = az900ExamQuestions,
): ExamQuestionAttempt[] {
  return session.questionIds.flatMap((id) => {
    const question = questionBank.find((item) => item.id === id)

    return question
      ? [{ question, options: session.optionsByQuestion[id] }]
      : []
  })
}
