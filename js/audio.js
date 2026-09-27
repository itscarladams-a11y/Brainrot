import { getCharacterVoiceSource, LEGACY_GLORP_FILES } from './voice-registry.js';

const base='./assets/audio/';
const musicBase='./assets/music/';

const sfxFiles={
  tap:'sfx/button-pop.mp3',correct:'sfx/correct-chime.mp3',wrong:'sfx/wrong-buzz.mp3',ping:'sfx/phone-ping.mp3',
  rage:['sfx/rage-hit.mp3','sfx/rage-hit-2.mp3'],unlock:'sfx/unlock.mp3',growl:['sfx/glorp-growl.mp3','sfx/glorp-growl-2.mp3'],
  splat:['sfx/slime-splat.mp3','sfx/slime-splat-2.mp3'],laugh:['sfx/glorp-laugh.mp3','sfx/glorp-laugh-2.mp3'],
  stamp:'sfx/grade-stamp.mp3',chalk:'sfx/chalk-tap.mp3',page:'sfx/page-flip.mp3',whoosh:'sfx/ui-whoosh.mp3',sparkle:'sfx/sparkle-pop.mp3',
  robotStep:'sfx/robot-step.wav',robotTurn:'sfx/robot-turn.wav',robotCharge:'sfx/robot-charge.wav',robotCrash:'sfx/robot-crash.wav'
};
const musicFiles={menu:'menu.mp3',battle:'battle.mp3',professor:'professor.mp3'};
const stingFiles={win:'win.mp3',review:'review.mp3'};

const clamp=(n,lo=0,hi=1)=>Math.max(lo,Math.min(hi,n));

export class AudioDirector{
  constructor(getPrefs){
    this.getPrefs=getPrefs;this.cache=new Map();this.currentVoice=null;this.queuedVoice=null;this.currentMusic=null;this.musicMode=null;
    this.intensity=0;this.musicWanted=false;this.ducked=false;this.fadeToken=0;this.lastVariants=new Map();
    [...Object.values(LEGACY_GLORP_FILES),...Object.values(sfxFiles).flat()].forEach(f=>this.preload(f));
    Object.values(musicFiles).forEach(f=>this.preloadMusic(f));Object.values(stingFiles).forEach(f=>this.preloadMusic(f));
  }
  preload(file){if(this.cache.has('a:'+file))return this.cache.get('a:'+file);const a=new Audio(base+file);a.preload='auto';a.playsInline=true;this.cache.set('a:'+file,a);return a;}
  preloadMusic(file){if(this.cache.has('m:'+file))return this.cache.get('m:'+file);const a=new Audio(musicBase+file);a.preload='auto';a.playsInline=true;this.cache.set('m:'+file,a);return a;}
  clone(file,volume=1,music=false){const src=music?this.preloadMusic(file):this.preload(file);const a=src.cloneNode(true);a.volume=clamp(volume);a.playsInline=true;return a;}
  chooseVariant(name,entry){
    if(!Array.isArray(entry))return entry;
    const last=this.lastVariants.get(name);const pool=entry.filter(x=>x!==last);const f=(pool.length?pool:entry)[Math.floor(Math.random()*(pool.length||entry.length))];
    this.lastVariants.set(name,f);return f;
  }
  sfx(name,volume=1){if(!this.getPrefs().sound)return;const e=sfxFiles[name];if(!e)return;const f=this.chooseVariant(name,e);const a=this.clone(f,volume);if(['laugh','growl','splat','rage'].includes(name))a.playbackRate=.96+Math.random()*.08;a.play().catch(()=>{});}
  musicVolume(mode=this.musicMode){if(mode==='menu')return .16;if(mode==='professor')return .18;return .19+this.intensity*.035;}
  fadeVolume(audio,target,duration=160){
    if(!audio)return;const start=audio.volume,delta=target-start,t0=performance.now(),token=++this.fadeToken;
    const tick=now=>{if(token!==this.fadeToken||!audio)return;const p=Math.min(1,(now-t0)/duration);audio.volume=clamp(start+delta*(1-(1-p)*(1-p)));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);
  }
  duckMusic(amount=.42){if(!this.currentMusic)return;this.ducked=true;this.fadeVolume(this.currentMusic,this.musicVolume()*amount,120);}
  restoreMusic(){if(!this.currentMusic)return;this.ducked=false;this.fadeVolume(this.currentMusic,this.musicVolume(),220);}
  stopVoice(clearQueue=true){if(clearQueue)this.queuedVoice=null;if(this.currentVoice){this.currentVoice.pause();this.currentVoice.currentTime=0;this.currentVoice=null;}this.restoreMusic();}
  playQueuedVoice(){
    if(this.currentVoice||!this.queuedVoice)return false;
    const next=this.queuedVoice;this.queuedVoice=null;return this.playVoiceSource(next.source,next.fallback);
  }
  playVoiceAudio(audio,fallback,onFail=null){
    this.currentVoice=audio;this.duckMusic(.34);
    let finished=false;
    const done=(failed=false)=>{if(finished)return;finished=true;if(this.currentVoice===audio)this.currentVoice=null;if(failed&&onFail){onFail();return;}if(failed&&fallback)this.sfx(fallback,.58);if(!this.playQueuedVoice())this.restoreMusic();};
    audio.onended=()=>done(false);
    audio.onerror=()=>done(true);
    audio.play().catch(()=>done(true));
    return true;
  }
  playVoiceSource(source,fallback){
    if(source.type==='local-legacy')return this.playVoiceAudio(this.clone(source.file,.96),fallback);
    if(source.type==='remote-production'&&source.fallbackFile&&typeof navigator!=='undefined'&&navigator.onLine===false)return this.playVoiceAudio(this.clone('voice/'+source.fallbackFile,.96),fallback);
    const a=new Audio(source.url);a.preload='auto';a.playsInline=true;a.volume=.96;
    const localFallback=source.fallbackFile?()=>this.playVoiceAudio(this.clone('voice/'+source.fallbackFile,.96),fallback):null;
    return this.playVoiceAudio(a,fallback,localFallback);
  }
  speakCharacter(speaker,text,fallback=speaker==='professor'?'chalk':'growl'){
    if(!this.getPrefs().voice)return false;
    const source=getCharacterVoiceSource(speaker,text);
    if(!source){if(fallback)this.sfx(fallback,speaker==='professor'?.34:.58);return false;}
    if(this.currentVoice && !this.currentVoice.ended){this.queuedVoice={source,fallback};return true;}
    return this.playVoiceSource(source,fallback);
  }
  voice(text,fallback='growl'){return this.speakCharacter('glorp',text,fallback);}
  startMusic(mode='battle'){
    this.musicWanted=true;if(!this.getPrefs().music)return;
    if(this.currentMusic&&this.musicMode===mode&&!this.currentMusic.paused)return;
    const old=this.currentMusic;const oldMode=this.musicMode;this.currentMusic=null;this.musicMode=null;
    if(old){const token=++this.fadeToken;let v=old.volume;const timer=setInterval(()=>{if(token!==this.fadeToken){clearInterval(timer);return;}v-=.035;if(v<=.01){clearInterval(timer);old.pause();old.currentTime=0;}else old.volume=Math.max(0,v);},24);}
    const file=musicFiles[mode]||musicFiles.battle;const a=this.clone(file,0,true);a.loop=true;a.playbackRate=mode==='battle'?1+this.intensity*.012:1;this.currentMusic=a;this.musicMode=mode;
    a.play().then(()=>this.fadeVolume(a,this.musicVolume(mode),260)).catch(()=>{if(this.currentMusic===a){this.currentMusic=null;this.musicMode=oldMode||null;}});
  }
  stopMusic(fade=true){this.musicWanted=false;if(!this.currentMusic)return;const a=this.currentMusic;this.currentMusic=null;this.musicMode=null;this.ducked=false;if(!fade){a.pause();a.currentTime=0;return;}let v=a.volume;const timer=setInterval(()=>{v-=.035;if(v<=.01){clearInterval(timer);a.pause();a.currentTime=0;}else a.volume=Math.max(0,v);},24);}
  cutMusic(ms=650){const mode=this.musicMode;this.stopMusic(false);this.sfx('splat',.55);if(mode)setTimeout(()=>{if(document.body.dataset.screen==='battleScreen')this.startMusic(mode);},ms);}
  setIntensity(level=0){this.intensity=Math.max(0,Math.min(3,Number(level)||0));if(this.currentMusic&&this.musicMode==='battle'&&!this.ducked){this.fadeVolume(this.currentMusic,this.musicVolume('battle'),140);this.currentMusic.playbackRate=1+this.intensity*.012;}}
  playSting(kind='win'){if(!this.getPrefs().music)return;const f=stingFiles[kind]||stingFiles.win;const a=this.clone(f,.36,true);if(this.currentMusic)this.duckMusic(.25);a.onended=()=>this.restoreMusic();a.play().catch(()=>this.restoreMusic());}
  pause(){this.currentVoice?.pause();this.currentMusic?.pause();}
  resume(){if(this.currentVoice?.paused)this.currentVoice.play().catch(()=>{});if(this.currentMusic?.paused&&this.getPrefs().music)this.currentMusic.play().catch(()=>{});}
}
