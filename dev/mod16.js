/* ===== mod16 v2: bowling (pseudo-3D, cinematic camera, bowler, ball return, themes, real scoring) ===== */
const BWT=[
 {n:['کلاسیک','Classic'],wall:['#1d100a','#4a2a18'],lane:['#f0c48a','#c98a4a'],e1:'#ffd27a',e2:'#ffae42',gl:'255,196,110',ball:['#7db7ff','#17358a','#bcd8ff'],art:0,gut:'#2a1b12',shirt:['#c0392b','#8e2a20'],floor:'#2a1810'},
 {n:['نئون','Neon'],wall:['#07031a','#1a0a3c'],lane:['#7a5cff','#2a1470'],e1:'#22e8ff',e2:'#ff3fd0',gl:'120,90,255',ball:['#ff6ad5','#5a1aa0','#7df3ff'],art:1,gut:'#0b0622',shirt:['#7c3aed','#4c1d95'],floor:'#100629'},
 {n:['فضا','Cosmic'],wall:['#030a1a','#0b2145'],lane:['#4f86c9','#12315f'],e1:'#67e8f9',e2:'#a78bfa',gl:'90,190,255',ball:['#a5f3fc','#0e4f8a','#ffffff'],art:2,gut:'#050f22',shirt:['#0ea5e9','#0369a1'],floor:'#061428'},
 {n:['غروب','Sunset'],wall:['#240a1e','#5a1740'],lane:['#ffb27a','#c4506e'],e1:'#ff6b9d',e2:'#ffd166',gl:'255,120,150',ball:['#ffd166','#c2255c','#fff1c1'],art:3,gut:'#2a0e22',shirt:['#fb7185','#be123c'],floor:'#2a0e22'}];
const BWPOS=[[0,0],[-.29,1],[.29,1],[-.58,2],[0,2],[.58,2],[-.87,3],[-.29,3],[.29,3],[.87,3]];
const BWZ0=-18,BWMX0=1.28,BWMX1=1.92,BWMZ0=-8.5,BWMZ1=-6.5,BWMH=.8;
const bwCl=(v,a,b)=>Math.max(a,Math.min(b,v));
function bwGeo(){const W=GX.w,H=GX.h,K=.045,ZF=24,st=GX.st,cm=(st&&st.cam)||{cz:0,zm:1,cx:0};return{W,H,K,ZF,cz:cm.cz,camx:cm.cx,zm:cm.zm,sF:1/(1+K*(ZF-cm.cz)),cx:W/2,WL:W*.37,yN:H*.835,yF:H*.4}}
function bwP(g,x,z){let d=1+g.K*(z-g.cz);if(d<.06)d=.06;const s=1/d;return[g.cx+(x-g.camx)*s*g.WL,g.yF+(g.yN-g.yF)*(s-g.sF)/(1-g.sF),s]}
function bwP3(g,x,z,h){const q=bwP(g,x,z);return[q[0],q[1]-h*q[2]*g.WL,q[2]]}
function bwAnchor(g){return g.H*(.62+.16*bwCl((g.zm-1)/.3,0,1))}
function bwScore(r){const F=[];let i=0,run=0,ok=true;for(let f=0;f<10;f++){const fr={m:[],s:null,c:null};F.push(fr);if(i>=r.length)continue;
 if(f<9){if(r[i]===10){fr.m=['X'];if(r[i+1]!==undefined&&r[i+2]!==undefined)fr.s=10+r[i+1]+r[i+2];i+=1}
  else{fr.m=[r[i]];if(r[i+1]!==undefined){const sp=r[i]+r[i+1]===10;fr.m.push(sp?'/':r[i+1]);if(sp){if(r[i+2]!==undefined)fr.s=10+r[i+2]}else fr.s=r[i]+r[i+1];i+=2}else i+=1}}
 else{const a=r[i],b=r[i+1],c=r[i+2];fr.m.push(a===10?'X':a);if(b!==undefined)fr.m.push(a===10?(b===10?'X':b):(a+b===10?'/':b));
  if(c!==undefined)fr.m.push(c===10?'X':(a===10&&b!==10&&b+c===10)?'/':c);
  const need=(a===10||(b!==undefined&&a+b===10))?3:2,have=[a,b,c].filter(v=>v!==undefined);if(have.length>=need)fr.s=have.reduce((x,y)=>x+y,0)}
 if(fr.s!==null&&ok){run+=fr.s;fr.c=run}else ok=false}
 return F}
function bwTotal(r){const F=bwScore(r);let t=0;F.forEach(f=>{if(f.c!==null)t=f.c});return t}
function bwRack(s,drop){s.pins=BWPOS.map((q,i)=>({i,x:q[0],z:21.4+q[1]*.74,vx:0,vz:0,r:.15,st:0,a:0,dir:1,wob:0,fade:0,dy:drop?1+i*.06:0}))}
function bwAlive(s){return s.pins.filter(p=>p.st===0).length}
function bwTopple(s,p,vx){if(p.st!==0)return;if(!s.slowed){s.slowed=1;s.slow=.65;s.fl={x:p.x,z:p.z,t:1}}p.st=1;p.a=0;p.dir=Math.abs(vx)>.05?(vx>0?1:-1):(Math.random()<.5?-1:1);s.pdown=(s.pdown||0)+1}
function bwSnd(s,f,v){const n=performance.now();if(n-s.hitT<45)return;s.hitT=n;gxTone(f,.09,v||.04);gxVib(8)}
function bwBurst(s,x,z,n,col){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=rnd(.5,3);s.pp.push({x,z,y:rnd(0,.3),vx:Math.cos(a)*v,vz:Math.sin(a)*v*.6,vy:rnd(1,3.5),l:1,c:col||'255,255,255',r:rnd(1,2.6)})}}
function bwStep(s,dt){const B=s.ball;
 if(B){B.t+=dt;if(!B.gut){B.vx+=B.sp*1.5*B.hk*Math.min(1,Math.max(0,(B.z-3)/10))*dt;B.vz*=1-.012*dt}B.x+=B.vx*dt;B.z+=B.vz*dt;B.rot+=B.vz*dt*2.6;
  if(gxS().bbump&&!B.gut&&Math.abs(B.x)>.93){B.x=Math.sign(B.x)*.93;B.vx=-B.vx*.4}
  if(!B.gut&&Math.abs(B.x)>1.07){B.gut=B.x>0?1:-1;B.vx=0;s.gutter=1;bwSnd(s,120,.05)}
  if(B.gut)B.x+=(B.gut*1.13-B.x)*Math.min(1,dt*12);
  if(!B.gut)s.pins.forEach(p=>{if(p.st===2||B.z<19.5)return;const dx=p.x-B.x,dz=p.z-B.z,d=Math.hypot(dx,dz),m=B.r+p.r;if(d<m&&d>1e-4){const nx=dx/d,nz=dz/d,rel=(p.vx-B.vx)*nx+(p.vz-B.vz)*nz;if(rel<0){const e=.5,j=-(1+e)*rel/(1/B.m+1/1.5);B.vx-=j/B.m*nx;B.vz-=j/B.m*nz;p.vx+=j/1.5*nx;p.vz+=j/1.5*nz;const sp=-rel;if(p.st===0){if(sp>.8){bwTopple(s,p,p.vx);bwBurst(s,p.x,p.z,6,'255,240,200');s.shake=Math.max(s.shake,Math.min(7,sp*.5));bwSnd(s,260+rnd(0,500),.05)}else{p.wob=1;bwSnd(s,200,.03)}}}
    const o=m-d;p.x+=nx*o;p.z+=nz*o}});
  if(B.z>26)s.ball=null}
 const P=s.pins;
 for(let i=0;i<P.length;i++){const a=P[i];if(a.st===2)continue;
  for(let j=i+1;j<P.length;j++){const b=P[j];if(b.st===2)continue;if(a.st===0&&b.st===0&&Math.abs(a.vx)+Math.abs(a.vz)+Math.abs(b.vx)+Math.abs(b.vz)<.01)continue;
   const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),m=.3;if(d<m&&d>1e-4){const nx=dx/d,nz=dz/d,rel=(b.vx-a.vx)*nx+(b.vz-a.vz)*nz;if(rel<0){const j2=-(1.55)*rel/2;a.vx-=j2*nx;a.vz-=j2*nz;b.vx+=j2*nx;b.vz+=j2*nz;const sp=-rel;[a,b].forEach(q=>{if(q.st===0&&sp>.9){bwTopple(s,q,q.vx);bwSnd(s,300+rnd(0,500),.04)}})}const o=(m-d)/2;a.x-=nx*o;a.z-=nz*o;b.x+=nx*o;b.z+=nz*o}}}
 P.forEach(p=>{if(p.st===2){p.fade=Math.min(1,p.fade+dt*3);return}
  if(p.st===1){p.a=Math.min(1,p.a+dt*3.2);const k=p.a>=1?3.8:1.2;p.vx*=Math.max(0,1-k*dt);p.vz*=Math.max(0,1-k*dt)}else{p.vx*=Math.max(0,1-3*dt);p.vz*=Math.max(0,1-3*dt)}
  if(p.wob>0)p.wob=Math.max(0,p.wob-dt*1.6);p.x+=p.vx*dt;p.z+=p.vz*dt;
  if(p.z>24.6||Math.abs(p.x)>1.28){if(p.st===0)bwTopple(s,p,p.vx);p.st=2;p.fade=0;p.vx=p.vz=0}})}
function bwAfter(s,knocked,before){const r=knocked;s.rolls.push(r);let reset=false,done=false;const L=s.rolls;
 if(s.f<9){if((s.k===0&&r===10)||s.k===1){s.f++;s.k=0;reset=true}else s.k=1}
 else{if(s.k===0){s.k=1;reset=(r===10)}else if(s.k===1){const a=L[L.length-2];if(a===10||a+r===10){s.k=2;reset=(a===10&&r===10)||(a!==10&&a+r===10)}else done=true}else done=true}
 s.reset=reset;return done}
function bwFlick(d){const A=d.pts;if(A.length<3)return null;let mi=0;A.forEach((q,i)=>{if(q.y>=A[mi].y)mi=i});const U=A.slice(mi);if(U.length<3)return null;const e=U[U.length-1];let i=U.length-1;while(i>0&&e.t-U[i-1].t<150)i--;const a=U[i],dt=Math.max(16,e.t-a.t)/1000,dy=a.y-e.y,dx=e.x-a.x;if(dy<20)return null;const sp=dy/dt;if(sp<150)return null;
 const k=Math.min(1,(sp-150)/1700),f=U[0],m=U[U.length>>1],tot=Math.max(50,f.y-e.y),cur=(e.x-2*m.x+f.x)/tot,ang=Math.max(-.6,Math.min(.6,dx/dy));
 return{vz:13+k*12,vx:ang*(13+k*12)*.26,sp:Math.max(-1,Math.min(1,cur*1.8)),k}}

function bwCpuFrame(cp,lv){const P=[0,{ps:.1,m:6.8,sd:1.9,sp:.28},{ps:.2,m:7.6,sd:1.7,sp:.48},{ps:.36,m:8.3,sd:1.3,sp:.68}][lv]||{ps:.2,m:7.6,sd:1.7,sp:.48},f0=cp.f,out=[],gs=()=>(Math.random()+Math.random()+Math.random()-1.5)*1.15;let pins=10,done=false,gd=0;
 while(!done&&gd++<6){let r;if(pins===10)r=Math.random()<P.ps?10:Math.max(0,Math.min(9,Math.round(P.m+gs()*P.sd)));else r=Math.random()<P.sp?pins:Math.max(0,Math.min(pins-1,Math.round(pins*(.45+Math.random()*.5))));
  out.push(r);done=bwAfter(cp,r,pins);pins=cp.reset?10:pins-r;if(f0<9&&cp.f>f0)break;if(f0===9&&done)break}
 return out}
function bwCpuStep(s){const cp=s.cpu;if(!cp)return;const tgt=s.done?10:s.f;let last=null;while(cp.nf<tgt){last=bwCpuFrame(cp,cp.lv);cp.nf++}
 if(last&&!s.done){const r=last,st=r[0]===10,sp=!st&&r.length>1&&r[0]+r[1]===10;cp.ban={t:2.6,tt:oL('حریف','CPU')+': '+(st?oL('استرایک!','STRIKE!'):sp?oL('اسپر!','SPARE!'):r.map(x=>x===0?'-':fa(x)).join(' + ')),c:st?'#ffd24a':sp?'#7cf0ff':'#ffffff'};if(st)gxTone(330,.25,.04);else gxTone(220,.15,.03)}}
function bwVs(s){const p=bwTotal(s.rolls),q=bwTotal(s.cpu.rolls),r=p>q?1:p<q?-1:0;return{p,q,r,tt:r>0?oL('بردی!','You win!'):r<0?oL('کامپیوتر برد','CPU wins'):oL('مساوی','Draw'),c:r>0?'#7ee787':r<0?'#ff9a9a':'#ffd24a'}}
function bwArt(c,t,th,x,y,w,h,s){c.save();gxRR(c,x,y,w,h,12);c.clip();const a=th.art;
 if(a===0){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#3a1d10');g.addColorStop(1,'#1b0d07');c.fillStyle=g;c.fillRect(x,y,w,h);for(let i=0;i<22;i++){const bx=x+8+i*(w-16)/21,on=((Math.floor(t*3)+i)%3)===0;[y+7,y+h-7].forEach(by=>{c.fillStyle=on?'#ffe08a':'#7a5a22';c.beginPath();c.arc(bx,by,3,0,6.283);c.fill();if(on){c.fillStyle='rgba(255,210,100,.35)';c.beginPath();c.arc(bx,by,7,0,6.283);c.fill()}})}c.fillStyle='#ffe9b0';c.shadowColor='#ffb347';c.shadowBlur=14;c.font='800 '+Math.round(h*.34)+'px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('بولینگ','BOWLING'),x+w/2,y+h*.5);c.shadowBlur=0;c.fillStyle='rgba(255,220,160,.8)';c.font='600 10px Tahoma,sans-serif';c.fillText(oL('فریم','Frame')+' '+fa(Math.min(10,s.f+1))+' · '+oL('توپ','Ball')+' '+fa(s.k+1),x+w/2,y+h*.7)}
 else if(a===1){c.fillStyle='#08031c';c.fillRect(x,y,w,h);const hy=y+h*.5;c.strokeStyle='rgba(255,63,208,.8)';c.lineWidth=1.2;for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(x+w/2+i*4,hy);c.lineTo(x+w/2+i*w*.12,y+h);c.stroke()}for(let i=0;i<6;i++){const q=((i+t*.6)%6)/6,yy=hy+q*q*(h*.5);c.strokeStyle='rgba(34,232,255,'+(.2+q*.6)+')';c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke()}
  for(let i=0;i<3;i++){const an=Math.sin(t*.9+i*2.1)*.9;c.strokeStyle=['rgba(34,232,255,.7)','rgba(255,63,208,.7)','rgba(160,120,255,.7)'][i];c.lineWidth=2;c.beginPath();c.moveTo(x+w*(.2+i*.3),y+h);c.lineTo(x+w*(.2+i*.3)+Math.sin(an)*w*.5,y);c.stroke()}
  c.shadowColor='#22e8ff';c.shadowBlur=16;c.fillStyle='#e9fdff';c.font='800 '+Math.round(h*.3)+'px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('نئون','NEON'),x+w/2,y+h*.45);c.shadowColor='#ff3fd0';c.fillStyle='#ffd3f5';c.font='700 '+Math.round(h*.16)+'px Tahoma,sans-serif';c.fillText(oL('فریم','Frame')+' '+fa(Math.min(10,s.f+1)),x+w/2,y+h*.8);c.shadowBlur=0}
 else if(a===2){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#020611');g.addColorStop(1,'#10325f');c.fillStyle=g;c.fillRect(x,y,w,h);const ng=c.createRadialGradient(x+w*.3,y+h*.7,4,x+w*.3,y+h*.7,w*.5);ng.addColorStop(0,'rgba(167,139,250,.4)');ng.addColorStop(1,'rgba(167,139,250,0)');c.fillStyle=ng;c.fillRect(x,y,w,h);
  s.stars.forEach(q=>{c.globalAlpha=.4+.6*Math.abs(Math.sin(t*q[3]+q[2]*9));c.fillStyle='#fff';c.fillRect(x+q[0]*w,y+q[1]*h,q[2],q[2])});c.globalAlpha=1;
  const px=x+w*.78,py=y+h*.5,pr=h*.3,pg=c.createRadialGradient(px-pr*.4,py-pr*.4,2,px,py,pr);pg.addColorStop(0,'#fbd5a5');pg.addColorStop(1,'#b4506a');c.fillStyle=pg;c.beginPath();c.arc(px,py,pr,0,6.283);c.fill();c.strokeStyle='rgba(255,230,200,.7)';c.lineWidth=3;c.beginPath();c.ellipse(px,py,pr*1.7,pr*.4,-.4,0,6.283);c.stroke();
  const sx=((t*60)%(w+120))-60;c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2;c.beginPath();c.moveTo(x+sx,y+10+sx*.1);c.lineTo(x+sx-40,y+10+sx*.1-10);c.stroke();
  c.shadowColor='#67e8f9';c.shadowBlur=12;c.fillStyle='#e0fbff';c.font='800 '+Math.round(h*.26)+'px Tahoma,sans-serif';c.textAlign='left';c.fillText(oL('فضا','COSMIC'),x+14,y+h*.55);c.shadowBlur=0;c.font='600 11px Tahoma,sans-serif';c.fillStyle='rgba(200,240,255,.85)';c.fillText(oL('فریم','Frame')+' '+fa(Math.min(10,s.f+1)),x+14,y+h*.78)}
 else{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#2a0a3a');g.addColorStop(.55,'#c2255c');g.addColorStop(1,'#ffb347');c.fillStyle=g;c.fillRect(x,y,w,h);const sx=x+w/2,sy=y+h*.62,sr=h*.42;const sg=c.createLinearGradient(0,sy-sr,0,sy+sr);sg.addColorStop(0,'#fff1a8');sg.addColorStop(1,'#ff5f8a');c.fillStyle=sg;c.beginPath();c.arc(sx,sy,sr,0,6.283);c.fill();c.fillStyle='rgba(42,10,58,.9)';for(let i=0;i<5;i++){const yy=sy+sr*(.05+i*.17),hh=2+i*1.5+Math.sin(t+i)*.6;c.fillRect(sx-sr,yy,sr*2,hh)}
  c.fillStyle='#2a0a3a';c.fillRect(x,y+h*.78,w,h*.22);c.strokeStyle='rgba(255,107,157,.8)';c.lineWidth=1;for(let i=-9;i<=9;i++){c.beginPath();c.moveTo(x+w/2+i*3,y+h*.78);c.lineTo(x+w/2+i*w*.1,y+h);c.stroke()}
  c.shadowColor='#ff6b9d';c.shadowBlur=12;c.fillStyle='#fff';c.font='800 '+Math.round(h*.22)+'px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('غروب','SUNSET'),sx,y+h*.28);c.shadowBlur=0}
 c.restore();c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=2;gxRR(c,x,y,w,h,12);c.stroke()}
function bwPinPath(c,u){c.beginPath();c.moveTo(-.12*u,0);c.bezierCurveTo(-.2*u,-.1*u,-.19*u,-.28*u,-.1*u,-.45*u);c.bezierCurveTo(-.05*u,-.55*u,-.07*u,-.62*u,-.09*u,-.7*u);c.bezierCurveTo(-.12*u,-.8*u,-.07*u,-.95*u,0,-.95*u);c.bezierCurveTo(.07*u,-.95*u,.12*u,-.8*u,.09*u,-.7*u);c.bezierCurveTo(.07*u,-.62*u,.05*u,-.55*u,.1*u,-.45*u);c.bezierCurveTo(.19*u,-.28*u,.2*u,-.1*u,.12*u,0);c.closePath()}
const BWSP={};
function bwSprite(ti){if(BWSP[ti])return BWSP[ti];const th=BWT[ti]||BWT[0],SW=200,SH=380,cv=document.createElement('canvas');cv.width=SW;cv.height=SH;const c=cv.getContext('2d'),u=340,ox=SW/2,oy=SH-16;
 c.translate(ox,oy);
 // base cylinder shading
 bwPinPath(c,u);let g=c.createLinearGradient(-.2*u,0,.2*u,0);[[0,'#7a859f'],[.1,'#b4bdd0'],[.26,'#eef1f8'],[.42,'#ffffff'],[.58,'#f3f5fa'],[.74,'#cdd4e3'],[.9,'#939eb6'],[1,'#626e88']].forEach(x=>g.addColorStop(x[0],x[1]));c.fillStyle=g;c.fill();
 c.save();bwPinPath(c,u);c.clip();
 // vertical occlusion: dark base, soft neck, light head
 g=c.createLinearGradient(0,0,0,-.95*u);g.addColorStop(0,'rgba(30,38,70,.42)');g.addColorStop(.14,'rgba(30,38,70,.06)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(.62,'rgba(50,60,90,.16)');g.addColorStop(.72,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(40,50,80,.2)');c.fillStyle=g;c.fillRect(-.25*u,-u,.5*u,u);
 // warm bounce light from lane at the base
 g=c.createLinearGradient(0,0,0,-.22*u);g.addColorStop(0,'rgba('+th.gl+',.34)');g.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=g;c.fillRect(-.25*u,-.25*u,.5*u,.25*u);
 // red stripes with cylindrical shading
 const stripe=(y0,y1)=>{const sg=c.createLinearGradient(-.2*u,0,.2*u,0);[[0,'#5d0a11'],[.14,'#a30f1b'],[.34,'#ef2b37'],[.46,'#ff7077'],[.6,'#e01c28'],[.82,'#9e0e19'],[1,'#52080f']].forEach(x=>sg.addColorStop(x[0],x[1]));c.fillStyle=sg;c.fillRect(-.22*u,y0*u,.44*u,(y1-y0)*u);c.fillStyle='rgba(0,0,0,.22)';c.fillRect(-.22*u,y0*u,.44*u,.006*u);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(-.22*u,y1*u-.006*u,.44*u,.005*u)};
 stripe(-.705,-.645);stripe(-.775,-.742);
 // neck crease
 c.fillStyle='rgba(40,50,85,.35)';c.fillRect(-.2*u,-.562*u,.4*u,.01*u);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-.2*u,-.552*u,.4*u,.006*u);
 // glossy specular streaks
 const streak=(x,y0,y1,w,a)=>{const sg=c.createLinearGradient(0,y0*u,0,y1*u);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.25,'rgba(255,255,255,'+a+')');sg.addColorStop(.75,'rgba(255,255,255,'+a+')');sg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=sg;c.beginPath();c.ellipse(x*u,(y0+y1)/2*u,w*u,Math.abs(y1-y0)/2*u,0,0,6.283);c.fill()};
 streak(-.085,-.08,-.42,.022,.95);streak(-.045,-.5,-.62,.012,.7);streak(-.05,-.8,-.92,.016,.9);streak(.1,-.1,-.3,.012,.35);
 // window reflection
 c.fillStyle='rgba(180,215,255,.28)';c.beginPath();c.moveTo(-.13*u,-.2*u);c.lineTo(-.045*u,-.2*u);c.lineTo(-.05*u,-.34*u);c.lineTo(-.125*u,-.34*u);c.closePath();c.fill();
 // rim light on the right edge + cool edge on the left
 g=c.createLinearGradient(.04*u,0,.2*u,0);g.addColorStop(0,'rgba('+th.gl+',0)');g.addColorStop(1,'rgba('+th.gl+',.62)');c.fillStyle=g;c.fillRect(.04*u,-u,.2*u,u);
 g=c.createLinearGradient(-.2*u,0,-.12*u,0);g.addColorStop(0,'rgba(150,200,255,.3)');g.addColorStop(1,'rgba(150,200,255,0)');c.fillStyle=g;c.fillRect(-.2*u,-u,.1*u,u);
 // base ring
 c.fillStyle='rgba(20,25,50,.35)';c.beginPath();c.ellipse(0,-.004*u,.12*u,.022*u,0,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.fillRect(-.12*u,-.03*u,.24*u,.004*u);
 c.restore();
 bwPinPath(c,u);c.strokeStyle='rgba(15,20,45,.55)';c.lineWidth=2.2;c.stroke();
 BWSP[ti]={cv,u,ox,oy,SW,SH};return BWSP[ti]}
function bwPinDraw(c,g,p,th,ti,lift){const q=bwP(g,p.x,p.z),u=q[2]*g.WL*1.42,al=p.st===2?1-p.fade:1;if(al<=0)return;const sp=bwSprite(ti),sc=u/sp.u,oy=-p.dy*g.H*.7-lift*30*q[2];
 c.save();c.globalAlpha=al;
 if(p.st===0&&p.dy<.05){c.save();c.translate(q[0],q[1]+1);c.scale(1,-.4);c.globalAlpha=.2*al;c.drawImage(sp.cv,-sp.ox*sc,-sp.oy*sc,sp.SW*sc,sp.SH*sc);c.restore()}
 c.fillStyle='rgba(0,0,0,'+(.38*(1-Math.min(1,p.dy)))+')';c.beginPath();c.ellipse(q[0]+.05*u,q[1]+1,.22*u,.06*u,0,0,6.283);c.fill();
 c.translate(q[0],q[1]+oy);const tilt=p.st===1?p.dir*p.a*1.5:Math.sin(performance.now()/60)*p.wob*.1*p.dir;c.rotate(tilt);
 c.drawImage(sp.cv,-sp.ox*sc,-sp.oy*sc,sp.SW*sc,sp.SH*sc);c.restore()}
// sphere (ball) at screen position
function bwBallAt(c,x,y,r,rot,th,glow){c.save();
 if(glow){c.globalCompositeOperation='lighter';const h=c.createRadialGradient(x,y,r*.5,x,y,r*2.3);h.addColorStop(0,'rgba('+th.gl+',.38)');h.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=h;c.beginPath();c.arc(x,y,r*2.3,0,6.283);c.fill();c.globalCompositeOperation='source-over'}
 let gr=c.createRadialGradient(x-r*.4,y-r*.45,r*.05,x,y,r*1.08);gr.addColorStop(0,th.ball[2]);gr.addColorStop(.18,th.ball[0]);gr.addColorStop(.7,th.ball[1]);gr.addColorStop(1,'#04050d');c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,6.283);c.fill();
 c.save();c.beginPath();c.arc(x,y,r,0,6.283);c.clip();
 for(let k=0;k<4;k++){const a=rot+k*1.57,cs=Math.cos(a);if(cs>0){c.strokeStyle='rgba(255,255,255,'+(.2*cs)+')';c.lineWidth=Math.max(1,r*.18*cs);c.beginPath();c.ellipse(x,y+Math.sin(a)*r*.85,r*1.05,r*.3*cs,0,0,6.283);c.stroke();c.strokeStyle='rgba(0,0,0,'+(.16*cs)+')';c.lineWidth=Math.max(1,r*.1*cs);c.beginPath();c.ellipse(x,y+Math.sin(a)*r*.85+r*.12,r*1.05,r*.3*cs,0,0,6.283);c.stroke()}}
 for(let k=0;k<7;k++){const a=rot*1.1+k*.9,cs=Math.cos(a);if(cs>0){c.fillStyle='rgba(255,255,255,'+(.28*cs)+')';c.beginPath();c.arc(x+Math.sin(k*2.3)*r*.6,y+Math.sin(a)*r*.75,r*.045,0,6.283);c.fill()}}
 [[-.24,-.02],[.2,-.06],[0,.3]].forEach(h=>{const a=rot*.9+1.2,cs=Math.cos(a+h[1]*2);if(cs>0){c.fillStyle='rgba(4,4,16,.9)';c.beginPath();c.ellipse(x+h[0]*r*1.6,y+Math.sin(a+h[1])*r*.7,r*.14,r*.14*cs,0,0,6.283);c.fill();c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=1;c.stroke()}});
 const ed=c.createRadialGradient(x,y,r*.55,x,y,r);ed.addColorStop(0,'rgba(0,0,0,0)');ed.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=ed;c.fillRect(x-r,y-r,r*2,r*2);
 const rl=c.createRadialGradient(x+r*.5,y+r*.6,r*.1,x+r*.4,y+r*.5,r*.8);rl.addColorStop(0,'rgba('+th.gl+',.4)');rl.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=rl;c.fillRect(x-r,y-r,r*2,r*2);c.restore();
 c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.ellipse(x-r*.36,y-r*.46,r*.2,r*.1,-.7,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-r*.25,y-r*.3,r*.45,r*.28,-.7,0,6.283);c.fill();
 c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;c.beginPath();c.arc(x,y,r-.5,0,6.283);c.stroke();c.restore()}
function bwBallDraw(c,g,B,th,pop,h){const q=bwP(g,B.x,B.z),r=B.r*q[2]*g.WL*(pop||1),drop=B.gut?r*.35:0,hh=(h||0)*q[2]*g.WL,cy=q[1]-r*.62+drop-hh;
 c.save();c.globalAlpha=.22;c.fillStyle=th.ball[0];c.beginPath();c.ellipse(q[0],q[1]+r*.3,r*.8,r*.5,0,0,6.283);c.fill();c.globalAlpha=1;
 const sg=Math.max(.4,1-hh/(r*5));c.fillStyle='rgba(0,0,0,'+(.4*sg)+')';c.beginPath();c.ellipse(q[0]+hh*.05,q[1]+drop*.2,r*(1.05+hh/r*.05),r*.34,0,0,6.283);c.fill();c.restore();
 bwBallAt(c,q[0],cy,r,B.rot,th,th.art===1||th.art===2)}
function bwMan(c,g,m,th){const q=bwP(g,m.x,m.z),sc=m.sc||.66,u=q[2]*g.WL*sc;m.hs=null;if(m.al<=.01)return;
 const X=a=>q[0]+a*u,Y=a=>q[1]-a*u,ph=m.ph||0,wk=m.walk?1:0,sw=Math.sin(ph),cw=Math.cos(ph),bob=Math.abs(cw)*.06*wk,fol=m.pose==='follow',stc=m.pose==='stance',hip=1.5+bob-(stc?.1:0),sh=th.shirt,lean=(m.reach||0)*.1+(fol?.14:0),tw=sw*.05*wk,tx=tw+lean,sy=2.55+bob-(stc?.05:0);
 const skin='#d9a07a',skinD='#b97f5c',pant='#2c3868',pantD='#161d42',pantL='#4a5a9a';
 const limb=(x1,y1,x2,y2,w,col,hi)=>{c.lineCap='round';c.strokeStyle=col;c.lineWidth=w*u;c.beginPath();c.moveTo(X(x1),Y(y1));c.lineTo(X(x2),Y(y2));c.stroke();if(hi){c.strokeStyle=hi;c.lineWidth=w*u*.34;c.beginPath();c.moveTo(X(x1-.03),Y(y1));c.lineTo(X(x2-.03),Y(y2));c.stroke()}};
 c.save();c.globalAlpha=m.al;
 // soft ground shadow + contact shadows
 const shg=c.createRadialGradient(X(.08),q[1]+u*.02,u*.05,X(.08),q[1]+u*.02,u*1.1);shg.addColorStop(0,'rgba(0,0,0,.5)');shg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=shg;c.beginPath();c.ellipse(X(.08),q[1]+u*.02,1.1*u,.3*u,0,0,6.283);c.fill();
 // legs: thigh + calf + shoe, back leg first
 const legs=[-1,1].map(sd=>{const fl=fol&&sd<0,pp=sd>0?ph:ph+Math.PI,lf=fl?.4:wk*Math.max(0,Math.sin(pp))*.34,sl=wk*Math.cos(pp)*.18;return{sd,fl,lf,sl,z:wk?Math.sin(pp):0}}).sort((a,b)=>a.z-b.z);
 for(const L of legs){const sd=L.sd,hx=sd*.2+tx*.3,fx=sd*.22+(L.fl?-.16:0)+L.sl*.3,ankle=L.lf+.22,kx=(hx+fx)/2+sd*.015,ky=(hip+ankle)/2+(L.lf>.02?.08:0)+(stc?.0:0);
  limb(hx,hip-.05,kx,ky,.4,pant,pantL);limb(kx,ky,fx,ankle,.32,pant,pantL);
  c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=.02*u;c.beginPath();c.moveTo(X(kx+sd*.14),Y(ky+.12));c.lineTo(X(fx+sd*.1),Y(ankle));c.stroke();
  // crease behind knee
  c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=.025*u;c.beginPath();c.moveTo(X(kx-.12),Y(ky+.02));c.quadraticCurveTo(X(kx),Y(ky-.04),X(kx+.12),Y(ky+.02));c.stroke();
  // cuff
  c.fillStyle=pantD;c.fillRect(X(fx-.17),Y(ankle+.03),.34*u,.07*u);
  // bowling shoe back view: heel, upper, two-tone, sole
  const sg=c.createLinearGradient(0,Y(L.lf+.2),0,Y(L.lf));sg.addColorStop(0,'#c53a3a');sg.addColorStop(.55,'#9d2a33');sg.addColorStop(1,'#3a0f18');c.fillStyle=sg;c.beginPath();c.ellipse(X(fx),Y(L.lf+.11),.23*u,.12*u,0,0,6.283);c.fill();
  c.fillStyle='#f1f1f1';c.beginPath();c.moveTo(X(fx-.25),Y(L.lf+.02));c.lineTo(X(fx+.25),Y(L.lf+.02));c.lineTo(X(fx+.22),Y(L.lf-.03));c.lineTo(X(fx-.22),Y(L.lf-.03));c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.28)';c.beginPath();c.ellipse(X(fx-.08),Y(L.lf+.15),.07*u,.025*u,0,0,6.283);c.fill()}
 // hips / belt
 c.fillStyle=pant;c.beginPath();c.moveTo(X(-.4+tx*.4),Y(hip+.1));c.lineTo(X(.4+tx*.4),Y(hip+.1));c.lineTo(X(.42),Y(hip-.12));c.lineTo(X(-.42),Y(hip-.12));c.closePath();c.fill();
 // torso with V taper + gradient lighting
 const tg=c.createLinearGradient(X(-.62),0,X(.62),0);tg.addColorStop(0,sh[1]);tg.addColorStop(.3,sh[0]);tg.addColorStop(.62,sh[0]);tg.addColorStop(1,sh[1]);
 const wx=.4,sx=.6;
 c.fillStyle=tg;c.beginPath();c.moveTo(X(-wx+tx*.45),Y(hip-.02));c.lineTo(X(wx+tx*.45),Y(hip-.02));c.bezierCurveTo(X(wx+.04+tx*.7),Y(hip+.35),X(sx+.02+tx),Y(sy-.55),X(sx+tx),Y(sy-.14));c.quadraticCurveTo(X(.52+tx),Y(sy+.1),X(.2+tx),Y(sy+.14));c.lineTo(X(-.2+tx),Y(sy+.14));c.quadraticCurveTo(X(-.52+tx),Y(sy+.1),X(-sx+tx),Y(sy-.14));c.bezierCurveTo(X(-sx-.02+tx),Y(sy-.55),X(-wx-.04+tx*.7),Y(hip+.35),X(-wx+tx*.45),Y(hip-.02));c.closePath();c.fill();
 c.save();c.clip();
 // side panels, yoke seam, hem, center seam, folds, shading
 c.fillStyle='rgba(255,255,255,.9)';c.fillRect(X(-.7),Y(sy-.4),1.4*u,.09*u);
 c.fillStyle=sh[1];c.fillRect(X(-.7),Y(sy-.36),.3*u,(sy-.36-hip)*u);c.fillRect(X(.4),Y(sy-.36),.3*u,(sy-.36-hip)*u);
 c.fillStyle='rgba(255,255,255,.55)';c.fillRect(X(-.4),Y(sy-.36),.025*u,(sy-.36-hip)*u);c.fillRect(X(.375),Y(sy-.36),.025*u,(sy-.36-hip)*u);
 c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=.02*u;c.beginPath();c.moveTo(X(tx*.6),Y(sy+.12));c.lineTo(X(tx*.4),Y(hip));c.stroke();
 c.strokeStyle='rgba(255,255,255,.1)';c.lineWidth=.04*u;[[-.22,.55],[.18,.7],[.05,.35]].forEach(f=>{c.beginPath();c.moveTo(X(f[0]+tx*.5),Y(hip+f[1]));c.quadraticCurveTo(X(f[0]+.09+tx*.5),Y(hip+f[1]-.14),X(f[0]+tx*.5),Y(hip+f[1]-.3));c.stroke()});
 c.strokeStyle='rgba(0,0,0,.14)';[[-.28,.9],[.3,.5]].forEach(f=>{c.beginPath();c.moveTo(X(f[0]+tx*.5),Y(hip+f[1]));c.quadraticCurveTo(X(f[0]-.08+tx*.5),Y(hip+f[1]-.14),X(f[0]+tx*.5),Y(hip+f[1]-.28));c.stroke()});
 const fg=c.createLinearGradient(0,Y(sy+.2),0,Y(hip));fg.addColorStop(0,'rgba(255,255,255,.18)');fg.addColorStop(.6,'rgba(0,0,0,0)');fg.addColorStop(1,'rgba(0,0,0,.28)');c.fillStyle=fg;c.fillRect(X(-.7),Y(sy+.2),1.4*u,(sy+.2-hip)*u);
 c.fillStyle='rgba(0,0,0,.4)';c.fillRect(X(-.5),Y(hip+.03),1*u,.07*u);
 c.fillStyle='rgba(255,255,255,.93)';c.textAlign='center';c.font='900 '+Math.round(u*.5)+'px Tahoma,sans-serif';c.fillText('7',X(tx),Y(sy-.7));
 
 c.restore();
 // collar band and neck
 c.fillStyle=skinD;c.fillRect(X(-.12+tx),Y(sy+.34),.24*u,.26*u);
 c.fillStyle=sh[1];c.beginPath();c.moveTo(X(-.24+tx),Y(sy+.08));c.quadraticCurveTo(X(tx),Y(sy+.32),X(.24+tx),Y(sy+.08));c.lineTo(X(.2+tx),Y(sy+.18));c.quadraticCurveTo(X(tx),Y(sy+.4),X(-.2+tx),Y(sy+.18));c.closePath();c.fill();
 // arms
 const arm=(shx,shy,hx,hy,sd,hand)=>{const ex=(shx+hx)/2+sd*.12,ey=(shy+hy)/2-.05;
  limb(shx,shy,ex,ey,.3,sh[1]);limb(shx,shy,(shx+ex)/2+.0,(shy+ey)/2,.3,sh[0],'rgba(255,255,255,.18)');
  const mx=(shx+ex)/2,my=(shy+ey)/2;c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=.035*u;c.beginPath();c.arc(X(mx+(hx-shx)*.12),Y(my+(hy-shy)*.12),.09*u,.3,2.84);c.stroke();
  limb(ex,ey,hx,hy,.2,skin,'rgba(255,230,200,.35)');
  c.fillStyle='#f5f5f5';c.beginPath();c.ellipse(X((ex+hx*2)/3),Y((ey+hy*2)/3),.09*u,.06*u,0,0,6.283);c.fill();
  c.fillStyle=skin;c.beginPath();c.ellipse(X(hx),Y(hy),.1*u,.12*u,0,0,6.283);c.fill();
  if(hand){c.strokeStyle=skinD;c.lineWidth=.03*u;c.lineCap='round';for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(X(hx+i*.04),Y(hy-.05));c.lineTo(X(hx+i*.05),Y(hy-.15));c.stroke()}}};
 let rx,ry,lx,ly;
 if(fol){rx=.5+tx;ry=3.3;lx=-1.05;ly=2.3}
 else{const rr=m.reach||0,tgx=m.reachX!==undefined?m.reachX:.8;rx=.82+(tgx-.82)*rr;ry=(m.hold||rr?1.12:1.3-sw*.12*wk)+.04*rr;lx=-.84-.04*sw*wk;ly=1.3+sw*.14*wk}
 arm(-.6+tx,sy-.1,lx+tx*.3,ly,-1,0);
 // head: skull, hair with strands, ears, hairline
 const hy=3.0+bob-(stc?.04:0),hx0=tx+.02;
 c.fillStyle=skin;c.beginPath();c.ellipse(X(hx0),Y(hy),.29*u,.32*u,0,0,6.283);c.fill();
 c.fillStyle=skinD;c.beginPath();c.ellipse(X(hx0-.3),Y(hy-.04),.05*u,.08*u,0,0,6.283);c.ellipse(X(hx0+.3),Y(hy-.04),.05*u,.08*u,0,0,6.283);c.fill();
 const hg=c.createRadialGradient(X(hx0-.1),Y(hy+.14),.02*u,X(hx0),Y(hy),.36*u);hg.addColorStop(0,'#5a3d2c');hg.addColorStop(.6,'#2a1b12');hg.addColorStop(1,'#120a06');
 c.fillStyle=hg;c.beginPath();c.ellipse(X(hx0),Y(hy+.02),.31*u,.34*u,0,0,6.283);c.fill();c.save();c.beginPath();c.ellipse(X(hx0),Y(hy+.02),.31*u,.34*u,0,0,6.283);c.clip();c.fillStyle=skin;c.beginPath();c.moveTo(X(hx0-.4),Y(hy-.3));c.lineTo(X(hx0-.4),Y(hy-.2));c.quadraticCurveTo(X(hx0-.12),Y(hy-.13),X(hx0),Y(hy-.22));c.quadraticCurveTo(X(hx0+.12),Y(hy-.13),X(hx0+.4),Y(hy-.2));c.lineTo(X(hx0+.4),Y(hy-.3));c.fill();c.restore();
 c.strokeStyle='rgba(255,230,200,.14)';c.lineWidth=.014*u;for(let i=0;i<7;i++){const a=-.24+i*.08;c.beginPath();c.moveTo(X(hx0+a*.4),Y(hy+.38));c.quadraticCurveTo(X(hx0+a*1.2),Y(hy+.2),X(hx0+a*1.3),Y(hy+.0));c.stroke()}
 c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.ellipse(X(hx0-.1),Y(hy+.2),.12*u,.05*u,-.5,0,6.283);c.fill();
 arm(.6+tx,sy-.1,rx+tx*.3,ry,1,1);m.hs=[X(rx+tx*.3),Y(ry)];
 c.restore()}
function bwMachine(c,g,th,s,T){const x0=BWMX0,x1=BWMX1,z0=BWMZ0,z1=BWMZ1,h=BWMH,F=(x,z,hh)=>bwP3(g,x,z,hh),q=bwP(g,(x0+x1)/2,(z0+z1)/2),px=q[2]*g.WL;
 const poly=(pts,fill)=>{c.fillStyle=fill;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill()};
 const A=F(x0,z0,0),B=F(x1,z0,0),At=F(x0,z0,h),Bt=F(x1,z0,h),Ct=F(x1,z1,h),Dt=F(x0,z1,h),D=F(x0,z1,0);
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.moveTo(A[0]-4,A[1]);c.lineTo(B[0]+8,B[1]+2);c.lineTo(B[0]+8,D[1]);c.lineTo(D[0]-4,D[1]+2);c.fill();
 let gg=c.createLinearGradient(A[0],0,D[0],0);gg.addColorStop(0,'#2b324a');gg.addColorStop(1,'#12162a');poly([A,D,Dt,At],gg);
 gg=c.createLinearGradient(0,At[1],0,A[1]);gg.addColorStop(0,'#3a4466');gg.addColorStop(.5,'#232a46');gg.addColorStop(1,'#10142a');poly([A,B,Bt,At],gg);
 gg=c.createLinearGradient(0,Bt[1],0,Dt[1]);gg.addColorStop(0,'#58628a');gg.addColorStop(1,'#3a4468');poly([At,Bt,Ct,Dt],gg);
 // LED strips
 const pulse=.55+.45*Math.sin(T*3);c.strokeStyle='rgba('+th.gl+','+pulse+')';c.lineWidth=Math.max(1.5,.05*px);c.lineCap='round';let l1=F(x0,z0,.1),l2=F(x1,z0,.1);c.beginPath();c.moveTo(l1[0],l1[1]);c.lineTo(l2[0],l2[1]);c.stroke();c.strokeStyle='rgba('+th.gl+','+pulse*.25+')';c.lineWidth=Math.max(4,.18*px);c.stroke();
 l1=F(x0,z0,h-.04);l2=F(x1,z0,h-.04);c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1.2;c.beginPath();c.moveTo(l1[0],l1[1]);c.lineTo(l2[0],l2[1]);c.stroke();
 // arch opening on the front face
 const xc=(x0+x1)/2,aw=.22,pts=[];for(let i=0;i<=12;i++){const a=Math.PI*i/12;pts.push(F(xc+Math.cos(a)*aw,z0,.24+Math.sin(a)*.2))}pts.push(F(xc-aw,z0,.12),F(xc+aw,z0,.12));c.fillStyle='#04050c';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.strokeStyle='rgba(180,190,220,.5)';c.lineWidth=1.4;c.stroke();
 // rear raised panel with sign
 const R0=F(x0,z1-.28,h),R1=F(x1,z1-.28,h),R0t=F(x0,z1-.28,h+.45),R1t=F(x1,z1-.28,h+.45),R2=F(x0,z1,h+.45),R3=F(x1,z1,h+.45);
 gg=c.createLinearGradient(0,R0t[1],0,R0[1]);gg.addColorStop(0,'#2a3150');gg.addColorStop(1,'#171c34');poly([R0,R1,R1t,R0t],gg);poly([R0t,R1t,R3,R2],'#566090');
 c.save();c.fillStyle='rgba('+th.gl+','+(.7+.3*Math.sin(T*2))+')';c.font='800 '+Math.max(7,Math.round(.12*px))+'px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('بازگشت توپ','BALL RETURN'),(R0[0]+R1[0])/2,(R0[1]+R0t[1])/2+.04*px);c.restore();
 // cradles and decorative balls
 const sp=[[-8.05,'#f43f5e'],[-7.4,null],[-6.95,'#22c55e']],act=s.st==='intro'&&s.it<2.18;
 sp.forEach((e,i)=>{const P=F(xc,e[0],h),rx=.27*px;c.fillStyle='#161a2e';c.beginPath();c.ellipse(P[0],P[1],rx,rx*.42,0,0,6.283);c.fill();c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.stroke();
  if(e[1]){const bt={ball:[e[1],'#2a0a14','#ffffff'],gl:th.gl};bwBallAt(c,P[0],P[1]-.2*px,.21*px,i*2,bt,false)}});
 // returning / waiting ball
 if(s.st==='intro'&&s.it<2.18&&!s.skipMan||s.st==='intro'&&s.skipMan&&s.it<.9){const e=bwCl((s.it-(s.skipMan?.2:.5))/(s.skipMan?.6:1),0,1),ee=1-Math.pow(1-e,3),zz=z0-.1+(-7.4-(z0-.1))*ee,hh=.28+(h+.21-.28)*ee+Math.sin(ee*Math.PI)*.22,P=F(xc,zz,hh),sc=.55+.45*Math.min(1,e*2.5);if(e>0&&(!s.skipMan||e<1)){c.save();bwBallAt(c,P[0],P[1],.21*px*sc,e*9,th,th.art===1||th.art===2);c.restore()}}
 }
function bwEnv(c,g,s,th,T){const ZN=Math.max(BWZ0,g.cz-17),W=g.W,H=g.H,P=(x,z)=>bwP(g,x,z),poly=(pts,fill)=>{c.fillStyle=fill;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill()};
 const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,th.wall[0]);bg.addColorStop(1,th.wall[1]);c.fillStyle=bg;c.fillRect(-W,-H,W*3,H*3);
 // side walls (inner corridor z>=0, wider room in the approach z<0)
 const wallPanel=(sd,x,za,zb,i)=>{za=Math.max(za,ZN);if(zb<=za+.01)return;const a=P(sd*x,za),b=P(sd*x,zb),ha=1.6*a[2]*g.WL,hb=1.6*b[2]*g.WL,pulse=.5+.5*Math.sin(T*2.2-i*.7);
  const wg=c.createLinearGradient(0,a[1]-ha,0,a[1]);wg.addColorStop(0,th.wall[0]);wg.addColorStop(1,th.wall[1]);poly([[a[0],a[1]],[a[0],a[1]-ha],[b[0],b[1]-hb],[b[0],b[1]]],wg);
  poly([[a[0],a[1]],[a[0],a[1]-ha],[b[0],b[1]-hb],[b[0],b[1]]],i%2?'rgba(255,255,255,.05)':'rgba(0,0,0,.22)');
  c.lineCap='round';c.strokeStyle='rgba('+th.gl+','+(.12+.2*pulse)+')';c.lineWidth=Math.max(3,9*b[2]);c.beginPath();c.moveTo(b[0],b[1]-hb*.12);c.lineTo(b[0],b[1]-hb*.88);c.stroke();c.strokeStyle='rgba('+th.gl+','+(.5+.5*pulse)+')';c.lineWidth=Math.max(1,3*b[2]);c.stroke();
  // baseboard + chair rail
  c.strokeStyle='rgba('+th.gl+',.5)';c.lineWidth=Math.max(1,2*b[2]);c.beginPath();c.moveTo(a[0],a[1]-ha*.1);c.lineTo(b[0],b[1]-hb*.1);c.stroke();c.strokeStyle='rgba(255,255,255,.1)';c.beginPath();c.moveTo(a[0],a[1]-ha*.5);c.lineTo(b[0],b[1]-hb*.5);c.stroke()};
 for(const sd of[-1,1]){for(let i=0;i<8;i++)wallPanel(sd,1.62,i*3.4,Math.min(25,i*3.4+3.4),i);for(let i=0;i<4;i++)wallPanel(sd,2.9,BWZ0+i*4.5,BWZ0+i*4.5+4.5,i)}
 // wall at z=0 joining corridor to room
 for(const sd of[-1,1]){const a=P(sd*1.62,0),b=P(sd*2.9,0),ha=1.6*a[2]*g.WL;poly([[a[0],a[1]],[a[0],a[1]-ha],[b[0],b[1]-ha],[b[0],b[1]]],'rgba(0,0,0,.35)')}
 // carpet / floor outside the lane
 for(const sd of[-1,1]){const f0=P(sd*1,ZN),f1=P(sd*2.9,ZN),f2=P(sd*2.9,0),f3=P(sd*1,0);const cg=c.createLinearGradient(0,f0[1],0,f3[1]);cg.addColorStop(0,th.floor);cg.addColorStop(1,'#000');poly([f0,f1,f2,f3],th.floor);poly([f0,f1,f2,f3],'rgba(0,0,0,.25)');
  for(let i=0;i<16;i++){const z=Math.max(ZN,BWZ0+i*1.1),a=P(sd*1.05,z),b=P(sd*2.9,z);c.strokeStyle='rgba(255,255,255,.04)';c.lineWidth=1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
  const h0=P(sd*1,0),h1=P(sd*1.62,0),h2=P(sd*1.62,24),h3=P(sd*1,24);poly([h0,h1,h2,h3],'rgba(0,0,0,.5)');
  // gutter
  const g0=P(sd*1,-.2),g1=P(sd*1,24),g2=P(sd*1.2,24),g3=P(sd*1.2,-.2);poly([g0,g1,g2,g3],th.gut);const gx=c.createLinearGradient(g0[0],0,g3[0],0);gx.addColorStop(0,'rgba(0,0,0,.65)');gx.addColorStop(.5,'rgba(255,255,255,.07)');gx.addColorStop(1,'rgba(0,0,0,.6)');poly([g0,g1,g2,g3],gx);
  c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1.2;c.beginPath();c.moveTo(g3[0],g3[1]);c.lineTo(g2[0],g2[1]);c.stroke()}
 // lane body
 const L1=P(-1,ZN),L2=P(1,ZN),L3=P(1,24),L4=P(-1,24),lg=c.createLinearGradient(0,g.yF,0,g.yN+H*.15);lg.addColorStop(0,th.lane[1]);lg.addColorStop(.5,th.lane[0]);lg.addColorStop(1,th.lane[1]);poly([L1,L2,L3,L4],lg);
 c.save();c.beginPath();[L1,L2,L3,L4].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();
 for(let i=0;i<20;i++){const x0=-1+i*.1,a=P(x0,ZN),b=P(x0+.1,ZN),d=P(x0+.1,24),e=P(x0,24);poly([a,b,d,e],i%2?'rgba(0,0,0,.07)':'rgba(255,255,255,.05)');c.strokeStyle='rgba(0,0,0,.13)';c.lineWidth=1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.stroke()}
 // board end seams at regular intervals
 for(let z=-17;z<24;z+=3.2)if(z>ZN){const a=P(-1,z),b=P(1,z);c.strokeStyle='rgba(0,0,0,.06)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
 // approach tint (z<0) + foot dots + arrows
 const ap=[P(-1,ZN),P(1,ZN),P(1,0),P(-1,0)];poly(ap,'rgba(255,255,255,.1)');
 [-3,-4.5].forEach(z=>[-.7,-.4,-.15,.15,.4,.7].forEach(x=>{const a=P(x,z);c.fillStyle='rgba(30,10,0,.35)';c.beginPath();c.arc(a[0],a[1],2.4*a[2],0,6.283);c.fill()}));
 [-.7,-.4,-.15,.15,.4,.7].forEach(x=>{const a=P(x,-.6);c.fillStyle='rgba(30,10,0,.35)';c.beginPath();c.arc(a[0],a[1],2.4*a[2],0,6.283);c.fill()});
 c.fillStyle='rgba(30,10,0,.5)';[-.7,-.4,-.15,0,.15,.4,.7].forEach(x=>{const zz=7.4-Math.abs(x)*4,a=P(x,zz),b=P(x-.06,zz-.9),d=P(x+.06,zz-.9);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.fill()});
 // pin spots
 BWPOS.forEach(q=>{const a=P(q[0],21.4+q[1]*.74),r=.12*a[2]*g.WL;c.strokeStyle='rgba(20,5,0,.35)';c.lineWidth=1.4;c.beginPath();c.ellipse(a[0],a[1],r,r*.3,0,0,6.283);c.stroke()});
 // gloss, oil sheen, lamp pools
 const gl=c.createLinearGradient(0,g.yF,0,g.yN);gl.addColorStop(0,'rgba(255,255,255,.3)');gl.addColorStop(.5,'rgba(255,255,255,.04)');gl.addColorStop(1,'rgba(255,255,255,.22)');c.fillStyle=gl;c.fillRect(0,g.yF,W,g.yN-g.yF+H*.2);
 const m1=P(-.3,ZN),m2=P(.3,ZN),m3=P(.1,24),m4=P(-.1,24),sh2=c.createLinearGradient(m1[0],0,m2[0],0);sh2.addColorStop(0,'rgba(255,255,255,0)');sh2.addColorStop(.5,'rgba(255,255,255,'+(.11+.05*Math.sin(T*1.3))+')');sh2.addColorStop(1,'rgba(255,255,255,0)');poly([m1,m2,m3,m4],sh2);
 c.globalCompositeOperation='lighter';[-6,0,4,9,14,19].filter(z=>z>ZN+1).forEach((z,i)=>{const q=P(Math.sin(T*.6+i)*.15,z),rr=g.WL*q[2]*.95,gr=c.createRadialGradient(q[0],q[1],2,q[0],q[1],rr);gr.addColorStop(0,'rgba('+th.gl+','+(.3+.1*Math.sin(T*2+i))+')');gr.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=gr;c.beginPath();c.ellipse(q[0],q[1],rr,rr*.28,0,0,6.283);c.fill()});c.globalCompositeOperation='source-over';
 const f1=P(-1,0),f2=P(1,0);c.strokeStyle='#e11d2e';c.lineWidth=Math.max(2,3.2*f1[2]);c.beginPath();c.moveTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.stroke();c.strokeStyle='rgba(255,90,100,.35)';c.lineWidth=Math.max(5,9*f1[2]);c.stroke();c.restore();
 // LED chase along the lane edges (cheap halo instead of shadowBlur)
 for(const sd of[-1,1]){const col=sd<0?th.e1:th.e2,a=P(sd,ZN),b=P(sd,24);c.strokeStyle=col;c.globalAlpha=.5;c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
  for(let i=0;i<54;i++){const z=BWZ0+i*.78;if(z<ZN)continue;const q=P(sd,z),on=.35+.65*Math.max(0,Math.sin(T*5-i*.5)),rr=Math.max(1.2,3.2*q[2]);c.fillStyle=col;c.globalAlpha=on*.3;c.beginPath();c.arc(q[0],q[1],rr*2.4,0,6.283);c.fill();c.globalAlpha=on;c.beginPath();c.arc(q[0],q[1],rr,0,6.283);c.fill()}c.globalAlpha=1}
 // pit, curtain and masking unit
 const p1=P(-1.2,24),p2=P(1.2,24),pitTop=g.yF-H*.05,pg=c.createLinearGradient(0,pitTop,0,p1[1]);pg.addColorStop(0,'#000');pg.addColorStop(1,'#0b0b14');c.fillStyle=pg;c.beginPath();c.moveTo(p1[0]-4,p1[1]);c.lineTo(p1[0]+3,pitTop);c.lineTo(p2[0]-3,pitTop);c.lineTo(p2[0]+4,p2[1]);c.closePath();c.fill();
 c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=1;for(let i=0;i<14;i++){const xx=p1[0]+(p2[0]-p1[0])*(i+.5)/14;c.beginPath();c.moveTo(xx,pitTop);c.lineTo(xx,p1[1]);c.stroke()}
 const hg=c.createRadialGradient(g.cx,g.yF-H*.02,4,g.cx,g.yF-H*.02,g.WL*.7*Math.max(.8,1/(1+g.K*(24-g.cz))*2));hg.addColorStop(0,'rgba('+th.gl+',.28)');hg.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=hg;c.fillRect(0,g.yF-H*.15,W,H*.2);
 bwArt(c,T,th,8,62,W-16,Math.max(70,pitTop-62-4),s);
 c.fillStyle='rgba(255,255,255,.8)';c.font='700 9px Tahoma,sans-serif';c.textAlign='left';c.fillText(oL('لاین ۷','LANE 7'),18,76);
 const bar=c.createLinearGradient(0,pitTop-8,0,pitTop);bar.addColorStop(0,'#3b3f52');bar.addColorStop(1,'#14161f');c.fillStyle=bar;gxRR(c,10,pitTop-8,W-20,9,4);c.fill()}
function bwBoard(c,x,y,w,h,F,cur,th,fs){const fw=(w-6)/10;for(let i=0;i<10;i++){const bx=x+3+i*fw,is=cur===i;c.strokeStyle=is?th.e1:'rgba(255,255,255,.2)';c.lineWidth=is?2:1;c.strokeStyle=is?th.e1:'rgba(255,255,255,.2)';if(is){c.fillStyle='rgba('+th.gl+',.12)';c.fillRect(bx+1,y+3,fw-2,h-6)}c.strokeRect(bx+1,y+3,fw-2,h-6);const fr=F[i],nm=i===9?3:2,bw=(fw-2)/nm,top=(h-6)*.42;
  c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=1;c.beginPath();c.moveTo(bx+1,y+3+top);c.lineTo(bx+fw-1,y+3+top);for(let j=1;j<nm;j++){c.moveTo(bx+1+bw*j,y+3);c.lineTo(bx+1+bw*j,y+3+top)}c.stroke();
  c.textAlign='center';c.font='800 '+fs+'px Tahoma,sans-serif';fr.m.forEach((m,j)=>{const v=m===0?'-':(typeof m==='number'?fa(m):m);c.fillStyle=(m==='X'||m==='/')?th.e2:'#fff';c.fillText(v,bx+1+bw*(j+.5),y+3+top*.78)});
  if(fr.c!==null){c.fillStyle='#fff';c.font='800 '+Math.round(fs*1.25)+'px Tahoma,sans-serif';c.fillText(fa(fr.c),bx+fw/2,y+3+top+(h-6-top)*.68)}else{c.fillStyle='rgba(255,255,255,.35)';c.font='600 '+Math.round(fs*.85)+'px Tahoma,sans-serif';c.fillText(fa(i+1),bx+fw/2,y+3+top+(h-6-top)*.66)}}}
function bwStats(s){const F=bwScore(s.rolls),all=[];F.forEach(f=>f.m.forEach(m=>all.push(m)));const st=all.filter(m=>m==='X').length,sp=all.filter(m=>m==='/').length;let fb=[],bf=0;F.forEach(f=>{if(f.m.length){fb.push(f.m[0]==='X'?10:f.m[0])}if(f.s!==null)bf=Math.max(bf,f.s)});
 return{F,tot:bwTotal(s.rolls),st,sp,gut:s.gutN||0,avg:fb.length?Math.round(fb.reduce((a,b)=>a+b,0)/fb.length*10)/10:0,bf,ms:s.maxStreak||0,n:s.rolls.length}}
function bwAutoSave(s){if(s.autoSaved)return;const o=gxS(),S2=bwStats(s);o.bsc=o.bsc||[];o.bsc.unshift({d:iso(today()),s:S2.tot,t:s.th,f:10,x:S2.st,ok:1});if(s.cpu){const V=bwVs(s);o.bwin=o.bwin||{w:0,l:0,d:0};if(V.r>0)o.bwin.w++;else if(V.r<0)o.bwin.l++;else o.bwin.d++}o.bsc=o.bsc.slice(0,40);s.autoSaved=1;s.savedN=s.rolls.length;gxSave();save();try{bwListUp()}catch(e){}}
function bwFinal(c,g,s,th,dt){const W=g.W,H=g.H,S2=bwStats(s),px=12,py=Math.round(H*.085),pw=W-24,ph=Math.round(H*.83);
 s.ov=Math.min(1,(s.ov||0)+dt*3);const k=1-Math.pow(1-s.ov,3);s.cnt=Math.min(S2.tot,(s.cnt||0)+Math.max(2,S2.tot)*dt*.9);
 c.fillStyle='rgba(6,4,20,'+(.78*k)+')';c.fillRect(0,0,W,H);c.save();c.translate(0,(1-k)*30);c.globalAlpha=k;
 const pg=c.createLinearGradient(0,py,0,py+ph);pg.addColorStop(0,'rgba(30,24,70,.95)');pg.addColorStop(1,'rgba(12,10,34,.96)');c.fillStyle=pg;gxRR(c,px,py,pw,ph,20);c.fill();c.strokeStyle=th.e1;c.globalAlpha=k*.7;c.lineWidth=2;c.stroke();c.globalAlpha=k;
 c.textAlign='center';c.fillStyle='#fff';c.font='800 22px Tahoma,sans-serif';const V=s.cpu?bwVs(s):null;c.fillText(V?V.tt:oL('بازی تموم شد','Game over'),W/2,py+34);
 const gr=S2.tot>=200?oL('حرفه‌ای!','Pro level!'):S2.tot>=150?oL('عالی','Excellent'):S2.tot>=100?oL('خوب','Good'):S2.tot>=60?oL('بد نیست','Not bad'):oL('ادامه بده','Keep going');c.fillStyle=V?V.c:th.e2;c.font='700 14px Tahoma,sans-serif';c.fillText(V?oL('شما','You')+' '+fa(V.p)+'  —  '+fa(V.q)+' '+oL('کامپیوتر','CPU'):gr,W/2,py+56);
 c.fillStyle='#fff';c.font='800 54px Tahoma,sans-serif';c.shadowColor='rgba('+th.gl+',.9)';c.shadowBlur=14;c.fillText(fa(Math.round(s.cnt)),W/2,py+114);c.shadowBlur=0;
 c.font='600 13px Tahoma,sans-serif';c.fillStyle=s.newBest?'#ffd24a':'rgba(255,255,255,.75)';c.fillText(s.newBest?oL('رکورد جدید!','New record!')+' · '+fa(S2.tot):oL('بهترین امتیاز','Best')+': '+fa(s.best),W/2,py+138);
 bwBoard(c,px+6,py+152,pw-12,66,S2.F,-1,th,Math.max(10,Math.round(pw/30)));
 const items=[[oL('استرایک','Strikes'),S2.st],[oL('اسپر','Spares'),S2.sp],[oL('توپ ناودونی','Gutter balls'),S2.gut],[oL('بیشترین استرایک پشت‌سرهم','Longest strike streak'),S2.ms],[oL('میانگین توپ اول','First-ball avg'),S2.avg],[oL('بهترین فریم','Best frame'),S2.bf]],cw=(pw-24)/2;
 items.forEach((it,i)=>{const cx2=px+12+(i%2)*cw,cy2=py+238+Math.floor(i/2)*38;c.fillStyle='rgba(255,255,255,.07)';gxRR(c,cx2,cy2,cw-8,32,10);c.fill();c.textAlign='left';c.fillStyle='rgba(255,255,255,.7)';c.font='600 10px Tahoma,sans-serif';c.fillText(it[0],cx2+8,cy2+13);c.fillStyle='#fff';c.font='800 15px Tahoma,sans-serif';c.fillText(fa(it[1]),cx2+8,cy2+28)});
 c.textAlign='center';c.fillStyle='#7ee787';c.font='700 12px Tahoma,sans-serif';c.fillText('✓ '+oL('امتیاز خودکار ثبت شد','Score saved automatically'),W/2,py+ph-40);c.fillStyle='rgba(255,255,255,.85)';c.font='600 13px Tahoma,sans-serif';c.fillText(oL('برای شروع دوباره بزن','Tap to play again'),W/2,py+ph-18);c.restore()}
function bwCamT(s){switch(s.st){
 case'intro':if(s.skipMan)return{cz:-3.2,zm:1.1,cx:0,r:4};if(s.it>=2.4)return{cz:-3.2,zm:s.it>=3.3?1.1:1,cx:0,r:2.4};return{cz:-12.5,zm:1,cx:.5,r:3};
 case'aim':return{cz:-3.2,zm:1.1,cx:0,r:4};
 case'roll':{const B=s.ball;if(!B)return{cz:3,zm:1,cx:0,r:3};if(B.t<.5)return{cz:-6.5,zm:1.05,cx:0,r:6};return{cz:bwCl(B.z-4.2,-6.5,11),zm:1+.12*bwCl((B.z-8)/12,0,1),cx:0,r:5}}
 case'settle':case'sweep':return{cz:4,zm:1,cx:0,r:2.5};
 default:return{cz:2,zm:1,cx:0,r:2}}}
function bwManUp(s,dtr){const t=s.it,M=s.man;M.walk=0;M.pose='walk';M.hold=0;M.reach=0;M.al=0;M.sc=.56;const u=t-.4;
 if(u>=.3&&u<1.5){const k=(u-.3)/1.2,e=k*k*(3-2*k);M.x=-.45+1.43*e;M.z=-9.4+2.1*e;M.walk=1;M.al=bwCl((u-.3)/.35,0,1);M.ph+=dtr*9}
 else if(u>=1.5&&u<2.0){M.x=.98;M.z=-7.3;M.al=1;M.pose='reach';M.reach=u<1.75?bwCl((u-1.5)/.25,0,1):bwCl(1-(u-1.75)/.25,0,1);M.reachX=(1.62-M.x)/.56;M.hold=u>=1.75}
 else if(u>=2.0&&u<3.1){const k=(u-2)/1.1,e=k*k*(3-2*k);M.x=.98-.98*e;M.z=-7.3+2.7*e;M.walk=1;M.hold=1;M.al=1;M.ph+=dtr*8.5}
 else if(u>=3.1){M.x=0;M.z=-4.6;M.pose='stance';M.hold=1;M.al=bwCl(1-(u-3.1)/.45,0,1)}
 const st=Math.floor(M.ph/Math.PI);if(M.walk&&st!==M.stp){M.stp=st;gxTone(90,.05,.02)}}
GXD.bwl={
 init(){const o=gxS(),s={th:o.bt||0,cpu:o.bvs?{rolls:[],f:0,k:0,nf:0,lv:o.bvs,ban:null}:null,rolls:[],f:0,k:0,st:'intro',it:0,skipMan:!!o.bskip,bx:0,bz:-1.4,ball:null,pins:[],t:0,pp:[],cf:[],tx:null,shake:0,flash:0,hint:1,over:0,best:o.bbest||0,drag:null,hitT:0,pop:1,settle:0,sw:0,reset:false,before:10,gutter:0,pdown:0,rumble:0,gutN:0,maxStreak:0,streak:0,cam:{cz:-12.5,zm:1,cx:.5},man:{x:-.45,z:-9.4,ph:0,al:0,sc:.56,stp:0},man2:null,trail:[],stars:Array.from({length:46},()=>[Math.random(),Math.random(),rnd(.8,2),rnd(1,3)])};
  if(s.skipMan)s.cam={cz:-3.2,zm:1.1,cx:0};bwRack(s,true);s.dropT=.9;return s},
 pt(p){const g=bwGeo(),s=GX.st,q=bwP(g,0,s.bz),px=g.cx+(p.x-g.cx)/g.zm;return bwCl((px-g.cx)/(q[2]*g.WL)+g.camx,-.88,.88)},
 down(p){const s=GX.st;if(XS.bwfs&&s.tb){const g0=bwGeo();if(p.y>g0.H-52){const b=s.tb.find(q=>p.x>=q.x&&p.x<=q.x+q.w);if(b)b.f();return}}
  if(s.st==='over'){if(performance.now()-s.over>900&&(s.ov||0)>.8){const th=s.th,b=s.best;GX.st=GXD.bwl.init();GX.st.th=th;GX.st.best=b}return}
  if(s.st==='intro'){if(!s.skipMan&&s.it<3.5)s.it=Math.max(s.it,3.2);return}
  if(s.st!=='aim'||s.dropT>0)return;const g=bwGeo();if(p.y<g.H*.5)return;s.drag={pts:[{x:p.x,y:p.y,t:performance.now()}],y0:p.y};s.bx=GXD.bwl.pt(p);gxTone(330,.1,.03)},
 move(p){const s=GX.st,d=s.drag;if(!d)return;const g=bwGeo(),n=performance.now();d.pts.push({x:p.x,y:p.y,t:n});if(d.pts.length>60)d.pts.shift();let low=d.pts[0].y;d.pts.forEach(q=>{low=Math.max(low,q.y)});const up=Math.max(0,low-p.y);s.bz=Math.min(.2,-1.4+up/(g.H*.12)*1.6);s.bx=GXD.bwl.pt(p)},
 up(){const s=GX.st;if(!s||!s.drag)return;const d=s.drag;s.drag=null;const f=bwFlick(d);if(!f){s.bz=-1.4;return}
  const w=gxS().bwt||0;s.ball={x:s.bx,z:s.bz,vx:f.vx,vz:f.vz,sp:f.sp,r:.21,rot:0,gut:0,t:0,m:[6,8,11][w],hk:[1.25,1,.75][w]};s.man2={x:s.bx,z:-2.9,ph:0,al:1,sc:.56,pose:'follow',t:0,hold:0};
  s.st='roll';s.before=bwAlive(s);s.hint=0;s.gutter=0;s.pdown=0;s.slowed=0;s.slow=0;s.trail=[];gxTone(180,.5,.04);gxVib(12)},
 draw(t,dt){const c=GX.cx,s=GX.st,W=GX.w,H=GX.h,th=BWT[s.th]||BWT[0],T=t/1000,dtr=dt;s.t=T;
  let ts=1;if(s.slow>0){s.slow-=dtr;ts=.4}const dtp=dtr*ts;
  // ---------- camera ----------
  const ct=bwCamT(s),kc=1-Math.exp(-dtr*ct.r);s.cam.cz+=(ct.cz-s.cam.cz)*kc;s.cam.zm+=(ct.zm-s.cam.zm)*kc;s.cam.cx+=(ct.cx-s.cam.cx)*kc;
  const g=bwGeo();
  // ---------- simulation / state machine ----------
  s.shake=Math.max(0,s.shake-dtp*18);s.flash=Math.max(0,s.flash-dtr*1.6);if(s.dropT>0)s.dropT=Math.max(0,s.dropT-dtr);s.pins.forEach(p=>{if(p.dy>0)p.dy=Math.max(0,p.dy-dtr*1.9)});if(s.pop<1)s.pop=Math.min(1,s.pop+dtr*4);
  const B0=s.ball;s.zoomT=B0?bwCl((B0.z-14)/9,0,1)*.1:(s.st==='settle'?Math.max(0,.07*(1-s.settle/1.4)):0);s.zoom=(s.zoom||0)+(s.zoomT-(s.zoom||0))*Math.min(1,dtr*5);if(s.fl){s.fl.t-=dtr*2.2;if(s.fl.t<=0)s.fl=null}
  if(s.man2){s.man2.t+=dtr;s.man2.al=s.man2.t<.9?1:bwCl(1-(s.man2.t-.9)/.5,0,1);if(s.man2.t>1.5)s.man2=null}
  if(s.st==='intro'){s.it+=dtr;const TI=s.skipMan?1.0:4.0;if(!s.sndRet&&s.it>(s.skipMan?.2:.5)){s.sndRet=1;gxTone(110,.3,.05);setTimeout(()=>gxTone(160,.15,.03),120)}if(!s.skipMan)bwManUp(s,dtr);
   if(s.it>=TI){s.st='aim';s.man.al=0;s.pop=s.skipMan?0:1;gxTone(330,.12,.03)}}
  if(s.st==='roll'||s.st==='settle'){let n=Math.max(1,Math.ceil(dtp/.004)),h=dtp/n;for(let i=0;i<n;i++)bwStep(s,h);if(s.ball){s.rumble-=dtr;if(s.rumble<=0&&!s.ball.gut){s.rumble=.16;gxTone(70+s.ball.vz*2,.2,.025)}}}
  if(s.st==='roll'&&!s.ball){s.st='settle';s.settle=0}
  else if(s.st==='settle'){s.settle+=dtr;const mv=s.pins.some(p=>p.st!==2&&(Math.abs(p.vx)+Math.abs(p.vz)>.18));if((s.settle>.7&&!mv)||s.settle>3.2){const al=bwAlive(s),kn=s.before-al,strike=s.before===10&&kn===10,spare=!strike&&al===0&&kn>0;const done=bwAfter(s,kn,s.before);
     s.streak=strike?(s.streak||0)+1:0;s.maxStreak=Math.max(s.maxStreak||0,s.streak);if(kn===0&&s.gutter)s.gutN=(s.gutN||0)+1;
     if(strike){s.tx={t:1.6,tt:s.streak===3?oL('ترکی! ۳ استرایک','TURKEY!'):s.streak>3?oL('استرایک ×','STRIKE ×')+fa(s.streak):oL('استرایک!','STRIKE!'),c:s.streak>=3?'#ff9f43':'#ffd24a'};s.flash=.5;s.shake=9;for(let i=0;i<70;i++)s.cf.push({x:rnd(0,W),y:rnd(-40,0),vx:rnd(-40,40),vy:rnd(60,180),r:rnd(0,6.28),vr:rnd(-8,8),c:['#ffd24a','#ff6b9d','#22e8ff','#a78bfa','#7ee787'][i%5],w:rnd(4,8)});[523,659,784,1047].forEach((f,i)=>setTimeout(()=>gxTone(f,.3,.06),i*110));gxVib(40)}
     else if(spare){s.tx={t:1.4,tt:oL('اسپر!','SPARE!'),c:'#7cf0ff'};s.flash=.25;for(let i=0;i<36;i++)s.cf.push({x:rnd(0,W),y:rnd(-30,0),vx:rnd(-30,30),vy:rnd(60,150),r:rnd(0,6.28),vr:rnd(-8,8),c:['#7cf0ff','#fff','#ffd24a'][i%3],w:rnd(4,7)});[523,659,784].forEach((f,i)=>setTimeout(()=>gxTone(f,.25,.05),i*100))}
     else if(kn===0){s.tx={t:1.3,tt:s.gutter?oL('ناکام! توپ تو ناودونی رفت','Gutter ball!'):oL('ناکام','Miss'),c:'#ff9a9a'};gxTone(150,.4,.05)}
     else s.tx={t:1.1,tt:fa(kn)+' '+oL('مهره','pins'),c:'#fff'};
     s.done=done;s.st='sweep';s.sw=0;s.trail=[]}}
  else if(s.st==='sweep'){s.sw+=dtr;const k=s.sw;s.pins.forEach(p=>{if(p.st===2)p.fade=Math.min(1,p.fade+dtr*3)});const bz=18.5+bwCl((k-.45)/.7,0,1)*7;s.barZ=bz;
   if(k>.45&&k<1.15)s.pins.forEach(p=>{if(p.st===1&&p.z<=bz+.3){p.st=2;p.fade=0}});
   if(k>1.15&&!s.swept){s.swept=1;s.pins=s.pins.filter(p=>p.st===0||s.reset);if(s.reset)s.pins.forEach(p=>{p.st=2;p.fade=0})}
   if(k>1.7){s.swept=0;s.barZ=null;bwCpuStep(s);if(s.done){s.st='over';s.over=performance.now();const tot=bwTotal(s.rolls);s.newBest=tot>s.best;if(tot>s.best){s.best=tot;gxS().bbest=tot;gxSave()}bwAutoSave(s);s.ov=0;s.cnt=0;gxTone(392,.5,.05);setTimeout(()=>gxTone(523,.6,.05),180);setTimeout(()=>gxTone(659,.7,.05),360)}
    else{if(s.reset){bwRack(s,true);s.dropT=.9;gxTone(120,.3,.04)}s.pins.forEach(p=>{p.vx=p.vz=0});s.st='intro';s.it=0;s.sndRet=0;s.skipMan=!!gxS().bskip;s.bz=-1.4;s.bx=0;s.pop=1;s.reset=false;s.man={x:-.45,z:-9.4,ph:0,al:0,sc:.56,stp:0}}}}
  // ---------- render scene ----------
  c.save();if(s.shake>.2)c.translate(rnd(-s.shake,s.shake)*.5,rnd(-s.shake,s.shake)*.5);
  if(Math.abs(g.zm-1)>.003){const ay=bwAnchor(g);c.translate(g.cx,ay);c.scale(g.zm,g.zm);c.translate(-g.cx,-ay)}
  if(s.zoom>.002){c.translate(g.cx,g.yF);c.scale(1+s.zoom,1+s.zoom);c.translate(-g.cx,-g.yF)}
  bwEnv(c,g,s,th,T);
  // light beams
  c.save();c.globalCompositeOperation='lighter';[[W*.08,1],[W*.92,-1]].forEach((b0,i)=>{const sw=Math.sin(T*.7+i*2)*W*.05,tx=g.cx+b0[1]*-W*.18+sw,ty=bwP(g,0,9)[1];const bg2=c.createLinearGradient(b0[0],0,tx,ty);bg2.addColorStop(0,'rgba('+th.gl+',.16)');bg2.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=bg2;c.beginPath();c.moveTo(b0[0]-8,0);c.lineTo(b0[0]+8,0);c.lineTo(tx+W*.16,ty);c.lineTo(tx-W*.16,ty);c.closePath();c.fill()});c.restore();
  // drawables far -> near
  const D=[];s.pins.forEach(p=>D.push({z:p.z,k:0,p}));if(s.ball)D.push({z:s.ball.z,k:1});else if(s.st==='aim')D.push({z:s.bz,k:2});
  D.push({z:BWMZ1,k:5});if(s.st==='intro'&&!s.skipMan&&s.man.al>.01)D.push({z:s.man.z,k:3});if(s.man2)D.push({z:s.man2.z,k:4});D.sort((a,b)=>b.z-a.z);
  const lift=s.st==='sweep'?Math.sin(Math.min(1,s.sw/1.7)*Math.PI):0;
  D.forEach(d=>{
   if(d.k===0)bwPinDraw(c,g,d.p,th,s.th,d.p.st===0?lift:0);
   else if(d.k===1){const B=s.ball;s.trail.push([B.x,B.z]);if(s.trail.length>16)s.trail.shift();s.trail.forEach((t2,i)=>{const P=bwP(g,t2[0],t2[1]),a=i/s.trail.length;c.fillStyle='rgba('+th.gl+','+(a*.35)+')';c.beginPath();c.ellipse(P[0],P[1]-2,B.r*P[2]*g.WL*a*.9,B.r*P[2]*g.WL*a*.3,0,0,6.283);c.fill()});bwBallDraw(c,g,B,th,1)}
   else if(d.k===2){const e=1-Math.pow(1-s.pop,3);bwBallDraw(c,g,{x:s.bx,z:s.bz,r:.21,rot:s.bz*5+s.bx*2},th,.5+.5*e)}
   else if(d.k===5)bwMachine(c,g,th,s,T);
   else if(d.k===4){const M=s.man2;bwMan(c,g,M,th)}
   else if(d.k===3){const M=s.man;bwMan(c,g,M,th);const u=s.it-.4;if(M.hs&&u>=1.75){const q=bwP(g,M.x,M.z),r=.21*q[2]*g.WL;let bx=M.hs[0],by=M.hs[1]-r*.85,br=r;if(u>=3.1){const e=bwCl((u-3.1)/.45,0,1),ee=e*e*(3-2*e),A=bwP3(g,s.bx,s.bz,0),ra=.21*A[2]*g.WL,ay2=A[1]-ra*.62;bx+=(A[0]-bx)*ee;by+=(ay2-by)*ee-Math.sin(ee*Math.PI)*18;br+=(ra-br)*ee}
     c.save();c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(bx,q[1]+4,br*.9,br*.3,0,0,6.283);c.fill();c.restore();bwBallAt(c,bx,by,br,u*6,th,th.art===1||th.art===2)}}});
  if(s.fl){const q=bwP(g,s.fl.x,s.fl.z),rr=g.WL*q[2]*(1.4-s.fl.t*.6);c.save();c.globalCompositeOperation='lighter';const fg=c.createRadialGradient(q[0],q[1]-rr*.2,2,q[0],q[1]-rr*.2,rr);fg.addColorStop(0,'rgba(255,255,255,'+s.fl.t*.8+')');fg.addColorStop(.4,'rgba('+th.gl+','+s.fl.t*.35+')');fg.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=fg;c.beginPath();c.arc(q[0],q[1]-rr*.2,rr,0,6.283);c.fill();c.restore()}
  if(s.barZ){const a=bwP(g,-1.15,s.barZ),b=bwP(g,1.15,s.barZ);c.lineCap='round';c.strokeStyle='#8b93a8';c.lineWidth=7*a[2];c.beginPath();c.moveTo(a[0],a[1]-6);c.lineTo(b[0],b[1]-6);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]-8);c.lineTo(b[0],b[1]-8);c.stroke()}
  // aim guide
  if(s.drag&&s.st==='aim'){const f=bwFlick(s.drag);if(f){let x=s.bx,vx=f.vx,pts=[];for(let z=s.bz,i=0;z<22;i++){vx+=f.sp*1.5*[1.25,1,.75][gxS().bwt||0]*Math.min(1,Math.max(0,(z-3)/10))*.045;x+=vx*.045;z+=f.vz*.045;pts.push([x,z])}pts.forEach((q,i)=>{if(i%2)return;const P=bwP(g,bwCl(q[0],-1.1,1.1),q[1]);c.fillStyle='rgba(255,255,255,'+(.8-i/pts.length*.7)+')';c.beginPath();c.arc(P[0],P[1],2.6*P[2]+.8,0,6.283);c.fill()})}}
  if(gxS().baim&&s.st==='aim'&&!s.drag&&s.dropT<=0){for(let z=s.bz+1.2;z<22;z+=.9){const P=bwP(g,s.bx,z);c.fillStyle='rgba(255,255,255,'+(.15+.2*Math.max(0,Math.sin(T*4-z*.5)))+')';c.beginPath();c.arc(P[0],P[1],2.2*P[2]+.6,0,6.283);c.fill()}}
  if(s.st==='aim'&&s.hint&&!s.drag&&s.dropT<=0){const k=(T%1.6)/1.6,q=bwP(g,s.bx,s.bz);c.globalAlpha=Math.sin(k*3.14);c.fillStyle='#fff';for(let i=0;i<3;i++){const yy=q[1]-.5*q[2]*g.WL-30-i*16-k*30;c.beginPath();c.moveTo(q[0],yy-9);c.lineTo(q[0]-10,yy+2);c.lineTo(q[0]+10,yy+2);c.closePath();c.fill()}c.globalAlpha=1}
  s.pp.forEach(q=>{q.l-=dtr*1.6;q.x+=q.vx*dtp;q.z+=q.vz*dtp;q.y+=q.vy*dtp;q.vy-=9*dtp;if(q.y<0){q.y=0;q.vy*=-.4}});s.pp=s.pp.filter(q=>q.l>0);s.pp.forEach(q=>{const P=bwP(g,q.x,q.z);c.fillStyle='rgba('+q.c+','+q.l+')';c.beginPath();c.arc(P[0],P[1]-q.y*P[2]*g.WL,q.r*P[2]+.5,0,6.283);c.fill()});
  c.restore();
  // ---------- overlay ----------
  s.cf.forEach(q=>{q.x+=q.vx*dtr;q.y+=q.vy*dtr;q.r+=q.vr*dtr;q.vy+=60*dtr});s.cf=s.cf.filter(q=>q.y<H+20);s.cf.forEach(q=>{c.save();c.translate(q.x,q.y);c.rotate(q.r);c.fillStyle=q.c;c.fillRect(-q.w/2,-q.w/4,q.w,q.w/2);c.restore()});
  if(s.flash>0){c.fillStyle='rgba(255,255,255,'+s.flash*.6+')';c.fillRect(0,0,W,H)}
  const vg=c.createRadialGradient(W/2,H*.55,H*.25,W/2,H*.55,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.38)');c.fillStyle=vg;c.fillRect(0,0,W,H);
  const F=bwScore(s.rolls);
  if(s.cpu){const bx=36,bw2=W-bx-4,Fc=bwScore(s.cpu.rolls);c.fillStyle='rgba(8,8,24,.74)';gxRR(c,4,4,W-8,50,10);c.fill();bwBoard(c,bx,4,bw2,50,F,s.st==='over'?-1:s.f,th,10);c.fillStyle='rgba(8,8,24,.74)';gxRR(c,4,56,W-8,38,10);c.fill();bwBoard(c,bx,56,bw2,38,Fc,s.st==='over'?-1:s.cpu.nf,th,8);
   c.textAlign='center';c.font='800 10px Tahoma,sans-serif';c.fillStyle=th.e2;c.fillText(oL('شما','YOU'),20,33);c.fillStyle='#ff9a9a';c.fillText(oL('حریف','CPU'),20,79);
   const cb=s.cpu.ban;if(cb&&s.st!=='over'){cb.t-=dtr;if(cb.t<=0)s.cpu.ban=null;else{const a=Math.min(1,cb.t*3,(2.6-cb.t)*5);c.save();c.globalAlpha=a;c.font='800 15px Tahoma,sans-serif';const tw=c.measureText(cb.tt).width+30,by=H*.27;c.fillStyle='rgba(20,10,40,.78)';gxRR(c,W/2-tw/2,by-18,tw,36,18);c.fill();c.strokeStyle=cb.c;c.lineWidth=1.5;c.stroke();c.fillStyle=cb.c;c.textAlign='center';c.fillText(cb.tt,W/2,by+5);c.restore()}}}
  else{c.fillStyle='rgba(8,8,24,.74)';gxRR(c,4,4,W-8,54,10);c.fill();bwBoard(c,4,4,W-8,54,F,s.st==='over'?-1:s.f,th,11)}
  if(s.tx){s.tx.t-=dtr;if(s.tx.t<=0)s.tx=null;else{const k=Math.min(1,(1.6-s.tx.t)*5),sc=.6+.4*(1-Math.pow(1-Math.min(1,k),3));c.save();c.translate(W/2,H*.5);c.scale(sc,sc);c.globalAlpha=Math.min(1,s.tx.t*2);c.textAlign='center';c.font='800 '+(s.tx.tt.length<8?44:28)+'px Tahoma,sans-serif';c.lineWidth=6;c.strokeStyle='rgba(20,10,40,.7)';c.shadowColor=s.tx.c;c.shadowBlur=22;c.strokeText(s.tx.tt,0,0);c.fillStyle=s.tx.c;c.fillText(s.tx.tt,0,0);c.restore()}}
  if(s.st==='intro'&&!s.skipMan&&s.it<3.2){c.fillStyle='rgba(255,255,255,.7)';c.font='600 11px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('برای رد کردن بزن','Tap to skip'),W/2,H-(XS.bwfs?54:12))}
  if(s.st==='aim'&&s.hint&&!s.drag&&s.dropT<=0){c.fillStyle='rgba(255,255,255,.95)';c.font='600 12px Tahoma,sans-serif';c.textAlign='center';c.shadowColor='#000';c.shadowBlur=4;c.fillText(oL('توپ رو بگیر، چپ و راست ببر، بعد تند بالا بکش','Hold the ball, slide sideways, then flick up fast'),W/2,H-(XS.bwfs?54:10));c.shadowBlur=0}
  if(XS.bwfs){const bw=(W-40)/3,labs=[[oL('شروع دوباره','Restart'),bwRestart],[oL('ثبت امتیاز','Save score'),bwSave],[oL('خروج','Exit'),()=>bwFs(false)]];s.tb=labs.map((l,i)=>({x:10+i*(bw+10),w:bw,f:l[1]}));labs.forEach((l,i)=>{const x=10+i*(bw+10);c.fillStyle='rgba(10,8,30,.7)';gxRR(c,x,H-46,bw,34,17);c.fill();c.strokeStyle=th.e1;c.globalAlpha=.7;c.lineWidth=1.2;c.stroke();c.globalAlpha=1;c.fillStyle='#fff';c.font='700 12px Tahoma,sans-serif';c.textAlign='center';c.fillText(l[0],x+bw/2,H-24)})}
  if(s.st==='over')bwFinal(c,g,s,th,dtr);
  return 1}};
function bwCtl(){const o=gxS(),cur=o.bt||0;return`<div class="row" style="gap:10px;margin-top:12px"><button class="btn o" style="flex:1" data-a="bwr">${oL('شروع دوباره','Restart')}</button><button class="btn o" style="flex:1" data-a="bwf">${oL('تمام‌صفحه','Fullscreen')}</button></div><button class="btn" style="width:100%;margin-top:10px" data-a="bws">${oL('ثبت امتیاز','Save score')}</button><div class="card" style="margin-top:12px"><h3>${oL('حریف','Opponent')}</h3><div class="chips">${[['بدون حریف','Solo'],['کامپیوتر آسان','CPU easy'],['کامپیوتر معمولی','CPU normal'],['کامپیوتر سخت','CPU hard']].map((e,i)=>`<button class="chip ${(o.bvs||0)===i?'on':''}" data-a="gxx" data-v="v:${i}">${oL(e[0],e[1])}</button>`).join('')}</div>${o.bwin?`<div class="mu" style="font-size:12px;margin-top:8px">${oL('رکورد مقابل کامپیوتر','Record vs CPU')}: ${fa(o.bwin.w)} ${oL('برد','W')} · ${fa(o.bwin.l)} ${oL('باخت','L')} · ${fa(o.bwin.d)} ${oL('مساوی','D')}</div>`:''}</div><div class="card" style="margin-top:12px"><h3>${oL('کمک بازی','Game help')}</h3><div class="chips"><button class="chip ${o.bbump?'on':''}" data-a="gxx" data-v="u:bbump">${oL('سپر ناودون','Gutter bumpers')}</button><button class="chip ${o.baim?'on':''}" data-a="gxx" data-v="u:baim">${oL('خط راهنما','Aim line')}</button><button class=\"chip ${o.bskip?'on':''}\" data-a=\"gxx\" data-v=\"u:bskip\">${oL('بدون نمایش بازیکن','Skip bowler intro')}</button></div><h3 style="margin-top:14px">${oL('وزن توپ','Ball weight')}</h3><div class="chips">${[['سبک','Light'],['متوسط','Medium'],['سنگین','Heavy']].map((x,i)=>`<button class="chip ${(o.bwt||0)===i?'on':''}" data-a="gxx" data-v="w:${i}">${oL(x[0],x[1])}</button>`).join('')}</div><div class="mu" style="margin-top:8px;line-height:1.9">${oL('توپ سبک بیشتر می‌چرخه، توپ سنگین مهره‌ها رو محکم‌تر می‌زنه.','A light ball hooks more; a heavy ball hits pins harder.')}</div></div><div class="card" style="margin-top:12px"><h3>${oL('تم زمین','Lane theme')}</h3><div class="chips">${BWT.map((x,i)=>`<button class="chip ${cur===i?'on':''}" data-a="gxx" data-v="b:${i}">${oL(x.n[0],x.n[1])}</button>`).join('')}</div><div class="mu" style="margin-top:10px;line-height:2">${oL('ده فریم، هر فریم دو پرتاب. انگشتت رو روی توپ بذار، چپ و راست ببر و بعد تند به بالا بکش. هرچی سریع‌تر بکشی، توپ تندتر می‌ره. اگه موقع کشیدن کمی منحنی بزنی، توپ می‌چرخه. استرایک و اسپر امتیاز اضافه دارن.','Ten frames, two throws each. Hold the ball, slide sideways, then flick up fast. A faster flick means a faster ball, and a slight curve in your swipe makes the ball hook. Strikes and spares earn bonus points.')}</div></div><div class="card"><h3>${oL('بهترین امتیازها','Best scores')}</h3><div id="bwls">${bwListHtml()}</div></div>`}

let bwNat=0;
function bwRestart(){const s=GX.st;if(!s)return;const th=s.th,b=s.best;GX.st=GXD.bwl.init();GX.st.th=th;GX.st.best=b;gxTone(262,.2,.04)}
function bwSave(){const s=GX.st;if(!s)return;if(!s.rolls.length){toast(oL('هنوز پرتابی نداشتی','You have not thrown yet'));return}
 if(s.savedN===s.rolls.length){toast(oL('این امتیاز قبلاً ثبت شده','This score is already saved'));return}
 const o=gxS(),F=bwScore(s.rolls),tot=bwTotal(s.rolls);o.bsc=o.bsc||[];o.bsc.unshift({d:iso(today()),s:tot,t:s.th,f:F.filter(f=>f.c!==null).length,x:F.filter(f=>f.m[0]==='X').length,ok:s.over?1:0});o.bsc=o.bsc.slice(0,40);s.savedN=s.rolls.length;gxSave();save();toast(oL('امتیاز ثبت شد: ','Score saved: ')+fa(tot));bwListUp()}
function bwListHtml(){const L=(gxS().bsc||[]).slice().sort((a,b)=>b.s-a.s).slice(0,6);if(!L.length)return`<div class="mu" style="line-height:2">${oL('هنوز امتیازی ثبت نشده. بعد از بازی «ثبت امتیاز» رو بزن.','No saved scores yet. Tap "Save score" after a game.')}</div>`;
 return L.map((q,i)=>`<div class="row" style="justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bd)"><span><b style="color:var(--pk)">${fa(i+1)}</b> &nbsp;${esc(oL((BWT[q.t]||BWT[0]).n[0],(BWT[q.t]||BWT[0]).n[1]))}${q.ok?'':' · '+oL('نیمه‌تموم','unfinished')}</span><span class="mu">${fa(q.x)} ${oL('استرایک','strikes')} · ${jf(parse(q.d),{day:'numeric',month:'short'})}</span><b>${fa(q.s)}</b></div>`).join('')+`<div class="row" style="margin-top:8px"><button class="chip" data-a="bwc">${oL('پاک کردن لیست','Clear list')}</button></div>`}
function bwListUp(){const e=document.getElementById('bwls');if(e)e.innerHTML=bwListHtml()}
function bwFs(on){XS.bwfs=on;const w=document.getElementById('gxw'),cv=document.getElementById('gxc');if(!w||!cv)return;
 if(on){w.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:9999;padding:0;margin:0;border-radius:0;background:#05030f;display:flex;align-items:center;justify-content:center';cv.style.borderRadius='0';document.body.style.overflow='hidden';try{const r=w.requestFullscreen||w.webkitRequestFullscreen;if(r){const q=r.call(w);q&&q.catch&&q.catch(()=>{})}}catch(e){}}
 else{w.style.cssText='padding:8px';cv.style.borderRadius='18px';document.body.style.overflow='';try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
 GX.keep=GX.st;setTimeout(()=>{if(GX.g==='bwl'||XS.gxg==='bwl')gxInit()},80)}
function bwFsOff(){if(XS.bwfs){XS.bwfs=false;document.body.style.overflow='';try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}}
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement)bwNat=1;else if(bwNat){bwNat=0;if(XS.bwfs)bwFs(false)}});
