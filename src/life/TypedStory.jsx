import {useEffect,useState,useRef} from 'react';
import {useReducedMotion} from 'motion/react';
export default function TypedStory({text,onNext,nextLabel='이야기 이어가기',automatic=false,displayOnly=false,paused=false}){
 const reduced=useReducedMotion();const [count,setCount]=useState(reduced?text.length:0);const lock=useRef(false);const done=count>=text.length;
 useEffect(()=>{setCount(reduced?text.length:0);lock.current=false;if(reduced)return;const timer=setInterval(()=>setCount(n=>Math.min(text.length,n+2)),24);return()=>clearInterval(timer);},[text,reduced]);
 const nextRef=useRef(onNext);nextRef.current=onNext;
 useEffect(()=>{if(!automatic||!done||paused)return;const timer=setTimeout(()=>{if(lock.current)return;lock.current=true;nextRef.current?.();},Math.max(2500,Math.min(6000,text.length*55)));return()=>clearTimeout(timer);},[automatic,done,paused,text]);
 const advance=()=>{if(lock.current)return;if(!done){setCount(text.length);return;}lock.current=true;onNext();};
 return <div className="typed-story"><p className="typed-text" aria-label={text} onClick={()=>setCount(text.length)}><span aria-hidden="true">{text.slice(0,count)}{!done&&<span className="type-cursor">▍</span>}</span></p>{!automatic&&!displayOnly&&<button className="solid-button" onClick={advance}>{done?nextLabel:'문장 바로 보기'}<span aria-hidden="true">→</span></button>}<p className="muted">{done?(automatic?'잠시 후 다음 장면으로 이어집니다.':displayOnly?'마음에 가까운 선택을 골라주세요.':'준비되면 다음으로 넘어가세요.'):'누르거나 터치하면 전체 문장이 바로 나타나요.'}</p></div>;
}
