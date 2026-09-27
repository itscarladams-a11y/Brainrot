import { VOCAB, READING, SPELLING, GRAMMAR, SCIENCE, GEO, GENERAL } from './curriculum.js';
import { VOCAB_EXTRA, READING_EXTRA, SPELLING_EXTRA, GRAMMAR_EXTRA, SCIENCE_EXTRA, GEO_EXTRA, GENERAL_EXTRA } from './content-depth.js';
import { resolveQuestionSkill } from './skills.js';
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
const randInt=(lo,hi,rng=Math.random)=>Math.floor(rng()*(hi-lo+1))+lo;
const pick=(arr,rng=Math.random)=>arr[Math.floor(rng()*arr.length)];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const SUBJECT_KEYS=['math','time','calendar','vocabulary','reading','spelling','grammar','science','geography','general'];

function shuffle(list,rng=Math.random){
  const a=[...list];
  for(let i=a.length-1;i>0;i--){const j=randInt(0,i,rng);[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function normalize(v){return typeof v==='number'?String(v):String(v).trim();}
function makeQuestion({subject,skill,prompt,answer,choices,grade,difficulty,explanation,visualType='text',visualData=null,glorpAnswer=null,audioWord=null}){
  const uniq=[]; const seen=new Set();
  for(const c of choices){const k=normalize(c); if(!seen.has(k)){seen.add(k);uniq.push(c);}}
  if(!seen.has(normalize(answer))) uniq.unshift(answer);
  if(uniq.length<4) throw new Error(`Question ${subject}/${skill} has fewer than 4 unique choices`);
  return {subject,skill,prompt,answer,choices:uniq.slice(0,4),grade,difficulty,explanation,visualType,visualData,glorpAnswer,audioWord};
}
function numericChoices(answer,candidates,rng=Math.random){
  const set=new Set([answer]);
  for(const c of candidates){if(Number.isFinite(c)&&c>=0)set.add(c);}
  let guard=0;
  while(set.size<4&&guard++<50){const spread=Math.max(3,Math.ceil(Math.abs(answer)*.22));set.add(Math.max(0,answer+randInt(-spread,spread,rng)));}
  return shuffle([...set].slice(0,4),rng);
}
function numericQ(prompt,answer,mistakes,meta,rng){
  return makeQuestion({...meta,prompt,answer,choices:numericChoices(answer,mistakes,rng)});
}

function mathQuestion(grade,skill,d,rng){
  const subject='math';
  if(grade===1){
    const max=[10,15,20][d]; const op=skill==='subtraction'?'subtraction':skill==='addition'?'addition':pick(['addition','subtraction'],rng);
    if(op==='subtraction'){const a=randInt(5,max,rng),b=randInt(0,a,rng),ans=a-b;return numericQ(`${a} − ${b} = ?`,ans,[ans+1,ans-1,a+b,Math.abs(b-a)+2],{subject,skill:op,grade,difficulty:d,explanation:`${a} minus ${b} equals ${ans}.`},rng);}
    const a=randInt(0,max,rng),b=randInt(0,max-a,rng),ans=a+b;return numericQ(`${a} + ${b} = ?`,ans,[ans+1,ans-1,Math.abs(a-b),ans+2],{subject,skill:op,grade,difficulty:d,explanation:`${a} plus ${b} equals ${ans}.`},rng);
  }
  if(grade===2){
    const max=[40,70,100][d]; const op=skill==='subtraction'?'subtraction':skill==='addition'?'addition':pick(['addition','subtraction'],rng);
    if(op==='subtraction'){const a=randInt(20,max,rng),b=randInt(1,a,rng),ans=a-b;return numericQ(`${a} − ${b} = ?`,ans,[ans+10,ans-10,ans+1,Math.abs(b-a)],{subject,skill:op,grade,difficulty:d,explanation:`Start at ${a} and take away ${b}. The answer is ${ans}.`},rng);}
    const a=randInt(5,max-5,rng),b=randInt(1,max-a,rng),ans=a+b;return numericQ(`${a} + ${b} = ?`,ans,[ans+10,ans-10,ans+1,Math.abs(a-b)],{subject,skill:op,grade,difficulty:d,explanation:`${a} plus ${b} equals ${ans}.`},rng);
  }
  const allowed=['multiplication','division','addition','subtraction','decimal-addition','decimal-subtraction','fraction-equivalent','fraction-of-number','percent-of-number'];
  let pool=grade===3?['multiplication','division','multiplication','addition','subtraction']:
    grade===4?['multiplication','division','multiplication','division','addition','subtraction']:
    grade===5?['multiplication','division','addition','subtraction','decimal-addition','decimal-subtraction','fraction-equivalent','fraction-of-number']:
    ['multiplication','division','decimal-addition','decimal-subtraction','fraction-equivalent','fraction-of-number','percent-of-number','multiplication','division'];
  const op=skill!=='mixed'&&allowed.includes(skill)?skill:pick(pool,rng);
  if(op==='decimal-addition'||op==='decimal-subtraction'){
    const scale=grade===5?10:100;
    const aInt=randInt(grade===5?10:100,grade===5?900:9000,rng),bInt=randInt(1,op==='decimal-subtraction'?aInt:grade===5?500:5000,rng);
    const raw=op==='decimal-addition'?aInt+bInt:aInt-bInt,ans=raw/scale,a=aInt/scale,b=bInt/scale;
    const prompt=`${a.toFixed(grade===5?1:2)} ${op==='decimal-addition'?'+':'−'} ${b.toFixed(grade===5?1:2)} = ?`;
    return numericQ(prompt,ans,[ans+(1/scale),ans-(1/scale),ans+(10/scale),Math.abs(a-b)],{subject,skill:op,grade,difficulty:d,explanation:`Align the decimal points and ${op==='decimal-addition'?'add':'subtract'}. The answer is ${ans}.`},rng);
  }
  if(op==='fraction-equivalent'){
    const den=pick(grade===5?[2,3,4,5,6,8]:[3,4,5,6,8,10,12],rng),num=randInt(1,den-1,rng),factor=pick([2,3,4],rng),n=num*factor,dd=den*factor,answer=`${n}/${dd}`;
    const set=new Set([answer]);
    for(const c of [`${n+1}/${dd}`,`${Math.max(1,n-1)}/${dd}`,`${n}/${dd+1}`,`${n+factor}/${dd}`,`${num}/${dd}`,`${num+1}/${den}`]){if(c!==answer)set.add(c);if(set.size>=4)break;}
    return makeQuestion({subject,skill:op,prompt:`Which fraction is equivalent to ${num}/${den}?`,answer,choices:shuffle([...set].slice(0,4),rng),grade,difficulty:d,explanation:`Multiply numerator and denominator by ${factor}: ${num}/${den} = ${answer}.`});
  }
  if(op==='fraction-of-number'){
    const den=pick(grade===5?[2,3,4,5,6]:[2,3,4,5,6,8,10],rng),num=randInt(1,den-1,rng),unit=randInt(2,grade===5?12:20,rng),whole=den*unit,answer=num*unit;
    return numericQ(`What is ${num}/${den} of ${whole}?`,answer,[answer+unit,Math.max(0,answer-unit),whole/den,whole-num],{subject,skill:op,grade,difficulty:d,explanation:`One ${den}th of ${whole} is ${unit}; ${num} parts make ${answer}.`},rng);
  }
  if(op==='percent-of-number'){
    const pct=pick([10,20,25,50,75],rng),base=pick([20,40,60,80,100,120,160,200],rng),answer=base*pct/100;
    return numericQ(`What is ${pct}% of ${base}?`,answer,[base,base*(100-pct)/100,answer+10,Math.max(0,answer-10)],{subject,skill:op,grade,difficulty:d,explanation:`${pct}% of ${base} is ${answer}.`},rng);
  }
  if(op==='multiplication'){
    if(grade===3||d===0){const maxFactor=grade===3?[5,8,10][d]:10;const a=randInt(2,maxFactor,rng),b=randInt(2,maxFactor,rng),ans=a*b;return numericQ(`${a} × ${b} = ?`,ans,[a*(b-1),a*(b+1),ans+a,Math.max(0,ans-b)],{subject,skill:op,grade,difficulty:d,explanation:`${a} groups of ${b} make ${ans}.`},rng);}
    const a=randInt(d===1?11:12,d===1?30:40,rng),b=randInt(2,d===1?5:8,rng),ans=a*b;return numericQ(`${a} × ${b} = ?`,ans,[a*(b-1),a*(b+1),ans+10,Math.max(0,ans-10)],{subject,skill:op,grade,difficulty:d,explanation:`${a} multiplied by ${b} equals ${ans}.`},rng);
  }
  if(op==='division'){
    const maxFactor=grade===3?[5,8,10][d]:(d===2?10:8),b=randInt(2,maxFactor,rng),ans=randInt(2,grade===3?maxFactor:(d===2?12:10),rng),a=b*ans;return numericQ(`${a} ÷ ${b} = ?`,ans,[ans-1,ans+1,b,ans+2],{subject,skill:op,grade,difficulty:d,explanation:`${a} split into groups of ${b} gives ${ans} groups.`},rng);
  }
  const max=grade===3?[50,100,150][d]:grade===4?[100,200,300][d]:grade===5?[1000,5000,10000][d]:[5000,20000,100000][d];
  if(op==='subtraction'){const a=randInt(20,max,rng),b=randInt(1,a,rng),ans=a-b;return numericQ(`${a} − ${b} = ?`,ans,[ans+10,ans-10,ans+1,a+b],{subject,skill:op,grade,difficulty:d,explanation:`${a} minus ${b} equals ${ans}.`},rng);}
  const a=randInt(10,max-10,rng),b=randInt(1,max-a,rng),ans=a+b;return numericQ(`${a} + ${b} = ?`,ans,[ans+10,ans-10,ans+1,Math.abs(a-b)],{subject,skill:op,grade,difficulty:d,explanation:`${a} plus ${b} equals ${ans}.`},rng);
}

function timeQuestion(grade,d,rng){
  const subject='time';
  if(grade>=4&&d>=1&&rng()>(grade>=5?.28:.55)){
    const startHour=randInt(1,9,rng),addMinutes=pick(grade>=5?(d===1?[25,35,45,60,75]:[20,35,50,65,90,125]):(d===1?[30,45,60]:[20,30,45,60,90]),rng),startMinute=pick(grade>=5?[0,5,10,15,20,25,30,35,40,45,50,55]:[0,15,30],rng);let total=startHour*60+startMinute+addMinutes;const hour=Math.floor(total/60)%12||12,minute=total%60;const start=`${startHour}:${String(startMinute).padStart(2,'0')}`,ans=`${hour}:${String(minute).padStart(2,'0')}`;
    const optionSet=new Set([ans]);
    const candidates=[`${hour}:${String((minute+15)%60).padStart(2,'0')}`,`${(hour%12)+1}:${String(minute).padStart(2,'0')}`,`${startHour}:${String(startMinute).padStart(2,'0')}`,`${((hour+10)%12)+1}:${String((minute+30)%60).padStart(2,'0')}`,`${hour}:${String((minute+5)%60).padStart(2,'0')}`];
    for(const c of candidates){if(c!==ans)optionSet.add(c);if(optionSet.size>=4)break;}
    const options=shuffle([...optionSet].slice(0,4),rng);
    return makeQuestion({subject,skill:'elapsed-time',prompt:`It is ${start}. What time will it be ${addMinutes} minutes later?`,answer:ans,choices:options,grade,difficulty:d,explanation:`Add ${addMinutes} minutes to ${start}. That makes ${ans}.`});
  }
  const hour=randInt(1,12,rng);let minute=0;
  if(grade===1) minute=pick(d===0?[0]:[0,30],rng);
  else if(grade===2) minute=pick(d===0?[0,30]:d===1?[0,15,30,45]:[0,5,10,15,20,25,30,35,40,45,50,55],rng);
  else minute=grade===3?pick(d===0?[0,15,30,45]:[0,5,10,15,20,25,30,35,40,45,50,55],rng):pick([0,5,10,15,20,25,30,35,40,45,50,55],rng);
  const ans=`${hour}:${String(minute).padStart(2,'0')}`;
  const opts=new Set([ans]);while(opts.size<4){const h=((hour-1+randInt(-1,1,rng)+12)%12)+1;const m=(minute+pick([-15,-5,5,15,30],rng)+60)%60;opts.add(`${h}:${String(m).padStart(2,'0')}`);}
  return makeQuestion({subject,skill:'read-clock',prompt:'What time does the clock show?',answer:ans,choices:shuffle([...opts],rng),grade,difficulty:d,explanation:`The short hand shows the hour ${hour}, and the long hand shows ${minute} minutes. The time is ${ans}.`,visualType:'clock',visualData:{hour,minute}});
}

function calendarQuestion(grade,d,rng){
  const subject='calendar';
  const modes=grade===1?['month-next','day-next','months-year','season']:grade===2?['month-next','month-before','day-next','months-year','days-week','season']:grade===3?['month-next','month-before','days-week','month-number','season']:grade===4?['month-next','month-before','month-number','days-week','weeks-simple','season']:grade===5?['month-number','weeks-simple','days-year','leap-year','quarters','days-month']:['days-year','leap-year','quarters','weeks-year','days-month','date-span'];
  const mode=pick(modes,rng);
  if(mode==='month-next'){const i=randInt(0,10,rng),ans=MONTHS[i+1],wrong=shuffle(MONTHS.filter(x=>x!==ans),rng).slice(0,3);return makeQuestion({subject,skill:'month-order',prompt:`What month comes after ${MONTHS[i]}?`,answer:ans,choices:shuffle([ans,...wrong],rng),grade,difficulty:d,explanation:`${ans} comes immediately after ${MONTHS[i]}.`});}
  if(mode==='month-before'){const i=randInt(1,11,rng),ans=MONTHS[i-1],wrong=shuffle(MONTHS.filter(x=>x!==ans),rng).slice(0,3);return makeQuestion({subject,skill:'month-order',prompt:`What month comes before ${MONTHS[i]}?`,answer:ans,choices:shuffle([ans,...wrong],rng),grade,difficulty:d,explanation:`${ans} comes immediately before ${MONTHS[i]}.`});}
  if(mode==='day-next'){const i=randInt(0,5,rng),ans=DAYS[i+1],wrong=shuffle(DAYS.filter(x=>x!==ans),rng).slice(0,3);return makeQuestion({subject,skill:'day-order',prompt:`What day comes after ${DAYS[i]}?`,answer:ans,choices:shuffle([ans,...wrong],rng),grade,difficulty:d,explanation:`${ans} comes after ${DAYS[i]}.`});}
  if(mode==='months-year') return makeQuestion({subject,skill:'calendar-facts',prompt:'How many months are in one year?',answer:'12',choices:shuffle(['12','10','7','24'],rng),grade,difficulty:d,explanation:'There are 12 months in one year.'});
  if(mode==='days-week') return makeQuestion({subject,skill:'calendar-facts',prompt:'How many days are in one week?',answer:'7',choices:shuffle(['7','5','10','12'],rng),grade,difficulty:d,explanation:'There are 7 days in one week.'});
  if(mode==='month-number'){const i=randInt(0,11,rng),ans=String(i+1),wrong=shuffle(Array.from({length:12},(_,j)=>String(j+1)).filter(x=>x!==ans),rng).slice(0,3);return makeQuestion({subject,skill:'month-number',prompt:`${MONTHS[i]} is which month of the year?`,answer:ans,choices:shuffle([ans,...wrong],rng),grade,difficulty:d,explanation:`${MONTHS[i]} is month number ${ans}.`});}

  if(mode==='days-year') return makeQuestion({subject,skill:'calendar-facts',prompt:'How many days are in a common year?',answer:'365',choices:shuffle(['365','360','366','364'],rng),grade,difficulty:d,explanation:'A common year has 365 days.'});
  if(mode==='leap-year') return makeQuestion({subject,skill:'calendar-facts',prompt:'How many days are in a leap year?',answer:'366',choices:shuffle(['366','365','364','360'],rng),grade,difficulty:d,explanation:'A leap year has 366 days.'});
  if(mode==='quarters') return makeQuestion({subject,skill:'calendar-facts',prompt:'How many months are in one quarter of a year?',answer:'3',choices:shuffle(['3','2','4','6'],rng),grade,difficulty:d,explanation:'Twelve months divided into four quarters gives 3 months per quarter.'});
  if(mode==='weeks-year') return makeQuestion({subject,skill:'calendar-facts',prompt:'About how many weeks are in one year?',answer:'52',choices:shuffle(['52','48','60','365'],rng),grade,difficulty:d,explanation:'A year has about 52 weeks.'});
  if(mode==='days-month'){const month=pick([['April','30'],['June','30'],['September','30'],['November','30'],['January','31'],['March','31'],['July','31'],['August','31'],['October','31'],['December','31']],rng);return makeQuestion({subject,skill:'calendar-facts',prompt:`How many days are in ${month[0]}?`,answer:month[1],choices:shuffle([month[1],...['28','29','30','31'].filter(x=>x!==month[1]).slice(0,3)],rng),grade,difficulty:d,explanation:`${month[0]} has ${month[1]} days.`});}
  if(mode==='date-span'){const days=pick([14,21,28,35,42,56],rng),answer=String(days/7);return makeQuestion({subject,skill:'calendar-facts',prompt:`How many weeks are in ${days} days?`,answer,choices:shuffle([answer,String(Number(answer)+1),String(Math.max(1,Number(answer)-1)),String(days)],rng),grade,difficulty:d,explanation:`${days} divided by 7 days per week equals ${answer} weeks.`});}
  if(mode==='weeks-simple') return makeQuestion({subject,skill:'calendar-facts',prompt:'About how many weeks are in 28 days?',answer:'4',choices:shuffle(['4','2','7','14'],rng),grade,difficulty:d,explanation:'Four groups of 7 days make 28 days.'});
  const seasonData=[['spring','summer'],['summer','fall'],['fall','winter'],['winter','spring']];const pair=pick(seasonData,rng);return makeQuestion({subject,skill:'seasons',prompt:`What season usually comes after ${pair[0]}?`,answer:pair[1],choices:shuffle([pair[1],...['spring','summer','fall','winter'].filter(x=>x!==pair[1]).slice(0,3)],rng),grade,difficulty:d,explanation:`${pair[1][0].toUpperCase()+pair[1].slice(1)} comes after ${pair[0]}.`});
}

function vocabularyQuestion(grade,d,rng){const subject='vocabulary';const bank=[...(VOCAB[grade]||[]),...(VOCAB_EXTRA[grade]||[])],entry=pick(bank,rng),answer=entry[1];const wrongPool=[...new Set([...Object.values(VOCAB).flat(),...Object.values(VOCAB_EXTRA).flat()].map(x=>x[1]).filter(x=>x!==answer))];const wrong=shuffle(wrongPool,rng).slice(0,3);return makeQuestion({subject,skill:'word-meaning',prompt:`What does “${entry[0]}” mean?`,answer,choices:shuffle([answer,...wrong],rng),grade,difficulty:d,explanation:`“${entry[0]}” means ${answer}.`});}

function readingQuestion(grade,d,rng){const subject='reading';const [passage,prompt,answer,choices]=pick([...(READING[grade]||[]),...(READING_EXTRA[grade]||[])],rng);return makeQuestion({subject,skill:'comprehension',prompt,answer,choices:shuffle(choices,rng),grade,difficulty:d,explanation:`Read the passage carefully: ${answer}.`,visualType:'passage',visualData:{passage}});}

function misspell(word,rng){const swaps={because:['becaus','becuase','beacuse'],little:['littel','litle','littlle'],friend:['freind','frend','friand'],school:['scool','schol','shcool'],people:['peaple','peeple','pepole'],night:['nite','nigth','nightt'],different:['diffrent','differant','diferent'],important:['importent','imporant','importantt'],favorite:['faverite','favorit','favrite'],beautiful:['beatiful','beutiful','beautifull'],family:['famly','familly','fammily'],remember:['remeber','remmember','rember'],necessary:['neccessary','nesessary','necessery'],separate:['seperate','seperete','separat'],calendar:['calender','calandar','callendar'],environment:['enviroment','environmant','enviornment'],probably:['probly','probablly','probibly'],knowledge:['knowlege','knowlage','knowldge']};if(swaps[word])return pick(swaps[word],rng);if(word.length<4)return word+word.at(-1);const i=randInt(1,word.length-2,rng);return word.slice(0,i)+word[i+1]+word[i]+word.slice(i+2);}
function spellingQuestion(grade,d,rng){const subject='spelling',answer=pick([...(SPELLING[grade]||[]),...(SPELLING_EXTRA[grade]||[])],rng);const wrong=new Set();let guard=0;while(wrong.size<3&&guard++<20){const w=misspell(answer,rng);if(w!==answer)wrong.add(w);}const fallbacks=[answer.slice(0,-1),answer+answer.at(-1),answer.slice(0,1)+answer.slice(2),answer+'e',answer+'x'];for(const w of fallbacks){if(w&&w!==answer)wrong.add(w);if(wrong.size>=3)break;}return makeQuestion({subject,skill:'correct-spelling',prompt:'Which word is spelled correctly?',answer,choices:shuffle([answer,...[...wrong].slice(0,3)],rng),grade,difficulty:d,explanation:`The correct spelling is “${answer}.”`});}

function grammarQuestion(grade,d,rng){const subject='grammar';const [prompt,answer,choices,explanation]=pick([...(GRAMMAR[grade]||[]),...(GRAMMAR_EXTRA[grade]||[])],rng);return makeQuestion({subject,skill:'language',prompt,answer,choices:shuffle(choices,rng),grade,difficulty:d,explanation});}

function scienceQuestion(grade,d,rng){const subject='science';const [prompt,answer,choices]=pick([...(SCIENCE[grade]||[]),...(SCIENCE_EXTRA[grade]||[])],rng);return makeQuestion({subject,skill:'science-facts',prompt,answer,choices:shuffle(choices,rng),grade,difficulty:d,explanation:`The correct answer is ${answer}.`});}

function geographyQuestion(grade,d,rng){const subject='geography';const [prompt,answer,choices]=pick([...(GEO[grade]||[]),...(GEO_EXTRA[grade]||[])],rng);return makeQuestion({subject,skill:'geography-facts',prompt,answer,choices:shuffle(choices,rng),grade,difficulty:d,explanation:`The correct answer is ${answer}.`});}

function generalQuestion(grade,d,rng){const subject='general';const [prompt,answer,choices]=pick([...(GENERAL[grade]||[]),...(GENERAL_EXTRA[grade]||[])],rng);return makeQuestion({subject,skill:'general-knowledge',prompt,answer,choices:shuffle(choices,rng),grade,difficulty:d,explanation:`The correct answer is ${answer}.`});}

export function questionFingerprint(question){
  const visual=question?.visualType==='passage'?question?.visualData?.passage||'':question?.visualType==='clock'?`${question?.visualData?.hour||''}:${question?.visualData?.minute||''}`:'';
  return [question?.subject,question?.skill,question?.prompt,question?.answer,visual].map(normalize).join('|');
}

export function generateUniqueQuestion(options={},excludedFingerprints=new Set(),maxAttempts=500){
  let fallback=null;
  for(let i=0;i<maxAttempts;i++){
    const q=generateQuestion(options);fallback=q;
    if(!excludedFingerprints?.has(questionFingerprint(q)))return q;
  }
  return fallback||generateQuestion(options);
}

export function generateQuestion({grade=3,subject='mixed',skill='mixed',difficulty=1,subjects=SUBJECT_KEYS,rng=Math.random}={}){
  const g=clamp(Number(grade)||3,1,6),d=clamp(Number(difficulty)||0,0,2);
  let s=subject;
  const usable=(Array.isArray(subjects)&&subjects.length?subjects:SUBJECT_KEYS).filter(x=>SUBJECT_KEYS.includes(x));
  if(s==='mixed'||!SUBJECT_KEYS.includes(s))s=pick(usable.length?usable:SUBJECT_KEYS,rng);
  const map={math:()=>mathQuestion(g,skill,d,rng),time:()=>timeQuestion(g,d,rng),calendar:()=>calendarQuestion(g,d,rng),vocabulary:()=>vocabularyQuestion(g,d,rng),reading:()=>readingQuestion(g,d,rng),spelling:()=>spellingQuestion(g,d,rng),grammar:()=>grammarQuestion(g,d,rng),science:()=>scienceQuestion(g,d,rng),geography:()=>geographyQuestion(g,d,rng),general:()=>generalQuestion(g,d,rng)};
  const q=map[s]();
  const meta=resolveQuestionSkill(q);
  q.skillId=meta.id;
  q.domain=meta.domain;
  q.skillName=meta.name;
  if(!q.choices.some(c=>normalize(c)===normalize(q.answer)))throw new Error('Correct answer missing from choices');
  if(new Set(q.choices.map(normalize)).size!==4)throw new Error('Choices are not unique');
  return q;
}

export function generateReviewQuestion(source,{rng=Math.random}={}){
  return generateQuestion({grade:source.grade,subject:source.subject,skill:source.skill,difficulty:Math.max(0,(source.difficulty||0)-1),subjects:[source.subject],rng});
}
export function isCorrect(choice,question){return normalize(choice)===normalize(question.answer);}
export function nextDifficulty(current,recentResults=[]){const window=recentResults.slice(-4);if(window.length<3)return clamp(current,0,2);const accuracy=window.filter(Boolean).length/window.length;if(accuracy>=.8)return clamp(current+1,0,2);if(accuracy<=.4)return clamp(current-1,0,2);return clamp(current,0,2);}
export function rageLevel(points,isRoundOver=false,score=0,total=10){if(isRoundOver&&total>0&&score/total>=.8)return 4;if(points>=7)return 3;if(points>=4)return 2;if(points>=2)return 1;return 0;}
export function quizGrade(score,total){const pct=score/Math.max(1,total);if(pct===1)return {letter:'A+',label:'PERFECT SCORE!',needsReview:false};if(pct>=.9)return {letter:'A',label:'GLORP IS FURIOUS',needsReview:false};if(pct>=.8)return {letter:'B',label:'VERY STRONG',needsReview:false};if(pct>=.7)return {letter:'C',label:'KEEP GOING',needsReview:false};return {letter:'REVIEW',label:'PROFESSOR BRAINROT TIME',needsReview:true};}
export function resultLabel(score,total){const pct=score/Math.max(1,total);if(pct===1)return {title:'PERFECT BRAIN!',subtitle:'Glorp has completely SPLORPED.'};if(pct>=.8)return {title:'YOU ROASTED GLORP!',subtitle:'He is absolutely furious.'};if(pct>=.5)return {title:'YOU BEAT GLORP!',subtitle:'Glorp demands a suspicious recount.'};return {title:'GLORP BARELY ESCAPED!',subtitle:'Rematch him. He is way too smug.'};}
