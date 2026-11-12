import {summarizeBehaviors} from './behaviorMap.js';

// 서사형 결과 영수증의 줄 목록. 첫 줄은 큰 제목으로 인쇄됩니다.
// 선택 기록과 '만난 장면 중 고른 횟수'만 담고, 점수·순위·성숙도 판정은 넣지 않습니다.
export function narrativeReceiptLines(state) {
 const summary = summarizeBehaviors(state.history);
 const lines = ['어른이 된 순간', '', `7살 → ${state.profile.age}살`, '', '내가 고른 장면'];
 for (const h of state.history) lines.push(`${h.age}살 ${h.label}`);
 lines.push('', '이번에 만난 행동');
 if (!summary.tendencies.length && !summary.review.length) lines.push('연결된 행동 묶음이 없는 장면들이었어요.');
 for (const item of summary.tendencies) lines.push(`${item.name} ${item.offered}장면 중 ${item.chosen}번`);
 for (const item of summary.review) lines.push(`${item.name}(경향 연결 검토 중) ${item.offered}장면 중 ${item.chosen}번`);
 lines.push('', '점수나 순위, 성숙도 판정은 없어요.', '이번 한 번의 이야기를 고른 기록입니다.');
 return lines;
}
