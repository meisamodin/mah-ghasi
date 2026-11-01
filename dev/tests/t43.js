const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:780},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-2));save();tab='tl';XV={s:'gm',d:true};draw()});
await p.click('[data-a=gxo][data-v=bwl]');
const ts=[400,500,500,500,500,500,500,500,600];let k=0;for(const t of ts){await p.waitForTimeout(t);await p.locator('#gxc').screenshot({path:'/tmp/i'+(k++)+'.png'});}
console.log(await p.evaluate(()=>[GX.st.st,GX.st.it]));console.log(err);await b.close()})();
