# NutriSmart — Intelligent Dietary Monitoring and Analysis

**Astana IT University | Individual diploma project**  
**Student:** Abdikarim Nurmukhammed | **Group:** SE-2430  
**Supervisor:** Bakayeva Bakyt  
**Topic:** Development of an intelligent system for monitoring and analyzing dietary intake

## Current checkpoint
A functional **browser-based interactive prototype** and lightweight Node.js API. The checkpoint documentation is in `docs/`; YouTrack evidence is in `evidence/`. The submission report is a working academic dossier; literature and user validation limitations are disclosed in it.

## Implemented
- Responsive interface, dashboard, diary, nutrition goals, history and CSV export.
- Food search and text-based entry using a **small illustrative local catalogue**.
- Calculation of calories, protein, fat and carbohydrates based on catalogue values and user-specified portions.
- Food photo upload/preview/removal workflow. **A real AI food recognition model is not implemented and evaluated as part of this checkpoint.**
- Node.js API and automated tests.

## Run and test
Requires **Node.js 20+**. From the repository root:

```sh
npm test
npm start
```

Then open **http://localhost:3000**. On the prepared local package, `npm test` passed **15/15 tests** on 24 October 2026; re-run in your own environment to verify.

## Repository layout
- `prototype/`: HTML/CSS/JavaScript UX demo.
- `server/`: Node.js API.
- `tests/`: automated Node.js tests.
- `docs/`: project documentation, diagrams and academic dossier.
- `evidence/`: YouTrack screenshots combined in one PDF.
- `android-app/`: **planning notes only**, not Android source code.
- `submission/`: submission aids, not evidence of completed work.

## Architecture and limitations
**Implemented:** web UI → Node.js services / illustrative nutrition catalogue; browser localStorage for diary data.  
**Planned:** native Android client (Kotlin/Jetpack Compose), Room/SQLite, verified nutrition database, image recognition with user confirmation and proper evaluation.

The illustrative nutritional values are not a validated professional database. No claim of tested photo recognition, final Android APK, representative survey, or supervisor approval is made. Five online survey respondents provide preliminary exploratory evidence only.


**Repository:** https://github.com/Nurmukhammed070/intelligent-nutrition-system  
**YouTrack:** https://nurmukhammedabdikarim.youtrack.cloud
