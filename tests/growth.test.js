import test from 'node:test';
import assert from 'node:assert/strict';
import {categories,growthQuestions as questions,growthSchedule,growthScores,growthInitial,growthReducer as reduce} from '../src/life/growth.js';
const answersFor=fn=>Object.fromEntries(questions.map((q,i)=>[q.id,q.options.find(o=>o.score===fn(i)).id]));
test('24 questions: four explicit behavioral scores; balanced six categories in both periods',()=>{
 assert.equal(questions.length,24);assert.equal(new Set(questions.map(q=>q.id)).size,24);
 for(const q of questions){assert.equal(q.options.length,4);assert.deepEqual(q.options.map(o=>o.score).sort(),[1,2,4,5]);assert.equal(new Set(q.options.map(o=>o.id)).size,4);}
 for(const category of categories){assert.equal(questions.slice(0,12).filter(q=>q.category===category).length,2);assert.equal(questions.slice(12).filter(q=>q.category===category).length,2);}
});
test('normalization: endpoints, period comparison and isolated category mapping',()=>{
 for(const score of [1,5])for(const row of growthScores(answersFor(()=>score)))for(const key of ['total','early','adult'])assert.equal(row[key],score===1?0:100);
 for(const row of growthScores(answersFor(i=>i<12?1:5)))assert.deepEqual([row.total,row.early,row.adult],[50,0,100]);
 for(const target of categories){const answers=answersFor(i=>questions[i].category===target?5:1);for(const row of growthScores(answers))assert.equal(row.total,row.category===target?100:0);}
 assert.throws(()=>growthScores({}));const invalid=answersFor(()=>1);invalid.c1='invalid';assert.throws(()=>growthScores(invalid));
});
test('20, 26, 40, 60: age placement, full play, growth, duplicate guards, reset',()=>{
 for(const age of [20,26,40,60]){
 const schedule=growthSchedule(age);assert.deepEqual(schedule.slice(0,12).map(q=>q.age),Array.from({length:12},(_,i)=>7+i));assert.equal(schedule.at(-1).age,age);
 schedule.forEach((q,i)=>{assert.ok(q.age<=age);if(i)assert.ok(q.age>=schedule[i-1].age);});
 let state=reduce(growthInitial,{type:'START',profile:{age,gender:'지정하지 않음',appearance:'short',traits:[]}}),transitions=0;
 for(let i=0;i<24;i++){
 assert.equal(state.index,i);assert.equal(state.screen,'play');
 if(state.transition){transitions++;assert.equal(reduce(state,{type:'SELECT',id:questions[i].options[0].id}),state);state=reduce(state,{type:'READY',index:i});}
 state=reduce(state,{type:'SELECT',id:questions[i].options[0].id});assert.equal(Object.keys(state.answers).length,i+1);
 assert.equal(reduce(state,{type:'SELECT',id:questions[i].options[1].id}),state);
 assert.equal(reduce(state,{type:'NEXT',index:i-1}),state);
 state=reduce(state,{type:'NEXT',index:i});assert.equal(reduce(state,{type:'NEXT',index:i}),state);
 }
 assert.equal(transitions,2);assert.equal(state.screen,'result');assert.equal(growthScores(state.answers).length,6);assert.equal(reduce(state,{type:'READY',index:23}),state);
 state=reduce(state,{type:'RESET'});assert.deepEqual(state,growthInitial);
 }
});
