const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:380,height:820}});const p=await ctx.newPage();const err=[];p.on('pageerror',x=>err.push(x.message));p.on('dialog',d=>d.accept());
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(()=>{XV={s:'lab'};draw()});
const add=async(k,v,extra)=>{await p.selectOption('#lbk',k);await p.fill('#lbv',v);if(extra)await extra();await p.click('[data-a=zla]')};
await add('ldl','160');await add('hb','9.5');await add('alt','20',async()=>{await p.fill('#lbn','ناشتا')});
await p.fill('#lbv','5');await p.click('details summary');await p.fill('#lbcn','فریتین ویژه');await p.fill('#lbcu','x');await p.click('[data-a=zla]');
console.log(await p.evaluate(()=>JSON.stringify(S.lb)+JSON.stringify(S.lcu)));
await p.click('[data-a=zle]');console.log('edit',await p.evaluate(()=>document.querySelector('#lbv').value));
await p.fill('#lbv','11');await p.click('[data-a=zla]');
console.log(await p.evaluate(()=>document.querySelector('#app').innerText.slice(0,400)));
console.log('groups',await p.evaluate(()=>[...document.querySelectorAll('#lbk optgroup')].map(g=>g.label+':'+g.children.length).join(' ')));
// parse check
console.log(await p.evaluate(()=>JSON.stringify(parseLab("HDL Cholesterol 55\nCholesterol 190\nLDL 100\nCreatinine 0.9\nTotal Cholesterol 200"))));
// TV
await p.evaluate(()=>{XV={s:'tv'};draw()});await p.click('[data-a=zvb]');console.log('tv',await p.evaluate(()=>S.tv.ch.length));
await p.evaluate(()=>{S.lang='en';save()});await p.reload();await p.waitForTimeout(500);await p.evaluate(()=>{XV={s:'lab'};draw()});
console.log(await p.evaluate(()=>[...document.querySelector('#app').innerText.split('\n')].filter(t=>/[؀-ۿ]/.test(t)).join(' | ').slice(0,900)));
console.log(err);await b.close()})()
