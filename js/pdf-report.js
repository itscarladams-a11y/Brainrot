import { progressSnapshot, recommendedSkills, skillWeaknesses, masteryRecords } from './progress.js';
import { subjectMeta } from './content.js';
import { masteryBand } from './mastery.js';

const DAY=86400000;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pct=(correct,total)=>total?Math.round(correct/total*100):null;
const clean=s=>String(s??'').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/•/g,'-').replace(/[^\x20-\x7E]/g,'');
const humanize=s=>clean(s||'Practice').replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
const periodStart=(rangeDays,now)=>rangeDays==='all'?null:new Date(now.getTime()-(Math.max(1,Number(rangeDays)||30)-1)*DAY);
const inPeriod=(value,start)=>!start||new Date(value).getTime()>=start.getTime();

export function buildProgressReport(prefs,{grade='all',rangeDays='30',studentName='Student',now=new Date()}={}){
  const snap=progressSnapshot(prefs,grade),start=periodStart(rangeDays,now);
  const sessions=(prefs.sessionHistory||[]).filter(s=>(String(grade)==='all'||String(s.grade)===String(grade))&&inPeriod(s.date,start));
  let periodQuestions=0,periodCorrect=0;
  const subjectPeriod={};
  for(const [key,day] of Object.entries(prefs.dailyStats||{})){
    if(!inPeriod(`${key}T23:59:59`,start))continue;
    const node=String(grade)==='all'?day:day?.grades?.[String(grade)];
    if(!node)continue;
    periodQuestions+=node.questions||0;periodCorrect+=node.correct||0;
    for(const [subject,stats] of Object.entries(node.subjects||{})){
      subjectPeriod[subject]??={questions:0,correct:0};
      subjectPeriod[subject].questions+=stats.questions||0;
      subjectPeriod[subject].correct+=stats.correct||0;
    }
  }
  // Older saved data did not store grade-specific daily nodes. Fall back to completed sessions.
  if(String(grade)!=='all'&&periodQuestions===0&&sessions.length){
    periodQuestions=sessions.reduce((n,s)=>n+(s.total||0),0);
    periodCorrect=sessions.reduce((n,s)=>n+(s.score||0),0);
  }
  const quizSessions=sessions.filter(s=>s.mode==='quiz');
  const difficulty={normal:0,hard:0,extreme:0};
  sessions.forEach(s=>{difficulty[s.difficultyProfile||'normal']=(difficulty[s.difficultyProfile||'normal']||0)+1;});
  const subjects=Object.entries(subjectPeriod).map(([id,s])=>({id,name:subjectMeta(id).name,questions:s.questions,correct:s.correct,accuracy:pct(s.correct,s.questions)})).sort((a,b)=>b.questions-a.questions||a.name.localeCompare(b.name));
  const currentSubjects=Object.entries(snap.subjectStats||{}).map(([id,s])=>({id,name:subjectMeta(id).name,questions:s.attempts||0,correct:s.correct||0,accuracy:pct(s.correct||0,s.attempts||0)})).filter(x=>x.questions).sort((a,b)=>b.questions-a.questions||a.name.localeCompare(b.name));
  const mastery=masteryRecords(prefs,grade).sort((a,b)=>(b.attempts||0)-(a.attempts||0)||(a.masteryScore||0)-(b.masteryScore||0)).slice(0,10).map(r=>({subject:subjectMeta(r.subject).name,skill:r.skillName||humanize(r.skill),attempts:r.attempts||0,score:r.masteryScore||0,band:masteryBand(r).label}));
  const recs=recommendedSkills(prefs,grade,5);
  const recommendations=(recs.length?recs:skillWeaknesses(prefs,grade,5)).map(r=>({subject:subjectMeta(r.subject).name,skill:r.skillName||humanize(r.skill),score:r.masteryScore??r.accuracy??0}));
  const label=rangeDays==='all'?'All time':`Last ${Number(rangeDays)||30} days`;
  const gradeLabel=String(grade)==='all'?'All grades':`Grade ${grade}`;
  return {
    title:'Brainrot Academy Progress Report',studentName:clean(studentName).trim()||'Student',grade:String(grade),gradeLabel,periodLabel:label,
    generatedAt:new Date(now).toISOString(),period:{questions:periodQuestions,correct:periodCorrect,accuracy:pct(periodCorrect,periodQuestions),sessions:sessions.length,quizzes:quizSessions.length,quizAverage:quizSessions.length?Math.round(quizSessions.reduce((n,s)=>n+s.score/s.total*100,0)/quizSessions.length):null,difficulty},
    lifetime:{questions:snap.attempts,correct:snap.correct,accuracy:snap.accuracy,sessions:snap.sessions.length,quizAverage:snap.quizAverage,skillsTracked:snap.skillsTracked,skillsMastered:snap.skillsMastered,masteryAverage:snap.masteryAverage},
    subjects:subjects.length?subjects:currentSubjects,subjectScope:subjects.length?'Reporting-period activity':'Current cumulative performance',mastery,recommendations,
    recentSessions:sessions.slice(0,8).map(s=>({date:s.date,grade:s.grade,mode:s.mode,subject:s.subject==='mixed'?'Mixed Brain Battle':subjectMeta(s.subject).name,label:s.label||null,score:s.score,total:s.total,difficulty:s.difficultyProfile||'normal'}))
  };
}

function pdfEscape(s){return clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,maxChars=86){
  const words=clean(text).split(/\s+/).filter(Boolean),lines=[];let line='';
  for(const word of words){const next=line?`${line} ${word}`:word;if(next.length>maxChars&&line){lines.push(line);line=word;}else line=next;}
  if(line)lines.push(line);return lines.length?lines:[''];
}
function asciiBytes(s){return new TextEncoder().encode(s);}

export function createProgressPdf(report){
  const W=612,H=792,M=48;const pages=[];let ops=[],y=744;
  const newPage=()=>{if(ops.length)pages.push(ops.join('\n'));ops=[];y=744;};
  const ensure=(need=24)=>{if(y-need<48)newPage();};
  const text=(value,{size=10,bold=false,x=M,leading=null}={})=>{for(const line of wrapText(value,Math.max(24,Math.floor((W-x-M)/(size*.54))))){ensure((leading||size+4)+2);ops.push(`BT /${bold?'F2':'F1'} ${size} Tf 0.12 0.10 0.18 rg ${x} ${y} Td (${pdfEscape(line)}) Tj ET`);y-=leading||size+4;}};
  const line=()=>{ensure(12);ops.push(`0.78 0.74 0.86 RG 0.7 w ${M} ${y} m ${W-M} ${y} l S`);y-=12;};
  const section=label=>{ensure(34);y-=3;ops.push(`0.26 0.12 0.48 rg ${M} ${y-18} ${W-M*2} 24 re f`);ops.push(`BT /F2 11 Tf 1 1 1 rg ${M+10} ${y-11} Td (${pdfEscape(label.toUpperCase())}) Tj ET`);y-=34;};
  const metric=(label,value)=>{ensure(18);ops.push(`BT /F1 9 Tf 0.35 0.32 0.42 rg ${M} ${y} Td (${pdfEscape(label)}) Tj ET`);ops.push(`BT /F2 11 Tf 0.10 0.08 0.14 rg ${M+190} ${y} Td (${pdfEscape(value)}) Tj ET`);y-=17;};
  const row=(left,right)=>{ensure(18);ops.push(`BT /F1 9.5 Tf 0.15 0.12 0.20 rg ${M+6} ${y} Td (${pdfEscape(left)}) Tj ET`);ops.push(`BT /F2 9.5 Tf 0.15 0.12 0.20 rg ${W-M-150} ${y} Td (${pdfEscape(right)}) Tj ET`);y-=16;};

  // Header
  ops.push(`0.16 0.06 0.34 rg 0 704 ${W} 88 re f`);
  ops.push(`BT /F2 22 Tf 1 1 1 rg ${M} 752 Td (${pdfEscape(report.title)}) Tj ET`);
  ops.push(`BT /F1 10 Tf 0.90 0.85 1 rg ${M} 730 Td (Private, on-device learning summary) Tj ET`);
  y=684;
  metric('Student',report.studentName);metric('Grade view',report.gradeLabel);metric('Reporting period',report.periodLabel);metric('Generated',new Date(report.generatedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}));
  line();
  section('Activity summary');
  metric('Questions answered',String(report.period.questions));metric('Correct answers',String(report.period.correct));metric('Accuracy',report.period.accuracy==null?'Not enough data':`${report.period.accuracy}%`);metric('Completed sessions',String(report.period.sessions));metric('Quiz average',report.period.quizAverage==null?'No quizzes in period':`${report.period.quizAverage}%`);metric('Difficulty sessions',`Normal ${report.period.difficulty.normal||0}  |  Hard ${report.period.difficulty.hard||0}  |  Extreme ${report.period.difficulty.extreme||0}`);
  section('Subject report');text(report.subjectScope,{size:8.5});
  if(report.subjects.length){for(const s of report.subjects.slice(0,10))row(`${s.name} - ${s.questions} questions`,s.accuracy==null?'--':`${s.accuracy}%`);}else text('No subject activity has been recorded yet.',{size:9.5});
  section('Current skill mastery');
  if(report.mastery.length){for(const m of report.mastery)row(`${m.subject}: ${m.skill} (${m.attempts} attempts)`,`${m.score}% - ${m.band}`);}else text('Skill mastery will appear after the student completes more learning rounds.',{size:9.5});
  section('Recommended next practice');
  if(report.recommendations.length){report.recommendations.forEach((r,i)=>text(`${i+1}. ${r.subject}: ${r.skill} (${r.score}% current mastery/accuracy)`,{size:9.5}));}else text('Keep practicing across subjects. Professor Brainrot has no specific weak-skill recommendation yet.',{size:9.5});
  section('Recent completed sessions');
  if(report.recentSessions.length){for(const s of report.recentSessions){const d=new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});row(`${d} - ${s.label||s.subject} - ${String(s.difficulty).toUpperCase()}`,`${s.score}/${s.total}`);}}else text('No completed sessions in this reporting period.',{size:9.5});
  ensure(70);line();text('Academic note',{size:10,bold:true});text('Mastery reflects Brainrot Academy practice data and is intended as a progress aid, not a standardized assessment or school-issued grade.',{size:8.5});text('Privacy: This report was generated locally from progress stored on this device.',{size:8.5});
  newPage();

  const objects=[];
  // Catalog, pages, fonts
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  const pageIds=pages.map((_,i)=>5+i*2);
  objects[2]=`<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] >>`;
  objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  pages.forEach((content,i)=>{const pageId=5+i*2,contentId=pageId+1;objects[pageId]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;const len=asciiBytes(content).length;objects[contentId]=`<< /Length ${len} >>\nstream\n${content}\nendstream`;});
  let pdf='%PDF-1.4\n%BA-PDF\n',offsets=[0];
  for(let i=1;i<objects.length;i++){offsets[i]=asciiBytes(pdf).length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=asciiBytes(pdf).length;pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let i=1;i<objects.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  pdf+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return asciiBytes(pdf);
}

export function reportFilename(report){
  const who=clean(report.studentName||'Student').replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'Student';
  const date=String(report.generatedAt).slice(0,10);
  return `Brainrot_Academy_${who}_Progress_${date}.pdf`;
}

function bytesToBase64(bytes){let out='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)out+=String.fromCharCode(...bytes.subarray(i,i+chunk));return btoa(out);}
export function saveProgressPdf(report){
  const bytes=createProgressPdf(report),filename=reportFilename(report);
  if(typeof window!=='undefined'&&window.BrainrotNative?.savePdf){window.BrainrotNative.savePdf(filename,bytesToBase64(bytes));return {filename,native:true};}
  if(typeof document!=='undefined'){const blob=new Blob([bytes],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);return {filename,native:false};}
  return {filename,native:false,bytes};
}
