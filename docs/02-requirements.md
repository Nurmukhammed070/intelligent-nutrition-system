# Requirements Specification
Priority: P0 = checkpoint, P1 = next implementation, P2 = research-dependent.
| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-01 | Add food name, meal, portion and kcal/100 g | P0 | Valid entry appears in diary |
| FR-02 | Calculate calories for portion | P0 | 150 g × 80 kcal/100 g = 120 kcal |
| FR-03 | Show total calories | P0 | Total equals sum of entries |
| FR-04 | Delete diary entry | P0 | Item disappears and total updates |
| FR-05 | Persist entries locally | P0 | Entry remains after restart |
| FR-06 | Record protein/carbs/fat | P1 | Portion totals are calculated |
| FR-07 | Edit daily targets | P1 | Targets save and update progress |
| FR-08 | Date history and charts | P1 | Entries group by date |
| FR-09 | Explainable rules | P1 | Each insight names trigger/data |
| FR-10 | Photo select + candidate review | P1 | User can preview, edit and confirm candidate |
| FR-11 | Real image recognition | P2 | Model/API evaluated with uncertainty; no mock output called AI |
| FR-12 | Image-based portion estimation | P2 | Error measured against weighed portions |
| FR-13 | Authenticated cross-device sync | P2 | Data retrieves on a second device |
## Non-functional
NFR-01 clear UI; NFR-02 reject invalid inputs; NFR-03 disclose storage and photo upload; NFR-04 expose calculation inputs; NFR-05 no diagnosis or extreme restriction; NFR-06 maintainable UI/domain/data separation; NFR-07 offline basic diary; NFR-08 requirements trace to tests.
## Out of scope at first checkpoint
Medical diagnosis, guaranteed food recognition, exact calories from pixels alone, clinical prescriptions and production cloud sync.
