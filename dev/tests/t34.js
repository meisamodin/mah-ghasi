const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'dgp',d:true};draw()});
await p.click('[data-a=dgt][data-v=les]');await p.waitForTimeout(200);await p.screenshot({path:'/tmp/k1.png'});
console.log('lessons',await p.locator('[data-a=dgr]').count());
await p.click('[data-a=dgr][data-v=q2]');await p.waitForTimeout(200);await p.screenshot({path:'/tmp/k2.png'});
await p.click('[data-a=cqv][data-v="1"]');await p.click('[data-a=cqv][data-v="1"]');console.log('sv',await p.evaluate(()=>XS.cqv),await p.locator('.card').nth(1).innerText().then(t=>t.slice(0,160)));
await p.click('[data-a=cqk][data-v="0"]');
await p.click('[data-a=cqs]');await p.waitForTimeout(200);await p.screenshot({path:'/tmp/k3.png'});
for(let i=0;i<2;i++){await p.click('[data-a=cqn]');await p.waitForTimeout(100)}
console.log('step3 timer',await p.evaluate(()=>[XS.cqc.i,XS.cqc.tm]));await p.click('[data-a=cqt]');await p.waitForTimeout(1300);console.log('left',await p.locator('#cqt').innerText());await p.screenshot({path:'/tmp/k4.png'});
await p.evaluate(()=>{XS.cqc.end=Date.now()+300});await p.waitForTimeout(1200);console.log('done',await p.evaluate(()=>[XS.cqc.run,XS.cqc.done]));
// walk to the end
for(let i=0;i<8;i++){const n=p.locator('[data-a=cqn]');if(await n.count())await n.click()}
await p.waitForTimeout(200);await p.screenshot({path:'/tmp/k5.png'});await p.click('[data-a=cqx]');await p.waitForTimeout(200);console.log('exit',await p.evaluate(()=>[!!XS.cqc,XS.dgr]));
// recipe x1 + all kinds
await p.click('[data-a=dgb]');await p.click('[data-a=dgt][data-v=rec]');await p.screenshot({path:'/tmp/k6.png'});
await p.click('[data-a=dgr][data-v=x1]');await p.waitForTimeout(200);await p.screenshot({path:'/tmp/k7.png',fullPage:true});
await p.click('[data-a=cqs]');for(let i=0;i<3;i++){await p.click('[data-a=cqn]')}await p.screenshot({path:'/tmp/k8.png'});
console.log('kinds',await p.evaluate(()=>[...RCP,...CQL].map(r=>r[9].split(';').map(cqKind).join(',')).join('|').split(/[|,]/).reduce((a,k)=>(a[k]=(a[k]||0)+1,a),{})));
console.log('ids unique',await p.evaluate(()=>{const a=[...RCP,...CQL].map(r=>r[0]);return a.length===new Set(a).size}));
// plan still generates
await p.evaluate(()=>{XS.cqc&&cqStop();XS.dgr=null;XS.dgt='plan';draw()});await p.click('[data-a=dgn]');console.log('plan',await p.evaluate(()=>!!S.dgp.plan));
// EN
await p.evaluate(()=>{S.lang='en';save();XS.dgt='les';draw()});await p.click('[data-a=dgr][data-v=q1]');await p.screenshot({path:'/tmp/k9.png'});
console.log(err);await b.close()})();
