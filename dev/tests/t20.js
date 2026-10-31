const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
const st=()=>p.evaluate(()=>JSON.stringify({tab,XV,y:Math.round(scrollY)}));
await p.evaluate(()=>{tab='tl';draw()});await p.reload();await p.waitForTimeout(600);console.log('tools tab',await st());
await p.evaluate(()=>{XV={s:'vt'};draw()});await p.reload();await p.waitForTimeout(600);console.log('vt',await st(),await p.evaluate(()=>document.querySelector('#app header b').textContent));
await p.evaluate(()=>{XV={s:'nm'};draw();window.scrollTo(0,400)});await p.waitForTimeout(500);await p.reload();await p.waitForTimeout(800);console.log('nm',await st());
await p.evaluate(()=>{XV=null;tab='set';draw()});await p.reload();await p.waitForTimeout(600);console.log('set',await st());
await p.evaluate(()=>{localStorage.setItem('mg_nav',JSON.stringify({t:'log',ts:Date.now()-8*36e5}))});await p.reload();await p.waitForTimeout(600);console.log('old',await st());
console.log(err);await b.close()})()
