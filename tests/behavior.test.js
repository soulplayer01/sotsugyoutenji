import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {stories, traits} from '../src/life/narrative.js';
import {emptyGame, gameReducer} from '../src/life/gameState.js';
import {behaviorGroups, choiceBehaviors, summarizeBehaviors, tendencies} from '../src/life/behaviorMap.js';
import {narrativeReceiptLines} from '../src/life/narrativeReceipt.js';
import {createReceiptHandler} from '../server/receipt-printer.js';

const profile = age => ({age, gender: '지정하지 않음', appearance: 'short', traits: traits.slice(0, 2)});
function play(age, pick = () => '0') {
 let s = gameReducer(gameReducer(emptyGame, {type: 'SETUP'}), {type: 'START', profile: profile(age)});
 let guard = 0;
 while (s.screen === 'play' && guard++ < 200) {
  const row = s.schedule[s.index], a = {id: row.id, phase: s.phase};
  s = s.phase === 'event' ? gameReducer(s, {...a, type: 'CHOOSE', choiceId: row.id === 'route' || row.id === 'reroute' ? '1' : pick(row.id)}) : gameReducer(s, {...a, type: 'ADVANCE'});
 }
 return s;
}

test('every mapped choice exists in the stories and points at a known behavior group', () => {
 for (const [eventId, map] of Object.entries(choiceBehaviors)) {
  assert.ok(stories[eventId], `unknown event ${eventId}`);
  for (const [choiceId, code] of Object.entries(map)) {
   assert.ok(stories[eventId].options.some(o => o.id === choiceId), `${eventId}:${choiceId}`);
   assert.ok(behaviorGroups[code], code);
  }
 }
 assert.ok(Object.values(behaviorGroups).every(g => g.tendency === null || tendencies.includes(g.tendency)));
 // B10·B12는 경향 연결을 검토 중이라 6경향 집계에 넣지 않습니다.
 assert.equal(behaviorGroups.B10.tendency, null);
 assert.equal(behaviorGroups.B12.tendency, null);
});

test('summary counts only scenes that offered a linked choice; no scores or rankings', () => {
 for (const age of [20, 26, 40, 60]) for (const pick of [() => '0', () => '1', () => '2', () => '3']) {
  const s = play(age, pick);
  assert.equal(s.screen, 'result');
  const summary = summarizeBehaviors(s.history);
  for (const item of [...summary.tendencies, ...summary.review]) {
   assert.ok(item.offered > 0 && item.chosen >= 0 && item.chosen <= item.offered);
   assert.equal(item.early.offered + item.adult.offered, item.offered);
   assert.equal(item.early.chosen + item.adult.chosen, item.chosen);
   assert.deepEqual(Object.keys(item).filter(k => /score|rank|percent|ratio/i.test(k)), []);
  }
  assert.ok(summary.unlinked >= 0 && summary.unlinked <= s.history.length);
 }
});

test('chosen counts match the recorded choices exactly', () => {
 const s = play(40, id => (id === 'tired' ? '0' : id === 'play' ? '1' : '3'));
 const summary = summarizeBehaviors(s.history);
 const responsibility = summary.tendencies.find(t => t.name === '책임');
 assert.equal(responsibility.chosen, 2); // play:1 (B02), tired:0 (B02)
 assert.equal(responsibility.early.chosen, 1);
 assert.equal(responsibility.adult.chosen, 1);
 assert.ok(summary.review.find(r => r.code === 'B10')); // tired offered B10 even though it was not chosen
 assert.equal(summary.review.find(r => r.code === 'B10').chosen, 0);
});

test('receipt lines reflect the real history and contain no judgement', () => {
 const s = play(26);
 const lines = narrativeReceiptLines(s);
 assert.equal(lines[0], '어른이 된 순간');
 assert.ok(lines.includes('7살 → 26살'));
 for (const h of s.history) assert.ok(lines.includes(`${h.age}살 ${h.label}`));
 assert.ok(lines.some(l => l.includes('점수나 순위, 성숙도 판정은 없어요.')));
});

const payload = {id: 'b'.repeat(32), raster: Buffer.alloc(48 * 400).toString('base64'), height: 400};
function request(handler, body) {
 return new Promise(resolve => {
  const req = Readable.from([JSON.stringify(body)]);
  req.url = '/api/receipt'; req.method = 'POST';
  req.headers = {origin: 'http://localhost:5173', host: 'localhost:5173', 'content-type': 'application/json'};
  let status;
  handler(req, {writeHead(code) {status = code;}, end(data) {resolve({status, body: JSON.parse(data)});}}, () => {});
 });
}
test('narrative receipt (image only, no scores) is accepted; malformed scores are still rejected', async () => {
 let calls = 0;
 const handler = createReceiptHandler({printer: 'Receipt58', run: async () => {calls++;}});
 assert.equal((await request(handler, payload)).status, 200);
 assert.equal((await request(handler, payload)).status, 200);
 assert.equal(calls, 1);
 assert.equal((await request(createReceiptHandler({printer: 'Receipt58', run: async () => {}}), {...payload, id: 'c'.repeat(32), scores: []})).status, 400);
});
