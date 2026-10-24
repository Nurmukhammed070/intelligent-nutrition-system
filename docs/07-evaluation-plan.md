# Verification and Evaluation Plan
## Baseline
Manual entry using user-provided values and deterministic calculations. Compare a future real photo flow with manual entry only after recognition is implemented.
| ID | Scenario | Expected result |
|---|---|---|
| T-01 | 150 g × 80 kcal/100 g | 120 kcal |
| T-02 | Add two entries | Sum equals both portions |
| T-03 | Delete entry | List and total update |
| T-04 | Blank food name | Save rejected |
| T-05 | Zero/negative grams | Save rejected |
| T-06 | Restart | Local entries persist |
| T-07 | Change goal | Progress display updates |
| T-08 | Select photo in UX demo | Preview shown; no-AI disclaimer visible |
| T-09 | Missing macro data | Missing data is not presented as known |
## Metrics
Calculation correctness; task completion rate; time to add a meal; invalid-input rate; qualitative usability feedback. Future model metrics: top-1/top-k classification accuracy, calibration, portion-mass MAE, calorie error against weighed portions.
## Conditions
Use identical meals and portions for manual and future photo-assisted tests. Record category, mass, lighting, angle, mixed dish status and missing values.
## Participants and ethics
Recruit 3–5 people for formative feedback only if permitted. Explain prototype limitations and avoid unnecessary health data. Report actual participation and findings; never invent interviews.
