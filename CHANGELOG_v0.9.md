# Brainrot Academy v0.9.0 — Grade 1–6 Library Expansion

## Major changes
- Expanded grade support from Grades 1–4 to **Grades 1–6** across the app, parent settings, review flow, mixed mode, and curriculum engine.
- Made **Grade 4 the deliberate content-depth priority** with 316 authored items across the seven banked subjects.
- Expanded the authored curriculum to **1,096 grade-level items** total.
- Added 168 authored items for Grade 5 and 168 for Grade 6.
- Added harder Grade 5–6 generated Math, Time, and Calendar logic so upper grades are not simple label changes.

## Grade 4 depth
- Vocabulary: 48
- Reading: 44
- Spelling: 48
- Grammar: 44
- Science: 44
- Geography: 44
- General Knowledge: 44

## Grades 5–6
Each grade includes 24 items per authored subject, covering vocabulary, reading, spelling, grammar, science, geography, and general knowledge. Upper-grade material introduces evidence evaluation, source literacy, scientific systems, cells, human geography, digital citizenship, financial concepts, and more analytical reading.

## Spelling
- Expanded offline spelling pronunciation coverage to **153 unique Grade 1–6 words**.
- Preserved the audio-first four-choice mechanic and replay button.
- All spelling pronunciation assets are included in the offline service-worker cache.
- Current newly added pronunciation clips are functional development assets and should receive a final licensed/studio Professor Brainrot voice replacement before 1.0.

## Quality and release engineering
- Added Grade 5 and Grade 6 cards to the learner grade selector and Parent Settings.
- Updated app manifest, package version, runtime build marker, and service-worker cache to v0.9.0.
- Added permanent QA for Grades 1–6 generation, upper-grade math skills, Grade 4 depth, authored-bank uniqueness, exact answer/choice integrity, spelling audio coverage, offline caching, and grade-selector wiring.
- Fixed three authored multiple-choice rows whose stored correct answer wording did not exactly match a source choice.
