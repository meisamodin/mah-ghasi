const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(1200);
await p.evaluate(()=>{GX.st.rolls=[10,7,3,10];GX.st.f=3;GX.st.k=0});
await p.click('[data-a=bws]');await p.waitForTimeout(200);console.log('saved',await p.evaluate(()=>JSON.stringify(gxS().bsc)),await p.evaluate(()=>document.getElementById('bwls').innerText.slice(0,80)));
await p.click('[data-a=bws]');
await p.locator('[data-a=bwr]').scrollIntoViewIfNeeded();await p.click('[data-a=bwr]');console.log('restart',await p.evaluate(()=>[GX.st.rolls.length,GX.st.th]));
await p.click('[data-v="b:2"]');await p.evaluate(()=>{GX.st.rolls=[10,10]});
await p.click('[data-a=bwf]');await p.waitForTimeout(500);console.log('fs',await p.evaluate(()=>[XS.bwfs,GX.w,GX.h,GX.st.rolls.join(','),GX.st.th]));await p.screenshot({path:'/tmp/fs1.png'});
// tap toolbar save (middle)
const W=await p.evaluate(()=>GX.w),H=await p.evaluate(()=>GX.h);await p.mouse.click(W/2,H-28);await p.waitForTimeout(200);console.log('saved2',await p.evaluate(()=>gxS().bsc.length));
await p.mouse.click(W-40,H-28);await p.waitForTimeout(500);console.log('exit fs',await p.evaluate(()=>[XS.bwfs,GX.h,GX.st.rolls.join(',')]));await p.screenshot({path:'/tmp/fs2.png'});
await p.click('[data-a=gxb]');await p.waitForTimeout(300);console.log('back',await p.evaluate(()=>[XS.gxg,!!GX.st,document.body.style.overflow]));
console.log(err);await b.close()})();
