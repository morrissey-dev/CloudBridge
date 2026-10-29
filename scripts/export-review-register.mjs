import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { az900ExamQuestions } from "../src/az900Exam.ts"
import { buildReviewQueueCSV, getReviewQueue } from "../src/questionReviewLedger.ts"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const target = resolve(projectRoot, "docs/QUESTION-REVIEW-QUEUE-V1.7.csv")
writeFileSync(target, buildReviewQueueCSV(az900ExamQuestions), "utf8")
const queue = getReviewQueue(az900ExamQuestions)
const byStatus = Object.groupBy(queue, (item) => item.reviewStage)
console.log(`Wrote ${queue.length} source questions to ${target}`)
console.log(`Still pending authoritative review: ${queue.length} (flagged: ${byStatus["needs-verification"]?.length ?? 0}, unclassified: ${byStatus.unclassified?.length ?? 0}, notes-reviewed only: ${byStatus["notes-reviewed"]?.length ?? 0})`)
