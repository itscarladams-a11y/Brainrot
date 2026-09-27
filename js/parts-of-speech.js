import { resolveQuestionSkill } from './skills.js';

const PARTS = Object.freeze([
  {id:'nouns',singular:'noun',label:'Nouns',icon:'N',introduced:1,definition:'A noun names a person, place, thing, or idea.',examples:['teacher','city','robot','friendship'],sentence:'The curious robot carried a notebook to class.'},
  {id:'verbs',singular:'verb',label:'Verbs',icon:'V',introduced:1,definition:'A verb shows an action or a state of being.',examples:['run','think','write','is'],sentence:'Glorp sprinted across the classroom and was exhausted.'},
  {id:'adjectives',singular:'adjective',label:'Adjectives',icon:'ADJ',introduced:2,definition:'An adjective describes a noun or pronoun.',examples:['bright','tiny','happy','purple'],sentence:'The tiny purple robot opened the heavy door.'},
  {id:'pronouns',singular:'pronoun',label:'Pronouns',icon:'PRO',introduced:2,definition:'A pronoun takes the place of a noun.',examples:['I','you','he','she','it','we','they'],sentence:'Maya found the ruler, and she returned it to Glorp.'},
  {id:'adverbs',singular:'adverb',label:'Adverbs',icon:'ADV',introduced:3,definition:'An adverb can describe a verb, an adjective, or another adverb.',examples:['quickly','very','well','often'],sentence:'The robot moved surprisingly quickly through the lab.'},
  {id:'prepositions',singular:'preposition',label:'Prepositions',icon:'PREP',introduced:3,definition:'A preposition shows a relationship between a noun or pronoun and another word.',examples:['in','on','under','between'],sentence:'Glorp hid the pencil under the desk beside the backpack.'},
  {id:'conjunctions',singular:'conjunction',label:'Conjunctions',icon:'CONJ',introduced:3,definition:'A conjunction connects words, phrases, or clauses.',examples:['and','but','or','because'],sentence:'Professor taught the lesson, but Glorp watched the clock.'},
  {id:'interjections',singular:'interjection',label:'Interjections',icon:'INT',introduced:4,definition:'An interjection expresses a sudden feeling or reaction.',examples:['Wow!','Oops!','Hey!','Hooray!'],sentence:'“Oops!” Glorp shouted when the beaker tipped over.'}
]);

export const PARTS_OF_SPEECH = PARTS;
export const PARTS_GRADE_PATH = Object.freeze({
  1:['nouns','verbs'],
  2:['adjectives','pronouns'],
  3:['adverbs','prepositions','conjunctions'],
  4:['interjections','mixed identification'],
  5:['word function','agreement','sentence editing'],
  6:['complex sentences','clauses','editing and analysis']
});

const wordBanks={
  nouns:[
    ['Which word is a noun in this sentence? “The rabbit hopped quietly.”','rabbit',['rabbit','hopped','quietly','the'],'Rabbit names an animal, so it is a noun.'],
    ['Which word is a noun in this sentence? “Mia opened the window slowly.”','window',['window','opened','slowly','the'],'Window names a thing, so it is a noun.'],
    ['Which word is a noun in this sentence? “Kindness can change a day.”','Kindness',['Kindness','can','change','a'],'Kindness names an idea, so it is a noun.'],
    ['Which word is a noun in this sentence? “Chicago feels busy today.”','Chicago',['Chicago','feels','busy','today'],'Chicago names a place, so it is a noun.']
  ],
  verbs:[
    ['Which word is a verb in this sentence? “The students laughed loudly.”','laughed',['laughed','students','loudly','the'],'Laughed shows an action, so it is a verb.'],
    ['Which word is a verb in this sentence? “The soup smells wonderful.”','smells',['smells','soup','wonderful','the'],'Smells is the verb showing a state or sense.'],
    ['Which word is a verb in this sentence? “Glorp carried the backpack.”','carried',['carried','Glorp','backpack','the'],'Carried shows the action.'],
    ['Which word is a verb in this sentence? “The answer is correct.”','is',['is','answer','correct','the'],'Is is a state-of-being verb.']
  ],
  adjectives:[
    ['Which word is an adjective in this sentence? “The noisy robot rolled away.”','noisy',['noisy','robot','rolled','away'],'Noisy describes the robot.'],
    ['Which word is an adjective in this sentence? “We saw three bright stars.”','bright',['bright','stars','saw','we'],'Bright describes the stars.'],
    ['Which word is an adjective in this sentence? “Glorp wore a ridiculous hat.”','ridiculous',['ridiculous','wore','hat','Glorp'],'Ridiculous describes the hat.'],
    ['Which word is an adjective in this sentence? “The cold water filled the glass.”','cold',['cold','water','filled','glass'],'Cold describes the water.']
  ],
  pronouns:[
    ['Which word is a pronoun in this sentence? “She carried the books.”','She',['She','carried','books','the'],'She replaces the name of a person.'],
    ['Which word is a pronoun in this sentence? “They built a model rocket.”','They',['They','built','model','rocket'],'They stands in for the names of people or things.'],
    ['Which word is a pronoun in this sentence? “The dog found its toy, and it barked.”','it',['it','dog','toy','barked'],'It replaces the noun dog.'],
    ['Which word is a pronoun in this sentence? “We finished the project carefully.”','We',['We','finished','project','carefully'],'We is a pronoun.']
  ],
  adverbs:[
    ['Which word is an adverb in this sentence? “The turtle moved slowly.”','slowly',['slowly','turtle','moved','the'],'Slowly tells how the turtle moved.'],
    ['Which word is an adverb in this sentence? “Professor spoke clearly.”','clearly',['clearly','Professor','spoke','the'],'Clearly tells how Professor spoke.'],
    ['Which word is an adverb in this sentence? “Glorp often forgets his ruler.”','often',['often','Glorp','forgets','ruler'],'Often tells how frequently Glorp forgets it.'],
    ['Which word is an adverb in this sentence? “The class worked carefully.”','carefully',['carefully','class','worked','the'],'Carefully tells how the class worked.']
  ],
  prepositions:[
    ['Which word is a preposition in this sentence? “The pencil is under the desk.”','under',['under','pencil','is','desk'],'Under shows the pencil’s relationship to the desk.'],
    ['Which word is a preposition in this sentence? “We walked through the hallway.”','through',['through','walked','hallway','we'],'Through shows a relationship between the walking and hallway.'],
    ['Which word is a preposition in this sentence? “The book sits beside the lamp.”','beside',['beside','book','sits','lamp'],'Beside shows where the book is relative to the lamp.'],
    ['Which word is a preposition in this sentence? “The ball rolled between the chairs.”','between',['between','rolled','ball','chairs'],'Between shows the ball’s position relative to the chairs.']
  ],
  conjunctions:[
    ['Which word is a conjunction in this sentence? “I wanted pizza, but Glorp ate it.”','but',['but','pizza','wanted','ate'],'But connects two contrasting ideas.'],
    ['Which word is a conjunction in this sentence? “Bring a pencil and a notebook.”','and',['and','pencil','bring','notebook'],'And connects pencil and notebook.'],
    ['Which word is a conjunction in this sentence? “We stayed inside because it rained.”','because',['because','inside','stayed','rained'],'Because connects the result to its reason.'],
    ['Which word is a conjunction in this sentence? “You may read or draw.”','or',['or','read','draw','you'],'Or connects two choices.']
  ],
  interjections:[
    ['Which word is an interjection in this sentence? “Wow! That experiment worked.”','Wow!',['Wow!','experiment','worked','that'],'Wow! expresses a sudden reaction.'],
    ['Which word is an interjection in this sentence? “Oops! I dropped the marker.”','Oops!',['Oops!','dropped','marker','the'],'Oops! expresses a sudden reaction to a mistake.'],
    ['Which word is an interjection in this sentence? “Hooray! We finished the project.”','Hooray!',['Hooray!','finished','project','we'],'Hooray! expresses excitement.'],
    ['Which word is an interjection in this sentence? “Hey! That is my backpack.”','Hey!',['Hey!','backpack','is','my'],'Hey! is used as a sudden call or reaction.']
  ]
};

const definitions={
  nouns:['Which part of speech names a person, place, thing, or idea?','Noun'],
  verbs:['Which part of speech shows an action or state of being?','Verb'],
  adjectives:['Which part of speech describes a noun or pronoun?','Adjective'],
  pronouns:['Which part of speech can take the place of a noun?','Pronoun'],
  adverbs:['Which part of speech can describe a verb, adjective, or another adverb?','Adverb'],
  prepositions:['Which part of speech shows relationships such as in, under, beside, or between?','Preposition'],
  conjunctions:['Which part of speech connects words, phrases, or clauses?','Conjunction'],
  interjections:['Which part of speech expresses a sudden feeling or reaction?','Interjection']
};
const labels=['Noun','Pronoun','Verb','Adjective','Adverb','Preposition','Conjunction','Interjection'];

function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rngFor(seed){let n=hash(seed)||1;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return (n>>>0)/4294967296;};}
function shuffled(list,rng){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function lesson(id){return PARTS.find(x=>x.id===id)||PARTS[0];}
function finalize(q){const meta=resolveQuestionSkill(q);return {...q,skillId:meta.id,domain:meta.domain,skillName:meta.name,interactionType:'choice'};}

export function partsLesson(id){return lesson(id);}
export function partsLessonIndex(id){return Math.max(0,PARTS.findIndex(x=>x.id===id));}
export function gradePathForParts(grade=3){return PARTS_GRADE_PATH[Math.max(1,Math.min(6,Number(grade)||3))];}

export function generatePartsLessonQuestions({partId='nouns',grade=3,difficulty=0,count=4,seed='lesson'}={}){
  const part=lesson(partId),rng=rngFor(`${seed}:${part.id}:${grade}:${difficulty}`),questions=[];
  const [definitionPrompt,definitionAnswer]=definitions[part.id];
  const definitionChoices=shuffled([definitionAnswer,...shuffled(labels.filter(x=>x!==definitionAnswer),rng).slice(0,3)],rng);
  questions.push(finalize({subject:'grammar',skill:part.id,prompt:definitionPrompt,answer:definitionAnswer,choices:definitionChoices,grade:Number(grade)||3,difficulty:Number(difficulty)||0,explanation:part.definition,visualType:'text',visualData:null}));
  const bank=shuffled(wordBanks[part.id],rng);
  for(let i=0;i<Math.max(1,count-1);i++){
    const item=bank[i%bank.length],choices=shuffled(item[2],rng);
    questions.push(finalize({subject:'grammar',skill:part.id,prompt:item[0],answer:item[1],choices,grade:Number(grade)||3,difficulty:Number(difficulty)||0,explanation:item[3],visualType:'text',visualData:null}));
  }
  return questions.slice(0,count);
}

export function generatePartsMixedQuestions({grade=3,difficulty=1,count=8,seed='mixed'}={}){
  const rng=rngFor(`${seed}:${grade}:${difficulty}`),order=shuffled(PARTS,rng),out=[];
  for(let i=0;i<count;i++){
    const part=order[i%order.length];
    const q=generatePartsLessonQuestions({partId:part.id,grade,difficulty,count:2,seed:`${seed}:${i}`});
    out.push(q[i%2]);
  }
  return out;
}

export function partsCourseSummary(progress={}){
  const completed=new Set(Object.keys(progress.completed||{}).filter(k=>progress.completed[k]));
  const count=PARTS.filter(x=>completed.has(x.id)).length;
  return {completed:count,total:PARTS.length,percent:Math.round(count/PARTS.length*100),finished:count===PARTS.length};
}
