import research from './research.json' with { type: 'json' };
export { research };
// All scenes, ages, dialogue and outcomes below are authored adaptations, NOT quotations or observed life histories.
const choice=(id,behavior,sourceIds,label,result,changes={})=>({id,behavior,sourceIds,label,result,changes});
const revisions={
 play:{title:'집에 돌아갈 시간',text:'일곱 살, 놀이터에서 놀이가 한창이에요. 집에 돌아가기로 한 시간이 다가오는데 마지막 판이 남았습니다.',options:[
 choice('promise','B02',[25,57],'놀이를 여기서 마치고 약속한 시간에 간다','친구에게 다음을 기약하고 집으로 향했어요. 아쉬운 마음과 지킨 시간이 함께 남습니다.',{anchor:'promise'}),
 choice('ask','B02',[34],'늦어질 것 같다고 먼저 연락해 시간을 조정한다','기다리는 사람에게 지금 상황을 알렸어요. 언제 돌아갈지 다시 정했습니다.',{anchor:'talk'}),
 choice('play','B04',[20,35],'친구가 왜 더 하고 싶은지 먼저 들어본다','친구에게는 이 놀이를 마치고 싶은 이유가 있었어요. 이야기를 듣고 돌아갈 시간을 함께 생각합니다.',{anchor:'listen'}),
 ]},
 friend:{title:'점심시간의 빈자리',text:'열 살, 점심시간에 한 친구가 평소와 달리 조용합니다. 내가 하려던 놀이도 곧 시작해요.',options:[
 choice('invite','B05',[9,14],'놀이를 조금 미루고 친구 곁에 앉는다','친구 옆에 잠깐 머물렀어요. 많은 말을 하지 않아도 함께한 시간이 남습니다.',{connection:true}),
 choice('later','B04',[8,51],'무슨 일이 있었는지 물어보고 끝까지 듣는다','중간에 답을 정해주기보다 이야기를 들었어요. 친구가 겪은 하루를 조금 알게 됩니다.',{connection:true}),
 choice('watch','B01',[53],'오늘은 혼자 식사하고 내 시간을 보낸다','혼자 먹는 점심도 내 하루가 되었어요. 쉬는 시간을 내 속도로 보냅니다.',{connection:false}),
 ]},
 broken:{title:'내가 깨뜨린 물건',text:'열두 살, 가족이 쓰는 물건을 실수로 떨어뜨렸어요. 조각을 앞에 두고 어떻게 말할지 망설입니다.',options:[
 choice('tell','B03',[5],'내 실수라고 말하고 사과한 뒤 정리를 맡는다','실수를 말하고 조각을 함께 치웠어요. 무슨 일이 있었는지 숨기지 않았습니다.',{help:'together'}),
 choice('repair','B01',[12,23],'내가 고칠 수 있는지 방법을 찾아보고 이야기한다','고칠 방법을 찾아봤어요. 할 수 있는 부분과 어려운 부분을 나누어 설명했습니다.',{help:'alone'}),
 choice('breathe','B12',[40,41],'어떻게 해야 할지 모르겠다고 말하고 도움을 청한다','모른다는 말을 꺼내니 함께 살펴볼 수 있었어요. 도움받은 일을 기억해 둡니다.',{help:'together'}),
 ]},
 club:{title:'첫 동아리 모임 뒤',text:'열네 살, 처음 간 동아리에서 모임을 마쳤어요. 누군가는 놓고 간 물건을 찾고, 책상 위에는 함께 쓴 것들이 남아 있습니다.',options:[
 choice('own','B01',[12,47],'다음 모임 신청 안내를 직접 읽고 처리한다','신청에 필요한 것을 하나씩 확인했어요. 다음에는 어떻게 하면 될지 알게 됩니다.'),
 choice('friend','B11',[32,44],'놓고 간 물건을 맡기고 함께 쓴 자리를 정리한다','물건은 담당자에게 전하고 자리를 정돈했어요. 다음에 올 사람을 위한 공간이 남습니다.'),
 choice('visit','B09',[16,58],'다음 모임에 필요한 준비물을 적어 챙긴다','준비할 것들을 적었어요. 다음 모임 전에 꺼내볼 작은 목록이 생겼습니다.'),
 ]},
 message:{title:'전송하기 직전',text:'열여섯 살, 단체 대화방의 말이 날카롭게 느껴져요. 답장을 쓰다가 손을 멈춥니다.',options:[
 choice('listen','B04',[20,51],'상대가 어떤 뜻으로 말했는지 먼저 듣는다','처음 읽었을 때와 다른 이야기도 들렸어요. 같은 문장을 다시 바라봅니다.'),
 choice('wait','B07',[6,27],'즉시 답장하지 않고 진정한 뒤 대화한다','잠시 화면을 덮었어요. 감정이 가라앉은 뒤 하고 싶은 말을 골랐습니다.'),
 choice('say','B11',[43],'다른 사람을 험담하는 대화에는 참여하지 않는다','그 이야기에 말을 보태지 않았어요. 대화를 어디까지 이어갈지 내 선을 정합니다.'),
 ]},
 future:{title:'출발 전날의 식탁',text:'열여덟 살, 내일의 작은 여행을 준비합니다. 챙길 물건도 있고, 가족은 오랜만에 함께 밥을 먹자고 해요.',options:[
 choice('research','B09',[16,58],'이동 시간과 준비물을 적고 미리 챙긴다','목록을 보며 가방을 정리했어요. 내일 아침의 일을 조금 덜었습니다.',{planning:true}),
 choice('talk','B06',[24,50],'가족 식사 준비를 나누어 맡고 함께 시간을 보낸다','준비와 정리를 함께 맡았어요. 받기만 하던 자리에서 작은 역할을 나눴습니다.',{planning:false}),
 choice('try','B01',[23],'모르는 이동 경로를 직접 찾아 결정한다','길과 시간을 찾아 내 이동 방법을 정했어요. 필요한 질문도 함께 적어둡니다.',{planning:false}),
 ]},
 shared:{title:'함께 쓴 공간을 나서며',text:'오늘 함께 쓴 공간의 마무리가 남았어요. 먼저 가야 할 사람도 있고, 다음 이용자도 곧 도착합니다.',options:[
 choice('finish','B02',[15,55],'내가 맡았던 정리를 끝내고 나간다','내 몫을 마무리했어요. 늦어진 걸음 뒤로 정리된 자리가 남습니다.'),
 choice('ask','B05',[9],'시간이 부족한 사람의 정리를 나누어 돕는다','상대의 급한 사정을 듣고 시간을 조금 나눴어요. 함께 공간을 비웁니다.'),
 choice('coordinate','B11',[44,56],'사용 순서와 정리 방법을 맞추고 다음 사람에게 넘긴다','함께 지킬 순서를 확인했어요. 다음 이용자가 사용할 자리를 마련했습니다.'),
 ]},
 weekend:{title:'작은 여유의 쓰임',text:'이번 달에 쓸 수 있는 돈이 조금 남았어요. 갖고 싶던 물건도 떠오르고, 나중에 필요할 일도 생각납니다.',options:[
 choice('rest','B08',[10,17,46],'다음에 필요한 지출을 위해 일부를 남겨둔다','지금 쓸 돈과 남겨둘 돈을 나눴어요. 다음 달의 나에게 선택의 여지를 남깁니다.'),
 choice('prepare','B08',[48],'새로 사기 전에 가진 물건을 다시 살펴본다','다시 쓸 수 있는 것과 필요한 것을 나누었어요. 당장 정하지 않은 물건도 있습니다.'),
 choice('people','B06',[1,38],'가족이나 후배를 챙기는 데 일부를 쓴다','내가 받은 것을 떠올리며 작은 몫을 나눴어요. 얼마를 썼는지가 이 장면의 기준은 아닙니다.'),
 ]},
 difficulty:{title:'아는 것과 모르는 것 사이',text:'새롭게 맡은 일에서 자꾸 막혀요. 혼자 조금 더 해볼지, 모르는 것을 말할지 생각합니다.',options:[
 choice('alone','B01',[12,23],'필요한 정보를 직접 찾아 다른 방법으로 시도한다','방법을 바꾸어 다시 살펴봤어요. 내 힘으로 해결한 부분과 남은 부분이 보입니다.',{adultHelp:'alone'}),
 choice('together','B12',[40,41,60],'모르는 부분을 설명하고 도움을 요청한 뒤 감사한다','어려운 부분을 함께 살펴봤어요. 도움받은 일을 부끄러움 대신 감사로 기억합니다.',{adultHelp:'together'}),
 choice('pause','B10',[59],'지금의 한계를 인정하고 쉬었다 다시 시작한다','계속 밀어붙이는 대신 쉬는 시간을 골랐어요. 다시 시작할 여유를 마련합니다.',{adultHelp:'pause'}),
 ]},
 promise:{title:'먼저 정해둔 시간',text:'먼저 잡아둔 약속이 있는 날, 다른 일정과 피로가 겹쳤어요. 기다리는 사람에게 어떻게 할지 전해야 합니다.',options:[
 choice('keep','B02',[25,57],'먼저 한 약속에 맞춰 시간을 지킨다','약속한 시간에 도착했어요. 함께 보내기로 한 시간을 이어갑니다.'),
 choice('negotiate','B02',[34],'늦어질 상황을 먼저 알리고 시간을 다시 정한다','늦어진다는 말을 먼저 전했어요. 상대와 가능한 시간을 맞춥니다.'),
 choice('choose','B04',[20,35],'상대의 오늘 사정부터 듣고 어떻게 할지 의논한다','서로의 하루를 들었어요. 나와 상대에게 가능한 방법을 함께 생각합니다.'),
 ]},
 today:{title:'지금의 나에게 남기는 것',text:'하루가 저물었어요. 오늘의 경험을 지나 내일로 가져갈 작은 행동 하나를 고릅니다.',options:[
 choice('plan','B09',[16,58],'내일 필요한 것을 미리 준비한다','작은 준비를 끝냈어요. 내일 아침에 해야 할 일이 하나 줄었습니다.'),
 choice('care','B05',[21,49,54],'오래 연락하지 못한 사람에게 안부와 고마움을 전한다','짧은 연락을 보냈어요. 상대의 수고와 내 마음을 말로 남깁니다.'),
 choice('accept','B10',[28,45,59],'몸과 마음의 상태를 살피고 쉬는 시간을 정한다','오늘의 상태를 확인했어요. 내 몸을 돌보는 방식 하나를 골랐습니다.'),
 ]},
};
export function applyResearch(events){return events.map(event=>{
 if(event.id==='route')return {...event,provenance:{kind:'fictional-navigation',sourceIds:[],note:'진로와 19세 배치는 게임 구성. 무태그·무점수.'},options:event.options.map(o=>({...o,behavior:null,sourceIds:[],mappingStatus:'not-applicable',tags:[]}))};
 const revision=revisions[event.id];
 return {...event,...revision,provenance:{kind:'research-inspired-fiction',note:'사건·나이·장소·대사·결과는 창작. 경험 문장의 실제 연령이나 인과관계를 재현하지 않음.'},options:revision.options.map(o=>{const b=research.behaviors.find(b=>b.id===o.behavior);return {...o,tags:[...b.tags],mappingStatus:b.mappingStatus,sourceRanges:o.sourceIds.map(id=>research.raw.find(r=>r.id===id).sourceRange),behaviorSource:b.sourceRange};})};
});}
