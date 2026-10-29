import { az900ExamQuestions, type AZ900Question } from "./az900Exam.ts"

export type ReviewQueueItem = {
  id: string
  category: string
  objective: string
  difficulty: string
  stem: string
  choices: readonly string[]
  expectedAnswer: string
  explanation: string
  reviewStage: "needs-verification" | "notes-reviewed" | "unclassified"
  needsOfficialReview: true
  source: string
  warnings: string[]
}

/** Editorial queue: no test or status flag in this file establishes answer correctness. */
export function getReviewQueue(questions: readonly AZ900Question[] = az900ExamQuestions): ReviewQueueItem[] {
  const ranked: Record<ReviewQueueItem["reviewStage"], number> = {
    "needs-verification": 0,
    unclassified: 1,
    "notes-reviewed": 2,
  }
  return questions.map((question): ReviewQueueItem => {
    const warnings: string[] = []
    if (question.options.length !== 4 || new Set(question.options).size !== 4) warnings.push("INVALID_OPTIONS")
    if (!question.options.includes(question.correctAnswer)) warnings.push("ANSWER_NOT_IN_OPTIONS")
    if (!question.explanation.trim()) warnings.push("MISSING_EXPLANATION")
    if (question.verificationStatus === "notes-reviewed" && !question.reviewSource?.trim()) warnings.push("MISSING_REVIEW_SOURCE")
    return {
      id: question.id,
      category: question.category,
      objective: question.objective,
      difficulty: question.difficulty,
      stem: question.question,
      choices: question.options,
      expectedAnswer: question.correctAnswer,
      explanation: question.explanation,
      reviewStage: question.verificationStatus ?? "unclassified",
      needsOfficialReview: true,
      source: question.reviewSource ?? "",
      warnings,
    }
  }).sort((a, b) => ranked[a.reviewStage] - ranked[b.reviewStage] || a.category.localeCompare(b.category) || a.id.localeCompare(b.id))
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`
}

/** Export the entire authored bank without guessing any missing review decisions. */
export function buildReviewQueueCSV(questions: readonly AZ900Question[] = az900ExamQuestions): string {
  const lines = [[
    "question_id", "domain", "learning_objective", "difficulty", "stem", "option_a", "option_b", "option_c", "option_d", "expected_answer", "answer_explanation", "review_stage", "official_doc_review_pending", "existing_source", "structural_warnings", "official_doc_url_to_fill", "reviewer_to_fill", "review_date_to_fill", "editorial_decision_to_fill",
  ].map(csvCell).join(",")]
  for (const item of getReviewQueue(questions)) {
    lines.push([
      item.id, item.category, item.objective, item.difficulty, item.stem, ...item.choices, item.expectedAnswer, item.explanation, item.reviewStage, "YES",
      item.source, item.warnings.join("; "), "", "", "", "",
    ].map(csvCell).join(","))
  }
  return lines.join("\n") + "\n"
}
