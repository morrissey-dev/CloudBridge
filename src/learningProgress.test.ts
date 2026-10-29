import assert from "node:assert/strict"

import test from "node:test"

import { az900ExamQuestions } from "./az900Exam.ts"

import {
  learningProgressStorageKey,
  normalizeLearningProgress,
  readLearningProgress,
  writeLearningProgress,
  type LearningProgress,
  type ExamSession,
} from "./learningProgress.ts"

const examIds = ["exam-1", "exam-2", "exam-3"]

class MemoryStorage {
  values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

function makeExamSession(examId: string): ExamSession {
  const questionIds = az900ExamQuestions
    .map((question) => question.id)
    .reverse()
  const lastQuestion = az900ExamQuestions[az900ExamQuestions.length - 1]
  return {
    attemptId: `attempt-${examId}`,
    examId,
    questionIds,

    optionsByQuestion: Object.fromEntries(
      az900ExamQuestions.map((question) => [
        question.id,

        [...question.options].reverse(),
      ]),
    ),

    answers: { [questionIds[0]]: lastQuestion.correctAnswer },
    index: 4,
  }
}

test("lesson and knowledge-check progress survives storage round trips", () => {
  const storage = new MemoryStorage()
  const data: LearningProgress = {
    activeModuleId: "cloud-concepts",
    modules: {
      "cloud-concepts": {
        currentLessonIndex: 3,
        completedLessonIndexes: [0, 1, 2],
        phase: "assessment",
        questionIndex: 2,
        selectedAnswerIndex: 1,
        submitted: true,
        answers: { "0": 0, "1": 1 },
        score: 1,
        finished: false,
        assessmentAttempts: [
          {
            score: 9,
            passed: true,
            completedAt: "2026-10-26T10:00:00.000Z",
          },
        ],
      },
    },
    practiceExamSessions: {},
    practiceExamHistory: [],
    studyActivityDays: ["2026-10-26"],
  }

  assert.equal(writeLearningProgress(storage, data), null)

  const restored = readLearningProgress(storage, examIds)

  assert.equal(restored.error, null)

  assert.deepEqual(
    restored.progress.modules["cloud-concepts"],
    data.modules["cloud-concepts"],
  )
  assert.equal(restored.progress.activeModuleId, "cloud-concepts")
  assert.deepEqual(restored.progress.studyActivityDays, ["2026-10-26"])
})

test("unfinished practice exams restore question order, options, answers, and position", () => {
  const session = makeExamSession("exam-2")

  const restored = normalizeLearningProgress(
    { practiceExamSessions: { "exam-2": session } },

    examIds,
  )

  assert.deepEqual(restored.practiceExamSessions["exam-2"], session)
})

test("exam sessions remain readable when an attempt uses a subset of the question bank", () => {
  const questions = az900ExamQuestions.slice(0, 2)
  const session: ExamSession = {
    attemptId: "short-attempt",
    examId: "exam-1",
    questionIds: questions.map((question) => question.id),
    optionsByQuestion: Object.fromEntries(
      questions.map((question) => [
        question.id,
        [...question.options].reverse(),
      ]),
    ),
    answers: {},
    index: 1,
  }

  const restored = normalizeLearningProgress(
    { practiceExamSessions: { "exam-1": session } },
    examIds,
  )

  assert.deepEqual(restored.practiceExamSessions["exam-1"], session)
})

test("completed practice exam history is retained and invalid saved values are filtered", () => {
  const session = makeExamSession("exam-1")

  const completedAt = "2026-10-26T10:00:00.000Z"

  const restored = normalizeLearningProgress(
    {
      practiceExamHistory: [
        { ...session, score: 1, completedAt },

        { ...session, score: 24, completedAt },

        { ...session, score: az900ExamQuestions.length + 1, completedAt },
      ],
    },

    examIds,
  )

  assert.equal(restored.practiceExamHistory.length, 1)

  assert.equal(restored.practiceExamHistory[0].score, 1)

  assert.equal(restored.practiceExamHistory[0].completedAt, completedAt)
})

test("reading new progress does not overwrite legacy learner data", () => {
  const storage = new MemoryStorage()

  storage.values.set("cloudbridge-enrolled-v1", "[0,1]")

  storage.values.set("cloudbridge-started-v1", "[0]")

  storage.values.set("cloudbridge-completed-v1", "[0]")

  const restored = readLearningProgress(storage, examIds)

  assert.equal(restored.error, null)

  assert.equal(storage.getItem("cloudbridge-enrolled-v1"), "[0,1]")

  assert.equal(storage.getItem("cloudbridge-started-v1"), "[0]")

  assert.equal(storage.getItem("cloudbridge-completed-v1"), "[0]")

  assert.equal(storage.getItem(learningProgressStorageKey), null)
})

test("progress from the previous schema restores without an error or data loss", () => {
  const storage = new MemoryStorage()
  const previousSchema = {
    activeModuleId: "cloud-concepts",
    modules: {},
    practiceExamSessions: {},
    practiceExamHistory: [],
  }
  storage.values.set(learningProgressStorageKey, JSON.stringify(previousSchema))

  const restored = readLearningProgress(storage, examIds)

  assert.equal(restored.error, null)
  assert.deepEqual(restored.progress.studyActivityDays, [])
  assert.equal(
    storage.getItem(learningProgressStorageKey),
    JSON.stringify(previousSchema),
  )
})

test("invalid study activity dates are filtered and reported without rewriting storage", () => {
  const storage = new MemoryStorage()
  const savedValue = JSON.stringify({
    activeModuleId: null,
    modules: {},
    practiceExamSessions: {},
    practiceExamHistory: [],
    studyActivityDays: ["2026-02-30", "2026-04-12", "2026-04-12", "not-a-date"],
  })
  storage.values.set(learningProgressStorageKey, savedValue)

  const restored = readLearningProgress(storage, examIds)

  assert.match(restored.error ?? "", /invalid/)
  assert.deepEqual(restored.progress.studyActivityDays, ["2026-04-12"])
  assert.equal(storage.getItem(learningProgressStorageKey), savedValue)
})

test("invalid saved progress is reported without rewriting the stored value", () => {
  const storage = new MemoryStorage()
  const savedValue = JSON.stringify({ activeModuleId: "unknown-module" })
  storage.values.set(learningProgressStorageKey, savedValue)

  const restored = readLearningProgress(storage, examIds)

  assert.match(restored.error ?? "", /invalid/)
  assert.equal(storage.getItem(learningProgressStorageKey), savedValue)
})

test("storage access failures are returned as actionable errors", () => {
  const unavailableStorage = {
    getItem() {
      throw new Error("blocked")
    },

    setItem() {
      throw new Error("blocked")
    },
  }

  assert.match(
    readLearningProgress(unavailableStorage, examIds).error ?? "",
    /could not be read/,
  )

  assert.match(
    writeLearningProgress(unavailableStorage, {
      activeModuleId: null,
      modules: {},

      practiceExamSessions: {},

      practiceExamHistory: [],
      studyActivityDays: [],
    }) ?? "",

    /could not be saved/,
  )
})
