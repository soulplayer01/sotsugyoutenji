import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import source from '../src/data/adult_moment_questions_ko.json' with { type: 'json' };
import { questions, categories } from '../src/data/questions.js';
import { reducer, initialState } from '../src/state.js';
import { calculateResults } from '../src/scoring.js';
import { createPrintPayload } from '../src/print.js';

const answerAll = (value = 3) => Object.fromEntries(questions.map(q => [q.id, (q.type === 'reflection' ? q.options.find(o => o.value === value) : q.options[0]).id]));
const select = (state, option = 0) => reducer(state, { type: 'SELECT', id: questions[state.index].options[option].id });

test('source JSON exact hash and UI adapter preserves every text/value/mapping', () => {
  const hash = createHash('sha256').update(readFileSync(new URL('../src/data/adult_moment_questions_ko.json', import.meta.url))).digest('hex');
  assert.equal(hash, '1f4e74f70df8e97cec1501c54ab25e0b966d1ac10903dda9b7e67219e8d3a975');
  assert.equal(questions.length, 24);
  assert.equal(new Set(questions.map(q => q.id)).size, 24);
  assert.deepEqual(questions.map(q => ({ ...q, options: q.options.map(({ id, ...option }) => option) })), source.questions);
  assert.ok(questions.slice(0, 12).every(q => q.type === 'reflection' && q.options.length === 5));
  assert.ok(questions.slice(12).every(q => q.type === 'scenario' && q.options.length === 4));
  for (const category of categories) {
    assert.equal(questions.filter(q => q.type === 'reflection' && q.category === category).length, 2);
    assert.equal(questions.filter(q => q.type === 'scenario').flatMap(q => q.options).filter(o => o.category === category).length, 8);
  }
});

test('all 24 question transitions, result and reset', () => {
  let state = reducer(initialState, { type: 'START' });
  for (let index = 0; index < 24; index++) {
    assert.equal(state.index, index);
    assert.equal(reducer(state, { type: 'NEXT', index }), state);
    assert.equal(reducer(state, { type: 'SELECT', id: 'invalid' }), state);
    state = select(state);
    assert.equal(reducer(state, { type: 'SELECT', id: questions[index].options[1].id }), state);
    state = reducer(state, { type: 'NEXT', index });
  }
  assert.equal(state.screen, 'complete');
  assert.equal(calculateResults(state.answers).scores.length, 6);
  state = reducer(state, { type: 'BACK' });
  assert.equal(state.index, 23);
  assert.equal(state.pending, false);
  assert.deepEqual(reducer(state, { type: 'RESET' }), initialState);
});

test('back cancels pending advance, keeps answers and allows correction or same answer', () => {
  let state = select(reducer(initialState, { type: 'START' }));
  state = reducer(state, { type: 'NEXT', index: 0 });
  state = select(state);
  state = reducer(state, { type: 'BACK' });
  assert.equal(state.answers[1], questions[0].options[0].id);
  assert.equal(state.pending, false);
  assert.equal(reducer(state, { type: 'NEXT', index: 1 }), state);
  state = select(state, 4);
  assert.equal(state.answers[1], questions[0].options[4].id);
  assert.equal(reducer(state, { type: 'NEXT', index: 1 }), state);
  state = reducer(state, { type: 'BACK' });
  assert.equal(state.screen, 'intro');
  state = reducer(state, { type: 'START' });
  assert.equal(state.pending, false);
  assert.equal(select(state, 4).pending, true);
});

test('reflection normalization at 1, 3 and 5 uses equal weighting', () => {
  for (const [value, expected] of [[1, 0], [3, 50], [5, 100]]) {
    const result = calculateResults(answerAll(value));
    for (const score of result.scores) {
      assert.equal(score.reflectionSum, value * 2);
      assert.equal(score.reflectionScore, expected);
      assert.equal(score.finalScore, expected * 0.5 + score.selectedCount / 8 * 100 * 0.5);
      assert.ok(score.finalScore >= 0 && score.finalScore <= 100);
    }
  }
});

test('each of 48 scenario choices increments only its source category', () => {
  const base = answerAll();
  const previous = calculateResults(base);
  for (const q of questions.slice(12)) for (const option of q.options) {
    const result = calculateResults({ ...base, [q.id]: option.id });
    for (const score of result.scores) {
      const before = previous.scores.find(s => s.category === score.category);
      const delta = Number(option.category === score.category) - Number(q.options[0].category === score.category);
      assert.equal(score.selectedCount, before.selectedCount + delta);
      assert.equal(score.scenarioScore, score.selectedCount * 12.5);
      assert.equal(score.finalScore - before.finalScore, delta * 6.25);
    }
  }
});

test('scenario maximum 8 and minimum 0; six-way ties retain source order', () => {
  for (const category of categories) {
    const answers = answerAll(5);
    for (const q of questions.slice(12)) answers[q.id] = (q.options.find(o => o.category === category) || q.options[0]).id;
    const result = calculateResults(answers);
    assert.equal(result.scores.find(s => s.category === category).finalScore, 100);
    assert.deepEqual(result.representatives, [category]);
    for (const q of questions.slice(12)) answers[q.id] = q.options.find(o => o.category !== category).id;
    assert.equal(calculateResults(answers).scores.find(s => s.category === category).scenarioScore, 0);
  }
  const answers = answerAll(3);
  const wanted = ['책임','자립','타인배려','사회·역할','미래지향','감정조절','자립','타인배려','감정조절','책임','미래지향','사회·역할'];
  // Find a balanced allocation using source mappings, without assuming unavailable choices.
  const counts = Object.fromEntries(categories.map(c => [c, 0]));
  function allocate(i) {
    if (i === 24) return true;
    for (const o of questions[i].options) if (counts[o.category] < 2) {
      counts[o.category]++; answers[questions[i].id] = o.id;
      if (allocate(i + 1)) return true;
      counts[o.category]--;
    }
    return false;
  }
  assert.ok(allocate(12));
  const tied = calculateResults(answers);
  assert.deepEqual(tied.representatives, categories);
  assert.ok(tied.scores.every(s => s.finalScore === 37.5));
});

test('missing, cross-question and extra answers rejected; print payload is serializable', () => {
  assert.throws(() => calculateResults({}));
  const answers = answerAll();
  assert.throws(() => calculateResults({ ...answers, 1: questions[1].options[0].id }));
  assert.throws(() => calculateResults({ ...answers, extra: 'x' }));
  const payload = createPrintPayload(answers);
  assert.equal(payload.printingAvailable, false);
  assert.equal(payload.paperWidthMm, 58);
  assert.equal(payload.scores.length, 6);
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), payload);
});

