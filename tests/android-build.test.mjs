import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

test('Capacitor Android build configuration is packaged',()=>{
  const config=JSON.parse(read('capacitor.config.json'));
  const pkg=JSON.parse(read('package.json'));
  assert.equal(config.appId,'com.brainrotacademy.app');
  assert.equal(config.appName,'Brainrot Academy');
  assert.equal(config.webDir,'www');
  assert.equal(pkg.version,'0.16.9');
  assert.ok(pkg.dependencies['@capacitor/android']);
  assert.ok(pkg.dependencies['@capacitor/core']);
  assert.ok(pkg.devDependencies['@capacitor/cli']);
  assert.equal(pkg.scripts['android:build'],'bash scripts/build-android.sh');
});

test('GitHub Actions builds and uploads the APK',()=>{
  const workflow=read('.github/workflows/build-android-apk.yml');
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/branches: \[main\]/);
  assert.match(workflow,/npm run android:build/);
  assert.match(workflow,/actions\/upload-artifact@v4/);
  assert.match(workflow,/Brainrot_Academy_v0\.16\.9-debug\.apk/);
});

test('Android build scripts produce a named artifact without a web server',()=>{
  const build=read('scripts/build-android.sh');
  const prep=read('scripts/prepare-android.sh');
  assert.match(prep,/npx cap add android/);
  assert.match(prep,/npx cap sync android/);
  assert.match(build,/\.\/gradlew assembleDebug/);
  assert.match(build,/artifacts\/Brainrot_Academy_v0\.16\.9-debug\.apk/);
  assert.doesNotMatch(build,/http\.server|localhost:8000/);
});

test('Android icon resources are included at all launcher densities',()=>{
  for(const dir of ['mipmap-mdpi','mipmap-hdpi','mipmap-xhdpi','mipmap-xxhdpi','mipmap-xxxhdpi']){
    assert.ok(exists(`resources/android/${dir}/ic_launcher.png`),`missing ${dir} icon`);
  }
});


test('Capacitor dependencies are pinned for repeatable GitHub builds',()=>{
  const pkg=JSON.parse(read('package.json'));
  for(const [name,version] of Object.entries({...pkg.dependencies,...pkg.devDependencies})){
    if(name.startsWith('@capacitor/')){
      assert.match(version,/^\d+\.\d+\.\d+$/);
    }
  }
});


test('Git ignore keeps packaged Android icon resources trackable',()=>{
  const ignore=read('.gitignore');
  assert.match(ignore,/(^|\n)\/android\/(\n|$)/);
  assert.doesNotMatch(ignore,/(^|\n)android\/(\n|$)/);
});
