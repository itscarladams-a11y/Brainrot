import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const android=path.join(root,'android');
if(!fs.existsSync(android)) throw new Error('Android project not found. Run npx cap add android first.');

const iconMap={
  'mipmap-mdpi':48,
  'mipmap-hdpi':72,
  'mipmap-xhdpi':96,
  'mipmap-xxhdpi':144,
  'mipmap-xxxhdpi':192
};
for(const dir of Object.keys(iconMap)){
  const src=path.join(root,'resources','android',dir,'ic_launcher.png');
  const destDir=path.join(android,'app','src','main','res',dir);
  if(!fs.existsSync(src)) throw new Error(`Missing Android icon resource: ${src}`);
  fs.mkdirSync(destDir,{recursive:true});
  for(const name of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png']){
    fs.copyFileSync(src,path.join(destDir,name));
  }
}

const colorFile=path.join(android,'app','src','main','res','values','ic_launcher_background.xml');
if(fs.existsSync(colorFile)){
  fs.writeFileSync(colorFile,'<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#120B2D</color>\n</resources>\n');
}

const themeFile=path.join(android,'app','src','main','res','values','styles.xml');
if(fs.existsSync(themeFile)){
  let theme=fs.readFileSync(themeFile,'utf8');
  const launchBackground='<item name="android:background">@drawable/splash</item>';
  if(!theme.includes(launchBackground))throw new Error('Android launch theme has changed; cannot set its black background safely.');
  theme=theme.replace(launchBackground,'<item name="android:background">@android:color/black</item>\n        <item name="windowSplashScreenBackground">@android:color/black</item>');
  theme=theme.replace('<item name="android:background">@null</item>','<item name="android:background">@android:color/black</item>');
  fs.writeFileSync(themeFile,theme);
}

for(const gradleName of ['build.gradle','build.gradle.kts']){
  const gradle=path.join(android,'app',gradleName);
  if(!fs.existsSync(gradle)) continue;
  let text=fs.readFileSync(gradle,'utf8');
  text=text.replace(/versionCode\s+\d+/,'versionCode 1609');
  text=text.replace(/versionName\s+["'].*?["']/,'versionName "0.16.9"');
  text=text.replace(/versionCode\s*=\s*\d+/,'versionCode = 1609');
  text=text.replace(/versionName\s*=\s*["'].*?["']/,'versionName = "0.16.9"');
  fs.writeFileSync(gradle,text);
}
console.log('Configured Android icon, black launch background, version metadata, fullscreen status bar, and Android back handling.');


const mainActivity=path.join(android,'app','src','main','java','com','brainrotacademy','app','MainActivity.java');
if(fs.existsSync(mainActivity)){
  fs.writeFileSync(mainActivity,`package com.brainrotacademy.app;

import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.content.ContentValues;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import java.io.OutputStream;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    hideStatusBar();
    if (getBridge() != null && getBridge().getWebView() != null) {
      getBridge().getWebView().addJavascriptInterface(new PdfBridge(), "BrainrotNative");
    }
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideStatusBar();
  }

  @Override
  public void onBackPressed() {
    if (getBridge() != null && getBridge().getWebView() != null) {
      getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new CustomEvent('brainrotAndroidBack'))", null);
      return;
    }
    super.onBackPressed();
  }

  private class PdfBridge {
    @JavascriptInterface
    public void savePdf(String filename, String base64) {
      boolean ok = false;
      try {
        byte[] data = Base64.decode(base64, Base64.DEFAULT);
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
        values.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Brainrot Academy");
        }
        Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
        if (uri != null) {
          try (OutputStream out = getContentResolver().openOutputStream(uri)) {
            if (out != null) { out.write(data); out.flush(); ok = true; }
          }
        }
      } catch (Exception ignored) {}
      final boolean result = ok;
      runOnUiThread(() -> {
        Toast.makeText(MainActivity.this, result ? "Progress PDF saved to Downloads" : "Could not save progress PDF", Toast.LENGTH_LONG).show();
        if (getBridge() != null && getBridge().getWebView() != null) {
          getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new CustomEvent('brainrotPdfSaved',{detail:{ok:" + result + "}}))", null);
        }
      });
    }
  }

  private void hideStatusBar() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      WindowInsetsController controller = getWindow().getInsetsController();
      if (controller != null) {
        controller.hide(WindowInsets.Type.statusBars());
        controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
      }
    } else {
      getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
      getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
  }
}
`);
}
