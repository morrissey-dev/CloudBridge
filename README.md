\# CloudBridge

\*\*Your bridge to Azure cloud confidence.\*\*

CloudBridge is an unofficial Microsoft Azure Fundamentals (AZ-900) learning platform designed to help learners study cloud concepts, practise exam-style questions, and revise key topics in a structured way.


\## The Problem

Learners preparing for AZ-900 need to understand a broad range of cloud concepts, Azure services, and management and governance topics. Relying on passive reading alone can make it difficult to identify knowledge gaps and prepare effectively.


\## The Solution

CloudBridge brings learning and revision tools together in one platform, helping learners study concepts, test their understanding, and organise their preparation.



\## Key Features


\- \*\*Learning Modules:\*\* Explore structured Azure Fundamentals learning content.

\- \*\*Practice Quizzes:\*\* Take one of five randomized, non-overlapping 45-question AZ-900 practice exams with area-level scoring and answer review. New questions are visibly marked for verification against official Microsoft Learn documentation.

\- \*\*Flashcards:\*\* Review key terms and concepts.

\- \*\*Case Studies:\*\* Apply cloud concepts to practical scenarios.

\- \*\*Study Planner:\*\* Organise revision sessions and learning goals.

\- \*\*My Learning:\*\* Track enrolled modules and learning progress.



\## AZ-900 Learning Areas


CloudBridge is designed around the Azure Fundamentals learning objectives, including:

\- Cloud concepts

\- Azure architecture and services

\- Azure management and governance



\## Technology Stack

\- React

\- TypeScript

\- Vite

\- CSS



\## Getting Started

\### Prerequisites



Install \[Node.js](https://nodejs.org/) and npm.


\### Installation



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



\### Production Build

Run:

```bash

npm run build

```



\## Progress and Data

Study plans and learning progress are stored locally in the browser where supported by the application. Lesson positions, completed lessons, knowledge-check answers and results, unfinished practice exams, and completed exam history are included. Progress is not necessarily synchronised between different devices or browsers.

The first-visit welcome screen stores its completion flag separately in browser local storage; it does not replace or reset learning progress. Existing enrollment, started-module, and completed-module data remains in its original storage keys. Curriculum topic and lesson counts, module completion percentages, assessment results, exam averages, daily study dates, and consecutive-day streaks are calculated from saved progress and the curriculum. Study activity is recorded when a learner completes lesson steps, submits quiz answers, or reviews flashcards; multiple study actions on one local calendar day count as one study day.

\## Project Status

CloudBridge is a learning project intended to support Azure Fundamentals preparation. It is not an official Microsoft product, and it does not replace Microsoft's official learning materials.



\## Repository

\[https://github.com/morrissey-dev/CloudBridge](https://github.com/morrissey-dev/CloudBridge)
