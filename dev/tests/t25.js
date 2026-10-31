const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:380,height:820}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));p.on('dialog',d=>d.accept());
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
const open=async v=>{await p.evaluate(v=>{XV={s:v};draw()},v)};
const txt=()=>p.evaluate(()=>document.querySelector('#app').innerText.replace(/\n+/g,' | ').slice(0,260));
await p.evaluate(()=>{const t=today();S.start=iso(add(t,-5));S.hist=[iso(add(t,-400)),iso(add(t,-370))];for(let i=0;i<5;i++){const k=iso(add(t,-i-1));gl(k);S.logs[k].flow='متوسط'}S.bb={dob:iso(add(t,-40))};save()});
await open('qz');console.log('qz',await txt());await p.click('[data-a=qzd][data-v="1"]');await p.click('[data-a=qzm]');console.log('qz2',JSON.stringify(await p.evaluate(()=>S.qz2)));
await open('mid');await p.fill('#md_n','تست');await p.fill('#md_p1','0912');await p.selectOption('#md_bl','O+');await p.click('[data-a=mds]');console.log('mid',await txt(),await p.evaluate(()=>!!document.querySelector('a[href="tel:115"]')));
await open('sk');await p.click('[data-a=sks]');await p.fill('#skt','38.4');await p.click('[data-a=skn]');console.log('sk',await txt(),await p.evaluate(()=>S.sk.length));
await p.fill('#skt','37.2');await p.click('[data-a=skn]');console.log('chart',await p.evaluate(()=>!!document.querySelector('#app svg')));
await open('gl');await p.fill('#glt','نون');await p.click('[data-a=gla]');await p.click('[data-a=glt]');await p.fill('#ntt','a');await p.fill('#ntb','b');await p.click('[data-a=nta]');console.log('gl',JSON.stringify(await p.evaluate(()=>S.gl)));
await open('dtc');await p.click('[data-a=dtm][data-v=add]');await p.fill('#dtb','280');await p.click('[data-a=dtg]');console.log('dt',await p.evaluate(()=>document.getElementById('dtr').innerText));
await p.click('[data-a=dtm][data-v=age]');await p.fill('#dta','2020-05-01');await p.click('[data-a=dtg]');console.log('age',await p.evaluate(()=>document.getElementById('dtr').innerText));
await open('zen');await p.click('[data-a=znp]');await p.waitForTimeout(500);console.log('zen on',await p.evaluate(()=>ZNT.on));await p.evaluate(()=>{XV=null;stopAll&&0;draw()}).catch(()=>{});
await p.click('[data-a=znn]').catch(()=>{});
await p.evaluate(()=>{XV={s:'zen'};draw()});await p.fill('#zng','x');await p.click('[data-a=zng]');console.log('gr',await p.evaluate(()=>JSON.stringify(S.gr)));
await p.evaluate(()=>{XV={s:'cyc'};draw()});console.log('zen after leave',await p.evaluate(()=>ZNT.on));
await open('frs');await p.click('[data-a=frk][data-v="2"]');await p.click('[data-a=fra]');console.log('frs',await txt());
await open('kcl');await p.fill('#kcs','قورمه');console.log('opts',await p.evaluate(()=>document.querySelectorAll('#kcf option').length));await p.selectOption('#kcf',{index:0});await p.click('[data-a=kca]');console.log('kc',await txt());
await p.evaluate(()=>{XV=null;tab='tl';draw()});console.log('tools list',await p.evaluate(()=>['قضا','کارت پزشکی','بیماری نوزاد','کالری','آرام‌سازی','اولین‌ها','محاسبه‌گر تاریخ','یادداشت'].map(w=>document.querySelector('#app').innerText.includes(w))));
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);
for(const v of ['qz','mid','sk','gl','dtc','zen','frs','kcl']){await p.evaluate(v=>{XV={s:v};draw()},v);console.log(v,await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,140)))}
console.log(err);await b.close()})()
