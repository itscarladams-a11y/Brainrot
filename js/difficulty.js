export const DIFFICULTY_PROFILES = Object.freeze({
  normal: Object.freeze({id:'normal',label:'NORMAL',icon:'🧠',start:0,min:0,max:2,description:'Build your foundation, then level up as you succeed.'}),
  hard: Object.freeze({id:'hard',label:'HARD',icon:'⚡',start:1,min:1,max:2,description:'Start tougher and stay in the upper half of your grade.'}),
  extreme: Object.freeze({id:'extreme',label:'EXTREME',icon:'🔥',start:2,min:2,max:2,description:'The hardest grade-appropriate questions with minimal easing.'})
});

export function difficultyProfile(id='normal'){
  return DIFFICULTY_PROFILES[id]||DIFFICULTY_PROFILES.normal;
}

export function clampDifficultyToProfile(value,profileId='normal'){
  const p=difficultyProfile(profileId);
  return Math.max(p.min,Math.min(p.max,Number(value)||0));
}

export function questionDifficultyFor({profileId='normal',index=0,current=0,adaptive=null}={}){
  const p=difficultyProfile(profileId);
  if(p.id==='normal' && Number(index)<2)return 0;
  if(p.id==='extreme')return 2;
  return clampDifficultyToProfile(adaptive==null?current:adaptive,p.id);
}

export function nextProfileDifficulty(current,recentResults=[],profileId='normal'){
  const p=difficultyProfile(profileId);
  if(p.id==='extreme')return 2;
  const window=recentResults.slice(-4);
  if(window.length<4)return clampDifficultyToProfile(current,p.id);
  const accuracy=window.filter(Boolean).length/window.length;
  let next=Number(current)||0;
  if(p.id==='normal'){
    if(accuracy===1)next+=1;
    else if(accuracy<=.5)next-=1;
  }else{
    if(accuracy>=.75)next+=1;
    else if(accuracy<=.25)next-=1;
  }
  return clampDifficultyToProfile(next,p.id);
}
