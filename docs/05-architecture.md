# Architecture Draft
## System context
Actors: user, Android app, local database, future food nutrition source, future image recognition component. First checkpoint runs locally.
```mermaid
flowchart LR
 U[User] <--> A[NutriSmart Android]
 A <--> D[(Room / SQLite)]
 A -. planned lookup .-> F[Food nutrition source]
 A -. planned inference .-> V[Recognition model/API]
```
## Use cases
```mermaid
flowchart TD
 U((User)) --> A[Record meal]
 U --> B[Review nutrient totals]
 U --> C[Set daily goals]
 U --> D[Review rule-based insights]
 U --> E[Select food photo]
 E --> F[Review and edit candidate]
 F --> A
 B --> G[View history]
```
## Component diagram
```mermaid
flowchart TB
 UI[Compose UI] --> VM[ViewModel]
 VM --> N[Nutrition calculations and rules]
 VM --> R[Repository]
 R --> DAO[Room DAO]
 DAO --> DB[(SQLite)]
 V[Future vision adapter] -. candidates .-> VM
 F[Future nutrition data adapter] -. values .-> R
```
Current flow: UI input → validation → ViewModel → DAO → Room/SQLite → Flow emits records → UI refresh. Browser prototype uses localStorage separately; it is not connected to Android database.
