const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bal]');await p.waitForTimeout(2000);
const r=await p.locator('#gxc').boundingBox();const G=await p.evaluate(()=>GXD.bal.geo());
await p.mouse.move(r.x+G.ax,r.y+G.ay);await p.mouse.down();await p.mouse.move(r.x+G.ax-60,r.y+G.ay+30,{steps:6});await p.screenshot({path:'/tmp/c1.png'});await p.mouse.up();await p.waitForTimeout(150);
// teleport ball onto a target
await p.evaluate(()=>{const s=GX.st,q=s.t[0];s.ball.x=q.x-30;s.ball.y=q.y;s.ball.vx=300;s.ball.vy=0});await p.waitForTimeout(120);await p.screenshot({path:'/tmp/c2.png'});
console.log(await p.evaluate(()=>[GX.st.score,GX.st.hits,GX.st.t.filter(q=>q.dead).length]));
await p.waitForTimeout(250);await p.screenshot({path:'/tmp/c3.png'});
console.log(err);await b.close()})();
