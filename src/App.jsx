import { useEffect, useReducer, useRef } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { questions } from './data/questions.js';
import Results from './Results.jsx';
import { initialState, reducer } from './state.js';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const heading = useRef(null);
  const { screen, index, answers, pending } = state;
  const question = questions[index];
  const selected = answers[question.id];

  useEffect(() => {
    if (!pending || screen !== 'questions') return;
    const timer = window.setTimeout(() => dispatch({ type: 'NEXT', index }), 500);
    return () => window.clearTimeout(timer);
  }, [pending, screen, index]);

  return <MotionConfig reducedMotion="user">
    <main className={`experience ${screen === 'questions' ? 'question-background' : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.section className={`screen screen-${screen}`} key={`${screen}-${index}`}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }} onAnimationComplete={() => { heading.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
          {screen === 'intro' && <>
            <div className="intro-heading"><span className="eyebrow">24개의 질문, 나를 돌아보는 시간</span>
              <h1 ref={heading} tabIndex={-1}>어른이 된<br /><span>순간.</span></h1>
            </div>
            <div className="speech-card"><p>나는 어떤 경험을 지나<br className="mobile-break" /> 조금씩 어른이 되었을까요?</p><p>24개의 질문을 따라,<br />내 안에 쌓인 작은 변화를 만나보세요.</p></div>
            <div className="guide-card"><p>정답도, 오답도 없어요.<br />지금 내 마음에 가까운 답을 골라주세요.</p><span>심리 진단이 아닌, 나의 경험을 돌아보는 체험입니다.</span></div>
            <button className="primary-button" onClick={() => dispatch({ type: 'START' })}>시작하기 <span aria-hidden="true">↗</span></button>
          </>}
          {screen === 'questions' && <>
            <header className="question-header flex items-center gap-5">
              <button className="back-button" aria-label={index === 0 ? '시작 화면으로 돌아가기' : '이전 질문으로 돌아가기'} onClick={() => dispatch({ type: 'BACK' })}>←</button>
              <div className="progress-track" role="progressbar" aria-label="답한 질문 수" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={Object.keys(answers).length}><motion.div animate={{ width: `${Object.keys(answers).length / questions.length * 100}%` }} /></div>
              <span className="question-count" aria-label={`${questions.length}개 중 ${index + 1}번째 질문`}>{index + 1} <span>/ {questions.length}</span></span>
            </header>
            <div className="question-card">
              <span className="eyebrow">{question.type === 'reflection' ? '나의 변화를 돌아보며' : '이런 순간의 나라면'}</span>
              <h1 ref={heading} tabIndex={-1}>{question.text}</h1>
              <p className="question-instruction" id="choice-help">{question.type === 'reflection' ? '지금의 나와 가장 가까운 답을 골라주세요.' : '내가 할 것 같은 행동을 하나 골라주세요.'}</p>
              <div className={`answer-grid ${question.type}`} role="group" aria-label="답변 선택" aria-describedby="choice-help">
                {question.options.map(option => <motion.button key={option.id} className={`answer-option ${selected === option.id ? 'selected' : ''}`}
                  aria-pressed={selected === option.id} disabled={pending} whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch({ type: 'SELECT', id: option.id })}>
                  <span>{option.label}</span><span className="check" aria-hidden="true">{selected === option.id ? '✓' : ''}</span>
                </motion.button>)}
              </div>
              <p className="selection-status" role="status">{pending ? '마음을 담았어요.' : '답을 선택하면 잠시 후 다음 질문으로 넘어갑니다.'}</p>
            </div>
          </>}
          {screen === 'complete' && <Results answers={answers} headingRef={heading} onBack={() => dispatch({ type: 'BACK' })} onReset={() => dispatch({ type: 'RESET' })} />}
        </motion.section>
      </AnimatePresence>
    </main>
  </MotionConfig>;
}
