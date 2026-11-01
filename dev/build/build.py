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
tl=''.join(rd(f)+'\n' for f in ['tools_a.js','tools_b.js','tools_c.js','tools_d.js','tools_e.js'])
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
