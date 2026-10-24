# Technology Comparison
## Decision 1 — Mobile platform
| Option | Advantages | Trade-offs | Decision |
|---|---|---|---|
| Kotlin + Jetpack Compose | Native Android, local DB support, Android Studio installed | Android only | Selected for Android MVP |
| Flutter + Dart | Cross-platform | Flutter setup required | Alternative if iOS becomes required |
| Swift + SwiftUI | Native iOS | Separate Android implementation needed | Not selected for Android checkpoint |
## Decision 2 — Storage
| Option | Advantages | Trade-offs | Decision |
|---|---|---|---|
| Room/SQLite | Offline, no server required | Local unless sync added | Initial MVP |
| Firebase | Managed sync/auth | Configuration/provider dependency | Evaluate later |
| Node.js API + MongoDB | Flexible REST backend | Deployment/security complexity | Possible later extension |
## Decision 3 — Photo recognition
| Option | Advantages | Trade-offs | Decision |
|---|---|---|---|
| User-confirmed candidate UX | Fast, explainable | Not real recognition | UX prototype only |
| On-device model | Offline inference possible | Model size/accuracy/integration | Research |
| Hosted food/vision API | May be quick to integrate | Cost, privacy, network, terms | Compare before selection |
## Decision 4 — UX prototype
HTML/CSS/JS: interactive and quick to demo, but not production Android; Compose: closer to target app but slower to iterate; static mockups: fast but not interactive. Use interactive browser prototype alongside Android starter.
