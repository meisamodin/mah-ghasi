const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const x of ['[data-a=obs]','[data-a=qs]']){try{await p.click(x,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(800);
await p.click('[data-v="v:3"]');await p.waitForTimeout(600);
console.log(await p.evaluate(()=>[gxS().bvs,!!GX.st.cpu,GX.st.cpu&&GX.st.cpu.lv]));
// simulate player frame 1 completion
await p.evaluate(()=>{const s=GX.st;s.skipMan=true;s.rolls=[10];s.f=1;s.k=0;s.done=false;s.st='sweep';s.sw=1.65;s.pins=[]});
await p.waitForTimeout(700);
console.log(await p.evaluate(()=>[GX.st.st,GX.st.cpu.nf,JSON.stringify(GX.st.cpu.rolls)]));
await p.locator('#gxc').screenshot({path:'/tmp/vs1.png'});
// full cpu averages
console.log(await p.evaluate(()=>[1,2,3].map(l=>{let t=0;for(let i=0;i<200;i++){const c={rolls:[],f:0,k:0,nf:0,lv:l};const s={cpu:c,done:true,f:10};bwCpuStep(s);t+=bwTotal(c.rolls);if(c.rolls.length<12||c.rolls.length>21)return 'bad'+c.rolls.length}return Math.round(t/200)})));
await p.evaluate(()=>{const s=GX.st;s.rolls=[10,10,10,10,10,10,10,10,10,10,10,10];s.f=9;s.done=true;s.st='sweep';s.sw=1.65;s.pins=[]});
await p.waitForTimeout(3500);
console.log(await p.evaluate(()=>[GX.st.st,GX.st.cpu.nf,bwTotal(GX.st.cpu.rolls),JSON.stringify(gxS().bwin)]));
await p.locator('#gxc').screenshot({path:'/tmp/vs2.png'});console.log(errs);await b.close()})();
