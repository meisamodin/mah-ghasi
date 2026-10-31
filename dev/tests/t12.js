const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{XV={s:'ou'};draw()});
for(const v of ['t:red','b:green','s:black','g:brown']){await p.click(`[data-a=yoc][data-v="${v}"]`)}
await p.click('[data-a=yoo][data-v=office]');
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.slice(0,500)));
await p.screenshot({path:'/tmp/ou.png'});
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{XV={s:'ou'};draw()});
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.slice(0,300)));
console.log(err);await b.close()})()
