export const CHARACTER_VOICES = Object.freeze({
  professor: Object.freeze({
    id: 'professor-brainrot',
    displayName: 'Professor Brainrot',
    role: 'teacher',
    familyRole: 'older-brother',
    sibling: 'glorp',
    voiceDirection: 'Approved custom Option 1: warm, educated, eccentric, theatrical, patient, dryly amused.',
    status: 'speech-bubble-only',
    provider: 'none',
    referenceArchive: 'audio/reference/professor-option1-necessary.mp3',
    localBundleReady: false,
    finalVoiceRequired: false
  }),
  glorp: Object.freeze({
    id: 'glorp',
    displayName: 'Glorp',
    role: 'comic-foil',
    familyRole: 'younger-brother',
    sibling: 'professor',
    voiceDirection: 'Grungle: raspy animated creature, smug, bratty, expressive, comic meltdown energy.',
    status: 'production-voice-selected',
    provider: 'runway',
    providerVoice: 'Grungle',
    localBundleReady: false,
    finalVoiceRequired: true
  })
});

// v0.10.1 production Glorp batch. These are persistent media-library URLs used
// during migration. Release-candidate builds must materialize these into the
// local bundle before localBundleReady may become true.
export const GLORP_PRODUCTION_LINES = Object.freeze({
  'Easy. Obviously.': 'https://gcdn.picsart.com/editing-temp/0b895c8d-baaf-44ab-8d64-4339569f9d0a.mpeg',
  'Beginner stuff. I could do this in my sleep.': 'https://gcdn.picsart.com/editing-temp/77afaeb7-f38c-4999-8a3e-0d0b2ebf0f23.mpeg',
  'Told you. Glorp genius.': 'https://gcdn.picsart.com/editing-temp/418b7fe2-cf19-43c4-9c35-ccc3ca47d36f.mpeg',
  'Okay, that one barely counts.': 'https://gcdn.picsart.com/editing-temp/e5be36c8-1f2b-4df0-81ca-e2d522c12578.mpeg',
  'Professor, your questions are suspicious.': 'https://gcdn.picsart.com/editing-temp/108f2ca7-1707-4616-a4f0-9fa3ea392eef.mpeg',
  'Stop knowing things!': 'https://gcdn.picsart.com/editing-temp/8917ec22-a948-4e4c-9aac-78bece164995.mpeg',
  'Who wrote these questions?!': 'https://gcdn.picsart.com/editing-temp/28a13b33-ee30-4a39-bb2b-8895d952ba57.mpeg',
  'This game is cheating!': 'https://gcdn.picsart.com/editing-temp/0257c2e8-a997-4b35-90de-cf3e8c30a52a.mpeg',
  'Professor! Make them less smart!': 'https://gcdn.picsart.com/editing-temp/242f0c7e-31df-43dd-840b-fc1f21052918.mpeg',
  'No! No! No! I demand a rematch!': 'https://gcdn.picsart.com/editing-temp/d6b77b2b-2aeb-47ee-9d6c-48882676a40a.mpeg',
  'I was going to say that.': 'https://gcdn.picsart.com/editing-temp/d119ddce-f461-42a0-8471-7dddd13f6ca8.mpeg',
  'Fine. Maybe you are a little smart.': 'https://gcdn.picsart.com/editing-temp/836306e6-b74c-42e8-a481-acebe670ad4c.mpeg'
});




export const GLORP_LOCAL_FALLBACKS = Object.freeze({
  'Easy. Obviously.': 'glorp-wins.mp3',
  'Beginner stuff. I could do this in my sleep.': 'glorp-wins.mp3',
  'Told you. Glorp genius.': 'glorp-wins.mp3',
  'Okay, that one barely counts.': 'question-rigged.mp3',
  'Professor, your questions are suspicious.': 'question-rigged.mp3',
  'Stop knowing things!': 'stop-knowing-math.mp3',
  'Who wrote these questions?!': 'question-rigged.mp3',
  'This game is cheating!': 'game-cheating.mp3',
  'Professor! Make them less smart!': 'stop-knowing-math.mp3',
  'No! No! No! I demand a rematch!': 'what-no.mp3',
  'I was going to say that.': 'what-no.mp3',
  'Fine. Maybe you are a little smart.': 'question-rigged.mp3'
});

// Professor is intentionally text-only in v0.11.1. The approved Option 1 sample
// is archived for possible future use, but spelling has no pronunciation audio.
export const LEGACY_GLORP_FILES = Object.freeze({
  'POTATO!': 'voice/potato.mp3',
  'HOTDOG!': 'voice/hotdog.mp3',
  "GRANDPA'S WI-FI!": 'voice/grandpas-wifi.mp3',
  'STOP KNOWING MATH!': 'voice/stop-knowing-math.mp3',
  'HAHA! GLORP WINS!': 'voice/glorp-wins.mp3',
  'THIS GAME IS CHEATING!': 'voice/game-cheating.mp3',
  'WHAT?!': 'voice/what-no.mp3',
  'WHAT?! NO!': 'voice/what-no.mp3',
  "Let's watch videos instead!": 'voice/watch-videos.mp3',
  'That question was rigged!': 'voice/question-rigged.mp3',
  'MATH IS BROKEN!': 'voice/math-broken.mp3'
});

export function getCharacterVoiceSource(speaker, text) {
  if (speaker === 'glorp') {
    const productionUrl = GLORP_PRODUCTION_LINES[text];
    if (productionUrl) return { type: 'remote-production', url: productionUrl, fallbackFile: GLORP_LOCAL_FALLBACKS[text] || null, speaker, text };
    const legacyFile = LEGACY_GLORP_FILES[text];
    if (legacyFile) return { type: 'local-legacy', file: legacyFile, speaker, text };
  }
  // Professor's approved voice is intentionally not substituted. Until the
  // approved preview is available as a reproducible persistent voice, the UI
  // may display Professor text and use a light SFX fallback rather than play a
  // mismatched narrator.
  return null;
}

export function isProductionGlorpLine(text) {
  return Boolean(GLORP_PRODUCTION_LINES[text]);
}
