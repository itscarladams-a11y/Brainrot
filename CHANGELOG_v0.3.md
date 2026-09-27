# Brainrot Math v0.3 — Glorp Gets a Body

## Character animation
- Replaced the battle-screen single-image Glorp with a layered rig.
- Independent eye, eyelid, mouth, phone/hand, cheek, body, and cosmetic layers.
- Five readable rage performances: Smug, Annoyed, Angry, Furious, Meltdown.
- Added blinking, question-look behavior, talk mouth movement, eye motion, phone fidget/shake, two correct-hit reactions, two wrong-answer laugh reactions, rage surge, and a multi-part meltdown.
- Cosmetics now ride on the character rig and move with reactions.

## Battle presentation
- Replaced emoji-based battle scenery with a cohesive illustrated gaming-room background.
- Added readable room accents while keeping the math panel visually clean.
- Added short screen-entry transitions and battle-asset preloading.
- Added three different end-of-round performance families for strong, middle, and Glorp-win rounds.

## Audio
- Retained the consistent packaged Glorp voice from v0.2.
- Added randomized alternate growl, laugh, rage-hit, and slime-splat variants.
- Added a lightweight original procedural battle-music system using Web Audio.
- Music adds layers as Glorp gets angrier and cuts out on meltdown for a stronger SPLORP payoff.
- Added a Parent Settings toggle for battle music.

## Game feel
- Re-timed answer choreography so feedback, Glorp reaction, speech, rage increase, and next-question transition happen in a deliberate sequence.
- Existing Grade 1–4 adaptive question engine remains unchanged.

## QA
- 9,600 generated math questions validated across Grades 1–4.
- Static checks confirm all JavaScript DOM IDs resolve.
- Static checks confirm all cached assets, CSS assets, and packaged audio references exist.
- JavaScript syntax checks pass for app, audio, content, engine, and service worker.

## Still planned
- Larger fully spoken Glorp line library.
- More authored rage pose art and arm/hand motion.
- Better cosmetic art than emoji placeholders.
- Device playtesting and timing tuning on real Android/iPhone hardware.
