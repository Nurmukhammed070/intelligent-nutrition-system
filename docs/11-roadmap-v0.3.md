# NutriSmart Development Roadmap After v0.3

## Product principle
Users should not have to enter nutritional values manually for every meal. Preferred text flow: enter food and amount → find a match in a validated food catalogue → user confirms → automatically calculate calories and macronutrients. Preferred photo flow: upload photo → identify candidate foods → confirm ingredients and portion size → match verified nutritional values → save with uncertainty information.

## Next work items (proposed identifiers, NOT YouTrack IDs)
1. **NUT-API-1:** Document food-catalogue sources, units, coverage, provenance and quality.
2. **NUT-MOB-1:** Build a runnable Android Jetpack Compose app with ViewModel, navigation, Room database and tests.
3. **NUT-SYNC-1:** Design a user and diary API; choose local versus cloud storage strategy.
4. **NUT-VISION-1:** Compare image-recognition approaches and datasets; measure performance with real meal photos.
5. **NUT-UX-1:** Conduct 3–5 actual user sessions, subject to supervisor approval; record observations and revise the UX.
6. **NUT-RESEARCH-1:** Review at least 12 relevant sources, including at least 8 scientific publications, and complete evidence-backed comparisons.
7. **NUT-TEST-1:** Test the web UI at Android/iPhone screen sizes; evaluate API failure handling, validation and accessibility.

## Target architecture
Android Compose UI → ViewModel/use cases → Repository → Room plus secure HTTPS API → Nutrition catalogue / user diary / optional image-recognition service. Photo results must be confirmed by the user; uncertainty should be retained and explained.

## Evidence and version control
For each completed task, record a real YouTrack task ID, corresponding commits, and how the result was tested. Export screenshots of the board and tasks to PDF. Create tag `prob-period-1` only after the actual submission version has been verified.
