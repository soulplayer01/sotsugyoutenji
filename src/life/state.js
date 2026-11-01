import { events, getEvent, temperaments, tendencies, routes } from './scenarios.js';
export const initialLife = { screen:'start', profile:null, index:0, flags:{}, history:[], feedback:null };
export function lifeReducer(state, action) {
  if(action.type==='RESET') return { ...initialLife, flags:{}, history:[] };
  if(action.type==='SETUP') return {...state,screen:'setup'};
  if(action.type==='START') {
    const p=action.profile;
    if(!p || !Number.isInteger(p.age) || p.age<20 || p.age>60 || !['short','long','crop'].includes(p.appearance) || !temperaments.some(t=>t.id===p.temperament)) return state;
    return {...initialLife,screen:'play',profile:{...p},flags:{},history:[]};
  }
  if(action.type==='CHOOSE' && state.screen==='play' && !state.feedback) {
    const event=getEvent(state.index,state.profile,state.flags);
    const choice=event.options.find(o=>o.id===action.id);
    if(!choice) return state;
    return {...state,flags:{...state.flags,...choice.changes},feedback:choice,
      history:[...state.history,{eventId:event.id,stage:event.stage,age:event.age,place:event.place,title:event.title,text:event.text,choiceId:choice.id,label:choice.label,result:choice.result,tags:[...choice.tags],changes:{...choice.changes}}]};
  }
  if(action.type==='CONTINUE' && state.feedback) return {...state,feedback:null,index:Math.min(state.index+1,events.length-1),screen:state.index===events.length-1?'result':'play'};
  return state;
}
export function summarize(history) {
  return tendencies.map(category=>({category,count:history.filter(h=>h.tags.includes(category)).length,
    childhood:history.filter(h=>h.stage==='어린 시절'&&h.tags.includes(category)).length,
    teen:history.filter(h=>h.stage==='청소년기'&&h.tags.includes(category)).length,
    adult:history.filter(h=>h.stage==='성인기'&&h.tags.includes(category)).length}));
}
export function lifeReceipt(state) {
  return {version:'life-v2-prototype',locale:'ko',printerAvailable:false,currentAge:state.profile.age,route:routes[state.flags.route]?.label,history:state.history,occurrences:summarize(state.history),notice:'선택 태그의 등장 횟수이며 진단 점수나 성숙도 수치가 아닙니다.'};
}

