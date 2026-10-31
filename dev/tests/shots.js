const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();
async function mk(seed){const c=await b.newContext({viewport:{width:360,height:720},deviceScaleFactor:3,locale:'fa-IR',timezoneId:'Asia/Tehran'});const p=await c.newPage();
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
await p.evaluate(seed);await p.waitForTimeout(400);return p}
const cyc=()=>{const t=today();S.mode='cycle';S.prof={name:'مریم',age:30,h:165,w:60};S.cycle=28;S.period=5;S.start=iso(add(t,-9));S.hist=[iso(add(t,-65)),iso(add(t,-37)),iso(add(t,-9))];
 const f=['سبک','متوسط','متوسط','سنگین','سبک'];for(let i=0;i<5;i++){const k=iso(add(t,-9+i));gl(k);S.logs[k].flow=f[i];S.logs[k].moods=['😊 شاد'];}
 for(let i=0;i<6;i++){const k=iso(add(t,-i));gl(k);S.logs[k].water=3+i%3;S.logs[k].temp=String(36.4+i*0.03)}
 save();tab='home';XV=null;draw()};
const shot=async(p,name)=>{await p.evaluate(()=>{document.querySelectorAll('.toast').forEach(e=>e.remove());window.scrollTo(0,0)});await p.screenshot({path:'/home/claude/store/'+name+'.png'})};
let p=await mk(cyc);await shot(p,'1-home');
await p.evaluate(()=>{tab='log';draw()});await shot(p,'2-log');
await p.evaluate(()=>{tab='tl';XV=null;draw()});await shot(p,'3-tools');
await p.evaluate(()=>{tab='tl';XV={s:'cal'};draw()});await shot(p,'4-calendar');
await p.evaluate(()=>{const k=kcS(),d=iso(today());k.d[d]=[{f:1,q:1},{f:11,q:1},{f:17,q:1},{f:36,q:1}];save();tab='tl';XV={s:'kcl'};draw()});await shot(p,'5-calories');
await p.evaluate(()=>{XV=null;tab='set';draw()});await shot(p,'8-settings');
let q=await mk(()=>{const t=today();S.mode='preg';S.prof={name:'مریم',age:30,h:165,w:60};S.start=iso(add(t,-168));S.cycle=28;save();tab='home';XV=null;draw()});await shot(q,'6-pregnancy');
await q.evaluate(()=>{tab='tl';XV={s:'kick'};draw()});await shot(q,'6b-kick');
let r=await mk(()=>{const t=today();S.mode='cycle';S.prof={name:'مریم',age:30,h:165,w:60};S.bb={dob:iso(add(t,-75))};save();tab='home';XV=null;draw()});await r.evaluate(()=>{tab='tl';XV={s:'bb'};draw()});await shot(r,'7-baby');
await r.evaluate(()=>{tab='tl';XV={s:'bb'};draw()});await shot(r,'7-baby');await r.evaluate(()=>{S.sk=[{ts:Date.now()-7200000,t:37.2,s:[]},{ts:Date.now()-3600000,t:37.8,s:['🤧 آبریزش بینی|🤧 Runny nose']},{ts:Date.now()-1800000,t:38.1,s:[]}];save();XV={s:'sk'};draw()});await shot(r,'7c-illness');
await b.close()})()
