import { research } from './research-scenarios.js';
import {useReducer,useState,useRef} from 'react';
import {AnimatePresence,motion,MotionConfig} from 'motion/react';
import {events,getEvent,temperaments,routes} from './scenarios.js';
import {initialLife,lifeReducer,summarize} from './state.js';
import Scene,{Character} from './Scene.jsx';

function Setup({onStart}) {
 const [age,setAge]=useState('25'); const [appearance,setAppearance]=useState('short'); const [temperament,setTemperament]=useState('curious');
 return <form className="setup-panel" onSubmit={e=>{e.preventDefault();onStart({age:Number(age),appearance,temperament});}}>
 <span className="overline">이야기를 시작하기 전에</span><h1>그때의 나를<br/>만나러 갈까요?</h1>
 <label className="age-label">지금의 나이 <input type="number" min="20" max="60" required value={age} onChange={e=>setAge(e.target.value)}/> 세</label><p className="muted">20~60세 · 이야기는 일곱 살부터 지금까지 이어집니다.</p>
 <fieldset><legend>이야기 속 나의 모습</legend><div className="avatar-options">{[['short','짧은 머리'],['long','긴 머리'],['crop','단정한 머리']].map(([id,label])=><button type="button" key={id} aria-pressed={appearance===id} onClick={()=>setAppearance(id)}><Character appearance={id}/><span>{label}</span></button>)}</div><p className="muted">외형은 이야기의 경향이나 선택에 영향을 주지 않아요.</p></fieldset>
 <fieldset><legend>어린 시절의 나는…</legend><div className="temperament-options">{temperaments.map(t=><button type="button" key={t.id} aria-pressed={temperament===t.id} onClick={()=>setTemperament(t.id)}>{t.label}</button>)}</div></fieldset>
 <p className="muted">출발점일 뿐, 정해진 성격이나 미래는 아닙니다.</p><button className="solid-button" type="submit">일곱 살의 나로 시작하기 <span>→</span></button>
 </form>;
}
function LifeResult({state,onReset}) {
 const counts=summarize(state.history); const max=Math.max(...counts.map(c=>c.count),1); const repeated=counts.filter(c=>c.count>=2);
 const first=state.history[0],later=state.history[10]; const pending=state.history.filter(h=>h.mappingStatus==='review');
 return <div className="life-result"><span className="overline">일곱 살부터 {state.profile.age}세까지의 기록</span><h1>조금씩 달라지고,<br/>여전히 나인 채로.</h1><p className="result-lead">{routes[state.flags.route].label}의 길에서 만난 순간들. 당신이 고른 열두 장면을 한 권의 작은 기록으로 남겼어요.</p>
 <section className="memory-card"><h2>그때와 지금, 닮은 마음</h2><div className="comparison"><div><Character stage="어린 시절" appearance={state.profile.appearance}/><h3>{first.age}세 · 놀이와 약속</h3><p>{first.label}</p></div><span aria-hidden="true">→</span><div><Character stage="성인기" appearance={state.profile.appearance}/><h3>{later.age}세 · 다시 만난 약속</h3><p>{later.label}</p></div></div><p className="muted">두 장면에서 나는 무엇을 지키고 싶었을까요? 같은 선택도, 달라진 선택도 나의 이야기입니다.</p></section>
 <section className="memory-card"><h2>선택에 남은 여섯 가지 흔적</h2><p className="muted">선택에 연결된 태그의 등장 횟수예요. 점수나 성숙도가 아닙니다. 사건마다 선택 가능한 태그가 달라 성향의 높고 낮음을 비교하는 척도가 아닙니다.</p>
 <div className="count-list">{counts.map(c=><div key={c.category}><div className="count-label"><b>{c.category}</b><span>{c.count}회</span></div><div className="count-track"><motion.div initial={{width:0}} animate={{width:`${c.count/max*100}%`}} transition={{duration:.5}}/></div><p className="muted">{research.categories.find(r=>r.name===c.category)?.definition}</p><small>어린 시절 {c.childhood}회 · 청소년기 {c.teen}회 · 성인기 {c.adult}회</small></div>)}</div>
 <p className="muted">경향 연결 검토 중인 행동: {pending.length}회. 건강·자기 상태 관리와 한계 인정·도움 주고받기는 위 여섯 횟수에 임의로 넣지 않았습니다.</p><p>{repeated.length?`${repeated.map(c=>c.category).join(', ')}의 태그가 여러 장면에서 나타났어요.`:'서로 다른 마음이 여러 장면에 나뉘어 나타났어요.'} 한 가지 유형으로 당신을 정하지 않습니다.</p></section>
 <section><h2>내가 살아본 열두 장면</h2><ol className="timeline">{state.history.map(h=><li key={h.eventId}><span className="timeline-age">{h.age}세</span><div><small>{h.stage} · {h.place}</small><h3>{h.title}</h3><p>{h.label}</p><p className="muted">{h.result}</p><small>{h.behavior ? research.behaviors.find(b=>b.id===h.behavior)?.name : "진로 선택 · 경향 미반영"}</small><details className="research-note"><summary>이 장면의 리서치 근거</summary><p>게임용 창작 장면입니다. 나이·장소·대사·결과는 조사 사실이 아닙니다.</p>{h.sourceIds.map(id=><p key={id}>경험 #{id}: {research.raw.find(r=>r.id===id)?.text}<br/><small>{research.raw.find(r=>r.id===id)?.sourceRange}</small></p>)}{h.mappingStatus==="review"&&<p>이 행동의 6경향 연결은 원자료에서도 검토 중입니다.</p>}</details></div></li>)}</ol></section>
 <section className="memory-card"><h2>{state.profile.age}세, 지금의 내가 남긴 선택</h2><p>{state.history[11].label}</p><p className="muted">{state.history[11].result}</p></section><section className="last-question"><span className="overline">나에게 남기는 질문</span><h2>당신은 언제 어른이 되었다고 느꼈나요?</h2><p>어쩌면 당신은 아직도 그때의 당신과 닮아 있을지 모릅니다.</p></section>
 <p className="muted">제공된 리서치의 60개 경험과 12개 행동 분류를 참고해 창작한 시나리오입니다. 경험 기록과 게임 속 나이·대사·후속 결과는 구분됩니다. 심리 진단이나 성숙도 판정이 아닙니다. 실제 레시트 출력은 아직 제공하지 않습니다.</p><button className="solid-button" onClick={onReset}>기록을 비우고 처음으로 <span>↗</span></button><p className="muted center">다음 관람객을 위해 나이와 모든 선택 기록을 초기화합니다.</p></div>;
}
export default function LifeApp(){
 const [state,dispatch]=useReducer(lifeReducer,initialLife); const [confirm,setConfirm]=useState(false); const screenRef=useRef(null);
 const event=state.profile?getEvent(state.index,state.profile,state.flags):null;
 const reset=()=>{dispatch({type:'RESET'});setConfirm(false);};
 return <MotionConfig reducedMotion="user"><main className={`life-app ${state.screen==='play'?'playing':''}`}>
 <AnimatePresence mode="wait" initial={false}><motion.div className="life-shell" key={`${state.screen}-${state.screen==='play'?state.index:''}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.22}} onAnimationComplete={()=>{screenRef.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}}>
 <div ref={screenRef} tabIndex={-1} className="screen-focus"/>
 {state.screen==='start'&&<div className="life-start"><span className="overline">짧은 인생, 오래 남을 질문</span><h1>어른이 된 순간</h1><p className="opening-question">나는 언제부터 어른이 되었을까?</p><Scene event={{stage:'어린 시절',place:'공원'}} appearance="short"/><div className="start-copy"><p>사람은 어른의 흉내를 내는<br/>어린아이일지도 모릅니다.</p><p className="muted">일곱 살부터 지금까지, 열두 번의 선택.<br/>조금 달라진 나와 여전히 남아 있는 나를 만나보세요.</p></div><button className="solid-button" onClick={()=>dispatch({type:'SETUP'})}>나의 이야기 시작하기 <span>→</span></button><p className="muted center">약 3~5분 · 리서치 경험을 참고한 창작 이야기 · 심리 진단이 아닌 회상</p></div>}
 {state.screen==='setup'&&<Setup onStart={profile=>dispatch({type:'START',profile})}/>}
 {state.screen==='play'&&<><header className="life-header"><div><motion.strong key={event.age} initial={{opacity:0}} animate={{opacity:1}}>{event.age}<small>세</small></motion.strong><span>{event.stage}</span></div><div className="time-box"><span>{state.index+1} / 12 장면</span><div className="time-track"><div style={{width:`${(state.index+1)/12*100}%`}}/></div></div><button className="text-button" onClick={()=>setConfirm(true)}>처음으로</button></header>
 <Scene event={event} appearance={state.profile.appearance} feedback={state.feedback}/>
 <section className="story-panel"><span className="overline">{event.stage}의 한 장면</span><h1>{event.title}</h1>{state.index===0&&<p className="temperament-voice">{temperaments.find(t=>t.id===state.profile.temperament).voice}</p>}<p className="event-text">{event.text}</p>
 {!state.feedback?<div className="story-choices">{event.options.map(o=><motion.button key={o.id} whileTap={{scale:.99}} onClick={()=>dispatch({type:'CHOOSE',id:o.id})}>{o.label}<span aria-hidden="true">↗</span></motion.button>)}</div>:<motion.div className="aftermath" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}><div className="chosen">✓ {state.feedback.label}</div><p role="status">{state.feedback.result}</p><button className="solid-button" onClick={()=>dispatch({type:'CONTINUE'})}>{state.index===11?'지금의 나를 만나기':state.index===2?'청소년기로 걸어가기':state.index===5?'성인기로 걸어가기':'다음 장면으로'} <span>→</span></button></motion.div>}
 </section></>}
 {state.screen==='result'&&<LifeResult state={state} onReset={reset}/>}
 </motion.div></AnimatePresence>
 {confirm&&<div className="reset-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={e=>{if(e.key==='Escape')setConfirm(false);if(e.key==='Tab'){e.preventDefault();(document.activeElement?.dataset.reset==='cancel'?document.querySelector('[data-reset="yes"]'):document.querySelector('[data-reset="cancel"]'))?.focus();}}}><div><h2 id="reset-title">이야기를 처음부터 시작할까요?</h2><p>지금까지의 설정과 선택 기록이 모두 사라집니다.</p><button data-reset="cancel" autoFocus className="solid-button" onClick={()=>setConfirm(false)}>계속 이어가기</button><button data-reset="yes" className="text-button" onClick={reset}>기록을 비우고 처음으로</button></div></div>}
 </main></MotionConfig>;
}

