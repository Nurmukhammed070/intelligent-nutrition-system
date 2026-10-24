# Engineering decisions, safety, and next implementation milestones

## Current architecture (implemented)
Browser interface → Node.js HTTP API for search/parser and optional vision adapter. Food diary and goals are saved in browser localStorage. Search has an offline fallback to the bundled illustrative foods list. Browser files can also be opened directly from disk.

## Target Android architecture (planned)
Kotlin + Jetpack Compose screen → ViewModel → domain nutrition calculations / validated rules → Repository → Room/SQLite for local persistence; Node.js backend only for authenticated services and external image/nutrition lookup. **Android implementation has not been proven buildable in v0.7**.

## Proposed AI pipeline
1. Capture/select photo with consent; limit file size and file types.
2. Food classifier returns ranked hypotheses + provenance, *not a claimed exact calorie total*.
3. User reviews food identity, ingredients, cooking method and approximate weights.
4. Nutrition values retrieved from a reliable, licensed dataset with source/date/units.
5. Display the calculation: grams × kcal/100g ÷ 100, plus macro totals.
6. Mark uncertainty; allow edit/delete and do not diagnose disease.
7. Evaluate category accuracy, portion mass MAE and calorie error on measured test meals, including local cuisine and mixed dishes.

## Suggested next milestone (M1)
- Replace illustrative food data with documented composition values and source metadata.
- Add reliable stored meal dates/portion source fields and full edit flow.
- Implement smoke tests for Safari and 390px mobile viewport.
- Resolve data-provenance and limitations copy throughout UI.

## Suggested later milestones
M2: Native Android app; M3: Authentication and persistence/sync; M4: Real evaluated photo recognition; M5: Food/portion evaluation study and explainable analytics.
