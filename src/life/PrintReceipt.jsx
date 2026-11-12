import {useRef, useState} from 'react';
import '@fontsource/noto-sans-jp/400.css';
import {renderReceipt, renderLines} from './receipt.js';

const texts = {
 ja: {button: '結果を印刷する', printing: '印刷データを送信中…', submitted: '印刷キューに送信済み', ok: 'Macの印刷キューに送信しました。プリンターの出力を確認してください。',
  network: 'Macとの通信を確認できませんでした。再試行の前にプリンターの出力を確認してください。', failed: '印刷に失敗しました。Macとプリンターの接続を確認してください。', start: '印刷を開始できませんでした。'},
 ko: {button: '선택 기록을 영수증으로 받기', printing: '인쇄 데이터를 보내는 중…', submitted: '인쇄 대기열에 보냈어요', ok: '인쇄 대기열에 보냈어요. 프린터에서 출력됐는지 확인해 주세요.',
  network: '인쇄 서버와 통신하지 못했어요. 다시 누르기 전에 프린터에서 출력됐는지 먼저 확인해 주세요.', failed: '인쇄하지 못했어요. 프린터 연결을 확인해 주세요.', start: '인쇄를 시작하지 못했어요.'},
};

// scores: V3 성장형 결과. lines: 서사형 결과 영수증 줄 목록(둘 중 하나만 전달).
export default function PrintReceipt({scores, lines, lang = 'ja'}) {
 const text = texts[lang] || texts.ja;
 const locked = useRef(false);
 const requestId = useRef(null);
 const [status, setStatus] = useState('idle');
 const [message, setMessage] = useState('');
 async function print() {
  if (locked.current) return;
  locked.current = true;
  setStatus('printing');
  setMessage('');
  try {
   // The same ID is kept for retries, including when the submission response is lost.
   requestId.current ||= Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('');
   const image = lines ? await renderLines(lines) : await renderReceipt(scores);
   const response = await fetch('/api/receipt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(lines ? {id: requestId.current, ...image} : {id: requestId.current, scores, ...image}),
    signal: AbortSignal.timeout(30000),
   });
   const result = await response.json();
   if (!response.ok) throw new Error(result.error || text.start);
   setStatus('submitted');
   setMessage(text.ok);
  } catch (error) {
   setStatus('error');
   setMessage(error instanceof TypeError || error.name === 'TimeoutError' ? text.network : error.message || text.failed);
   locked.current = false;
  }
 }
 return <section className="receipt-controls" lang={lang}>
  <button type="button" className="solid-button" disabled={status === 'printing' || status === 'submitted'} onClick={print}>
   {status === 'printing' ? text.printing : status === 'submitted' ? text.submitted : text.button}
  </button>
  {message && <p className="muted" role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
 </section>;
}
