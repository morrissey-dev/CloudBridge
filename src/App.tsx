import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"

import {

  modules,

  type CourseModule,

} from "./curriculum"
import {
  az900ExamQuestions,
  type AZ900Category,
} from "./az900Exam"
import {
  createExamAttempt,
  createKnowledgeCheckQuestions,
  practiceExamPools,
  practiceExams,
  restoreExamAttempt,
  scoreKnowledgeCheckAnswers,
  type ExamQuestionAttempt,
} from "./assessment"
import {
  createEmptyLearningProgress,
  createEmptyModuleProgress,
  readLearningProgress,
  writeLearningProgress,
  type CompletedExamAttempt,
  type ExamSession,
  type LearningProgress,
  type ModuleLearningProgress,
} from "./learningProgress"
import {
  addStudyActivityDay,
  calculateStudyStreak,
  getLearningOverview,
  getModuleLessonProgress,
} from "./learningStatistics"
import { getObjectivesForModule } from "./learningObjectives"
import Icon, { type IconName } from "./components/Icon"
import ModuleCard from "./components/ModuleCard"
import ScenarioPracticeView from "./components/ScenarioPracticeView"
import ObjectivesTrackerView from "./components/ObjectivesTrackerView"
import { currentQuestionAudit } from "./questionQuality"

type View =

  | "Home"

  | "Modules"

  | "My Learning"

  | "Practice quizzes"

  | "Flashcards"

  | "Case studies"

  | "Scenario practice"

  | "Learning objectives"

  | "Study plan"

const navItems: { label: View; icon: IconName }[] = [

  { label: "Home", icon: "home" },

  { label: "Modules", icon: "book" },

  { label: "My Learning", icon: "check" },

  { label: "Practice quizzes", icon: "quiz" },

  { label: "Flashcards", icon: "cards" },

  { label: "Case studies", icon: "target" },

  { label: "Scenario practice", icon: "quiz" },

  { label: "Learning objectives", icon: "target" },

  { label: "Study plan", icon: "calendar" },

]

function Logo() {

  return (

    <div className="logo">

      <div className="logo-mark">

        <Icon name="cloud" size={23} />

      </div>

      <div>

        <strong>CloudBridge</strong>  &#x20;

           <span>AZ-900 learning space</span>

      </div>

    </div>

  )

}

const welcomeCompletedKey = "cloudbridge_welcome_completed"

function hasCompletedWelcome(): boolean {
  try {
    return window.localStorage.getItem(welcomeCompletedKey) === "true"
  } catch {
    return false
  }
}

function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  const features: { icon: IconName; title: string }[] = [
    { icon: "quiz", title: "Practice & Assessment" },
    { icon: "cards", title: "Flashcard Coach" },
    { icon: "calendar", title: "Personal Study Planner" },
    { icon: "target", title: "Readiness Tracking" },
  ]

  return (
    <main className="welcome-landing">
      <header className="welcome-header">
        <Logo />
        <span>AZ-900 certification preparation</span>
      </header>
      <section aria-labelledby="welcome-title" className="welcome-hero">
        <div className="welcome-copy">
          <div className="eyebrow">Your Azure learning space</div>
          <h1 id="welcome-title">Welcome, future cloud engineer!</h1>
          <p>Your cloud journey starts here.</p>
          <button
            className="primary-button welcome-get-started"
            onClick={onGetStarted}
            type="button"
          >
            Get Started <Icon name="arrow" size={18} />
          </button>
        </div>
        <div aria-hidden="true" className="welcome-visual">
          <div className="welcome-visual-orbit welcome-visual-orbit-one" />
          <div className="welcome-visual-orbit welcome-visual-orbit-two" />
          <div className="welcome-cloud"><Icon name="cloud" size={78} /></div>
          <span className="welcome-visual-label">Azure Fundamentals</span>
          <div className="welcome-visual-caption">
            <Icon name="spark" size={17} />
            <span>Learn with confidence</span>
          </div>
        </div>
      </section>
      <section aria-label="CloudBridge learning features" className="welcome-features">
        {features.map((feature) => (
          <div className="welcome-feature" key={feature.title}>
            <span><Icon name={feature.icon} size={19} /></span>
            <strong>{feature.title}</strong>
          </div>
        ))}
      </section>
    </main>
  )
}

function Sidebar({

  view,

  open,

  onClose,

  onNavigate,

  learningOverview,

}: {

  view: View

  open: boolean

  onClose: () => void

  onNavigate: (view: View) => void

  learningOverview: ReturnType<typeof getLearningOverview>

}) {

  return (

    <>

      {open && <div className="scrim" onClick={onClose} />}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}

        aria-label="Sidebar navigation"

>

        <div className="sidebar-head">

          <Logo />

          <button

            aria-label="Close navigation"

            className="icon-button close-nav"

            onClick={onClose}

          >

            <Icon name="close" />

          </button>

        </div>

        <nav aria-label="Main navigation" className="nav">

          <div className="nav-caption">Study space</div>

          {navItems.map((item) => (

            <button
              aria-label={item.label}
              title={item.label}
              className={view === item.label ? "nav-active" : ""}
              key={item.label}
              onClick={() => onNavigate(item.label)}
            >

              <Icon name={item.icon} />

              <span>{item.label}</span>

              {item.label === "Practice quizzes" && (

                <small>{az900ExamQuestions.length}</small>

              )}

            </button>

          ))}

        </nav>

        <div className="sidebar-progress">

          <div className="progress-icon">

            <Icon name="target" />

          </div>

          <span>Your progress</span>

          <strong>{learningOverview.completedLessons ? "Learning in progress" : "Ready to begin"}</strong>

          <div className="track">

            <i style={{ width: `${learningOverview.lessonCompletionPercent}%` }} />

          </div>

          <small>

            {learningOverview.completedLessons} of {learningOverview.totalLessons} lessons complete

          </small>

        </div>
</aside>

    </>

  )

}

function HomeView({
  onNavigate,
  onOpenModule,
  onEnroll,
  enrolledModules,
  completedModules,
  learningOverview,
  learningProgress,
  legacyCompletedModuleIds,
}: {
  onNavigate: (view: View) => void
  onOpenModule: (index: number) => void
  onEnroll: (index: number) => void
  enrolledModules: Set<number>
  completedModules: Set<number>
  learningOverview: ReturnType<typeof getLearningOverview>
  learningProgress: LearningProgress
  legacyCompletedModuleIds: ReadonlySet<string>
}) {
  const progress = learningOverview.lessonCompletionPercent

  return (
    <section className="home-view">
      <section className="home-welcome">
        <div className="kicker">Unofficial AZ-900 learning platform</div>
        <h1>Ready to build your Azure skills?</h1>
<p>
  Explore your learning modules, practise key concepts, and track your
  progress toward AZ-900 readiness.
</p>
      </section>

      <section className="home-enrollment">
        <div>
          <div className="eyebrow">Your next step</div>
          <h2>Ready to continue your cloud journey?</h2>
          <p>
            Explore your learning modules and build your Azure knowledge one
            step at a time.
          </p>
        </div>
        <button className="primary-button" onClick={() => onNavigate("My Learning")}>
          View My Learning <Icon name="arrow" size={17} />
        </button>
      </section>

      <section aria-label="Learner progress" className="home-progress">
        <div className="home-progress-heading">
          <div>
            <div className="eyebrow">Your learning at a glance</div>
            <h2>Learner progress</h2>
          </div>
          <strong className="home-progress-percent">{progress}%</strong>
        </div>
        <div className="home-progress-stats">
          <div><strong>{enrolledModules.size}</strong><span>Modules enrolled</span></div>
          <div><strong>{completedModules.size}</strong><span>Modules completed</span></div>
          <div><strong>{learningOverview.completedLessons}/{learningOverview.totalLessons}</strong><span>Lessons completed</span></div>
          <div><strong>{learningOverview.totalTopics}</strong><span>Curriculum topics</span></div>
          <div><strong>{learningOverview.completedKnowledgeChecks}</strong><span>Knowledge checks completed</span></div>
          <div><strong>{learningOverview.completedPracticeExams}</strong><span>Practice exams completed</span></div>
          <div><strong>{learningOverview.averagePracticeExamPercent === null ? "—" : `${learningOverview.averagePracticeExamPercent}%`}</strong><span>Practice exam average</span></div>
        </div>
        <div
          aria-label={`Overall learning progress: ${progress}%`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="home-progress-track"
          role="progressbar"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="home-progress-message">
          {enrolledModules.size === 0
            ? "Every cloud expert starts somewhere. Choose a module below to begin."
            : progress === 100
            ? "You’ve completed every lesson. Great work!"
              : "Keep going — your learning progress is saved in this browser."}
        </p>
      </section>

      <section className="home-modules">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Complete curriculum</div>
            <h2 className="section-title">Explore Learning Modules</h2>
            <p className="home-module-instruction">
              Choose a module to enrol or continue learning.
            </p>
          </div>
        </div>
        <div className="module-card-grid">
          {modules.map((module, index) => (
            <ModuleCard
              completed={completedModules.has(index)}
              enrolled={enrolledModules.has(index)}
              key={module.id}
              locked={false}
              module={module}
              lessonProgress={getModuleLessonProgress(
                module,
                learningProgress.modules[module.id],
                legacyCompletedModuleIds.has(module.id),
              )}
              onEnroll={() => onEnroll(index)}
              onStart={() => onOpenModule(index)}
            />
          ))}
        </div>
      </section>

      <section className="home-grid">

        <button className="home-action-card" onClick={() => onNavigate("Practice quizzes")}>

          <span>

            <Icon name="quiz" />

          </span>

          <div>

            <small>Knowledge checks</small>

            <strong>5 full exams · 45 questions each</strong>

            <p>Five fixed, non-overlapping question pools with randomized order and complete answer review.</p>

          </div>

          <Icon name="arrow" />

        </button>

        <button className="home-action-card" onClick={() => onNavigate("Flashcards")}>

          <span>

            <Icon name="cards" />

          </span>

          <div>

            <small>Quick revision</small>

            <strong>Objective-aligned flashcards</strong>

            <p>Review every core term and connect it to a real situation.</p>

          </div>

          <Icon name="arrow" />

        </button>

        <button className="home-action-card" onClick={() => onNavigate("Case studies")}>

          <span>

            <Icon name="target" />

          </span>

          <div>

            <small>Applied learning</small>

            <strong>Four guided case studies</strong>

            <p>See how separate Azure choices work together in one solution.</p>

          </div>

          <Icon name="arrow" />

        </button>

      </section>

    </section>

  )

}

function EnrollmentConfirmation({
  module,
  onClose,
  onStart,
  onViewLearning,
}: {
  module: CourseModule
  onClose: () => void
  onStart: () => void
  onViewLearning: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      aria-describedby="enrollment-dialog-description"
      aria-labelledby="enrollment-dialog-title"
      className="enrollment-dialog"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          onClose()
        }
      }}
      ref={dialogRef}
    >
      <button
        aria-label="Close enrollment confirmation"
        autoFocus
        className="icon-button enrollment-dialog-close"
        onClick={onClose}
        type="button"
      >
        <Icon name="close" size={18} />
      </button>
      <div className="enrollment-dialog-icon"><Icon name="check" size={25} /></div>
      <div className="eyebrow">Enrollment confirmed</div>
      <h2 id="enrollment-dialog-title">You're enrolled!</h2>
      <p id="enrollment-dialog-description">
        Hello, future cloud engineer! Your cloud journey is underway. You've
        enrolled in {module.title}.
      </p>
      <div className="enrollment-dialog-actions">
        <button className="primary-button" onClick={onStart} type="button">
          Start Learning <Icon name="arrow" size={17} />
        </button>
        <button className="secondary-button" onClick={onViewLearning} type="button">
          View My Learning
        </button>
      </div>
    </dialog>
  )
}

function ModuleDetail({

  module,

  onBack,

  onComplete,

  completed,

  savedProgress,

  onProgressChange,

  onStudyActivity,

}: {

  module: CourseModule

  onBack: () => void

  onComplete: () => void

  completed: boolean

  savedProgress: ModuleLearningProgress

  onProgressChange: (moduleId: string, progress: ModuleLearningProgress) => void

  onStudyActivity: () => void

}) {

  const lessons = useMemo(

    () =>

      module.sections.flatMap((section) =>

        section.concepts.map((item) => ({

          ...item,

          section: section.title,

        })),

      ),

    [module],

  )

  const [assessmentVersion, setAssessmentVersion] = useState<"legacy" | "v2">(
    savedProgress.assessmentVersion ?? "legacy",
  )
  const [assessmentRound, setAssessmentRound] = useState(
    savedProgress.finished
      ? Math.max(0, savedProgress.assessmentAttempts.length - 1)
      : savedProgress.assessmentAttempts.length,
  )
  const assessment = useMemo(
    () => createKnowledgeCheckQuestions(module, assessmentRound, assessmentVersion),
    [module, assessmentRound, assessmentVersion],
  )
  const sourceObjectives = useMemo(() => getObjectivesForModule(module.id), [module.id])

  const [phase, setPhase] = useState<"lessons" | "assessment">(savedProgress.phase)

  const [lessonIndex, setLessonIndex] = useState(savedProgress.currentLessonIndex)

  const [questionIndex, setQuestionIndex] = useState(savedProgress.questionIndex)

  const [selected, setSelected] = useState<number | null>(savedProgress.selectedAnswerIndex)

  const [submitted, setSubmitted] = useState(savedProgress.submitted)

  const [answers, setAnswers] = useState<Record<string, number>>(savedProgress.answers)

  const [finished, setFinished] = useState(savedProgress.finished)

  const [completedLessonIndexes, setCompletedLessonIndexes] = useState(
    savedProgress.completedLessonIndexes,
  )

  const [assessmentAttempts, setAssessmentAttempts] = useState(
    savedProgress.assessmentAttempts,
  )

  const lesson = lessons[lessonIndex]

  const question = assessment[questionIndex]

  const lessonProgress = ((lessonIndex + 1) / lessons.length) * 100
  const score = scoreKnowledgeCheckAnswers(
    answers,
    assessment.map((item) => item.answer),
  )
  const passed = finished && score >= 8

  function markCurrentLessonCompleted() {
    onStudyActivity()
    setCompletedLessonIndexes((current) =>
      current.includes(lessonIndex)
        ? current
        : [...current, lessonIndex].sort((left, right) => left - right),
    )
  }

  useEffect(() => {
    const progress: ModuleLearningProgress = {
      currentLessonIndex: lessonIndex,
      completedLessonIndexes,
      phase,
      questionIndex,
      selectedAnswerIndex: selected,
      submitted,
      answers,
      score,
      finished,
      assessmentAttempts,
      assessmentVersion,
    }
    if (JSON.stringify(progress) !== JSON.stringify(savedProgress)) {
      onProgressChange(module.id, progress)
    }
  }, [
    answers,
    assessmentAttempts,
    assessmentVersion,
    completedLessonIndexes,
    finished,
    lessonIndex,
    module.id,
    onProgressChange,
    phase,
    questionIndex,
    savedProgress,
    score,
    selected,
    submitted,
  ])

  function submitAnswer() {

    if (selected === null) return

    onStudyActivity()
    setSubmitted(true)
    setAnswers((current) => ({ ...current, [questionIndex]: selected }))

  }

  function nextQuestion() {

    if (questionIndex === assessment.length - 1) {

      setFinished(true)
      setAssessmentAttempts((current) => [
        ...current,
        {
          score,
          passed: score >= 8,
          completedAt: new Date().toISOString(),
        },
      ])

      return

    }

    setQuestionIndex((value) => value + 1)

    setSelected(null)

    setSubmitted(false)

  }

  function retryAssessment() {

    // Start the new source-aligned rotation only after resetting prior answers.
    setAssessmentRound(assessmentAttempts.length)
    setAssessmentVersion("v2")
    setQuestionIndex(0)

    setSelected(null)

    setSubmitted(false)

    setAnswers({})

    setFinished(false)

  }

  return (

    <div className="module-detail">

      <button className="back-button" onClick={onBack}>

        <Icon name="arrow" size={17} /> All modules

      </button>

      <section className="module-hero">

        <div>

          <div className="kicker">Module {module.number}</div>

          <div className="module-page-title">{module.title}</div>

          <p>{module.description}</p>

        </div>

        <div className="module-facts">

          <span>{module.sections.length} topics · {lessons.length} lessons</span>

          <strong>{completed ? "Completed" : "In progress"}</strong>

        </div>

      </section>

      <section className="objectives-panel">

        <div>

          <div className="eyebrow">Learning objectives</div>

          <div className="section-title">What you will understand</div>

        </div>

        <div className="objectives-grid">

          {module.objectives.map((objective) => (

            <div key={objective}>

              <span>

                <Icon name="check" size={14} />

              </span>

              {objective}

            </div>

          ))}

        </div>

      </section>

      <details className="source-objective-details">
        <summary>View all {sourceObjectives.length} objectives from your Azure study notes</summary>
        <ol>
          {sourceObjectives.map((objective) => (
            <li key={objective.id}>
              {objective.text}
              {objective.kind === "guided-practice" && (
                <span className="objective-practice-tag">Requires hands-on practice</span>
              )}
            </li>
          ))}
        </ol>
      </details>

      {phase === "lessons" ? (

        <section className="lesson-player">

          <div className="lesson-player-top">

            <div>

              <div className="eyebrow">{lesson.section}</div>

              <div className="lesson-count">

                Lesson {lessonIndex + 1} of {lessons.length}

              </div>

            </div>

            <span>{Math.round(lessonProgress)}% through lessons</span>

          </div>

          <div className="lesson-progress">

            <i style={{ width: `${lessonProgress}%` }} />

          </div>

          <article className="guided-lesson-card" key={lesson.title}>

            <div className="concept-top">

              <span>

                <Icon name="book" size={17} />

              </span>

              <small>Core concept</small>

            </div>

            <div className="guided-lesson-title">{lesson.title}</div>

            {sourceObjectives.some((objective) => objective.lessonTitle === lesson.title) && (
              <div className="lesson-objectives">
                <strong>From your learning objectives</strong>
                <ul>
                  {sourceObjectives.filter((objective) => objective.lessonTitle === lesson.title).map((objective) => (
                    <li key={objective.id}>{objective.text}</li>
                  ))}
                </ul>
              </div>
            )}

            <p>{lesson.definition}</p>

            <div className="scenario">

              <strong>Real-Life Scenario</strong>

              <p>{lesson.example}</p>

            </div>

          </article>

          <div className="lesson-navigation">

            <button

              className="secondary-control"

              disabled={lessonIndex === 0}

              onClick={() => setLessonIndex((value) => value - 1)}

            >

              <Icon name="arrow" size={16} /> Previous

            </button>

            {lessonIndex < lessons.length - 1 ? (

              <button

                className="primary-button"

                onClick={() => {
                  markCurrentLessonCompleted()
                  setLessonIndex((value) => value + 1)
                }}

              >

                Next lesson <Icon name="arrow" size={16} />

              </button>

            ) : (

              <button

                className="primary-button"

                onClick={() => {

                  markCurrentLessonCompleted()

                  setPhase("assessment")

                  window.scrollTo({ top: 0, behavior: "smooth" })

                }}

              >

                Start 10-question Knowledge Check

                <Icon name="arrow" size={16} />

              </button>

            )}

          </div>

        </section>

      ) : (

        <section className="module-assessment">

          <div className="assessment-head">

            <div>

              <div className="eyebrow">Mandatory knowledge check</div>

              <div className="section-title">10 questions · Pass mark 8</div>

              <p>

                Complete the assessment successfully to enable module completion

                before marking this module complete. All modules remain available to explore.

              </p>

            </div>

            <div className="assessment-score">

              <strong>{score}</strong>

              <span>correct</span>

            </div>

          </div>

          {!finished ? (

            <div className="assessment-card">

              <div className="quiz-meta">

                <span>{question.concept}</span>

                <b>

                  Question {questionIndex + 1} of {assessment.length}

                </b>

              </div>

              <div className="assessment-progress">

                <i

                  style={{

                    width: `${((questionIndex + 1) / assessment.length) * 100}%`,

                  }}

                />

              </div>

              <div className="quiz-question">{question.prompt}</div>

              <div className="assessment-options">

                {question.options.map((option, optionIndex) => (

                  <button

                    className={[

                      selected === optionIndex ? "option-selected" : "",

                      submitted && optionIndex === question.answer

                        ? "option-correct"

                        : "",

                      submitted &&

                      selected === optionIndex &&

                      selected !== question.answer

                        ? "option-wrong"

                        : "",

                    ].join(" ")}

                    disabled={submitted}

                    key={option}

                    onClick={() => setSelected(optionIndex)}

                  >

                    <span>{String.fromCharCode(65 + optionIndex)}</span>

                    {option}

                  </button>

                ))}

              </div>

              {submitted ? (

                <div className="assessment-feedback">

                  <Icon

                    name={selected === question.answer ? "check" : "book"}

                    size={18}

                  />

                  <p>

                    {selected === question.answer

                      ? "Correct. This matches the lesson definition."

                      : `Review this concept: ${question.options[question.answer]}`}

                  </p>

                  <button onClick={nextQuestion}>

                    {questionIndex === assessment.length - 1

                      ? "View result"

                      : "Next question"}

                    <Icon name="arrow" size={16} />

                  </button>

                </div>

              ) : (

                <button

                  className="primary-button"

                  disabled={selected === null}

                  onClick={submitAnswer}

                >

                  Check answer

                </button>

              )}

            </div>

          ) : (

            <div className={`assessment-result ${passed ? "result-pass" : ""}`}>

              <div className="result-icon">

                <Icon name={passed ? "check" : "book"} size={27} />

              </div>

              <div className="eyebrow">

                {passed ? "Knowledge check passed" : "More review needed"}

              </div>

              <div className="result-title">

                {score} out of {assessment.length}

              </div>

              <p>

                {passed

                  ? "You have successfully completed the mandatory assessment. You can now complete this module."

                  : "A score of 8 out of 10 is required. Review the lessons and retry when you are ready."}

              </p>

              <div className="result-actions">

                {!passed && (

                  <button

                    className="secondary-control"

                    onClick={() => {

                      setPhase("lessons")

                      setLessonIndex(0)

                    }}

                  >

                    Review lessons

                  </button>

                )}

                <button className="secondary-control" onClick={retryAssessment}>

                  Retry assessment

                </button>

                <button

                  className="complete-module-button"

                  disabled={!passed || completed}

                  onClick={onComplete}

                >

                  <Icon name="check" size={17} />

                  {completed ? "Module completed" : "Complete Module"}

                </button>

              </div>

            </div>

          )}

        </section>

      )}

    </div>

  )

}

function ModulesView({
  selectedModule,
  onSelect,
  onBack,
  completedModules,
  enrolledModules,
  onEnroll,
  onComplete,
  learningProgress,
  onProgressChange,
  onStudyActivity,
  legacyCompletedModuleIds,
}: {
  selectedModule: number | null
  onSelect: (index: number) => void
  onBack: () => void
  completedModules: Set<number>
  enrolledModules: Set<number>
  onEnroll: (index: number) => void
  onComplete: (index: number) => void
  learningProgress: LearningProgress
  onProgressChange: (moduleId: string, progress: ModuleLearningProgress) => void
  onStudyActivity: () => void
  legacyCompletedModuleIds: ReadonlySet<string>
}) {
  if (selectedModule !== null) {
    const module = modules[selectedModule]
    return (
      <ModuleDetail
        completed={completedModules.has(selectedModule)}
        module={module}
        onBack={onBack}
        onComplete={() => onComplete(selectedModule)}
        onProgressChange={onProgressChange}
        onStudyActivity={onStudyActivity}
        savedProgress={learningProgress.modules[module.id] ?? createEmptyModuleProgress()}
      />
    )
  }
  return (
    <section className="modules-view">
      <div className="view-intro">
        <div className="eyebrow">Full AZ-900 curriculum</div>
        <div className="view-title">Choose a module and start from the beginning.</div>
        <p>Every objective is mapped to a lesson, a real-life scenario, and a way to check your understanding. Enroll in any module in any order.</p>
      </div>
      <div className="module-card-grid">
        {modules.map((module, index) => (
          <ModuleCard
            completed={completedModules.has(index)}
            enrolled={enrolledModules.has(index)}
            key={module.id}
            locked={false}
            module={module}
            lessonProgress={getModuleLessonProgress(
              module,
              learningProgress.modules[module.id],
              legacyCompletedModuleIds.has(module.id),
            )}
            onEnroll={() => onEnroll(index)}
            onStart={() => onSelect(index)}
          />
        ))}
      </div>
    </section>
  )
}

function MyLearningView({
  enrolledModules,
  startedModules,
  completedModules,
  learningProgress,
  legacyCompletedModuleIds,
  onOpenModule,
  onBrowseModules,
}: {
  enrolledModules: Set<number>
  startedModules: Set<number>
  completedModules: Set<number>
  learningProgress: LearningProgress
  legacyCompletedModuleIds: ReadonlySet<string>
  onOpenModule: (index: number) => void
  onBrowseModules: () => void
}) {
  const enrolled = modules
    .map((module, index) => ({ module, index }))
    .filter(({ index }) => enrolledModules.has(index))

  return (
    <section className="modules-view">
      <div className="view-intro">
        <div className="eyebrow">Your personal learning space</div>
        <div className="view-title">My Learning</div>
        <p>All your enrolled modules, together in one place. Pick up where you left off whenever you return.</p>
      </div>

      {enrolled.length === 0 ? (
        <div className="learning-empty">
          <div className="module-card-icon"><Icon name="book" size={24} /></div>
          <h2>No enrolled modules yet</h2>
          <p>Browse the AZ-900 curriculum and enrol in a module to add it here.</p>
          <button className="primary-button" onClick={onBrowseModules}>
            Browse modules <Icon name="arrow" size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="learning-summary">
            <strong>{enrolled.length} module{enrolled.length === 1 ? "" : "s"} enrolled</strong>
            <span>{completedModules.size} of {enrolled.length} enrolled module{enrolled.length === 1 ? "" : "s"} completed</span>
          </div>
          <div className="module-card-grid">
            {enrolled.map(({ module, index }) => {
              const completed = completedModules.has(index)
              const started = startedModules.has(index)
              const status = completed ? "Completed" : started ? "In progress" : "Not started"
              const lessonProgress = getModuleLessonProgress(
                module,
                learningProgress.modules[module.id],
                legacyCompletedModuleIds.has(module.id),
              )
              return (
                <article className={`module-card ${completed ? "module-card-completed" : ""}`} key={module.id}>
                  <div className="module-card-number">{module.number}</div>
                  <div className="module-card-icon">
                    <Icon name={module.number === "01" ? "cloud" : module.number === "02" ? "target" : module.number === "03" ? "spark" : "book"} size={24} />
                  </div>
                  <div className="module-card-meta">{module.sections.length} topics · {lessonProgress.totalLessons} lessons</div>
                  <div className="module-lesson-progress">
                    <div>
                      <span>Lessons completed</span>
                      <strong>{lessonProgress.percent}%</strong>
                    </div>
                    <div aria-label={`${lessonProgress.percent}% of lessons completed`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={lessonProgress.percent} className="module-lesson-track" role="progressbar">
                      <span style={{ width: `${lessonProgress.percent}%` }} />
                    </div>
                    <small>{lessonProgress.completedLessons} of {lessonProgress.totalLessons} lessons</small>
                  </div>
                  <div className={`module-status ${completed ? "status-complete" : ""}`}>{status}</div>
                  <div className="module-card-title">{module.title}</div>
                  <p>{module.description}</p>
                  <div className="learning-card-actions">
                    <button className="primary-button" onClick={() => onOpenModule(index)}>
                      {completed ? "Review module" : started ? "Continue learning" : "Start learning"}
                      <Icon name="arrow" size={17} />
                    </button>
                    <button className="text-button" onClick={onBrowseModules}>Browse all modules</button>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

const examCategories: AZ900Category[] = [
  "Cloud concepts",
  "Azure architecture and services",
  "Azure management and governance",
]

const categoryModules: Record<AZ900Category, string[]> = {
  "Cloud concepts": ["Cloud concepts"],
  "Azure architecture and services": ["Azure architecture", "Azure services"],
  "Azure management and governance": ["Governance & security"],
}

function QuizView({
  savedSessions,
  examHistory,
  onSessionChange,
  onExamCompleted,
  onStudyActivity,
}: {
  savedSessions: Record<string, ExamSession>
  examHistory: CompletedExamAttempt[]
  onSessionChange: (examId: string, session: ExamSession | null) => void
  onExamCompleted: (attempt: CompletedExamAttempt) => void
  onStudyActivity: () => void
}) {
  const initialExamId = Object.keys(savedSessions)[0] ?? null
  const initialSession = initialExamId ? savedSessions[initialExamId] : null
  const [examId, setExamId] = useState<string | null>(initialExamId)
  const [attemptId, setAttemptId] = useState(initialSession?.attemptId ?? "")
  const [attempt, setAttempt] = useState<ExamQuestionAttempt[]>(() =>
    initialSession ? restoreExamAttempt(initialSession) : [],
  )
  const [index, setIndex] = useState(initialSession?.index ?? 0)
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialSession?.answers ?? {},
  )
  const [finished, setFinished] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const exam = practiceExams.find((item) => item.id === examId) ?? null
  const current = attempt[index]
  const question = current?.question
  const answeredCount = Object.keys(answers).length
  const score = attempt.reduce(
    (total, item) => total + Number(answers[item.question.id] === item.question.correctAnswer),
    0,
  )
  const unansweredCount = attempt.length - answeredCount
  const percentage = attempt.length ? Math.round((score / attempt.length) * 100) : 0

  function startExam(id: string) {
    const session = savedSessions[id] ?? createExamAttempt(id)
    setExamId(id)
    setAttemptId(session.attemptId)
    setAttempt(restoreExamAttempt(session))
    setIndex(session.index)
    setAnswers(session.answers)
    setFinished(false)
    setConfirmSubmit(false)
  }

  function selectAnswer(answer: string) {
    if (!question) return
    onStudyActivity()
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: answer }))
  }

  function submitExam() {
    if (!examId) return
    setConfirmSubmit(false)
    const completedAttempt: CompletedExamAttempt = {
      attemptId,
      examId,
      questionIds: attempt.map(({ question: item }) => item.id),
      optionsByQuestion: Object.fromEntries(
        attempt.map(({ question: item, options }) => [item.id, options]),
      ),
      answers,
      index,
      score,
      completedAt: new Date().toISOString(),
    }
    onSessionChange(examId, null)
    onExamCompleted(completedAttempt)
    setFinished(true)
  }

  useEffect(() => {
    if (!examId || finished || !attempt.length) return
    const session: ExamSession = {
      attemptId,
      examId,
      questionIds: attempt.map(({ question: item }) => item.id),
      optionsByQuestion: Object.fromEntries(
        attempt.map(({ question: item, options }) => [item.id, options]),
      ),
      answers,
      index,
    }
    if (JSON.stringify(session) !== JSON.stringify(savedSessions[examId])) {
      onSessionChange(examId, session)
    }
  }, [
    answers,
    attempt,
    attemptId,
    examId,
    finished,
    index,
    onSessionChange,
    savedSessions,
  ])

  if (!exam || !examId || !attempt.length) {
    return (
      <section className="quiz-view">
        <div className="view-intro">
          <div className="eyebrow">Exam practice</div>
          <div className="view-title">Build confidence, one practice exam at a time.</div>
          <p>Each exam contains 45 non-overlapping questions: 13 cloud concepts, 18 architecture and services, and 14 management and governance. Question and answer order are randomized. Answers and explanations appear in your results review.</p>
          <p className="exam-verification-note">{currentQuestionAudit.flaggedForVerification} of {currentQuestionAudit.total} questions are explicitly flagged for verification. The remaining {currentQuestionAudit.notFlaggedButNotIndependentlyVerified} are not independently certified or reviewed. These scores are for CloudBridge study practice, not a Microsoft exam-readiness prediction.</p>
        </div>
        <div className="module-card-grid exam-choice-grid">
          {practiceExams.map((item, examIndex) => (
            <article className="module-card" key={item.id}>
              <div className="module-card-number">0{examIndex + 1}</div>
              <div className="module-card-icon"><Icon name="quiz" size={24} /></div>
              <div className="module-card-meta">{practiceExamPools[examIndex].length} questions · Mixed difficulty</div>
              <div className="module-card-title">{item.title}</div>
              <p>{item.subtitle}</p>
              <button className="primary-button" onClick={() => startExam(item.id)}>
                {savedSessions[item.id] ? "Resume practice exam" : "Start practice exam"}
                <Icon name="arrow" size={17} />
              </button>
            </article>
          ))}
        </div>
        {examHistory.length > 0 && (
          <section aria-label="Completed practice exam history" className="exam-review">
            <div className="view-title">Completed practice exams</div>
            {examHistory.map((item) => {
              const completedExam = practiceExams.find((examItem) => examItem.id === item.examId)
              return (
                <div className="exam-review-item" key={item.attemptId}>
                  <div className="exam-history-row">
                    <span>
                      <strong>{completedExam?.title ?? "Practice exam"}</strong>
                      <small>{new Date(item.completedAt).toLocaleString()} · {item.score} / {item.questionIds.length}</small>
                    </span>
                    <button className="secondary-control" onClick={() => {
                      setExamId(item.examId)
                      setAttemptId(item.attemptId)
                      setAttempt(restoreExamAttempt(item))
                      setIndex(item.index)
                      setAnswers(item.answers)
                      setFinished(true)
                    }}>
                      Review results
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </section>
    )
  }

  if (finished) {
    const recommendations = examCategories
      .filter((category) => {
        const categoryQuestions = attempt.filter((item) => item.question.category === category)
        const categoryCorrect = categoryQuestions.filter(
          (item) => answers[item.question.id] === item.question.correctAnswer,
        ).length
        return categoryQuestions.length > 0 && categoryCorrect / categoryQuestions.length < 0.7
      })
      .flatMap((category) => categoryModules[category])

    return (
      <section className="quiz-view">
        <div className="assessment-result exam-result">
          <div className="result-icon"><Icon name="book" size={27} /></div>
          <div className="eyebrow">{exam.title} complete</div>
          <div className="result-title">{score} out of {attempt.length}</div>
          <p>{percentage}% correct · CloudBridge practice percentage (not Microsoft's scaled exam score). Unanswered questions count as incorrect.</p>
          <div className="result-category-grid">
            {examCategories.map((category) => {
              const categoryQuestions = attempt.filter((item) => item.question.category === category)
              const categoryCorrect = categoryQuestions.filter(
                (item) => answers[item.question.id] === item.question.correctAnswer,
              ).length
              return (
                <div className="result-category" key={category}>
                  <strong>{categoryCorrect} / {categoryQuestions.length}</strong>
                  <span>{category}</span>
                </div>
              )
            })}
          </div>
          <p className="exam-recommendations">
            {recommendations.length
              ? `Review these CloudBridge modules: ${[...new Set(recommendations)].join(", ")}.`
              : "Your results are balanced across all three areas. Keep reviewing the explanations below."}
          </p>
          <div className="result-actions">
            <button className="secondary-control" onClick={() => startExam(exam.id)}>Retake this exam</button>
            <button className="primary-button" onClick={() => { setExamId(null); setConfirmSubmit(false) }}>Choose another exam</button>
          </div>
        </div>
        <section aria-label="Exam answer review" className="exam-review">
          <div className="view-title">Answer review</div>
          {attempt.map(({ question: item }, questionIndex) => (
            <details className="exam-review-item" key={item.id}>
              <summary>
                <span>Question {questionIndex + 1}: {item.question}</span>
                <b>{answers[item.id] === item.correctAnswer ? "Correct" : answers[item.id] ? "Incorrect" : "Unanswered"}</b>
              </summary>
              <div className="exam-review-content">
                <p><strong>Your answer:</strong> {answers[item.id] ?? "Not answered"}</p>
                <p><strong>Correct answer:</strong> {item.correctAnswer}</p>
                <p>{item.explanation}</p>
                <small>{item.category} · {item.objective} · {item.difficulty}</small>
                {item.verificationStatus === "needs-verification" && (
                  <p className="exam-verification-note">
                    Needs verification against official Microsoft Learn documentation.
                  </p>
                )}
              </div>
            </details>
          ))}
        </section>
      </section>
    )
  }

  return (
    <section className="quiz-view">
      <div className="view-intro">
        <div className="eyebrow">{exam.title}</div>
        <div className="view-title">45-question AZ-900 practice exam</div>
        <p>Choose one answer for each question. You can move between questions without losing answers. Correct answers are shown after final submission.</p>
      </div>
      {question && current && <div className="quiz-layout exam-layout">
        <div className="quiz-card exam-question-card">
          <div className="quiz-meta"><span>{question.category}</span><b>Question {index + 1} of {attempt.length}</b></div>
          <div className="assessment-progress"><i style={{ width: `${((index + 1) / attempt.length) * 100}%` }} /></div>
          <p className="exam-objective">
            {question.objective} · {question.difficulty}
            {question.verificationStatus === "needs-verification" && (
              <strong className="verification-badge">Needs Microsoft Learn verification</strong>
            )}
          </p>
          <div className="quiz-question">{question.question}</div>
          <div className="quiz-options">
            {current.options.map((option, optionIndex) => (
              <button
                aria-pressed={answers[question.id] === option}
                className={answers[question.id] === option ? "option-selected" : ""}
                key={option}
                onClick={() => selectAnswer(option)}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
              </button>
            ))}
          </div>
          <div className="exam-navigation-controls">
            <button className="secondary-control" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Previous</button>
            {index < attempt.length - 1 && <button className="secondary-control" onClick={() => setIndex((value) => value + 1)}>Next</button>}
            <button className="primary-button exam-submit-button" onClick={() => setConfirmSubmit(true)}>Submit exam</button>
          </div>
          {confirmSubmit && (
            <div aria-labelledby="exam-submit-title" className="exam-submit-confirmation" role="group">
              <strong id="exam-submit-title">Submit this exam?</strong>
              <p>              {unansweredCount ? `${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"} will count as incorrect.` : `You have answered all ${attempt.length} questions.`} You can still cancel and review your answers.</p>
              <div>
                <button className="secondary-control" onClick={() => setConfirmSubmit(false)}>Keep reviewing</button>
                <button className="primary-button" onClick={submitExam}>Submit final answers</button>
              </div>
            </div>
          )}
          <nav aria-label="Exam question navigation" className="exam-question-jump">
            {attempt.map((item, questionIndex) => (
              <button
                aria-current={questionIndex === index ? "step" : undefined}
                aria-label={`Question ${questionIndex + 1}${answers[item.question.id] ? ", answered" : ", unanswered"}`}
                className={`${questionIndex === index ? "question-current" : ""} ${answers[item.question.id] ? "question-answered" : ""}`}
                key={item.question.id}
                onClick={() => setIndex(questionIndex)}
              >
                {questionIndex + 1}
              </button>
            ))}
          </nav>
        </div>
        <aside className="quiz-score exam-score">
          <div className="score-ring"><strong>{answeredCount}</strong><span>answered</span></div>
          <div className="eyebrow">Exam progress</div>
          <p>Question {index + 1} of {attempt.length}. Your answers are kept as you navigate.</p>
          <div className="mini-stat"><span>Answered</span><strong>{answeredCount}</strong></div>
          <div className="mini-stat"><span>Remaining</span><strong>{attempt.length - answeredCount}</strong></div>
          <button className="text-button" onClick={() => { setExamId(null); setConfirmSubmit(false) }}>Exit to exam list</button>
        </aside>
      </div>}
    </section>
  )
}

function FlashcardsView({ onStudyActivity }: { onStudyActivity: () => void }) {

  const allCards = useMemo(

    () =>

      modules.flatMap((module) =>

        module.sections.flatMap((section) =>

          section.concepts.map((item) => ({

            module: module.shortTitle,

            title: item.title,

            definition: item.definition,

            example: item.example,

          })),

        ),

      ),

    [],

  )

  const [moduleFilter, setModuleFilter] = useState("All")

  const [index, setIndex] = useState(0)

  const [flipped, setFlipped] = useState(false)

  const cards =

    moduleFilter === "All"

      ? allCards

      : allCards.filter((card) => card.module === moduleFilter)

  const card = cards[index % cards.length]

  function changeCard(nextIndex: number) {

    setIndex((nextIndex + cards.length) % cards.length)

    setFlipped(false)
    onStudyActivity()

  }

  function filter(value: string) {

    setModuleFilter(value)

    setIndex(0)

    setFlipped(false)

  }

  return (

    <section className="flashcards-view">

      <div className="view-intro">

        <div className="eyebrow">Flashcards</div>

        <div className="view-title">Recall the term. Connect the meaning.</div>

        <p>Every card comes from the curriculum and includes a real-life scenario.</p>

      </div>

      <div className="filter-row">

        <button

          className={moduleFilter === "All" ? "filter-active" : ""}

          onClick={() => filter("All")}

        >

          All

        </button>

        {modules.map((module) => (

          <button

            className={moduleFilter === module.shortTitle ? "filter-active" : ""}

            key={module.id}

            onClick={() => filter(module.shortTitle)}

          >

            {module.shortTitle}

          </button>

        ))}

      </div>

      <div className="flashcard-shell">

        <button

          aria-label="Previous flashcard"

          className="round-control back-arrow"

          onClick={() => changeCard(index - 1)}

        >

          <Icon name="arrow" />

        </button>

        <button

          className={`flashcard ${flipped ? "flashcard-flipped" : ""}`}

          onClick={() => {
            setFlipped((value) => !value)
            onStudyActivity()
          }}

        >

          {!flipped ? (

            <>

              <span>{card.module}</span>

              <small>What does this mean?</small>

              <strong>{card.title}</strong>

              <i>Click to reveal</i>

            </>

          ) : (

            <>

              <span>{card.title}</span>

              <p>{card.definition}</p>

              <div className="flashcard-example">

                <b>Real-Life Scenario</b>

                {card.example}

              </div>

              <i>Click to see the term</i>

            </>

          )}

        </button>

        <button

          aria-label="Next flashcard"

          className="round-control"

          onClick={() => changeCard(index + 1)}

        >

          <Icon name="arrow" />

        </button>

      </div>

      <div className="card-count">

        Card {(index % cards.length) + 1} of {cards.length}

      </div>

    </section>

  )

}

function CaseStudiesView() {

  const [openCase, setOpenCase] = useState(0)

  return (

    <section className="cases-view">

      <div className="view-intro">

        <div className="eyebrow">Case studies</div>

        <div className="view-title">See the whole solution, not isolated terms.</div>

        <p>

          Each walkthrough joins several objectives into one realistic decision

          path.

        </p>

      </div>

      <div className="case-tabs">

        {modules.map((module, index) => (

          <button

            className={openCase === index ? "case-tab-active" : ""}

            key={module.id}

            onClick={() => setOpenCase(index)}

          >

            <span>{module.number}</span>

            {module.shortTitle}

          </button>

        ))}

      </div>

      <article className="case-study">

        <div className="case-study-top">

          <div>

            <div className="eyebrow">Applied Azure scenario</div>

            <div className="case-title">{modules[openCase].caseStudy.title}</div>

            <p>{modules[openCase].caseStudy.context}</p>

          </div>

          <div className="case-badge">Module {modules[openCase].number}</div>

        </div>

        <div className="case-steps">

          {modules[openCase].caseStudy.steps.map((step, index) => (

            <div key={step}>

              <span>{index + 1}</span>

              <p>{step}</p>

            </div>

          ))}

        </div>

        <div className="case-takeaway">

          <Icon name="spark" />

          <div>

            <strong>Key takeaway</strong>

            <p>{modules[openCase].caseStudy.takeaway}</p>

          </div>

        </div>

      </article>

    </section>

  )

}

type StudyPlanValues = {
  examDate: string
  weeklyDays: string
  minutes: string
  focusModule: string
  goal: string
}

const studyPlanStorageKey = "cloudbridge-study-plan-v1"
const studyPlanDefaults: StudyPlanValues = {
  examDate: "",
  weeklyDays: "4",
  minutes: "30",
  focusModule: modules[0].id,
  goal: "Build confidence across all AZ-900 objectives",
}
const validStudyDays = ["2", "3", "4", "5", "6", "7"]
const validStudyMinutes = ["15", "20", "30", "45", "60", "90"]

function isStudyPlanValues(value: unknown): value is StudyPlanValues {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const plan = value as Record<string, unknown>
  return (
    typeof plan.examDate === "string" &&
    typeof plan.weeklyDays === "string" &&
    validStudyDays.includes(plan.weeklyDays) &&
    typeof plan.minutes === "string" &&
    validStudyMinutes.includes(plan.minutes) &&
    typeof plan.focusModule === "string" &&
    modules.some((module) => module.id === plan.focusModule) &&
    typeof plan.goal === "string" &&
    plan.goal.length <= 120
  )
}

function readStudyPlan(): { values: StudyPlanValues; error: string | null } {
  try {
    const storedPlan = window.localStorage.getItem(studyPlanStorageKey)
    if (storedPlan) {
      const parsed: unknown = JSON.parse(storedPlan)
      if (!isStudyPlanValues(parsed)) throw new Error("Invalid saved study plan")
      return { values: parsed, error: null }
    }

    return {
      values: {
        examDate: window.localStorage.getItem("cloudbridge-plan-date") ?? studyPlanDefaults.examDate,
        weeklyDays: window.localStorage.getItem("cloudbridge-plan-days") ?? studyPlanDefaults.weeklyDays,
        minutes: window.localStorage.getItem("cloudbridge-plan-minutes") ?? studyPlanDefaults.minutes,
        focusModule: window.localStorage.getItem("cloudbridge-plan-focus") ?? studyPlanDefaults.focusModule,
        goal: window.localStorage.getItem("cloudbridge-plan-goal") ?? studyPlanDefaults.goal,
      },
      error: null,
    }
  } catch {
    return {
      values: studyPlanDefaults,
      error: "Your saved study plan could not be loaded. You can still create and save a new plan.",
    }
  }
}

function StudyPlanView() {
  const [initialPlan] = useState(readStudyPlan)
  const [examDate, setExamDate] = useState(initialPlan.values.examDate)
  const [weeklyDays, setWeeklyDays] = useState(initialPlan.values.weeklyDays)
  const [minutes, setMinutes] = useState(initialPlan.values.minutes)
  const [focusModule, setFocusModule] = useState(initialPlan.values.focusModule)
  const [goal, setGoal] = useState(initialPlan.values.goal)
  const [saved, setSaved] = useState(false)
  const [planError, setPlanError] = useState<string | null>(initialPlan.error)
  const savedTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current !== null) {
        window.clearTimeout(savedTimeoutRef.current)
      }
    }
  }, [])

  const today = new Date()
  const minimumExamDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(false)
    setPlanError(null)

    if (!goal.trim()) {
      setPlanError("Enter a study goal before saving your plan.")
      return
    }

    if (!validStudyDays.includes(weeklyDays) || !validStudyMinutes.includes(minutes)) {
      setPlanError("Choose valid study days and session duration.")
      return
    }

    if (!modules.some((module) => module.id === focusModule)) {
      setPlanError("Choose a valid priority topic.")
      return
    }

    if (examDate) {
      const [year, month, day] = examDate.split("-").map(Number)
      const selectedDate = new Date(year, month - 1, day)
      const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(examDate) ||
        selectedDate.getFullYear() !== year ||
        selectedDate.getMonth() !== month - 1 ||
        selectedDate.getDate() !== day ||
        selectedDate < todayAtMidnight
      ) {
        setPlanError("Choose a valid exam date that is today or later.")
        return
      }
    }

    const plan: StudyPlanValues = {
      examDate,
      weeklyDays,
      minutes,
      focusModule,
      goal: goal.trim(),
    }

    try {
      window.localStorage.setItem(studyPlanStorageKey, JSON.stringify(plan))
      setGoal(plan.goal)
      setSaved(true)
      if (savedTimeoutRef.current !== null) {
        window.clearTimeout(savedTimeoutRef.current)
      }
      savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 2200)
    } catch {
      setPlanError("Your study plan could not be saved. Check browser storage access and try again.")
    }
  }

  const focus = modules.find((module) => module.id === focusModule) || modules[0]
  const daysUntilExam = examDate ? Math.ceil((new Date(`${examDate}T23:59:59`).getTime() - Date.now()) / 86400000) : null
  const sessionsPerWeek = Number(weeklyDays)
  const minutesPerSession = Number(minutes)
  const suggestedSessions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter((_, index) => index % Math.max(1, Math.floor(7 / sessionsPerWeek)) === 0).slice(0, sessionsPerWeek)

  return (
    <section className="plan-view">
      <div className="view-intro">
        <div className="eyebrow">Your personal study planner</div>
        <div className="view-title">Make a plan that fits your life.</div>
        <p>Set your target, choose how often you can study, and save your preferences in this browser. You can change them at any time.</p>
      </div>
      <div className="plan-layout">
        <form className="week-card personal-plan-form" onSubmit={handleSave}>
          <div className="week-head"><div><small>Personal settings</small><strong>Study goals</strong></div><Icon name="calendar" size={23} /></div>
          <label className="plan-field">What are you working towards?<input value={goal} maxLength={120} onChange={(event) => { setGoal(event.target.value); setSaved(false) }} placeholder="e.g. Feel ready for the AZ-900 exam" required /></label>
          <label className="plan-field">Target exam date <span className="optional-label">(optional)</span><input type="date" value={examDate} min={minimumExamDate} onChange={(event) => { setExamDate(event.target.value); setSaved(false) }} /></label>
          <label className="plan-field">Study days per week<select value={weeklyDays} onChange={(event) => { setWeeklyDays(event.target.value); setSaved(false) }}>{validStudyDays.map((dayCount) => <option value={dayCount} key={dayCount}>{dayCount} days a week</option>)}</select></label>
          <label className="plan-field">Time per session<select value={minutes} onChange={(event) => { setMinutes(event.target.value); setSaved(false) }}>{validStudyMinutes.map((duration) => <option value={duration} key={duration}>{duration} minutes</option>)}</select></label>
          <label className="plan-field">Priority topic<select value={focusModule} onChange={(event) => { setFocusModule(event.target.value); setSaved(false) }}>{modules.map((module) => <option value={module.id} key={module.id}>{module.shortTitle}</option>)}</select></label>
          <button className="primary-button" type="submit">Save my study plan <Icon name="check" size={17} /></button>
          {saved && <p className="plan-saved" role="status">Your study plan has been saved in this browser.</p>}
          {planError && <p className="plan-error" role="alert">{planError}</p>}
        </form>
        <div className="coverage-card personal-plan-preview">
          <div className="module-card-icon"><Icon name="target" /></div>
          <div className="eyebrow">Your weekly outline</div>
          <div className="coverage-title">Small, consistent steps add up.</div>
          <p className="plan-preview-copy">{goal || "Build confidence across all AZ-900 objectives"}</p>
          {daysUntilExam !== null && <div className="exam-countdown"><strong>{daysUntilExam < 0 ? "Date has passed" : daysUntilExam === 0 ? "Exam day" : `${daysUntilExam} days`}</strong><span>{daysUntilExam < 0 ? "Update your target date to plan ahead." : "until your target exam date"}</span></div>}
          <div className="plan-session-list">
            {suggestedSessions.map((day, index) => <div className="plan-session" key={day}><span>{index + 1}</span><div><small>{day} · {minutesPerSession} min</small><strong>{index === 0 ? focus.shortTitle : index === 1 ? "Recall & flashcards" : index === 2 ? "Practice questions" : index % 2 ? "Review difficult concepts" : "Case study practice"}</strong></div></div>)}
          </div>
          <div className="plan-time-total"><Icon name="calendar" size={18} /><span><strong>{sessionsPerWeek * minutesPerSession} minutes</strong><small>planned study time each week</small></span></div>
        </div>
      </div>
      <div className="coverage-card coverage-all-modules">
        <div className="eyebrow">Exam objective coverage</div><div className="coverage-title">Work through all four learning areas.</div>
        {modules.map((module) => <div className="coverage-row" key={module.id}><span>{module.number}</span><div><strong>{module.shortTitle}</strong><i /></div><b>{module.sections.length} topics · {module.sections.reduce((total, section) => total + section.concepts.length, 0)} lessons</b></div>)}
        <p className="plan-preview-copy">Use the plan alongside lessons, knowledge checks, practice quizzes, flashcards, and case studies. Completion in CloudBridge is a study aid, not a guarantee of passing the official exam.</p>
      </div>
    </section>
  )
}

function readStoredIndexSet(key: string): Set<number> {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(
      parsed.filter(
        (value): value is number =>
          Number.isInteger(value) && value >= 0 && value < modules.length,
      ),
    )
  } catch {
    return new Set()
  }
}

const practiceExamIds = practiceExams.map((exam) => exam.id)

function readBrowserLearningProgress(): {
  progress: LearningProgress
  error: string | null
} {
  try {
    return readLearningProgress(window.localStorage, practiceExamIds)
  } catch {
    return {
      progress: createEmptyLearningProgress(),
      error: "Saved learning progress could not be read. Check browser storage access.",
    }
  }
}

export default function App() {

  const [view, setView] = useState<View>("Home")
  const [welcomeCompleted, setWelcomeCompleted] = useState(hasCompletedWelcome)
  const [initialLearningProgress] = useState(readBrowserLearningProgress)
  const [learningProgress, setLearningProgress] = useState(initialLearningProgress.progress)
  const [progressStorageError, setProgressStorageError] = useState(
    initialLearningProgress.error,
  )
  const [learningProgressDirty, setLearningProgressDirty] = useState(false)

  const [navOpen, setNavOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [enrollmentConfirmation, setEnrollmentConfirmation] = useState<number | null>(null)
  const [enrolledModules, setEnrolledModules] = useState<Set<number>>(() =>
    readStoredIndexSet("cloudbridge-enrolled-v1"),
  )
  const [startedModules, setStartedModules] = useState<Set<number>>(() =>
    readStoredIndexSet("cloudbridge-started-v1"),
  )
  const [completedModules, setCompletedModules] = useState<Set<number>>(() =>
    readStoredIndexSet("cloudbridge-completed-v1"),
  )
  const legacyCompletedModuleIds = new Set(
    modules.flatMap((module, index) =>
      completedModules.has(index) ? [module.id] : [],
    ),
  )
  const learningOverview = getLearningOverview(
    learningProgress,
    legacyCompletedModuleIds,
  )
  const studyStreak = calculateStudyStreak(learningProgress.studyActivityDays)

  const recordStudyActivity = useCallback(() => {
    setLearningProgressDirty(true)
    setLearningProgress((current) => ({
      ...current,
      studyActivityDays: addStudyActivityDay(current.studyActivityDays),
    }))
  }, [])

  useEffect(() => {
    if (!welcomeCompleted) return
    try {
      window.localStorage.setItem("cloudbridge-enrolled-v1", JSON.stringify([...enrolledModules]))
      window.localStorage.setItem("cloudbridge-started-v1", JSON.stringify([...startedModules]))
      window.localStorage.setItem("cloudbridge-completed-v1", JSON.stringify([...completedModules]))
    } catch {
      // CloudBridge remains usable when browser storage is unavailable.
    }
  }, [welcomeCompleted, enrolledModules, startedModules, completedModules])

  useEffect(() => {
    if (!welcomeCompleted || !learningProgressDirty) return
    try {
      setProgressStorageError(
        writeLearningProgress(window.localStorage, learningProgress),
      )
    } catch {
      setProgressStorageError(
        "Learning progress could not be saved. Check browser storage access and try again.",
      )
    }
  }, [learningProgress, learningProgressDirty, welcomeCompleted])

  const updateModuleProgress = useCallback(
    (moduleId: string, progress: ModuleLearningProgress) => {
      setLearningProgressDirty(true)
      setLearningProgress((current) => ({
        ...current,
        modules: { ...current.modules, [moduleId]: progress },
      }))
    },
    [],
  )

  const updateExamSession = useCallback(
    (examId: string, session: ExamSession | null) => {
      setLearningProgressDirty(true)
      setLearningProgress((current) => {
        const practiceExamSessions = { ...current.practiceExamSessions }
        if (session) practiceExamSessions[examId] = session
        else delete practiceExamSessions[examId]
        return { ...current, practiceExamSessions }
      })
    },
    [],
  )

  const recordCompletedExam = useCallback((attempt: CompletedExamAttempt) => {
    setLearningProgressDirty(true)
    setLearningProgress((current) => ({
      ...current,
      practiceExamHistory: [...current.practiceExamHistory, attempt],
      studyActivityDays: addStudyActivityDay(current.studyActivityDays),
    }))
  }, [])

  function completeWelcome() {
    try {
      window.localStorage.setItem(welcomeCompletedKey, "true")
    } catch {
      // Continue to the dashboard when browser storage is unavailable.
    }
    setWelcomeCompleted(true)
  }

  function navigate(nextView: View) {

    setView(nextView)

    setNavOpen(false)

    if (nextView !== "Modules") setSelectedModule(null)

    window.scrollTo({ top: 0, behavior: "smooth" })

  }

  function enrollModule(index: number, showConfirmation = false) {
    if (index < 0 || index >= modules.length || enrolledModules.has(index)) return

    setEnrolledModules((current) => {
      const next = new Set(current)
      next.add(index)
      return next
    })
    if (showConfirmation) setEnrollmentConfirmation(index)
  }

  function openModule(index: number) {
    if (index < 0 || index >= modules.length || !enrolledModules.has(index)) return
    setStartedModules((current) => new Set(current).add(index))
    setLearningProgressDirty(true)
    setLearningProgress((current) => ({
      ...current,
      activeModuleId: modules[index].id,
    }))
    setSelectedModule(index)

    setView("Modules")

    window.scrollTo({ top: 0, behavior: "smooth" })

  }

  function completeModule(index: number) {

    setEnrolledModules((current) => new Set(current).add(index))
    setStartedModules((current) => new Set(current).add(index))
    setCompletedModules((current) => new Set(current).add(index))

    setSelectedModule(null)

    setView("Modules")

    window.scrollTo({ top: 0, behavior: "smooth" })

  }

  if (!welcomeCompleted) {
    return <WelcomeScreen onGetStarted={completeWelcome} />
  }

  return (

    <div className="app-shell">

      <Sidebar

        learningOverview={learningOverview}

        onClose={() => setNavOpen(false)}

        onNavigate={navigate}

        open={navOpen}

        view={view}

      />

      <main className="main">

        <button

          aria-expanded={navOpen}

          aria-label={navOpen ? "Close main navigation" : "Open main navigation"}

          className="home-menu"

          onClick={() => setNavOpen((value) => !value)}

        >

          <Icon name={navOpen ? "close" : "menu"} />

          {navOpen ? "Close" : "Menu"}

        </button>

        <header className="mobile-header">

          <Logo />

          <button

            aria-expanded={navOpen}

            aria-label={navOpen ? "Close main navigation" : "Open main navigation"}

            className="icon-button"

            onClick={() => setNavOpen((value) => !value)}

          >

            <Icon name={navOpen ? "close" : "menu"} />

          </button>

        </header>

        <div className="page">

          {progressStorageError && (
            <p className="plan-error" role="alert">{progressStorageError}</p>
          )}

          {view !== "Home" && (

            <header className="page-header">

              <div>

                <div className="page-date">AZ-900 learning platform</div>

                <div className="page-name">{view}</div>

              </div>

              <div className="streak">

                <Icon name="spark" />

                <span>

                  <strong>{studyStreak} day{studyStreak === 1 ? "" : "s"} streak</strong>

                  <small>

                    {learningProgress.studyActivityDays.length
                      ? `${learningOverview.completedLessons} lessons · ${learningProgress.studyActivityDays.length} study day${learningProgress.studyActivityDays.length === 1 ? "" : "s"}`
                      : "Study a lesson or quiz to begin"}

                  </small>

                </span>

              </div>

            </header>

          )}

          {view === "Home" && (

            <HomeView

              completedModules={completedModules}
              enrolledModules={enrolledModules}
              learningOverview={learningOverview}
              learningProgress={learningProgress}
              legacyCompletedModuleIds={legacyCompletedModuleIds}
              onEnroll={(index) => enrollModule(index, true)}
              onNavigate={navigate}
              onOpenModule={openModule}

            />

          )}

          {view === "Modules" && (

            <ModulesView

              completedModules={completedModules}

              onBack={() => setSelectedModule(null)}

              onComplete={completeModule}
              enrolledModules={enrolledModules}
              learningProgress={learningProgress}
              onEnroll={(index) => enrollModule(index, true)}
              onProgressChange={updateModuleProgress}
              onStudyActivity={recordStudyActivity}
              legacyCompletedModuleIds={legacyCompletedModuleIds}
              onSelect={openModule}
              selectedModule={selectedModule}

            />

          )}

          {view === "My Learning" && (
            <MyLearningView
              completedModules={completedModules}
              enrolledModules={enrolledModules}
              learningProgress={learningProgress}
              legacyCompletedModuleIds={legacyCompletedModuleIds}
              onBrowseModules={() => navigate("Modules")}
              onOpenModule={openModule}
              startedModules={startedModules}
            />
          )}
          {view === "Practice quizzes" && (
            <QuizView
              examHistory={learningProgress.practiceExamHistory}
              onExamCompleted={recordCompletedExam}
              onSessionChange={updateExamSession}
              savedSessions={learningProgress.practiceExamSessions}
              onStudyActivity={recordStudyActivity}
            />
          )}

          {view === "Flashcards" && (
            <FlashcardsView onStudyActivity={recordStudyActivity} />
          )}

          {view === "Case studies" && <CaseStudiesView />}

          {view === "Scenario practice" && <ScenarioPracticeView onStudyActivity={recordStudyActivity} />}

          {view === "Learning objectives" && (
            <ObjectivesTrackerView
              learningProgress={learningProgress}
              legacyCompletedModuleIds={legacyCompletedModuleIds}
              onBrowseModules={() => navigate("Modules")}
              onOpenScenarios={() => navigate("Scenario practice")}
            />
          )}

          {view === "Study plan" && <StudyPlanView />}

          {enrollmentConfirmation !== null && (
            <EnrollmentConfirmation
              module={modules[enrollmentConfirmation]}
              onClose={() => setEnrollmentConfirmation(null)}
              onStart={() => {
                const index = enrollmentConfirmation
                setEnrollmentConfirmation(null)
                openModule(index)
              }}
              onViewLearning={() => {
                setEnrollmentConfirmation(null)
                navigate("My Learning")
              }}
            />
          )}

          <footer>

            CloudBridge is an independent study tool and is not affiliated with or

            endorsed by Microsoft.

          </footer>

        </div>

      </main>

    </div>

  )

}
