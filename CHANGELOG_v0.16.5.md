# Brainrot Academy v0.16.5 — Glorp's Robot Rescue

## New Logic Lab game
- Added **Glorp's Robot Rescue**, a sequencing, planning, route-building, and debugging game.
- Children build programs from Forward / Turn Left / Turn Right commands, then watch the academy robot execute them step by step.
- Grades 3–4 unlock Repeat ×2; Grades 5–6 also unlock Repeat ×3 and periodic debug missions with intentionally broken Glorp code.
- Missions can include multiple batteries, floor switches, locked doors, obstacles, and a charging-pad goal.
- Every generated mission is deterministic and solver-validated before release.

## Finished-product interaction pass
- Robot execution uses a dedicated run token so stopped/restarted programs cannot be affected by stale animation timers.
- Pause/background behavior freezes active execution through the shared Logic Lab shell.
- Command chips are individually removable; Undo and Clear are always available outside execution.
- Hints diagnose the first divergent command or reveal the next clean instruction instead of auto-solving the mission.
- Star scoring considers efficiency, crashes, incomplete runs, and hint usage.
- Robot Rescue progress and stars remain separate from academic mastery.

## Audio and presentation
- Added dedicated local robot step, turn, charge, and crash SFX.
- Robot Rescue uses offline-safe local Glorp reactions for major crash/success moments.
- Added a dedicated Robot Rescue mode icon, animated robot avatar, charging pad, batteries, switches, doors, crates, command console, debug badge, mission card, and responsive mobile layouts.
- Professor remains text/speech-bubble guidance only.

## QA
- Added generator, solver, repeat-command, debug-mission, star-scoring, integration, audio, navigation, and mastery-separation tests.
- Stress validation covers every grade and Logic Lab difficulty profile.
