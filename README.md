# NutriSmart v0.8 — Probation Checkpoint Preparation

---

# NutriSmart v0.5 — UI and photo workflow fixes

Changes from v0.4:
- Fixed unreadable numeric input text on white/light field backgrounds (including systems using dark appearance).
- Added a clearly labeled **Remove photo** button for camera/gallery selections.
- Removing a photo clears its preview and its photo-generated suggestions, without deleting independently typed food entries.
- Cancels in-flight recognition requests and prevents removed photos from generating delayed suggestions.
- Improved small-screen spacing for the photo preview controls.

**To test:** `npm test`, `npm start`, then open `http://localhost:3000`. On mobile, use the same URL through your Mac's local IP while both devices share Wi-Fi and the server permits LAN connections. The AI photo API still needs credentials and cannot infer reliable calories from a photo alone; confirm all estimates.

# NutriSmart — Intelligent Dietary Monitoring and Analysis

**Diploma topic:** Development of an Intelligent System for Monitoring and Analyzing Dietary Intake  
**Repository:** https://github.com/Nurmukhammed070/intelligent-nutrition-system  
**Version:** v0.4 English edition — interactive browser prototype and local API; not a completed Android mobile application.

## Implemented in this package
- Responsive English-language browser interface, including mobile navigation.
- Food diary, editable daily goals, calorie/macronutrient totals, recent seven-day chart; entries stored in localStorage.
- Auto-fill by food name: search the local illustrative catalogue and automatically populate kcal, protein, fat and carbohydrate values; edit grams before saving.
- Text entry such as `200 g rice and 2 eggs`, using an approximate built-in food catalogue and rule-based parser. Legacy Russian food aliases remain supported.
- Dependency-free Node.js API: `GET /api/health`, `GET /api/foods?q=...`, `POST /api/parse`, and `POST /api/recognize`.
- Photo selection, preview and user-review flow. **Real AI recognition requires configuring and testing an external provider; no model accuracy is claimed.**
- Automated Node.js tests (`npm test`). Run them locally before reporting results.
- `docs/` holds research plans and draft project materials, not completed interviews or peer-reviewed literature review.

## Run locally on Mac
1. Install Node.js 20 or newer. Verify using `node -v`.
2. Open Terminal in this project's root folder.
3. Run `npm test`.
4. Run `npm start`.
5. Open http://localhost:3000.
6. Use Chrome DevTools device emulation (for example, width 390px) to check mobile layout.

## API examples
- `GET /api/health`: server and photo integration readiness.
- `GET /api/foods?q=rice`: food catalogue search.
- `POST /api/parse` with JSON `{ "text": "200 g rice and 2 eggs" }`: recognized foods, portions and nutritional estimates.
- `POST /api/recognize`: optional external image-recognition integration. Without a configured key/model returns HTTP 503. This endpoint has not been validated with a real provider.

### Future photo recognition
Set environment variables `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` only if using a supported vision model and after checking the provider's documentation and usage terms. **Never commit an API key to GitHub.** Image uploads to external providers must be disclosed and consented to. Nutrition cannot be calculated accurately from image pixels alone; food identification, portion estimation, nutrition values and user verification are all necessary.

## Architecture
**Currently:** HTML/CSS/JS browser frontend → Node.js API → illustrative food catalogue; diary entries → browser localStorage.  
**Planned:** Android app in Kotlin/Jetpack Compose with Room/SQLite; optional secured API and relational/cloud data store; image-recognition adapter, user authentication, tests, privacy protections.

`android-app/` currently contains Android implementation notes, not a verified buildable Android project.

## Limitations
No verified Android APK, validated nutrition database, peer-reviewed literature synthesis, documented participant research, or proven photo-recognition accuracy is provided. No authentication or server-side user-data persistence exists. The API is for local development and is **not secure for public deployment** without access controls, rate limits and additional safeguards.

## Layout
- `prototype/` — responsive UI, parser and illustrative foods
- `server/` — HTTP API with optional vision integration
- `tests/` — automated API/parser tests
- `docs/` — research and checkpoint planning
- `android-app/` — Android implementation plan

**NutriSmart is not a medical device and does not provide diagnosis or treatment recommendations.**

## v0.4 updates
- Search box in **Add Food** for name-based food lookup and automatic nutrient values (per 100 g). Choose a result, then change the portion in the review panel.
- Improved input validation for manually entered nutrition values and fixed first-item portion/remove button handling.
- Corrected mixed-language UI labels and a malformed HTML closing tag.
- Added regression tests for food search and invalid JSON input.

**Important:** catalogue values are illustrative, not validated reference data. Avoid presenting them as medically accurate. AI photo recognition remains optional and unverified.

## v0.6 display fix
The contrast in overview cards and the photo-removal layout were corrected in `prototype/style.css`. See `docs/13-v06-visual-fix.md`.

## v0.7 usability update (24 October 2026)
- Fixed default diary behavior: new users begin with **no entries** instead of unlabelled sample nutrition history.
- Added **date selection** to diary so users can inspect their recorded food for previous days.
- Added **CSV export** for the currently selected day (on-device/browser; no cloud account needed).
- Added **offline fallback** to catalogue search when opening `prototype/index.html` directly in Safari without starting Node.js.
- Kept contrast fixes and the Remove photo button from v0.6.

### Smoke tests
1. Open `prototype/index.html` (or `npm start` then http://localhost:3000).
2. Search for `rice` and select a food; confirm nutrition values and portion preview.
3. Save an entry and confirm the dashboard and diary update.
4. In Food diary, switch to yesterday (expect no entries unless created there), switch back to today.
5. Export a CSV file and inspect its date, food and macro columns.
6. Add and remove a photo; ensure old photo suggestions are cleared.
7. Reload Safari, confirm the diary persists.

**Limitations:** no real photo AI without a configured recognition service; nutrition catalogue is illustrative; browser localStorage is device/browser-specific; the Android scaffold is not yet a feature-complete mobile version.
