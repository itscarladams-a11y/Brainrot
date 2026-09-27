# Brainrot Academy v0.16.4 — Professor's Shape Lab

## New Logic Lab game
- Added **Professor's Shape Lab** as a spatial-reasoning enrichment activity.
- Children rebuild themed silhouettes by selecting, rotating, and fitting geometric pieces.
- Tap-to-place is the primary mobile/accessibility interaction; desktop drag-and-drop is also supported.
- Placed pieces can be picked back up, with dedicated Undo and Clear Board controls so experimentation never becomes a dead end.
- Any valid packing that fills the silhouette is accepted; the game does not require reproducing a hidden secret arrangement.

## Grade and difficulty scaling
- Grades 1–2 use compact 4×4 silhouettes with smaller piece sets.
- Grades 3–4 use 5×5 themed builds with more complex shapes.
- Grades 5–6 use 6×6 builds and larger piece sets.
- Normal / Hard / Extreme change starting piece rotations and hint availability without changing the selected grade.
- Deterministic transformed blueprints provide dozens of stage variants per grade band.

## Feedback and character performance
- Added snap, rotate, wrong-fit, hint, completion, and win SFX using the existing offline audio system.
- Reuses real mapped Glorp production reactions where appropriate, including “I was going to say that.” and “Fine. Maybe you are a little smart.”
- Professor remains speech-bubble/text guidance only.

## Shared shell and progress
- Shape Lab inherits Back, Home, Pause, Resume, Restart, Android Back, and background auto-pause behavior from the Logic Lab shell.
- Shape Lab stages and stars are stored separately from academic mastery.
- Added a dedicated Shape Lab icon and premium responsive visual treatment.

## QA
- Added Shape Lab generator, reconstruction, rotation, scoring, integration, audio, and progress-separation tests.
- Verified generated puzzle geometry across every grade and Logic Lab challenge profile.
