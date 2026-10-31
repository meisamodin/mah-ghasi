const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));p.on('dialog',d=>d.accept());
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
// cycles + LH
await p.evaluate(()=>{const t=today();S.hist=[iso(add(t,-62)),iso(add(t,-33))];S.start=iso(add(t,-5));S.cycle=28;S.period=5;S.mode='ttc';
 const lhd=iso(add(parse(S.hist[1]),11));gl(lhd);S.logs[lhd].ot='مثبت';const sx=iso(add(t,-3));gl(sx);S.logs[sx].sx='محافظت‌شده';save();tab='home';draw()});
let txt=await p.evaluate(()=>{const e=[...document.querySelectorAll('#app .card')].find(c=>/تاریخچه‌ی پریودها/.test(c.innerText));return e?e.innerText:''});
console.log(txt.replace(/\n+/g,' | ').slice(380,900));
console.log('ttc',await p.evaluate(()=>/قصد بارداری/.test(document.querySelector('#app').innerText)));
// log form LH
await p.evaluate(()=>{tab='log';LT='f';draw()});console.log('lh chips',await p.evaluate(()=>[...document.querySelectorAll('[data-k=lh]')].map(x=>x.textContent).join(',')));
// appointments
const open=async v=>{await p.evaluate(v=>{XV={s:v};draw()},v)};
await open('apt');await p.click('[data-a=yta][data-v="1"]');await p.evaluate(()=>{document.getElementById('apd').value=iso(add(today(),1))});await p.fill('#apn','دکتر الف');await p.click('[data-a=ytn]');
console.log('apt',await p.evaluate(()=>JSON.stringify(S.apt)));
await p.evaluate(()=>{XV=null;tab='home';draw()});console.log('home apt card',await p.evaluate(()=>/وقت‌های پیش رو/.test(document.querySelector('#app').innerText)));
const out=await p.evaluate(()=>{const o=[];S.apt[0].nt='';aptRem(o,'10:00');return o});console.log('rem',out);
// dq
await open('dq');await p.fill('#dqt','این درد طبیعیه؟');await p.click('[data-a=yqa]');await p.evaluate(()=>{XV=null;draw()});
console.log('report has q',await p.evaluate(()=>JSON.stringify(reportData2()).includes('این درد طبیعیه')));
// pn
await open('pn');await p.click('[data-a=ynh][data-v="0"]');console.log(await p.evaluate(()=>document.getElementById('pnp').textContent));
// accent
await p.evaluate(()=>{XV=null;tab='set';draw()});await p.click('[data-a=yac][data-v=blue]');console.log('acc',await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--pk')));
await p.reload();await p.waitForTimeout(500);console.log('acc after reload',await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--pk')));
// EN
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);
for(const v of ['apt','dq','pn']){await p.evaluate(v=>{XV={s:v};draw()},v);console.log(v,await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,160)))}
console.log(err);await b.close()})()
