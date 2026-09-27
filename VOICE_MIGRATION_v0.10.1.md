# Brainrot Academy v0.10.1 — Voice Foundation

## Canonical voices

- Professor Brainrot: approved custom Option 1. Older brother, teacher, warm/eccentric/theatrical. The approved preview is preserved as the canonical reference. The connected HeyGen free tier currently blocks voice cloning, so no substitute narrator is permitted.
- Glorp: Grungle. Younger brother, comic foil, raspy animated creature performance.

## Implemented in this build

- Added explicit speaker-aware voice registry (`js/voice-registry.js`).
- Professor and Glorp no longer share a generic text-to-voice lookup.
- Added 12 new production Glorp reactions in Grungle across Smug, Annoyed, Angry, Furious, and Meltdown states.
- Updated active Glorp gameplay reaction banks to use the new Grungle lines.
- Professor dialogue now uses Professor-specific routing and will never fall back to a mismatched narrator voice. Until the approved voice can be persistently reproduced, Professor uses text + light chalk SFX.
- Added canonical brother lore to dialogue: Professor is the older brother; Glorp is the younger brother.
- Added a complete legacy spoken-audio inventory (`assets/audio/voice/audio-migration-manifest.json`).
- Legacy local files remain in the bundle as safety fallbacks during migration.

## Current inventory

- 163 legacy spoken files total.
- 153 legacy spelling pronunciations scheduled for full Professor replacement.
- 10 legacy Glorp spoken files scheduled for Grungle replacement.
- 12 Grungle production reactions generated in the first migration batch.

## Release gate

Remote production media is development-only during this phase. Before publisher release, every approved voice asset must be materialized into `assets/audio/voice/`, normalized, added to the local service-worker cache, and verified offline. `localBundleReady` must remain false until that is complete.
