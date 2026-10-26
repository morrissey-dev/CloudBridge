import { modules } from "./curriculum.ts"

import { az900ExamQuestions, type AZ900Question } from "./az900Exam.ts"

export type KnowledgeCheckAttempt = {
  score: number

  passed: boolean

  completedAt: string
}

export type ModuleLearningProgress = {
  currentLessonIndex: number

  completedLessonIndexes: number[]

  phase: "lessons" | "assessment"

  questionIndex: number

  selectedAnswerIndex: number | null

  submitted: boolean

  answers: Record<string, number>

  score: number

  finished: boolean

  assessmentAttempts: KnowledgeCheckAttempt[]
}

export type ExamSession = {
  attemptId: string

  examId: string

  questionIds: string[]

  optionsByQuestion: Record<string, string[]>

  answers: Record<string, string>

  index: number
}

export type CompletedExamAttempt = ExamSession & {
  score: number

  completedAt: string
}

export type LearningProgress = {
  activeModuleId: string | null
  modules: Record<string, ModuleLearningProgress>

  practiceExamSessions: Record<string, ExamSession>

  practiceExamHistory: CompletedExamAttempt[]

  studyActivityDays: string[]
}

export const learningProgressStorageKey = "cloudbridge-learning-progress-v1"

export const createEmptyModuleProgress = (): ModuleLearningProgress => ({
  currentLessonIndex: 0,

  completedLessonIndexes: [],

  phase: "lessons",

  questionIndex: 0,

  selectedAnswerIndex: null,

  submitted: false,

  answers: {},

  score: 0,

  finished: false,

  assessmentAttempts: [],
})

export function createEmptyLearningProgress(): LearningProgress {
  return {
    activeModuleId: null,
    modules: {},

    practiceExamSessions: {},

    practiceExamHistory: [],

    studyActivityDays: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`
  }
  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`
  }
  return JSON.stringify(value) ?? "null"
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value))
}

function isLocalDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function normalizeModuleProgress(
  value: unknown,

  moduleId: string,
): ModuleLearningProgress | null {
  if (!isRecord(value)) return null

  const module = modules.find((item) => item.id === moduleId)

  if (!module) return null

  const lessonCount = module.sections.reduce(
    (total, section) => total + section.concepts.length,

    0,
  )

  const questionCount = Math.min(
    10,

    module.sections.reduce(
      (total, section) => total + section.concepts.length,
      0,
    ),
  )

  const rawAnswers = isRecord(value.answers) ? value.answers : {}

  const answers = Object.fromEntries(
    Object.entries(rawAnswers).filter(
      ([questionIndex, answer]) =>
        /^\d+$/.test(questionIndex) &&
        Number(questionIndex) < questionCount &&
        Number.isInteger(answer) &&
        Number(answer) >= 0 &&
        Number(answer) < 4,
    ),
  ) as Record<string, number>

  const rawAttempts = Array.isArray(value.assessmentAttempts)
    ? value.assessmentAttempts
    : []

  const assessmentAttempts = rawAttempts.flatMap((attempt: unknown) => {
    if (
      !isRecord(attempt) ||
      !Number.isInteger(attempt.score) ||
      Number(attempt.score) < 0 ||
      Number(attempt.score) > questionCount ||
      typeof attempt.passed !== "boolean" ||
      attempt.passed !== Number(attempt.score) >= 8 ||
      !isValidDate(attempt.completedAt)
    ) {
      return []
    }

    return [
      {
        score: Number(attempt.score),

        passed: attempt.passed,

        completedAt: attempt.completedAt,
      },
    ]
  })

  return {
    currentLessonIndex:
      Number.isInteger(value.currentLessonIndex) &&
      Number(value.currentLessonIndex) >= 0
        ? Math.min(Number(value.currentLessonIndex), lessonCount - 1)
        : 0,

    completedLessonIndexes: Array.isArray(value.completedLessonIndexes)
      ? [
          ...new Set(
            value.completedLessonIndexes.filter(
              (index): index is number =>
                Number.isInteger(index) && index >= 0 && index < lessonCount,
            ),
          ),
        ].sort((left, right) => left - right)
      : [],

    phase: value.phase === "assessment" ? "assessment" : "lessons",

    questionIndex:
      Number.isInteger(value.questionIndex) && Number(value.questionIndex) >= 0
        ? Math.min(Number(value.questionIndex), questionCount - 1)
        : 0,

    selectedAnswerIndex:
      Number.isInteger(value.selectedAnswerIndex) &&
      Number(value.selectedAnswerIndex) >= 0 &&
      Number(value.selectedAnswerIndex) < 4
        ? Number(value.selectedAnswerIndex)
        : null,

    submitted: value.submitted === true,

    answers,

    score:
      Number.isInteger(value.score) && Number(value.score) >= 0
        ? Math.min(Number(value.score), questionCount)
        : 0,

    finished: value.finished === true,

    assessmentAttempts,
  }
}

function normalizeExamAttempt(
  value: unknown,

  examIds: readonly string[],

  questionBank: readonly AZ900Question[],
): ExamSession | null {
  if (
    !isRecord(value) ||
    typeof value.examId !== "string" ||
    !examIds.includes(value.examId) ||
    typeof value.attemptId !== "string" ||
    !value.attemptId ||
    !Array.isArray(value.questionIds) ||
    value.questionIds.length === 0 ||
    value.questionIds.length > questionBank.length ||
    !isRecord(value.optionsByQuestion) ||
    !isRecord(value.answers)
  ) {
    return null
  }

  const questionIds = value.questionIds

  if (
    questionIds.some(
      (id) =>
        typeof id !== "string" ||
        !questionBank.some((question) => question.id === id),
    ) ||
    new Set(questionIds).size !== questionIds.length
  ) {
    return null
  }

  const optionsByQuestion: Record<string, string[]> = {}

  for (const id of questionIds as string[]) {
    const question = questionBank.find((item) => item.id === id)

    const options = value.optionsByQuestion[id]

    if (
      !question ||
      !Array.isArray(options) ||
      options.length !== question.options.length ||
      options.some((option) => typeof option !== "string") ||
      new Set(options).size !== question.options.length ||
      question.options.some((option) => !options.includes(option))
    ) {
      return null
    }

    optionsByQuestion[id] = ([...options] as string[])
  }

  const answers = Object.fromEntries(
    Object.entries(value.answers).filter(
      ([id, answer]) =>
        questionIds.includes(id) &&
        typeof answer === "string" &&
        optionsByQuestion[id]?.includes(answer),
    ),
  ) as Record<string, string>

  return {
    attemptId: value.attemptId,

    examId: value.examId,

    questionIds: [...questionIds] as string[],

    optionsByQuestion,

    answers,

    index:
      Number.isInteger(value.index) && Number(value.index) >= 0
        ? Math.min(Number(value.index), questionIds.length - 1)
        : 0,
  }
}

export function normalizeLearningProgress(
  value: unknown,

  examIds: readonly string[],

  questionBank: readonly AZ900Question[] = az900ExamQuestions,
): LearningProgress {
  const progress = createEmptyLearningProgress()

  if (!isRecord(value)) return progress
  if (
    typeof value.activeModuleId === "string" &&
    modules.some((module) => module.id === value.activeModuleId)
  ) {
    progress.activeModuleId = value.activeModuleId
  }

  if (isRecord(value.modules)) {
    for (const module of modules) {
      const saved = normalizeModuleProgress(value.modules[module.id], module.id)

      if (saved) progress.modules[module.id] = saved
    }
  }

  if (isRecord(value.practiceExamSessions)) {
    for (const examId of examIds) {
      const saved = normalizeExamAttempt(
        value.practiceExamSessions[examId],

        examIds,

        questionBank,
      )

      if (saved?.examId === examId)
        progress.practiceExamSessions[examId] = saved
    }
  }

  if (Array.isArray(value.practiceExamHistory)) {
    progress.practiceExamHistory = value.practiceExamHistory.flatMap(
      (entry: unknown) => {
        if (!isRecord(entry)) return []
        const attempt = normalizeExamAttempt(entry, examIds, questionBank)

        const calculatedScore = attempt
          ? attempt.questionIds.reduce(
              (score, id) =>
                score +
                Number(
                  attempt.answers[id] ===
                    questionBank.find((question) => question.id === id)
                      ?.correctAnswer,
                ),

              0,
            )
          : -1

        if (
          !attempt ||
          !Number.isInteger(entry.score) ||
          Number(entry.score) < 0 ||
          Number(entry.score) > attempt.questionIds.length ||
          Number(entry.score) !== calculatedScore ||
          !isValidDate(entry.completedAt)
        ) {
          return []
        }

        return [
          {
            ...attempt,

            score: Number(entry.score),

            completedAt: entry.completedAt,
          },
        ]
      },
    )
  }

  if (Array.isArray(value.studyActivityDays)) {
    progress.studyActivityDays = [
      ...new Set(value.studyActivityDays.filter(isLocalDateKey)),
    ].sort()
  }

  return progress
}

export function readLearningProgress(
  storage: Pick<Storage, "getItem">,

  examIds: readonly string[],
): {
  progress: LearningProgress
  error: string | null
} {
  try {
    const raw = storage.getItem(learningProgressStorageKey)
    if (!raw) return { progress: createEmptyLearningProgress(), error: null }
    const parsed: unknown = JSON.parse(raw)
    const progress = normalizeLearningProgress(parsed, examIds)
    const comparableProgress: Record<string, unknown> = { ...progress }
    if (isRecord(parsed) && !("studyActivityDays" in parsed)) {
      delete comparableProgress.studyActivityDays
    }
    return {
      progress,
      error:
        canonicalJson(comparableProgress) === canonicalJson(parsed)
          ? null
          : "Some saved learning progress was invalid and could not be restored.",
    }
  } catch {
    return {
      progress: createEmptyLearningProgress(),

      error:
        "Saved learning progress could not be read. Check browser storage access.",
    }
  }
}

export function writeLearningProgress(
  storage: Pick<Storage, "setItem">,

  progress: LearningProgress,
): string | null {
  try {
    storage.setItem(learningProgressStorageKey, JSON.stringify(progress))

    return null
  } catch {
    return "Learning progress could not be saved. Check browser storage access and try again."
  }
}
