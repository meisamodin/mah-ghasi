const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:720},deviceScaleFactor:2})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{S.prof={name:'م',age:30};S.mode='cycle';save();tab='set';XV=null;draw()});
console.log('settings card',await p.evaluate(()=>!!document.querySelector('[data-a=hpo]')));
await p.click('[data-a=hpo]');console.log('entries',await p.evaluate(()=>document.querySelectorAll('#app details').length));
await p.fill('#hps','پشتیبان');console.log('visible',await p.evaluate(()=>[...document.querySelectorAll('#app details')].filter(d=>d.style.display!=='none').length));
await p.fill('#hps','zzzz');console.log('none msg',await p.evaluate(()=>document.getElementById('hpn').style.display));
await p.screenshot({path:'/tmp/h1.png'});
await p.click('[data-a=hpb]');console.log('back to settings',await p.evaluate(()=>XV===null&&tab==='set'));
await p.evaluate(()=>{tab='tl';XV={s:'kick',d:true};draw()});console.log('? btn',await p.evaluate(()=>!!document.querySelector('[data-a=hpt]')));
await p.screenshot({path:'/tmp/h2.png'});
await p.click('[data-a=hpt]');console.log('open item',await p.evaluate(()=>document.querySelector('#app details[open] summary').innerText));
await p.waitForTimeout(400);await p.screenshot({path:'/tmp/h3.png'});console.log('scrollY',await p.evaluate(()=>window.scrollY+'/'+document.documentElement.scrollHeight));
await p.click('[data-a=hpb]');console.log('back to tool',await p.evaluate(()=>XV&&XV.s));
await p.evaluate(()=>{XV={s:'qz',d:true};draw()});await p.click('[data-a=hpt]');await p.click('#app details[open] [data-a=hpg]');console.log('open tool',await p.evaluate(()=>XV.s));
for(const id of ['cal','mid','sk']){await p.evaluate(id=>{XV={s:id,d:true};draw()},id);console.log(id,'?',await p.evaluate(()=>!!document.querySelector('[data-a=hpt]')))}
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);
await p.evaluate(()=>{XS.hq=null;XV={s:'help',d:true};draw()});console.log(await p.evaluate(()=>document.querySelector('#app').innerText.split('\n').filter(t=>/[؀-ۿ]/.test(t)).join('|').slice(0,300)));
await p.evaluate(()=>{XV={s:'kick',d:true};draw()});await p.click('[data-a=hpt]');console.log(await p.evaluate(()=>document.querySelector('#app details[open] summary').innerText));
console.log(err);await b.close()})()
