# Brainrot Academy v0.15.0 - Tactile Learning Interaction Engine

## Major upgrade
Brainrot Academy no longer requires every learning round to use the same four-choice interaction.

### New interaction engine
- Choice remains the safe default.
- Number input adds a large touch-friendly keypad for appropriate math questions.
- Missing-letter spelling asks the child to choose the letter that completes a word.
- Letter-build spelling lets the child assemble a correctly spelled word from shuffled tiles.
- Quizzes remain four-choice for consistent assessment behavior in this release.

### Gameplay integration
- Pizza Party now mixes multiple choice with direct numeric answer entry.
- Milkshake Machine now cycles through recognition, missing-letter, and build-the-word spelling.
- Brain Battle can surface direct numeric entry and missing-letter practice for supported questions.
- Existing mastery, adaptive difficulty, progress, Glorp reactions, food progress, and Professor guidance remain connected to every interaction type.

### Learning telemetry
- Progress schema advances to v4.
- Interaction type and response time are recorded locally for future adaptive-learning and parent-report improvements.
- Academic correctness/mastery calculations remain unchanged by presentation type.

### Mobile polish
- New controls are touch-first and responsive on compact portrait and landscape screens.
- Pizza keypad and Milkshake letter tiles inherit activity-specific visual styling.

## Build
- Android versionName: 0.15.0
- Android versionCode: 1500
