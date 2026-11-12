import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {receiptLines} from '../src/life/receipt.js';
import {createReceiptHandler, receiptEscPos} from '../server/receipt-printer.js';

const categories = ['책임','자립','타인배려','감정조절','미래지향','사회·역할'];
const scores = categories.map((category, index) => ({category,
 total: [68.75,31.25,68.75,12.5,0,0][index],
 early: [37.5,50,37.5,12.5,0,0][index],
 adult: [100,12.5,100,12.5,0,0][index]}));
test('receipt preserves displayed values, order, ties and exact differences', () => {
 const before = JSON.stringify(scores);
 const lines = receiptLines(scores);
 assert.equal(lines[0], '責任・他者への配慮');
 assert.equal(receiptLines(scores.map((score, index) => ({...score,total:index === 0 ? 100 : 0})))[0], '責任');
 assert.deepEqual(lines.filter(line => line.startsWith('【')), [
  '【責任】代表的な傾向','【自立】','【他者への配慮】代表的な傾向',
  '【感情の調整】','【未来への見通し】','【社会・役割】',
 ]);
 for (const text of ['全体: 68.75','子ども・思春期: 37.5','成人期: 100','差: +62.5','差: -37.5','二つの時期の指標は同じです。']) assert.ok(lines.includes(text));
 assert.equal(JSON.stringify(scores), before);
});
const payload = {id:'a'.repeat(32),scores,raster:Buffer.alloc(48 * 1600).toString('base64'),height:1600};
function request(handler, body = payload, origin = 'http://localhost:5173') {
 return new Promise(resolve => {
  const req = Readable.from([JSON.stringify(body)]);
  req.url='/api/receipt'; req.method='POST';
  req.headers={origin,host:'localhost:5173','content-type':'application/json'};
  let status;
  handler(req, {writeHead(code){status=code;},end(data){resolve({status,body:JSON.parse(data)});}},()=>{});
 });
}
test('concurrent and repeated requests submit only one Mac print job', async () => {
 let calls=0;
 const handler=createReceiptHandler({printer:'Receipt58',run:async (command,args)=>{
  calls++; assert.equal(command,'/usr/bin/lp');
  assert.deepEqual(args.slice(0,4),['-d','Receipt58','-n','1']);
 }});
 const results=await Promise.all([request(handler),request(handler)]);
 assert.ok(results.every(result=>result.status===200));
 assert.equal((await request(handler)).status,200);
 assert.equal(calls,1);
 assert.equal((await request(handler,{...payload,scores:scores.map(score=>({...score,total:1}))})).status,409);
});
test('printer missing, foreign origin, malformed values and uncertain submission are handled',async()=>{
 assert.equal((await request(createReceiptHandler({printer:''}))).status,503);
 const handler=createReceiptHandler({printer:'Receipt58',run:async()=>{throw new Error('offline');}});
 assert.equal((await request(handler,payload,'http://foreign.example')).status,403);
 assert.equal((await request(handler,{...payload,scores:[]})).status,400);
 assert.equal((await request(handler)).status,502);
 assert.equal((await request(handler)).status,502);
});
test('ESC * preserves all pixels, column order and partial final band',()=>{
 const height=53;
 const raster=Buffer.from(Array.from({length:48*height},(_,i)=>(i*73+19)%256));
 const output=receiptEscPos(raster,height);
 assert.deepEqual([...output.subarray(0,8)],[27,64,27,83,10,27,51,24]);
 let offset=8;
 for(let row=0;row<height;row+=24){
  assert.deepEqual([...output.subarray(offset,offset+5)],[27,42,33,128,1]);
  offset+=5;
  for(let x=0;x<384;x++)for(let bit=0;bit<24;bit++){
   const actual=Boolean(output[offset+x*3+Math.floor(bit/8)] & (128>>(bit%8)));
   const expected=row+bit<height && Boolean(raster[(row+bit)*48+Math.floor(x/8)] & (128>>(x%8)));
   assert.equal(actual,expected);
  }
  offset+=384*3;
  assert.equal(output[offset++],10);
 }
 assert.deepEqual([...output.subarray(offset)],[27,50,27,100,3]);
 assert.throws(()=>receiptEscPos(Buffer.alloc(1),300));
});
