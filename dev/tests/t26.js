const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
const n=()=>p.evaluate(()=>document.querySelectorAll('#app [data-a=xvo]').length);
await p.evaluate(()=>{tab='tl';draw()});console.log('collapsed',await n());
await p.click('[data-a=tlx]');console.log('all',await n());await p.click('[data-a=tlx]');console.log('again',await n());
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{tab='tl';draw()});
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,200)),err);await b.close()})()
