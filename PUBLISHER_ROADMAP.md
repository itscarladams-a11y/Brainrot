# Brainrot Academy — Publisher Readiness Roadmap

## Known gaps to continue addressing
1. **Adaptive learning** — move from grade + subject scoring toward skill mastery, prerequisite awareness, targeted review, and dynamic difficulty.
2. **Teaching, not only testing** — add short Professor Brainrot explanations, worked examples, mini-lessons, and guided retry flows before/after practice.
3. **Curriculum depth** — continue deepening Grade 4 first, then Grades 3–6, with more reading passages, science, social studies/geography, grammar, vocabulary, spelling, and math variants.
4. **Richer interactions** — clocks, diagrams, number lines, fractions, ordering/sequencing, drag/tap activities, visual science questions, audio prompts, and other formats beyond standard multiple choice.
5. **Standards/skill organization** — tag questions to explicit skills and eventually standards so progress reports reflect what the learner can actually do.
6. **Parent reporting** — v0.9.1 adds the first full dashboard. Future work should add mastery trends, time/practice history, clearer recommendations, and optional export/report sharing.
7. **Publisher audiovisual polish** — final Professor Brainrot/Glorp voice library, audio normalization, animation depth, transitions, milestone sequences, physical-device polish, and store assets.
8. **Accessibility and release compliance** — final screen-reader/keyboard/color-contrast review, parent gate, privacy policy, store declarations, Android/iOS packaging, and real-device QA.

## Time & Calendar curriculum expansion
Treat this as a formal learning strand rather than a few calendar trivia questions.

### Days of the week
- Name and order all seven days.
- Day before/day after.
- Yesterday/today/tomorrow.
- Weekday vs weekend.
- Count forward/backward by days.
- Multi-step questions such as “three days after Tuesday.”

### Months of the year
- Name/order all twelve months.
- Previous/next month.
- Month number.
- Count forward/backward by months.
- Months in a year and months in a quarter.

### Calendar reading
- Read dates on a calendar.
- Count days and weeks between dates.
- Interpret schedules and recurring events.
- Number of days in common months.
- Leap-year basics for older grades.

### Units and practical time
- Seconds, minutes, hours, days, weeks, months, years.
- Grade-appropriate conversions.
- Analog and digital clocks.
- Half-hour, quarter-hour, five-minute increments.
- AM/PM, elapsed time, start/end-time problems.
- 24-hour time in upper grades.
- Seasons and their order; months associated with seasons.

## Product learning loop target
**Teach → Practice → Challenge → Measure mastery → Recommend next skill.**

Professor Brainrot should become an instructional guide, while Glorp remains the comedic game opponent.

## v0.10 implementation status

### v0.10A — Learning Intelligence: IMPLEMENTED
- Stable Grade → Subject → Domain → Skill IDs on generated questions.
- Versioned progress schema v3 with backward-compatible migration.
- Recency-weighted mastery scoring and New / Learning / Practicing / Strong / Mastered states.
- Mastery-aware adaptive targeting and skill-aware difficulty adjustment.
- Parent Dashboard v2 foundation with Skills Tracked, Mastered, mastery rows, and mastery-based recommendations.
- 90-day local daily aggregates for future progress trends.
- Validated primary + backup local saves.
- Offline caching for all learning-intelligence modules.

### v0.10B — Professor's Classroom: NEXT
- Structured lesson engine and lesson manifests.
- Learn This and Explain It flows.
- Professor Intervention after repeated skill misses.
- Worked examples, Think-Alouds, and segmented instructional audio.
- Initial teaching library: Time & Calendar, fractions, multiplication/division, and Grade 4 science.

### v0.10C — Curriculum & interaction expansion: PLANNED
- Days/weeks/months/seasons curriculum overhaul.
- Reading-along and fluency modes.
- Vocabulary-in-context stories and spelling sentence audio.
- Rich activity renderers: ordering, matching, clocks, calendars, fraction visuals, sequencing, and reading evidence.
- Grade 4 target of 600+ total learning objects.

### v0.10D — Publisher polish: PLANNED
- Permanent Professor Brainrot voice and audio mastering.
- Lesson animation and transition polish.
- Accessibility and target-device audit.
- Performance/offline optimization, save-recovery validation, and release-candidate QA.

## v0.10.1 Voice Foundation — IMPLEMENTED

- Professor Brainrot voice direction locked to approved custom Option 1.
- Glorp voice locked to Grungle.
- Professor Brainrot and Glorp canonized as brothers: Professor older, Glorp younger.
- Speaker-aware voice registry added.
- First 12 Grungle gameplay reactions generated and wired into active rage-state banks.
- Complete legacy spoken-audio inventory added: 153 spelling clips + 10 Glorp clips.
- Professor routing protected from mismatched fallback voices.
- Next audio gate: persistent reproducible Professor voice, then spelling + instructional replacement batches.
