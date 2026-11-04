import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translate,ja,japaneseQuestions} from '../src/life/translations.js';
import {growthQuestions,growthInitial,growthReducer,growthScores,growthSchedule} from '../src/life/growth.js';
test('24 situations and 96 options translated; original strings and scoring data preserved',()=>{
 assert.equal(japaneseQuestions.length,24);assert.deepEqual(japaneseQuestions.map(q=>q[0]),growthQuestions.map(q=>q.id));
 for(const q of growthQuestions)for(const text of [q.text,...q.options.map(o=>o.label)]){assert.ok(ja[text]);assert.ok(!/[가-힣]/.test(translate(text)));assert.equal(translate(text,'ko'),text);}
 for(const row of japaneseQuestions)assert.equal(row.length,6);
});
test('all static active UI translations are covered, including accessibility and dynamic messages',()=>{
 for(const path of ['GrowthApp.jsx','NarrativeApp.jsx','Scene.jsx']){
 let src=readFileSync(`src/life/${path}`,'utf8');if(path==='NarrativeApp.jsx')src=src.slice(0,src.indexOf('function Ending'));
 for(const m of src.matchAll(/\bt\(["']([^"']+)["']\)/g))assert.ok(!/[가-힣]/.test(translate(m[1])),m[1]);
 }
 for(const text of ['20살의 나를 만나봅니다.','60살 당시의 자신을 떠올려 골라주세요.','어린 시절·청소년기 대비 -12.5입니다.','성인기 캐릭터'])assert.ok(!/[가-힣]/.test(translate(text)));
});
test('both languages finish 24 questions and produce exactly equal scores without mutating data',()=>{
 const before=JSON.stringify(growthQuestions),results=[];
 for(const language of ['ja','ko']){
 let state=growthReducer(growthInitial,{type:'START',profile:{age:40}});
 const schedule=growthSchedule(40);
 for(let i=0;i<24;i++){
 if(state.transition)state=growthReducer(state,{type:'READY',index:i});
 const q=schedule[i];translate(q.text,language);q.options.forEach(o=>translate(o.label,language));
 state=growthReducer(state,{type:'SELECT',id:q.options[i%4].id});state=growthReducer(state,{type:'NEXT',index:i});
 }
 assert.equal(state.screen,'result');results.push(growthScores(state.answers));assert.deepEqual(growthReducer(state,{type:'RESET'}),growthInitial);
 }
 assert.deepEqual(results[0],results[1]);assert.equal(JSON.stringify(growthQuestions),before);
});
