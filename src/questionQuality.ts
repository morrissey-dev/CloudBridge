import { az900ExamQuestions, type AZ900Question } from "./az900Exam.ts"

/** Structural checks are not factual review against Microsoft documentation. */
export function auditQuestionBank(questions: readonly AZ900Question[]) {
  const notesReviewed = questions.filter((item) => item.verificationStatus === "notes-reviewed").length
  const unclassified = questions.filter((item) => !item.verificationStatus).length
  const missingReviewSources = questions.filter((item) => item.verificationStatus === "notes-reviewed" && !item.reviewSource?.trim()).map((item) => item.id)
  const flaggedForVerification = questions.filter((item) => item.verificationStatus === "needs-verification").length
  const missingExplanations = questions.filter((item) => !item.explanation.trim()).map((item) => item.id)
  const invalidAnswers = questions.filter((item) =>
    item.options.length !== 4 ||
    new Set(item.options).size !== 4 ||
    !item.options.includes(item.correctAnswer),
  ).map((item) => item.id)
  const duplicateIds = questions.filter((item, index) =>
    questions.findIndex((candidate) => candidate.id === item.id) !== index,
  ).map((item) => item.id)
  const duplicatedStems = questions.filter((item, index) =>
    questions.findIndex((candidate) => candidate.question.trim().toLowerCase() === item.question.trim().toLowerCase()) !== index,
  ).map((item) => item.id)
  return {
    total: questions.length,
    flaggedForVerification,
    notesReviewed,
    unclassified,
    missingReviewSources,
    notFlaggedButNotIndependentlyVerified: unclassified,
    missingExplanations,
    invalidAnswers,
    duplicateIds,
    duplicatedStems,
  }
}

export const currentQuestionAudit = auditQuestionBank(az900ExamQuestions)


/** Review coverage for a *specific* exam; never describes notes-reviewed items as officially verified. */
export function summarizeExamReviewStatus(questions: readonly AZ900Question[]) {
  return {
    total: questions.length,
    flaggedForVerification: questions.filter((item) => item.verificationStatus === "needs-verification").length,
    notesReviewed: questions.filter((item) => item.verificationStatus === "notes-reviewed").length,
    unclassified: questions.filter((item) => !item.verificationStatus).length,
    independentlyVerified: 0, // no independently verified status is defined for this authored bank
  }
}
