# Brainrot Academy v0.8.1 — Publisher Candidate A

## Curriculum depth
- Moved authored curriculum into `js/curriculum.js` so content can expand without touching the game engine.
- Expanded the thin non-generative subject pools to 608 authored items across Vocabulary, Reading, Spelling, Grammar, Science, Geography, and General Knowledge.
- Added session-level question fingerprinting and duplicate suppression so normal rounds avoid repeating authored prompts.

## Publisher polish
- Fixed the internal build marker mismatch and aligned the runtime/package/cache on v0.8.1.
- Removed the viewport zoom lock so browser and accessibility zoom remain available.
- Added optional gentle haptics for answer feedback and Rage milestones on supported devices.
- Added an optional larger-learning-text mode.
- Added an in-app privacy summary in Parent Settings.
- Preserved Brainrot Math / Brainrot Education save migration and the Brainrot Academy local-storage identity.

## Release engineering
- Added the curriculum module to the offline service-worker cache.
- Expanded automated release checks for curriculum depth, duplicate suppression, accessibility viewport behavior, runtime build version, and offline curriculum packaging.
