const VISUAL_SETS=[
  ['🔵','🟡','🟣','🟢'],
  ['▲','●','■','◆'],
  ['🍎','✏️','📘','⭐'],
  ['⬆️','➡️','⬇️','⬅️']
];

function hashSeed(...parts){
  let h=2166136261>>>0;
  for(const part of parts){
    for(const ch of String(part)){
      h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;
    }
  }
  return h>>>0;
}
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function pick(rand,arr){return arr[Math.floor(rand()*arr.length)];}
function shuffle(rand,arr){const out=[...arr];for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function uniqueChoices(rand,answer,candidates){const list=[String(answer),...candidates.map(String)].filter((v,i,a)=>a.indexOf(v)===i);let n=1;while(list.length<4){const fallback=Number(answer);list.push(Number.isFinite(fallback)?String(fallback+n):`Option ${n}`);n++;}return shuffle(rand,list.slice(0,4));}
function makeNumeric({rand,start,steps,length=6,missingIndex,rule,skill='number-pattern'}){
  const values=[start];
  for(let i=1;i<length;i++)values.push(steps(values[i-1],i));
  const answer=values[missingIndex];
  const spread=Math.max(1,Math.abs(Number(values.at(-1))-Number(values[0]))/Math.max(1,length-1));
  const delta=Math.max(1,Math.round(spread));
  const choices=uniqueChoices(rand,answer,[Number(answer)+delta,Number(answer)-delta,Number(answer)+delta*2,Number(answer)-delta*2]);
  return {kind:'number',sequence:values.map(String),missingIndex,answer:String(answer),choices,ruleHint:rule,explanation:`${rule} The missing number is ${answer}.`,skill};
}
function makeRepeat({rand,pattern,length=7,missingIndex,rule='The shapes repeat in the same order.',skill='visual-pattern'}){
  const seq=Array.from({length},(_,i)=>pattern[i%pattern.length]);
  const answer=seq[missingIndex];
  const distractors=VISUAL_SETS.flat().filter(x=>x!==answer);
  return {kind:'visual',sequence:seq,missingIndex,answer,choices:uniqueChoices(rand,answer,shuffle(rand,distractors).slice(0,5)),ruleHint:rule,explanation:`${rule} The missing tile is ${answer}.`,skill};
}
function makeRotation({rand,length=7,missingIndex}){
  const seq=Array.from({length},(_,i)=>['⬆️','➡️','⬇️','⬅️'][i%4]);
  const answer=seq[missingIndex];
  return {kind:'rotation',sequence:seq,missingIndex,answer,choices:shuffle(rand,['⬆️','➡️','⬇️','⬅️']),ruleHint:'Each arrow turns one quarter-turn clockwise.',explanation:`Each arrow turns one quarter-turn clockwise. The missing arrow is ${answer}.`,skill:'mental-rotation'};
}
function missingIndexFor(rand,length,profile){
  if(profile==='normal')return length-1;
  if(profile==='hard')return Math.max(2,length-2);
  return 1+Math.floor(rand()*(length-2));
}
function gradeBand(grade){return Math.max(1,Math.min(6,Number(grade)||1));}

export function patternRoundCountForGrade(grade){return gradeBand(grade)<=2?6:8;}

export function createPatternPuzzle({grade=3,stage=1,round=0,difficultyProfile='normal'}={}){
  grade=gradeBand(grade);const profile=['normal','hard','extreme'].includes(difficultyProfile)?difficultyProfile:'normal';
  const seed=hashSeed('pattern',grade,stage,round,profile),rand=rng(seed),length=grade<=2?6:7,missingIndex=missingIndexFor(rand,length,profile);
  const choices=[];
  if(grade===1){
    choices.push(()=>makeRepeat({rand,pattern:pick(rand,[['🔵','🟡'],['▲','●'],['🍎','✏️']]),length,missingIndex}));
    choices.push(()=>makeNumeric({rand,start:1+Math.floor(rand()*3),steps:(v)=>v+1,length,missingIndex,rule:'Add 1 each time.'}));
    if(profile!=='normal')choices.push(()=>makeRepeat({rand,pattern:pick(rand,[['🔵','🔵','🟡'],['▲','●','●']]),length,missingIndex,rule:'The three-tile group repeats.'}));
  }else if(grade===2){
    choices.push(()=>makeRepeat({rand,pattern:pick(rand,[['🔵','🟡','🟣'],['▲','●','■']]),length,missingIndex,rule:'The three-tile pattern repeats.'}));
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*4),steps:(v)=>v+2,length,missingIndex,rule:'Add 2 each time.'}));
    choices.push(()=>makeNumeric({rand,start:5+Math.floor(rand()*5),steps:(v)=>v+5,length,missingIndex,rule:'Add 5 each time.'}));
  }else if(grade===3){
    choices.push(()=>makeNumeric({rand,start:3+Math.floor(rand()*5),steps:(v)=>v+3,length,missingIndex,rule:'Add 3 each time.'}));
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*4),steps:(v,i)=>v+(i%2?2:4),length,missingIndex,rule:'The pattern alternates: add 2, then add 4.'}));
    choices.push(()=>makeRotation({rand,length,missingIndex}));
    if(profile==='extreme')choices.push(()=>makeNumeric({rand,start:20+Math.floor(rand()*5),steps:(v)=>v-3,length,missingIndex,rule:'Subtract 3 each time.'}));
  }else if(grade===4){
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*3),steps:(v)=>v*2,length,missingIndex,rule:'Double the number each time.'}));
    choices.push(()=>makeNumeric({rand,start:4+Math.floor(rand()*5),steps:(v,i)=>v+(i%2?5:-2),length,missingIndex,rule:'Alternate: add 5, then subtract 2.'}));
    choices.push(()=>makeRotation({rand,length,missingIndex}));
    choices.push(()=>makeNumeric({rand,start:1+Math.floor(rand()*3),steps:(v,i)=>v+i+1,length,missingIndex,rule:'The amount added grows by 1 each step.'}));
  }else if(grade===5){
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*3),steps:(v)=>v*2,length,missingIndex,rule:'Multiply by 2 each time.'}));
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*2),steps:(v)=>v*3,length,missingIndex,rule:'Multiply by 3 each time.'}));
    choices.push(()=>makeNumeric({rand,start:3+Math.floor(rand()*3),steps:(v,i)=>i%2?v*2:v+3,length,missingIndex,rule:'Alternate: multiply by 2, then add 3.'}));
    choices.push(()=>makeNumeric({rand,start:1+Math.floor(rand()*3),steps:(v,i)=>v+2*i,length,missingIndex,rule:'Add 2 more than the previous jump.'}));
  }else{
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*3),steps:(v)=>v*2+1,length,missingIndex,rule:'Multiply by 2, then add 1.'}));
    choices.push(()=>makeNumeric({rand,start:3+Math.floor(rand()*3),steps:(v,i)=>i%2?v*2:v+4,length,missingIndex,rule:'Alternate: multiply by 2, then add 4.'}));
    choices.push(()=>makeNumeric({rand,start:2+Math.floor(rand()*3),steps:(v,i)=>v+(i*i),length,missingIndex,rule:'Add the next square jump: 1, 4, 9, 16…'}));
    choices.push(()=>makeRotation({rand,length,missingIndex}));
  }
  const puzzle=pick(rand,choices)();
  const display=puzzle.sequence.map((v,i)=>i===puzzle.missingIndex?'?':v);
  return {...puzzle,display,grade,stage,round,profile,id:`g${grade}-s${stage}-r${round}-${profile}-${seed}`,
    prompt:puzzle.missingIndex===puzzle.sequence.length-1?'What comes next?':'What belongs in the missing spot?'};
}

export function patternStars({wrongAttempts=0,hintsUsed=0}={}){
  if(hintsUsed>0)return wrongAttempts<=1?2:1;
  if(wrongAttempts<=1)return 3;
  if(wrongAttempts<=3)return 2;
  return 1;
}

export function validatePatternPuzzle(puzzle){
  if(!puzzle||!Array.isArray(puzzle.sequence)||!Array.isArray(puzzle.choices))return false;
  if(puzzle.missingIndex<0||puzzle.missingIndex>=puzzle.sequence.length)return false;
  if(String(puzzle.sequence[puzzle.missingIndex])!==String(puzzle.answer))return false;
  return puzzle.choices.filter(x=>String(x)===String(puzzle.answer)).length===1;
}
