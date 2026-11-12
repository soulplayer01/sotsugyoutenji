import {useRef, useState} from 'react';
import '@fontsource/noto-sans-jp/400.css';
import {renderReceipt} from './receipt.js';

export default function PrintReceipt({scores}) {
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
   const image = await renderReceipt(scores);
   const response = await fetch('/api/receipt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: requestId.current, scores, ...image}),
    signal: AbortSignal.timeout(30000),
   });
   const result = await response.json();
   if (!response.ok) throw new Error(result.error || '印刷を開始できませんでした。');
   setStatus('submitted');
   setMessage('Macの印刷キューに送信しました。プリンターの出力を確認してください。');
  } catch (error) {
   setStatus('error');
   setMessage(error instanceof TypeError || error.name === 'TimeoutError'
    ? 'Macとの通信を確認できませんでした。再試行の前にプリンターの出力を確認してください。'
    : error.message || '印刷に失敗しました。Macとプリンターの接続を確認してください。');
   locked.current = false;
  }
 }
 return <section className="receipt-controls" lang="ja">
  <button type="button" className="solid-button" disabled={status === 'printing' || status === 'submitted'} onClick={print}>
   {status === 'printing' ? '印刷データを送信中…' : status === 'submitted' ? '印刷キューに送信済み' : '結果を印刷する'}
  </button>
  {message && <p className="muted" role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
 </section>;
}
