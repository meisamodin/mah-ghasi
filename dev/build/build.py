import re,sys,os
C='/home/claude/content/'
def rd(f):return open(C+f,encoding='utf8').read()
s=open('/home/claude/base_v94.html',encoding='utf8').read()
def rep1(a,b,cnt=1):
    global s
    assert s.count(a)>=1,('missing',a[:70])
    s=s.replace(a,b,cnt)
# ---- articles
art=''.join(rd(f)+'\n' for f in ['art_a.js','art_b.js','art_c.js','art_d.js','art_ext.js','art_ui.js'])
rep1("let SV=null,SRQ='';",art+"let SV=null,SRQ='';")
i=s.index("function artDraw(){$('#nav').innerHTML='';const a=AV.i!=null?ART[AV.i]:null;");j=s.index("/* ===== v9: backup",i)
s=s[:i]+s[j:]
rep1("else if(a==='ab'){AV.i=null;window.scrollTo(0,0)}","else if(a==='ab'){AV.i=null;window.scrollTo(0,0)}\n else if(a==='ac'){AV.c=b.dataset.v;AV.q=''}\n else if(a==='abk'){const t=ART[+b.dataset.v][1],L=artBk(),k=L.indexOf(t);if(k<0)L.push(t);else L.splice(k,1);save()}\n else if(a==='aod'){AV={i:+b.dataset.v,c:'all'};window.scrollTo(0,0)}")
rep1('<h3>💡 توصیه امروز</h3><div class="mu">${tip(I)}</div></div>','<h3>💡 توصیه امروز</h3><div class="mu">${tip(I)}</div></div>${artDayCard()}')
rep1('<div class="mu">چرخه، تخمک‌گذاری، PMS، دل‌درد، پریود نامنظم، کم‌خونی، PCOS و اینکه کی باید پیش پزشک بری.</div><button class="btn o" style="width:100%;margin-top:8px" data-a="av">خوندن مقاله‌ها</button>','<div class="mu">${fa(ART.length)} مقاله‌ی کاربردی: چرخه، بارداری، زایمان، نوزاد، تغذیه، سلامت روان و پیشگیری؛ با جستجو و نشان‌گذاری.</div><button class="btn o" style="width:100%;margin-top:8px" data-a="av">خوندن مقاله‌ها</button>')
# css
css=rd('extra.css') if os.path.exists(C+'extra.css') else ''
rep1('</head>','<style id="mgx">'+css+'</style></head>')

# ---- cooking
ck=''.join(rd(f)+'\n' for f in ['cook_a.js','cook_b.js','cook_c.js','cook_ui.js'])
rep1("/* ===== mod16 v2: bowling",ck+"/* ===== mod16 v2: bowling")
i=s.index("if(t==='rec'){\n  const f=XS.dgf");j=s.index("}else if(t==='les')",i)
s=s[:i]+"if(t==='rec'){h+=cookRec();\n "+s[j:]
rep1("else if(a==='dgf'){XS.dgf=b.dataset.v}","else if(a==='dgf'){XS.dgf=b.dataset.v}\n else if(a==='dgk'){XS.dgk=b.dataset.v}\n else if(a==='dgx'){XS.dgx=!XS.dgx}\n else if(a==='dgm'){XS.dgm=!XS.dgm}\n else if(a==='dgfv'){const L=rcpFav(),k=L.indexOf(b.dataset.v);if(k<0)L.push(b.dataset.v);else L.splice(k,1);save()}\n else if(a==='dgrnd'){const L=rcpList();if(L.length){XS.dgr=L[Math.floor(Math.random()*L.length)][0];XS.cqv=1;XS.cqk={};window.scrollTo(0,0)}}")
rep1("+`<button class=\"btn\" style=\"width:100%;margin:10px 0\" data-a=\"cqs\"","+(lesson?'':`<div class=\"row\" style=\"justify-content:flex-end;margin-top:8px\"><button class=\"chip\" data-a=\"dgfv\" data-v=\"${r[0]}\">${rcpFav().includes(r[0])?'⭐ '+oL('در علاقه‌مندی‌ها','In favorites'):'☆ '+oL('افزودن به علاقه‌مندی','Add to favorites')}</button></div>`)+`<button class=\"btn\" style=\"width:100%;margin:10px 0\" data-a=\"cqs\"")


# ---- toolbox v2
tl=''.join(rd(f)+'\n' for f in ['tools_a.js','tools_b.js','tools_c.js','tools_d.js','tools_e.js','tools_f.js'])
rep1("/* ===== mod16 v2: bowling",tl+"/* ===== mod16 v2: bowling")
rep1("function xvStop(full){","function xvStop(full){try{tlxStop()}catch(e){}")
rep1("if(!s){$('#app').innerHTML=hd('جعبه ابزار','ابزارهای کاربردی')","if(s&&typeof TLX!=='undefined'&&TLX[s]){const t=TLX[s];$('#app').innerHTML=hd(oL(t.fa,t.en))+t.h()+bk;if(t.init)t.init();return}\n if(!s){$('#app').innerHTML=hd('جعبه ابزار','ابزارهای کاربردی')")
rep1("else if(a==='xcp'){XS.cp=+b.dataset.v}","else if(a==='xcp'){XS.cp=+b.dataset.v}\n else if(a==='tx'){const q=b.dataset.v.split('|'),t=TLX[q[0]];if(t&&t.a&&t.a(q[1],q[2],b)===false)return}")
rep1("document.addEventListener('input',e=>{if(e.target&&e.target.id==='srq')srUpd(e.target.value)});","document.addEventListener('input',e=>{if(e.target&&e.target.id==='srq')srUpd(e.target.value)});\ndocument.addEventListener('input',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.tx){const q=t.dataset.tx.split('|'),x=TLX[q[0]];if(x&&x.i)x.i(q[1],t)}});\ndocument.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.tx&&(t.type==='file'||t.tagName==='SELECT')){const q=t.dataset.tx.split('|'),x=TLX[q[0]];if(x&&x.i)x.i(q[1],t)}});")

# extra modules
for f in ['cook.js','tools.js']:
    if os.path.exists(C+f):
        exec(open(C+f.replace('.js','.py'),encoding='utf8').read()) if os.path.exists(C+f.replace('.js','.py')) else None
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
print('built',len(s))

s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf8').read()
assert "const TGP=['pw'," in s and ",TGB=['bf'," in s
s=s.replace("const TGP=['pw',","const TGP=['pw','pts','sup','bms',",1).replace(",TGB=['bf',",",TGB=['mch','bf',",1)
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
print('order patched')

# ---- tester helpers and mode-aware calm tab
s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf8').read()
def r1(a,c):
    global s
    assert s.count(a)==1,('count',s.count(a),a[:60])
    s=s.replace(a,c)
r1("نسخه: 18\\nمرورگر: '","نسخه: '+APPV+'\\nحالت: '+S.mode+' · زبان: '+S.lang+' · صفحه: '+innerWidth+'x'+innerHeight+'\\nمرورگر: '")
r1("'\\nتب: '+tab+'","'\\nتب: '+tab+(XV&&XV.s?' · ابزار: '+XV.s:'')+'")
r1("function pmsTab(){const I=info(),on=I.pms;","function pmsTab(){if(S.mode==='preg'||S.mode==='meno')return pmsCalm();return pmsTab0()}\nfunction pmsTab0(){const I=info(),on=I.pms;")
r1("function draw(){try{if(!MGR){MGR=1;mgRestore()}draw0()","function draw(){try{TABS[2][2]=(S.mode==='preg'||S.mode==='meno')?'آرامش':'PMS';if(!MGR){MGR=1;mgRestore()}draw0()")
r1("abCard()+supCard()+aboutCard()","abCard()+testerCard()+supCard()+aboutCard()")
r1("else if(a==='xcp'){XS.cp=+b.dataset.v}","else if(a==='xcp'){XS.cp=+b.dataset.v}\n else if(a==='tsk'){const o=S.tst=S.tst||{},k=b.dataset.v;o[k]=o[k]?0:1;save()}")
r1("/* ===== mod16 v2: bowling",open('/home/claude/content/tester.js',encoding='utf8').read()+"\n/* ===== mod16 v2: bowling")
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
print('tester patched')

# ---- v100
s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf8').read()
r1("/* ===== mod16 v2: bowling",open('/home/claude/content/v100.js',encoding='utf8').read()+open('/home/claude/content/v100b.js',encoding='utf8').read()+"\n/* ===== mod16 v2: bowling")
r1("save=()=>{try{localStorage.setItem('mahbanoo'","save=()=>{if(window.DEC)return;try{localStorage.setItem('mahbanoo'")
r1("if(hp(e.target.value)===S.pin){UL=true;draw()}else{e.target.value='';$('#le').textContent='رمز اشتباهه'}","lkTry(e.target)")
r1("+goalsCard()+motCard()+calCard()}return home0()","+goalsCard()+artDayCard()+motCard()+calCard()}return home0()")
r1("function home(){if(quiet()){return(","function home(){if(S.sp)return(S.prof.name?'<div style=\"margin:0 4px 10px;font-weight:600\">سلام '+esc(S.prof.name)+' جان 💗</div>':'')+alertsCard()+aptCard()+spHome();if(quiet()){return(")
r1("if(S.sm&&(tab==='hl'||tab==='pms'||tab==='tl'))tab='home';","if(S.sm&&(tab==='hl'||tab==='pms'||tab==='tl'))tab='home';if(S.sp&&(tab==='hl'||tab==='pms'||tab==='log'))tab='home';")
r1("$('#nav').innerHTML=(S.sm?TABS.filter","$('#nav').innerHTML=(S.sp?spTabs():S.sm?TABS.filter")
r1("draw0();navSync();mgSave()}","draw0();navSync();mgSave();tourCheck()}")
r1("['🌐','⚙','🌸'","['🛟','🌐','⚙','🌸'")
r1("reorderCards(setTab()+setExtra(),","reorderCards(bkSetCard()+spSetCard()+setTab()+setExtra()+prvCard()+tourCard(),")
r1('data-a="tlb" aria-label="ابزار"','data-a="tlb" aria-label="ابزار" style="margin:0;background:var(--pk);color:#fff"')
r1("else if(a==='pd'){S.pin='';S.bio='';toast('قفل حذف شد')}","else if(a==='pd'){S.pin='';S.bio='';S.dpin='';S.aw=0;toast('قفل حذف شد')}\n else if(a==='spt'){S.sp=!S.sp;if(S.sp)tab='home';toast(S.sp?'حالت همسر روشن شد':'حالت همسر خاموش شد')}\n else if(a==='dps'){const v=($('#dpp')||{}).value||'';if(!/^\\d{4}$/.test(v)){toast('رمز فریب باید ۴ رقم باشه');return}if(hp(v)===S.pin){toast('رمز فریب باید با رمز اصلی فرق داشته باشه');return}S.dpin=hp(v);toast('رمز فریب ذخیره شد')}\n else if(a==='dpd'){S.dpin='';toast('رمز فریب حذف شد')}\n else if(a==='paw'){S.aw=+b.dataset.v;S.pf=0;toast(S.aw?'پاک‌سازی بعد از '+fa(S.aw)+' رمز اشتباه فعال شد':'پاک‌سازی خاموش شد')}\n else if(a==='tourgo'){S.tour=0}")
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
print('v100 patched')

s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf8').read()
r1("not:noticeTab,","not:()=>S.sp?spNoticeTab():noticeTab(),")
r1("if(!quiet()&&due('period')){let m=''","if(S.sp)spRem(out,I,N,k,due);if(!S.sp&&!quiet()&&due('period')){let m=''")
r1("if(!quiet()&&due('pms')&&","if(!S.sp&&!quiet()&&due('pms')&&")
r1("if(!quiet()&&due('ov')&&","if(!S.sp&&!quiet()&&due('ov')&&")
r1("if(due('log')&&!hasData","if(!S.sp&&due('log')&&!hasData")
r1("if(N.med.on)medsToday()","if(!S.sp&&N.med.on)medsToday()")
r1("const w=N.water;if(w.on&&","const w=N.water;if(!S.sp&&w.on&&")
r1("ev('🩸 پریود',","ev('🩸 پریود'+spN(),")
r1("ev('💜 PMS',","ev('💜 PMS'+spN(),")
r1("else if(a==='tourgo'){S.tour=0}","else if(a==='tourgo'){S.tour=0}\n else if(a==='splp'){S.spl=S.spl||[];const t=b.dataset.v;if(!S.spl.some(x=>x.t===t))S.spl.push({t,d:0});toast('به لیست اضافه شد');save();return}\n else if(a==='spla'){const v=(($('#splin')||{}).value||'').trim();if(!v)return;S.spl=S.spl||[];S.spl.push({t:v,d:0})}\n else if(a==='splt'){const x=(S.spl||[])[+b.dataset.v];if(x)x.d=x.d?0:1}\n else if(a==='spld'){(S.spl||[]).splice(+b.dataset.v,1)}\n else if(a==='spc'){const t=SPM[+b.dataset.v][1];try{if(navigator.share){navigator.share({text:t}).catch(()=>{})}else{navigator.clipboard.writeText(t);toast('کپی شد')}}catch(x){toast('کپی نشد')}return}")
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
print('v100b patched')
s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf8').read()
r1('</head>','<style>ul.spl{margin:6px 0 10px;padding-inline-start:20px;line-height:1.9;font-size:14px}ul.spl li{margin-bottom:4px}details summary{outline:none}</style></head>')
open('/mnt/user-data/outputs/mahbanoo.html','w',encoding='utf8').write(s)
