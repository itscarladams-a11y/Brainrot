# Brainrot Academy v0.9.1 — Parent Progress Dashboard

## Parent Dashboard
- Replaced the old Parent Settings-only view with a real **Parent Dashboard**.
- Added progress filters for All Grades or a specific Grade 1–6.
- Added parent-facing metrics for overall accuracy, questions answered, recorded sessions, and quiz average.
- Added a full subject report showing accuracy, practice volume, progress bars, and clear status labels: Not started, Getting started, Strong, On track, or Needs practice.
- Added recommended-practice cards based on repeatedly missed skills when enough evidence exists.
- Added recent activity showing the latest recorded battles and quizzes with date, grade, subject, raw score, and percentage.
- Kept learning/app settings in the Parent area below the progress report.

## Progress data architecture
- Added `js/progress.js`, a testable offline progress-tracking module.
- Tracks all-time subject totals plus grade-specific subject accuracy.
- Tracks grade + subject + skill performance for future mastery/adaptive-learning work.
- Stores up to 60 recent completed sessions locally on the device.
- Existing lifetime totals from older Brainrot Academy versions are preserved.
- Grade-specific/skill-specific analytics begin with v0.9.1 because older builds did not persist enough information to assign historical answers to a grade honestly.

## Publisher polish
- Fixed the grade ordinal helper so 5th Grade and 6th Grade display correctly throughout the app.
- Updated package/runtime/service-worker versions to v0.9.1.
- Added the progress module to offline precaching.
- Updated privacy copy to reflect local-device progress tracking.

## Quality assurance
- Expanded automated QA from 24 to **30 tests**.
- New tests cover grade/subject/skill aggregation, session-history filtering and caps, quiz averages, recommendation logic, progress status bands, dashboard DOM wiring, offline progress-module packaging, and v0.9.1 build identity.
- Full suite passes 30/30.
