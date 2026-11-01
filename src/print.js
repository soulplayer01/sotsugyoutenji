import { dataVersion, questions } from './data/questions.js';
import { categoryDetails, reflectionPrompt, resultNotice } from './data/results.js';
import { calculateResults, scoringRules } from './scoring.js';

// Printer-independent payload. No transport, device connection or print command yet.
export function createPrintPayload(answers) {
  const result = calculateResults(answers);
  return {
    schemaVersion: 1, title: '어른이 된 순간', questionDataVersion: dataVersion,
    intendedPrinter: 'POS-58', paperWidthMm: 58, printingAvailable: false,
    scoringRules: { ...scoringRules }, answerCount: questions.length,
    representatives: result.representatives.map(category => ({ category, ...categoryDetails[category] })),
    scores: result.scores.map(score => ({ ...score })),
    reflectionPrompt, notice: resultNotice,
  };
}
