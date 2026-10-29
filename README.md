# CloudBridge

**Your bridge to Azure cloud confidence.**

CloudBridge is an unofficial Microsoft Azure Fundamentals (AZ-900) learning platform designed to help learners study cloud concepts, practise exam-style questions, and revise key topics in a structured way.


## The Problem

Learners preparing for AZ-900 need to understand a broad range of cloud concepts, Azure services, and management and governance topics. Relying on passive reading alone can make it difficult to identify knowledge gaps and prepare effectively.


## The Solution

CloudBridge brings learning and revision tools together in one platform, helping learners study concepts, test their understanding, and organise their preparation.



## Key Features


- **Learning Modules:** Explore structured Azure Fundamentals learning content.

- **Practice Quizzes:** Take one of five randomized, non-overlapping 45-question AZ-900 practice exams with area-level scoring and answer review. New questions are visibly marked for verification against official Microsoft Learn documentation.

- **Flashcards:** Review key terms and concepts.

- **Case Studies:** Apply cloud concepts to practical scenarios.

- **Study Planner:** Organise revision sessions and learning goals.

- **My Learning:** Track enrolled modules and learning progress.



## AZ-900 Learning Areas


CloudBridge is designed around the Azure Fundamentals learning objectives, including:

- Cloud concepts

- Azure architecture and services

- Azure management and governance



## Technology Stack

- React

- TypeScript

- Vite

- CSS



## Getting Started

### Prerequisites



Install [Node.js](https://nodejs.org/) and npm.


### Installation



Clone the repository:

```bash

git clone https://github.com/morrissey-dev/CloudBridge.git

cd CloudBridge

```



Install dependencies:
```bash

npm install

```



Start the development server:

```bash

npm run dev

```

Follow the local URL printed in your terminal to open the application.



### Production Build

Run:

```bash

npm run build

```



## Progress and Data

Study plans and learning progress are stored locally in the browser where supported by the application. Lesson positions, completed lessons, knowledge-check answers and results, unfinished practice exams, and completed exam history are included. Progress is not necessarily synchronised between different devices or browsers.

The first-visit welcome screen stores its completion flag separately in browser local storage; it does not replace or reset learning progress. Existing enrollment, started-module, and completed-module data remains in its original storage keys. Curriculum topic and lesson counts, module completion percentages, assessment results, exam averages, daily study dates, and consecutive-day streaks are calculated from saved progress and the curriculum. Study activity is recorded when a learner completes lesson steps, submits quiz answers, or reviews flashcards; multiple study actions on one local calendar day count as one study day.

## Project Status

CloudBridge is a learning project intended to support Azure Fundamentals preparation. It is not an official Microsoft product, and it does not replace Microsoft's official learning materials.



## Repository

[https://github.com/morrissey-dev/CloudBridge](https://github.com/morrissey-dev/CloudBridge)

## Version 1.1 — Source-aligned assessment improvements

- 63 unique objectives from the user-provided learning objectives document are linked to existing lessons. See `docs/learning-objective-alignment.csv`.
- New assessments select 10 concepts from across module sections, rotating through the complete curriculum across repeated attempts. Old, partially completed assessments continue using their original questions and answers until a retry.
- Five independent 45-question exams each contain 13 cloud concepts, 18 architecture/services and 14 management/governance questions, matching the AZ-900 target percentage bands.
- Reclassified identity/access/security questions into their official AZ-900 area and added 18 source-based governance study questions.
- The dashboard's knowledge-check-completion count represents distinct modules with passing checks, not the number of retries.
- Practice exam raw percentages are labelled as CloudBridge scores rather than Microsoft certification scaled scores.

**Content limitation:** New exam questions are marked for independent verification. Mapping an objective to a lesson does not prove the learner has mastered that objective; in particular, network-access configuration needs a hands-on exercise. CloudBridge is not affiliated with Microsoft and makes no certification guarantee.

**Deployment:** On a computer with network access, run `npm ci`, `npm test`, `npx tsc --noEmit`, and `npm run build`. If a native binding error appears after copying `node_modules` from another operating system, remove that `node_modules` directory and run a clean installation using `npm ci`.


## Version 1.2 — Objective-linked scenario practice (first milestone)

- Added a **Scenario practice** page with 12 original applied-decision questions (four per AZ-900 domain).
- Each question references an objective from the supplied `Learning objective.docx`, and the scenarios were authored using `Microsoft Azure.docx` as the study reference.
- Learners choose answers, receive explanations and takeaways, and can retry. Latest results and attempt counts are saved in `cloudbridge-scenario-practice-v1`, independently of the existing lesson, quiz, and exam local-storage keys.
- Added unit tests for scenario validation and saved-answer normalization.
- This first milestone covers **12 of 63** mapped objectives. It is not a full objective-mastery system. Existing exam questions marked for verification are still pending review.
- Production build was **not verified** in the development container because the uploaded dependency copy lacks Vite's native binding; install fresh dependencies on your machine with `npm ci`.

### Upgrading without losing your code

See [`docs/HOW-TO-UPGRADE-V1.2.md`](docs/HOW-TO-UPGRADE-V1.2.md).
Use the incremental patch on a clean v1.1 working tree, not by overwriting your existing folder with this archive.

## Version 1.3 — Objective progress and learner backups

- Added a searchable **Learning objectives** screen covering all 63 distinct objectives from the uploaded study-outcomes document.
- Separated learner self-confidence from objective-linked lesson completion and scenario performance; these signals do not assert examination readiness.
- Added private, browser-based progress backup and restore for CloudBridge data only, with import confirmation.
- Added dynamic question-bank review counts: 224 of 264 questions explicitly require verification; the remaining 40 are not independently certified or reviewed.
- Existing V1.2 saved progress keys and scenario-answer schema remain unchanged.
- Expanded automated tests to 41 passing cases; TypeScript check passed. Production Vite build still needs a clean local dependency install to verify.

See `docs/V1.3-RELEASE-NOTES.md` and `docs/HOW-TO-UPGRADE-V1.3.md` for details.
