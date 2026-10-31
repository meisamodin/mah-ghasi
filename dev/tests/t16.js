const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
const open=async v=>{await p.evaluate(v=>{XV={s:v};draw()},v)};
await open('vt');await p.fill('#vtw0','60');await p.fill('#vth','165');await p.click('[data-a=yvb]');
await p.fill('#vv1','62');await p.click('[data-a=yva]');await p.fill('#vv1','64');await p.evaluate(()=>{document.getElementById('vvd').value='2026-10-30'});await p.click('[data-a=yva]');
await p.click('[data-a=yvk][data-v=bp]');await p.fill('#vv1','145');await p.fill('#vv2','95');await p.click('[data-a=yva]');await p.fill('#vv1','120');await p.fill('#vv2','78');await p.evaluate(()=>{document.getElementById('vvd').value='2026-10-29'});await p.click('[data-a=yva]');
await p.click('[data-a=yvk][data-v=g]');await p.fill('#vv1','102');await p.click('[data-a=yva]');await p.fill('#vv1','90');await p.evaluate(()=>{document.getElementById('vvd').value='2026-10-29'});await p.click('[data-a=yva]');
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.replace(/\n+/g,' | ').slice(300,1100)));
console.log('svgs',await p.evaluate(()=>document.querySelectorAll('#app svg').length));
await open('fd');await p.click('[data-a=yfw][data-v="1"]');await p.click('[data-a=yfc][data-v="95"]');await p.fill('#fds','ماهی');
console.log(await p.evaluate(()=>document.querySelector('#fdl').innerText.replace(/\n+/g,' | ').slice(0,200)),await p.evaluate(()=>JSON.stringify(S.fdw)));
await p.click('[data-a=yff][data-v=no]');console.log('no count',await p.evaluate(()=>document.querySelectorAll('#fdl .note').length));
await open('px');await p.click('[data-a=yxs]');await p.waitForTimeout(300);console.log('px',await p.evaluate(()=>PXT.on+document.getElementById('pxt').textContent));await open('lab');console.log('px stopped',await p.evaluate(()=>PXT.on));
await open('bm');await p.evaluate(()=>{document.getElementById('bmd').value='2026-03-30'});await p.click('[data-a=ybd]');console.log(await p.evaluate(()=>bbAgeTxt()+' '+document.querySelectorAll('#app .note[style*="border"]').length));
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);
for(const v of ['vt','fd','px','bm']){await p.evaluate(v=>{XV={s:v};draw()},v);await p.waitForTimeout(100);console.log(v,await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,200)))}
console.log(err);await b.close()})()
