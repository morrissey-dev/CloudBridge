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
  round = 0,
  version: "v2" | "legacy" = "v2",
): KnowledgeQuestion[] {
  const concepts = module.sections.flatMap((section) => section.concepts)
  const questionCount = Math.min(10, concepts.length)

  if (!Number.isInteger(round) || round < 0) {
    throw new Error("Assessment round must be a non-negative integer.")
  }

  // Earlier CloudBridge builds always tested the first ten concepts. Retaining
  // that precise sequence prevents existing in-progress answers from changing.
  if (version === "legacy") {
    return Array.from({ length: questionCount }, (_, index) => {
      const current = concepts[index]
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

  // Interleave all sections once, then select consecutive windows of ten.
  // Each new assessment round continues where the previous round ended;
  // all lessons are eventually tested instead of repeatedly using the start.
  const sections = module.sections.filter((section) => section.concepts.length)
  const interleaved: typeof concepts = []
  const longest = Math.max(...sections.map((section) => section.concepts.length))
  for (let depth = 0; depth < longest; depth += 1) {
    for (const section of sections) {
      if (section.concepts[depth]) interleaved.push(section.concepts[depth])
    }
  }
  const chosen = Array.from(
    { length: questionCount },
    (_, index) => interleaved[(round * questionCount + index) % interleaved.length],
  )

  return chosen.map((current, index) => {
    const distractorPool = concepts
      .filter((concept) => concept.title !== current.title)
      .map((concept) => concept.definition)
    const offset = (round * questionCount + index * 3) % distractorPool.length
    const distractors = [0, 1, 2].map(
      (i) => distractorPool[(offset + i) % distractorPool.length],
    )
    const answer = (index + round) % 4
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

/** Exam composition for the 25–30 / 35–40 / 30–35 percent AZ-900 domains.
 * A 45-question pool uses 13 / 18 / 14 respectively. Five disjoint pools
 * need 65 / 90 / 70; the present bank provides 82 / 94 / 70.
 */
const targetDistribution = [
  { category: "Cloud concepts", share: 13 },
  { category: "Azure architecture and services", share: 18 },
  { category: "Azure management and governance", share: 14 },
] as const

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
  if (questionsPerExam !== 45) {
    throw new Error("Aligned AZ-900 pools currently require 45 questions per exam.")
  }

  const pools: AZ900Question[][] = Array.from({ length: examCount }, () => [])
  for (const { category, share } of targetDistribution) {
    const available = questionBank.filter((question) => question.category === category)
    const required = share * examCount
    if (available.length < required) {
      throw new Error(
        `Not enough ${category} questions for ${examCount} aligned exams: ` +
          `${available.length} available, ${required} required.`,
      )
    }
    // Round-robin category distribution spreads successive authored questions
    // across exams while keeping all exam question IDs non-overlapping.
    for (let examIndex = 0; examIndex < examCount; examIndex += 1) {
      for (let questionIndex = 0; questionIndex < share; questionIndex += 1) {
        pools[examIndex].push(available[questionIndex * examCount + examIndex])
      }
    }
  }

  const ids = pools.flat().map((question) => question.id)
  if (pools.some((pool) => pool.length !== questionsPerExam) || new Set(ids).size !== ids.length) {
    throw new Error("Practice exam pools must be complete and contain unique questions.")
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
