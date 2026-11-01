const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const x of ['[data-a=obs]','[data-a=qs]']){try{await p.click(x,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};gxS().bskip=1;gxS().bvs=0;gxSave();draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{cancelAnimationFrame(GX.raf);GX.raf=0;let it=0,seen=[],snap=0;const pull=[];
 for(let n=0;n<14&&!snap;n++){let tries=0;while(GX.st.st!=='aim'&&tries++<900){GX.cx.clearRect(0,0,GX.w,GX.h);GXD.bwl.draw((it++)*33,.033)}
  const s=GX.st;s.plan=null;while(!(s.plan&&s.plan.done))bwPlan(s);const R=s.plan.res.sort((a,b)=>b.kn-a.kn)[0];s.bx=R.bx;s.bz=-.2;bwLaunch(s,{vx:R.vx,vz:R.vz,sp:R.sp});let k=0;
  while(k++<1500){GX.cx.clearRect(0,0,GX.w,GX.h);GXD.bwl.draw((it++)*33,.033);if(s.st==='rep'&&s.rpT>.5&&!snap){snap=1;window.shot=1;break}if(s.st==='aim')break}
  seen.push(s.st);
  if(snap)break}
 return{snap,seen,pl:GX.st.rolls.join(','),ach:JSON.stringify(gxS().ach||{})}});
console.log(r);if(r.snap){await p.locator('#gxc').screenshot({path:'/tmp/rep.png'})}
console.log(errs);await b.close()})();
