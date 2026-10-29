# Question review workflow — do not confuse code tests with content accuracy

The existing 264 author-created AZ-900 questions have not undergone a complete independent expert validation. Current status: 206 flagged as needing verification, 18 reviewed against the user's Azure notes (not against authoritative current documentation), and 40 lacking a review classification.

For every item to be reviewed, a human reviewer should:

1. Confirm the question matches a skill listed in the **current Microsoft Learn AZ-900 guide** and assign the proper domain.
2. Check the stem is unambiguous, one answer is best under its stated conditions, and every distractor is genuinely incorrect.
3. Cross-check the answer and all explanations against a specific current Microsoft Learn documentation page; record the URL and date.
4. Check wording for outdated Azure product names or changing features; remove obsolete, unsupported or misleading claims.
5. Have a second reviewer approve the item before changing its verification classification. Do not claim Microsoft certification or endorsement.
6. Run `npm test`, `npm run typecheck`, and `npm run build`, then manually confirm the item displays correctly on mobile and desktop.

Consider keeping review metadata in source control (reviewer, date, URL, outcome) rather than learner browser state. An audit register already exists in `docs/question-review-register.csv` and can be updated independently. Make one coherent reviewed batch per Git commit to ease rollback.

The source materials include subjects outside the specific current study-guide bullets. Where that happens, preserve the user's notes as supplemental lessons and distinguish them from official exam scope.
