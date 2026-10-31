const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:720}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';S.cycle=35;S.period=5;S.start=iso(add(today(),-15));save();tab='home';XV=null;draw()});
const top=()=>p.evaluate(()=>Math.round(document.querySelector('#dial').getBoundingClientRect().top));
await p.locator('#dial').scrollIntoViewIfNeeded();const t0=await top();console.log('dial top',t0);
await p.click('[data-a=edd]');console.log('after edit toggle',await top());
const bb=async()=>p.locator('#dial').boundingBox();
for(const [fx,fy,l] of [[.5,.07,'day1 (period card shows)'],[.9,.5,'mid'],[.5,.07,'day1 again'],[.2,.8,'late']]){const r=await bb();await p.mouse.click(r.x+r.width*fx,r.y+r.height*fy);console.log(l,'day',await p.evaluate(()=>dayOf(today())),'top',await top(),'hy card',await p.evaluate(()=>/تعویض نوار/.test(document.querySelector('#app').innerText)))}
await p.click('[data-a=edd]');console.log('after done',await top());console.log(err);await b.close()})()
