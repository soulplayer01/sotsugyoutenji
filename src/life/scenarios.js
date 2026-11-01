export const tendencies = ['책임', '자립', '타인배려', '감정조절', '미래지향', '사회·역할'];
export const temperaments = [
  { id: 'curious', label: '호기심이 많았다', voice: '처음 보는 것 앞에서 눈이 반짝이던 아이. 오늘은 어떤 장면을 만나게 될까요?' },
  { id: 'quiet', label: '조용하고 신중했다', voice: '한 걸음 떨어져 천천히 살펴보던 아이. 서두르지 않고 기억을 걸어봐요.' },
  { id: 'social', label: '사람들과 어울리기 좋아했다', voice: '누군가와 함께할 때 신이 나던 아이. 기억 속 사람들을 다시 만나봐요.' },
  { id: 'determined', label: '하고 싶은 것은 꼭 해보려 했다', voice: '마음먹은 것을 직접 해보고 싶던 아이. 그 마음은 어디로 이어졌을까요?' },
];
export const routes = {
  college: { label: '대학 진학', place: '캠퍼스', group: '수업에서 만난 동료', task: '함께 준비하는 발표' },
  work: { label: '취업', place: '일터', group: '새로 만난 동료', task: '함께 맡은 업무' },
  explore: { label: '아르바이트와 경험 탐색', place: '동네 카페', group: '함께 일하는 사람', task: '새롭게 맡은 일' },
  pause: { label: '아직 고민하는 시간', place: '동네 도서관', group: '동네 모임에서 만난 사람', task: '함께 준비하는 작은 모임' },
};
const option = (id, label, result, tags = [], changes = {}) => ({ id, label, result, tags, changes });
// Authored prototype fiction based on supplied definitions; no empirical claims.
export const events = [
  { id:'play', stage:'어린 시절', age:7, place:'놀이터', title:'조금만 더 놀고 싶은 날', text:'집에 가기로 한 시간이 다가와요. 친구가 마지막으로 한 번만 더 놀자고 손을 잡습니다.', options:[
    option('promise','약속한 시간에 돌아간다','아쉬워서 몇 번이나 뒤돌아봤어요. 집 앞에 도착하자 기다리던 사람이 손을 흔들어요.',['책임'],{anchor:'promise'}),
    option('ask','집에 연락해 조금 늦어도 되는지 묻는다','혼자 정하지 않고 이야기를 나눴어요. 조금 더 놀 수 있는 시간이 생겼습니다.',['사회·역할'],{anchor:'talk'}),
    option('play','이번 놀이를 마치고 내 마음을 설명한다','놀이를 마친 뒤 늦어진 이유를 이야기했어요. 즐거움과 약속을 함께 생각한 하루였어요.',['자립'],{anchor:'freedom'}),
  ]},
  { id:'friend',stage:'어린 시절',age:10,place:'교실',title:'비어 있는 옆자리',text:'쉬는 시간, 새로 온 친구가 혼자 앉아 있어요. 나는 하던 놀이가 한창 재미있습니다.',options:[
    option('invite','함께 놀자고 말을 건넨다','그 친구가 고개를 들었어요. 둘은 놀이의 규칙부터 천천히 나눴습니다.',['타인배려'],{connection:true}),
    option('later','놀이를 마친 뒤 조용히 다가간다','사람들이 돌아간 교실에서 말을 건넸어요. 조용한 대화도 나쁘지 않았습니다.',['감정조절'],{connection:true}),
    option('watch','친구가 원하는지 조금 더 살펴본다','오늘은 멀리서 눈인사만 했어요. 상대의 속도를 알아가는 시간도 필요하겠지요.',['타인배려'],{connection:false}),
  ]},
  { id:'broken',stage:'어린 시절',age:12,place:'집',title:'부서진 작은 물건',text:'가족이 아끼는 물건을 실수로 떨어뜨렸어요. 조각을 손에 들고 잠깐 망설입니다.',options:[
    option('tell','무슨 일이 있었는지 먼저 이야기한다','목소리가 조금 떨렸지만 상황을 말했어요. 함께 조각을 정리했습니다.',['책임'],{help:'together'}),
    option('repair','고칠 방법을 찾아본 뒤 이야기한다','접착제와 설명서를 찾아봤어요. 고칠 수 있는 부분과 없는 부분을 알게 됐습니다.',['자립'],{help:'alone'}),
    option('breathe','놀란 마음을 가라앉히고 도움을 구한다','숨을 고르고 불렀어요. 도움을 받으며 다음에 조심할 것을 생각했습니다.',['감정조절'],{help:'together'}),
  ]},
  { id:'club',stage:'청소년기',age:14,place:'교실',title:'어느 문을 열어볼까',text:'새 학기 동아리를 고르는 날. 친한 친구가 가는 곳과 내가 궁금한 곳이 달라요.',options:[
    option('own','궁금했던 동아리에 혼자 가본다','낯선 문을 열었어요. 조금 어색하지만 새로 배울 것이 눈에 들어옵니다.',['자립']),
    option('friend','친구와 함께할 동아리를 선택한다','익숙한 얼굴 옆에서 새로운 일을 시작했어요. 함께 보내는 시간이 늘었습니다.',['타인배려']),
    option('visit','두 곳을 둘러보고 오래 해볼 곳을 고른다','오늘 바로 정하지 않고 둘러봤어요. 앞으로의 일주일을 상상해 봅니다.',['미래지향']),
  ]},
  { id:'message',stage:'청소년기',age:16,place:'방',title:'짧은 문장, 긴 마음',text:'친구가 보낸 메시지가 유난히 날카롭게 느껴져요. 답장을 쓰다가 지웁니다.',options:[
    option('listen','무슨 일이 있었는지 물어본다','화면 너머의 하루를 들었어요. 같은 문장도 조금 다르게 보입니다.',['타인배려']),
    option('wait','휴대폰을 내려놓고 마음을 정리한다','잠시 걸었다 돌아왔어요. 하고 싶은 말을 조금 짧고 차분하게 적습니다.',['감정조절']),
    option('say','내가 어떻게 느꼈는지 솔직히 말한다','내 마음을 감추지 않고 전했어요. 둘은 서로 다른 뜻으로 읽었다는 걸 알게 됩니다.',['자립']),
  ]},
  { id:'future',stage:'청소년기',age:18,place:'집',title:'기대와 내 생각 사이',text:'앞으로 무엇을 할지 이야기하는 저녁. 주변에서 여러 조언이 들려오지만 내 마음은 아직 복잡해요.',options:[
    option('research','가능한 길을 적고 직접 알아본다','작은 목록을 만들었어요. 막연하던 길이 몇 개의 구체적인 질문으로 바뀝니다.',['미래지향'],{planning:true}),
    option('talk','내 생각과 걱정을 함께 나눈다','쉽게 결론이 나지는 않았어요. 그래도 서로 무엇을 걱정하는지 알게 됐습니다.',['사회·역할'],{planning:false}),
    option('try','짧게 경험해 보고 결정하겠다고 말한다','직접 겪어볼 시간을 만들었어요. 아직 모른다는 말도 나의 선택이 되었습니다.',['자립'],{planning:false}),
  ]},
  { id:'route',stage:'성인기',age:19,place:'갈림길',title:'나의 다음 장',text:'지금부터 어떤 시간을 살아볼까요? 어느 길도 더 어른다운 길은 아닙니다. 이 선택은 점수나 성향에 반영되지 않아요.',options:Object.entries(routes).map(([id,r])=>option(id,r.label,`${r.place}에서 다음 장을 시작합니다. 새로운 역할도, 아직 모르는 것도 생기겠지요.`,[],{route:id})) },
  { id:'shared',stage:'성인기',place:'route',title:'처음 함께 맡은 일',text:'약속한 날이 가까워지는데 함께 맡은 일이 아직 끝나지 않았어요.',options:[
    option('finish','내가 맡은 부분을 먼저 마무리한다','끝낸 부분을 공유했어요. 남은 일이 조금 더 선명하게 보입니다.',['책임']),
    option('ask','어디가 어려운지 서로 물어본다','각자 멈춰 있던 이유를 나눴어요. 일을 나누는 방식이 조금 바뀌었습니다.',['타인배려']),
    option('coordinate','함께 할 일과 순서를 다시 정한다','종이에 순서를 적었어요. 혼자 들고 있던 걱정이 공동의 계획이 됩니다.',['사회·역할']),
  ]},
  { id:'weekend',stage:'성인기',place:'공원',title:'비어 있는 하루',text:'오랜만에 하루가 비었어요. 즐기고 싶은 일도, 미뤄둔 준비도 떠오릅니다.',options:[
    option('rest','아무 계획 없이 쉬어본다','느리게 걷고 좋아하는 것을 먹었어요. 몸과 마음의 속도가 조금 맞춰졌습니다.',['감정조절']),
    option('prepare','앞으로 필요한 준비를 조금 해둔다','작은 일 하나를 끝냈어요. 미래의 나에게 여유를 조금 남겨둡니다.',['미래지향']),
    option('people','생각나던 사람과 시간을 보낸다','서로의 일상을 들었어요. 특별한 일은 없어도 함께한 시간이 남았습니다.',['타인배려']),
  ]},
  { id:'difficulty',stage:'성인기',place:'route',title:'혼자 들기에는 무거운 날',text:'새로운 일이 생각만큼 잘되지 않아요. 도움을 청할까, 조금 더 해볼까 망설입니다.',options:[
    option('alone','방법을 바꾸어 한 번 더 해본다','익숙한 방법을 내려놓았어요. 아직 서툴러도 내 방식이 조금 생깁니다.',['자립'],{adultHelp:'alone'}),
    option('together','누군가에게 지금의 어려움을 말한다','막힌 부분을 말로 꺼냈어요. 함께 살펴보니 다음 한 걸음이 보입니다.',['사회·역할'],{adultHelp:'together'}),
    option('pause','잠시 멈추고 다시 시작할 때를 정한다','오늘의 한계를 인정했어요. 쉬는 시간도 내가 정하는 선택이었습니다.',['감정조절'],{adultHelp:'pause'}),
  ]},
  { id:'promise',stage:'성인기',place:'카페',title:'다시 찾아온 약속',text:'오랫동안 기다리던 초대가 왔어요. 그런데 그날은 먼저 잡아둔 약속이 있습니다.',options:[
    option('keep','먼저 한 약속을 지킨다','새 초대는 다음을 기약했어요. 기다리던 사람과 예정한 시간을 보냅니다.',['책임']),
    option('negotiate','서로 괜찮은 시간을 다시 찾아본다','각자의 사정을 나눴어요. 전부 가능하지 않아도 함께 정한 답이 남습니다.',['사회·역할']),
    option('choose','지금 더 원하는 것을 선택하고 설명한다','원하는 마음과 상대의 아쉬움을 함께 마주했어요. 다음 만남을 다시 이야기합니다.',['자립']),
  ]},
  { id:'today',stage:'성인기',place:'집',title:'오늘의 나에게',text:'하루가 저물고 조용한 시간이 생겼어요. 내일의 나에게 작은 것 하나를 남긴다면?',options:[
    option('plan','내일을 위한 작은 계획을 적는다','한 줄을 적었어요. 큰 답을 찾지 않아도 내일을 맞을 준비가 됩니다.',['미래지향']),
    option('care','소중한 사람에게 안부를 전한다','짧은 안부가 오갔어요. 서로의 하루에 작은 자리가 생깁니다.',['타인배려']),
    option('accept','오늘의 마음을 있는 그대로 적는다','잘한 일과 어려웠던 일을 함께 적었어요. 오늘의 나를 조금 더 알게 됩니다.',['감정조절']),
  ]},
];
export function getEvent(index, profile, flags = {}) {
  const base = events[index];
  const age = index < 7 ? base.age : 19 + Math.floor((profile.age - 19) * (index - 6) / 5);
  const route = routes[flags.route];
  let text = base.text;
  if (base.id === 'shared' && route) text = `${route.place}에서 ${route.group}과 ${route.task}을 맡았어요. ${text}`;
  if (base.id === 'difficulty') text = `${flags.help === 'alone' ? '어릴 때 부서진 물건을 직접 고쳐보려 했던 날이 떠올라요.' : '어릴 때 부서진 물건 앞에서 함께 도움을 나눴던 날이 떠올라요.'} ${text}`;
  if (base.id === 'promise') text = `${({promise:'일곱 살, 놀이터에서 약속을 지키러 돌아갔던 나.',talk:'일곱 살, 더 놀고 싶어 집에 연락했던 나.',freedom:'일곱 살, 놀이를 마치고 마음을 설명했던 나.'})[flags.anchor] || ''} ${text}`;
  if (base.id === 'weekend' && flags.planning) text = `열여덟 살에 길을 하나씩 적어보던 습관이 문득 떠올라요. ${text}`;
  return { ...base, age, place: base.place === 'route' ? route?.place || '동네' : base.place, text };
}
