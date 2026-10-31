const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{XV={s:'pn'};draw()});await p.click('[data-a=ynq][data-v=md]');console.log(await p.evaluate(()=>JSON.stringify(S.pnr.inc)));
await p.evaluate(()=>{XV={s:'hb'};draw()});console.log('hb ok',await p.evaluate(()=>document.querySelectorAll('[data-a=yhd]').length>0));
await p.evaluate(()=>{XV={s:'nm'};draw()});await p.click('[data-a=ynt][data-v=v]');console.log('nm tab',await p.evaluate(()=>XS.nt));
console.log(err);await b.close()})()
