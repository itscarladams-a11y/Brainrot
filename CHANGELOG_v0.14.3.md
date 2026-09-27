# Brainrot Academy v0.14.3 — Mobile Usability Hotfix

## Phone experience
- Android build hides the status bar during gameplay/app use and restores the game view on focus.
- CSS retains safe-area padding as a fallback for cutouts and system UI.
- Every activity now has an obvious HOME control with a leave-confirmation overlay.
- Android back dispatches into the same in-app navigation flow.
- Mobile home presentation is simplified by hiding secondary showcase cards.

## Glorp audio
- Unvoiced Glorp bubbles no longer stop a voice clip that is already playing.
- Overlapping voiced reactions are serialized through a one-item latest-reaction queue.

## Difficulty
- Added explicit NORMAL, HARD, and EXTREME choices before an activity begins.
- NORMAL starts at the comfortable end of the selected grade and ramps only after demonstrated success.
- HARD stays in the upper half of the selected grade difficulty range.
- EXTREME stays at the hardest grade-appropriate generator setting.
- Difficulty never changes the selected grade.

## Identity
- App icon set now uses Professor Brainrot as the face of Brainrot Academy.
