const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));p.on('console',m=>{if(m.type()==='error')err.push('console:'+m.text())});
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='home';XV=null;draw()});
console.log('home card',await p.evaluate(()=>/یه استراحت کوتاه/.test(document.querySelector('#app').innerText)));
await p.evaluate(()=>{tab='tl';XV={s:'gm',d:true};draw()});await p.screenshot({path:'/tmp/g0.png'});
const box=async()=>p.locator('#gxc').boundingBox();
// bubbles
await p.click('[data-a=gxo][data-v=bub]');await p.waitForTimeout(700);
let r=await box();console.log('canvas',Math.round(r.width),Math.round(r.height));
const nb=()=>p.evaluate(()=>GX.st.b.length+'/'+GX.st.p.length);
const before=await p.evaluate(()=>GX.st.b.map(b=>[b.x,b.y,b.r]));
// pop the first on-screen bubble
const tgt=before.find(q=>q[1]>40&&q[1]<GX_H()) ;function GX_H(){return 400}
await p.mouse.click(r.x+tgt[0],r.y+tgt[1]);await p.waitForTimeout(120);console.log('after pop particles',await nb());
await p.waitForTimeout(300);await p.screenshot({path:'/tmp/g1.png'});
// mandala
await p.click('[data-a=gxb]');await p.click('[data-a=gxo][data-v=man]');await p.waitForTimeout(300);r=await box();
for(const [ci,fx,fy] of [[0,.5,.12],[5,.5,.3],[7,.8,.5],[2,.3,.7],[9,.5,.9],[4,.5,.5]]){await p.click('[data-a=gxx][data-v="c:'+ci+'"]');await p.mouse.click(r.x+r.width*fx,r.y+r.height*fy)}
await p.mouse.move(r.x+20,r.y+r.height/2);await p.mouse.down();for(let i=0;i<30;i++)await p.mouse.move(r.x+20+i*10,r.y+r.height/2+Math.sin(i/3)*40);await p.mouse.up();
console.log('mandala filled',await p.evaluate(()=>Object.values(S.gxs.man)[0].filter(x=>x!=null).length));
await p.click('[data-a=gxx][data-v="d:1"]');await p.waitForTimeout(100);await p.click('[data-a=gxx][data-v="d:0"]');await p.waitForTimeout(700);await p.screenshot({path:'/tmp/g2.png'});
// garden
await p.click('[data-a=gxb]');await p.click('[data-a=gxo][data-v=gar]');await p.waitForTimeout(300);r=await box();
for(const [fx,fy] of [[.2,.5],[.45,.4],[.7,.55],[.85,.7],[.3,.8],[.55,.3]]){await p.mouse.click(r.x+r.width*fx,r.y+r.height*fy);await p.waitForTimeout(150)}
await p.waitForTimeout(1800);await p.screenshot({path:'/tmp/g3.png'});console.log('flowers',await p.evaluate(()=>GX.st.fl.length));
await p.click('[data-a=gxx][data-v="n:1"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/g3n.png'});
// zen
await p.click('[data-a=gxb]');await p.click('[data-a=gxo][data-v=zen]');await p.waitForTimeout(300);r=await box();
await p.mouse.move(r.x+30,r.y+r.height*.5);await p.mouse.down();for(let i=0;i<40;i++)await p.mouse.move(r.x+30+i*7,r.y+r.height*.5+Math.sin(i/5)*50);await p.mouse.up();await p.waitForTimeout(200);await p.screenshot({path:'/tmp/g4.png'});
// puzzle
await p.click('[data-a=gxb]');await p.click('[data-a=gxo][data-v=puz]');await p.waitForTimeout(400);r=await box();await p.screenshot({path:'/tmp/g5.png'});
// solve by moving via BFS-free: reverse shuffle not available; just click movable tiles randomly 50 times & check no errors
for(let i=0;i<60;i++){const e=await p.evaluate(()=>GX.st.e),n=await p.evaluate(()=>GX.st.n);const nb=[];const R=Math.floor(e/n),C=e%n;if(R>0)nb.push(e-n);if(R<n-1)nb.push(e+n);if(C>0)nb.push(e-1);if(C<n-1)nb.push(e+1);const t=nb[Math.floor(Math.random()*nb.length)];const sz=r.width/n;await p.mouse.click(r.x+(t%n+.5)*sz,r.y+(Math.floor(t/n)+.5)*sz)}
console.log('moves',await p.evaluate(()=>GX.st.mv));
// force solved check
await p.evaluate(()=>{const s=GX.st;s.arr=s.arr.map((_,i)=>i);s.e=s.n*s.n-1;s.arr[s.e-1]=s.n*s.n-1;s.arr[s.e]=s.e-1;s.e=s.e-1;s.arr.forEach((v,i)=>{const q=s.pos(i);s.cur[v]={x:q.x,y:q.y}});GX.dirty=1});
await p.mouse.click(r.x+r.width*(1-.5/3),r.y+r.height*(1-.5/3));await p.waitForTimeout(400);console.log('solved msg',await p.evaluate(()=>document.getElementById('gxm').textContent));await p.screenshot({path:'/tmp/g6.png'});
await p.click('[data-a=gxx][data-v="p:4"]');await p.waitForTimeout(300);console.log('4x4',await p.evaluate(()=>GX.st.n));
// leave tool stops loop
await p.evaluate(()=>{XV=null;tab='home';draw()});await p.waitForTimeout(200);console.log('raf stopped',await p.evaluate(()=>GX.raf===0));
// english
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{XS.gxg=null;tab='tl';XV={s:'gm',d:true};draw()});console.log(await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,200)));
console.log(err);await b.close()})()
