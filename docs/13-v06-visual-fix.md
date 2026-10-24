# v0.6 visual contrast repair

The overview uses a dark `.hero` with white foreground text. Nested white `.card` elements inherited the white text color, which made macro values and other content difficult or impossible to read. The stylesheet now explicitly applies dark text to nested light surfaces while preserving white text on the dark hero background.

Additional improvements: darker secondary text in nested panels, explicit light color scheme for form inputs on Safari, and wrapping layout for the `Remove photo` button on narrow screens.

## Manual verification checklist
- Open Overview: Protein, Fat and Carbs numbers are readable in the white cards.
- Open Overview: Smart insight content and the diary list are readable.
- Open Add: number fields are readable in Safari with macOS dark appearance.
- Choose a photo, click `Remove photo`, and select another photo.
- Test a mobile-width window or actual phone.

This is a targeted CSS fix, not a claim that full manual UI testing has been completed.
