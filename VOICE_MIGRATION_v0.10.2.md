# Brainrot Academy v0.10.2 — Professor Audio Batch 0

## Completed

- Production canary: `necessary`
- Approved Option 1 SHA-256: `da7599702bc0126559c3c87c489959f90b6b0804f13a118b49d4d3498fab16b5`
- The bundled `assets/audio/voice/spelling/necessary.mp3` matches the approved reference exactly.

## Next queued batch

1. accidental
2. accommodate
3. achieve
4. address
5. after

Generation is intentionally not marked complete until those files exist, validate, and pass the test suite.

## Safety rules

- One canary before any multi-file batch.
- Maximum five spelling replacements per batch during migration.
- Validate file decode/format, filename, manifest state, SHA-256, offline packaging, and the complete regression suite before advancing.
- Do not substitute a different voice for Professor Brainrot.
- Keep `localBundleReady: false` until the required local production library is complete.
