import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import {

  modules,

  practiceQuestions,

  type CourseModule,

} from "./curriculum"

type View =

  | "Home"

  | "Modules"

  | "My Learning"

  | "Practice quizzes"

  | "Flashcards"

  | "Case studies"

  | "Study plan"

type IconName =

  | "arrow"

  | "book"

  | "calendar"

  | "cards"

  | "check"

  | "chevron"

  | "close"

  | "cloud"

  | "home"

  | "menu"

  | "quiz"

  | "spark"

  | "target"

const navItems: { label: View; icon: IconName }[] = [

  { label: "Home", icon: "home" },

  { label: "Modules", icon: "book" },

  { label: "My Learning", icon: "check" },

  { label: "Practice quizzes", icon: "quiz" },

  { label: "Flashcards", icon: "cards" },

  { label: "Case studies", icon: "target" },

  { label: "Study plan", icon: "calendar" },

]

type KnowledgeQuestion = {

  concept: string

  prompt: string

  options: string[]

  answer: number

}

function buildKnowledgeCheck(module: CourseModule): KnowledgeQuestion[] {

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

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {

  const paths: Record<IconName, ReactNode> = {

    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,

    book: (

      <>

        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />

        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />

      </>

    ),

    calendar: (

      <>

        <rect x="3" y="5" width="18" height="16" rx="3" />

        <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />

      </>

    ),

    cards: (

      <>

        <rect x="5" y="3" width="14" height="18" rx="3" />

        <path d="M9 8h6M9 12h4M3.5 7.5 2.4 17a3 3 0 0 0 2.65 3.33" />

      </>

    ),

    check: <path d="m5 12 4 4L19 6" />,

    chevron: <path d="m9 18 6-6-6-6" />,

    close: <path d="m6 6 12 12M18 6 6 18" />,

    cloud: (

      <path d="M17.5 19H6a4 4 0 0 1-.4-7.98A6.5 6.5 0 0 1 18.1 9.6 4.7 4.7 0 0 1 17.5 19Z" />

    ),

    home: (

      <>

        <path d="m3 11 9-8 9 8" />

        <path d="M5 10v10h14V10M9 20v-6h6v6" />

      </>

    ),

    menu: <path d="M4 7h16M4 12h16M4 17h16" />,

    quiz: (

      <>

        <rect x="4" y="3" width="16" height="18" rx="3" />

        <path d="M8 8h.01M11 8h5M8 12h.01M11 12h5M8 16h.01M11 16h5" />

      </>

    ),

    spark: (

      <path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />

    ),

    target: (

      <>

        <circle cx="12" cy="12" r="9" />

        <circle cx="12" cy="12" r="5" />

        <circle cx="12" cy="12" r="1" />

      </>

    ),

  }

  return (

    <svg

      aria-hidden="true"

      fill="none"

      height={size}

      viewBox="0 0 24 24"

      width={size}

    >

      <g

        stroke="currentColor"

        strokeLinecap="round"

        strokeLinejoin="round"

        strokeWidth="1.8"

      >

        {paths[name]}

      </g>

    </svg>

  )

}

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

  completedCount,

}: {

  view: View

  open: boolean

  onClose: () => void

  onNavigate: (view: View) => void

  completedCount: number

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

                <small>{practiceQuestions.length}</small>

              )}

            </button>

          ))}

        </nav>

        <div className="sidebar-progress">

          <div className="progress-icon">

            <Icon name="target" />

          </div>

          <span>Your progress</span>

          <strong>{completedCount ? "Learning in progress" : "Ready to begin"}</strong>

          <div className="track">

            <i style={{ width: `${(completedCount / modules.length) * 100}%` }} />

          </div>

          <small>

            {completedCount} of {modules.length} modules complete

          </small>

        </div>
</aside>

    </>

  )

}

function ModuleCard({
  module,
  onStart,
  onEnroll,
  enrolled,
  locked,
  completed,
}: {
  module: CourseModule
  onStart: () => void
  onEnroll: () => void
  enrolled: boolean
  locked: boolean
  completed: boolean
}) {
  const count = module.sections.reduce((total, section) => total + section.concepts.length, 0)
  return (
    <article className={`module-card ${locked ? "module-card-locked" : ""} ${completed ? "module-card-completed" : ""}`}>
      <div className="module-card-number">{module.number}</div>
      <div className="module-card-icon"><Icon name={module.number === "01" ? "cloud" : module.number === "02" ? "target" : module.number === "03" ? "spark" : "book"} size={24} /></div>
      <div className="module-card-meta">{module.duration} · {count} topics</div>
      <div className={`module-status ${completed ? "status-complete" : ""}`}>{completed ? "Completed" : enrolled ? "Enrolled" : locked ? "Locked" : "Available"}</div>
      <div className="module-card-title">{module.title}</div>
      <p>{module.description}</p>
      <div className="module-preview">
        {module.sections.slice(0, 3).map((section, index) => <div key={section.title}><span>{index + 1}</span>{section.title}</div>)}
      </div>
      <button
        className="primary-button"
        disabled={locked}
        onClick={enrolled ? onStart : onEnroll}
      >
        {completed ? "Review Module" : enrolled ? "Continue Learning" : "Enroll to Start Learning"}
        <Icon name="arrow" size={17} />
      </button>
    </article>
  )
}

function HomeView({
  onNavigate,
  onOpenModule,
  onEnroll,
  enrolledModules,
  completedModules,
}: {
  onNavigate: (view: View) => void
  onOpenModule: (index: number) => void
  onEnroll: (index: number) => void
  enrolledModules: Set<number>
  completedModules: Set<number>
}) {
  const progress = Math.round((completedModules.size / modules.length) * 100)

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
          <div><strong>{progress}%</strong><span>Overall progress</span></div>
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
              ? "You’ve completed every learning module. Great work!"
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

            <strong>3 practice exams · {practiceQuestions.length} questions</strong>

            <p>Original scenarios with a clear explanation after every answer.</p>

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

}: {

  module: CourseModule

  onBack: () => void

  onComplete: () => void

  completed: boolean

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

  const assessment = useMemo(() => buildKnowledgeCheck(module), [module])

  const [phase, setPhase] = useState<"lessons" | "assessment">("lessons")

  const [lessonIndex, setLessonIndex] = useState(0)

  const [questionIndex, setQuestionIndex] = useState(0)

  const [selected, setSelected] = useState<number | null>(null)

  const [submitted, setSubmitted] = useState(false)

  const [score, setScore] = useState(0)

  const [finished, setFinished] = useState(false)

  const lesson = lessons[lessonIndex]

  const question = assessment[questionIndex]

  const passed = finished && score >= 8

  const lessonProgress = ((lessonIndex + 1) / lessons.length) * 100

  function submitAnswer() {

    if (selected === null) return

    setSubmitted(true)

    if (selected === question.answer) setScore((value) => value + 1)

  }

  function nextQuestion() {

    if (questionIndex === assessment.length - 1) {

      setFinished(true)

      return

    }

    setQuestionIndex((value) => value + 1)

    setSelected(null)

    setSubmitted(false)

  }

  function retryAssessment() {

    setQuestionIndex(0)

    setSelected(null)

    setSubmitted(false)

    setScore(0)

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

          <span>{module.duration}</span>

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

                onClick={() => setLessonIndex((value) => value + 1)}

              >

                Next lesson <Icon name="arrow" size={16} />

              </button>

            ) : (

              <button

                className="primary-button"

                onClick={() => {

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

                and unlock the next module.

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
}: {
  selectedModule: number | null
  onSelect: (index: number) => void
  onBack: () => void
  completedModules: Set<number>
  enrolledModules: Set<number>
  onEnroll: (index: number) => void
  onComplete: (index: number) => void
}) {
  if (selectedModule !== null) {
    return <ModuleDetail completed={completedModules.has(selectedModule)} module={modules[selectedModule]} onBack={onBack} onComplete={() => onComplete(selectedModule)} />
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
  onOpenModule,
  onBrowseModules,
}: {
  enrolledModules: Set<number>
  startedModules: Set<number>
  completedModules: Set<number>
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
              const topicCount = module.sections.reduce((total, section) => total + section.concepts.length, 0)
              return (
                <article className={`module-card ${completed ? "module-card-completed" : ""}`} key={module.id}>
                  <div className="module-card-number">{module.number}</div>
                  <div className="module-card-icon">
                    <Icon name={module.number === "01" ? "cloud" : module.number === "02" ? "target" : module.number === "03" ? "spark" : "book"} size={24} />
                  </div>
                  <div className="module-card-meta">{module.duration} · {topicCount} topics</div>
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

const practiceExams = [
  { id: "exam-1", title: "Practice Exam 1", subtitle: "Cloud foundations & core Azure services", questions: practiceQuestions.slice(0, 10) },
  { id: "exam-2", title: "Practice Exam 2", subtitle: "Architecture, security & governance", questions: practiceQuestions.slice(10, 20) },
  { id: "exam-3", title: "Practice Exam 3", subtitle: "Mixed AZ-900 review", questions: practiceQuestions.slice(20, 30) },
]

function QuizView() {
  const [examId, setExamId] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const exam = practiceExams.find((item) => item.id === examId) ?? null
  const questions = exam?.questions ?? []
  const question = questions[index]
  const correct = question ? selected === question.answer : false

  function startExam(id: string) {
    setExamId(id)
    setIndex(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setFinished(false)
  }

  function submit() {
    if (selected === null || !question) return
    setSubmitted(true)
    if (selected === question.answer) setScore((value) => value + 1)
  }

  function next() {
    if (!exam) return
    if (index === questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
    setSubmitted(false)
  }

  if (!exam) {
    return (
      <section className="quiz-view">
        <div className="view-intro">
          <div className="eyebrow">Exam practice</div>
          <div className="view-title">Build confidence, one practice exam at a time.</div>
          <p>Choose one of three original 10-question practice exams. Each answer includes an explanation. These are practice questions, not official Microsoft exam items.</p>
        </div>
        <div className="module-card-grid exam-choice-grid">
          {practiceExams.map((item, examIndex) => (
            <article className="module-card" key={item.id}>
              <div className="module-card-number">0{examIndex + 1}</div>
              <div className="module-card-icon"><Icon name="quiz" size={24} /></div>
              <div className="module-card-meta">10 questions · Mixed difficulty</div>
              <div className="module-card-title">{item.title}</div>
              <p>{item.subtitle}</p>
              <button className="primary-button" onClick={() => startExam(item.id)}>Start practice exam <Icon name="arrow" size={17} /></button>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (finished) {
    const passed = score >= Math.ceil(questions.length * 0.7)
    return (
      <section className="quiz-view">
        <div className={`assessment-result ${passed ? "result-pass" : ""}`}>
          <div className="result-icon"><Icon name={passed ? "check" : "book"} size={27} /></div>
          <div className="eyebrow">{exam.title} complete</div>
          <div className="result-title">{score} out of {questions.length}</div>
          <p>{passed ? "Good work! Review any missed questions, then try another exam to strengthen your readiness." : "Keep practising. Review the explanations for missed questions and try again when ready."}</p>
          <div className="result-actions">
            <button className="secondary-control" onClick={() => startExam(exam.id)}>Retake this exam</button>
            <button className="primary-button" onClick={() => setExamId(null)}>Choose another exam</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="quiz-view">
      <div className="view-intro">
        <div className="eyebrow">{exam.title}</div>
        <div className="view-title">{exam.subtitle}</div>
        <p>Answer each question, read the feedback, and finish the 10-question set to see your result.</p>
      </div>
      {question && <div className="quiz-layout">
        <div className="quiz-card">
          <div className="quiz-meta"><span>{question.module}</span><b>Question {index + 1} / {questions.length}</b></div>
          <div className="assessment-progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <div className="quiz-question">{question.question}</div>
          <div className="quiz-options">
            {question.options.map((option, optionIndex) => (
              <button className={[selected === optionIndex ? "option-selected" : "", submitted && optionIndex === question.answer ? "option-correct" : "", submitted && selected === optionIndex && !correct ? "option-wrong" : ""].join(" ")} disabled={submitted} key={option} onClick={() => setSelected(optionIndex)}>
                <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
              </button>
            ))}
          </div>
          {submitted ? (
            <div className={`quiz-feedback ${correct ? "feedback-correct" : ""}`}>
              <Icon name={correct ? "check" : "book"} size={19} />
              <div><strong>{correct ? "Correct." : "Review this one."}</strong><p>{question.explanation}</p></div>
              <button onClick={next}>{index === questions.length - 1 ? "View result" : "Next question"} <Icon name="arrow" size={16} /></button>
            </div>
          ) : <button className="primary-button" disabled={selected === null} onClick={submit}>Check answer</button>}
        </div>
        <aside className="quiz-score">
          <div className="score-ring"><strong>{score}</strong><span>correct so far</span></div>
          <div className="eyebrow">Exam progress</div>
          <p>Take your time. Understand why an answer is right before moving on.</p>
          <div className="mini-stat"><span>Answered</span><strong>{index + (submitted ? 1 : 0)}</strong></div>
          <div className="mini-stat"><span>Remaining</span><strong>{questions.length - index - (submitted ? 1 : 0)}</strong></div>
          <button className="text-button" onClick={() => setExamId(null)}>Exit to exam list</button>
        </aside>
      </div>}
    </section>
  )
}

function FlashcardsView() {

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

          onClick={() => setFlipped((value) => !value)}

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

function StudyPlanView() {
  const readPlanValue = (key: string, fallback: string) => {
    try { return window.localStorage.getItem(key) || fallback } catch { return fallback }
  }
  const [examDate, setExamDate] = useState(() => readPlanValue("cloudbridge-plan-date", ""))
  const [weeklyDays, setWeeklyDays] = useState(() => readPlanValue("cloudbridge-plan-days", "4"))
  const [minutes, setMinutes] = useState(() => readPlanValue("cloudbridge-plan-minutes", "30"))
  const [focusModule, setFocusModule] = useState(() => readPlanValue("cloudbridge-plan-focus", modules[0].id))
  const [goal, setGoal] = useState(() => readPlanValue("cloudbridge-plan-goal", "Build confidence across all AZ-900 objectives"))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem("cloudbridge-plan-date", examDate)
      window.localStorage.setItem("cloudbridge-plan-days", weeklyDays)
      window.localStorage.setItem("cloudbridge-plan-minutes", minutes)
      window.localStorage.setItem("cloudbridge-plan-focus", focusModule)
      window.localStorage.setItem("cloudbridge-plan-goal", goal)
    } catch { /* The study plan still works for this session if storage is unavailable. */ }
  }, [examDate, weeklyDays, minutes, focusModule, goal])

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
        <p>Set your target, choose how often you can study, and CloudBridge will keep your preferences in this browser. You can change them at any time.</p>
      </div>
      <div className="plan-layout">
        <form className="week-card personal-plan-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2200) }}>
          <div className="week-head"><div><small>Personal settings</small><strong>Study goals</strong></div><Icon name="calendar" size={23} /></div>
          <label className="plan-field">What are you working towards?<input value={goal} maxLength={120} onChange={(event) => setGoal(event.target.value)} placeholder="e.g. Feel ready for the AZ-900 exam" /></label>
          <label className="plan-field">Target exam date <span className="optional-label">(optional)</span><input type="date" value={examDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setExamDate(event.target.value)} /></label>
          <label className="plan-field">Study days per week<select value={weeklyDays} onChange={(event) => setWeeklyDays(event.target.value)}>{["2", "3", "4", "5", "6", "7"].map((dayCount) => <option value={dayCount} key={dayCount}>{dayCount} days a week</option>)}</select></label>
          <label className="plan-field">Time per session<select value={minutes} onChange={(event) => setMinutes(event.target.value)}>{["15", "20", "30", "45", "60", "90"].map((duration) => <option value={duration} key={duration}>{duration} minutes</option>)}</select></label>
          <label className="plan-field">Priority topic<select value={focusModule} onChange={(event) => setFocusModule(event.target.value)}>{modules.map((module) => <option value={module.id} key={module.id}>{module.shortTitle}</option>)}</select></label>
          <button className="primary-button" type="submit">Save my study plan <Icon name="check" size={17} /></button>
          {saved && <p className="plan-saved" role="status">Your study plan has been saved in this browser.</p>}
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
        {modules.map((module) => <div className="coverage-row" key={module.id}><span>{module.number}</span><div><strong>{module.shortTitle}</strong><i /></div><b>{module.sections.reduce((total, section) => total + section.concepts.length, 0)} topics</b></div>)}
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

export default function App() {

  const [view, setView] = useState<View>("Home")
  const [welcomeCompleted, setWelcomeCompleted] = useState(hasCompletedWelcome)

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

        completedCount={completedModules.size}

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

          {view !== "Home" && (

            <header className="page-header">

              <div>

                <div className="page-date">AZ-900 learning platform</div>

                <div className="page-name">{view}</div>

              </div>

              <div className="streak">

                <Icon name="spark" />

                <span>

                  <strong>0 day streak</strong>

                  <small>

                    {completedModules.size

                      ? `${completedModules.size} module${completedModules.size === 1 ? "" : "s"} complete`

                      : "Complete a module to begin"}

                  </small>

                </span>

              </div>

            </header>

          )}

          {view === "Home" && (

            <HomeView

              completedModules={completedModules}
              enrolledModules={enrolledModules}
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
              onEnroll={enrollModule}
              onSelect={openModule}
              selectedModule={selectedModule}

            />

          )}

          {view === "My Learning" && (
            <MyLearningView
              completedModules={completedModules}
              enrolledModules={enrolledModules}
              onBrowseModules={() => navigate("Modules")}
              onOpenModule={openModule}
              startedModules={startedModules}
            />
          )}
          {view === "Practice quizzes" && <QuizView />}

          {view === "Flashcards" && <FlashcardsView />}

          {view === "Case studies" && <CaseStudiesView />}

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
