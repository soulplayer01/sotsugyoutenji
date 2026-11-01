import test from 'node:test';
import assert from 'node:assert/strict';
import {events,getEvent,routes} from '../src/life/scenarios.js';
import {research} from '../src/life/research-scenarios.js';
import {initialLife,lifeReducer,summarize} from '../src/life/state.js';
test('source: 60 populated records, 12 groups, 6 definitions and exact membership counts',()=>{
 assert.equal(research.raw.length,60);assert.equal(research.behaviors.length,12);assert.equal(research.categories.length,6);
 const membership=research.behaviors.flatMap(b=>b.rawIds);assert.equal(new Set(membership).size,60);assert.equal(membership.length,60);
 for(const b of research.behaviors){assert.equal(b.count,b.rawIds.length);for(const id of b.rawIds)assert.equal(research.raw.find(r=>r.id===id).behavior,b.name);}
});
test('every choice traces to correct source group; all 12 groups offered; uncertain groups unscored',()=>{
 const offered=new Set();for(const e of events){assert.ok(e.provenance.kind.includes('fiction'));for(const o of e.options){if(e.id==='route'){assert.deepEqual(o.tags,[]);continue;}
 const b=research.behaviors.find(b=>b.id===o.behavior);assert.ok(b);offered.add(b.id);assert.ok(o.sourceIds.length);assert.ok(o.sourceIds.every(id=>b.rawIds.includes(id)));assert.deepEqual(o.tags,b.tags);if(['B10','B12'].includes(b.id)){assert.deepEqual(o.tags,[]);assert.equal(o.mappingStatus,'review');}}}assert.equal(offered.size,12);
});
test('all routes share actions, source codes, mapping and summary for each option position',()=>{
 for(let pick=0;pick<3;pick++) {let baseline;
 for(const route of Object.keys(routes)){let s=lifeReducer(initialLife,{type:'START',profile:{age:40,appearance:'short',temperament:'curious'}});
 for(let i=0;i<12;i++){const e=getEvent(i,s.profile,s.flags);s=lifeReducer(s,{type:'CHOOSE',id:i===6?route:e.options[pick].id});s=lifeReducer(s,{type:'CONTINUE'});}
 const comparable=s.history.filter(h=>h.eventId!=='route').map(h=>({id:h.eventId,behavior:h.behavior,tags:h.tags,sourceIds:h.sourceIds}));if(baseline)assert.deepEqual(comparable,baseline);else baseline=comparable;
 assert.equal(s.history.length,12);assert.ok(s.history.every(h=>h.provenance));if(pick===2){assert.ok(s.history.some(h=>h.mappingStatus==='review'));assert.ok(summarize(s.history).reduce((n,c)=>n+c.count,0)<11);}
 }}
});
