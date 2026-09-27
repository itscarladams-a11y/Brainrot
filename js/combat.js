const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));

export function createCombatState({playerMaxHp=100,glorpMaxHp=120}={}){
  return {playerMaxHp,glorpMaxHp,playerHp:playerMaxHp,glorpHp:glorpMaxHp,totalDamage:0,totalCounterDamage:0,specials:0};
}

export function comboTier(streak=0){
  const n=Math.max(0,Number(streak)||0);
  if(n>=10)return {id:'special',label:'PROFESSOR SPECIAL',damage:35,particles:28};
  if(n>=5)return {id:'power',label:'POWER ATTACK',damage:20,particles:20};
  if(n>=3)return {id:'combo',label:'COMBO HIT',damage:14,particles:15};
  return {id:'normal',label:'BRAIN HIT',damage:10,particles:10};
}

export function applyCorrectAttack(state,streak=1){
  const tier=comboTier(streak);
  const before=state.glorpHp;
  state.glorpHp=clamp(state.glorpHp-tier.damage,0,state.glorpMaxHp);
  const dealt=before-state.glorpHp;
  state.totalDamage=(state.totalDamage||0)+dealt;
  if(tier.id==='special')state.specials=(state.specials||0)+1;
  return {...tier,dealt,glorpHp:state.glorpHp,knockout:state.glorpHp<=0};
}

export function applyWrongCounter(state,{damage=12,minHp=15}={}){
  const before=state.playerHp;
  state.playerHp=Math.max(minHp,clamp(state.playerHp-damage,0,state.playerMaxHp));
  const dealt=before-state.playerHp;
  state.totalCounterDamage=(state.totalCounterDamage||0)+dealt;
  return {id:'counter',label:state.playerHp<=minHp?'BRAIN SHIELD!':'GLORP COUNTER!',dealt,playerHp:state.playerHp,shielded:state.playerHp<=minHp};
}

export function hpPercent(value,max){return max?clamp(Math.round((value/max)*100),0,100):0;}
