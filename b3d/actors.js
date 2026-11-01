import * as THREE from './three.module.min.js';
import {pinGeometry} from './env.js?v=87';
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
// ---------- ball ----------
export function ballTexture(cols,pat,seed){const c=cv(1024,512),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,cols[2]);g.addColorStop(.35,cols[0]);g.addColorStop(1,cols[1]);x.fillStyle=g;x.fillRect(0,0,1024,512);
 const R=(i)=>{const v=Math.sin((i+seed)*127.1)*43758.5453;return v-Math.floor(v)};
 x.globalAlpha=.35;for(let k=0;k<14;k++){x.strokeStyle=k%2?cols[2]:cols[1];x.lineWidth=10+R(k)*26;x.beginPath();const y0=R(k+3)*512;x.moveTo(0,y0);for(let u=0;u<=1024;u+=64)x.lineTo(u,y0+Math.sin(u*.012+k)*70);x.stroke()}x.globalAlpha=1;
 if(pat==='stripe'){x.fillStyle=cols[2];for(let k=0;k<8;k++)x.fillRect(k*128,0,34,512)}
 else if(pat==='star'){x.fillStyle=cols[2];for(let k=0;k<44;k++){const cx=R(k)*1024,cy=40+R(k+9)*430,s=10+R(k+2)*14;x.beginPath();for(let m=0;m<10;m++){const r=m%2?s*.45:s,a=m*Math.PI/5-Math.PI/2;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath();x.fill()}}
 else if(pat==='camo'){for(let k=0;k<60;k++){x.fillStyle=['#2f4a2a','#8b6b3a','#1a2a18','#a9b878'][k%4];x.beginPath();x.ellipse(R(k)*1024,R(k+5)*512,30+R(k+1)*60,18+R(k+2)*30,R(k)*3,0,6.283);x.fill()}}
 else if(pat==='check'){for(let i=0;i<16;i++)for(let j=0;j<8;j++)if((i+j)&1){x.fillStyle='#10131c';x.fillRect(i*64,j*64,64,64)}}
 else if(pat==='flame'){for(let k=0;k<12;k++){const cx=k*85+20,fg=x.createLinearGradient(0,512,0,150);fg.addColorStop(0,'#ffec99');fg.addColorStop(.4,'#ff8a1e');fg.addColorStop(1,'rgba(200,30,0,0)');x.fillStyle=fg;x.beginPath();x.moveTo(cx-40,512);x.quadraticCurveTo(cx-30,350,cx,150+R(k)*80);x.quadraticCurveTo(cx+30,350,cx+40,512);x.fill()}}
 else if(pat==='galaxy'){const gg=x.createRadialGradient(512,256,10,512,256,420);gg.addColorStop(0,'rgba(255,140,230,.6)');gg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gg;x.fillRect(0,0,1024,512);x.fillStyle='#fff';for(let k=0;k<180;k++){x.globalAlpha=.4+R(k)*.6;x.beginPath();x.arc(R(k)*1024,R(k+7)*512,1+R(k+3)*2.4,0,6.283);x.fill()}x.globalAlpha=1}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
export function makeBall(cols,pat){const g=new THREE.Group(),tex=ballTexture(cols,pat,pat?pat.length:3),m=new THREE.MeshPhysicalMaterial({map:tex,roughness:.1,metalness:.15,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:1.7}),s=new THREE.Mesh(new THREE.SphereGeometry(.108,64,48),m);s.castShadow=true;g.add(s);
 const hm=new THREE.MeshBasicMaterial({color:0x050507});[[.034,.022],[.0,.052],[-.034,.022]].forEach((p,i)=>{const h=new THREE.Mesh(new THREE.CylinderGeometry(i===1?.0095:.0105,i===1?.0095:.0105,.012,16),hm);const d=new THREE.Vector3(p[0],1,-p[1]*.2).normalize().multiplyScalar(.107);h.position.copy(d);h.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());g.add(h)});
 g.userData.sphere=s;return g}
// ---------- pins ----------
export function makePins(scene,E){const geo=E.pinG||pinGeometry(),arr=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(geo,E.pinM);m.castShadow=true;m.receiveShadow=false;scene.add(m);arr.push(m)}return arr}
const _q=new THREE.Quaternion(),_q2=new THREE.Quaternion(),_ax=new THREE.Vector3(),_up=new THREE.Vector3(0,1,0);
export function poseCap(mesh,p,t){
 if(p.gone&&p.y<-.4){mesh.visible=false;return}mesh.visible=true;
 if(p.st){p.yaw=(p.yaw||0)+(p.spin||0)*.016;const th=Math.min(1,p.a),e=th*th*(3-2*th),ang=e*(Math.PI/2-.03),s=Math.sin(ang);_ax.set(p.dz,0,-p.dx).normalize();_q.setFromAxisAngle(_ax,ang);_q2.setFromAxisAngle(_up,p.yaw||0);mesh.quaternion.copy(_q2).multiply(_q);
  const back=.19*s;mesh.position.set(p.x-p.dx*back,.058*s+(p.y||0)*(p.gone?1:0),p.z-p.dz*back)}
 else{const w=p.wob||0,tilt=w*.07*Math.sin(t*38+p.i);_ax.set(Math.cos(p.i*2.1),0,Math.sin(p.i*2.1));mesh.quaternion.setFromAxisAngle(_ax,tilt);mesh.position.set(p.x,(p.drop||0),p.z)}}
// ---------- bowler ----------
function skinMat(c){return new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:0})}
function numTex(n,sh){const c=cv(256,256),x=c.getContext('2d');x.clearRect(0,0,256,256);x.fillStyle='rgba(255,255,255,.95)';x.font='900 170px Tahoma,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),128,140);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
export function makeBowler(o){o=Object.assign({shirt:0xc03a2b,shirt2:0x8e2a20,skin:0xd9a07a,hair:0x2b1b12,pants:0x2c3868,shoe:0x2b2b36,num:7},o||{});
 const root=new THREE.Group(),J={},sh=new THREE.MeshPhysicalMaterial({color:o.shirt,roughness:.55,clearcoat:.15,sheen:.3,sheenRoughness:.6,sheenColor:new THREE.Color(o.shirt)}),sh2=new THREE.MeshStandardMaterial({color:o.shirt2,roughness:.6}),sk=skinMat(o.skin),pn=new THREE.MeshStandardMaterial({color:o.pants,roughness:.7}),shoeM=new THREE.MeshPhysicalMaterial({color:o.shoe,roughness:.35,clearcoat:.6}),sole=new THREE.MeshStandardMaterial({color:0xf2f2f2,roughness:.6}),hairM=new THREE.MeshStandardMaterial({color:o.hair,roughness:.8});
 const add=(p,m,mat,cast)=>{const k=new THREE.Mesh(m,mat);k.castShadow=cast!==false;p.add(k);return k};
 const hips=new THREE.Group();hips.position.y=.95;root.add(hips);J.hips=hips;
 // legs
 const leg=(sd)=>{const th=new THREE.Group();th.position.set(sd*.1,0,0);hips.add(th);const t=add(th,new THREE.CapsuleGeometry(.078,.34,8,18),pn);t.position.y=-.24;const kn=new THREE.Group();kn.position.y=-.47;th.add(kn);const c=add(kn,new THREE.CapsuleGeometry(.062,.34,8,18),pn);c.position.y=-.22;const ft=new THREE.Group();ft.position.y=-.45;kn.add(ft);const sh0=add(ft,new THREE.CapsuleGeometry(.056,.17,8,16),shoeM);sh0.rotation.x=Math.PI/2;sh0.scale.set(1.05,1,.85);sh0.position.set(0,-.012,-.06);const sl=add(ft,new THREE.CapsuleGeometry(.059,.18,6,14),sole);sl.rotation.x=Math.PI/2;sl.scale.set(1.05,1,.3);sl.position.set(0,-.06,-.06);return{th,kn,ft}};
 J.L=leg(-1);J.R=leg(1);
 // torso
 const spine=new THREE.Group();hips.add(spine);J.spine=spine;
 const belt=add(spine,new THREE.CylinderGeometry(.165,.165,.06,20),new THREE.MeshStandardMaterial({color:0x111111,roughness:.4}));belt.position.y=.02;
 const torso=add(spine,new THREE.CapsuleGeometry(.17,.36,8,18),sh);torso.scale.set(1.25,1,.72);torso.position.y=.34;
 const stripe=add(spine,new THREE.CylinderGeometry(.215,.2,.05,24),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5}));stripe.scale.set(1,1,.62);stripe.position.y=.46;
 const nt=new THREE.Mesh(new THREE.PlaneGeometry(.26,.26),new THREE.MeshBasicMaterial({map:numTex(o.num),transparent:true}));nt.position.set(0,.34,.128);spine.add(nt);
 const collar=add(spine,new THREE.TorusGeometry(.085,.022,8,18),sh2);collar.rotation.x=Math.PI/2;collar.position.y=.62;
 const neck=add(spine,new THREE.CylinderGeometry(.045,.05,.09,12),sk);neck.position.y=.66;
 const head=new THREE.Group();head.position.y=.76;spine.add(head);J.head=head;
 const sk0=add(head,new THREE.SphereGeometry(.105,28,22),sk);sk0.scale.set(.95,1.08,1);
 const hair=add(head,new THREE.SphereGeometry(.112,28,22,0,Math.PI*2,0,Math.PI*.62),hairM);hair.position.y=.012;hair.rotation.x=-.25;
 head.scale.setScalar(1.12);const eyeM=new THREE.MeshStandardMaterial({color:0x14100e,roughness:.4});[-1,1].forEach(sd=>{const ey=add(head,new THREE.SphereGeometry(.012,10,8),eyeM);ey.position.set(sd*.04,.018,-.098);const br=add(head,new THREE.CapsuleGeometry(.004,.03,4,6),hairM);br.rotation.z=Math.PI/2;br.position.set(sd*.04,.05,-.097)});const nose=add(head,new THREE.SphereGeometry(.02,10,8),sk);nose.position.set(0,-.01,-.105);
 [-1,1].forEach(sd=>{const e=add(head,new THREE.SphereGeometry(.024,10,8),sk);e.position.set(sd*.105,-.01,0)});
 // arms
 const arm=(sd)=>{const sho=new THREE.Group();sho.position.set(sd*.235,.56,0);spine.add(sho);const sl=add(sho,new THREE.CapsuleGeometry(.056,.2,8,14),sh);sl.position.y=-.14;const cuff=add(sho,new THREE.TorusGeometry(.054,.013,8,16),sh2);cuff.rotation.x=Math.PI/2;cuff.position.y=-.255;const el=new THREE.Group();el.position.y=-.3;sho.add(el);const fa=add(el,new THREE.CapsuleGeometry(.036,.22,8,14),sk);fa.position.y=-.16;const hand=new THREE.Group();hand.position.y=-.34;el.add(hand);add(hand,new THREE.SphereGeometry(.04,12,10),sk);return{sho,el,hand}};
 J.AL=arm(-1);J.AR=arm(1);
 root.userData.J=J;root.userData.ph=0;return root}
export function setPose(b,P){const J=b.userData.J;const r=(o,x,y,z)=>{o.rotation.set(x||0,y||0,z||0)};
 r(J.hips,P.hipsX||0,P.hipsY||0,0);J.hips.position.y=.95+(P.lift||0);
 r(J.L.th,P.lt||0,0,.03);r(J.R.th,P.rt||0,0,-.03);r(J.L.kn,P.lk||0);r(J.R.kn,P.rk||0);r(J.L.ft,P.lf||0);r(J.R.ft,P.rf||0);
 r(J.spine,P.sx||0,P.sy||0,P.sz||0);r(J.head,P.hx||0,P.hy||0);
 r(J.AL.sho,P.als||0,0,.06+(P.alz||0));r(J.AL.el,P.ale||0);r(J.AR.sho,P.ars||0,0,-.06+(P.arz||0));r(J.AR.el,P.are||0)}
const lerp=(a,b,t)=>a+(b-a)*t,sm=t=>t*t*(3-2*t),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
// pose generators ------------------------------------------------
export function poseStance(t,hold){const br=Math.sin(t*1.6)*.01;return{hipsX:.1,lt:.1,rt:.1,lk:-.2,rk:-.2,sx:.18+br,hx:-.1,als:.05,ale:-.1,ars:.45,are:-.7,lift:0}}
export function poseWalk(ph,carry){const s=Math.sin(ph),c=Math.cos(ph);return{lift:Math.abs(c)*.02,hipsX:.06,lt:s*.55,rt:-s*.55,lk:-(Math.max(0,-Math.sin(ph-.6))*.9+.05),rk:-(Math.max(0,Math.sin(ph+.6-Math.PI))*.9+.05),lf:s*.1,rf:-s*.1,sx:.08,sy:s*.12,als:-s*.5,ars:carry?.45:s*.5,are:carry?-.7:-.3-Math.max(0,s)*.2,hx:0}}
export function poseThrow(u){// u 0..1 : 0 stance, .42 backswing top, .72 release, 1 follow-through
 const bk=sm(cl(u/.42,0,1)),fw=sm(cl((u-.42)/.3,0,1)),ft=sm(cl((u-.72)/.28,0,1));
 const ars=lerp(.45,-1.15,bk)+(1.15+1.0)*fw+(.65)*ft,are=lerp(-.7,-.25,bk)-.1*fw-.35*ft;
 const step=sm(cl((u-.2)/.5,0,1)),sl=sm(cl((u-.45)/.35,0,1));
 return{lift:-.2*sl,hipsX:.1+.35*sl,lt:.1+step*.2+sl*.55,rt:.1-step*.25-sl*.2,lk:-.2-sl*.55,rk:-.2-sl*.4,sx:.18+.4*sl-.1*bk,sy:-.2*bk+.35*fw,hx:-.1,als:.05-.5*sl+.6*bk,ale:-.1,alz:.5*sl+.4*bk,ars,are}}
export function poseReach(k){return{hipsX:.2,lt:.1,rt:.15,lk:-.3,rk:-.3,sx:.45*k,sy:-.5*k,ars:-.2-1.0*k+.0,are:-.3,als:.1,hx:-.2}}
