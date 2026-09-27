# Brainrot Academy v0.16.3 — Gameplay QA + Logic Lab Polish

## Game operation
- Added a permanent Back control to Brain Battle, Pizza Party, Milkshake Machine, and quizzes.
- Expanded the core pause menu with Resume, Restart Round, contextual Back, and Home.
- Android Back follows the same safe leave flow as the visible Back control.
- Backgrounding the app now auto-pauses core gameplay as well as Logic Lab.
- Question/puzzle progression timers now wait while paused and are invalidated when a session is restarted or left.
- Hid the global bottom dock during active Logic Lab puzzle screens so it cannot bypass leave confirmation.

## Logic Lab
- Added a dedicated Normal / Hard / Extreme Logic Lab challenge selector, separate from academic difficulty.
- Lost & Found now scales Brain Power and hint budgets by Logic difficulty.
- Found supplies briefly highlight the row, column, colored region, and neighboring squares they rule out without auto-marking them.
- Improved Lost & Found accessibility labels and Search / Mark toggle state.
- Pattern Lab now uses Logic Lab difficulty, supports difficulty-scaled hint budgets, and limits hints to once per puzzle.
- Added a visible Pattern Lab stage progress bar.

## Polish
- Updated Parent Settings build identity to v0.16.3.
- Added responsive styling for the expanded gameplay header, pause menu, Logic difficulty selector, rule-out feedback, and Pattern Lab progress.
