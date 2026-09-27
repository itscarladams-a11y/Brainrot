# Brainrot Academy v0.16.9 — Bantam Entertainment Intro

Brainrot Academy is an offline-capable Grades 1–6 learning game built around Professor Brainrot, Glorp, academic mastery, parent reporting, a five-game Logic Lab, and dedicated academic mini-courses.

## v0.16.9 highlights
- The approved Bantam Entertainment rooster logo opens the app on a solid black studio screen, without a website address or a white Android launch flash.
- The loading bar measures critical image readiness and app initialization. A retry control appears if the game cannot initialize.
- Android version code 1609 and a clean GitHub Codespaces APK build.

## v0.16.8 testing polish
- Wrong answers stay visible with a clear explanation and a Next Question button.
- Parts of Speech lesson completion requires 75% rather than simply finishing a round.
- Local-date progress tracking, save-failure feedback, and safer offline caching.
- Fresh Codespaces setup with a repeatable Android test APK build. See `FRESH_INSTALL_CODESPACES.md`.

## v0.16.7 Parts of Speech Lab
- Added **Professor Brainrot's Parts of Speech Lab** as a direct activity and dedicated Grammar silo.
- Eight sequenced lessons: Nouns, Verbs, Adjectives, Pronouns, Adverbs, Prepositions, Conjunctions, and Interjections.
- Learners can start at Lesson 1 and continue through all eight in one sitting, resume later, or jump directly to any lesson.
- Added a final **Mixed Mastery** challenge covering all eight parts of speech.
- Added a visible grade pathway: Grade 1 nouns/verbs, Grade 2 adjectives/pronouns, Grade 3 adverbs/prepositions/conjunctions, Grade 4 interjections/mixed work, and Grades 5–6 function/agreement/editing.
- Course answers feed the same Grammar mastery system used by normal grade-level practice.
- Added explicit Interjections mastery metadata under the parts-of-speech domain.
- Added a curated question-queue path to the core game engine so dedicated course lessons stay on-topic while preserving Pause, Back, Home, Restart, Android Back, sound effects, Professor hosting, and Glorp reactions.
- Added a bespoke Parts of Speech course map, teaching panel, progress meter, persistent resume state, lesson best scores, and direct home/activity entry point.

## Logic Lab launch suite
1. Glorp's Lost & Found — deduction / constraints
2. Professor's Pattern Lab — patterns / flexible thinking
3. Professor's Shape Lab — spatial reasoning / mental rotation
4. Glorp's Robot Rescue — sequencing / planning / debugging
5. Glorp's Slime Sweeper — number-clue deduction

Logic Lab progress is intentionally separate from academic mastery.

## Audio design
- Professor Brainrot: speech bubbles only.
- Spelling: visible spelling interactions with no pronunciation audio.
- Glorp: voiced reaction system remains active. Production reactions use local semantic fallbacks when exact remote production media is unavailable.

## Test
```bash
npm test
```

## Android APK build
GitHub Actions and Codespaces can build an Android debug APK. See `GITHUB_APK_BUILD.md`.

```bash
npm ci
npm test
npm run android:build
```

The APK is copied to `artifacts/Brainrot_Academy_v0.16.9-debug.apk`.
