import {traits,annualSchedule as makeSchedule,getStory} from './narrative.js';
export const emptyGame={screen:'start',profile:null,environment:null,career:null,initialCareer:null,schedule:[],index:0,phase:'event',history:[],choice:null};
export function gameReducer(s,a){
 if(a.type==='RESET')return {...emptyGame,history:[],schedule:[]};
 if(a.type==='SETUP'&&s.screen==='start')return {...s,screen:'setup'};
 if(a.type==='START'&&s.screen==='setup'){
 const p=a.profile;if(!p||!Number.isInteger(p.age)||p.age<20||p.age>60||!['남성','여성','지정하지 않음'].includes(p.gender)||!['short','long','crop'].includes(p.appearance)||!Array.isArray(p.traits)||new Set(p.traits).size!==p.traits.length||p.traits.length<2||p.traits.length>3||!p.traits.every(t=>traits.includes(t)))return s;
 return {...emptyGame,screen:'play',profile:{...p,traits:[...p.traits]},history:[],schedule:makeSchedule(p.age)};
 }
 if(s.screen!=='play')return s;
 const row=s.schedule[s.index];if(a.id!==row.id||a.phase!==s.phase)return s;
 if(a.type==='ADVANCE'){
 if(s.phase==='transition')return {...s,phase:row.quiet?'year':'event'};
 if(s.phase==='bridge')return {...s,phase:'event'};
 if(s.phase==='feedback'||s.phase==='year'){
 if(s.index===s.schedule.length-1)return {...s,screen:'result'};
 return {...s,index:s.index+1,choice:null,phase:row.stage!==s.schedule[s.index+1].stage?'transition':s.schedule[s.index+1].quiet?'year':'event'};
 }return s;
 }
 if(a.type==='CHOOSE'&&s.phase==='event'){
 const scene=getStory(row,s),choice=scene.options.find(o=>o.id===a.choiceId);if(!choice)return s;
 const environment=row.id==='environment'?choice.id:s.environment;
 const career=['route','reroute'].includes(row.id)?choice.id:s.career;
 const schedule=row.id==='route'?makeSchedule(s.profile.age,choice.id):s.schedule;
 return {...s,environment,career,initialCareer:row.id==='route'?choice.id:s.initialCareer,schedule,phase:'feedback',choice,
 history:[...s.history,{id:row.id,age:row.age,stage:row.stage,place:scene.place,title:scene.title,choiceId:choice.id,label:choice.label,result:choice.result,bridge:scene.bridge,variantKey:scene.variantKey,classification:'unclassified',tags:[],provenance:scene.provenance}]};
 }return s;
}
export function reflectionLines(history){
 const lines=[]; const childhood=history.find(h=>h.id==='play'),adult=history.find(h=>h.id==='tired');
 if(childhood&&adult)lines.push(`${childhood.age}살에는 ‘${childhood.label}’, ${adult.age}살에는 ‘${adult.label}’을 골랐어요. 서로 다른 상황에서 무엇이 같고 달랐는지는 당신만이 알 수 있어요.`);
 const alone=history.filter(h=>(h.id==='free'&&h.choiceId==='1')||(h.id==='social'&&h.choiceId==='2')||(h.id==='evening'&&h.choiceId==='2'));
 if(alone.length>=2)lines.push(`${alone.map(h=>h.age+'살').join(', ')}의 장면에서는 혼자 보내는 시간을 골랐어요. 익숙한 선택이 이어지는 것도 하나의 기록이에요.`);
 const travel=history.find(h=>h.id==='travel');if(travel)lines.push(`${travel.age}살에 고른 선택은 ‘${travel.label}’이었어요. 떠난 기억과 떠나지 않은 시간 모두 이 인생의 일부예요.`);
 lines.push('선택 몇 번으로 변화의 크기를 정할 수는 없어요. 달라진 마음이 있었는지, 그대로 남아 있는 마음이 있었는지 천천히 돌아봐요.');return lines;
}
