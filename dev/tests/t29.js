const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:720},deviceScaleFactor:2,hasTouch:false})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=28;S.period=5;S.start=iso(add(today(),-9));save();tab='home';XV=null;draw()});
const day=()=>p.evaluate(()=>dayOf(today()));
const clickDial=async(fx,fy)=>{const bb=await p.locator('#dial').boundingBox();await p.mouse.click(bb.x+bb.width*fx,bb.y+bb.height*fy)};
console.log('start day',await day());
await p.locator('#dial').scrollIntoViewIfNeeded();
await clickDial(.5,.07);console.log('locked click -> day',await day());
await p.click('[data-a=edd]');console.log('edit on',await p.evaluate(()=>EDL.dial));
await p.locator('#dial').scrollIntoViewIfNeeded();await clickDial(.5,.07);console.log('unlocked click -> day',await day());
await p.screenshot({path:'/tmp/e1.png'});
await p.click('[data-a=edd]');console.log('done',await p.evaluate(()=>EDL.dial));
await clickDial(.9,.5);console.log('locked again ->',await day());
await p.evaluate(()=>{tab='set';draw()});
console.log('sliders disabled',await p.evaluate(()=>[...document.querySelectorAll('input[data-a=c],input[data-a=pr]')].map(x=>x.disabled)));
await p.screenshot({path:'/tmp/e2.png'});
await p.click('[data-a=edc]');await p.evaluate(()=>{const e=document.querySelector('input[data-a=c]');e.value=33;e.dispatchEvent(new Event('input',{bubbles:true}))});console.log('cycle after edit',await p.evaluate(()=>S.cycle));
await p.screenshot({path:'/tmp/e3.png'});
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{tab='home';draw()});
console.log(await p.evaluate(()=>[...document.querySelectorAll('.edbtn')].map(x=>x.innerText)),err);await b.close()})()
