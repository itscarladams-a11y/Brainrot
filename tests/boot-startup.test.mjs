import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../js/boot.js',import.meta.url),'utf8');

function startBoot(){
  let now=0,nextId=1;
  const timers=new Map(),images=[],events={};
  const nodes=new Map(['bootSplash','bootProgress','bootProgressFill','bootProgressLabel','bootPercent','bootRetryBtn'].map(id=>{
    const node={style:{},attributes:{},textContent:'',hidden:true,removed:false,classes:new Set(),
      setAttribute(key,value){this.attributes[key]=value;},
      classList:{add(name){node.classes.add(name);}},
      addEventListener(){},remove(){this.removed=true;}};
    return [id,node];
  }));
  class ImageMock{
    constructor(){images.push(this);}
    set src(value){this.url=value;}
    decode(){return Promise.resolve();}
  }
  const context={Image:ImageMock,window:{},document:{getElementById:id=>nodes.get(id),addEventListener:(name,callback)=>events[name]=callback},
    performance:{now:()=>now},location:{reload(){}},
    setTimeout:(callback,delay)=>{const id=nextId++;timers.set(id,{at:now+delay,callback});return id;},
    clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(source,context);
  function advance(ms){const until=now+ms;while(true){const next=[...timers.entries()].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].callback();}now=until;}
  events.DOMContentLoaded();
  return {images,nodes,advance,appReady:context.window.brainrotBoot.appReady};
}

test('studio loading bar advances on actual image readiness and waits for the game',async()=>{
  const boot=startBoot(),get=id=>boot.nodes.get(id);
  assert.equal(get('bootProgress').attributes['aria-valuenow'],'0');
  assert.equal(boot.images.length,4);
  boot.images[0].onload();
  await Promise.resolve();
  assert.equal(get('bootProgressFill').style.width,'20%');
  boot.images.slice(1).forEach(image=>image.onload());
  await Promise.resolve();
  assert.equal(get('bootProgressFill').style.width,'80%');
  assert.equal(get('bootSplash').classes.has('done'),false);
  boot.appReady();
  assert.equal(get('bootProgressFill').style.width,'100%');
  boot.advance(2199);
  assert.equal(get('bootSplash').classes.has('done'),false);
  boot.advance(1);
  assert.equal(get('bootSplash').classes.has('done'),true);
  boot.advance(500);
  assert.equal(get('bootSplash').removed,true);
});

test('startup offers retry if the game never initializes',()=>{
  const boot=startBoot();
  boot.advance(15000);
  assert.equal(boot.nodes.get('bootProgressLabel').textContent,'COULD NOT START THE GAME');
  assert.equal(boot.nodes.get('bootRetryBtn').hidden,false);
  assert.equal(boot.nodes.get('bootSplash').removed,false);
});
