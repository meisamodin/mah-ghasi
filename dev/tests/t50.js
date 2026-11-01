const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const x of ['[data-a=obs]','[data-a=qs]']){try{await p.click(x,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};gxS().bskip=1;gxS().bvs=0;gxS().coin=999;gxSave();draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(800);
await p.evaluate(()=>{cancelAnimationFrame(GX.raf);GX.raf=0;window.step=(n)=>{for(let i=0;i<n;i++){GX.cx.clearRect(0,0,GX.w,GX.h);GXD.bwl.draw((window.tt=(window.tt||0)+33),.033)}}});
const pats=[0,4,5,6,7,8,10,11];
for(let th=4;th<8;th++){
 await p.evaluate(([th,bb])=>{gxS().bt=th;gxS().bbc=bb;GX.st=GXD.bwl.init();for(let i=0;i<300&&GX.st.st!=='aim';i++)step(1);step(30)},[th,pats[th-4+ (th%2?0:0)]]);
 await p.locator('#gxc').screenshot({path:`/tmp/th${th}.png`});
}
// ball patterns closeup
await p.evaluate(()=>{gxS().bt=0;GX.st=GXD.bwl.init();for(let i=0;i<300&&GX.st.st!=='aim';i++)step(1)});
const cv=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=900;c.height=220;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,900,220);const th=BWT[0];BWBALLS.forEach((b,i)=>{const t2=b.c?Object.assign({},th,{ball:b.c,pat:b.pat}):th;bwBallAt(x,40+(i%12)*72,60+Math.floor(i/12)*100,30,1.2+i*.4,t2,false)});return c.toDataURL()});
fs.writeFileSync('/tmp/balls.png',Buffer.from(cv.split(',')[1],'base64'));
await p.evaluate(()=>{XS.gxg='bwl'});
console.log(errs);await b.close()})();
