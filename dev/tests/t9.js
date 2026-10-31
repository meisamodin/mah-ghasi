const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:380,height:820}});const p=await c.newPage();const err=[];p.on('pageerror',x=>err.push(x.message));p.on('dialog',d=>d.accept());
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
for(const s of ['[data-a=obs]','[data-a=qs]']){try{await p.click(s,{timeout:1500})}catch(_){}}
const open=async v=>{await p.evaluate(v=>{XV={s:v};draw()},v);await p.waitForTimeout(120)};
const T=(l,x)=>console.log(l,JSON.stringify(x));
// toolbox lists all
await p.evaluate(()=>{XV={s:null};draw()});T('tools',await p.evaluate(()=>document.querySelectorAll('#app .chips>.card').length));
// calculator
await open('calc');
const ev=async e=>p.evaluate(e=>{try{return clFmt(clEval(e))}catch(x){return 'ERR '+x.message}},e);
for(const e of ['2+3×4','(2+3)×4','2^3^2','-2^2','200+10%','200-10%','50%','sqrt(16)','√(9)+∛(27)','sin(30)','cos(60)','tan(45)','asin(0.5)','ln(e)','log(1000)','5!','2π','2(3+4)','10÷4','1÷0','0.1+0.2','1e','(1+2','sin30','100×1.1^2','7%','3!+2','abs(-5)','exp(1)']) T(e,await ev(e));
await p.evaluate(()=>{XS.ang='rad'});T('rad sin(pi/2)',await ev('sin(π÷2)'));await p.evaluate(()=>{XS.ang='deg'});
// UI keys
for(const k of ['2','+','3','×','4','=']) await p.click(`[data-a=ycl][data-v="${k}"]`);
T('ui',await p.evaluate(()=>({e:document.getElementById('cle').textContent,r:document.getElementById('clr').textContent,h:S.ch.length})));
await p.click('[data-a=ycl][data-v="×"]');await p.click('[data-a=ycl][data-v="2"]');T('cont',await p.evaluate(()=>[XS.cx,document.getElementById('clr').textContent]));
await p.click('[data-a=ycl][data-v="C"]');for(const k of ['sin(','3','0',')']) await p.click(`[data-a=ycl][data-v="${k}"]`).catch(async()=>{});
T('sin ui',await p.evaluate(()=>[XS.cx,document.getElementById('clr').textContent]));
await p.click('[data-a=ycl][data-v=B]');await p.click('[data-a=ycl][data-v=B]');await p.click('[data-a=ycl][data-v=B]');T('bs',await p.evaluate(()=>XS.cx));
await p.click('[data-a=ycl][data-v="2nd"]');T('2nd',await p.evaluate(()=>!!document.querySelector('[data-v="asin("]')));
await p.fill('#qcp','1000000');await p.fill('#qcd','20');await p.fill('#qct','10');T('quick',await p.evaluate(()=>document.getElementById('qcr').innerText.replace(/\n/g,' | ')));
// pregnancy
await open('pw');const lmp=await p.evaluate(()=>iso(add(today(),-140)));await p.fill('#pwl',lmp);await p.click('[data-a=ypw]');
T('pw',await p.evaluate(()=>document.querySelector('#app').innerText.replace(/\n+/g,' ').slice(0,420)));
await p.click('[data-a=ypn][data-v="1"]');await p.click('[data-a=ypn][data-v="-1"]');await p.click('[data-a=ypn][data-v="-1"]');T('pwk',await p.evaluate(()=>XS.pwk));
await p.evaluate(()=>{for(const w of [4,12,20,28,40]){XS.pwk=w;draw()}});
// hospital bag
await open('hb');await p.click('[data-a=yhk][data-v="0"]');await p.fill('#hbn','پستانک');await p.click('[data-a=yhg][data-v=baby]');await p.click('[data-a=yha]');T('hb',await p.evaluate(()=>({n:S.hb.length,done:S.hb.filter(x=>x.d).length,last:S.hb[S.hb.length-1]})));
// shopping
await open('sh');await p.fill('[data-shp="0"]','350000');await p.press('[data-shp="0"]','Tab');await p.waitForTimeout(100);await p.click('[data-a=ysk][data-v="0"]');T('sh',await p.evaluate(()=>({t:shTot(),first:S.sh[0]})));
await p.fill('#shn','کریر');await p.click('[data-a=ysa]');T('sh n',await p.evaluate(()=>S.sh.length));
// diaper & sleep
await open('dp');await p.click('[data-a=ydw]');await p.click('[data-a=ydp]');await p.click('[data-a=ydb]');await p.click('[data-a=yss]');await p.waitForTimeout(1100);await p.click('[data-a=yss]');T('dp',await p.evaluate(()=>({d:S.dpr.d.map(x=>x.k),s:S.dpr.s.length,txt:document.querySelector('#app').innerText.replace(/\n+/g,' ').slice(0,200)})));
// sound (headless audio)
await open('snd');for(const k of ['white','brown','rain','ocean','shush','heart']){await p.click(`[data-a=ysp][data-v=${k}]`);await p.waitForTimeout(250);}
T('snd',await p.evaluate(()=>({k:SND.k,nodes:SND.nodes.length,ctx:SND.ctx&&SND.ctx.state})));
await p.click('[data-a=ysm][data-v="15"]');T('timer',await p.evaluate(()=>SND.end>Date.now()));
await p.click('[data-a=yst]');T('stopped',await p.evaluate(()=>SND.k));
await p.click('[data-a=ysp][data-v=white]');await p.evaluate(()=>{XV={s:'br'};draw()});T('snd stops on leave',await p.evaluate(()=>SND.k));
// breathing
await p.click('[data-a=ybs]');await p.waitForTimeout(900);T('br',await p.evaluate(()=>({on:BRT.on,t:document.getElementById('brt').textContent,tr:document.getElementById('brc').style.transform})));
await p.evaluate(()=>{XV={s:'jn'};draw()});T('br stops on leave',await p.evaluate(()=>BRT.on));
// journal
await p.click('[data-a=yjm][data-v="😊"]');await p.fill('#jnx','امروز حالم خوب بود');await p.click('[data-a=yja]');T('jn',await p.evaluate(()=>S.jn));
// names
await open('nm');T('names',await p.evaluate(()=>document.querySelectorAll('#nml>.row').length));
await p.fill('#nms','ماه');T('search',await p.evaluate(()=>[...document.querySelectorAll('#nml b')].map(x=>x.textContent)));
await p.click('[data-a=ynf]');await p.click('[data-a=ynt][data-v=m]');await p.fill('#nca','نویان');await p.fill('#ncm','فرمانده');await p.click('[data-a=yna][data-v=m]');T('nm',await p.evaluate(()=>({nm:S.nm,list:document.querySelectorAll('#nml>.row').length})));
await p.click('[data-a=ynt][data-v=v]');T('fav',await p.evaluate(()=>[...document.querySelectorAll('#nml b')].map(x=>x.textContent)));
T('errors',err);await p.screenshot({path:'/tmp/nm.png'});await b.close()})()
