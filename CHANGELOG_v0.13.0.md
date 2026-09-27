# Brainrot Academy v0.13.0 — Gameplay Settings Foundation

## New gameplay architecture
- Separates **what the child is learning** from **what game setting presents the learning**.
- Adds a reusable gameplay-setting registry.
- Adds a reusable interaction renderer. Existing questions safely default to four-choice, while future modes can add tap-target, reorder, evidence-selection, and other interaction types without replacing the mastery engine.

## New activity picker
PLAY now opens **Choose How to Play**:
- **Brain Battle** — existing all-subject challenge flow.
- **Glorp's Pizza Party** — math questions build and bake Glorp's pizza.
- **Glorp's Milkshake Machine** — spelling questions build and blend Glorp's milkshake.

## Pizza Party
- Correct math answers progressively unlock dough, sauce, cheese, toppings, baking, and the finished pizza.
- Glorp becomes increasingly excited rather than increasingly angry.
- Wrong answers preserve the correct explanation and delay the food reward instead of removing earned progress.
- End-of-round eating payoff includes Glorp's "OM NOM" reaction.

## Milkshake Machine
- Correct spelling answers progressively add shake ingredients, whipped cream, sprinkles, and the final blend.
- Wrong answers preserve the correct spelling feedback and delay the shake reward.
- End-of-round payoff includes a Glorp slurp / brain-freeze reaction.

## Roadmap installed
See `GAMEPLAY_ROADMAP_v0.13_to_v0.21.md` for the staged plan covering Number Battle 2.0, visual math, Grammar Crimes, progression/bosses, Reading Detective, Spelling Showdown, more activities, parent reporting, and Android release work.

## Quality
- Existing mastery, adaptive difficulty, curriculum, and progress tracking remain shared.
- Android GitHub workflow remains configured to produce a debug APK.
- 60/60 automated tests pass.
