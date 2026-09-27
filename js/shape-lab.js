const BLUEPRINTS=[
  {id:'book',name:"Professor's Book",icon:'📘',size:4,matrix:['AABB','ACBB','ACCD','DDDD']},
  {id:'badge',name:'Academy Badge',icon:'🏅',size:4,matrix:['AAAB','ACBB','CCDB','CDDD']},
  {id:'toolbox',name:"Glorp's Toolbox",icon:'🧰',size:4,matrix:['ABBB','AACB','DDCC','DDCC']},
  {id:'kite',name:'Lab Kite',icon:'🪁',size:4,matrix:['.AA.','.ABB','CCBB','.CDD']},
  {id:'flag',name:'Academy Flag',icon:'🚩',size:4,matrix:['AA..','ABBB','ACCB','DDCC']},

  {id:'rocket',name:"Professor's Rocket",icon:'🚀',size:5,matrix:['..A..','.AAA.','.BBC.','DDBCC','D...C']},
  {id:'flask',name:'Experiment Flask',icon:'🧪',size:5,matrix:['..A..','..A..','.BBB.','CCBBD','CC.DD']},
  {id:'robot',name:'Classroom Robot',icon:'🤖',size:5,matrix:['.AAA.','BBACC','.BDD.','.E.F.','EE.FF']},
  {id:'backpack',name:"Glorp's Backpack",icon:'🎒',size:5,matrix:['.AAA.','AABBB','CCBDE','CCBDE','.DDDE']},

  {id:'dinosaur',name:'Lab Dinosaur',icon:'🦖',size:6,matrix:['.AAA..','BBBA..','.BCCC.','..CDD.','..E.D.','.EEEDD']},
  {id:'satellite',name:'Science Satellite',icon:'🛰️',size:6,matrix:['AA..BB','AA..BB','.CCDD.','..CD..','.EEFF.','EE..FF']},
  {id:'machine',name:"Professor's Machine",icon:'⚙️',size:6,matrix:['.AABB.','AACBBB','DCCCEE','DDFFEE','.GGFF.','.GGG..']},
  {id:'spaceship',name:"Glorp's Spaceship",icon:'🛸',size:6,matrix:['..AA..','.AABB.','CCBBDD','.EEFF.','EE..FF','.E..F.']}
];

function hashSeed(...parts){
  let h=2166136261>>>0;
  for(const part of parts)for(const ch of String(part)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}
  return h>>>0;
}
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function shuffle(rand,arr){const out=[...arr];for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function gradeBand(grade){return Math.max(1,Math.min(6,Number(grade)||1));}
function boardSizeForGrade(grade){const g=gradeBand(grade);return g<=2?4:g<=4?5:6;}
function key(row,col){return `${row}:${col}`;}

export function normalizeShapeCells(cells){
  if(!cells?.length)return [];
  const minRow=Math.min(...cells.map(([r])=>r)),minCol=Math.min(...cells.map(([,c])=>c));
  return cells.map(([r,c])=>[r-minRow,c-minCol]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
}

export function rotateShapeCells(cells,turns=0){
  let out=normalizeShapeCells(cells),count=((Number(turns)||0)%4+4)%4;
  while(count--){out=normalizeShapeCells(out.map(([r,c])=>[c,-r]));}
  return out;
}

function transformCoord(r,c,n,variant){
  let rr=r,cc=c;
  if(variant>=4)cc=n-1-cc;
  const turns=variant%4;
  for(let i=0;i<turns;i++) [rr,cc]=[cc,n-1-rr];
  return [rr,cc];
}

function parseBlueprint(blueprint,variant=0){
  const groups=new Map(),target=[];
  blueprint.matrix.forEach((row,r)=>[...row].forEach((label,c)=>{
    if(label==='.')return;
    const cell=transformCoord(r,c,blueprint.size,variant);target.push(cell);
    if(!groups.has(label))groups.set(label,[]);groups.get(label).push(cell);
  }));
  const pieces=[...groups.entries()].map(([id,cells],index)=>({id,cells:normalizeShapeCells(cells),solutionCells:cells.sort((a,b)=>a[0]-b[0]||a[1]-b[1]),colorIndex:index}));
  return {targetCells:target.sort((a,b)=>a[0]-b[0]||a[1]-b[1]),pieces};
}

function profileStartRotation(rand,profile,index){
  if(profile==='normal')return index===0?0:(rand()<.48?0:(rand()<.5?1:3));
  if(profile==='hard')return Math.floor(rand()*4);
  return (1+Math.floor(rand()*3))%4;
}

export function createShapePuzzle({grade=3,stage=1,difficultyProfile='normal'}={}){
  const g=gradeBand(grade),size=boardSizeForGrade(g),safeStage=Math.max(1,Number(stage)||1),profile=['normal','hard','extreme'].includes(difficultyProfile)?difficultyProfile:'normal';
  const eligible=BLUEPRINTS.filter(b=>b.size===size),blueprint=eligible[(safeStage-1)%eligible.length],variant=Math.floor((safeStage-1)/eligible.length)%8;
  const parsed=parseBlueprint(blueprint,variant),rand=rng(hashSeed(g,safeStage,profile,blueprint.id,variant));
  const pieces=shuffle(rand,parsed.pieces).map((piece,index)=>({...piece,startRotation:profileStartRotation(rand,profile,index)}));
  return {
    id:`shape-g${g}-s${safeStage}-${profile}`,
    grade:g,stage:safeStage,profile,size,variant,
    blueprintId:blueprint.id,name:blueprint.name,icon:blueprint.icon,
    prompt:`Rebuild ${blueprint.name}.`,targetCells:parsed.targetCells,pieces
  };
}

export function shapePlacementCells(piece,rotation=0,anchorRow=0,anchorCol=0){
  return rotateShapeCells(piece?.cells||[],rotation).map(([r,c])=>[r+Number(anchorRow),c+Number(anchorCol)]);
}

export function canPlaceShapePiece(puzzle,placements,piece,rotation,row,col){
  if(!puzzle||!piece)return {ok:false,cells:[]};
  const cells=shapePlacementCells(piece,rotation,row,col),target=new Set(puzzle.targetCells.map(([r,c])=>key(r,c))),occupied=new Set();
  for(const [pieceId,placement] of Object.entries(placements||{})){
    if(pieceId===piece.id)continue;
    for(const [r,c] of placement.cells||[])occupied.add(key(r,c));
  }
  const ok=cells.length>0&&cells.every(([r,c])=>r>=0&&c>=0&&r<puzzle.size&&c<puzzle.size&&target.has(key(r,c))&&!occupied.has(key(r,c)));
  return {ok,cells};
}

export function isShapePuzzleComplete(puzzle,placements){
  if(!puzzle)return false;
  const filled=new Set();
  for(const placement of Object.values(placements||{}))for(const [r,c] of placement.cells||[])filled.add(key(r,c));
  const target=new Set(puzzle.targetCells.map(([r,c])=>key(r,c)));
  return filled.size===target.size&&[...target].every(k=>filled.has(k))&&puzzle.pieces.every(piece=>Boolean(placements?.[piece.id]));
}

export function shapeStars({wrongPlacements=0,hintsUsed=0}={}){
  if(hintsUsed>0)return wrongPlacements<=1?2:1;
  if(wrongPlacements<=1)return 3;
  if(wrongPlacements<=3)return 2;
  return 1;
}

function connected(cells){
  if(!cells.length)return false;
  const set=new Set(cells.map(([r,c])=>key(r,c))),seen=new Set([key(...cells[0])]),queue=[cells[0]];
  while(queue.length){const [r,c]=queue.shift();for(const [rr,cc] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]){const k=key(rr,cc);if(set.has(k)&&!seen.has(k)){seen.add(k);queue.push([rr,cc]);}}}
  return seen.size===cells.length;
}

export function validateShapePuzzle(puzzle){
  if(!puzzle||!Array.isArray(puzzle.targetCells)||!Array.isArray(puzzle.pieces)||!puzzle.pieces.length)return false;
  const targetKeys=puzzle.targetCells.map(([r,c])=>key(r,c)),target=new Set(targetKeys);if(target.size!==targetKeys.length)return false;
  const solution=new Set();
  for(const piece of puzzle.pieces){
    if(!piece.cells?.length||!piece.solutionCells?.length||piece.cells.length!==piece.solutionCells.length||!connected(piece.cells))return false;
    for(const [r,c] of piece.solutionCells){const k=key(r,c);if(solution.has(k)||!target.has(k))return false;solution.add(k);}
  }
  return solution.size===target.size&&[...target].every(k=>solution.has(k));
}

export function shapePieceCountForGrade(grade=3){
  const sample=createShapePuzzle({grade,stage:1});return sample.pieces.length;
}

export function shapeBlueprintCountForGrade(grade=3){return BLUEPRINTS.filter(b=>b.size===boardSizeForGrade(grade)).length;}
