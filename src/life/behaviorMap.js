// 선택지 → 리서치 행동 묶음(B01~B12) 연결표.
// ※ 임시 연결: 선택지는 사용자 제공 문구이고, 이 표의 연결은 작품 제작용 해석입니다.
//   연구로 검증된 분류가 아니며, 아래 표만 고치면 결과 화면과 영수증이 함께 바뀝니다.
// 연결하지 않은 선택지는 '기록만' 남습니다. 연결이 없다고 가치가 낮은 선택이 아닙니다.
// 행동 묶음 이름·경향 연결 초안: 리서치북 「分類案（最終）」「テスト結果の傾向」.

export const tendencies = ['책임', '자립', '타인배려', '감정조절', '미래지향', '사회·역할'];

// tendency가 null인 묶음(B10, B12)은 경향 연결을 검토 중이라 6경향 집계에 넣지 않고 따로 보여줍니다.
export const behaviorGroups = {
 B01: {name: '생활과 결정을 스스로 처리함', tendency: '자립'},
 B02: {name: '해야 할 일·약속을 지킴', tendency: '책임'},
 B03: {name: '실수·문제 상황에 대응함', tendency: '책임'},
 B04: {name: '상대의 말을 듣고 입장을 이해함', tendency: '타인배려'},
 B05: {name: '타인을 챙기고 배려 행동을 함', tendency: '타인배려'},
 B06: {name: '가족·선후배 관계에서 역할을 맡음', tendency: '사회·역할'},
 B07: {name: '감정·충동을 조절함', tendency: '감정조절'},
 B08: {name: '돈·물건 등 자원을 관리함', tendency: '미래지향'},
 B09: {name: '계획하고 미리 준비함', tendency: '미래지향'},
 B10: {name: '건강·자기 상태를 관리함', tendency: null},
 B11: {name: '공공·관계 규범과 예절을 지킴', tendency: '사회·역할'},
 B12: {name: '한계·모름을 인정하고 도움을 주고받음', tendency: null},
};

// 사건 ID → {선택지 ID → 행동 코드}. 없는 사건·선택지는 연결하지 않습니다.
export const choiceBehaviors = {
 play: {1: 'B02'},
 friend: {0: 'B04', 2: 'B05'},
 broken: {0: 'B03', 2: 'B01'},
 relation: {0: 'B04', 3: 'B12'},
 travel: {2: 'B04'},
 money: {2: 'B08', 3: 'B05'},
 struggle: {0: 'B03', 1: 'B12'},
 tired: {0: 'B02', 1: 'B10', 2: 'B02'},
 evening: {3: 'B09'},
};

const empty = () => ({offered: 0, chosen: 0, early: {offered: 0, chosen: 0}, adult: {offered: 0, chosen: 0}});
const count = (bucket, h, hit) => {
 const period = h.stage === '성인기' ? bucket.adult : bucket.early;
 bucket.offered++; period.offered++;
 if (hit) {bucket.chosen++; period.chosen++;}
};

// 선택 기록(history)에서 '만난 장면 수 중 고른 횟수'만 셉니다. 점수·비율·순위는 만들지 않습니다.
// 장면마다 만나는 선택지의 수가 달라 합계끼리 비교할 수 없기 때문입니다.
export function summarizeBehaviors(history) {
 const byTendency = Object.fromEntries(tendencies.map(name => [name, empty()]));
 const review = {B10: empty(), B12: empty()};
 let recorded = 0;
 for (const h of history) {
  const map = choiceBehaviors[h.id] || {};
  const chosenCode = map[h.choiceId];
  if (!chosenCode) recorded++;
  const offeredTendencies = new Set(), offeredReview = new Set();
  for (const code of Object.values(map)) {
   const group = behaviorGroups[code];
   if (group.tendency) offeredTendencies.add(group.tendency); else offeredReview.add(code);
  }
  for (const name of offeredTendencies) count(byTendency[name], h, chosenCode && behaviorGroups[chosenCode].tendency === name);
  for (const code of offeredReview) count(review[code], h, chosenCode === code);
 }
 return {
  tendencies: tendencies.map(name => ({name, ...byTendency[name]})).filter(item => item.offered > 0),
  review: Object.entries(review).filter(([, item]) => item.offered > 0).map(([code, item]) => ({code, name: behaviorGroups[code].name, ...item})),
  unlinked: recorded,
 };
}
