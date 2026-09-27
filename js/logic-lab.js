export const logicSupplyBank = [
  {id:'pencil',name:'Pencil',icon:'✏️'},
  {id:'paperclip',name:'Paperclip',icon:'📎'},
  {id:'ruler',name:'Ruler',icon:'📏'},
  {id:'notebook',name:'Notebook',icon:'📓'},
  {id:'scissors',name:'Scissors',icon:'✂️'},
  {id:'crayons',name:'Crayons',icon:'🖍️'},
  {id:'calculator',name:'Calculator',icon:'🧮'}
];

const BASE_BOARDS = {"4":[{"solution":[2,0,3,1],"regions":[[1,0,0,0],[1,3,0,2],[1,3,2,2],[3,3,2,2]]},{"solution":[1,3,0,2],"regions":[[1,0,0,1],[1,1,1,1],[2,1,3,1],[2,3,3,3]]},{"solution":[2,0,3,1],"regions":[[1,0,0,0],[1,1,0,2],[3,3,3,2],[3,3,3,2]]},{"solution":[1,3,0,2],"regions":[[0,0,0,1],[2,0,1,1],[2,2,1,3],[2,2,3,3]]},{"solution":[2,0,3,1],"regions":[[1,0,0,0],[1,1,1,0],[1,3,2,2],[1,3,3,3]]},{"solution":[2,0,3,1],"regions":[[1,0,0,0],[1,1,0,2],[3,1,2,2],[3,3,3,3]]}],"5":[{"solution":[2,0,3,1,4],"regions":[[1,0,0,2,2],[1,1,0,2,2],[3,3,0,2,2],[3,3,3,3,2],[3,3,3,3,4]]},{"solution":[1,3,0,2,4],"regions":[[0,0,1,1,1],[2,0,0,1,1],[2,2,2,1,1],[2,3,3,3,4],[2,3,4,4,4]]},{"solution":[3,0,2,4,1],"regions":[[1,0,0,0,0],[1,2,2,0,0],[1,2,2,0,0],[1,4,2,0,3],[4,4,2,2,3]]},{"solution":[0,3,1,4,2],"regions":[[0,0,1,1,1],[0,1,1,1,1],[0,2,1,3,3],[0,4,3,3,3],[4,4,4,3,3]]},{"solution":[0,2,4,1,3],"regions":[[0,0,1,1,1],[1,1,1,2,2],[3,3,2,2,2],[3,3,3,4,4],[3,3,3,4,4]]},{"solution":[4,1,3,0,2],"regions":[[1,1,1,2,0],[1,1,1,2,0],[1,2,2,2,2],[3,4,4,2,2],[3,3,4,2,2]]}],"6":[{"solution":[5,2,4,1,3,0],"regions":[[1,1,2,2,2,0],[1,1,1,2,2,2],[1,1,2,2,2,2],[5,3,2,2,4,2],[5,5,4,4,4,4],[5,4,4,4,4,4]]},{"solution":[0,2,4,1,3,5],"regions":[[0,1,1,1,1,2],[3,1,1,2,2,2],[3,3,1,1,2,2],[3,3,2,2,2,4],[3,3,4,4,4,4],[3,3,4,4,5,5]]},{"solution":[4,2,5,1,3,0],"regions":[[1,0,0,0,0,2],[1,1,1,1,2,2],[1,4,4,1,2,2],[5,3,4,1,2,2],[5,3,4,4,2,2],[5,5,4,4,2,2]]},{"solution":[0,2,4,1,5,3],"regions":[[0,0,1,1,2,2],[1,1,1,2,2,2],[1,3,3,2,2,4],[3,3,2,2,2,4],[3,3,3,2,4,4],[3,3,5,5,4,4]]},{"solution":[4,1,3,5,2,0],"regions":[[1,1,1,0,0,3],[1,1,1,2,2,3],[1,1,4,2,3,3],[1,1,4,4,3,3],[5,4,4,4,4,3],[5,5,5,4,3,3]]},{"solution":[2,0,4,1,3,5],"regions":[[0,0,0,2,2,2],[1,1,0,0,2,2],[1,3,0,2,2,2],[3,3,3,2,2,2],[3,3,4,4,5,5],[3,3,4,5,5,5]]}],"7":[{"solution":[0,2,5,1,3,6,4],"regions":[[0,1,1,1,1,2,2],[1,1,1,1,2,2,2],[3,3,1,2,2,2,2],[3,3,3,2,2,2,2],[3,3,3,4,2,2,5],[3,3,6,5,5,5,5],[3,3,6,6,6,5,5]]},{"solution":[6,1,3,5,2,0,4],"regions":[[1,1,1,1,3,0,0],[4,1,1,3,3,3,3],[4,4,4,2,2,3,3],[4,4,4,3,3,3,4],[5,5,4,4,4,4,4],[5,6,6,6,6,6,6],[6,6,6,6,6,6,6]]},{"solution":[0,5,1,4,2,6,3],"regions":[[0,0,1,1,1,1,1],[0,0,0,1,1,1,1],[0,2,2,2,1,1,1],[2,2,2,3,3,1,1],[2,2,4,4,3,3,5],[2,2,6,3,3,3,5],[2,6,6,6,6,5,5]]},{"solution":[2,0,3,6,4,1,5],"regions":[[1,0,0,0,2,2,2],[1,1,0,0,2,2,2],[1,0,0,2,2,2,2],[1,5,5,2,4,3,3],[1,5,5,2,4,4,6],[5,5,5,5,6,6,6],[5,5,5,5,6,6,6]]},{"solution":[2,4,6,1,5,0,3],"regions":[[0,0,0,1,1,1,1],[0,0,1,1,1,1,1],[0,0,0,0,1,2,2],[3,3,4,4,4,4,2],[3,3,6,4,4,4,4],[5,3,6,6,4,4,4],[3,3,6,6,6,4,4]]},{"solution":[0,2,4,1,5,3,6],"regions":[[0,0,0,0,0,0,0],[0,0,1,1,2,2,2],[0,0,3,2,2,2,6],[3,3,3,3,2,4,6],[3,3,3,3,3,4,6],[3,3,5,5,5,5,6],[3,3,5,5,5,6,6]]}]};


export function logicBoardSizeForGrade(grade=3){
  const g=Math.max(1,Math.min(6,Number(grade)||3));
  if(g<=2)return 4;
  if(g<=4)return 5;
  if(g===5)return 6;
  return 7;
}

function transformCoord(r,c,n,variant){
  let rr=r,cc=c;
  if(variant>=4) cc=n-1-cc;
  const turns=variant%4;
  for(let i=0;i<turns;i++) [rr,cc]=[cc,n-1-rr];
  return [rr,cc];
}

function transformMatrix(matrix,variant){
  const n=matrix.length,out=Array.from({length:n},()=>Array(n).fill(0));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const [rr,cc]=transformCoord(r,c,n,variant);
    out[rr][cc]=matrix[r][c];
  }
  return out;
}

function transformedSolution(solution,variant){
  const n=solution.length,positions=[];
  for(let r=0;r<n;r++)positions.push(transformCoord(r,solution[r],n,variant));
  positions.sort((a,b)=>a[0]-b[0]);
  return positions.map(([,c])=>c);
}

function deterministicShuffle(items,seed){
  const a=[...items];
  let x=(seed>>>0)||1;
  const rand=()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};
  for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

export function createLogicLevel({grade=3,stage=1}={}){
  const size=logicBoardSizeForGrade(grade),bank=BASE_BOARDS[String(size)];
  const safeStage=Math.max(1,Number(stage)||1),baseIndex=(safeStage-1)%bank.length,variant=Math.floor((safeStage-1)/bank.length)%8;
  const base=bank[baseIndex],regions=transformMatrix(base.regions,variant),solution=transformedSolution(base.solution,variant);
  const supplyPool=deterministicShuffle(logicSupplyBank,grade*1000+safeStage*37).slice(0,size);
  const suppliesByRow=Object.fromEntries(solution.map((c,r)=>[r,{...supplyPool[r],row:r,col:c}]));
  return {id:`g${grade}-s${safeStage}`,grade:Number(grade),stage:safeStage,size,regions,solution,suppliesByRow,variant,baseIndex};
}

export function isLogicSolutionCell(level,row,col){
  return Number(level?.solution?.[row])===Number(col);
}

export function logicRegionEdges(level,row,col){
  const n=level.size,region=level.regions[row][col];
  return {
    top:row===0||level.regions[row-1][col]!==region,
    right:col===n-1||level.regions[row][col+1]!==region,
    bottom:row===n-1||level.regions[row+1][col]!==region,
    left:col===0||level.regions[row][col-1]!==region
  };
}

export function countLogicSolutions(level,limit=2){
  const n=level.size,regions=level.regions;
  let count=0;
  function walk(row,usedCols,usedRegions,lastCol){
    if(count>=limit)return;
    if(row===n){count++;return;}
    for(let col=0;col<n;col++){
      if(usedCols.has(col))continue;
      if(lastCol!==null&&Math.abs(col-lastCol)<=1)continue;
      const region=regions[row][col];
      if(usedRegions.has(region))continue;
      usedCols.add(col);usedRegions.add(region);
      walk(row+1,usedCols,usedRegions,col);
      usedCols.delete(col);usedRegions.delete(region);
    }
  }
  walk(0,new Set(),new Set(),null);
  return count;
}

export function validateLogicLevel(level){
  const n=level.size,cols=new Set(),regions=new Set();
  for(let row=0;row<n;row++){
    const col=level.solution[row];
    if(cols.has(col))return false;
    if(row>0&&Math.abs(col-level.solution[row-1])<=1)return false;
    cols.add(col);regions.add(level.regions[row][col]);
  }
  return cols.size===n&&regions.size===n&&countLogicSolutions(level,2)===1;
}

export function logicStars({wrongSearches=0,hintsUsed=0}={}){
  if(hintsUsed>0)return wrongSearches===0?2:1;
  if(wrongSearches===0)return 3;
  if(wrongSearches===1)return 2;
  return 1;
}
