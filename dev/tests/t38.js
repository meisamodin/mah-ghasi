const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:1})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(1200);
const r=await p.locator('#gxc').boundingBox();
const shots={};let n=0;
for(let guard=0;guard<80;guard++){const st=await p.evaluate(()=>GX.st.st);if(st==='over')break;
 if(st!=='aim'){await p.waitForTimeout(250);continue}
 if(await p.evaluate(()=>GX.st.dropT>0)){await p.waitForTimeout(200);continue}
 n++;const dx=(Math.random()-.5)*60,cv=(Math.random()-.5)*50,x0=r.x+r.width/2+dx,y0=r.y+r.height*.88;
 await p.mouse.move(x0,y0);await p.mouse.down();await p.mouse.move(x0,y0+3);for(let i=1;i<=6;i++){await p.mouse.move(x0+cv*Math.sin(i/6*3.14),y0-i*38)}await p.mouse.up();
 if(n===2){await p.waitForTimeout(700);await p.locator('#gxc').screenshot({path:'/tmp/x1.png'});await p.waitForTimeout(250);await p.locator('#gxc').screenshot({path:'/tmp/x2.png'})}
 await p.waitForTimeout(500)}
console.log('rolls',await p.evaluate(()=>[GX.st.st,GX.st.rolls.join(','),GX.st.f,GX.st.k,GX.st.total]));
console.log('cum',await p.evaluate(()=>JSON.stringify(bwScore(GX.st.rolls).map(f=>f.c))));
await p.waitForTimeout(500);await p.locator('#gxc').screenshot({path:'/tmp/x3.png'});
// tap restart
await p.waitForTimeout(800);const rr=await p.locator('#gxc').boundingBox();await p.mouse.click(rr.x+100,rr.y+300);await p.waitForTimeout(300);console.log('restart',await p.evaluate(()=>[GX.st.st,GX.st.rolls.length,GX.st.best]));
console.log(err);await b.close()})();
