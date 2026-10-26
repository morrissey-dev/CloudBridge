import { modules, type CourseModule } from "./curriculum.ts"

import type {
  LearningProgress,
  ModuleLearningProgress,
} from "./learningProgress.ts"

export type ModuleLessonProgress = {
  completedLessons: number

  totalLessons: number

  percent: number
}

export type LearningOverview = {
  totalModules: number

  totalTopics: number

  totalLessons: number

  completedLessons: number

  lessonCompletionPercent: number

  completedKnowledgeChecks: number

  completedPracticeExams: number

  averagePracticeExamPercent: number | null
}

export function getModuleLessonProgress(
  module: CourseModule,

  savedProgress: ModuleLearningProgress | undefined,

  legacyCompleted = false,
): ModuleLessonProgress {
  const totalLessons = module.sections.reduce(
    (total, section) => total + section.concepts.length,

    0,
  )

  const completedIndexes = new Set(
    savedProgress?.completedLessonIndexes.filter(
      (index) => Number.isInteger(index) && index >= 0 && index < totalLessons,
    ),
  )

  const completedLessons = legacyCompleted
    ? totalLessons
    : Math.min(completedIndexes.size, totalLessons)

  return {
    completedLessons,

    totalLessons,

    percent: totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,
  }
}

export function getLearningOverview(
  progress: LearningProgress,

  legacyCompletedModuleIds: ReadonlySet<string> = new Set(),
): LearningOverview {
  const totalTopics = modules.reduce(
    (total, module) => total + module.sections.length,

    0,
  )

  const totalLessons = modules.reduce(
    (total, module) =>
      total +
      module.sections.reduce(
        (sectionTotal, section) => sectionTotal + section.concepts.length,

        0,
      ),

    0,
  )

  const completedLessons = modules.reduce(
    (total, module) =>
      total +
      getModuleLessonProgress(
        module,

        progress.modules[module.id],

        legacyCompletedModuleIds.has(module.id),
      ).completedLessons,

    0,
  )

  const examScores = progress.practiceExamHistory.map((attempt) =>
    Math.round((attempt.score / attempt.questionIds.length) * 100),
  )

  return {
    totalModules: modules.length,

    totalTopics,

    totalLessons,

    completedLessons,

    lessonCompletionPercent: totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,

    completedKnowledgeChecks: Object.values(progress.modules).reduce(
      (total, moduleProgress) =>
        total + moduleProgress.assessmentAttempts.length,

      0,
    ),

    completedPracticeExams: progress.practiceExamHistory.length,

    averagePracticeExamPercent: examScores.length
      ? Math.round(
          examScores.reduce((total, score) => total + score, 0) /
            examScores.length,
        )
      : null,
  }
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, "0")

  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function addStudyActivityDay(
  activityDays: readonly string[],

  date = new Date(),
): string[] {
  const today = getLocalDateKey(date)

  if (activityDays.includes(today)) return [...activityDays]

  return [...activityDays, today].sort()
}

export function calculateStudyStreak(
  activityDays: readonly string[],

  today = new Date(),
): number {
  const activity = new Set(activityDays)

  const cursor = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  if (!activity.has(getLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0

  while (activity.has(getLocalDateKey(cursor))) {
    streak += 1

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
