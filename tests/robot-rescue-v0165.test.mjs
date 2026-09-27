import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRobotMission,validateRobotMission,solveRobotMission,simulateRobotProgram,robotCommandsForGrade,expandRobotProgram,expandRobotProgramDetailed,robotStars,robotBoardSizeForGrade} from '../js/robot-rescue.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

test('Robot Rescue generates deterministic solver-validated missions across all grades and challenge levels',()=>{
  let checked=0;
  for(let grade=1;grade<=6;grade++)for(const profile of ['normal','hard','extreme'])for(let stage=1;stage<=64;stage++){
    const a=createRobotMission({grade,stage,difficultyProfile:profile});
    const b=createRobotMission({grade,stage,difficultyProfile:profile});
    assert.deepEqual(a,b);
    assert.ok(validateRobotMission(a),`invalid robot mission g${grade} ${profile} s${stage}`);
    assert.equal(a.grade,grade);
    assert.ok(a.optimalMoves>0);
    assert.ok(a.queueLimit>=a.optimalMoves);
    checked++;
  }
  assert.equal(checked,1152);
});

test('the built-in solver route completes every generated Robot Rescue mission',()=>{
  for(let grade=1;grade<=6;grade++)for(const profile of ['normal','hard','extreme'])for(let stage=1;stage<=40;stage++){
    const mission=createRobotMission({grade,stage,difficultyProfile:profile}),solved=solveRobotMission(mission);
    assert.ok(solved,`no solver path g${grade} ${profile} s${stage}`);
    const result=simulateRobotProgram(mission,solved.program);
    assert.ok(result.complete,`solver program did not complete g${grade} ${profile} s${stage}`);
    assert.equal(result.crashed,false);
  }
});

test('Robot Rescue scales board size and command vocabulary by grade instead of jumping curriculum bands',()=>{
  assert.equal(robotBoardSizeForGrade(1),5);assert.equal(robotBoardSizeForGrade(2),5);
  assert.equal(robotBoardSizeForGrade(3),6);assert.equal(robotBoardSizeForGrade(4),6);
  assert.equal(robotBoardSizeForGrade(5),7);assert.equal(robotBoardSizeForGrade(6),7);
  assert.deepEqual(robotCommandsForGrade(1),['F','L','R']);
  assert.ok(robotCommandsForGrade(3).includes('REP2'));
  assert.ok(!robotCommandsForGrade(3).includes('REP3'));
  assert.ok(robotCommandsForGrade(5).includes('REP3'));
});

test('repeat commands expand predictably and retain queue origin metadata',()=>{
  const program=['F','REP2','R','REP3'];
  assert.deepEqual(expandRobotProgram(program),['F','F','R','R','R']);
  assert.deepEqual(expandRobotProgramDetailed(program),[
    {action:'F',origin:0},{action:'F',origin:1},{action:'R',origin:2},{action:'R',origin:3},{action:'R',origin:3}
  ]);
});

test('older-grade debug missions begin with code that actually needs repair',()=>{
  let debugCount=0;
  for(let grade=5;grade<=6;grade++)for(let stage=1;stage<=48;stage++){
    const mission=createRobotMission({grade,stage,difficultyProfile:'hard'});
    if(mission.mode!=='debug')continue;
    debugCount++;
    assert.ok(Array.isArray(mission.debugProgram)&&mission.debugProgram.length);
    assert.equal(simulateRobotProgram(mission,mission.debugProgram).complete,false,`debug program accidentally solved g${grade} s${stage}`);
  }
  assert.ok(debugCount>=20);
});

test('Robot Rescue star scoring rewards clean efficient planning',()=>{
  assert.equal(robotStars({crashes:0,failedRuns:0,hintsUsed:0,executedMoves:10,optimalMoves:10}),3);
  assert.equal(robotStars({crashes:0,failedRuns:0,hintsUsed:0,executedMoves:11,optimalMoves:10}),3);
  assert.equal(robotStars({crashes:0,failedRuns:1,hintsUsed:0,executedMoves:10,optimalMoves:10}),2);
  assert.equal(robotStars({crashes:2,failedRuns:0,hintsUsed:0,executedMoves:10,optimalMoves:10}),1);
  assert.equal(robotStars({crashes:0,failedRuns:0,hintsUsed:1,executedMoves:10,optimalMoves:10}),2);
});

test('Robot Rescue is integrated into Logic Lab with the full navigation shell and mobile controls',()=>{
  const html=read('index.html'),app=read('js/app.js'),css=read('styles.css'),sw=read('sw.js');
  assert.ok(exists('js/robot-rescue.js'));assert.ok(exists('assets/ui/modes/robot-rescue.svg'));
  assert.ok(html.includes('data-logic-game="robot"'));
  for(const id of ['robotLabScreen','robotBackBtn','robotPauseBtn','robotHomeBtn','robotBoard','robotProgramQueue','robotCommandPad','robotRunBtn','robotStopBtn','robotUndoBtn','robotClearBtn','robotHintBtn','robotOverlay'])assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(app,/activeLogicGame='robot'/);assert.match(app,/openRobotRescue/);assert.match(app,/runToken/);
  assert.match(css,/body\[data-screen="robotLabScreen"\] \.app-dock/);assert.match(css,/\.robot-board/);assert.match(css,/\.robot-program-queue/);
  assert.ok(sw.includes("'./js/robot-rescue.js'"));assert.ok(sw.includes("'./assets/ui/modes/robot-rescue.svg'"));
});

test('Robot Rescue has dedicated sound effects plus offline-safe Glorp vocal hooks',()=>{
  const audio=read('js/audio.js'),app=read('js/app.js');
  for(const file of ['robot-step.wav','robot-turn.wav','robot-charge.wav','robot-crash.wav'])assert.ok(exists(`assets/audio/sfx/${file}`),`missing ${file}`);
  for(const key of ['robotStep','robotTurn','robotCharge','robotCrash'])assert.ok(audio.includes(key));
  assert.ok(app.includes("'WHAT?! NO!','WHAT?! NO!'"));
  assert.ok(app.includes("'That question was rigged!','That question was rigged!'"));
});

test('Robot Rescue progress is separate from academic mastery',()=>{
  const app=read('js/app.js');
  for(const token of ['robotNextStageByGrade','robotBestStars','robotSolved'])assert.ok(app.includes(token));
  assert.doesNotMatch(app,/recordProgressAnswer\([^\n]*robot/);
});
