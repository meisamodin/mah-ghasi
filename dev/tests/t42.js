const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:780},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');await p.waitForTimeout(1500);
await p.evaluate(()=>{GX.st.th=1});
const r=await p.locator('#gxc').boundingBox();const x0=r.x+r.width/2,y0=r.y+r.height*.88;
await p.mouse.move(x0,y0);await p.mouse.down();await p.mouse.move(x0,y0+3);for(let i=1;i<=6;i++)await p.mouse.move(x0,y0-i*40);await p.mouse.up();
const ts=[250,300,300,200,250,300,500];let k=0;for(const t of ts){await p.waitForTimeout(t);await p.locator('#gxc').screenshot({path:'/tmp/y'+(k++)+'.png'})}
console.log(await p.evaluate(()=>[GX.st.st,GX.st.rolls.join(','),GX.st.pins.filter(p=>p.st===0).length]));
console.log(err);await b.close()})();
