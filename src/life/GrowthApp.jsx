import {LanguageContext,useTranslation} from './Language.jsx';
import {useEffect,useReducer,useRef,useState} from 'react';
import {motion,MotionConfig} from 'motion/react';
import {Setup} from './NarrativeApp.jsx';
import Scene from './Scene.jsx';
import {growthInitial,growthReducer,growthSchedule,growthScores} from './growth.js';

function Results({state,schedule,onReset}) {
 const t=useTranslation();
 const scores=growthScores(state.answers),highest=Math.max(...scores.map(s=>s.total));
 return <div className="life-result"><span className="overline">{t("성장형 검정 · 선택의 기록")}</span><h1>{t("당신이 어른이 되어온 방식")}</h1><p className="result-lead">{t("24개의 선택 속에서 드러난 변화와 일관성을 살펴보세요.")}</p>
 <section className="memory-card"><h2>{t("이번 응답에서 두드러진 경향")}</h2><p>{scores.filter(s=>s.total===highest).map(s=>t(s.category)).join(' · ')}</p><p className="muted">{t("높고 낮음은 성숙함의 우열이 아닙니다. 상황에 따라 선택은 달라질 수 있습니다.")}</p></section>
 <h2>{t("그때와 지금의 선택 경향")}</h2><p className="muted">{t("전체는 경향별 4문항, 어린 시절·청소년기는 2문항, 성인기는 2문항을 각각 0~100으로 환산했습니다.")}</p>
 <div className="count-list">{scores.map(s=><section key={t(s.category)} className="growth-score"><div className="count-label"><strong>{t(s.category)}{s.total===highest?t(' · 대표 경향'):''}</strong><span>{t("전체")} {s.total}</span></div><div className="count-track"><motion.div initial={{width:0}} animate={{width:`${s.total}%`}} transition={{duration:.6}}/></div><div className="growth-comparison"><span>{t("어린 시절·청소년기")} <b>{s.early}</b></span><span>{t("성인기")} <b>{s.adult}</b></span></div><p className="muted">{t(s.adult===s.early?'두 시기의 지표가 같습니다.':`어린 시절·청소년기 대비 ${s.adult>s.early?'+':''}${s.adult-s.early}입니다.`)}</p></section>)}</div>
 <p className="muted">{t("문항과 행동별 배점은 작품을 위해 새로 구성한 임시 규칙입니다. 연구 원자료의 문항이나 검증된 심리 진단이 아니며, 기억을 바탕으로 선택한 서로 다른 상황을 비교하는 참고 지표입니다. 변화의 원인이나 실제 성격을 단정하지 않습니다.")}</p>
 <details className="memory-card"><summary>{t("나이별 선택 기록 보기")}</summary><ol className="timeline">{schedule.map(q=><li key={q.id}><span className="timeline-age">{q.age}{t("살")}</span><div><small>{t(q.stage)}</small><p>{t(q.text)}</p><strong>{t(q.options.find(o=>o.id===state.answers[q.id]).label)}</strong></div></li>)}</ol></details>
 <section className="last-question"><h2>{t("당신은 어린 시절의 당신과 얼마나 달라졌나요?")}</h2><p>{t("달라진 선택도, 여전히 비슷한 선택도 자신의 경험을 떠올리는 단서가 될 수 있습니다.")}</p></section><button className="solid-button" onClick={onReset}>{t("다시 시작하기 →")}</button><p className="muted center">{t("설정과 선택 기록을 모두 초기화합니다.")}</p></div>;
}

function GrowthContent({language,setLanguage}){
 const t=useTranslation();
 useEffect(()=>{document.documentElement.lang=language;document.title=t('어른이 된 순간');},[language]);
 const [state,dispatch]=useReducer(growthReducer,growthInitial),focus=useRef(null);
 const schedule=state.profile?growthSchedule(state.profile.age):[],row=schedule[state.index];
 useEffect(()=>{if(state.screen!=='play'||(!state.pending&&!state.transition))return;const timer=setTimeout(()=>dispatch({type:state.pending?'NEXT':'READY',index:state.index}),state.pending?350:850);return()=>clearTimeout(timer);},[state.screen,state.pending,state.transition,state.index]);
 useEffect(()=>{focus.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});},[state.screen,state.index]);
 return <MotionConfig reducedMotion="user"><main className="life-app"><div className="life-shell"><div className="screen-focus" tabIndex={-1} ref={focus}/>
 {state.screen==='start'&&<div className="life-start"><div className="temperament-options language-options" aria-label="Language / 言語"><button type="button" lang="ja" aria-pressed={language==='ja'} onClick={()=>setLanguage('ja')}>日本語</button><button type="button" lang="ko" aria-pressed={language==='ko'} onClick={()=>setLanguage('ko')}>한국어</button></div><span className="overline">{t("성장형 검정 · 24개의 선택")}</span><h1>{t("어른이 된 순간")}</h1><p className="opening-question">{t("그 나이의 나라면 어떻게 행동했을까?")}</p><Scene event={{stage:'어린 시절',place:'공원'}} appearance="short"/><div className="start-copy"><p>{t("일곱 살부터 지금까지,")}<br/>{t("그때의 나를 떠올리며 선택해보세요.")}</p><p className="muted">{t("책임, 자립, 타인배려, 감정조절, 미래지향, 사회·역할.")}<br/>{t("여섯 경향의 변화와 일관성을 돌아보는 체험입니다.")}<br/>{t("정답이나 성숙도 판정은 없습니다.")}</p></div><button className="solid-button" onClick={()=>dispatch({type:'SETUP'})}>{t("나의 이야기 시작하기 →")}</button></div>}
 {state.screen==='setup'&&<Setup onStart={profile=>dispatch({type:'START',profile})}/>}
 {state.screen==='play'&&<><header className="life-header"><div><strong>{row.age}<small>{t("살")}</small></strong><span>{t(row.stage)}</span></div><div className="time-box"><span>{state.index+1} {t("/ 24 문항")}</span><div className="time-track" role="progressbar" aria-label={t('문항 진행')} aria-valuemin={0} aria-valuemax={24} aria-valuenow={state.index+1}><div style={{width:`${(state.index+1)/24*100}%`}}/></div></div></header><Scene event={row} appearance={state.profile.appearance}/>
 <motion.section key={`${row.id}-${state.transition}`} className="story-panel" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.15}}>
 {state.transition?<div className="growth-scene" role="status"><span className="overline">{t("새로운 시기의 나")}</span><h1>{t(row.stage)}</h1><p>{t(`${row.age}살의 나를 만나봅니다.`)}</p></div>:<><span className="overline">{t("그 나이의 나라면 어떻게 행동했을까?")}</span><p className="muted">{t(`${row.age}살 당시의 자신을 떠올려 골라주세요.`)}</p><h1 className="growth-question">{t(row.text)}</h1><div className="story-choices">{row.options.map(o=><motion.button key={o.id} whileTap={{scale:.99}} aria-pressed={state.answers[row.id]===o.id} disabled={state.pending} onClick={()=>dispatch({type:'SELECT',id:o.id})}>{t(o.label)}<span aria-hidden="true">{state.answers[row.id]===o.id?'✓':'↗'}</span></motion.button>)}</div></>}
 </motion.section></>}
 {state.screen==='result'&&<Results state={state} schedule={schedule} onReset={()=>dispatch({type:'RESET'})}/>}
 </div></main></MotionConfig>;
}

export default function GrowthApp(){const [language,setLanguage]=useState('ja');return <LanguageContext.Provider value={language}><GrowthContent language={language} setLanguage={setLanguage}/></LanguageContext.Provider>;}
