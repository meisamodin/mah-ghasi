/* ===== mod13: calm games (canvas) ===== */
const GXG=[
['bub','🫧','حباب‌ترکونی','Bubble pop','حباب‌های رنگی و نرم رو با انگشتت بترکون','Pop soft colorful bubbles with your finger','#c4b5fd,#f9a8d4'],
['man','🌸','ماندالا','Mandala','ماندالا رو با رنگ‌های ملایم رنگ کن','Color a mandala with gentle shades','#fbcfe8,#a5b4fc'],
['gar','🌷','باغ آرام','Calm garden','هر جا بزنی یه گل می‌روئه','A flower grows wherever you tap','#bbf7d0,#fde68a'],
['zen','🪨','ماسه‌ی ذن','Zen sand','روی ماسه خط بکش و آروم باش','Rake lines in the sand and relax','#fde68a,#e7d9b6'],
['puz','🧩','پازل رنگی','Color puzzle','بدون زمان و امتیاز؛ رنگ‌ها رو مرتب کن','No timer, no score; put the colors in order','#a5f3fc,#fda4af']];
const GX={g:null,raf:0,cv:null,cx:null,w:0,h:0,dpr:1,ac:null,sv:0,st:null,down:0,dirty:1,t:0};
function gxS(){S.gxs=S.gxs||{snd:0,vib:0,man:{},fl:[],night:0,pz:3,mc:0,md:0};return S.gxs}
function gxStop(){cancelAnimationFrame(GX.raf);GX.raf=0;GX.g=null;GX.st=null;GX.cv=null;GX.down=0;if(GX.ac){try{GX.ac.close()}catch(e){}GX.ac=null}}
function gxSave(){clearTimeout(GX.sv);GX.sv=setTimeout(save,500)}
function gxTone(f,d,v){if(!gxS().snd)return;try{GX.ac=GX.ac||new(window.AudioContext||window.webkitAudioContext)();const a=GX.ac,o=a.createOscillator(),g=a.createGain(),n=a.currentTime;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(v||.05,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.05)}catch(e){}}
function gxVib(ms){if(gxS().vib&&navigator.vibrate){try{navigator.vibrate(ms||8)}catch(e){}}}
function gxXY(e){const r=GX.cv.getBoundingClientRect();return{x:(e.clientX-r.left)*GX.w/r.width,y:(e.clientY-r.top)*GX.h/r.height}}
const rnd=(a,b)=>a+Math.random()*(b-a);
function gxRR(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
/* ---------- bubbles ---------- */
const GXD={};
GXD.bub={init(){const b=[];for(let i=0;i<20;i++)b.push(GXD.bub.mk(true));return{b,p:[],r:[]}},
 mk(any){const r=rnd(22,50);return{x:rnd(r,GX.w-r),y:any?rnd(0,GX.h):GX.h+r+rnd(0,60),r,vy:rnd(14,34)*(50/r)*.5+8,ph:rnd(0,6.28),h:rnd(250,340),a:rnd(.6,1.4)}},
 pop(i){const s=GX.st,b=s.b[i];s.b.splice(i,1);for(let k=0;k<12;k++){const a=Math.random()*6.28,v=rnd(40,130);s.p.push({x:b.x,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,h:b.h,r:rnd(2,5)})}s.r.push({x:b.x,y:b.y,r:b.r,l:1,h:b.h});gxTone(280+(55-b.r)*14,.35,.05);gxVib(8)},
 hit(p){const s=GX.st;for(let i=s.b.length-1;i>=0;i--){const b=s.b[i];if(Math.hypot(p.x-b.x,p.y-b.y)<b.r){GXD.bub.pop(i);return}}},
 down(p){GXD.bub.hit(p)},move(p){if(GX.down)GXD.bub.hit(p)},
 draw(t,dt){const c=GX.cx,s=GX.st,W=GX.w,H=GX.h,sh=Math.sin(t/6000)*20;
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`hsl(${265+sh},80%,90%)`);g.addColorStop(1,`hsl(${325+sh},85%,90%)`);c.fillStyle=g;c.fillRect(0,0,W,H);
  s.b.forEach(b=>{b.y-=b.vy*dt;b.x+=Math.sin(t/900*b.a+b.ph)*.35});
  s.b=s.b.filter(b=>b.y>-b.r*2);while(s.b.length<20)s.b.push(GXD.bub.mk(false));
  s.b.forEach(b=>{const gr=c.createRadialGradient(b.x-b.r*.35,b.y-b.r*.4,b.r*.05,b.x,b.y,b.r);gr.addColorStop(0,'hsla('+b.h+',90%,98%,.85)');gr.addColorStop(.35,'hsla('+b.h+',85%,85%,.28)');gr.addColorStop(.85,'hsla('+b.h+',85%,75%,.45)');gr.addColorStop(1,'hsla('+b.h+',90%,95%,.8)');
   c.fillStyle=gr;c.beginPath();c.arc(b.x,b.y,b.r,0,6.283);c.fill();c.strokeStyle='rgba(255,255,255,.65)';c.lineWidth=1.2;c.stroke();
   c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.ellipse(b.x-b.r*.38,b.y-b.r*.42,b.r*.2,b.r*.11,-.7,0,6.283);c.fill();
   c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(b.x+b.r*.35,b.y+b.r*.4,b.r*.07,0,6.283);c.fill()});
  s.p.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=60*dt;q.l-=dt*1.6});s.p=s.p.filter(q=>q.l>0);s.p.forEach(q=>{c.fillStyle='hsla('+q.h+',90%,80%,'+q.l+')';c.beginPath();c.arc(q.x,q.y,q.r*q.l,0,6.283);c.fill()});
  s.r.forEach(q=>{q.l-=dt*2.2;q.r+=dt*70});s.r=s.r.filter(q=>q.l>0);s.r.forEach(q=>{c.strokeStyle='rgba(255,255,255,'+q.l*.8+')';c.lineWidth=2;c.beginPath();c.arc(q.x,q.y,q.r,0,6.283);c.stroke()});
  return 1}};
/* ---------- mandala ---------- */
const MAN_P=['#fda4af','#fdba74','#fde047','#86efac','#5eead4','#7dd3fc','#a5b4fc','#d8b4fe','#f0abfc','#fbcfe8','#fcd34d','#d6d3d1'];
const MAN_D=[[6,12,12,18,24,24],[8,8,16,16,24,24],[12,12,12,12,12,12]];
GXD.man={init(){return{fx:{}}},
 key(){const o=gxS();return o.md+''},
 arr(){const o=gxS(),k=GXD.man.key();if(!o.man[k])o.man[k]=[];return o.man[k]},
 geo(){const R=Math.min(GX.w,GX.h)/2-6,rc=R*.1,rings=MAN_D[gxS().md];return{cx:GX.w/2,cy:GX.h/2,R,rc,rings,dr:(R-rc)/rings.length}},
 cellAt(p){const G=GXD.man.geo(),dx=p.x-G.cx,dy=p.y-G.cy,r=Math.hypot(dx,dy);if(r>G.R+4)return -2;if(r<G.rc)return 0;const ri=Math.min(G.rings.length-1,Math.floor((r-G.rc)/G.dr));let a=Math.atan2(dy,dx)+Math.PI/2;a=(a+6.2832*2)%6.2832;const n=G.rings[ri];let id=1;for(let i=0;i<ri;i++)id+=G.rings[i];return id+Math.floor(a/(6.2832/n))%n},
 paint(p){const i=GXD.man.cellAt(p);if(i<0)return;const A=GXD.man.arr(),o=gxS(),v=o.mc<0?null:o.mc;if(v==null){if(A[i]==null)return;A[i]=null}else{if(A[i]===v)return;A[i]=v;GX.st.fx[i]=performance.now();gxTone(330+(v*40),.3,.035);gxVib(6)}GX.dirty=1;gxSave()},
 down(p){GXD.man.paint(p)},move(p){if(GX.down)GXD.man.paint(p)},
 draw(t){const c=GX.cx,W=GX.w,H=GX.h,G=GXD.man.geo(),A=GXD.man.arr();let busy=0;
  const bg=c.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.75);bg.addColorStop(0,'#2e1f5e');bg.addColorStop(1,'#14102e');c.fillStyle=bg;c.fillRect(0,0,W,H);
  c.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<30;i++){const x=(i*97%W),y=(i*53%H);c.globalAlpha=.25+.25*Math.sin(t/900+i);c.fillRect(x,y,1.6,1.6)}c.globalAlpha=1;
  const cell=(r0,r1,a0,a1,id)=>{const gp=1.6,ga0=a0+gp/r1,ga1=a1-gp/r1,gb0=a0+gp/r0,gb1=a1-gp/r0;c.beginPath();c.arc(G.cx,G.cy,r1,ga0,ga1);c.arc(G.cx,G.cy,r0,gb1,gb0,true);c.closePath();
   const v=A[id];if(v!=null){const gr=c.createRadialGradient(G.cx,G.cy,r0,G.cx,G.cy,r1);gr.addColorStop(0,MAN_P[v]);gr.addColorStop(1,MAN_P[v]);c.fillStyle=MAN_P[v];c.fill();c.fillStyle='rgba(255,255,255,.18)';c.fill();
    const f=GX.st.fx[id];if(f){const k=(performance.now()-f)/500;if(k<1){busy=1;c.fillStyle='rgba(255,255,255,'+(.6*(1-k))+')';c.fill()}}}
   else{c.fillStyle='rgba(255,255,255,.07)';c.fill()}
   c.strokeStyle=v!=null?'rgba(255,255,255,.35)':'rgba(200,190,255,.35)';c.lineWidth=1;c.stroke();
   if(v==null){c.fillStyle='rgba(200,190,255,.35)';const am=(a0+a1)/2,rm=(r0+r1)/2;c.beginPath();c.arc(G.cx+Math.cos(am)*rm,G.cy+Math.sin(am)*rm,1.6,0,6.283);c.fill()}};
  let id=1;G.rings.forEach((n,ri)=>{const r0=G.rc+G.dr*ri+1,r1=G.rc+G.dr*(ri+1)-1;for(let j=0;j<n;j++){const a0=-Math.PI/2+j*6.2832/n,a1=a0+6.2832/n;cell(r0,r1,a0,a1,id++)}});
  // center
  c.beginPath();c.arc(G.cx,G.cy,G.rc-2,0,6.283);const v0=A[0];c.fillStyle=v0!=null?MAN_P[v0]:'rgba(255,255,255,.1)';c.fill();c.strokeStyle='rgba(255,255,255,.4)';c.stroke();
  return busy}};
/* ---------- garden ---------- */
const GAR_H=[340,320,300,20,45,280,10,200];
GXD.gar={init(){const s={fl:[],cl:[],ff:[]};for(let i=0;i<4;i++)s.cl.push({x:rnd(0,GX.w),y:rnd(20,GX.h*.35),s:rnd(.7,1.3),v:rnd(4,10)});for(let i=0;i<14;i++)s.ff.push({x:rnd(0,GX.w),y:rnd(GX.h*.25,GX.h*.85),ph:rnd(0,6.28),v:rnd(6,16)});
  gxS().fl.forEach(f=>s.fl.push({x:f[0]*GX.w,y:f[1]*GX.h,h:f[2],n:f[3],sz:f[4],born:-9e9}));return s},
 gy(x){return GX.h*.8+Math.sin(x/GX.w*6.28+1)*9},
 add(p){const s=GX.st;const y=Math.max(GX.h*.18,Math.min(GXD.gar.gy(p.x)-26,p.y)),f={x:p.x,y,h:GAR_H[Math.floor(Math.random()*GAR_H.length)],n:5+Math.floor(Math.random()*5),sz:rnd(.8,1.25),born:performance.now()};s.fl.push(f);if(s.fl.length>40)s.fl.shift();
  const o=gxS();o.fl=s.fl.map(q=>[+(q.x/GX.w).toFixed(3),+(q.y/GX.h).toFixed(3),q.h,q.n,+q.sz.toFixed(2)]);gxSave();gxTone([392,440,523,587,659,784][Math.floor(Math.random()*6)],.8,.045);gxVib(8)},
 down(p){GXD.gar.add(p)},move(){},
 draw(t,dt){const c=GX.cx,s=GX.st,W=GX.w,H=GX.h,N=gxS().night;
  const g=c.createLinearGradient(0,0,0,H*.85);if(N){g.addColorStop(0,'#1e1b4b');g.addColorStop(1,'#6d28d9')}else{g.addColorStop(0,'#bae6fd');g.addColorStop(1,'#fef3c7')}c.fillStyle=g;c.fillRect(0,0,W,H);
  if(N){c.fillStyle='#fff';for(let i=0;i<40;i++){c.globalAlpha=.3+.5*Math.abs(Math.sin(t/1100+i));c.beginPath();c.arc((i*73)%W,(i*41)%(H*.6),1.2,0,6.283);c.fill()}c.globalAlpha=1;
   const mg=c.createRadialGradient(W*.8,H*.15,4,W*.8,H*.15,50);mg.addColorStop(0,'rgba(255,250,220,1)');mg.addColorStop(.35,'rgba(255,250,220,.9)');mg.addColorStop(1,'rgba(255,250,220,0)');c.fillStyle=mg;c.beginPath();c.arc(W*.8,H*.15,50,0,6.283);c.fill()}
  else{const sg=c.createRadialGradient(W*.8,H*.14,4,W*.8,H*.14,70);sg.addColorStop(0,'rgba(255,244,180,1)');sg.addColorStop(.3,'rgba(255,230,140,.8)');sg.addColorStop(1,'rgba(255,230,140,0)');c.fillStyle=sg;c.beginPath();c.arc(W*.8,H*.14,70,0,6.283);c.fill();
   s.cl.forEach(q=>{q.x+=q.v*dt;if(q.x>W+80)q.x=-80;c.fillStyle='rgba(255,255,255,.85)';[[0,0,26],[24,6,20],[-24,8,18],[8,-10,20]].forEach(a=>{c.beginPath();c.arc(q.x+a[0]*q.s,q.y+a[1]*q.s,a[2]*q.s,0,6.283);c.fill()})})}
  // hills
  c.fillStyle=N?'#2a1f5c':'#a7e8b0';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=10)c.lineTo(x,H*.7+Math.sin(x/W*4+.5)*16);c.lineTo(W,H);c.fill();
  const hg=c.createLinearGradient(0,H*.72,0,H);hg.addColorStop(0,N?'#3b2d7a':'#6ed29a');hg.addColorStop(1,N?'#1b1442':'#2f9e6e');c.fillStyle=hg;c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=10)c.lineTo(x,GXD.gar.gy(x));c.lineTo(W,H);c.fill();
  // flowers
  const now=performance.now();let busy=0;
  s.fl.slice().sort((a,b)=>a.y-b.y).forEach(f=>{const k=Math.min(1,(now-f.born)/1500);if(k<1)busy=1;const ek=1-Math.pow(1-k,3),by=GXD.gar.gy(f.x),ty=by-(by-f.y)*ek,sw=Math.sin(t/1200+f.x)*3*ek;
   c.strokeStyle=N?'#3fa376':'#2f9e44';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(f.x,by+4);c.quadraticCurveTo(f.x+sw*1.5,(by+ty)/2,f.x+sw,ty);c.stroke();
   if(ek>.5){const lm=(by+ty)/2,lk=Math.min(1,(ek-.5)*2);c.fillStyle=N?'#3fa376':'#51cf66';[[1,-.4],[-1,.4]].forEach(a=>{c.save();c.translate(f.x+sw*.5,lm);c.rotate(a[1]*a[0]);c.beginPath();c.ellipse(a[0]*9*lk,0,10*lk,4.5*lk,0,0,6.283);c.fill();c.restore()})}
   const bk=Math.max(0,(k-.45)/.55),sc=f.sz*(bk>0?(1+.15*Math.sin(bk*3.14)):0)*bk;if(sc>0){c.save();c.translate(f.x+sw,ty);c.rotate(sw*.03);
    for(let i=0;i<f.n;i++){c.save();c.rotate(i*6.2832/f.n+t/9000*(i%2?1:-1)*0);const pr=15*sc,gr=c.createRadialGradient(0,-pr*.9,1,0,-pr*.9,pr*1.1);gr.addColorStop(0,`hsl(${f.h},90%,92%)`);gr.addColorStop(1,`hsl(${f.h},80%,${N?72:66}%)`);c.fillStyle=gr;c.beginPath();c.ellipse(0,-pr*.95,pr*.55,pr*.95,0,0,6.283);c.fill();c.restore()}
    const cg=c.createRadialGradient(-1,-1,1,0,0,7*sc);cg.addColorStop(0,'#fff3a3');cg.addColorStop(1,'#f59f00');c.fillStyle=cg;c.beginPath();c.arc(0,0,6.5*sc,0,6.283);c.fill();c.restore()}});
  if(N){s.ff.forEach(q=>{q.x+=Math.sin(t/1700+q.ph)*q.v*dt;q.y+=Math.cos(t/2100+q.ph)*q.v*dt;const a=.25+.75*Math.abs(Math.sin(t/900+q.ph)),rg=c.createRadialGradient(q.x,q.y,0,q.x,q.y,10);rg.addColorStop(0,'rgba(255,240,150,'+a+')');rg.addColorStop(1,'rgba(255,240,150,0)');c.fillStyle=rg;c.beginPath();c.arc(q.x,q.y,10,0,6.283);c.fill()})}
  return 1}};
/* ---------- zen sand ---------- */
GXD.zen={init(){const s={},d=GX.dpr,L=document.createElement('canvas');L.width=GX.w*d;L.height=GX.h*d;s.L=L;s.x=L.getContext('2d');s.x.scale(d,d);s.last=null;GXD.zen.sand(s);return s},
 sand(s){const c=s.x,W=GX.w,H=GX.h,g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#efe3c4');g.addColorStop(1,'#e2d2aa');c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<W*H/14;i++){c.fillStyle=Math.random()<.5?'rgba(120,95,55,'+rnd(.04,.12)+')':'rgba(255,255,255,'+rnd(.1,.3)+')';c.fillRect(Math.random()*W,Math.random()*H,1.2,1.2)}
  s.stones=[[W*.3,H*.32,34],[W*.62,H*.62,44],[W*.78,H*.25,24]];s.stones.forEach(q=>{for(let k=1;k<=4;k++)GXD.zen.ring(c,q[0],q[1],q[2]+k*13)})},
 ring(c,x,y,r){c.lineCap='round';c.strokeStyle='rgba(100,76,40,.28)';c.lineWidth=4;c.beginPath();c.arc(x,y,r,0,6.283);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1.6;c.beginPath();c.arc(x+1.2,y+1.2,r,0,6.283);c.stroke()},
 seg(a,b){const c=GX.st.x,dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);if(l<.5)return;const nx=-dy/l,ny=dx/l;c.lineCap='round';for(let k=-2;k<=2;k++){const o=k*8;c.strokeStyle='rgba(100,76,40,.3)';c.lineWidth=3.4;c.beginPath();c.moveTo(a.x+nx*o,a.y+ny*o);c.lineTo(b.x+nx*o,b.y+ny*o);c.stroke();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.5;c.beginPath();c.moveTo(a.x+nx*o+1.4,a.y+ny*o+1.4);c.lineTo(b.x+nx*o+1.4,b.y+ny*o+1.4);c.stroke()}GX.dirty=1},
 down(p){GX.st.last=p;gxTone(120,.4,.02)},move(p){if(GX.down&&GX.st.last){GXD.zen.seg(GX.st.last,p);GX.st.last=p}},up(){GX.st.last=null},
 draw(){const c=GX.cx,s=GX.st;c.drawImage(s.L,0,0,GX.w,GX.h);s.stones.forEach(q=>{const x=q[0],y=q[1],r=q[2];c.fillStyle='rgba(60,45,25,.25)';c.beginPath();c.ellipse(x+r*.2,y+r*.75,r*1.05,r*.4,0,0,6.283);c.fill();
   const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.1);g.addColorStop(0,'#b8b2a8');g.addColorStop(.6,'#7d7870');g.addColorStop(1,'#4a4640');c.fillStyle=g;c.beginPath();c.ellipse(x,y,r,r*.82,-.2,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(x-r*.3,y-r*.35,r*.35,r*.16,-.5,0,6.283);c.fill()});return 0}};
/* ---------- color puzzle ---------- */
GXD.puz={init(){const n=gxS().pz,s={n,t:[],e:n*n-1,img:null,mv:0,msg:0,pt:[]};for(let i=0;i<n*n;i++)s.t.push({v:i,x:0,y:0});s.img=GXD.puz.pic();GXD.puz.layout(s,true);GXD.puz.shuffle(s);return s},
 pic(){const W=GX.w,I=document.createElement('canvas');I.width=I.height=Math.round(W*GX.dpr);const c=I.getContext('2d'),S0=64,q=document.createElement('canvas');q.width=q.height=S0;const x=q.getContext('2d'),d=x.createImageData(S0,S0),C=[[253,164,175],[253,230,138],[165,180,252],[110,231,183]];
  for(let j=0;j<S0;j++)for(let i=0;i<S0;i++){const u=i/(S0-1),v=j/(S0-1);for(let k=0;k<3;k++)d.data[(j*S0+i)*4+k]=C[0][k]*(1-u)*(1-v)+C[1][k]*u*(1-v)+C[2][k]*(1-u)*v+C[3][k]*u*v;d.data[(j*S0+i)*4+3]=255}
  x.putImageData(d,0,0);c.imageSmoothingQuality='high';c.drawImage(q,0,0,I.width,I.height);const R=I.width;[[.28,.3,.22,.35],[.72,.62,.3,.25],[.5,.85,.18,.3],[.2,.75,.14,.3]].forEach(a=>{const g=c.createRadialGradient(R*a[0],R*a[1],0,R*a[0],R*a[1],R*a[2]);g.addColorStop(0,'rgba(255,255,255,'+a[3]+')');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,R,R)});return I},
 layout(s,snap){const W=GX.w,n=s.n,sz=W/n;s.sz=sz;s.t.forEach((t,i)=>{});s.pos=i=>({x:(i%n)*sz,y:Math.floor(i/n)*sz})},
 sh(s){const n=s.n,sz=s.sz;return s.t},
 shuffle(s){const n=s.n;let prev=-1;s.arr=[];for(let i=0;i<n*n;i++)s.arr.push(i);s.e=n*n-1;for(let k=0;k<n*n*14;k++){const e=s.e,r=Math.floor(e/n),c=e%n,nb=[];if(r>0)nb.push(e-n);if(r<n-1)nb.push(e+n);if(c>0)nb.push(e-1);if(c<n-1)nb.push(e+1);const ch=nb.filter(x=>x!==prev),m=ch[Math.floor(Math.random()*ch.length)];s.arr[e]=s.arr[m];s.arr[m]=n*n-1;prev=e;s.e=m}
  if(GXD.puz.solved(s)){GXD.puz.shuffle(s);return}s.cur={};s.arr.forEach((v,i)=>{const p=s.pos(i);s.cur[v]={x:p.x,y:p.y}});s.msg=0;s.mv=0;s.pt=[];GX.dirty=1;const m=document.getElementById('gxm');if(m)m.textContent=''},
 solved(s){return s.arr.every((v,i)=>v===i)},
 down(p){const s=GX.st,n=s.n,sz=s.sz,c=Math.floor(p.x/sz),r=Math.floor(p.y/sz);if(c<0||r<0||c>=n||r>=n)return;const i=r*n+c,e=s.e,er=Math.floor(e/n),ec=e%n;if(Math.abs(er-r)+Math.abs(ec-c)!==1)return;s.arr[e]=s.arr[i];s.arr[i]=n*n-1;s.e=i;s.mv++;gxTone(300+Math.random()*80,.25,.04);gxVib(6);
  if(GXD.puz.solved(s)){s.msg=performance.now();for(let k=0;k<40;k++)s.pt.push({x:GX.w/2,y:GX.h/2,vx:rnd(-160,160),vy:rnd(-220,60),l:1,h:rnd(0,360)});gxTone(523,.6,.05);setTimeout(()=>gxTone(659,.6,.05),150);setTimeout(()=>gxTone(784,.8,.05),300);const m=document.getElementById('gxm');if(m)m.textContent=oL('آفرین! ✨ رنگ‌ها مرتب شدن','Well done! ✨ The colors are in order')}},
 move(){},
 draw(t,dt){const c=GX.cx,s=GX.st,W=GX.w,n=s.n,sz=s.sz,g=3;let busy=0;c.fillStyle='#f5f3ff';c.fillRect(0,0,W,GX.h);
  s.arr.forEach((v,i)=>{if(v===n*n-1){const p=s.pos(i);c.fillStyle='rgba(120,100,180,.08)';gxRR(c,p.x+g,p.y+g,sz-2*g,sz-2*g,12);c.fill();return}const tp=s.pos(i),cu=s.cur[v];cu.x+=(tp.x-cu.x)*Math.min(1,dt*16);cu.y+=(tp.y-cu.y)*Math.min(1,dt*16);if(Math.abs(tp.x-cu.x)>.5||Math.abs(tp.y-cu.y)>.5)busy=1;
   const sx=(v%n)*s.img.width/n,sy=Math.floor(v/n)*s.img.height/n,sw=s.img.width/n;c.save();c.shadowColor='rgba(80,60,140,.25)';c.shadowBlur=8;c.shadowOffsetY=3;gxRR(c,cu.x+g,cu.y+g,sz-2*g,sz-2*g,12);c.fillStyle='#fff';c.fill();c.restore();
   c.save();gxRR(c,cu.x+g,cu.y+g,sz-2*g,sz-2*g,12);c.clip();c.drawImage(s.img,sx,sy,sw,sw,cu.x+g,cu.y+g,sz-2*g,sz-2*g);c.restore();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.5;gxRR(c,cu.x+g,cu.y+g,sz-2*g,sz-2*g,12);c.stroke()});
  if(s.pt.length){busy=1;s.pt.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=260*dt;q.l-=dt*.8;c.fillStyle='hsla('+q.h+',90%,70%,'+Math.max(0,q.l)+')';c.beginPath();c.arc(q.x,q.y,3.5,0,6.283);c.fill()});s.pt=s.pt.filter(q=>q.l>0)}
  return busy}};
/* ---------- shell ---------- */
function gxInit(){const g=XS.gxg;if(!g)return;const cv=document.getElementById('gxc');if(!cv)return;gxStop();GX.g=g;GX.cv=cv;GX.dpr=Math.min(2.5,window.devicePixelRatio||1);const W=Math.max(220,cv.parentNode.clientWidth),sq=(g==='man'||g==='puz');GX.w=W;GX.h=sq?W:Math.round(Math.max(320,Math.min(500,window.innerHeight*.58)));cv.style.height=GX.h+'px';cv.width=Math.round(GX.w*GX.dpr);cv.height=Math.round(GX.h*GX.dpr);GX.cx=cv.getContext('2d');GX.cx.setTransform(GX.dpr,0,0,GX.dpr,0,0);
 const D=GXD[g];GX.st=D.init();GX.dirty=1;GX.t=performance.now();
 cv.onpointerdown=e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}GX.down=1;D.down&&D.down(gxXY(e));GX.dirty=1};
 cv.onpointermove=e=>{D.move&&D.move(gxXY(e));if(GX.down)GX.dirty=1};
 const up=()=>{GX.down=0;D.up&&D.up()};cv.onpointerup=up;cv.onpointercancel=up;
 const loop=t=>{if(!GX.cv||!document.body.contains(GX.cv)){gxStop();return}GX.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-GX.t)/1000);GX.t=t;const always=(g==='bub'||g==='gar');if(always||GX.dirty){const b=D.draw(t,dt);GX.dirty=b?1:0}};
 GX.raf=requestAnimationFrame(loop)}
function gxCtl(){const g=XS.gxg,o=gxS();if(g==='man')return`<div class="card"><div class="mu">${oL('یه رنگ انتخاب کن و روی بخش‌ها بزن یا انگشتت رو بکش.','Pick a color, then tap or drag over the sections.')}</div><div id="gxp" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;justify-content:center">${MAN_P.map((c,i)=>`<button data-a="gxx" data-v="c:${i}" aria-label="${i+1}" style="width:34px;height:34px;border-radius:50%;background:${c};border:3px solid ${o.mc===i?'var(--pk)':'#fff'};box-shadow:0 2px 6px #0003;padding:0"></button>`).join('')}<button data-a="gxx" data-v="c:-1" style="height:34px;padding:0 12px;border-radius:17px;border:3px solid ${o.mc===-1?'var(--pk)':'#fff'};background:var(--card);color:var(--tx);box-shadow:0 2px 6px #0003">${oL('پاک‌کن','Eraser')}</button></div><div class="chips" style="margin-top:10px;justify-content:center">${MAN_D.map((_,i)=>`<button class="chip ${o.md===i?'on':''}" data-a="gxx" data-v="d:${i}">${oL('طرح','Design')} ${fa(i+1)}</button>`).join('')}<button class="chip" data-a="gxx" data-v="x">${oL('پاک کردن همه','Clear all')}</button></div></div>`;
 if(g==='gar')return`<div class="card"><div class="chips" style="justify-content:center"><button class="chip ${o.night?'':'on'}" data-a="gxx" data-v="n:0">☀️ ${oL('روز','Day')}</button><button class="chip ${o.night?'on':''}" data-a="gxx" data-v="n:1">🌙 ${oL('شب','Night')}</button><button class="chip" data-a="gxx" data-v="x">${oL('باغ تازه','New garden')}</button></div></div>`;
 if(g==='zen')return`<div class="card"><div class="chips" style="justify-content:center"><button class="chip" data-a="gxx" data-v="x">${oL('صاف کردن ماسه','Smooth the sand')}</button></div></div>`;
 if(g==='puz')return`<div class="card"><div id="gxm" style="text-align:center;min-height:26px;font-weight:700;color:var(--pk)"></div><div class="chips" style="justify-content:center;margin-top:6px">${[3,4].map(n=>`<button class="chip ${o.pz===n?'on':''}" data-a="gxx" data-v="p:${n}">${fa(n)}×${fa(n)}</button>`).join('')}<button class="chip" data-a="gxx" data-v="x">${oL('دوباره بچین','Shuffle again')}</button></div></div>`;
 return`<div class="card"><div class="mu" style="text-align:center">${oL('بدون امتیاز و تایمر؛ فقط آروم باش.','No score and no timer; just relax.')}</div></div>`}
function gxAct(v){const o=gxS(),g=XS.gxg,q=v.split(':');
 if(q[0]==='c'){o.mc=+q[1];document.querySelectorAll('#gxp button').forEach((b,i)=>{const on=(i<MAN_P.length?o.mc===i:o.mc===-1);b.style.borderColor=on?'var(--pk)':'#fff'});gxSave();return}
 if(q[0]==='d'){o.md=+q[1];GX.dirty=1;document.querySelectorAll('[data-v^="d:"]').forEach(b=>b.classList.toggle('on',b.dataset.v==='d:'+o.md));gxSave();return}
 if(q[0]==='n'){o.night=+q[1];document.querySelectorAll('[data-v^="n:"]').forEach(b=>b.classList.toggle('on',b.dataset.v==='n:'+o.night));gxSave();return}
 if(q[0]==='p'){o.pz=+q[1];document.querySelectorAll('[data-v^="p:"]').forEach(b=>b.classList.toggle('on',b.dataset.v==='p:'+o.pz));gxInit();gxSave();return}
 if(q[0]==='x'){if(g==='man'){delete o.man[o.md+''];GX.dirty=1}else if(g==='gar'){o.fl=[];GX.st.fl=[]}else if(g==='zen'){GXD.zen.sand(GX.st);GX.dirty=1}else if(g==='puz'){GXD.puz.shuffle(GX.st)}gxSave()}}
function gxDraw(hd,bk){const o=gxS(),g=XS.gxg;
 if(g){const G=GXG.find(x=>x[0]===g);return hd(oL(G[2],G[3]),oL(G[4],G[5]))+`<div class="card" style="padding:8px"><canvas id="gxc" style="width:100%;display:block;border-radius:18px;touch-action:none;user-select:none;-webkit-user-select:none"></canvas></div>`+gxCtl()+`<div class="row" style="margin-top:12px"><button class="btn o" data-a="gxb">${oL('همه‌ی بازی‌ها','All games')}</button></div>`}
 return hd(oL('بازی آرام','Calm games'),oL('بدون برد و باخت، برای آروم شدن','No winning or losing, just to unwind'))
 +`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px">${GXG.map(x=>{const cc=x[6].split(',');return`<div data-a="gxo" data-v="${x[0]}" style="cursor:pointer;border-radius:22px;padding:18px 10px 14px;text-align:center;background:linear-gradient(145deg,${cc[0]},${cc[1]});box-shadow:0 8px 20px ${cc[0]}66;color:#2a1a20;${x[0]==='puz'?'grid-column:span 2':''}"><div style="font-size:44px;filter:drop-shadow(0 4px 6px #0002)">${x[1]}</div><b style="font-size:16px">${oL(x[2],x[3])}</b><div style="font-size:12px;opacity:.8;margin-top:4px;line-height:1.7">${oL(x[4],x[5])}</div></div>`}).join('')}</div>`
 +`<div class="card" style="margin-top:12px"><h3>${oL('تنظیمات','Settings')}</h3><div class="chips"><button class="chip ${o.snd?'on':''}" data-a="gxt" data-v="snd">🔊 ${oL('صدای نرم','Soft sound')}</button><button class="chip ${o.vib?'on':''}" data-a="gxt" data-v="vib">📳 ${oL('لرزش ملایم','Gentle vibration')}</button></div></div>`
 +`<div class="mu" style="font-size:12px;margin:8px 4px;line-height:1.9">${oL('این بازی‌ها فقط برای چند دقیقه آروم شدن‌ان و جای درمان نیستن. اگه مدت‌هاست خلقت پایینه، اضطراب شدید داری یا PMS زندگی‌ات رو مختل می‌کنه، با پزشک یا روان‌شناس صحبت کن.','These games only help you unwind for a few minutes and are not a treatment. If your mood has been low for a long time, you have severe anxiety, or PMS disrupts your life, talk to a doctor or therapist.')}</div>`+bk}
function gxCard(I){const o=gxS();if(!(I.pms||I.period)||o.dis===iso(today()))return'';return`<div class="card" style="margin-top:12px;background:linear-gradient(135deg,#ede9fe,#fce7f3);border:none"><h3>🫧 ${oL('یه استراحت کوتاه؟','A short break?')}</h3><div class="mu" style="color:#4a3a5a">${oL('اگه امروز کلافه‌ای، چند دقیقه بازی آرام (حباب، ماندالا، باغ) کمک می‌کنه.','If you feel on edge today, a few minutes of calm games (bubbles, mandala, garden) can help.')}</div><div class="row" style="margin-top:8px"><button class="btn" data-a="gxh">${oL('بریم','Let\'s go')}</button><button class="btn o" data-a="gxn">${oL('نه، ممنون','No, thanks')}</button></div></div>`}
