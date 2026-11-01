import {useReducer,useState,useRef} from 'react';
import {AnimatePresence,motion,MotionConfig} from 'motion/react';
import {traits,environments,careerLabels,getStory} from './narrative.js';
import {emptyGame,gameReducer,reflectionLines} from './gameState.js';
import Scene,{Character} from './Scene.jsx';
import TypedStory from './TypedStory.jsx';
function Setup({onStart}){
 const [age,setAge]=useState('25'),[gender,setGender]=useState('지정하지 않음'),[appearance,setAppearance]=useState('short'),[selected,setSelected]=useState([]);
 const toggle=t=>setSelected(old=>old.includes(t)?old.filter(x=>x!==t):old.length<3?[...old,t]:old);
 return <form className="setup-panel" onSubmit={e=>{e.preventDefault();onStart({age:Number(age),gender,appearance,traits:selected});}}><span className="overline">이야기를 시작하기 전에</span><h1>그때의 나를<br/>만나러 갈까요?</h1><label className="age-label">지금의 나이<input type="number" required min="20" max="60" value={age} onChange={e=>setAge(e.target.value)}/>세</label><p className="muted">20~60세 · 당시의 자신을 떠올리며 선택해주세요.</p>
 <fieldset><legend>성별</legend><div className="temperament-options">{['남성','여성','지정하지 않음'].map(g=><button type="button" key={g} aria-pressed={g===gender} onClick={()=>setGender(g)}>{g}</button>)}</div></fieldset>
 <fieldset><legend>캐릭터 외형</legend><div className="avatar-options">{[['short','짧은 머리'],['long','긴 머리'],['crop','단정한 머리']].map(([id,label])=><button type="button" aria-label={label} key={id} aria-pressed={id===appearance} onClick={()=>setAppearance(id)}><Character appearance={id}/><span>{label}</span></button>)}</div><p className="muted">성별과 외형은 별개예요. 어느 길이나 행동도 제한하지 않습니다.</p></fieldset>
 <fieldset><legend>어린 시절의 나를 표현하는 특성 · 2~3개</legend><div className="temperament-options">{traits.map(t=><button type="button" key={t} aria-pressed={selected.includes(t)} disabled={!selected.includes(t)&&selected.length===3} onClick={()=>toggle(t)}>{t}</button>)}</div><p className="muted" role="status">{selected.length}개 선택 · 미래의 행동을 정하는 유형이 아닙니다.</p></fieldset><button disabled={selected.length<2} className="solid-button" type="submit">일곱 살의 나로 시작하기 →</button></form>;
}
function Ending({state,onReset}){const first=state.history[0],last=state.history.at(-1);return <div className="life-result"><span className="overline">일곱 살부터 {state.profile.age}세까지</span><h1>지나온 시간,<br/>내가 고른 장면들.</h1><p className="result-lead">{environments[Number(state.environment)]}에서 출발해 {careerLabels[Number(state.career)]}의 시간을 살아봤어요. 이 기록은 이번 게임에서 당신이 고른 장면입니다.</p>
 <section className="memory-card"><h2>그때와 지금</h2><div className="comparison"><div><Character stage="어린 시절" appearance={state.profile.appearance}/><h3>{first.age}살의 나</h3><p>{first.label}</p></div><span>→</span><div><Character stage="성인기" appearance={state.profile.appearance}/><h3>{last.age}살의 나</h3><p>{last.label}</p></div></div>{reflectionLines(state.history).map((line,i)=><p className="muted" key={i}>{line}</p>)}</section>
 <section><h2>이번에 살아본 인생</h2><ol className="timeline">{state.history.map(h=><li key={h.id}><span className="timeline-age">{h.age}살</span><div><small>{h.stage} · {h.place}</small><h3>{h.title}</h3><p>{h.age}살의 당신이 고른 선택은 ‘{h.label}’입니다.</p><p className="muted">{h.result}</p></div></li>)}</ol></section>
 <section className="last-question"><span className="overline">나에게 남기는 질문</span><h2>당신은 어린 시절의 당신과 얼마나 달라졌나요?</h2><p>바뀐 모습도, 여전히 비슷한 모습도 당신의 시간입니다.</p></section><p className="muted">사건과 후속 이야기는 게임용 창작입니다. 리서치의 경험 기록과 구분하며, 이번 선택은 기존 행동 분류에 억지로 연결하지 않고 미분류로 보존합니다. 성격·성숙도 점수는 없습니다.</p><button className="solid-button" onClick={onReset}>다시 살아보기 ↗</button><p className="muted center">이번 설정과 기록을 모두 비우고 첫 화면으로 돌아갑니다.</p></div>;}
export default function NarrativeApp(){
 const [state,dispatch]=useReducer(gameReducer,emptyGame),[confirm,setConfirm]=useState(false);const focus=useRef(null);
 const row=state.schedule[state.index],event=row?getStory(row,state):null;
 const reset=()=>{dispatch({type:'RESET'});setConfirm(false);};
 const advance=()=>dispatch({type:'ADVANCE',id:row.id,phase:state.phase});
 const key=`${state.screen}-${row?.id||''}-${state.phase}`;
 return <MotionConfig reducedMotion="user"><main className="life-app"><AnimatePresence mode="wait" initial={false}><motion.div className="life-shell" key={key} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.18}} onAnimationComplete={()=>{focus.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}}><div ref={focus} tabIndex={-1} className="screen-focus"/>
 {state.screen==='start'&&<div className="life-start"><span className="overline">짧은 인생, 오래 남을 질문</span><h1>어른이 된 순간</h1><p className="opening-question">나는 언제부터 어른이 되었을까?</p><Scene event={{stage:'어린 시절',place:'공원'}} appearance="short"/><div className="start-copy"><p>어린 시절의 나부터 지금의 나까지.<br/>이번에는 어떤 시간을 살아볼까요?</p><p className="muted">그 나이의 자신을 떠올리며 골라보세요.<br/>정답도, 정해진 성장의 방향도 없습니다.</p></div><button className="solid-button" onClick={()=>dispatch({type:'SETUP'})}>나의 이야기 시작하기 →</button></div>}
 {state.screen==='setup'&&<Setup onStart={profile=>dispatch({type:'START',profile})}/>}
 {state.screen==='play'&&<><header className="life-header"><div><strong>{row.age}<small>살</small></strong><span>{row.stage}</span></div><div className="time-box"><span>{state.index+1} / {state.schedule.length} 장면</span><div className="time-track"><div style={{width:`${(state.index+1)/state.schedule.length*100}%`}}/></div></div><button className="text-button" onClick={()=>setConfirm(true)}>처음으로</button></header>
 <Scene event={event} appearance={state.profile.appearance} feedback={state.phase==='feedback'}/>
 <section className="story-panel" data-phase={state.phase}>
 {state.phase==='transition'?<div className="growth-scene"><span className="overline">다음 시기의 문턱</span><h1>{row.stage}</h1><p>조금 달라진 모습으로 새로운 시간을 만나봐요.<br/>마음까지 달라졌을지는 아직 알 수 없어요.</p><button className="solid-button" onClick={advance}>전환 건너뛰고 이야기로 →</button></div>:<><span className="overline">{row.stage}의 한 장면</span><h1>{event.title}</h1>
 {state.phase==='bridge'&&<TypedStory key={key} text={event.bridge} onNext={advance} nextLabel="이 장면으로 들어가기"/>}
 {state.phase==='event'&&<><p className="event-text">{event.text}</p><div className="story-choices">{event.options.map(o=><motion.button key={o.id} whileTap={{scale:.99}} onClick={()=>dispatch({type:'CHOOSE',id:row.id,phase:'event',choiceId:o.id})}>{o.label}<span aria-hidden="true">↗</span></motion.button>)}</div></>}
 {state.phase==='feedback'&&<div className="aftermath"><div className="chosen">✓ {state.choice.label}</div><TypedStory key={key} text={state.choice.result} onNext={advance} nextLabel={state.index===state.schedule.length-1?'지나온 시간 돌아보기':'다음 시기로'}/></div>}
 </>}
 </section></>}
 {state.screen==='result'&&<Ending state={state} onReset={reset}/>}
 </motion.div></AnimatePresence>
 {confirm&&<div className="reset-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={e=>{if(e.key==='Escape')setConfirm(false);if(e.key==='Tab'){e.preventDefault();document.querySelector(document.activeElement?.dataset.reset==='cancel'?'[data-reset="yes"]':'[data-reset="cancel"]')?.focus();}}}><div><h2 id="reset-title">이번 기록을 비울까요?</h2><p>나이, 설정, 모든 선택을 초기화합니다.</p><button autoFocus data-reset="cancel" className="solid-button" onClick={()=>setConfirm(false)}>계속 이어가기</button><button data-reset="yes" className="text-button" onClick={reset}>처음으로 돌아가기</button></div></div>}
 </main></MotionConfig>;
}
