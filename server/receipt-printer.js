import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const execute = promisify(execFile);
const categories = ['책임', '자립', '타인배려', '감정조절', '미래지향', '사회·역할'];

export function validateReceipt(body) {
 if (!/^[a-f0-9]{32}$/.test(body.id)) throw new Error('印刷データが正しくありません。');
 // scores는 V3 성장형 결과용입니다. 서사형 영수증은 scores 없이 이미지(raster)만 보냅니다.
 // 값이 있으면 기존과 똑같이 엄격하게 검사합니다.
 if (body.scores !== undefined) {
  if (!Array.isArray(body.scores) || body.scores.length !== 6) throw new Error('印刷データが正しくありません。');
  body.scores.forEach((score, index) => {
   if (score.category !== categories[index] || !['total', 'early', 'adult'].every(key => Number.isFinite(score[key]) && score[key] >= 0 && score[key] <= 100)) throw new Error('印刷データが正しくありません。');
  });
 }
 if (!Number.isInteger(body.height) || body.height < 100 || body.height > 4000 || typeof body.raster !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.raster)) throw new Error('印刷画像が正しくありません。');
 const raster = Buffer.from(body.raster, 'base64');
 if (raster.length !== 48 * body.height) throw new Error('印刷画像が正しくありません。');
 return raster;
}

// ESC * mode 33: 384 columns, each holding 24 vertical dots.
export function receiptEscPos(raster, height) {
 if (!Number.isInteger(height) || height < 1 || raster.length !== 48 * height) throw new Error('Invalid raster length');
 const chunks = [Buffer.from([0x1b, 0x40, 0x1b, 0x53, 0x0a, 0x1b, 0x33, 24])];
 for (let row = 0; row < height; row += 24) {
  const columns = Buffer.alloc(384 * 3);
  for (let x = 0; x < 384; x++) {
   for (let bit = 0; bit < 24 && row + bit < height; bit++) {
    const pixel = raster[(row + bit) * 48 + (x >> 3)] & (0x80 >> (x % 8));
    if (pixel) columns[x * 3 + (bit >> 3)] |= 0x80 >> (bit % 8);
   }
  }
  chunks.push(Buffer.from([0x1b, 0x2a, 33, 128, 1]), columns, Buffer.from([0x0a]));
 }
 // Restore normal line spacing and feed to the tear edge.
 chunks.push(Buffer.from([0x1b, 0x32, 0x1b, 0x64, 3]));
 return Buffer.concat(chunks);
}

export function createReceiptHandler({printer = process.env.RECEIPT_PRINTER, run = execute} = {}) {
 const jobs = new Map();
 let busy = false;
 return async (req, res, next) => {
  if (req.url?.split('?')[0] !== '/api/receipt') return next();
  const reply = (status, value) => {res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'}); res.end(JSON.stringify(value));};
  if (req.method !== 'POST') return reply(405, {error: 'POSTのみ利用できます。'});
  if (req.headers.origin !== `http://${req.headers.host}` || !req.headers['content-type']?.startsWith('application/json')) return reply(403, {error: 'この画面から印刷してください。'});
  if (!printer) return reply(503, {error: 'Macで58mmプリンターが設定されていません。接続とRECEIPT_PRINTERの設定を確認してください。'});
  let body, raster;
  try {
   let raw = '';
   for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 2000000) return reply(413, {error: '印刷データが大きすぎます。'});
   }
   body = JSON.parse(raw);
   raster = validateReceipt(body);
  } catch { return reply(400, {error: '印刷データが正しくありません。'}); }
  const fingerprint = createHash('sha256').update(JSON.stringify(body)).digest('hex');
  if (jobs.has(body.id)) {
   const job = jobs.get(body.id);
   if (job.fingerprint !== fingerprint) return reply(409, {error: '印刷データが一致しません。'});
   const result = await job.promise;
   return reply(result.status, result.body);
  }
  if (busy || jobs.size >= 1000) return reply(429, {error: 'ほかの印刷処理中です。しばらく待ってください。'});
  busy = true;
  const promise = (async () => {
   let directory;
   try {
    directory = await mkdtemp(join(tmpdir(), 'adult-receipt-'));
    const receipt = receiptEscPos(raster, body.height);
    const file = join(directory, 'receipt.bin');
    await writeFile(file, receipt);
    await run('/usr/bin/lp', ['-d', printer, '-n', '1', '-o', 'raw', file], {timeout: 15000});
    return {status: 200, body: {queued: true}};
   } catch {
    return {status: 502, body: {error: '印刷の受付を確認できませんでした。Macの印刷キューとプリンターを確認してください。重複防止のため、この結果は再送信しません。'}};
   } finally {
    busy = false;
    if (directory) await rm(directory, {recursive: true, force: true}).catch(() => {});
   }
  })();
  jobs.set(body.id, {fingerprint, promise});
  const result = await promise;
  reply(result.status, result.body);
 };
}

export function receiptPrinterPlugin() {
 return {name: 'local-receipt-printer', configureServer(server) {server.middlewares.use(createReceiptHandler());}};
}
