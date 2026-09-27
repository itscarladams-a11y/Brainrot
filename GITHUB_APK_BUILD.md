# Brainrot Academy v0.16.9 Android test APK

The fresh install includes a Codespaces container with Node 22, Java 21, and an Android 36 SDK setup. The first Codespaces creation downloads the SDK and installs npm dependencies. No forwarded port is needed to build an APK.

## Build inside Codespaces

From the repository root, run:

```bash
npm test
npm run android:build
```

Download `artifacts/Brainrot_Academy_v0.16.9-debug.apk` from the Codespaces file explorer. Its SHA-256 text file is beside it. The APK is a debug build for private device testing.

If the Codespace was created before `.devcontainer/devcontainer.json` was added, choose **Codespaces: Rebuild Container**. To set up a plain Linux environment with Node 22 and Java 21, run `npm ci && bash scripts/setup-codespaces-android.sh` before the build.

## Build with GitHub Actions

Push the fresh install to the `main` branch, or open **Actions → Build Android APK → Run workflow**. A successful run provides the `Brainrot-Academy-v0.16.9-APK` artifact containing the APK and checksum.

The workflow runs the tests, provisions Java 21 and the Android SDK, creates a fresh Capacitor Android project, and builds `assembleDebug`.

## Updating test installations

Android app updates require the same signing certificate. A Codespace normally retains its debug keystore between builds within that Codespace. GitHub-hosted runners are new machines per run, so separately built debug APKs may require an uninstall to install the next build, which erases local app progress. Use one stable signing key for a series of direct APK test updates, or distribute through Play Internal App Sharing, which signs shared APKs with its test certificate. Bump the app version code for each Play testing-track release.

Formal Google Play testing tracks for a new app use a signed Android App Bundle. This package builds a debug APK for device testing; it does not produce a Play release bundle.
