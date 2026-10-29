import assert from "node:assert/strict"

import test from "node:test"

import { modules } from "./curriculum.ts"

import {
  createEmptyLearningProgress,
  createEmptyModuleProgress,
} from "./learningProgress.ts"

import {
  addStudyActivityDay,
  calculateStudyStreak,
  getLearningOverview,
  getLocalDateKey,
  getModuleLessonProgress,
} from "./learningStatistics.ts"

test("module lesson percentage uses unique curriculum lesson indexes", () => {
  const module = modules[0]

  const totalLessons = module.sections.reduce(
    (total, section) => total + section.concepts.length,

    0,
  )

  const progress = getModuleLessonProgress(
    module,

    {
      ...createEmptyModuleProgress(),

      completedLessonIndexes: [0, 1, 1, totalLessons, -1],
    },
  )

  assert.equal(progress.totalLessons, totalLessons)

  assert.equal(progress.completedLessons, 2)

  assert.equal(progress.percent, Math.round((2 / totalLessons) * 100))
})

test("legacy completed modules count all curriculum lessons as completed", () => {
  const module = modules[0]

  const progress = getModuleLessonProgress(module, undefined, true)

  assert.equal(progress.completedLessons, progress.totalLessons)

  assert.equal(progress.percent, 100)
})

test("overall lesson and topic counts derive from curriculum and saved assessments", () => {
  const progress = createEmptyLearningProgress()

  const module = modules[0]

  progress.modules[module.id] = {
    ...createEmptyModuleProgress(),

    completedLessonIndexes: [0, 1],

    assessmentAttempts: [
      {
        score: 8,

        passed: true,

        completedAt: "2026-04-12T10:00:00.000Z",
      },
    ],
  }

  const legacyModuleIds = new Set([modules[1].id])

  const overview = getLearningOverview(progress, legacyModuleIds)

  const totalLessons = modules.reduce(
    (total, current) =>
      total +
      current.sections.reduce(
        (sectionTotal, section) => sectionTotal + section.concepts.length,

        0,
      ),

    0,
  )

  const totalTopics = modules.reduce(
    (total, current) => total + current.sections.length,

    0,
  )

  assert.equal(overview.totalLessons, totalLessons)

  assert.equal(overview.totalTopics, totalTopics)

  assert.equal(
    overview.completedLessons,

    2 +
      modules[1].sections.reduce(
        (total, section) => total + section.concepts.length,

        0,
      ),
  )

  assert.equal(overview.completedKnowledgeChecks, 1)

  assert.equal(
    overview.lessonCompletionPercent,
    Math.round((overview.completedLessons / totalLessons) * 100),
  )
})

test("practice exam history produces a percentage average", () => {
  const progress = createEmptyLearningProgress()

  progress.practiceExamHistory = [
    {
      attemptId: "attempt-1",

      examId: "exam-1",

      questionIds: ["one", "two"],

      optionsByQuestion: { one: ["a", "b"], two: ["c", "d"] },

      answers: { one: "a", two: "c" },

      index: 1,

      score: 1,

      completedAt: "2026-04-12T10:00:00.000Z",
    },

    {
      attemptId: "attempt-2",

      examId: "exam-2",

      questionIds: ["three", "four"],

      optionsByQuestion: { three: ["a", "b"], four: ["c", "d"] },

      answers: { three: "a", four: "d" },

      index: 1,

      score: 2,

      completedAt: "2026-04-13T10:00:00.000Z",
    },
  ]

  const overview = getLearningOverview(progress)

  assert.equal(overview.completedPracticeExams, 2)

  assert.equal(overview.averagePracticeExamPercent, 75)
})

test("study activity records each local calendar day once", () => {
  const date = new Date(2026, 3, 12, 23, 30)

  const firstEntry = addStudyActivityDay([], date)

  const secondEntry = addStudyActivityDay(firstEntry, new Date(2026, 3, 12, 8))

  assert.deepEqual(firstEntry, ["2026-04-12"])

  assert.deepEqual(secondEntry, ["2026-04-12"])

  assert.equal(getLocalDateKey(date), "2026-04-12")
})

test("study streak handles today, yesterday, gaps, and local date boundaries", () => {
  const today = new Date(2026, 3, 12, 0, 5)

  assert.equal(
    calculateStudyStreak(
      ["2026-04-10", "2026-04-11", "2026-04-12"],

      today,
    ),

    3,
  )

  assert.equal(
    calculateStudyStreak(["2026-04-10", "2026-04-11"], today),

    2,
  )

  assert.equal(
    calculateStudyStreak(["2026-04-09", "2026-04-11"], today),

    1,
  )

  assert.equal(calculateStudyStreak([], today), 0)
})

test("knowledge checks completed counts passed modules once, not repeated attempts", () => {
  const progress = createEmptyLearningProgress()
  progress.modules[modules[0].id] = {
    ...createEmptyModuleProgress(),
    assessmentAttempts: [
      { score: 6, passed: false, completedAt: "2026-10-26T10:00:00Z" },
      { score: 8, passed: true, completedAt: "2026-10-26T11:00:00Z" },
      { score: 9, passed: true, completedAt: "2026-10-27T11:00:00Z" },
    ],
  }
  progress.modules[modules[1].id] = {
    ...createEmptyModuleProgress(),
    assessmentAttempts: [{ score: 7, passed: false, completedAt: "2026-10-27T12:00:00Z" }],
  }
  assert.equal(getLearningOverview(progress).completedKnowledgeChecks, 1)
})
