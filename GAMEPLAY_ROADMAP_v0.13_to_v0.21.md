# Brainrot Academy Gameplay Roadmap — Current v0.16 Direction

## Product architecture
Brainrot Academy separates **curriculum/mastery**, **interaction type**, and **gameplay setting**. A gameplay setting consumes the same graded question stream and reports one academic result through the shared progress engine. Game presentation may change dramatically without corrupting mastery data.

## v0.13 — Gameplay Settings Foundation ✅
- Gameplay-setting registry.
- Choose How to Play flow.
- Brain Battle, Pizza Party, and Milkshake Machine share curriculum/mastery logic.

## v0.14.x — Mobile + Parent Foundation ✅
- Premium activity scenes and UI polish.
- Normal / Hard / Extreme grade-safe difficulty profiles.
- Permanent activity Home/Exit path and Android Back handling.
- Status-bar/fullscreen Android cleanup and Glorp voice reliability fixes.
- Professor Brainrot launcher icon refresh.
- Parent Dashboard PDF progress export.

## v0.15 — Tactile Interaction Engine ✅
- Preserve `choice` as the safe fallback.
- Add `number-input` for appropriate math problems.
- Add `missing-letter` for spelling completion.
- Add `letter-build` for spelling unscramble/build rounds.
- Pizza Party mixes choice + direct number entry.
- Milkshake rotates recognition + missing-letter + word building.
- Brain Battle can surface direct math/spelling interactions where appropriate.
- Record interaction type and response time locally without changing mastery scoring.

## v0.16 — Content Depth + Brain Battle 2.0 ✅
- Player/Glorp HP presentation.
- Correct-answer attacks and visible hit reactions.
- 1/3/5/10 streak attack tiers.
- Glorp counterattacks on incorrect answers with a learner-safe Brain Shield floor.
- Professor special at long streaks.
- Added 336 authored curriculum items across Grades 1–6, taking authored depth past 1,400 items.
- Added delayed missed-skill resurfacing and short cross-session anti-repeat memory.
- Preserved one academic record per question through the shared mastery engine.
- Boss/phase controller deferred to the progression pass so v0.16 could prioritize content depth.


## v0.16.1 — Logic Lab Enrichment ✅
- Added **Glorp's Lost & Found** as a non-academic deduction activity.
- Hidden school supplies follow row, column, colored-region, and no-touch constraints.
- Search and Mark X tools reward elimination rather than random tapping.
- Grade-aware board sizes scale from 4×4 to 7×7.
- Logic Lab stars/stages are stored separately from academic mastery.

## v0.17 — Pizza Party Premium Gameplay
- More direct manipulation and ingredient-specific math moments.
- Variable pizza recipes/toppings for replayability.
- Stronger oven, steam, cheese, bite, and eating sequences.
- Math visuals that fit naturally into the kitchen scene.

## v0.18 — Milkshake Machine Premium Gameplay
- Expand spelling interactions beyond the v0.15 foundation.
- Flavor/ingredient goals and randomized recipes.
- Syrup, sprinkle, blend, slosh, slurp, and brain-freeze sequences.
- Better mistake review using the exact word pattern the child missed.

## v0.19 — Visual Math Teaching
- Fraction bars and pizzas.
- Multiplication arrays.
- Number lines.
- Place-value blocks.
- Geometry diagrams.
- Professor visual mistake explanations.

## v0.20 — Grammar Crimes + Reading Detective Interaction Expansion
- Add reusable `tap-target`, `reorder`, punctuation-placement, and `evidence-select` interactions.
- Grammar sentence repair cases committed by Glorp.
- Reading case files, clue selection, sequencing, main idea, and inference.

## v0.21+ — Progression, Reporting, Release Hardening
- Academy XP/achievements separate from academic mastery.
- Boss milestones and learning-earned cosmetics.
- Richer parent trends using response-time/interaction telemetry.
- Signed AAB/release signing/store readiness after real-device QA.

## Engineering rule
No game mode directly rewrites mastery logic. Modes may animate, reward, contextualize, or change the interaction used to collect an answer, but academic correctness continues through the shared learning engine and progress modules.

## v0.16.2 — Logic Lab Shell + Pattern Lab ✅
- Logic Lab mini-game hub.
- Shared Back/Home/Pause/Resume/Restart/Android Back shell.
- Professor's Pattern Lab with grade-aware sequences, visual repeats, alternating rules and mental rotation.
- Existing SFX + registered Glorp vocal reactions.

## v0.16.3 — Gameplay QA + Logic Lab Polish ✅
- Safe Back/Home/Pause/Restart navigation across core activities and Logic Lab.
- True pause-aware state transitions and background auto-pause.
- Independent Logic Lab Normal/Hard/Extreme challenge selector.
- Lost & Found rule-out feedback and difficulty-scaled safety.
- Pattern Lab progress/hint polish.

## v0.16.4 — Professor's Shape Lab ✅
- Spatial assembly with themed silhouettes and geometric packing.
- Rotation, tap-to-place, desktop drag support, Undo, Clear Board, and hint guidance.
- Grade-aware 4×4 / 5×5 / 6×6 puzzle scaling and independent Logic difficulty.
- SFX, mapped Glorp reactions, stars, and separate Logic Lab progress.

## v0.16.5 — Glorp's Robot Rescue ✅
- Sequencing, route planning, command execution, repeat commands, switches/doors, and debugging missions.
- Solver-validated generated missions with dedicated robot SFX and offline-safe Glorp reactions.
- Shared Logic Lab navigation/pause/audio shell and separate enrichment progress.

## v0.16.6 — Slime Sweeper + Final Free Polish ✅
- Completed the five-game Logic Lab suite with deterministic no-guess Slime Sweeper boards.
- Added grade-scaled 5×5 / 6×6 / 7×7 boards, Reveal/Mark tools, hearts, hints, stars, SFX, and separate Logic progress.
- Added local semantic voice fallbacks for remote Glorp production lines.
- Added stronger focus, coarse-pointer, reduced-motion, and forced-colors behavior.
- This is the final planned Logic Lab expansion for launch; future work prioritizes depth and production finish.

## v0.16.7 — Parts of Speech Lab ✅
- Added eight sequenced grammar lessons and a mixed challenge, with progress feeding Grammar mastery.

## v0.16.8 — Testing Polish ✅
- Readable wrong-answer explanations and manual continuation.
- Passing scores for Parts of Speech course completion.
- Safer offline requests, local-date progress tracking, and Codespaces APK build setup.

## Future audio release pass
- Materialize approved production Glorp reaction media into the local bundle when the source assets are available.
- Normalize levels, eliminate remote release dependencies, and verify every voice path offline.
