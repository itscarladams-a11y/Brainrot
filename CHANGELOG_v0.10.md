# Brainrot Academy v0.10.0 — Learning Intelligence (Phase A)

## Major architecture
- Added stable Grade → Subject → Domain → Skill IDs to every generated question.
- Added a versioned progress schema (`progressSchemaVersion: 3`) while preserving existing lifetime, grade, subject, and session totals.
- Added weighted mastery scoring that gives recent performance more influence than old answers and requires evidence before a skill can be considered mastered.
- Added mastery states: New, Learning, Practicing, Strong, and Mastered.
- Added 90-day local daily progress aggregates for future trend reporting.

## Adaptive practice
- Added a mastery-aware adaptive selector that can preferentially revisit weak practiced skills.
- Added skill-aware difficulty adjustment so weak skills can temporarily step down and strong skills can step up without changing the child's selected grade.
- Sessions now record how many questions were adaptively targeted.

## Parent Dashboard v2 foundation
- Added Skills Tracked and Mastered metrics.
- Added a Skill Mastery report with weighted mastery percentages and states.
- Recommendations now use mastery priority when enough evidence exists.
- Existing historical totals remain intact; mastery analytics begin honestly with v0.10.

## Reliability
- Added a validated local backup save (`brainrotAcademyPrefsBackup`) before primary progress writes.
- If the primary save cannot be parsed on startup, Brainrot Academy can fall back to the last valid backup.
- Added offline caching for the skill, mastery, and adaptive-learning modules.

## QA
- Added automated tests for stable skill IDs, progress migration, recency-weighted mastery, mastery thresholds, recommendations, adaptive targeting, adaptive difficulty, offline module packaging, and Parent Dashboard v2 wiring.
