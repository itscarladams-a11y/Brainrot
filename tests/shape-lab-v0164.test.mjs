import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createShapePuzzle,rotateShapeCells,canPlaceShapePiece,isShapePuzzleComplete,shapeStars,validateShapePuzzle,shapeBlueprintCountForGrade} from '../js/shape-lab.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

function anchorFor(cells){return [Math.min(...cells.map(([r])=>r)),Math.min(...cells.map(([,c])=>c))];}

test('Shape Lab generates valid deterministic spatial puzzles across every grade and challenge level',()=>{
  let checked=0;
  for(let grade=1;grade<=6;grade++)for(const profile of ['normal','hard','extreme'])for(let stage=1;stage<=64;stage++){
    const a=createShapePuzzle({grade,stage,difficultyProfile:profile});
    const b=createShapePuzzle({grade,stage,difficultyProfile:profile});
    assert.deepEqual(a,b);
    assert.ok(validateShapePuzzle(a),`invalid shape puzzle g${grade} ${profile} s${stage}`);
    assert.ok(a.pieces.length>=3&&a.pieces.length<=7);
    assert.ok(a.targetCells.length>=12);
    checked++;
  }
  assert.equal(checked,1152);
});

test('every generated Shape Lab puzzle can be reconstructed from its supplied pieces',()=>{
  for(let grade=1;grade<=6;grade++)for(let stage=1;stage<=32;stage++){
    const puzzle=createShapePuzzle({grade,stage,difficultyProfile:'hard'}),placements={};
    for(const piece of puzzle.pieces){
      const [row,col]=anchorFor(piece.solutionCells);
      const result=canPlaceShapePiece(puzzle,placements,piece,0,row,col);
      assert.ok(result.ok,`solution piece ${piece.id} does not fit g${grade} s${stage}`);
      placements[piece.id]={cells:result.cells,rotation:0,anchorRow:row,anchorCol:col};
    }
    assert.ok(isShapePuzzleComplete(puzzle,placements),`solution did not complete g${grade} s${stage}`);
  }
});

test('rotation helper preserves piece area across quarter turns',()=>{
  const puzzle=createShapePuzzle({grade:5,stage:7,difficultyProfile:'extreme'}),piece=puzzle.pieces[0];
  const keys=cells=>new Set(cells.map(([r,c])=>`${r}:${c}`));
  for(let turns=0;turns<4;turns++){
    const rotated=rotateShapeCells(piece.cells,turns);
    assert.equal(rotated.length,piece.cells.length);
    assert.equal(keys(rotated).size,piece.cells.length);
    assert.equal(Math.min(...rotated.map(([r])=>r)),0);
    assert.equal(Math.min(...rotated.map(([,c])=>c)),0);
  }
});

test('Shape Lab challenge profiles rotate pieces more aggressively without changing grade',()=>{
  for(let grade=1;grade<=6;grade++){
    const normal=createShapePuzzle({grade,stage:9,difficultyProfile:'normal'}),extreme=createShapePuzzle({grade,stage:9,difficultyProfile:'extreme'});
    assert.equal(normal.grade,grade);assert.equal(extreme.grade,grade);assert.equal(normal.size,extreme.size);assert.deepEqual(normal.targetCells,extreme.targetCells);
    assert.ok(extreme.pieces.some(piece=>piece.startRotation!==0));
  }
});

test('Shape Lab star scoring rewards clean spatial reasoning',()=>{
  assert.equal(shapeStars({wrongPlacements:0,hintsUsed:0}),3);
  assert.equal(shapeStars({wrongPlacements:1,hintsUsed:0}),3);
  assert.equal(shapeStars({wrongPlacements:2,hintsUsed:0}),2);
  assert.equal(shapeStars({wrongPlacements:4,hintsUsed:0}),1);
  assert.equal(shapeStars({wrongPlacements:0,hintsUsed:1}),2);
});

test('Shape Lab is integrated into Logic Lab with full navigation and accessibility controls',()=>{
  const html=read('index.html'),app=read('js/app.js'),css=read('styles.css'),sw=read('sw.js');
  assert.ok(exists('assets/ui/modes/shape-lab.svg'));
  assert.ok(exists('js/shape-lab.js'));
  assert.ok(html.includes('data-logic-game="shape"'));
  for(const id of ['shapeLabScreen','shapeBackBtn','shapePauseBtn','shapeHomeBtn','shapeBoard','shapePieceTray','shapeRotateBtn','shapeUndoBtn','shapeHintBtn','shapeClearBtn','shapeOverlay'])assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(app,/activeLogicGame='shape'/);
  assert.match(app,/openLogicPause\(\{leaveIntent:true,target:'logicHubScreen'\}\)/);
  assert.match(app,/isShapePuzzleComplete/);
  assert.match(css,/\.shape-board/);
  assert.match(css,/\.shape-piece-card/);
  assert.ok(sw.includes("'./js/shape-lab.js'"));
  assert.ok(sw.includes("'./assets/ui/modes/shape-lab.svg'"));
});

test('Shape Lab progress remains separate from academic mastery and uses existing Glorp production reactions',()=>{
  const app=read('js/app.js');
  for(const token of ['shapeNextStageByGrade','shapeBestStars','shapeSolved'])assert.ok(app.includes(token));
  assert.doesNotMatch(app,/recordProgressAnswer\([^\n]*shape/);
  for(const line of ['I was going to say that.','Professor, your questions are suspicious.','Fine. Maybe you are a little smart.'])assert.ok(app.includes(line));
});

test('Shape Lab offers enough transformed launch-stage variety for every grade band',()=>{
  assert.ok(shapeBlueprintCountForGrade(1)>=5);
  assert.ok(shapeBlueprintCountForGrade(3)>=4);
  assert.ok(shapeBlueprintCountForGrade(5)>=4);
});
