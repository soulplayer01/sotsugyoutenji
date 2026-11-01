import { motion } from 'motion/react';
import { calculateResults } from './scoring.js';
import { categoryDetails, reflectionPrompt, resultNotice } from './data/results.js';

export default function Results({ answers, headingRef, onBack, onReset }) {
  const result = calculateResults(answers);
  return <>
    <header className="flex items-center justify-between"><button className="back-button" aria-label="마지막 질문으로 돌아가기" onClick={onBack}>←</button><span className="eyebrow">24개의 선택을 돌아보며</span></header>
    <div className="result-heading"><h1 ref={headingRef} tabIndex={-1}>당신이 어른이<br />되어온 방식</h1><p>24개의 선택 속에서 드러난 당신의 변화들을 살펴보세요.</p></div>
    <section className="representative-card" aria-labelledby="representative-title">
      <h2 id="representative-title">{result.representatives.length > 1 ? '함께 드러난 대표 경향' : '가장 두드러진 경향'}</h2>
      {result.representatives.map(category => <div className="representative" key={category}><span className="category-tag">{category}</span><h3>{categoryDetails[category].title}</h3><p>{categoryDetails[category].description}</p></div>)}
      <p className="result-small">지금의 답변에서 드러난 경향입니다. 당신을 하나의 성격으로 규정하지 않아요.{result.representatives.length > 1 && ' 가장 높은 점수가 같아 공동 대표로 표시했어요.'}</p>
    </section>
    <section className="score-card" aria-labelledby="scores-title"><h2 id="scores-title">내 안에 쌓인 여섯 가지 변화</h2>
      <p className="result-small">자기회상과 상황선택을 절반씩 반영한 지표 · 0~100점</p>
      <div className="score-list">{result.scores.map((score, index) => {
        const leading = result.representatives.includes(score.category);
        return <div className={`score-row ${leading ? 'leading' : ''}`} key={score.category}>
          <div className="score-label"><h3>{score.category}{leading && <span className="leading-tag">대표</span>}</h3><span>{score.finalScore.toFixed(1)}<small> / 100</small></span></div>
          <div className="score-track" role="meter" aria-label={score.category} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score.finalScore}><motion.div initial={{ width: 0 }} animate={{ width: `${score.finalScore}%` }} transition={{ duration: 0.65, delay: index * 0.06 }} /></div>
          <p>{categoryDetails[score.category].description}</p>
        </div>;
      })}</div>
      <details className="scoring-details"><summary>이 지표는 어떻게 계산하나요?</summary><p>자기회상 점수 = (두 문항 합계 − 2) ÷ 8 × 100</p><p>상황선택 점수 = 해당 성향 선택 횟수 ÷ 8 × 100</p><p>최종 점수 = 자기회상 점수 × 0.5 + 상황선택 점수 × 0.5</p><p>동점은 공동 대표로 표시합니다. 표시값만 소수 첫째 자리로 반올림하며, 순위는 반올림 전 값으로 정합니다.</p></details>
    </section>
    <aside className="result-notice">{resultNotice}</aside>
    <section className="speech-card reflection-ending"><h2>{reflectionPrompt}</h2><p>대단한 사건이 아니어도 괜찮아요.<br />그날의 장소와 함께 있던 사람, 작은 선택 하나를 떠올려보세요.</p></section>
    <section className="print-area" aria-labelledby="print-title"><h2 id="print-title">이 순간을 간직하기</h2><p id="print-status">레시트 출력은 준비 중입니다. 지금은 인쇄되지 않습니다.</p><button disabled aria-describedby="print-status">결과 출력 · 준비 중</button></section>
    <button className="primary-button" onClick={onReset}>체험을 마치고 처음으로 <span aria-hidden="true">↗</span></button>
    <p className="end-note">처음으로 돌아가면 모든 답변이 초기화됩니다. 답변은 외부로 전송하거나 저장하지 않습니다.</p>
  </>;
}
