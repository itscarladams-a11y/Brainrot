const normalize=value=>String(value??'').trim();
const numericAnswer=q=>/^[-+]?\d+(?:\.\d+)?$/.test(normalize(q?.answer));
const wordAnswer=q=>/^[A-Za-z]{2,14}$/.test(normalize(q?.answer));

export function interactionType(question){
  return question?.interactionType || 'choice';
}

export function selectInteractionType(question,{setting='battle',mode='battle',index=0}={}){
  if(mode==='quiz')return 'choice';
  if(setting==='pizza'&&question?.subject==='math'&&numericAnswer(question)){
    return index%3===0?'choice':'number-input';
  }
  if(setting==='milkshake'&&question?.subject==='spelling'&&wordAnswer(question)){
    return ['choice','missing-letter','letter-build'][index%3];
  }
  if(setting==='battle'&&question?.subject==='math'&&numericAnswer(question)&&index%4===2)return 'number-input';
  if(setting==='battle'&&question?.subject==='spelling'&&wordAnswer(question)&&index%4===2)return 'missing-letter';
  return 'choice';
}

function missingLetterData(answer,index=0){
  const word=normalize(answer);
  const eligible=[];
  for(let i=1;i<word.length-1;i++)if(/[A-Za-z]/.test(word[i]))eligible.push(i);
  const position=eligible.length?eligible[index%eligible.length]:Math.max(0,Math.floor(word.length/2));
  const correct=word[position];
  const alphabet='abcdefghijklmnopqrstuvwxyz';
  const distractors=[];
  for(let offset=3;distractors.length<3;offset+=5){
    const c=alphabet[(alphabet.indexOf(correct.toLowerCase())+offset)%26];
    if(c!==correct.toLowerCase()&&!distractors.includes(c))distractors.push(c);
  }
  const letters=[correct.toLowerCase(),...distractors];
  for(let i=letters.length-1;i>0;i--){const j=(index*7+i*3)% (i+1);[letters[i],letters[j]]=[letters[j],letters[i]];}
  return {position,template:`${word.slice(0,position)}_${word.slice(position+1)}`,letters};
}

function letterBuildData(answer,index=0){
  const word=normalize(answer).toLowerCase();
  const letters=[...word];
  for(let i=letters.length-1;i>0;i--){const j=(index*5+i*7)% (i+1);[letters[i],letters[j]]=[letters[j],letters[i]];}
  if(letters.join('')===word&&letters.length>1)[letters[0],letters[1]]=[letters[1],letters[0]];
  return {letters};
}

export function prepareInteraction(question,context={}){
  const type=selectInteractionType(question,context);
  const q={...question,interactionType:type};
  if(type==='number-input'){
    q.interactionPrompt=`${q.prompt} Type the answer.`;
  }else if(type==='missing-letter'){
    q.interactionData=missingLetterData(q.answer,context.index||0);
    q.interactionPrompt=`Fill in the missing letter: ${q.interactionData.template}`;
  }else if(type==='letter-build'){
    q.interactionData=letterBuildData(q.answer,context.index||0);
    q.interactionPrompt='Build the word with the letter tiles';
  }
  return q;
}

function button(text,className='answer'){
  const b=document.createElement('button');
  b.type='button';
  b.className=className;
  b.textContent=text;
  return b;
}

function renderChoice(question,container,onAnswer){
  for(const [index,choice] of (question.choices||[]).entries()){
    const b=button(choice);
    b.dataset.choiceLabel=String.fromCharCode(65+index);
    b.dataset.answerValue=String(choice);
    b.addEventListener('click',()=>onAnswer(choice,b,{interactionType:'choice'}));
    container.appendChild(b);
  }
}

function renderNumberInput(question,container,onAnswer){
  container.classList.add('interaction-number-input');
  const wrap=document.createElement('div');wrap.className='number-input-wrap';
  const display=document.createElement('div');display.className='number-input-display';display.textContent='';display.setAttribute('aria-live','polite');
  const hint=document.createElement('div');hint.className='interaction-hint';hint.textContent=question.interactionPrompt||'Type the answer';
  const keypad=document.createElement('div');keypad.className='number-keypad';
  const keys=['1','2','3','4','5','6','7','8','9','.','0','⌫'];
  let value='';
  const update=()=>{display.textContent=value||'—';submit.disabled=!value||value==='.'||value==='-';};
  for(const key of keys){
    const b=button(key,'number-key');
    b.dataset.key=key;
    b.addEventListener('click',()=>{if(key==='⌫')value=value.slice(0,-1);else if(key==='.'&&!value.includes('.'))value+=key;else if(key!=='.'||!value.includes('.'))value+=key;update();});
    keypad.appendChild(b);
  }
  const submit=button('CHECK ANSWER','interaction-submit');submit.disabled=true;
  submit.addEventListener('click',()=>onAnswer(value,submit,{interactionType:'number-input'}));
  wrap.append(hint,display,keypad,submit);container.appendChild(wrap);update();
}

function renderMissingLetter(question,container,onAnswer){
  container.classList.add('interaction-missing-letter');
  const data=question.interactionData||missingLetterData(question.answer,0);
  const wrap=document.createElement('div');wrap.className='missing-letter-wrap';
  const prompt=document.createElement('div');prompt.className='missing-word';prompt.textContent=data.template;
  const hint=document.createElement('div');hint.className='interaction-hint';hint.textContent='Tap the missing letter';
  const tiles=document.createElement('div');tiles.className='letter-choice-grid';
  data.letters.forEach(letter=>{
    const b=button(letter.toUpperCase(),'letter-choice');
    const builtAnswer=`${String(question.answer).slice(0,data.position)}${letter}${String(question.answer).slice(data.position+1)}`;
    b.dataset.answerValue=builtAnswer;
    b.addEventListener('click',()=>{
      const built=`${String(question.answer).slice(0,data.position)}${letter}${String(question.answer).slice(data.position+1)}`;
      onAnswer(built,b,{interactionType:'missing-letter'});
    });
    tiles.appendChild(b);
  });
  wrap.append(prompt,hint,tiles);container.appendChild(wrap);
}

function renderLetterBuild(question,container,onAnswer){
  container.classList.add('interaction-letter-build');
  const data=question.interactionData||letterBuildData(question.answer,0);
  const wrap=document.createElement('div');wrap.className='letter-build-wrap';
  const hint=document.createElement('div');hint.className='interaction-hint';hint.textContent='Build the word';
  const built=document.createElement('div');built.className='built-word';
  const tray=document.createElement('div');tray.className='letter-tray';
  const controls=document.createElement('div');controls.className='letter-build-controls';
  const chosen=[];
  const refresh=()=>{built.textContent=chosen.map(x=>x.letter).join('').toUpperCase()||'_';submit.disabled=chosen.length!==data.letters.length;};
  data.letters.forEach((letter,i)=>{
    const b=button(letter.toUpperCase(),'letter-tile');b.dataset.tileIndex=String(i);
    b.addEventListener('click',()=>{if(b.disabled)return;b.disabled=true;chosen.push({letter,button:b});refresh();});tray.appendChild(b);
  });
  const undo=button('UNDO','interaction-small');undo.addEventListener('click',()=>{const last=chosen.pop();if(last)last.button.disabled=false;refresh();});
  const clear=button('CLEAR','interaction-small');clear.addEventListener('click',()=>{while(chosen.length)chosen.pop().button.disabled=false;refresh();});
  const submit=button('CHECK WORD','interaction-submit');submit.disabled=true;submit.addEventListener('click',()=>onAnswer(chosen.map(x=>x.letter).join(''),submit,{interactionType:'letter-build'}));
  controls.append(undo,clear);wrap.append(hint,built,tray,controls,submit);container.appendChild(wrap);refresh();
}

export function lockInteraction(container){
  container?.querySelectorAll('button,input').forEach(el=>el.disabled=true);
}

export function markCorrectAnswer(container,question){
  if(!container)return;
  const answer=normalize(question?.answer).toLowerCase();
  container.querySelectorAll('[data-answer-value]').forEach(el=>{
    if(normalize(el.dataset.answerValue).toLowerCase()===answer)el.classList.add('correct');
  });
}

export function renderInteraction(question,container,onAnswer){
  if(!container)throw new Error('Interaction container is required');
  container.innerHTML='';
  container.className='answer-grid';
  const type=interactionType(question);
  if(type==='choice')renderChoice(question,container,onAnswer);
  else if(type==='number-input')renderNumberInput(question,container,onAnswer);
  else if(type==='missing-letter')renderMissingLetter(question,container,onAnswer);
  else if(type==='letter-build')renderLetterBuild(question,container,onAnswer);
  else throw new Error(`Unsupported interaction type: ${type}`);
  container.dataset.interaction=type;
  return type;
}
