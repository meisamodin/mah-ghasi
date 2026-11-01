/* ===== v100: tour, spouse mode, privacy, backup card, tools grid ===== */
const TCATS=[['all','همه'],['h','🩺 سلامت و بارداری'],['f','🥗 ورزش و تغذیه'],['b','👶 نوزاد'],['d','🧰 روزمره'],['r','🕌 مذهبی و فال']];
const TCM={};
'steps med mid lab apt dq zen due cyc bmi brx ivf pw vt fd kick ctr br px hb mch sup pts bms'.split(' ').forEach(k=>TCM[k]='h');
'kcl dgp fit cys'.split(' ').forEach(k=>TCM[k]='f');
'sk frs bf dp bb bm snd sh nm jn pn'.split(' ').forEach(k=>TCM[k]='b');
'pray qz qibla tsb haf drm zod abj'.split(' ').forEach(k=>TCM[k]='r');
let TCAT='all';
function stCard(){const o=stS(),d=o.days[iso(today())]||{n:0,kc:0},g=o.goal||8000;
 if(!d.n&&!STP.on)return`<div class="card" style="cursor:pointer" data-a="xvo" data-v="steps"><h3>👣 قدم‌شمار</h3><div class="mu">هنوز امروز قدمی ثبت نشده. برای شروع پیاده‌روی و شمارش قدم و کالری بزن. (هدف: ${fa(g)} قدم)</div></div>`;
 return`<div class="card" style="cursor:pointer" data-a="xvo" data-v="steps"><h3>👣 قدم‌شمار</h3><div style="display:flex;align-items:baseline;gap:6px"><b style="font-size:26px">${fa(d.n)}</b><span class="mu">قدم از ${fa(g)}</span></div><div class="mu"><b>${stNum(d.kc,0)}</b> کیلوکالری سوزونده‌شده${STP.on?' · در حال پیاده‌روی':''}</div><div style="height:8px;border-radius:6px;background:rgba(127,127,127,.2);margin-top:8px;overflow:hidden"><div style="height:100%;width:${Math.min(100,d.n/g*100)}%;background:#0e9f6e"></div></div></div>`}
function toolsTab(){const all=toolList().filter(x=>x[0]!=='steps'&&!toolHidden(x[0])),qq=n=>all.length>TLQ;
 const tile=(x,sm)=>`<div class="card tlt" data-nm="${esc(x[2])}" style="margin:0;text-align:center;cursor:pointer;padding:${sm?'12px 4px':'16px 8px'}" data-a="xvo" data-v="${x[0]}"><div style="font-size:${sm?26:32}px">${x[1]}</div><b style="font-size:${sm?12:14}px">${x[2]}</b></div>`;
 let h=stCard();
 if(!TLALL){h+=`<div class="card"><h3>🧰 ${oL('ابزارهای اصلی','Main tools')}</h3><div class="chips" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px">${all.slice(0,TLQ).map(x=>tile(x)).join('')}</div>${qq()?`<button class="btn o" style="width:100%;margin-top:12px" data-a="tlx">${oL('نمایش همه‌ی ابزارها','Show all tools')} (${fa(all.length)})</button>`:''}</div>`}
 else{const L=all.filter(x=>TCAT==='all'||(TCM[x[0]]||'d')===TCAT);
  h+=`<div class="card"><h3>🧰 ${oL('همه‌ی ابزارها','All tools')} (${fa(all.length)})</h3><input id="tq" style="width:100%;box-sizing:border-box;margin-top:6px" placeholder="${oL('جستجوی ابزار…','Search tools…')}"><div class="chips" style="margin:8px 0">${TCATS.map(c=>`<button class="chip ${TCAT===c[0]?'on':''}" data-tcat="${c[0]}">${c[1]}</button>`).join('')}</div><div id="tgr" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">${L.map(x=>tile(x,1)).join('')}</div><div class="mu" id="tno" style="display:none;text-align:center;margin-top:8px">ابزاری پیدا نشد</div><button class="btn o" style="width:100%;margin-top:12px" data-a="tlx">${oL('نمایش ابزارهای اصلی','Show main tools only')}</button></div>`}
 return h+`<div class="mu" style="font-size:12px;margin:8px 4px;line-height:1.9">ابزارها فقط از حسگرهای خود گوشی استفاده می‌کنن و هیچ اطلاعاتی به جایی فرستاده نمی‌شه.</div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tcat]');if(b){TCAT=b.dataset.tcat;draw()}});
document.addEventListener('input',e=>{if(e.target.id!=='tq')return;const q=e.target.value.trim().toLowerCase();let n=0;document.querySelectorAll('.tlt').forEach(c=>{const ok=!q||c.dataset.nm.toLowerCase().includes(q);c.style.display=ok?'':'none';if(ok)n++});const t=$('#tno');if(t)t.style.display=n?'none':'block'});

/* spouse mode */
function spActive(){return !!S.sp}
function spTabs(){return TABS.filter(t=>['home','not','set'].includes(t[0])).concat([['tl','🧰','ابزار']]).sort((a,b)=>['home','tl','not','set'].indexOf(a[0])-['home','tl','not','set'].indexOf(b[0]))}
/* backup + privacy cards */
function bkSetCard(){const L=S.lbk;return`<div class="card" style="border:1.5px solid var(--pk)"><h3>🛟 ${oL('پشتیبان‌گیری از اطلاعات','Backup your data')}</h3><div class="mu" style="line-height:1.9">اطلاعاتت فقط روی همین گوشی ذخیره می‌شه. اگه داده‌های مرورگر پاک بشه یا گوشی عوض کنی، بدون فایل پشتیبان از بین می‌ره.<br><b>${L?'آخرین فایل پشتیبان: '+dtf(L):'هنوز فایل پشتیبان نگرفتی.'}</b></div><button class="btn" style="width:100%;margin-top:8px" data-a="bkd">📥 دانلود فایل پشتیبان</button><div class="mu" style="font-size:12px;margin-top:6px">برای برگردوندن اطلاعات، پایین‌تر در همین تنظیمات «بازیابی» رو بزن.</div></div>`}
function prvCard(){if(!S.pin)return`<div class="card"><h3>🔒 ${oL('رمز فریب و پاک‌سازی','Decoy PIN & wipe')}</h3><div class="mu">اول بالاتر «قفل برنامه» رو فعال کن؛ بعدش می‌تونی رمز فریب و پاک‌سازی خودکار رو تنظیم کنی.</div></div>`;
 const aw=S.aw||0;return`<div class="card"><h3>🔒 ${oL('رمز فریب و پاک‌سازی','Decoy PIN & wipe')}</h3><div class="mu" style="line-height:1.9">«رمز فریب»: اگه کسی تو رو مجبور کنه برنامه رو باز کنی، با این رمز یه نسخه‌ی خالی و بی‌خطر باز می‌شه و اطلاعات واقعی دیده نمی‌شه.</div>${S.dpin?`<button class="btn o" style="width:100%;margin-top:8px" data-a="dpd">حذف رمز فریب</button>`:`<div class="row" style="margin-top:8px"><input type="password" inputmode="numeric" maxlength="4" id="dpp" placeholder="رمز فریب (۴ رقم)"><button class="btn" data-a="dps">ذخیره</button></div>`}<div class="mu" style="margin-top:12px;line-height:1.9"><b>پاک‌سازی بعد از رمز اشتباه:</b> اگه چند بار پشت‌سرهم رمز اشتباه زده بشه، همه‌ی اطلاعات برنامه پاک می‌شه (حتی خودت اگه رمز رو فراموش کنی). حتماً فایل پشتیبان داشته باش.</div><div class="chips" style="margin-top:6px">${[[0,'خاموش'],[5,'بعد از ۵ بار'],[10,'بعد از ۱۰ بار'],[15,'بعد از ۱۵ بار']].map(x=>`<button class="chip ${aw===x[0]?'on':''}" data-a="paw" data-v="${x[0]}">${x[1]}</button>`).join('')}</div></div>`}
function lkTry(el){const v=el.value;
 if(hp(v)===S.pin){S.pf=0;save();UL=true;draw();return}
 if(S.dpin&&hp(v)===S.dpin){S={start:iso(add(today(),-9)),cycle:28,period:5,logs:{},notif:false,prof:{name:'',age:'',h:'',w:''},bp:[],bs:[],ob:true,tour:1};window.DEC=true;UL=true;draw();return}
 S.pf=(S.pf||0)+1;save();
 if(S.aw&&S.pf>=S.aw){try{localStorage.removeItem('mahbanoo');localStorage.removeItem('mg_nav');localStorage.removeItem('mb_t');indexedDB.deleteDatabase('mb_bk')}catch(x){}setTimeout(()=>location.reload(),300);return}
 el.value='';$('#le').textContent='رمز اشتباهه'+(S.aw?' · '+fa(Math.max(0,S.aw-S.pf))+' تلاش مونده':'')}

/* first-run tour */
const TOURS=[['🌸','به ماه قاسی خوش اومدی','اینجا چرخه، علائم، سلامت و ابزارهای روزمره‌ات کنار هم هستن. اطلاعاتت فقط روی همین گوشی می‌مونه.'],
['❤️','ثبت علائم','هر روز حال و علائمت رو (درد، خلق، خواب، آب و…) تو تب «ثبت علائم» بنویس تا برنامه الگوهات رو بشناسه.'],
['🧰','جعبه‌ابزار','دکمه‌ی 🧰 بالای صفحه بیش از ۸۰ ابزار داره: آشپزی و رژیم، برنامه‌ی ورزشی، قبله، فال حافظ، وام و خیلی بیشتر؛ با جستجو و دسته‌بندی.'],
['🩺','سلامت و مقاله‌ها','تب «سلامت» راهنمای علائم، نمودارها و ۹۵ مقاله‌ی کاربردی داره. اگه باردار یا مادر نوزادی، حالتت رو از تنظیمات عوض کن.'],
['💾','پشتیبان بگیر','تو «تنظیمات» فایل پشتیبان بگیر تا با عوض شدن گوشی یا پاک شدن داده‌ها اطلاعاتت نره. اگه مشکلی دیدی، «گزارش مشکل» تو تنظیمات هست. ممنون که تست می‌کنی 💗']];
let TOURI=0;
function tourCheck(){try{if(S.ob===false||S.tour||(S.pin&&!UL)||document.getElementById('tour'))return;
 const d=document.createElement('div');d.id='tour';d.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;direction:rtl';
 const R=()=>{const t=TOURS[TOURI],last=TOURI===TOURS.length-1;d.innerHTML=`<div style="background:var(--cd,#fff);color:var(--tx,#222);border-radius:22px;padding:24px 20px;max-width:340px;width:100%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.3)"><div style="font-size:54px">${t[0]}</div><h3 style="margin:10px 0 6px">${t[1]}</h3><div style="line-height:2;font-size:14px;opacity:.85">${t[2]}</div><div style="margin:14px 0">${TOURS.map((_,i)=>`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 3px;background:${i===TOURI?'#e11d48':'rgba(127,127,127,.35)'}"></span>`).join('')}</div><button id="tn" class="btn" style="width:100%">${last?'شروع':'بعدی'}</button>${last?'':'<button id="ts" class="chip" style="margin-top:8px">رد کردن</button>'}</div>`;
  d.querySelector('#tn').onclick=()=>{if(last){fin()}else{TOURI++;R()}};const s=d.querySelector('#ts');if(s)s.onclick=fin};
 const fin=()=>{S.tour=1;save();d.remove();TOURI=0};TOURI=0;R();document.body.appendChild(d)}catch(e){console.error(e)}}
function tourCard(){return`<div class="card"><h3>📘 ${oL('راهنمای برنامه','App guide')}</h3><div class="mu">تور معرفی برنامه رو دوباره ببین.</div><button class="btn o" style="width:100%;margin-top:8px" data-a="tourgo">نمایش راهنما</button></div>`}
