# Fresh install in GitHub Codespaces

1. Create an empty GitHub repository for Brainrot Academy.
2. Unzip this fresh-install archive and upload **everything inside** to the repository root, including `.github`, `.devcontainer`, `assets`, `js`, `scripts`, `tests`, `package.json`, and `package-lock.json`. Do not upload the enclosing folder as a second directory.
3. Commit the files on the `main` branch and open **Code → Codespaces → Create codespace on main**.
4. Wait for the automatic Node, Java, npm, and Android SDK setup to finish. On the first creation this downloads Android SDK components.
5. In the Codespaces terminal, run:

```bash
npm test
npm run android:build
```

The finished test APK is `artifacts/Brainrot_Academy_v0.16.9-debug.apk`. Right-click it in the file explorer and choose **Download**. The build does not need a Ports tab or web server.

You can also download the APK from the **Actions → Build Android APK** workflow after a successful push to `main`.

If the terminal says `sdkmanager` or Android SDK is missing, run `bash scripts/setup-codespaces-android.sh` and retry. If Codespaces already existed before this archive was uploaded, rebuild the container so it picks up `.devcontainer/devcontainer.json`.
