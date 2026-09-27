#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf android www
npm run web:prepare
npx cap add android
npx cap sync android
node scripts/configure-android.mjs
printf '
Android project prepared in ./android
'
