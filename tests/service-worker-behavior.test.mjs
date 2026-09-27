import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

function worker(fetchImpl){
  const handlers={},stored=[];
  const cache={put:async(request,response)=>stored.push({request,response})};
  const caches={match:async key=>key==='./index.html'?new Response('offline page'):undefined,open:async()=>cache};
  const self={location:{origin:'https://academy.test'},registration:{scope:'https://academy.test/'},addEventListener:(name,handler)=>handlers[name]=handler};
  vm.runInNewContext(source,{self,caches,fetch:fetchImpl,URL,Response});
  return {handlers,stored};
}

function fetchEvent(url,mode='cors'){
  const event={request:{url,mode,method:'GET'},response:null,work:[],respondWith(promise){this.response=promise;},waitUntil(promise){this.work.push(promise);}};
  return event;
}

test('offline navigation serves the cached app, while failed media never receives HTML',async()=>{
  const {handlers}=worker(async()=>{throw new Error('offline');});
  const navigation=fetchEvent('https://academy.test/lesson','navigate');
  handlers.fetch(navigation);
  assert.equal(await (await navigation.response).text(),'offline page');

  const media=fetchEvent('https://academy.test/assets/music/battle.mp3');
  handlers.fetch(media);
  await assert.rejects(media.response,/offline/);
});

test('the app cache does not intercept external requests',()=>{
  const {handlers}=worker(async()=>new Response('online'));
  const external=fetchEvent('https://another.test/picture.png');
  handlers.fetch(external);
  assert.equal(external.response,null);
});
