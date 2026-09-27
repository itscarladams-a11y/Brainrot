export const subjects = [
  {id:'mixed',art:'assets/ui/subject-mixed.svg',name:'Mixed Brain Battle',icon:'🧠',description:'A little bit of everything.'},
  {id:'math',art:'assets/ui/subject-math.svg',name:'Math',icon:'🔢',description:'Numbers, addition, subtraction, multiplication and division.',challengeName:'Number Battle',challengeTag:'FEATURED GAME',challengeDescription:'Beat Glorp by solving grade-level number challenges.',shortLabel:'NUMBER BATTLE',featured:true},
  {id:'time',art:'assets/ui/subject-time.svg',name:'Tell Time',icon:'🕒',description:'Read clocks and learn elapsed time.'},
  {id:'calendar',art:'assets/ui/subject-calendar.svg',name:'Months & Calendar',icon:'📅',description:'Months, days, seasons and calendar order.'},
  {id:'vocabulary',art:'assets/ui/subject-vocabulary.svg',name:'Vocabulary',icon:'🔤',description:'Word meanings and context.'},
  {id:'reading',art:'assets/ui/subject-reading.svg',name:'Reading',icon:'📖',description:'Short reading comprehension.',challengeName:'Reading Detective',challengeTag:'FEATURED GAME',challengeDescription:'Read the case file, then crack the comprehension question.',shortLabel:'READING DETECTIVE',featured:true},
  {id:'spelling',art:'assets/ui/subject-spelling.svg',name:'Spelling',icon:'✏️',description:'Choose the correctly spelled word.',challengeName:'Spelling Showdown',challengeTag:'FEATURED GAME',challengeDescription:'Find the one correctly spelled word before Glorp celebrates.',shortLabel:'SPELLING SHOWDOWN',featured:true},
  {id:'grammar',art:'assets/ui/subject-grammar.svg',name:'Grammar',icon:'🧩',description:'Nouns, verbs, adjectives and sentence rules.',challengeName:"Glorp's Grammar Crimes",challengeTag:'FEATURED GAME',challengeDescription:"Catch Glorp's broken grammar, punctuation, and sentence-rule crimes.",shortLabel:'GRAMMAR CRIMES',featured:true},
  {id:'science',art:'assets/ui/subject-science.svg',name:'Science',icon:'🔬',description:'Plants, animals, matter, energy and Earth.'},
  {id:'geography',art:'assets/ui/subject-geography.svg',name:'Geography',icon:'🌎',description:'Maps, directions, continents and Earth.'},
  {id:'general',art:'assets/ui/subject-general.svg',name:'General Knowledge',icon:'💡',description:'Useful grade-level facts about the world.'}
];

export const nonsense = [
  'POTATO!','HOTDOG!',"GRANDPA'S WI-FI!",'TOASTER!','TUESDAY!','PICKLE!','CHICKEN NUGGET!',
  'LEFT SHOE!','LAWNMOWER!','MOOSE!','HAMSTER!','PURPLE!','BEDTIME!','SEVEN-ISH!','A BILLION!','GLORP!'
];

export const subjectNonsense = {
  math:['7 × 7 = CHEESEBURGER!','6 × 5 = ICE CREAM!','8 × 4 = DINOSAUR!','12 ÷ 3 = TUESDAY!','2 + 2 = FISH!'],
  time:['DINNER TIME!','NAP O’CLOCK!','TWELVE PIZZA!','PHONE TIME!','YESTERDAY!'],
  calendar:['CHRISTMAS!','SEVENTEEN MONTHS!','TUESDAY!','HOTDOGTOBER!','NEXT YEAR!'],
  vocabulary:['VERY PURPLE!','EXTRA POTATO!','IT MEANS GLORP!','A FANCY HOTDOG!'],
  reading:['SKIP THE WORDS!','THE ANSWER IS VIDEO!','I DID NOT READ THAT!','PAGE POTATO!'],
  spelling:['ADD MORE Gs!','SPELL IT GLORP!','NEEDS THREE Zs!','CLOSE ENOUGH!'],
  grammar:['EVERY WORD IS A NOUN!','PUNCTUATION IS OPTIONAL!','VERBS ARE SUSPICIOUS!','COMMA POTATO!'],
  science:['PLANTS EAT PIZZA!','GRAVITY IS FAKE!','MOON CHEESE!','SCIENCE HOTDOG!'],
  geography:['OHIO IS A PLANET!','THE MOON!','LEFT OF TUESDAY!','GRANDPA’S HOUSE!'],
  general:['OBVIOUSLY POTATO!','THE INTERNET!','GLORP KNOWS THIS!','HOTDOG!']
};

export const glorpLines = {
  idle:["Let's watch videos instead!",'Learning is suspicious. Videos?','Don’t press Play.','You could be scrolling right now.'],
  correct:['Okay, that one barely counts.','Professor, your questions are suspicious.','Who wrote these questions?!'],
  wrong:['Easy. Obviously.','Beginner stuff. I could do this in my sleep.','Told you. Glorp genius.'],
  wrongBySubject:{
    math:['7 × 7 = cheeseburger.','6 × 5 = ice cream.','8 × 4 = dinosaur.','9 + 9 = chicken nugget.','12 ÷ 3 = Tuesday.','2 + 2 = fish.','100 ÷ 10 = pizza.','6 × 6 = Ohio.'],
    spelling:['Necessary has three Zs.','Definitely starts with a J.','Silent letters are fake.','Just add another E.','Close enough. Add more Gs.'],
    grammar:['Every sentence needs seven exclamation points!','Commas are decorative.','Capital letters are optional on Tuesdays.','Every word can be a noun if you believe hard enough.','Punctuation is just confetti.'],
    science:['Plants eat pizza.','The moon is just the sun at night.','Gravity is a rumor.','Water freezes at burrito degrees.','Dinosaurs invented Wi‑Fi.'],
    geography:['Ohio is a planet.','Africa is next to Walmart.','The Pacific Ocean is behind my house.','Florida is upside down California.','North is wherever Glorp points.'],
    reading:['I skipped the words and still know it.','The answer is probably cheeseburger.','Reading is just looking until a hotdog appears.','I read one word. That counts.'],
    vocabulary:['That word means extra potato.','Clearly it means a fancy hotdog.','I use that word all the time, probably.','The definition is definitely chicken nugget.'],
    time:['Three o’clock is nacho time.','The clock says bedtime forever.','Elapsed time is however long a pizza takes.','The answer is nap o’clock.'],
    calendar:['There are seventeen months.','Hotdogtober comes after Tuesday.','Every day is Friday if you believe.','The next holiday is Cheeseburger Day.'],
    general:['The answer is definitely cheeseburger.','Glorp knows this one: hotdog.','Obvious. It is Tuesday.','Pretty sure the answer is potato.']
  },
  professorJokeChecks:['Glorp, that is a cheeseburger.','That is a joke answer. Let us use the real one.','Creative, but wildly incorrect.','Please do not learn mathematics from my brother.'],
  angry:['Stop knowing things!','Who wrote these questions?!','This game is cheating!'],
  furious:['This game is cheating!','Professor! Make them less smart!','No! No! No! I demand a rematch!'],
  meltdown:['No! No! No! I demand a rematch!','I was going to say that.','Fine. Maybe you are a little smart.'],
  professor:['Ahem. Your Professor is ready. My brother is, regrettably, also here.','Observe carefully, scholar. Glorp has promised not to eat the lesson.','Let us learn something before my brother declares another potato emergency.'],
  reviewCorrect:['Excellent work. Please ignore my brother sulking in the corner.','Very good. Glorp, that was called learning.','Correct. I am proud of you. My brother will recover eventually.'],
  reviewWrong:['Not quite. Let us examine it together.','A useful mistake. We can learn from this one.','Let us try that idea again, one step at a time.']
};

export const cosmetics = [
  {id:'none',name:'Classic Glorp',unlockWins:0,icon:'🟢'},
  {id:'cowboy',art:'assets/ui/cosmetic-cowboy.svg',name:'Cowboy Hat',unlockWins:1,icon:'🤠'},
  {id:'sunglasses',art:'assets/ui/cosmetic-sunglasses.svg',name:'Sunglasses',unlockWins:2,icon:'😎'},
  {id:'chef',art:'assets/ui/cosmetic-chef.svg',name:'Chef Hat',unlockWins:3,icon:'👨‍🍳'},
  {id:'propeller',art:'assets/ui/cosmetic-propeller.svg',name:'Propeller Hat',unlockWins:5,icon:'🧢'},
  {id:'pirate',art:'assets/ui/cosmetic-pirate.svg',name:'Pirate Glorp',unlockWins:8,icon:'🏴‍☠️'}
];

export function subjectMeta(id){return subjects.find(s=>s.id===id)||subjects[0];}
