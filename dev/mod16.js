/* ===== mod16: bowling (pseudo-3D lane, themes, real scoring) ===== */
const BWT=[
 {n:['کلاسیک','Classic'],wall:['#1d100a','#4a2a18'],lane:['#f0c48a','#c98a4a'],lane2:'#7a4a22',e1:'#ffd27a',e2:'#ffae42',gl:'255,196,110',ball:['#7db7ff','#17358a','#bcd8ff'],art:0,gut:'#2a1b12'},
 {n:['نئون','Neon'],wall:['#07031a','#1a0a3c'],lane:['#7a5cff','#2a1470'],lane2:'#150a40',e1:'#22e8ff',e2:'#ff3fd0',gl:'120,90,255',ball:['#ff6ad5','#5a1aa0','#7df3ff'],art:1,gut:'#0b0622'},
 {n:['فضا','Cosmic'],wall:['#030a1a','#0b2145'],lane:['#4f86c9','#12315f'],lane2:'#0a1b3a',e1:'#67e8f9',e2:'#a78bfa',gl:'90,190,255',ball:['#a5f3fc','#0e4f8a','#ffffff'],art:2,gut:'#050f22'},
 {n:['غروب','Sunset'],wall:['#240a1e','#5a1740'],lane:['#ffb27a','#c4506e'],lane2:'#6a2040',e1:'#ff6b9d',e2:'#ffd166',gl:'255,120,150',ball:['#ffd166','#c2255c','#fff1c1'],art:3,gut:'#2a0e22'}];
const BWPOS=[[0,0],[-.29,1],[.29,1],[-.58,2],[0,2],[.58,2],[-.87,3],[-.29,3],[.29,3],[.87,3]];
function bwGeo(){const W=GX.w,H=GX.h,K=.045,ZF=24;return{W,H,K,ZF,sF:1/(1+K*ZF),cx:W/2,WL:W*.37,yN:H*.835,yF:H*.4}}
function bwP(g,x,z){const s=1/(1+g.K*z);return[g.cx+x*s*g.WL,g.yF+(g.yN-g.yF)*(s-g.sF)/(1-g.sF),s]}
function bwScore(r){const F=[];let i=0,run=0,ok=true;for(let f=0;f<10;f++){const fr={m:[],s:null,c:null};F.push(fr);if(i>=r.length)continue;
 if(f<9){if(r[i]===10){fr.m=['X'];if(r[i+1]!==undefined&&r[i+2]!==undefined)fr.s=10+r[i+1]+r[i+2];i+=1}
  else{fr.m=[r[i]];if(r[i+1]!==undefined){const sp=r[i]+r[i+1]===10;fr.m.push(sp?'/':r[i+1]);if(sp){if(r[i+2]!==undefined)fr.s=10+r[i+2]}else fr.s=r[i]+r[i+1];i+=2}else i+=1}}
 else{const a=r[i],b=r[i+1],c=r[i+2];fr.m.push(a===10?'X':a);if(b!==undefined)fr.m.push(a===10?(b===10?'X':b):(a+b===10?'/':b));
  if(c!==undefined)fr.m.push(c===10?'X':(a===10&&b!==10&&b+c===10)?'/':c);
  const need=(a===10||(b!==undefined&&a+b===10))?3:2,have=[a,b,c].filter(v=>v!==undefined);if(have.length>=need)fr.s=have.reduce((x,y)=>x+y,0)}
 if(fr.s!==null&&ok){run+=fr.s;fr.c=run}else ok=false}
 return F}
function bwRack(s,drop){s.pins=BWPOS.map((q,i)=>({i,x:q[0],z:21.6+q[1]*.62,vx:0,vz:0,r:.15,st:0,a:0,dir:1,wob:0,fade:0,dy:drop?1+i*.06:0}));}
function bwAlive(s){return s.pins.filter(p=>p.st===0).length}
function bwTopple(s,p,vx){if(p.st!==0)return;p.st=1;p.a=0;p.dir=Math.abs(vx)>.05?(vx>0?1:-1):(Math.random()<.5?-1:1);s.pdown=(s.pdown||0)+1}
function bwSnd(s,f,v){const n=performance.now();if(n-s.hitT<45)return;s.hitT=n;gxTone(f,.09,v||.04);gxVib(8)}
function bwBurst(s,x,z,n,col){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=rnd(.5,3);s.pp.push({x,z,y:rnd(0,.3),vx:Math.cos(a)*v,vz:Math.sin(a)*v*.6,vy:rnd(1,3.5),l:1,c:col||'255,255,255',r:rnd(1,2.6)})}}
function bwStep(s,dt){const B=s.ball;
 if(B){B.t+=dt;if(!B.gut){B.vx+=B.sp*1.9*Math.min(1,Math.max(0,(B.z-3)/10))*dt;B.vz*=1-.012*dt}B.x+=B.vx*dt;B.z+=B.vz*dt;B.rot+=B.vz*dt*2.6;
  if(!B.gut&&Math.abs(B.x)>1.07){B.gut=B.x>0?1:-1;B.vx=0;s.gutter=1;bwSnd(s,120,.05)}
  if(B.gut)B.x+=(B.gut*1.13-B.x)*Math.min(1,dt*12);
  if(!B.gut)s.pins.forEach(p=>{if(p.st===2||B.z<19.5)return;const dx=p.x-B.x,dz=p.z-B.z,d=Math.hypot(dx,dz),m=B.r+p.r;if(d<m&&d>1e-4){const nx=dx/d,nz=dz/d,rel=(p.vx-B.vx)*nx+(p.vz-B.vz)*nz;if(rel<0){const e=.5,j=-(1+e)*rel/(1/8+1/1.5);B.vx-=j/8*nx;B.vz-=j/8*nz;p.vx+=j/1.5*nx;p.vz+=j/1.5*nz;const sp=-rel;if(p.st===0){if(sp>.8){bwTopple(s,p,p.vx);bwBurst(s,p.x,p.z,5,'255,240,200');s.shake=Math.max(s.shake,Math.min(7,sp*.5));bwSnd(s,260+rnd(0,500),.05)}else{p.wob=1;bwSnd(s,200,.03)}}}
    const o=m-d;p.x+=nx*o;p.z+=nz*o}});
  if(B.z>26)s.ball=null}
 const P=s.pins;
 for(let i=0;i<P.length;i++){const a=P[i];if(a.st===2)continue;
  for(let j=i+1;j<P.length;j++){const b=P[j];if(b.st===2)continue;if(a.st===0&&b.st===0&&Math.abs(a.vx)+Math.abs(a.vz)+Math.abs(b.vx)+Math.abs(b.vz)<.01)continue;
   const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),m=.3;if(d<m&&d>1e-4){const nx=dx/d,nz=dz/d,rel=(b.vx-a.vx)*nx+(b.vz-a.vz)*nz;if(rel<0){const j2=-(1.55)*rel/2;a.vx-=j2*nx;a.vz-=j2*nz;b.vx+=j2*nx;b.vz+=j2*nz;const sp=-rel;[a,b].forEach(q=>{if(q.st===0&&sp>.9){bwTopple(s,q,q.vx);bwSnd(s,300+rnd(0,500),.04)}})}const o=(m-d)/2;a.x-=nx*o;a.z-=nz*o;b.x+=nx*o;b.z+=nz*o}}}
 P.forEach(p=>{if(p.st===2){p.fade=Math.min(1,p.fade+dt*3);return}
  if(p.st===1){p.a=Math.min(1,p.a+dt*3.2);const k=p.a>=1?3.8:1.2;p.vx*=Math.max(0,1-k*dt);p.vz*=Math.max(0,1-k*dt)}else{p.vx*=Math.max(0,1-3*dt);p.vz*=Math.max(0,1-3*dt)}
  if(p.wob>0)p.wob=Math.max(0,p.wob-dt*1.6);p.x+=p.vx*dt;p.z+=p.vz*dt;
  if(p.z>24.6||Math.abs(p.x)>1.28){if(p.st===0)bwTopple(s,p,p.vx);p.st=2;p.fade=0;p.vx=p.vz=0}});
 }
function bwAfter(s,knocked,before){const r=knocked;s.rolls.push(r);let reset=false,done=false;const L=s.rolls;
 if(s.f<9){if((s.k===0&&r===10)||s.k===1){s.f++;s.k=0;reset=true}else s.k=1}
 else{if(s.k===0){s.k=1;reset=(r===10)}else if(s.k===1){const a=L[L.length-2];if(a===10||a+r===10){s.k=2;reset=(a===10&&r===10)||(a!==10&&a+r===10)}else done=true}else done=true}
 s.reset=reset;return done}
function bwFlick(d){const A=d.pts;if(A.length<3)return null;let mi=0;A.forEach((q,i)=>{if(q.y>=A[mi].y)mi=i});const U=A.slice(mi);if(U.length<3)return null;const e=U[U.length-1];let i=U.length-1;while(i>0&&e.t-U[i-1].t<150)i--;const a=U[i],dt=Math.max(16,e.t-a.t)/1000,dy=a.y-e.y,dx=e.x-a.x;if(dy<20)return null;const sp=dy/dt;if(sp<150)return null;
 const k=Math.min(1,(sp-150)/1700),f=U[0],m=U[U.length>>1],tot=Math.max(50,f.y-e.y),cur=(e.x-2*m.x+f.x)/tot,ang=Math.max(-.6,Math.min(.6,dx/dy));
 return{vz:13+k*12,vx:ang*(13+k*12)*.26,sp:Math.max(-1,Math.min(1,cur*2.4)),k}}
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
function bwPinDraw(c,g,p,th,lift){const q=bwP(g,p.x,p.z),u=q[2]*g.WL*1.08,al=p.st===2?1-p.fade:1;if(al<=0)return;const oy=-p.dy*g.H*.7-lift*26*q[2];
 c.save();c.globalAlpha=al;c.fillStyle='rgba(0,0,0,'+(.3*(1-Math.min(1,p.dy)))+')';c.beginPath();c.ellipse(q[0],q[1]+1,.17*u,.05*u,0,0,6.283);c.fill();
 c.translate(q[0],q[1]+oy);const tilt=p.st===1?p.dir*p.a*1.5:Math.sin(performance.now()/60)*p.wob*.1*p.dir;c.rotate(tilt);
 c.beginPath();c.moveTo(-.12*u,0);c.bezierCurveTo(-.2*u,-.1*u,-.19*u,-.28*u,-.1*u,-.45*u);c.bezierCurveTo(-.05*u,-.55*u,-.07*u,-.62*u,-.09*u,-.7*u);c.bezierCurveTo(-.12*u,-.8*u,-.07*u,-.95*u,0,-.95*u);c.bezierCurveTo(.07*u,-.95*u,.12*u,-.8*u,.09*u,-.7*u);c.bezierCurveTo(.07*u,-.62*u,.05*u,-.55*u,.1*u,-.45*u);c.bezierCurveTo(.19*u,-.28*u,.2*u,-.1*u,.12*u,0);c.closePath();
 const gr=c.createLinearGradient(-.2*u,0,.2*u,0);gr.addColorStop(0,'#c9d1e0');gr.addColorStop(.45,'#ffffff');gr.addColorStop(1,'#9aa5bb');c.fillStyle=gr;c.fill();if(th.art){c.strokeStyle='rgba('+th.gl+',.45)';c.lineWidth=Math.max(1.5,.05*u);c.stroke()}
 c.save();c.clip();c.fillStyle='#e11d2e';c.fillRect(-.2*u,-.66*u,.4*u,.045*u);c.fillRect(-.2*u,-.74*u,.4*u,.03*u);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-.12*u,-.9*u,.04*u,.7*u);c.restore();
 c.strokeStyle='rgba(20,20,40,.45)';c.lineWidth=Math.max(.6,.012*u);c.stroke();c.restore()}
function bwBallDraw(c,g,B,th,pop){const q=bwP(g,B.x,B.z),r=B.r*q[2]*g.WL*(pop||1),drop=B.gut?r*.35:0,cy=q[1]-r*.55+drop;
 c.save();c.globalAlpha=.22;c.fillStyle=th.ball[0];c.beginPath();c.ellipse(q[0],q[1]+r*.35,r*.8,r*.55,0,0,6.283);c.fill();c.globalAlpha=1;c.fillStyle='rgba(0,0,0,.38)';c.beginPath();c.ellipse(q[0],q[1]+drop*.2,r*1.05,r*.34,0,0,6.283);c.fill();
 if(th.art===1||th.art===2){c.globalCompositeOperation='lighter';const h=c.createRadialGradient(q[0],cy,r*.5,q[0],cy,r*2.2);h.addColorStop(0,'rgba('+th.gl+',.35)');h.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=h;c.beginPath();c.arc(q[0],cy,r*2.2,0,6.283);c.fill();c.globalCompositeOperation='source-over'}
 const gr=c.createRadialGradient(q[0]-r*.4,cy-r*.45,r*.08,q[0],cy,r*1.1);gr.addColorStop(0,th.ball[0]);gr.addColorStop(.7,th.ball[1]);gr.addColorStop(1,'#05060f');c.fillStyle=gr;c.beginPath();c.arc(q[0],cy,r,0,6.283);c.fill();
 c.save();c.beginPath();c.arc(q[0],cy,r,0,6.283);c.clip();for(let k=0;k<3;k++){const a=B.rot+k*2.094,cs=Math.cos(a);if(cs>0){c.strokeStyle='rgba(255,255,255,'+(.22*cs)+')';c.lineWidth=Math.max(1,r*.2*cs);c.beginPath();c.ellipse(q[0],cy+Math.sin(a)*r*.85,r*1.05,r*.28*cs,0,0,6.283);c.stroke()}}
 [[-.22,.0],[.18,-.05],[0,.28]].forEach((h,i)=>{const a=B.rot*.9+1.2,cs=Math.cos(a+h[1]*2);if(cs>0){c.fillStyle='rgba(5,5,20,.85)';c.beginPath();c.ellipse(q[0]+h[0]*r*1.6,cy+Math.sin(a+h[1])*r*.7,r*.13,r*.13*cs,0,0,6.283);c.fill()}});c.restore();
 c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.ellipse(q[0]-r*.38,cy-r*.45,r*.24,r*.13,-.7,0,6.283);c.fill();c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=1;c.beginPath();c.arc(q[0],cy,r-.5,0,6.283);c.stroke();c.restore()}
GXD.bwl={
 init(){const s={th:gxS().bt||0,rolls:[],f:0,k:0,st:'aim',bx:0,bz:-1.4,ball:null,pins:[],t:0,pp:[],cf:[],tx:null,shake:0,flash:0,hint:1,over:0,best:gxS().bbest||0,drag:null,hitT:0,pop:0,settle:0,sw:0,reset:false,before:10,gutter:0,pdown:0,rumble:0,stars:Array.from({length:46},()=>[Math.random(),Math.random(),rnd(.8,2),rnd(1,3)])};bwRack(s,true);s.dropT=.9;return s},
 pt(p){const g=bwGeo(),s=GX.st,z=s.bz,q=bwP(g,0,z);return Math.max(-.88,Math.min(.88,(p.x-g.cx)/(q[2]*g.WL)))},
 down(p){const s=GX.st;if(XS.bwfs&&s.tb){const g0=bwGeo();if(p.y>g0.H-52){const b=s.tb.find(q=>p.x>=q.x&&p.x<=q.x+q.w);if(b)b.f();return}}if(s.over){if(performance.now()-s.over>700){const th=s.th,b=s.best;GX.st=GXD.bwl.init();GX.st.th=th;GX.st.best=b}return}if(s.st!=='aim'||s.dropT>0)return;const g=bwGeo();if(p.y<g.H*.5)return;s.drag={pts:[{x:p.x,y:p.y,t:performance.now()}],y0:p.y};s.bx=GXD.bwl.pt(p);gxTone(330,.1,.03)},
 move(p){const s=GX.st,d=s.drag;if(!d)return;const g=bwGeo(),n=performance.now();d.pts.push({x:p.x,y:p.y,t:n});if(d.pts.length>60)d.pts.shift();let low=d.pts[0].y;d.pts.forEach(q=>{low=Math.max(low,q.y)});const up=Math.max(0,low-p.y);s.bz=Math.min(.2,-1.4+up/(g.H*.12)*1.6);s.bx=GXD.bwl.pt(p)},
 up(){const s=GX.st;if(!s||!s.drag)return;const d=s.drag;s.drag=null;const f=bwFlick(d);if(!f){s.bz=-1.4;return}
  s.ball={x:s.bx,z:s.bz,vx:f.vx,vz:f.vz,sp:f.sp,r:.21,rot:0,gut:0,t:0};s.st='roll';s.before=bwAlive(s);s.hint=0;s.gutter=0;s.pdown=0;gxTone(180,.5,.04);gxVib(12)},
 draw(t,dt){const c=GX.cx,s=GX.st,g=bwGeo(),W=g.W,H=g.H,th=BWT[s.th]||BWT[0],T=t/1000;s.t=T;
  // ---- simulation ----
  s.shake=Math.max(0,s.shake-dt*18);s.flash=Math.max(0,s.flash-dt*1.6);if(s.dropT>0)s.dropT=Math.max(0,s.dropT-dt);s.pins.forEach(p=>{if(p.dy>0)p.dy=Math.max(0,p.dy-dt*1.9)});if(s.pop<1)s.pop=Math.min(1,s.pop+dt*4);
  if(s.st==='roll'||s.st==='settle'){let n=Math.max(1,Math.ceil(dt/.004)),h=dt/n;for(let i=0;i<n;i++)bwStep(s,h);if(s.ball){s.rumble-=dt;if(s.rumble<=0&&!s.ball.gut){s.rumble=.16;gxTone(70+s.ball.vz*2,.2,.025)}}}
  if(s.st==='roll'&&!s.ball){s.st='settle';s.settle=0}
  else if(s.st==='settle'){s.settle+=dt;const mv=s.pins.some(p=>p.st!==2&&(Math.abs(p.vx)+Math.abs(p.vz)>.18));if((s.settle>.7&&!mv)||s.settle>3.2){const al=bwAlive(s),kn=s.before-al,strike=s.before===10&&kn===10,spare=!strike&&al===0&&kn>0;const done=bwAfter(s,kn,s.before);
     if(strike){s.tx={t:1.6,tt:oL('استرایک!','STRIKE!'),c:'#ffd24a'};s.flash=.5;s.shake=9;for(let i=0;i<70;i++)s.cf.push({x:rnd(0,W),y:rnd(-40,0),vx:rnd(-40,40),vy:rnd(60,180),r:rnd(0,6.28),vr:rnd(-8,8),c:['#ffd24a','#ff6b9d','#22e8ff','#a78bfa','#7ee787'][i%5],w:rnd(4,8)});[523,659,784,1047].forEach((f,i)=>setTimeout(()=>gxTone(f,.3,.06),i*110));gxVib(40)}
     else if(spare){s.tx={t:1.4,tt:oL('اسپر!','SPARE!'),c:'#7cf0ff'};s.flash=.25;for(let i=0;i<36;i++)s.cf.push({x:rnd(0,W),y:rnd(-30,0),vx:rnd(-30,30),vy:rnd(60,150),r:rnd(0,6.28),vr:rnd(-8,8),c:['#7cf0ff','#fff','#ffd24a'][i%3],w:rnd(4,7)});[523,659,784].forEach((f,i)=>setTimeout(()=>gxTone(f,.25,.05),i*100))}
     else if(kn===0){s.tx={t:1.3,tt:s.gutter?oL('ناکام! توپ تو ناودونی رفت','Gutter ball!'):oL('ناکام','Miss'),c:'#ff9a9a'};gxTone(150,.4,.05)}
     else s.tx={t:1.1,tt:fa(kn)+' '+oL('مهره','pins'),c:'#fff'};
     s.done=done;s.st='sweep';s.sw=0;s.trail=[]}}
  else if(s.st==='sweep'){s.sw+=dt;const k=s.sw;s.pins.forEach(p=>{if(p.st===1&&k>.25+(24-p.z)*.0){}});
   s.pins.forEach(p=>{if(p.st===2)p.fade=Math.min(1,p.fade+dt*3)});const bz=18.5+Math.min(1,Math.max(0,(k-.45)/.7))*7;s.barZ=bz;s.pins.forEach(p=>{if(p.st===1&&p.z>=bz-.2-0&&k>.45){}});
   if(k>.45&&k<1.15)s.pins.forEach(p=>{if((p.st===1||s.reset)&&p.st!==2&&p.z<=bz+.3){if(p.st===1){p.st=2;p.fade=0}}});
   if(k>1.15&&!s.swept){s.swept=1;s.pins=s.pins.filter(p=>p.st===0||s.reset);if(s.reset)s.pins.forEach(p=>{p.st=2;p.fade=0})}
   if(k>1.7){s.swept=0;s.barZ=null;if(s.done){s.st='over';s.over=performance.now();const tot=(bwScore(s.rolls).filter(f=>f.c!==null).pop()||{c:0}).c;s.total=tot;if(tot>s.best){s.best=tot;gxS().bbest=tot;gxSave()}gxTone(392,.5,.05);setTimeout(()=>gxTone(523,.6,.05),180)}else{if(s.reset){bwRack(s,true);s.dropT=.9;gxTone(120,.3,.04)}s.pins.forEach(p=>{p.vx=p.vz=0});s.st='aim';s.bz=-1.4;s.pop=0;s.bx=0;s.reset=false}}}
  // ---- render ----
  c.save();if(s.shake>.2)c.translate(rnd(-s.shake,s.shake)*.5,rnd(-s.shake,s.shake)*.5);
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,th.wall[0]);bg.addColorStop(1,th.wall[1]);c.fillStyle=bg;c.fillRect(-10,-10,W+20,H+20);
  // side walls (panels in perspective)
  for(const sd of[-1,1]){for(let zi=-1;zi<8;zi++){const z0=-1.6+zi*3.3+3.3*0,z1=z0+3.3;if(z1<-1.6)continue;const a=bwP(g,sd*1.62,Math.max(-1.6,z0)),b=bwP(g,sd*1.62,z1),ha=1.5*a[2]*g.WL,hb=1.5*b[2]*g.WL;const pulse=.5+.5*Math.sin(T*2.2-zi*.7);c.fillStyle=zi%2?'rgba(255,255,255,.05)':'rgba(0,0,0,.18)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[0],a[1]-ha);c.lineTo(b[0],b[1]-hb);c.lineTo(b[0],b[1]);c.closePath();c.fill();
    c.lineCap='round';c.strokeStyle='rgba('+th.gl+','+(.12+.2*pulse)+')';c.lineWidth=Math.max(3,9*b[2]);c.beginPath();c.moveTo(b[0],b[1]-hb*.12);c.lineTo(b[0],b[1]-hb*.88);c.stroke();c.strokeStyle='rgba('+th.gl+','+(.5+.5*pulse)+')';c.lineWidth=Math.max(1,3*b[2]);c.stroke()}}
  // floor outside + gutters
  for(const sd of[-1,1]){const a=bwP(g,sd*1.0,-1.6),b=bwP(g,sd*1.0,24),a2=bwP(g,sd*1.62,-1.6),b2=bwP(g,sd*1.62,24);c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b2[0],b2[1]);c.lineTo(a2[0],a2[1]);c.closePath();c.fill();
   const g1=bwP(g,sd*1.0,-1.6),g2=bwP(g,sd*1.0,24),g3=bwP(g,sd*1.2,24),g4=bwP(g,sd*1.2,-1.6);const gg=c.createLinearGradient(g1[0],0,g4[0],0);gg.addColorStop(0,'#000');gg.addColorStop(1,th.gut);c.fillStyle=th.gut;c.beginPath();c.moveTo(g1[0],g1[1]);c.lineTo(g2[0],g2[1]);c.lineTo(g3[0],g3[1]);c.lineTo(g4[0],g4[1]);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.45)';c.fill()}
  // lane body
  const L1=bwP(g,-1,-1.6),L2=bwP(g,1,-1.6),L3=bwP(g,1,24),L4=bwP(g,-1,24);const lg=c.createLinearGradient(0,g.yF,0,g.yN+H*.1);lg.addColorStop(0,th.lane[1]);lg.addColorStop(.55,th.lane[0]);lg.addColorStop(1,th.lane[1]);c.fillStyle=lg;c.beginPath();c.moveTo(L1[0],L1[1]);c.lineTo(L2[0],L2[1]);c.lineTo(L3[0],L3[1]);c.lineTo(L4[0],L4[1]);c.closePath();c.fill();
  c.save();c.clip();for(let i=0;i<20;i++){const x0=-1+i*.1,a=bwP(g,x0,-1.6),b=bwP(g,x0+.1,-1.6),d=bwP(g,x0+.1,24),e=bwP(g,x0,24);c.fillStyle=i%2?'rgba(0,0,0,.07)':'rgba(255,255,255,.05)';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.fill();c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(e[0],e[1]);c.stroke()}
   // approach
   const ap1=bwP(g,-1,-1.6),ap2=bwP(g,1,-1.6),ap3=bwP(g,1,0),ap4=bwP(g,-1,0);c.fillStyle='rgba(255,255,255,.1)';c.beginPath();c.moveTo(ap1[0],ap1[1]);c.lineTo(ap2[0],ap2[1]);c.lineTo(ap3[0],ap3[1]);c.lineTo(ap4[0],ap4[1]);c.fill();
   // arrows + dots
   c.fillStyle='rgba(30,10,0,.45)';[-.7,-.4,-.15,0,.15,.4,.7].forEach((x,i)=>{const zz=4+Math.abs(x)*-4+3.4,a=bwP(g,x,zz),b=bwP(g,x-.06,zz-.9),d=bwP(g,x+.06,zz-.9);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.fill()});
   [-.7,-.4,-.15,.15,.4,.7].forEach(x=>{const a=bwP(g,x,-.6);c.fillStyle='rgba(30,10,0,.35)';c.beginPath();c.arc(a[0],a[1],2.2*a[2],0,6.283);c.fill()});
   // gloss + lamps
   const gl=c.createLinearGradient(0,g.yF,0,g.yN);gl.addColorStop(0,'rgba(255,255,255,.28)');gl.addColorStop(.5,'rgba(255,255,255,.04)');gl.addColorStop(1,'rgba(255,255,255,.2)');c.fillStyle=gl;c.fillRect(0,g.yF,W,g.yN-g.yF+H*.12);
   c.globalCompositeOperation='lighter';[3,8,13,18].forEach((z,i)=>{const q=bwP(g,Math.sin(T*.6+i)*.15,z),rr=g.WL*q[2]*.95,gr=c.createRadialGradient(q[0],q[1],2,q[0],q[1],rr);gr.addColorStop(0,'rgba('+th.gl+','+(.32+.1*Math.sin(T*2+i))+')');gr.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=gr;c.beginPath();c.ellipse(q[0],q[1],rr,rr*.28,0,0,6.283);c.fill()});c.globalCompositeOperation='source-over';
   // foul line
   const f1=bwP(g,-1,0),f2=bwP(g,1,0);c.strokeStyle='#e11d2e';c.lineWidth=3;c.shadowColor='#ff3b4a';c.shadowBlur=6;c.beginPath();c.moveTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.stroke();c.shadowBlur=0;c.restore();
  // edge LED chase
  for(const sd of[-1,1]){const col=sd<0?th.e1:th.e2;for(let i=0;i<34;i++){const z=-1.6+i*.78,q=bwP(g,sd*1.0,z),on=.35+.65*Math.max(0,Math.sin(T*5-i*.5)),rr=Math.max(1.2,3.2*q[2]);c.fillStyle=col;c.globalAlpha=on*.3;c.beginPath();c.arc(q[0],q[1],rr*2.4,0,6.283);c.fill();c.globalAlpha=on;c.beginPath();c.arc(q[0],q[1],rr,0,6.283);c.fill()}c.globalAlpha=1;
   const a=bwP(g,sd*1.0,-1.6),b=bwP(g,sd*1.0,24);c.strokeStyle=col;c.globalAlpha=.55;c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.globalAlpha=1}
  // pit + masking unit
  const p1=bwP(g,-1.2,24),p2=bwP(g,1.2,24),pitTop=g.yF-H*.05;const pg=c.createLinearGradient(0,pitTop,0,p1[1]);pg.addColorStop(0,'#000');pg.addColorStop(1,'#0b0b14');c.fillStyle=pg;c.beginPath();c.moveTo(p1[0]-4,p1[1]);c.lineTo(p1[0]+3,pitTop);c.lineTo(p2[0]-3,pitTop);c.lineTo(p2[0]+4,p2[1]);c.closePath();c.fill();
  const hg=c.createRadialGradient(g.cx,g.yF-H*.02,4,g.cx,g.yF-H*.02,g.WL*.7);hg.addColorStop(0,'rgba('+th.gl+',.28)');hg.addColorStop(1,'rgba('+th.gl+',0)');c.fillStyle=hg;c.fillRect(0,g.yF-H*.15,W,H*.2);
  bwArt(c,T,th,8,62,W-16,Math.max(70,pitTop-62-4),s);
  const bar=c.createLinearGradient(0,pitTop-8,0,pitTop);bar.addColorStop(0,'#3b3f52');bar.addColorStop(1,'#14161f');c.fillStyle=bar;gxRR(c,10,pitTop-8,W-20,9,4);c.fill();
  // drawables sorted far -> near
  const D=[];s.pins.forEach(p=>D.push({z:p.z,k:0,p}));if(s.ball)D.push({z:s.ball.z,k:1});else if(s.st==='aim'&&!s.over)D.push({z:s.bz,k:2});D.sort((a,b)=>b.z-a.z);
  const lift=s.st==='sweep'?Math.sin(Math.min(1,s.sw/1.7)*Math.PI)*1:0;
  D.forEach(d=>{if(d.k===0)bwPinDraw(c,g,d.p,th,d.p.st===0?lift:0);else if(d.k===1){const B=s.ball;s.trail=s.trail||[];s.trail.push([B.x,B.z]);if(s.trail.length>16)s.trail.shift();s.trail.forEach((t2,i)=>{const P=bwP(g,t2[0],t2[1]),a=i/s.trail.length;c.fillStyle='rgba('+th.gl+','+(a*.35)+')';c.beginPath();c.ellipse(P[0],P[1]-2,B.r*P[2]*g.WL*a*.9,B.r*P[2]*g.WL*a*.3,0,0,6.283);c.fill()});bwBallDraw(c,g,B,th,1)}else{const e=1-Math.pow(1-s.pop,3),B={x:s.bx,z:s.bz,r:.21,rot:s.bz*5+s.bx*2};bwBallDraw(c,g,B,th,.5+.5*e)}});
  if(s.barZ){const a=bwP(g,-1.15,s.barZ),b=bwP(g,1.15,s.barZ);c.strokeStyle='#8b93a8';c.lineWidth=7*a[2];c.lineCap='round';c.beginPath();c.moveTo(a[0],a[1]-6);c.lineTo(b[0],b[1]-6);c.stroke();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]-8);c.lineTo(b[0],b[1]-8);c.stroke()}
  // aim guide
  if(s.drag&&s.st==='aim'){const f=bwFlick(s.drag),q0=bwP(g,s.bx,s.bz);if(f){let x=s.bx,vx=f.vx,pts=[];for(let z=s.bz,i=0;z<22;i++){vx+=f.sp*1.9*Math.min(1,Math.max(0,(z-3)/10))*.045;x+=vx*.045;z+=f.vz*.045;pts.push([x,z])}pts.forEach((q,i)=>{if(i%2)return;const P=bwP(g,Math.max(-1.1,Math.min(1.1,q[0])),q[1]);c.fillStyle='rgba(255,255,255,'+(.8-i/pts.length*.7)+')';c.beginPath();c.arc(P[0],P[1],2.6*P[2]+.8,0,6.283);c.fill()})}}
  // particles
  s.pp.forEach(q=>{q.l-=dt*1.6;q.x+=q.vx*dt;q.z+=q.vz*dt;q.y+=q.vy*dt;q.vy-=9*dt;if(q.y<0){q.y=0;q.vy*=-.4}});s.pp=s.pp.filter(q=>q.l>0);s.pp.forEach(q=>{const P=bwP(g,q.x,q.z);c.fillStyle='rgba('+q.c+','+q.l+')';c.beginPath();c.arc(P[0],P[1]-q.y*P[2]*g.WL,q.r*P[2]+.5,0,6.283);c.fill()});
  c.restore();
  // ---- overlay (no shake): confetti, flash, scoreboard, popups ----
  s.cf.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=q.vr*dt;q.vy+=60*dt});s.cf=s.cf.filter(q=>q.y<H+20);s.cf.forEach(q=>{c.save();c.translate(q.x,q.y);c.rotate(q.r);c.fillStyle=q.c;c.fillRect(-q.w/2,-q.w/4,q.w,q.w/2);c.restore()});
  if(s.flash>0){c.fillStyle='rgba(255,255,255,'+s.flash*.6+')';c.fillRect(0,0,W,H)}
  const F=bwScore(s.rolls),fw=(W-10)/10;c.fillStyle='rgba(8,8,24,.72)';gxRR(c,4,4,W-8,54,10);c.fill();
  for(let i=0;i<10;i++){const x=5+i*fw,cur=(i===s.f&&!s.over);c.strokeStyle=cur?th.e1:'rgba(255,255,255,.18)';c.lineWidth=cur?2:1;if(cur){c.shadowColor=th.e1;c.shadowBlur=8}c.strokeRect(x+1.5,7,fw-3,48);c.shadowBlur=0;const fr=F[i],nm=i===9?3:2,bw=(fw-3)/nm;
   c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.beginPath();c.moveTo(x+1.5,22);c.lineTo(x+fw-1.5,22);c.stroke();for(let j=1;j<nm;j++){c.beginPath();c.moveTo(x+1.5+bw*j,7);c.lineTo(x+1.5+bw*j,22);c.stroke()}
   c.fillStyle='#fff';c.textAlign='center';c.font='800 11px Tahoma,sans-serif';fr.m.forEach((m,j)=>{const v=m===0?'-':(typeof m==='number'?fa(m):m);c.fillStyle=(m==='X'||m==='/')?th.e2:'#fff';c.fillText(v,x+1.5+bw*(j+.5),19)});
   c.fillStyle='#fff';c.font='800 14px Tahoma,sans-serif';if(fr.c!==null)c.fillText(fa(fr.c),x+fw/2,45);else{c.fillStyle='rgba(255,255,255,.35)';c.font='600 9px Tahoma,sans-serif';c.fillText(fa(i+1),x+fw/2,45)}}
  if(s.tx){s.tx.t-=dt;if(s.tx.t<=0)s.tx=null;else{const k=Math.min(1,(1.6-s.tx.t)*5),sc=.6+.4*(1-Math.pow(1-Math.min(1,k),3))+(s.tx.tt.length<4?0:0);c.save();c.translate(W/2,H*.5);c.scale(sc,sc);c.globalAlpha=Math.min(1,s.tx.t*2);c.textAlign='center';c.font='800 '+(s.tx.tt.length<6?44:28)+'px Tahoma,sans-serif';c.lineWidth=6;c.strokeStyle='rgba(20,10,40,.7)';c.shadowColor=s.tx.c;c.shadowBlur=22;c.strokeText(s.tx.tt,0,0);c.fillStyle=s.tx.c;c.fillText(s.tx.tt,0,0);c.restore()}}
  if(s.st==='aim'&&s.hint&&!s.drag&&s.dropT<=0){const k=(T%1.6)/1.6,q=bwP(g,s.bx,s.bz);c.globalAlpha=Math.sin(k*3.14);c.fillStyle='#fff';for(let i=0;i<3;i++){const yy=q[1]-30-i*16-k*30;c.beginPath();c.moveTo(q[0],yy-9);c.lineTo(q[0]-10,yy+2);c.lineTo(q[0]+10,yy+2);c.closePath();c.fill()}c.globalAlpha=1;c.fillStyle='rgba(255,255,255,.95)';c.font='600 12px Tahoma,sans-serif';c.textAlign='center';c.shadowColor='#000';c.shadowBlur=4;c.fillText(oL('توپ رو بگیر، چپ و راست ببر، بعد تند بالا بکش','Hold the ball, slide sideways, then flick up fast'),W/2,H-(XS.bwfs?54:10));c.shadowBlur=0}
  if(XS.bwfs){const bw=(W-40)/3,labs=[[oL('شروع دوباره','Restart'),bwRestart],[oL('ثبت امتیاز','Save score'),bwSave],[oL('خروج','Exit'),()=>bwFs(false)]];s.tb=labs.map((l,i)=>({x:10+i*(bw+10),w:bw,f:l[1]}));labs.forEach((l,i)=>{const x=10+i*(bw+10);c.fillStyle='rgba(10,8,30,.7)';gxRR(c,x,H-46,bw,34,17);c.fill();c.strokeStyle=th.e1;c.globalAlpha=.7;c.lineWidth=1.2;c.stroke();c.globalAlpha=1;c.fillStyle='#fff';c.font='700 12px Tahoma,sans-serif';c.textAlign='center';c.fillText(l[0],x+bw/2,H-24)})}
  if(s.over){c.fillStyle='rgba(8,6,24,.72)';c.fillRect(0,0,W,H);c.textAlign='center';c.fillStyle='#fff';c.font='800 28px Tahoma,sans-serif';c.fillText(oL('بازی تموم شد','Game over'),W/2,H*.4);c.font='800 44px Tahoma,sans-serif';c.fillStyle=th.e2;c.fillText(fa(s.total||0),W/2,H*.5);c.font='600 15px Tahoma,sans-serif';c.fillStyle='#ffe08a';c.fillText(oL('بهترین','Best')+': '+fa(s.best),W/2,H*.56);const st=F.filter(f=>f.m[0]==='X').length;c.fillStyle='rgba(255,255,255,.85)';c.fillText(oL('تعداد استرایک','Strikes')+': '+fa(st),W/2,H*.62);c.fillText(oL('برای شروع دوباره بزن','Tap to play again'),W/2,H*.72)}
  return 1}};

function bwCtl(){const o=gxS(),cur=o.bt||0;return`<div class="row" style="gap:10px;margin-top:12px"><button class="btn o" style="flex:1" data-a="bwr">${oL('شروع دوباره','Restart')}</button><button class="btn o" style="flex:1" data-a="bwf">${oL('تمام‌صفحه','Fullscreen')}</button></div><button class="btn" style="width:100%;margin-top:10px" data-a="bws">${oL('ثبت امتیاز','Save score')}</button><div class="card" style="margin-top:12px"><h3>${oL('تم زمین','Lane theme')}</h3><div class="chips">${BWT.map((x,i)=>`<button class="chip ${cur===i?'on':''}" data-a="gxx" data-v="b:${i}">${oL(x.n[0],x.n[1])}</button>`).join('')}</div><div class="mu" style="margin-top:10px;line-height:2">${oL('ده فریم، هر فریم دو پرتاب. انگشتت رو روی توپ بذار، چپ و راست ببر و بعد تند به بالا بکش. هرچی سریع‌تر بکشی، توپ تندتر می‌ره. اگه موقع کشیدن کمی منحنی بزنی، توپ می‌چرخه. استرایک و اسپر امتیاز اضافه دارن.','Ten frames, two throws each. Hold the ball, slide sideways, then flick up fast. A faster flick means a faster ball, and a slight curve in your swipe makes the ball hook. Strikes and spares earn bonus points.')}</div></div><div class="card"><h3>${oL('بهترین امتیازها','Best scores')}</h3><div id="bwls">${bwListHtml()}</div></div>`}

let bwNat=0;
function bwRestart(){const s=GX.st;if(!s)return;const th=s.th,b=s.best;GX.st=GXD.bwl.init();GX.st.th=th;GX.st.best=b;gxTone(262,.2,.04)}
function bwTotal(r){const F=bwScore(r);let t=0;F.forEach(f=>{if(f.c!==null)t=f.c});return t}
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
