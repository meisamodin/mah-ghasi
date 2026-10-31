const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
console.log('order default',await p.evaluate(()=>toolList().map(x=>x[0]).join(',')));
await p.evaluate(()=>{S.mode='preg';save()});console.log('order preg',await p.evaluate(()=>toolList().slice(0,8).map(x=>x[0]).join(',')));
await p.evaluate(()=>{S.mode='';save();tab='set';draw()});
const t=await p.evaluate(()=>document.querySelector('#app').innerText);console.log(/مدیریت ابزارها/.test(t),/قفل خودکار/.test(t),/درباره‌ی برنامه/.test(t));
await p.click('[data-a=ytx]');await p.click('[data-a=ytv][data-v=torch]');await p.click('[data-a=ytm][data-v="cal:-1"]');
console.log(await p.evaluate(()=>JSON.stringify(S.tm.hide)+toolList().slice(0,4).map(x=>x[0])));
await p.click('[data-a=yal][data-v="1"]');console.log('alm',await p.evaluate(()=>S.alm));
await p.evaluate(()=>{tab='tl';draw()});console.log('torch shown',await p.evaluate(()=>/چراغ قوه/.test(document.querySelector('#app').innerText)));
await p.evaluate(()=>{S.lang='en';tab='set';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{tab='set';draw()});
console.log((await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/Manage|Auto-lock|About|Force/.test(t)).join('|'))));
console.log(err);await b.close()})()
