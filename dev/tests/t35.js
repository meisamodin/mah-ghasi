const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.screenshot({path:'/tmp/w0.png'});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(1500);
const r=await p.locator('#gxc').boundingBox();console.log('canvas',r.width,r.height);await p.screenshot({path:'/tmp/w1.png'});
const throwB=async(dx=0,curve=0,fast=true)=>{const x0=r.x+r.width/2+dx,y0=r.y+r.height*.86;await p.mouse.move(x0,y0);await p.mouse.down();await p.mouse.move(x0,y0+4);const n=8;for(let i=1;i<=n;i++){await p.mouse.move(x0+curve*Math.sin(i/n*3.14)+dx*0,y0-i*(fast?30:14));await p.waitForTimeout(fast?4:40)}await p.mouse.up()};
await throwB(0,0);await p.waitForTimeout(600);await p.screenshot({path:'/tmp/w2.png'});await p.waitForTimeout(700);await p.screenshot({path:'/tmp/w3.png'});
await p.waitForTimeout(3500);console.log('after1',await p.evaluate(()=>[GX.st.st,GX.st.rolls.join(','),GX.st.f,GX.st.k]));await p.screenshot({path:'/tmp/w4.png'});
await p.waitForTimeout(1500);console.log('state',await p.evaluate(()=>[GX.st.st,GX.st.pins.length]));
// play many throws with variety
for(let i=0;i<30;i++){const st=await p.evaluate(()=>GX.st.st);if(st==='over')break;if(st!=='aim'){await p.waitForTimeout(500);i--;if(i<-40)break;continue}await p.waitForTimeout(300);await throwB((Math.random()-.5)*120,(Math.random()-.5)*60);await p.waitForTimeout(2800)}
console.log('rolls',await p.evaluate(()=>[GX.st.st,GX.st.rolls.join(','),GX.st.f]));
await p.waitForTimeout(3000);console.log('final',await p.evaluate(()=>[GX.st.st,GX.st.rolls.length,GX.st.total,JSON.stringify(bwScore(GX.st.rolls).map(f=>f.c))]));await p.screenshot({path:'/tmp/w5.png'});
console.log(err);await b.close()})();
