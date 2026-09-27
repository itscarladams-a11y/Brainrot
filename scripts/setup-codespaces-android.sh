#!/usr/bin/env bash
set -euo pipefail

if [ "$(uname -s)" != Linux ] || [ "$(uname -m)" != x86_64 ]; then
  echo 'The bundled Codespaces Android setup supports Linux x86_64.' >&2
  exit 1
fi

sdk_root="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/android-sdk}}"
export ANDROID_HOME="$sdk_root" ANDROID_SDK_ROOT="$sdk_root"
sdkmanager="$sdk_root/cmdline-tools/latest/bin/sdkmanager"

if [ ! -x "$sdkmanager" ]; then
  command -v curl >/dev/null || { echo 'curl is required.' >&2; exit 1; }
  command -v unzip >/dev/null || { echo 'unzip is required.' >&2; exit 1; }
  temp_dir="$(mktemp -d)"
  trap 'rm -rf "$temp_dir"' EXIT
  curl -fL --retry 3 --output "$temp_dir/commandline-tools.zip" \
    'https://dl.google.com/android/repository/commandlinetools-linux-15859902_latest.zip'
  printf '%s  %s\n' \
    '4e4c464f145a7512b57d088ac6c278c03c9eea610886b35a5e0804e74eedf583' \
    "$temp_dir/commandline-tools.zip" | sha256sum -c -
  unzip -q "$temp_dir/commandline-tools.zip" -d "$temp_dir/unpacked"
  mkdir -p "$sdk_root/cmdline-tools/latest"
  cp -R "$temp_dir/unpacked/cmdline-tools/." "$sdk_root/cmdline-tools/latest/"
fi

printf 'y\n%.0s' {1..100} | "$sdkmanager" --sdk_root="$sdk_root" --licenses >/dev/null
"$sdkmanager" --sdk_root="$sdk_root" --install \
  'platform-tools' 'platforms;android-36' 'build-tools;36.0.0'
printf 'Android SDK ready at %s\n' "$sdk_root"
