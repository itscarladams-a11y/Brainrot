import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLogicLevel,logicBoardSizeForGrade,validateLogicLevel,countLogicSolutions,logicStars} from '../js/logic-lab.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

test('Logic Lab scales board size by selected grade',()=>{
  assert.equal(logicBoardSizeForGrade(1),4);
  assert.equal(logicBoardSizeForGrade(2),4);
  assert.equal(logicBoardSizeForGrade(3),5);
  assert.equal(logicBoardSizeForGrade(4),5);
  assert.equal(logicBoardSizeForGrade(5),6);
  assert.equal(logicBoardSizeForGrade(6),7);
});

test('Logic Lab boards have exactly one unique legal solution',()=>{
  for(let grade=1;grade<=6;grade++){
    for(const stage of [1,2,6,7,12,24,36,48]){
      const level=createLogicLevel({grade,stage});
      assert.equal(validateLogicLevel(level),true,`invalid grade ${grade} stage ${stage}`);
      assert.equal(countLogicSolutions(level,2),1,`non-unique grade ${grade} stage ${stage}`);
    }
  }
});

test('hidden supplies satisfy row column region and no-touch constraints',()=>{
  const level=createLogicLevel({grade:6,stage:31});
  const cols=new Set(),regions=new Set();
  for(let row=0;row<level.size;row++){
    const col=level.solution[row];
    assert.equal(cols.has(col),false);
    assert.equal(regions.has(level.regions[row][col]),false);
    if(row>0)assert.ok(Math.abs(col-level.solution[row-1])>1,'adjacent-row supplies touch');
    cols.add(col);regions.add(level.regions[row][col]);
  }
  assert.equal(cols.size,level.size);
  assert.equal(regions.size,level.size);
});

test('Logic Lab star scoring rewards deduction and penalizes hints',()=>{
  assert.equal(logicStars({wrongSearches:0,hintsUsed:0}),3);
  assert.equal(logicStars({wrongSearches:1,hintsUsed:0}),2);
  assert.equal(logicStars({wrongSearches:2,hintsUsed:0}),1);
  assert.equal(logicStars({wrongSearches:0,hintsUsed:1}),2);
  assert.equal(logicStars({wrongSearches:1,hintsUsed:1}),1);
});

test('Logic Lab is wired as enrichment and ships offline',()=>{
  const html=read('index.html'),app=read('js/app.js'),settings=read('js/gameplay-settings.js'),sw=read('sw.js');
  assert.ok(exists('assets/ui/modes/logic-lab.svg'));
  assert.ok(html.includes('data-gameplay="logic"'));
  for(const id of ['logicLabScreen','logicBoard','logicSearchModeBtn','logicMarkModeBtn','logicHintBtn','logicHomeBtn'])assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(settings,/id:'logic'/);
  assert.match(settings,/subject:null/);
  assert.match(app,/openLogicLab/);
  assert.match(app,/prefs\.logicLab/);
  assert.ok(sw.includes("'./js/logic-lab.js'"));
  assert.ok(sw.includes("'./assets/ui/modes/logic-lab.svg'"));
});
