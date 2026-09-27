#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/android-sdk}}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

bash scripts/prepare-android.sh
cd android
./gradlew assembleDebug
cd ..

mkdir -p artifacts
APK_SRC="android/app/build/outputs/apk/debug/app-debug.apk"
APK_OUT="artifacts/Brainrot_Academy_v0.16.9-debug.apk"
if [ ! -f "$APK_SRC" ]; then
  echo "APK was not produced at $APK_SRC" >&2
  exit 1
fi
cp "$APK_SRC" "$APK_OUT"
(cd artifacts && sha256sum "$(basename "$APK_OUT")" > Brainrot_Academy_v0.16.9-debug.sha256.txt)
printf '
APK ready: %s
' "$APK_OUT"
