import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const readText=p=>fs.readFileSync(path.join(root,p),'utf8');
const APPROVED_NECESSARY_SHA='da7599702bc0126559c3c87c489959f90b6b0804f13a118b49d4d3498fab16b5';

test('approved Professor reference is archived but not used as spelling pronunciation',()=>{
  const bytes=read('assets/audio/reference/professor-option1-necessary.mp3');
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash,APPROVED_NECESSARY_SHA);
  assert.equal(fs.existsSync(path.join(root,'assets/audio/voice/spelling')),false);
});

test('Professor generation queue is retired by design',()=>{
  const queue=JSON.parse(readText('assets/audio/voice/professor-batch-queue.json'));
  assert.equal(queue.build,'0.14.0');
  assert.equal(queue.status,'retired-by-design');
});
