import type { CourseModule } from "../curriculum.ts"

import type { ModuleLessonProgress } from "../learningStatistics.ts"

import Icon from "./Icon.tsx"

export type ModuleCardProps = {
  module: CourseModule

  onStart: () => void

  onEnroll: () => void

  enrolled: boolean

  locked: boolean

  completed: boolean

  lessonProgress: ModuleLessonProgress
}

export default function ModuleCard({
  module,

  onStart,

  onEnroll,

  enrolled,

  locked,

  completed,

  lessonProgress,
}: ModuleCardProps) {
  return (
    <article
      className={`module-card ${locked ? "module-card-locked" : ""} ${
        completed ? "module-card-completed" : ""
      }`}
    >
      <div className="module-card-number">{module.number}</div>
      <div className="module-card-icon">
        <Icon
          name={
            module.number === "01"
              ? "cloud"
              : module.number === "02"
                ? "target"
                : module.number === "03"
                  ? "spark"
                  : "book"
          }
          size={24}
        />
      </div>
      <div className="module-card-meta">
        {module.sections.length} topics · {lessonProgress.totalLessons} lessons
      </div>
      <div className="module-lesson-progress">
        <div>
          <span>Lessons completed</span>
          <strong>{lessonProgress.percent}%</strong>
        </div>
        <div
          aria-label={`${lessonProgress.percent}% of lessons completed`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={lessonProgress.percent}
          className="module-lesson-track"
          role="progressbar"
        >
          <span style={{ width: `${lessonProgress.percent}%` }} />
        </div>
        <small>
          {lessonProgress.completedLessons} of {lessonProgress.totalLessons}{" "}
          lessons
        </small>
      </div>
      <div className={`module-status ${completed ? "status-complete" : ""}`}>
        {completed
          ? "Completed"
          : enrolled
            ? "Enrolled"
            : locked
              ? "Locked"
              : "Available"}
      </div>
      <div className="module-card-title">{module.title}</div>
      <p>{module.description}</p>
      <div className="module-preview">
        {module.sections.slice(0, 3).map((section, index) => (
          <div key={section.title}>
            <span>{index + 1}</span>
            {section.title}
          </div>
        ))}
      </div>
      <button
        className="primary-button"
        disabled={locked}
        onClick={enrolled ? onStart : onEnroll}
      >
        {completed
          ? "Review Module"
          : enrolled
            ? "Continue Learning"
            : "Enroll to Start Learning"}
        <Icon name="arrow" size={17} />
      </button>
    </article>
  )
}
