const DIRS=[[-1,0],[0,1],[1,0],[0,-1]];
const DIR_NAMES=['north','east','south','west'];

const ROUTES={
  5:[
    [[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[1,4],[0,4]],
    [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4]],
    [[4,4],[3,4],[2,4],[2,3],[2,2],[1,2],[0,2],[0,1],[0,0]],
    [[0,4],[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[4,0]],
    [[4,0],[3,0],[3,1],[3,2],[2,2],[1,2],[1,3],[1,4],[0,4]],
    [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4]]
  ],
  6:[
    [[5,0],[5,1],[4,1],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[0,5]],
    [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5]],
    [[5,5],[4,5],[3,5],[3,4],[3,3],[2,3],[1,3],[1,2],[1,1],[0,1],[0,0]],
    [[0,5],[0,4],[1,4],[2,4],[2,3],[2,2],[3,2],[4,2],[4,1],[4,0],[5,0]],
    [[5,0],[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[1,4],[0,4],[0,5]],
    [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[5,5]]
  ],
  7:[
    [[6,0],[6,1],[5,1],[4,1],[4,2],[4,3],[3,3],[2,3],[2,4],[2,5],[1,5],[0,5],[0,6]],
    [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4],[5,4],[6,4],[6,5],[6,6]],
    [[6,6],[5,6],[4,6],[4,5],[4,4],[3,4],[2,4],[2,3],[2,2],[1,2],[0,2],[0,1],[0,0]],
    [[0,6],[0,5],[1,5],[2,5],[2,4],[2,3],[3,3],[4,3],[4,2],[4,1],[5,1],[6,1],[6,0]],
    [[6,0],[5,0],[5,1],[5,2],[4,2],[3,2],[3,3],[3,4],[2,4],[1,4],[1,5],[1,6],[0,6]],
    [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[5,5],[6,5],[6,6]]
  ]
};

function clampGrade(grade){return Math.max(1,Math.min(6,Number(grade)||1));}
function boardSizeForGrade(grade){const g=clampGrade(grade);return g<=2?5:g<=4?6:7;}
function hashSeed(...parts){let h=2166136261>>>0;for(const part of parts)for(const ch of String(part)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function key(r,c){return `${r}:${c}`;}
function transformCoord(r,c,n,variant){let rr=r,cc=c;if(variant>=4)cc=n-1-cc;const turns=variant%4;for(let i=0;i<turns;i++)[rr,cc]=[cc,n-1-rr];return [rr,cc];}
function transformRoute(route,n,variant){return route.map(([r,c])=>transformCoord(r,c,n,variant));}
function dirBetween(a,b){const dr=b[0]-a[0],dc=b[1]-a[1];return DIRS.findIndex(([r,c])=>r===dr&&c===dc);}
function chooseBranches(route,n,seed,profile){const rand=rng(seed),routeSet=new Set(route.map(([r,c])=>key(r,c))),candidates=[];
  route.forEach(([r,c],index)=>{for(const [dr,dc] of DIRS){const rr=r+dr,cc=c+dc,k=key(rr,cc);if(rr<0||cc<0||rr>=n||cc>=n||routeSet.has(k))continue;candidates.push({rr,cc,index,score:rand()});}});
  candidates.sort((a,b)=>a.score-b.score);const target=profile==='extreme'?Math.floor(n*.75):profile==='hard'?n:Math.ceil(n*1.25),out=[],used=new Set();
  for(const item of candidates){const k=key(item.rr,item.cc);if(used.has(k))continue;used.add(k);out.push([item.rr,item.cc]);if(out.length>=target)break;}
  return out;
}
function batteryIndices(routeLength,grade,profile){const g=clampGrade(grade),count=g<=2?1:g<=4?(profile==='normal'?1:2):(profile==='normal'?2:3),out=[];for(let i=1;i<=count;i++){let idx=Math.round((routeLength-1)*i/(count+1));idx=Math.max(2,Math.min(routeLength-3,idx));while(out.includes(idx)&&idx<routeLength-3)idx++;out.push(idx);}return out;}
function turnCost(from,to){const diff=(to-from+4)%4;return diff===0?[]:diff===1?['R']:diff===3?['L']:['R','R'];}
function primitiveProgramFromRoute(route,startDir){let dir=startDir,program=[];for(let i=1;i<route.length;i++){const needed=dirBetween(route[i-1],route[i]);program.push(...turnCost(dir,needed),'F');dir=needed;}return program;}
function commandLabel(cmd){return cmd==='F'?'FORWARD':cmd==='L'?'TURN LEFT':cmd==='R'?'TURN RIGHT':cmd==='REP2'?'REPEAT LAST ×2':cmd==='REP3'?'REPEAT LAST ×3':cmd;}

export function robotCommandsForGrade(grade){const g=clampGrade(grade),base=['F','L','R'];if(g>=3)base.push('REP2');if(g>=5)base.push('REP3');return base;}
export function expandRobotProgram(program=[]){const out=[];let lastPrimitive=null;for(const token of program){if(['F','L','R'].includes(token)){out.push(token);lastPrimitive=token;continue;}if(token==='REP2'&&lastPrimitive){out.push(lastPrimitive);continue;}if(token==='REP3'&&lastPrimitive){out.push(lastPrimitive,lastPrimitive);continue;}}return out;}
export function robotCommandLabel(cmd){return commandLabel(cmd);}
export function expandRobotProgramDetailed(program=[]){const out=[];let lastPrimitive=null;for(let i=0;i<program.length;i++){const token=program[i];if(['F','L','R'].includes(token)){out.push({action:token,origin:i});lastPrimitive=token;continue;}if(token==='REP2'&&lastPrimitive){out.push({action:lastPrimitive,origin:i});continue;}if(token==='REP3'&&lastPrimitive){out.push({action:lastPrimitive,origin:i},{action:lastPrimitive,origin:i});continue;}}return out;}

function missionStartDirection(route,profile,stage){const aligned=dirBetween(route[0],route[1]);if(profile==='normal')return aligned;if(profile==='hard')return (aligned+(stage%2?1:3))%4;return (aligned+2)%4;}
function makeMission({grade=3,stage=1,difficultyProfile='normal'}={}){
  const g=clampGrade(grade),profile=['normal','hard','extreme'].includes(difficultyProfile)?difficultyProfile:'normal',size=boardSizeForGrade(g),routes=ROUTES[size],safeStage=Math.max(1,Number(stage)||1),baseIndex=(safeStage-1)%routes.length,variant=Math.floor((safeStage-1)/routes.length)%8,route=transformRoute(routes[baseIndex],size,variant),routeSet=new Set(route.map(([r,c])=>key(r,c))),branches=chooseBranches(route,size,hashSeed(g,safeStage,profile,'branches'),profile),openSet=new Set([...routeSet,...branches.map(([r,c])=>key(r,c))]),obstacles=[];
  for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!openSet.has(key(r,c)))obstacles.push([r,c]);
  const batteries=batteryIndices(route.length,g,profile).map(i=>route[i]);
  let switchCell=null,doorCell=null;
  if(g>=3&&(profile!=='normal'||safeStage%3===0)){
    const sidx=Math.max(2,Math.floor(route.length*.32)),didx=Math.min(route.length-3,Math.max(sidx+2,Math.floor(route.length*.62)));
    switchCell=route[sidx];doorCell=route[didx];
    const batteryKey=key(...doorCell);const clash=batteries.findIndex(b=>key(...b)===batteryKey);if(clash>=0)batteries[clash]=route[Math.max(1,didx-1)];
  }
  const startDir=missionStartDirection(route,profile,safeStage),goal=route.at(-1),mode=g>=5&&safeStage%4===0?'debug':'build';
  const mission={id:`robot-g${g}-s${safeStage}-${profile}`,grade:g,stage:safeStage,profile,size,start:{row:route[0][0],col:route[0][1],dir:startDir},goal:[...goal],obstacles,batteries:batteries.map(x=>[...x]),switchCell:switchCell?[...switchCell]:null,doorCell:doorCell?[...doorCell]:null,route:route.map(x=>[...x]),mode,commands:robotCommandsForGrade(g)};
  const solved=solveRobotMission(mission);mission.optimalProgram=solved?.program||primitiveProgramFromRoute(route,startDir);mission.optimalMoves=mission.optimalProgram.length;mission.queueLimit=Math.max(10,Math.min(30,mission.optimalMoves+(profile==='normal'?8:profile==='hard'?5:3)));
  if(mode==='debug')mission.debugProgram=makeBuggyProgram(mission.optimalProgram,hashSeed(mission.id,'bug'));
  mission.title=mode==='debug'?'Debug Glorp\'s Code':switchCell?'Switch Circuit':'Battery Rescue';
  mission.prompt=mode==='debug'?'Glorp changed one of the instructions. Repair the program and get the robot home.':switchCell?'Collect the batteries, step on the switch, then reach the charging pad.':'Collect every battery, then reach the charging pad.';
  return mission;
}

function makeBuggyProgram(program,seed){const copy=[...program];if(!copy.length)return ['L'];const rand=rng(seed),indices=copy.map((x,i)=>['F','L','R'].includes(x)?i:-1).filter(i=>i>=0),idx=indices[Math.floor(rand()*indices.length)];const original=copy[idx],choices=['F','L','R'].filter(x=>x!==original);copy[idx]=choices[Math.floor(rand()*choices.length)];return copy;}

export function createRobotMission(options={}){return makeMission(options);}

function batteryMaskFor(mission,row,col,mask){const i=mission.batteries.findIndex(([r,c])=>r===row&&c===col);return i>=0?mask|(1<<i):mask;}
function isObstacle(mission,row,col){return mission.obstacles.some(([r,c])=>r===row&&c===col);}
function isDoor(mission,row,col){return mission.doorCell?.[0]===row&&mission.doorCell?.[1]===col;}
function isSwitch(mission,row,col){return mission.switchCell?.[0]===row&&mission.switchCell?.[1]===col;}
function allBatteryMask(mission){return (1<<mission.batteries.length)-1;}
function stateKey(s){return `${s.row},${s.col},${s.dir},${s.switchOn?1:0},${s.batteryMask}`;}
function stepState(mission,state,action){const next={...state};if(action==='L'){next.dir=(next.dir+3)%4;return {ok:true,state:next,event:'turn'};}if(action==='R'){next.dir=(next.dir+1)%4;return {ok:true,state:next,event:'turn'};}if(action!=='F')return {ok:false,state:next,event:'invalid'};const [dr,dc]=DIRS[next.dir],row=next.row+dr,col=next.col+dc;if(row<0||col<0||row>=mission.size||col>=mission.size)return {ok:false,state:next,event:'blocked',blockedBy:'edge'};if(isObstacle(mission,row,col))return {ok:false,state:next,event:'blocked',blockedBy:'obstacle'};if(isDoor(mission,row,col)&&!next.switchOn)return {ok:false,state:next,event:'blocked',blockedBy:'door'};next.row=row;next.col=col;next.batteryMask=batteryMaskFor(mission,row,col,next.batteryMask);if(isSwitch(mission,row,col))next.switchOn=true;return {ok:true,state:next,event:'move'};}

export function initialRobotState(mission){return {row:mission.start.row,col:mission.start.col,dir:mission.start.dir,switchOn:false,batteryMask:batteryMaskFor(mission,mission.start.row,mission.start.col,0)};}
export function isRobotMissionComplete(mission,state){return state.row===mission.goal[0]&&state.col===mission.goal[1]&&state.batteryMask===allBatteryMask(mission);}
export function applyRobotCommand(mission,state,command){return stepState(mission,state,command);}
export function robotBatteryCount(mission,state){let count=0;for(let i=0;i<mission.batteries.length;i++)if(state.batteryMask&(1<<i))count++;return count;}

export function solveRobotMission(mission){const start=initialRobotState(mission),queue=[start],seen=new Set([stateKey(start)]),parent=new Map(),actionMap=new Map();let goal=null;while(queue.length){const current=queue.shift();if(isRobotMissionComplete(mission,current)){goal=current;break;}for(const action of ['F','L','R']){const result=stepState(mission,current,action);if(!result.ok)continue;const k=stateKey(result.state);if(seen.has(k))continue;seen.add(k);queue.push(result.state);parent.set(k,stateKey(current));actionMap.set(k,action);}}
  if(!goal)return null;const program=[];let k=stateKey(goal),startKey=stateKey(start);while(k!==startKey){program.push(actionMap.get(k));k=parent.get(k);}program.reverse();return {program,moves:program.length,state:goal};}

export function simulateRobotProgram(mission,program=[]){let state=initialRobotState(mission),crashed=false,steps=0;const expanded=expandRobotProgram(program),events=[];for(const action of expanded){const result=stepState(mission,state,action);steps++;events.push({action,result:{...result,state:{...result.state}}});if(!result.ok){crashed=true;break;}state=result.state;if(isRobotMissionComplete(mission,state))break;}return {state,crashed,complete:isRobotMissionComplete(mission,state),steps,expanded,events};}

export function robotStars({crashes=0,failedRuns=0,hintsUsed=0,executedMoves=Infinity,optimalMoves=Infinity}={}){const mistakes=crashes+failedRuns;if(hintsUsed>0)return mistakes===0?2:1;if(mistakes===0&&executedMoves<=optimalMoves+1)return 3;if(mistakes<=1)return 2;return 1;}

export function validateRobotMission(mission){if(!mission||!Number.isInteger(mission.size)||!mission.start||!Array.isArray(mission.goal))return false;const n=mission.size,inBounds=([r,c])=>r>=0&&c>=0&&r<n&&c<n;const points=[[mission.start.row,mission.start.col],mission.goal,...mission.batteries,...mission.obstacles];if(mission.switchCell)points.push(mission.switchCell);if(mission.doorCell)points.push(mission.doorCell);if(!points.every(inBounds))return false;const obstacleSet=new Set(mission.obstacles.map(([r,c])=>key(r,c)));if(obstacleSet.has(key(mission.start.row,mission.start.col))||obstacleSet.has(key(...mission.goal)))return false;if(mission.batteries.some(([r,c])=>obstacleSet.has(key(r,c))))return false;if(mission.doorCell&&obstacleSet.has(key(...mission.doorCell)))return false;if(mission.switchCell&&obstacleSet.has(key(...mission.switchCell)))return false;const solved=solveRobotMission(mission);return Boolean(solved&&solved.program.length&&simulateRobotProgram(mission,solved.program).complete);}

export function robotDirectionName(dir=0){return DIR_NAMES[((Number(dir)||0)%4+4)%4];}
export function robotBoardSizeForGrade(grade=3){return boardSizeForGrade(grade);}
