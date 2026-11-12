import {translate} from './translations.js';

export function receiptLines(scores) {
 const highest = Math.max(...scores.map(score => score.total));
 const representative = scores.filter(score => score.total === highest).map(score => translate(score.category, 'ja')).join('・');
 const lines = [
  representative, '',
  '大人になった瞬間', '',
  'あの頃と今の選択の傾向',
  '各傾向の全体4問、子ども・思春期2問、成人期2問を、それぞれ0〜100に換算しています。', '',
 ];
 for (const score of scores) {
  const difference = score.adult - score.early;
  lines.push(
   `【${translate(score.category, 'ja')}】${score.total === highest ? '代表的な傾向' : ''}`,
   `全体: ${score.total}`,
   `子ども・思春期: ${score.early}`,
   `成人期: ${score.adult}`,
   difference === 0 ? '二つの時期の指標は同じです。' : `差: ${difference > 0 ? '+' : ''}${difference}`,
   '',
  );
 }
 return lines;
}

export const renderReceipt = scores => renderLines(receiptLines(scores));

// 줄 목록(첫 줄은 큰 제목)을 58mm 프린터용 비트맵으로 만듭니다.
// 한글은 Noto Sans JP에 글리프가 없어 뒤의 시스템 글꼴로 대체됩니다. 실제 출력은 장비에서 확인이 필요합니다.
export async function renderLines(rawLines) {
 await document.fonts.load('20px "Noto Sans JP"');
 const canvas = document.createElement('canvas');
 canvas.width = 384; // Typical 58mm printer: 48mm printable area at 203dpi.
 const context = canvas.getContext('2d');
 context.font = '20px "Noto Sans JP", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
 const lines = [];
 for (const [index, paragraph] of rawLines.entries()) {
  const size = index === 0 ? 32 : 20;
  const lineHeight = index === 0 ? 44 : 29;
  context.font = `${size}px "Noto Sans JP", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
  let line = '';
  for (const character of paragraph) {
   if (context.measureText(line + character).width > 360) {
    lines.push({text: line, size, lineHeight});
    line = '';
   }
   line += character;
  }
  lines.push({text: line, size, lineHeight});
 }
 canvas.height = lines.reduce((height, line) => height + line.lineHeight, 24);
 context.fillStyle = '#fff';
 context.fillRect(0, 0, canvas.width, canvas.height);
 context.fillStyle = '#000';
 context.font = '20px "Noto Sans JP", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
 context.textBaseline = 'top';
 let y = 12;
 for (const line of lines) {
  context.font = `${line.size}px "Noto Sans JP", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
  context.fillText(line.text, 12, y);
  y += line.lineHeight;
 }
 const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
 const bitmap = new Uint8Array(48 * canvas.height);
 for (let pixel = 0; pixel < canvas.width * canvas.height; pixel++) {
  if (pixels[pixel * 4] < 160) bitmap[pixel >> 3] |= 0x80 >> (pixel % 8);
 }
 let binary = '';
 for (const byte of bitmap) binary += String.fromCharCode(byte);
 return {raster: btoa(binary), height: canvas.height};
}
