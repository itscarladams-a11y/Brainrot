# Brainrot Education v0.7 — Finish Line Polish

v0.7 is a release-focused polish build. It deliberately avoids curriculum expansion and concentrates on character performance, sound mixing, tactile UI feedback, and replacing the last prototype-looking controls.

## Character performance
- Added new layered Glorp gesture art for pointing and fist-shaking.
- Added answer-target eye tracking so Glorp visibly looks toward the selected choice.
- Added a larger performance pool: point, fist, shock, smug-phone, furious/head-clutch, Rage escalation, and existing meltdown behavior.
- Correct, wrong, Rage, and question-intro reactions now select from broader motion choreography.
- Professor Brainrot gains stronger lecture, thinking, success, defeat, and pointer performances.
- Professor academic styling was refined to better match the premium brand art.

## Interface finish
- Replaced prototype Unicode dock and quick-action glyphs with a bespoke Brainrot Education SVG icon family.
- Added matching Back, Pause, Brain Power, Rage, lock, and equipped-state icons.
- Refined battle meter sheen, answer feedback motion, quiz-grade reveal, result reactions, and touch feedback.
- Closet lock/equipped states now use branded visual indicators rather than emoji.
- Added reduced-motion fallbacks for the new animation layer.

## Audio polish
- Reworked music transitions with smooth crossfades.
- Glorp speech now automatically ducks background music and restores it after the line.
- Result stings duck the current soundtrack instead of competing with it.
- Battle music intensity transitions are smoother across Rage levels.
- Added light playback variation to selected creature/Rage SFX to reduce mechanical repetition.
- Dialogue pools prioritize the locally packaged authored Glorp performances more often.

## Technical / release prep
- Version bumped to 0.7.0 with a fresh offline cache namespace.
- New navigation and performance assets are cached for offline use.
- Added release-package tests for critical art, icon wiring, version/cache integrity, performance-layer wiring, and local asset references.
- Existing Grades 1–4 education, Quiz, Professor Review, Focused Retake, progress, Parent settings, Closet, and offline PWA behavior remain intact.
