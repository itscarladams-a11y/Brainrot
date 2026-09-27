import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProgressReport, createProgressPdf, reportFilename } from '../js/pdf-report.js';

const prefs={grade:4,subjectStats:{math:{correct:8,attempts:10}},gradeStats:{'4':{correct:8,attempts:10,subjects:{math:{correct:8,attempts:10}}}},skillStats:{},masteryStats:{'4:math:multiplication':{skillId:'4:math:multiplication',grade:4,subject:'math',skill:'multiplication',skillName:'Multiplication',attempts:8,correct:7,masteryScore:86,recentResults:[true,true,true]}},dailyStats:{'2026-09-24':{questions:5,correct:4,subjects:{math:{questions:5,correct:4}},grades:{'4':{questions:5,correct:4,subjects:{math:{questions:5,correct:4}}}}}},sessionHistory:[{date:'2026-09-24T12:00:00.000Z',grade:4,mode:'battle',subject:'math',score:4,total:5,bestStreak:3,adaptivePicks:1,difficultyProfile:'hard'}]};

test('progress PDF report model respects grade, period, and difficulty',()=>{
 const r=buildProgressReport(prefs,{grade:'4',rangeDays:'7',studentName:'Alex',now:new Date('2026-09-25T12:00:00Z')});
 assert.equal(r.studentName,'Alex');assert.equal(r.period.questions,5);assert.equal(r.period.accuracy,80);assert.equal(r.period.difficulty.hard,1);assert.equal(r.subjects[0].name,'Math');
});

test('progress PDF generator creates a valid PDF envelope and filename',()=>{
 const r=buildProgressReport(prefs,{grade:'4',rangeDays:'30',studentName:'Alex Student',now:new Date('2026-09-25T12:00:00Z')});
 const bytes=createProgressPdf(r),text=new TextDecoder().decode(bytes);
 assert.ok(text.startsWith('%PDF-1.4'));assert.ok(text.includes('Brainrot Academy Progress Report'));assert.ok(text.endsWith('%%EOF\n'));assert.equal(reportFilename(r),'Brainrot_Academy_Alex_Student_Progress_2026-09-25.pdf');
});
