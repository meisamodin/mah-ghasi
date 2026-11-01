const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.screenshot({path:'/tmp/b0.png'});
await p.click('[data-a=gxo][data-v=bal]');await p.waitForTimeout(800);await p.screenshot({path:'/tmp/b1.png'});
const r=await p.locator('#gxc').boundingBox();console.log('canvas',r.width,r.height);
const G=await p.evaluate(()=>GXD.bal.geo());
// throw: aim at first target by brute-force search of pull vector
const best=await p.evaluate(()=>{const s=GX.st,G=GXD.bal.geo();let bst=null;const t=s.t[0];for(let ang=-0.1;ang<1.3;ang+=.02)for(let d=30;d<=88;d+=4){const vx=-Math.cos(ang)*-d*-1;}return null});
// simple: scan pulls
const pull=await p.evaluate(()=>{const s=GX.st,G=GXD.bal.geo();const tg=s.t.filter(q=>q.type==='bull'||q.type==='balloon')[0]||s.t[0];let bst=[1e9,0,0];for(let px=-88;px<=0;px+=2)for(let py=-30;py<=88;py+=2){if(Math.hypot(px,py)>88)continue;const o=GXD.bal.sim(G.ax+px,G.ay+py,-px*7.4,-py*7.4,200,.01);o.forEach(q=>{const d=Math.hypot(q[0]-tg.x,q[1]-tg.y);if(d<bst[0])bst=[d,px,py]})}return bst});
console.log('best pull',pull);
await p.mouse.move(r.x+G.ax,r.y+G.ay);await p.mouse.down();await p.mouse.move(r.x+G.ax+pull[1],r.y+G.ay+pull[2],{steps:6});await p.screenshot({path:'/tmp/b2.png'});await p.mouse.up();
await p.waitForTimeout(500);await p.screenshot({path:'/tmp/b3.png'});await p.waitForTimeout(3500);
console.log('state',await p.evaluate(()=>[GX.st.state,GX.st.score,GX.st.balls,GX.st.hits]));await p.screenshot({path:'/tmp/b4.png'});
// force level clear
await p.evaluate(()=>{GX.st.t.forEach(q=>q.dead=1);GX.st.state='wait';GX.st.wait=0;GX.st.ball=null});await p.waitForTimeout(600);
console.log('lvl state',await p.evaluate(()=>[GX.st.state,GX.st.lv,GX.st.score]));await p.waitForTimeout(2600);console.log('next lvl',await p.evaluate(()=>[GX.st.state,GX.st.lv,GX.st.t.length]));await p.screenshot({path:'/tmp/b5.png'});
// game over
await p.evaluate(()=>{GX.st.balls=0;GX.st.state='wait';GX.st.wait=0;GX.st.ball=null});await p.waitForTimeout(700);
console.log('over',await p.evaluate(()=>[GX.st.state,!!GX.st.over,S.gxs.best]));await p.screenshot({path:'/tmp/b6.png'});
await p.waitForTimeout(700);await p.mouse.click(r.x+100,r.y+100);await p.waitForTimeout(300);console.log('restart',await p.evaluate(()=>[GX.st.state,GX.st.lv,GX.st.score,GX.st.best]));
// EN
await p.evaluate(()=>{S.lang='en';save();draw()});await p.waitForTimeout(400);await p.screenshot({path:'/tmp/b7.png'});
console.log('errors',err);await b.close()})();
