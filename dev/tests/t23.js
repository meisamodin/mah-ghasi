const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{tab='log';LT='f';draw()});
console.log('nn btn',await p.evaluate(()=>!!document.querySelector('[data-a=ynn]')));
await p.click('[data-a=t][data-k=flow][data-v="زیاد"]');
console.log('flow extras',await p.evaluate(()=>['bc','bl'].map(k=>document.querySelectorAll('[data-k='+k+']').length).join(',')));
await p.click('[data-a=ts][data-k=bc][data-v="قرمز تیره"]');await p.click('[data-a=ts][data-k=bl][data-v="لخته‌ی بزرگ"]');
console.log('alert',await p.evaluate(()=>/نشونه‌ی خونریزی زیاد/.test(document.body.innerText)));
for(let i=0;i<3;i++)await p.click('[data-a=ypd][data-v="1"]');
await p.click('[data-a=t][data-k=fx][data-v="✈️ سفر"]');
await p.click('[data-a=xe]');console.log('ex extras',await p.evaluate(()=>!!document.getElementById('exm')));
await p.click('[data-a=ts][data-k=et][data-v="🧘 یوگا یا کشش"]');await p.fill('#exm','30');
await p.click('[data-a=yhe]');await p.click('[data-a=yhq][data-v="🤕 سردرد"]');await p.click('[data-a=yhe]');
console.log('hidden',await p.evaluate(()=>String(!document.body.innerText.includes('سردرد'))+' '+JSON.stringify(S.hd)));
await p.evaluate(()=>{saveFields()});
console.log(await p.evaluate(()=>{const L=S.logs[LD];return JSON.stringify({bc:L.bc,bl:L.bl,pd:L.pd,fx:L.fx,et:L.et,em:L.em})}));
await p.evaluate(()=>{LD=iso(add(today(),-1));draw()});console.log('nn on empty day',await p.evaluate(()=>!!document.querySelector('[data-a=ynn]')));await p.click('[data-a=ynn]');console.log(await p.evaluate(()=>hasData(S.logs[LD])));
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{tab='log';LT='f';draw()});
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,300)));
console.log(err);await b.close()})()
