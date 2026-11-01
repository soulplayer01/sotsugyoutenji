import { categories, questions } from './data/questions.js';

// Exploratory artwork index, not a psychometrically validated diagnostic score.
export const scoringRules = Object.freeze({ version: 'exploratory-50-50-v1', reflectionWeight: 0.5, scenarioWeight: 0.5, scenarioDenominator: 8 });
export function calculateResults(answers) {
  if (!answers || Object.keys(answers).length !== questions.length) throw new Error('24개 질문의 답변이 모두 필요합니다.');
  const totals = Object.fromEntries(categories.map(category => [category, { sum: 0, selectedCount: 0 }]));
  for (const question of questions) {
    const option = question.options.find(item => item.id === answers[question.id]);
    if (!option) throw new Error(`${question.id}번 질문의 답변이 올바르지 않습니다.`);
    if (question.type === 'reflection') totals[question.category].sum += option.value;
    else totals[option.category].selectedCount += 1;
  }
  const scores = categories.map(category => {
    const { sum, selectedCount } = totals[category];
    const reflectionScore = ((sum - 2) / 8) * 100;
    const scenarioScore = (selectedCount / scoringRules.scenarioDenominator) * 100;
    return { category, reflectionSum: sum, selectedCount, reflectionScore, scenarioScore,
      finalScore: reflectionScore * scoringRules.reflectionWeight + scenarioScore * scoringRules.scenarioWeight };
  });
  // Equal scores retain source category order; all equal maxima are representatives.
  scores.sort((a, b) => b.finalScore - a.finalScore || categories.indexOf(a.category) - categories.indexOf(b.category));
  return { scoringVersion: scoringRules.version, scores,
    representatives: scores.filter(item => item.finalScore === scores[0].finalScore).map(item => item.category) };
}
