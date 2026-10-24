# NutriSmart — Intelligent Dietary Monitoring and Analysis

**Diploma project:** Development of an intelligent system for monitoring and analyzing dietary intake  
**University:** Astana IT University, Astana, Kazakhstan  
**Student:** Abdikarim Nurmukhammed  
**Academic group:** SE-2430  
**Scientific supervisor:** Bakayeva Bakyt  
**Project type:** Individual diploma project

## Overview

NutriSmart is a dietary monitoring project designed to help users record meals, estimate daily calorie and macronutrient intake, and review eating patterns. The current deliverable is an **interactive web prototype** with a lightweight Node.js server. A native Android application and validated AI-assisted food recognition are planned for later development.

## Features available in the prototype

- **Dashboard:** Daily calorie, protein, fat, and carbohydrate summaries.
- **Food diary:** Add and review meal entries.
- **Food search and text input:** Select foods from a small illustrative catalogue and specify portions in grams.
- **Nutrition calculations:** Calculate estimated calories and macronutrients using portion sizes and catalogue values.
- **Nutrition goals:** Set and view daily targets.
- **History and insights:** Review previous entries and nutritional summaries; export available records to CSV.
- **Photo interface:** Select, preview, and remove food images. This is **not evidence of completed AI recognition**.

The prototype uses an illustrative food catalogue, **not a verified clinical-grade nutrition database**. Nutrition estimates are for demonstration and should not be treated as medical advice.

## Technologies

| Component | Current approach |
| --- | --- |
| User interface | HTML, CSS, JavaScript |
| Server | Node.js (built-in HTTP module) |
| Food parsing | Local catalogue and rule-based text parsing |
| Prototype data storage | Browser localStorage |
| Tests | Node.js built-in test runner |
| Planned mobile application | Kotlin, Jetpack Compose, Room/SQLite |
| Planned intelligent functionality | Food image recognition with user confirmation and evaluation |

The server includes an **optional experimental integration endpoint** for an external vision provider. It requires private configuration and has **not been established as a validated, production-ready food recognition system**.

## How to run locally

**Prerequisite:** Node.js 20 or newer.

1. Clone this repository or download its source files.
2. Open a terminal in the repository root (the folder containing `package.json`).
3. Run:

```bash
npm start
```

4. Open **http://localhost:3000** in your browser.

The basic prototype does not require an API key. For the standard manual food logging workflow, no external AI service is needed.

### Automated tests

From the repository root, run:

```bash
npm test
```

The included tests cover selected application logic and API behavior. Run them locally to verify the results in your environment; successful tests do not establish clinical accuracy or AI recognition performance.

## Project structure

```text
prototype/         Browser-based user interface and local food catalogue
server/            Node.js HTTP server and API
tests/            Automated tests
docs/             Project documentation and diagrams (when uploaded)
evidence/         YouTrack screenshots in a PDF (when uploaded)
package.json       Run and test commands
README.md          Project overview and setup instructions
```

## User research and project management

An exploratory Google Forms survey received **five responses**. These findings informed the initial feature priorities, but the sample is small and does not replace broader user interviews or usability evaluation.

Development activities are tracked in **YouTrack**, including requirements, research, architecture, prototype work, testing plans, and future Android/AI tasks.

- **Repository:** https://github.com/Nurmukhammed070/intelligent-nutrition-system
- **YouTrack workspace:** https://nurmukhammedabdikarim.youtrack.cloud

## Current limitations and future work

The checkpoint is a prototype, **not a completed native Android application**. Future work includes:

1. Building the Android application using Kotlin and Jetpack Compose.
2. Integrating and documenting a reliable nutrition data source.
3. Implementing and evaluating real food image recognition and portion estimation.
4. Providing user correction of AI-generated results.
5. Expanding usability studies, testing, privacy safeguards, and documentation.


