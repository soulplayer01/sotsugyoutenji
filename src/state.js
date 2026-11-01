import { questions } from './data/questions.js';
export const initialState = { screen: 'intro', index: 0, answers: {}, pending: false };
export function reducer(state, action) {
  switch (action.type) {
    case 'START': return { ...state, screen: 'questions' };
    case 'SELECT':
      if (state.screen !== 'questions' || state.pending || !questions[state.index].options.some(option => option.id === action.id)) return state;
      return { ...state, pending: true, answers: { ...state.answers, [questions[state.index].id]: action.id } };
    case 'NEXT':
      if (state.screen !== 'questions' || !state.pending || (action.index !== undefined && action.index !== state.index)) return state;
      return state.index === questions.length - 1 ? { ...state, pending: false, screen: 'complete' } : { ...state, pending: false, index: state.index + 1 };
    case 'BACK':
      if (state.screen === 'complete') return { ...state, pending: false, screen: 'questions' };
      return state.index === 0 ? { ...state, pending: false, screen: 'intro' } : { ...state, pending: false, index: state.index - 1 };
    case 'RESET': return { ...initialState, answers: {} };
    default: return state;
  }
}
