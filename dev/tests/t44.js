const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const x of ['[data-a=obs]','[data-a=qs]']){try{await p.click(x,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(1200);
await p.evaluate(()=>{const s=GX.st;s.skipMan=true;s.rolls=[10,10,10,10,10,10,10,10,10,10,10,10].slice(0,11);s.f=9;s.done=true;s.st='sweep';s.sw=0;s.pins=[]});
await p.waitForTimeout(4500);
console.log(await p.evaluate(()=>[GX.st.st,JSON.stringify(gxS().bsc?.[0]),GX.st.autoSaved]));
await p.screenshot({path:'/tmp/fin.png'});console.log(errs);await b.close()})();
