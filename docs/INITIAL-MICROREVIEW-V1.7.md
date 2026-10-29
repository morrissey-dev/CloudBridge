# V1.7 — initial Microsoft Learn cross-check (not final question approval)

**Cross-check date:** 28 October 2026. **Status:** AI-assisted editorial research; an independent qualified human reviewer must still check wording, all distractors, scope, and expected correct answers before approving any item as publication-quality or exam-ready. No existing bank status is promoted automatically by this report.

The uploaded *Microsoft Azure.docx* provides the first notes reference. The following questions from `src/az900GovernanceQuestions.ts` were individually compared with current official Microsoft Learn documentation. The linked Microsoft Learn pages are additional external verification sources, not part of the user's uploaded notes.

| Question ID | Decision / observation | Microsoft Learn source | Next check |
|---|---|---|---|
| `added-gov-source-003` | Answer on Reservations is consistent with stable, predictable eligible usage. | [Savings plan vs reservation](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation) | Confirm all distractors and qualifiers with human reviewer |
| `added-gov-source-004` | Savings plan for compute uses a committed hourly spend for eligible usage, not a specific VM size. | [What are savings plans?](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview) | Recheck changing eligibility before publication |
| `added-gov-source-006` | Pricing Calculator provides estimates; merely adding a product to a calculation does not provision it. | [Pricing calculator documentation](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator) | Validate all distractors independently |
| `added-gov-source-010` | Policy initiatives group multiple related policy definitions. | [Initiative definition structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition-structure) | Validate policy terminology and alternative answers |
| `added-gov-source-011` | Delete/CanNotDelete locks prevent deletion but allow authorized changes; a ReadOnly lock is stronger. | [Lock Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources) | Confirm edge cases of resource operations |

## Findings and changes

- These five specific expected answers are consistent with the cited primary documentation as of the review date.
- **No question was labelled officially verified or independently approved.** Each question still requires a second-person editorial sign-off and distractor review.
- All 264 questions remain in the structured review queue. `docs/QUESTION-REVIEW-QUEUE-V1.7.csv` intentionally leaves reviewer, date, official URL and decision columns blank for manual approval.
- Next batch to prioritise: the 206 items marked `needs-verification`, beginning with those used in five practice exams. Ensure Microsoft exam scope and product names remain current.

The official exam-guide reference is [AZ-900 study guide (skills measured July 20, 2026)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900).
