/* ===== mod14: ball-toss target game (added to GXD) ===== */
GXD.bal={
 init(){const s={lv:1,score:0,balls:5,best:gxS().best||0,t:[],ball:null,aim:null,pt:[],sh:[],tx:[],tr:[],shake:0,state:'ready',wait:0,msg:'',msgT:0,combo:0,hits:0,over:0,flash:0,clouds:[],bgx:0};for(let i=0;i<4;i++)s.clouds.push({x:rnd(0,GX.w),y:rnd(30,GX.h*.3),s:rnd(.7,1.3),v:rnd(5,12)});GXD.bal.level(s);return s},
 geo(){const W=GX.w,H=GX.h;return{gy:H*.86,ax:W*.17,ay:H*.7,R:12}},
 level(s){const G=GXD.bal.geo(),W=GX.w,n=Math.min(9,3+s.lv),T=[];let tries=0;while(T.length<n&&tries++<300){const k=Math.random(),type=k<.18?'gold':k<.5?'balloon':k<.75?'mbull':'bull',R=type==='gold'?15:type==='balloon'?rnd(18,24):rnd(20,29),x=rnd(W*.4,W-R-14),y=rnd(R+54,G.gy-R-60);if(T.some(q=>Math.hypot(q.x-x,q.y-y)<q.R+R+16))continue;
   T.push({type,R,x,y,x0:x,y0:y,ph:rnd(0,6.28),amp:type==='mbull'?rnd(26,58):type==='gold'?rnd(20,40):0,sp:rnd(.8,1.6)+s.lv*.06,h:Math.floor(rnd(0,3)),dead:0,pop:0,hue:Math.floor(rnd(0,360))})}
  s.t=T;s.balls=5;s.state='ready';s.ball=null;s.msg=oL('مرحله','Level')+' '+fa(s.lv);s.msgT=1.6;s.combo=0},
 pull(p){const G=GXD.bal.geo();let dx=p.x-G.ax,dy=p.y-G.ay;const d=Math.hypot(dx,dy),M=88;if(d>M){dx*=M/d;dy*=M/d}return{x:dx,y:dy}},
 down(p){const s=GX.st;if(s.over){if(performance.now()-s.over>600){const b=s.best;GX.st=GXD.bal.init();GX.st.best=b}return}if(s.state!=='ready')return;const G=GXD.bal.geo();if(p.x>GX.w*.55)return;s.aim=GXD.bal.pull(p);gxTone(220,.15,.03)},
 move(p){const s=GX.st;if(s.aim)s.aim=GXD.bal.pull(p)},
 up(){const s=GX.st;if(!s||!s.aim)return;const a=s.aim;s.aim=null;const d=Math.hypot(a.x,a.y);if(d<14)return;const G=GXD.bal.geo(),k=7.4;s.ball={x:G.ax+a.x,y:G.ay+a.y,vx:-a.x*k,vy:-a.y*k,r:G.R,rot:0,vr:0,bn:0,hits:0,rest:0};s.balls--;s.state='fly';s.combo=0;s.tr=[];gxTone(520,.2,.05);gxVib(10);s.shake=3},
 sim(x,y,vx,vy,n,dt){const G=GXD.bal.geo(),o=[];for(let i=0;i<n;i++){vy+=900*dt;x+=vx*dt;y+=vy*dt;if(y>G.gy-G.R)break;o.push([x,y])}return o},
 pts(s,tg,d){const r=d/tg.R,v=tg.type==='gold'?100:r<.28?50:r<.62?20:10;return v},
 hit(s,tg,b){tg.dead=1;tg.pop=performance.now();s.hits++;s.combo++;const base=GXD.bal.pts(s,tg,Math.hypot(b.x-tg.x,b.y-tg.y)),pts=base*s.combo;s.score+=pts;
  const lab=(tg.type==='gold'?oL('ستاره! ','Star! '):base===50?oL('عالی! ','Bullseye! '):'')+'+'+fa(pts)+(s.combo>1?' ×'+fa(s.combo):'');s.tx.push({x:tg.x,y:tg.y-tg.R,t:1.1,s:lab,c:tg.type==='gold'?'#fde047':base===50?'#fb7185':'#fff',big:base>=50||s.combo>1});
  const hue=tg.type==='gold'?48:tg.type==='balloon'?tg.hue:[0,210,140][tg.h];for(let i=0;i<22;i++){const a=Math.random()*6.283,v=rnd(60,260);s.sh.push({x:tg.x,y:tg.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,r:rnd(2.5,6.5),rot:rnd(0,6.28),vr:rnd(-9,9),l:1,h:hue+rnd(-12,12),sq:i%3===0})}
  s.pt.push({x:tg.x,y:tg.y,r:tg.R*.6,l:1,k:'ring'});s.shake=Math.max(s.shake,6+s.combo*1.5);s.flash=.18;
  const dx=b.x-tg.x,dy=b.y-tg.y,d=Math.hypot(dx,dy)||1;b.vx=b.vx*.82+dx/d*40;b.vy=b.vy*.82+dy/d*40;gxTone(480+s.combo*90,.4,.06);gxVib(14)},
 draw(t,dt){const c=GX.cx,s=GX.st,W=GX.w,H=GX.h,G=GXD.bal.geo(),T=t/1000;s.shake=Math.max(0,s.shake-dt*22);
  c.save();if(s.shake>.2)c.translate(rnd(-s.shake,s.shake)*.5,rnd(-s.shake,s.shake)*.5);
  // sky
  const sk=c.createLinearGradient(0,0,0,G.gy);sk.addColorStop(0,'#5aa9ff');sk.addColorStop(.55,'#9ad4ff');sk.addColorStop(1,'#ffe9c2');c.fillStyle=sk;c.fillRect(-10,-10,W+20,H+20);
  const sg=c.createRadialGradient(W*.82,H*.16,2,W*.82,H*.16,90);sg.addColorStop(0,'rgba(255,255,230,1)');sg.addColorStop(.18,'rgba(255,240,170,.95)');sg.addColorStop(1,'rgba(255,240,170,0)');c.fillStyle=sg;c.beginPath();c.arc(W*.82,H*.16,90,0,6.283);c.fill();
  s.clouds.forEach(q=>{q.x+=q.v*dt;if(q.x>W+90)q.x=-90;c.fillStyle='rgba(255,255,255,.88)';[[0,0,24],[22,5,18],[-22,6,17],[6,-9,18]].forEach(a=>{c.beginPath();c.arc(q.x+a[0]*q.s,q.y+a[1]*q.s,a[2]*q.s,0,6.283);c.fill()})});
  // mountains parallax
  [['#8fb8e8',.62,.1,3,0],['#6aa7d8',.7,.14,2.2,1.4]].forEach(m=>{c.fillStyle=m[0];c.beginPath();c.moveTo(0,G.gy);for(let x=0;x<=W+10;x+=8)c.lineTo(x,G.gy-H*m[2]-Math.abs(Math.sin(x/W*m[3]+m[4]))*H*.14);c.lineTo(W,G.gy);c.fill()});
  // ground
  const gg=c.createLinearGradient(0,G.gy-6,0,H);gg.addColorStop(0,'#7be07a');gg.addColorStop(.12,'#4fbf63');gg.addColorStop(1,'#2d8a4e');c.fillStyle=gg;c.fillRect(0,G.gy,W,H-G.gy);
  c.fillStyle='rgba(255,255,255,.25)';c.fillRect(0,G.gy,W,3);c.strokeStyle='rgba(20,90,50,.35)';c.lineWidth=2;for(let x=6;x<W;x+=14){c.beginPath();c.moveTo(x,G.gy+4);c.lineTo(x+3,G.gy-4+Math.sin(x)*2);c.stroke()}
  // targets update + draw
  s.t.forEach(q=>{if(q.dead)return;q.ph+=dt*q.sp;if(q.type==='mbull'||q.type==='gold'){q.x=q.x0+Math.sin(q.ph)*q.amp;q.y=q.y0+(q.type==='gold'?Math.cos(q.ph*1.3)*14:0)}else if(q.type==='balloon'){q.y=q.y0+Math.sin(q.ph*1.4)*8;q.x=q.x0+Math.sin(q.ph)*3}});
  const drawT=q=>{const {x,y,R}=q;if(q.type==='balloon'){c.strokeStyle='rgba(70,70,90,.55)';c.lineWidth=1.3;c.beginPath();c.moveTo(x,y+R*1.12);c.quadraticCurveTo(x+Math.sin(q.ph*2)*6,y+R*2.2,x,y+R*3);c.stroke();const g=c.createRadialGradient(x-R*.35,y-R*.4,R*.1,x,y,R*1.2);g.addColorStop(0,`hsl(${q.hue},95%,82%)`);g.addColorStop(1,`hsl(${q.hue},80%,50%)`);c.fillStyle=g;c.beginPath();c.ellipse(x,y,R*.88,R*1.1,0,0,6.283);c.fill();c.fillStyle=`hsl(${q.hue},80%,45%)`;c.beginPath();c.moveTo(x,y+R*1.1);c.lineTo(x-4,y+R*1.28);c.lineTo(x+4,y+R*1.28);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(x-R*.38,y-R*.45,R*.18,R*.3,.5,0,6.283);c.fill();return}
   if(q.type==='gold'){c.save();c.translate(x,y);c.rotate(Math.sin(q.ph*2)*.3);const gl=c.createRadialGradient(0,0,2,0,0,R*2.2);gl.addColorStop(0,'rgba(255,235,120,.7)');gl.addColorStop(1,'rgba(255,235,120,0)');c.fillStyle=gl;c.beginPath();c.arc(0,0,R*2.2,0,6.283);c.fill();c.beginPath();for(let i=0;i<10;i++){const a=-1.5708+i*.6283,r=i%2?R*.5:R*1.05;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,'#fff3a0');g.addColorStop(1,'#f59f00');c.fillStyle=g;c.fill();c.strokeStyle='#d97706';c.lineWidth=1.5;c.stroke();c.restore();return}
   c.fillStyle='rgba(0,0,0,.16)';c.beginPath();c.ellipse(x+3,y+R+5,R*.8,R*.18,0,0,6.283);c.fill();
   const cols=[['#ef4444','#fff'],['#3b82f6','#fff'],['#10b981','#fff']][q.h];[[1,cols[0]],[.72,cols[1]],[.46,cols[0]],[.22,cols[1]]].forEach(a=>{c.fillStyle=a[1];c.beginPath();c.arc(x,y,R*a[0],0,6.283);c.fill()});c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1.2;c.beginPath();c.arc(x,y,R,0,6.283);c.stroke();
   const gl=c.createRadialGradient(x-R*.4,y-R*.45,1,x-R*.2,y-R*.2,R);gl.addColorStop(0,'rgba(255,255,255,.55)');gl.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gl;c.beginPath();c.arc(x,y,R,0,6.283);c.fill()};
  s.t.forEach(q=>{if(!q.dead)drawT(q)});
  // slingshot back
  const fx=G.ax,fy=G.ay;c.lineCap='round';const wood=c.createLinearGradient(fx-10,0,fx+10,0);wood.addColorStop(0,'#9a5b2a');wood.addColorStop(.5,'#c98446');wood.addColorStop(1,'#8a4f22');
  c.strokeStyle=wood;c.lineWidth=11;c.beginPath();c.moveTo(fx,G.gy+4);c.lineTo(fx,fy+34);c.stroke();c.lineWidth=8;c.beginPath();c.moveTo(fx,fy+36);c.quadraticCurveTo(fx-2,fy+14,fx-16,fy-6);c.stroke();c.beginPath();c.moveTo(fx,fy+36);c.quadraticCurveTo(fx+2,fy+14,fx+16,fy-6);c.stroke();
  const rx={l:fx-16,r:fx+16,y:fy-6};let bp=null;if(s.aim)bp={x:fx+s.aim.x,y:fy+s.aim.y};else if(s.state==='ready'&&s.balls>0)bp={x:fx,y:fy};
  if(bp){c.strokeStyle='#3b1f10';c.lineWidth=5;c.beginPath();c.moveTo(rx.r,rx.y);c.lineTo(bp.x,bp.y);c.stroke()}
  // aim preview
  if(s.aim){const d=Math.hypot(s.aim.x,s.aim.y),pts=GXD.bal.sim(bp.x,bp.y,-s.aim.x*7.4,-s.aim.y*7.4,18,.05);pts.forEach((q,i)=>{c.fillStyle='rgba(255,255,255,'+(.9-i*.045)+')';c.beginPath();c.arc(q[0],q[1],3.4-i*.1,0,6.283);c.fill();c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1;c.stroke()});
   c.fillStyle='rgba(255,255,255,.9)';c.font='bold 12px Tahoma,sans-serif';c.textAlign='center';c.fillText(fa(Math.round(d/88*100))+'٪',bp.x,bp.y-22)}
  // ball
  const ball=(x,y,r,rot,sc)=>{c.save();c.translate(x,y);c.fillStyle='rgba(0,0,0,.0)';const gs=Math.max(.35,1-(G.gy-y)/320);c.restore();
   c.save();c.fillStyle='rgba(0,0,0,'+.22*gs+')';c.beginPath();c.ellipse(x,G.gy+6,r*gs*1.1,r*.28*gs,0,0,6.283);c.fill();c.restore();
   c.save();c.translate(x,y);c.rotate(rot);const g=c.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r*1.15);g.addColorStop(0,'#fff7ad');g.addColorStop(.35,'#ff9d3d');g.addColorStop(1,'#d9480f');c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,6.283);c.fill();
   c.save();c.beginPath();c.arc(0,0,r,0,6.283);c.clip();c.strokeStyle='rgba(120,40,0,.55)';c.lineWidth=1.8;c.beginPath();c.moveTo(-r,0);c.lineTo(r,0);c.moveTo(0,-r);c.lineTo(0,r);c.stroke();c.beginPath();c.arc(-r*1.15,0,r*.95,-1.1,1.1);c.stroke();c.beginPath();c.arc(r*1.15,0,r*.95,Math.PI-1.1,Math.PI+1.1);c.stroke();c.restore();
   c.restore();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(x-r*.38,y-r*.42,r*.22,r*.12,-.7,0,6.283);c.fill()};
  if(bp&&!s.ball)ball(bp.x,bp.y,G.R,0);
  // ball physics
  const b=s.ball;if(b){let steps=Math.ceil(dt/.008)||1;const h=dt/steps;for(let k=0;k<steps;k++){b.vy+=900*h;b.x+=b.vx*h;b.y+=b.vy*h;b.rot+=b.vx*h/b.r;
     if(b.y>G.gy-b.r){b.y=G.gy-b.r;if(Math.abs(b.vy)>60){b.vy*=-.55;b.vx*=.86;b.bn++;s.pt.push({x:b.x,y:G.gy,r:6,l:1,k:'dust'});gxTone(140,.12,.03)}else{b.vy=0;b.vx*=1-3*h}}
     if(b.x<b.r){b.x=b.r;b.vx*=-.7}if(b.x>W-b.r){b.x=W-b.r;b.vx*=-.7}if(b.y<b.r){b.y=b.r;b.vy*=-.6}
     s.t.forEach(q=>{if(q.dead)return;const d=Math.hypot(b.x-q.x,b.y-q.y);if(d<b.r+q.R*(q.type==='balloon'?.95:1))GXD.bal.hit(s,q,b)})}
   s.tr.push({x:b.x,y:b.y,l:1});if(s.tr.length>22)s.tr.shift();s.tr.forEach((q,i)=>{c.fillStyle='rgba(255,170,60,'+(i/s.tr.length*.35)+')';c.beginPath();c.arc(q.x,q.y,b.r*(i/s.tr.length)*.8,0,6.283);c.fill()});
   ball(b.x,b.y,b.r,b.rot);
   const sp=Math.hypot(b.vx,b.vy);if(b.y>=G.gy-b.r-1&&sp<24)b.rest+=dt;else b.rest=0;if(b.rest>.5||b.x>W+40||s.t.every(q=>q.dead)&&b.rest>.1){s.ball=null;s.wait=.5;s.state='wait'}}
  // slingshot front
  c.strokeStyle=wood;c.lineWidth=8;c.beginPath();c.moveTo(fx,fy+36);c.quadraticCurveTo(fx-2,fy+14,fx-16,fy-6);c.stroke();c.strokeStyle='#3b1f10';c.lineWidth=5;if(bp){c.beginPath();c.moveTo(rx.l,rx.y);c.lineTo(bp.x,bp.y);c.stroke()}
  // state machine
  if(s.state==='wait'){s.wait-=dt;if(s.wait<=0){if(s.t.every(q=>q.dead)){const bonus=s.balls*25;s.score+=bonus;s.msg=oL('مرحله تموم شد! بونوس ','Level clear! Bonus ')+'+'+fa(bonus);s.msgT=2.2;s.lv++;s.state='lvl';s.wait=2;gxTone(660,.5,.06);setTimeout(()=>gxTone(880,.6,.06),160)}else if(s.balls<=0){s.over=performance.now();if(s.score>s.best){s.best=s.score;gxS().best=s.best;gxSave()}s.state='over';gxTone(220,.6,.05)}else s.state='ready'}}
  else if(s.state==='lvl'){s.wait-=dt;if(s.wait<=0)GXD.bal.level(s)}
  // particles
  s.sh.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=520*dt;q.rot+=q.vr*dt;q.l-=dt*1.1;if(q.y>G.gy-2&&q.vy>0){q.y=G.gy-2;q.vy*=-.4;q.vx*=.7}});s.sh=s.sh.filter(q=>q.l>0);s.sh.forEach(q=>{c.save();c.translate(q.x,q.y);c.rotate(q.rot);c.globalAlpha=Math.min(1,q.l*1.4);c.fillStyle=`hsl(${q.h},90%,62%)`;if(q.sq)c.fillRect(-q.r,-q.r,q.r*2,q.r*2);else{c.beginPath();c.arc(0,0,q.r,0,6.283);c.fill()}c.restore()});
  s.pt.forEach(q=>{q.l-=dt*(q.k==='ring'?2.4:2.8);q.r+=dt*(q.k==='ring'?160:30)});s.pt=s.pt.filter(q=>q.l>0);s.pt.forEach(q=>{if(q.k==='ring'){c.strokeStyle='rgba(255,255,255,'+q.l*.9+')';c.lineWidth=3*q.l;c.beginPath();c.arc(q.x,q.y,q.r,0,6.283);c.stroke()}else{c.fillStyle='rgba(235,225,190,'+q.l*.6+')';c.beginPath();c.arc(q.x,q.y,q.r*.5,0,6.283);c.fill()}});
  c.restore();
  // popups + HUD (no shake)
  c.textAlign='center';s.tx.forEach(q=>{q.t-=dt;q.y-=dt*34});s.tx=s.tx.filter(q=>q.t>0);s.tx.forEach(q=>{c.globalAlpha=Math.min(1,q.t*1.8);c.font=(q.big?'800 20px':'700 15px')+' Tahoma,sans-serif';c.lineWidth=4;c.strokeStyle='rgba(30,30,60,.55)';c.strokeText(q.s,q.x,q.y);c.fillStyle=q.c;c.fillText(q.s,q.x,q.y)});c.globalAlpha=1;
  const pill=(x,y,w,txt,al)=>{c.fillStyle='rgba(20,30,70,.45)';gxRR(c,x,y,w,28,14);c.fill();c.fillStyle='#fff';c.font='700 14px Tahoma,sans-serif';c.textAlign=al||'center';c.fillText(txt,al==='left'?x+12:x+w/2,y+19)};
  pill(10,10,112,oL('امتیاز','Score')+' '+fa(s.score));pill(W-92,10,82,oL('مرحله','Lv')+' '+fa(s.lv));
  for(let i=0;i<5;i++){const x=W/2-44+i*22,on=i<s.balls+(s.ball?0:0);c.globalAlpha=on?1:.25;const g=c.createRadialGradient(x-2,10+14,1,x,10+16,9);g.addColorStop(0,'#ffe9a8');g.addColorStop(1,'#e8590c');c.fillStyle=g;c.beginPath();c.arc(x,28,8,0,6.283);c.fill()}c.globalAlpha=1;
  if(s.msgT>0){s.msgT-=dt;c.globalAlpha=Math.min(1,s.msgT*1.5);c.font='800 24px Tahoma,sans-serif';c.textAlign='center';c.lineWidth=5;c.strokeStyle='rgba(20,30,70,.55)';c.strokeText(s.msg,W/2,H*.4);c.fillStyle='#fff';c.fillText(s.msg,W/2,H*.4);c.globalAlpha=1}
  if(s.state==='ready'&&!s.aim&&s.score===0&&s.balls===5&&s.lv===1){c.fillStyle='rgba(255,255,255,.92)';c.font='600 13px Tahoma,sans-serif';c.textAlign='center';c.fillText(oL('انگشتت رو عقب بکش و رها کن','Pull back and release'),W*.4,H*.93)}
  if(s.flash>0){c.fillStyle='rgba(255,255,255,'+s.flash+')';c.fillRect(0,0,W,H);s.flash=Math.max(0,s.flash-dt*.8)}
  if(s.over){c.fillStyle='rgba(15,20,50,.62)';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.textAlign='center';c.font='800 28px Tahoma,sans-serif';c.fillText(oL('بازی تموم شد','Game over'),W/2,H*.34);c.font='700 20px Tahoma,sans-serif';c.fillText(oL('امتیاز','Score')+': '+fa(s.score),W/2,H*.44);c.font='600 15px Tahoma,sans-serif';c.fillStyle='#ffe08a';c.fillText(oL('بهترین','Best')+': '+fa(s.best),W/2,H*.5);c.fillStyle='rgba(255,255,255,.9)';c.fillText(oL('برای شروع دوباره بزن','Tap to play again'),W/2,H*.6)}
  return 1}};
