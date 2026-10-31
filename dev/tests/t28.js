const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:720},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';save();tab='tl';XV={s:'dgp',d:true};draw()});
await p.click('[data-a=dgn]');console.log('plan',await p.evaluate(()=>S.dgp.plan.length+' '+JSON.stringify(S.dgp.plan[0])));
await p.screenshot({path:'/tmp/d1.png'});
const tot=await p.evaluate(()=>S.dgp.plan.map(d=>Math.round(dgDayTot(d)[0])));console.log('totals',tot.join(','),'goal',await p.evaluate(()=>dgGoal()));
for(const g of ['prot','mom']){await p.evaluate(()=>{XV={s:'dgp',d:true};draw()});await p.click('[data-a=dgg][data-v='+g+']');await p.click('[data-a=dgn]');console.log(g,await p.evaluate(()=>JSON.stringify(S.dgp.plan[0])))}
await p.click('[data-a=dgv][data-v=v]');await p.click('[data-a=dgn]');console.log('veg ok',await p.evaluate(()=>S.dgp.plan.every(d=>Object.values(d).every(id=>!/[mf]/.test(dgRec(id)[7])))));
await p.click('[data-a=dgv][data-v=nd]');await p.click('[data-a=dgn]');console.log('nodairy ok',await p.evaluate(()=>S.dgp.plan.every(d=>Object.values(d).every(id=>!dgRec(id)[7].includes('d')))));
await p.click('[data-a=dgs]');console.log('swap ok');
await p.click('[data-a=dgd][data-v="3"]');await p.click('[data-a=dgr]');console.log('recipe',await p.evaluate(()=>document.querySelector('#app header b').innerText));await p.screenshot({path:'/tmp/d2.png'});await p.click('[data-a=dgb]');
await p.click('[data-a=dgl]');console.log('shop',await p.evaluate(()=>S.gl.l.length));
await p.fill('#dgk','1100');await p.click('[data-a=dgk]');console.log('low warn',await p.evaluate(()=>/۱۴۰۰/.test(document.querySelector('#app').innerText)),await p.evaluate(()=>dgGoal()));
await p.click('[data-a=dgt][data-v=rec]');console.log('recipes',await p.evaluate(()=>document.querySelectorAll('#app [data-a=dgr]').length));await p.click('[data-a=dgt][data-v=tip]');
// all recipes reachable
console.log('bad recipes',await p.evaluate(()=>RCP.filter(r=>r.length!==10||!r[8]||!r[9]).map(r=>r[0])));
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);
await p.evaluate(()=>{XS.dgt='plan';XV={s:'dgp',d:true};draw()});console.log(await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,300)));
console.log(err);await b.close()})()
