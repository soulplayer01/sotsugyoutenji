import source from './adult_moment_questions_ko.json' with { type: 'json' };
export const categories = source.categories;
export const dataVersion = source.version;
// Only stable UI IDs are added. All source text, values and mappings stay intact.
export const questions = source.questions.map(question => ({
  ...question,
  options: question.options.map((option, index) => ({ ...option, id: `q${question.id}-o${index}` })),
}));
