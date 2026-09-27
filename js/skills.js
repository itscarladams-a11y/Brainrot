const slug=value=>String(value||'practice').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'practice';
const title=value=>String(value||'Practice').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

function classifyReading(prompt=''){
  const p=prompt.toLowerCase();
  if(/main idea|mainly about|best title|central idea/.test(p))return ['comprehension','main-idea','Main Idea'];
  if(/infer|most likely|probably|can you tell|suggests|conclude/.test(p))return ['comprehension','inference','Inference'];
  if(/first|next|after|before|order|sequence/.test(p))return ['comprehension','sequence','Sequence'];
  if(/why|cause|because|result|effect/.test(p))return ['comprehension','cause-effect','Cause & Effect'];
  if(/mean|meaning|word|phrase/.test(p))return ['comprehension','context-clues','Context Clues'];
  return ['comprehension','key-details','Key Details'];
}
function classifyGrammar(prompt=''){
  const p=prompt.toLowerCase();
  const rules=[
    [/punctuat|comma|period|question mark|apostrophe|capital/,['conventions','punctuation','Punctuation & Capitals']],
    [/subject|predicate/,['sentences','subject-predicate','Subject & Predicate']],
    [/noun/,['parts-of-speech','nouns','Nouns']],
    [/pronoun/,['parts-of-speech','pronouns','Pronouns']],
    [/adjective/,['parts-of-speech','adjectives','Adjectives']],
    [/adverb/,['parts-of-speech','adverbs','Adverbs']],
    [/verb|tense/,['parts-of-speech','verbs','Verbs & Tense']],
    [/conjunction/,['parts-of-speech','conjunctions','Conjunctions']],
    [/preposition/,['parts-of-speech','prepositions','Prepositions']],
    [/interjection/,['parts-of-speech','interjections','Interjections']],
    [/plural|possessive/,['word-forms','word-forms','Word Forms']],
    [/sentence|fragment|run-on/,['sentences','sentence-structure','Sentence Structure']]
  ];
  return rules.find(([re])=>re.test(p))?.[1]||['language','language-usage','Language Usage'];
}
function classifyScience(prompt='',answer=''){
  const p=`${prompt} ${answer}`.toLowerCase();
  const rules=[
    [/evaporation|condensation|precipitation|water cycle|water vapor/,['earth-science','water-cycle','Water Cycle']],
    [/food chain|food web|producer|consumer|decomposer|ecosystem/,['life-science','ecosystems','Ecosystems & Food Chains']],
    [/solid|liquid|gas|matter|melting|freezing/,['physical-science','matter','Matter']],
    [/force|motion|friction|gravity|speed/,['physical-science','forces-motion','Forces & Motion']],
    [/electric|circuit|conductor|insulator|battery/,['physical-science','electricity','Electricity']],
    [/plant|root|stem|leaf|leaves|photosynthesis|flower/,['life-science','plants','Plant Structures']],
    [/adaptation|habitat|camouflage|survive/,['life-science','adaptations','Adaptations & Habitats']],
    [/planet|solar system|sun|moon|orbit|earth rotates/,['space-science','solar-system','Solar System']],
    [/rock|mineral|crust|mantle|core|earth layer/,['earth-science','earth-materials','Earth & Rocks']],
    [/weather|climate|temperature|cloud|storm|wind/,['earth-science','weather-climate','Weather & Climate']]
  ];
  return rules.find(([re])=>re.test(p))?.[1]||['science-practice','science-concepts','Science Concepts'];
}
function classifyGeography(prompt='',answer=''){
  const p=`${prompt} ${answer}`.toLowerCase();
  const rules=[
    [/continent|ocean/,['world-geography','continents-oceans','Continents & Oceans']],
    [/capital|state|country/,['places','places-capitals','Places & Capitals']],
    [/map|legend|scale|latitude|longitude|compass|direction/,['map-skills','map-reading','Map Skills']],
    [/river|mountain|valley|plateau|plain|landform|island|peninsula/,['physical-geography','landforms','Landforms']],
    [/region|climate|hemisphere|equator/,['world-geography','regions-climate','Regions & Climate']]
  ];
  return rules.find(([re])=>re.test(p))?.[1]||['geography-practice','geography-concepts','Geography Concepts'];
}
function classifyGeneral(prompt='',answer=''){
  const p=`${prompt} ${answer}`.toLowerCase();
  const rules=[
    [/money|credit|interest|tax|wage|income|budget|expense|bank|saving/,['life-skills','financial-literacy','Financial Literacy']],
    [/source|bias|claim|citation|misinformation|disinformation|plagiarism|copyright|fair use|digital citizenship|encryption|password|software|backup/,['digital-literacy','information-literacy','Information & Digital Literacy']],
    [/seat belt|smoke alarm|emergency|safety|first aid/,['life-skills','safety','Safety']],
    [/median|mode|percentage|probability|sample|correlation|variable|hypothesis|control group|peer review/,['reasoning','data-science','Data & Scientific Reasoning']],
    [/government|branch|citizen|election|law|constitution|civic/,['civics','civics-basics','Civics']]
  ];
  return rules.find(([re])=>re.test(p))?.[1]||['general-knowledge','general-knowledge','General Knowledge'];
}

export function resolveQuestionSkill(question={}){
  const grade=Math.max(1,Math.min(6,Number(question.grade)||3));
  const subject=slug(question.subject||'general');
  const legacy=slug(question.skill||'practice');
  let domain=subject,key=legacy,name=title(legacy);
  if(subject==='math'){
    const map={
      addition:['arithmetic','addition','Addition'],subtraction:['arithmetic','subtraction','Subtraction'],multiplication:['arithmetic','multiplication','Multiplication'],division:['arithmetic','division','Division'],
      'decimal-addition':['decimals','decimal-addition','Decimal Addition'],'decimal-subtraction':['decimals','decimal-subtraction','Decimal Subtraction'],
      'fraction-equivalent':['fractions','equivalent-fractions','Equivalent Fractions'],'fraction-of-number':['fractions','fraction-of-quantity','Fractions of Quantities'],'percent-of-number':['percent','percent-of-quantity','Percent of a Quantity']
    };
    [domain,key,name]=map[legacy]||['math-practice',legacy,title(legacy)];
  }else if(subject==='time'){
    [domain,key,name]=legacy==='elapsed-time'?['time','elapsed-time','Elapsed Time']:['time','reading-clocks','Reading Clocks'];
  }else if(subject==='calendar'){
    const p=String(question.prompt||'').toLowerCase();
    if(legacy==='day-order'||/day comes|days are in one week|weekend/.test(p))[domain,key,name]=['calendar','days-week','Days of the Week'];
    else if(legacy==='month-order'||legacy==='month-number'||/month/.test(p))[domain,key,name]=['calendar','months-year','Months of the Year'];
    else if(legacy==='seasons')[domain,key,name]=['calendar','seasons','Seasons'];
    else [domain,key,name]=['calendar','calendar-reasoning','Calendar Reasoning'];
  }else if(subject==='vocabulary') [domain,key,name]=['vocabulary','word-meaning','Word Meaning'];
  else if(subject==='spelling') [domain,key,name]=['spelling','correct-spelling','Correct Spelling'];
  else if(subject==='reading') [domain,key,name]=classifyReading(question.prompt);
  else if(subject==='grammar') {
    const explicitParts={
      nouns:['parts-of-speech','nouns','Nouns'],
      pronouns:['parts-of-speech','pronouns','Pronouns'],
      verbs:['parts-of-speech','verbs','Verbs'],
      adjectives:['parts-of-speech','adjectives','Adjectives'],
      adverbs:['parts-of-speech','adverbs','Adverbs'],
      prepositions:['parts-of-speech','prepositions','Prepositions'],
      conjunctions:['parts-of-speech','conjunctions','Conjunctions'],
      interjections:['parts-of-speech','interjections','Interjections']
    };
    [domain,key,name]=explicitParts[legacy]||classifyGrammar(question.prompt);
  }
  else if(subject==='science') [domain,key,name]=classifyScience(question.prompt,question.answer);
  else if(subject==='geography') [domain,key,name]=classifyGeography(question.prompt,question.answer);
  else if(subject==='general') [domain,key,name]=classifyGeneral(question.prompt,question.answer);
  const domainSlug=slug(domain),keySlug=slug(key);
  const id=['g'+grade,subject,...(domainSlug===subject?[]:[domainSlug]),keySlug].join('-');
  return {id,grade,subject,domain:slug(domain),key:slug(key),name,legacySkill:legacy};
}

export function masteryStateFromScore(score=0,attempts=0){
  if(!attempts)return {key:'new',label:'New'};
  if(score<40)return {key:'learning',label:'Learning'};
  if(score<60)return {key:'practicing',label:'Practicing'};
  if(score<80)return {key:'strong',label:'Strong'};
  return {key:'mastered',label:'Mastered'};
}
