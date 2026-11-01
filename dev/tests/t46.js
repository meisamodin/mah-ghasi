const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const lv=+process.argv[2]||3;const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const x of ['[data-a=obs]','[data-a=qs]']){try{await p.click(x,{timeout:1500})}catch(_){}}
await p.evaluate(l=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};gxS().bvs=l;gxS().bskip=1;gxSave();draw()},lv);
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(800);
const t0=Date.now();
const r=await p.evaluate(()=>{const s0=()=>GX.st;let it=0,log=[],shots=0;cancelAnimationFrame(GX.raf);GX.raf=0;
 const shotAt=new Set([30,520]);
 while(it<60000){it++;const s=s0();GX.cx.clearRect(0,0,GX.w,GX.h);GXD.bwl.draw(it*33,.033);
  if(s.st==='aim'&&s.turn===0&&s.dropT<=0&&s.vs){s.bx=(Math.random()-.5)*.3;s.bz=-.2;bwLaunch(s,{vx:(Math.random()-.5)*.8,vz:19,sp:(Math.random()-.5)*.4});shots++;}
  if(s.st==='over')break;
  if(it%1500===0&&s.turn===1&&s.st==='roll')log.push(s.cmode)}
 const s=s0();return{it,st:s.st,shots,t0:s.P&&bwTotal(s.P[0].rolls),t1:s.P&&bwTotal(s.P[1].rolls),n0:s.P[0].rolls.length,n1:s.P[1].rolls.length,cm:log}});
console.log(lv,r,Date.now()-t0,'ms');
console.log(await p.evaluate(()=>JSON.stringify(gxS().bwin)));
await p.locator('#gxc').screenshot({path:'/tmp/vs2.png'});console.log(errs);await b.close()})();
