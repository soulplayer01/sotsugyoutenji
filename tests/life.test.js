import test from 'node:test';
import assert from 'node:assert/strict';
import {events,getEvent,temperaments,routes} from '../src/life/scenarios.js';
import {initialLife,lifeReducer,summarize,lifeReceipt} from '../src/life/state.js';
const start=(age=25,temperament='curious',appearance='short')=>lifeReducer(initialLife,{type:'START',profile:{age,temperament,appearance}});
function finish(age,route,temperament='curious',appearance='short') {
 let s=start(age,temperament,appearance);
 for(let i=0;i<12;i++) {const e=getEvent(i,s.profile,s.flags);s=lifeReducer(s,{type:'CHOOSE',id:i===6?route:e.options[0].id});s=lifeReducer(s,{type:'CONTINUE'});}
 return s;
}
test('all ages 20–60 have 3 childhood, 3 teen, 6 adult scenes, monotonic ages and exact endpoint',()=>{
 for(let age=20;age<=60;age++) {const seq=events.map((_,i)=>getEvent(i,{age},{}));assert.equal(seq.length,12);assert.equal(seq.filter(e=>e.stage==='성인기').length,6);assert.equal(seq[11].age,age);seq.forEach((e,i)=>{assert.ok(e.age<=age);if(i)assert.ok(e.age>=seq[i-1].age);assert.ok(e.options.length>=2&&e.options.length<=4);});}
});
test('all routes, temperaments and appearances finish, preserve choices, reset, and do not bias tags',()=>{
 const baseline=summarize(finish(25,'college').history);
 for(const route of Object.keys(routes))for(const t of temperaments)for(const appearance of ['short','long','crop']) {
 const s=finish(25,route,t.id,appearance);assert.equal(s.screen,'result');assert.equal(s.history.length,12);assert.equal(s.flags.route,route);assert.equal(s.history[7].place,routes[route].place);assert.deepEqual(summarize(s.history),baseline);assert.deepEqual(s.history[6].tags,[]);assert.deepEqual(lifeReducer(s,{type:'RESET'}),initialLife);assert.doesNotThrow(()=>JSON.stringify(lifeReceipt(s)));}
});
test('childhood choices influence later narrative; reaction locks duplicate selections',()=>{
 let s=start();assert.equal(lifeReducer(s,{type:'CONTINUE'}),s);assert.equal(lifeReducer(s,{type:'CHOOSE',id:'bad'}),s);
 s=lifeReducer(s,{type:'CHOOSE',id:'ask'});assert.equal(s.history.length,1);assert.equal(lifeReducer(s,{type:'CHOOSE',id:'play'}),s);assert.match(getEvent(10,s.profile,s.flags).text,/연락했던/);
 assert.notEqual(getEvent(9,s.profile,{help:'alone'}).text,getEvent(9,s.profile,{help:'together'}).text);
 assert.notEqual(getEvent(8,s.profile,{planning:true}).text,getEvent(8,s.profile,{}).text);
});
test('invalid profiles rejected and no unrequested persistence',()=>{for(const age of [19,61,25.5,NaN])assert.equal(start(age),initialLife);assert.equal(start(25,'bad'),initialLife);assert.equal(start(25,'curious','bad'),initialLife);assert.equal(summarize(finish(60,'pause').history).reduce((n,c)=>n+c.count,0),11);});
