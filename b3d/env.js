import * as THREE from './three.module.min.js';
import {RoomEnvironment} from './RoomEnvironment.js';
import {HW,PZ0,PIT} from './phys.js';
// ---------- theme palettes (index == app BWT index) ----------
export const TH=[
 {n:'Classic',wood:'#d9a866',wood2:'#b27a3c',acc:0xffb347,acc2:0xff7a1a,floor:0x2a1810,wall:0x3a2315,ceil:0x140a06,fog:0x1a0d06,key:0xfff0d8,amb:0x6a4a30},
 {n:'Neon',wood:'#8b7bff',wood2:'#4a2fb0',acc:0x22e8ff,acc2:0xff3fd0,floor:0x0a0620,wall:0x120a36,ceil:0x06030f,fog:0x0a0522,key:0xcfd8ff,amb:0x3a2a90},
 {n:'Cosmic',wood:'#5f93d6',wood2:'#1c3f78',acc:0x67e8f9,acc2:0xa78bfa,floor:0x040b1a,wall:0x0a1c3c,ceil:0x03060f,fog:0x040d20,key:0xdff3ff,amb:0x28508a},
 {n:'Sunset',wood:'#ffb98a',wood2:'#c4506e',acc:0xff6b9d,acc2:0xffd166,floor:0x2a0e22,wall:0x4a1736,ceil:0x140512,fog:0x2a0e22,key:0xffe3d0,amb:0x7a3450},
 {n:'Arctic',dim:.82,wood:'#dff2ff',wood2:'#8cbbe0',acc:0x9be7ff,acc2:0xc4b5fd,floor:0x0a2036,wall:0x12466e,ceil:0x04101e,fog:0x0b2a46,key:0xf0fbff,amb:0x5a8ab8},
 {n:'Jungle',wood:'#e0aa66',wood2:'#8a5a28',acc:0x7ee787,acc2:0xffd166,floor:0x06180d,wall:0x0f4a22,ceil:0x03100a,fog:0x06200f,key:0xfff6d0,amb:0x3a7a48},
 {n:'Candy',dim:.74,wood:'#ffd3e8',wood2:'#e486b8',acc:0xff6bb5,acc2:0x7ee8d0,floor:0x4a1233,wall:0x8a2a62,ceil:0x260a1c,fog:0x4a1233,key:0xfff0f8,amb:0x9a4a78},
 {n:'Spooky',wood:'#8e6aa2',wood2:'#3a2050',acc:0xff9a3c,acc2:0xa78bfa,floor:0x0a0512,wall:0x1c0c2c,ceil:0x05020a,fog:0x0a0512,key:0xffd6a8,amb:0x4a2a60}];
const fcol0=th=>new THREE.Color(th.floor).lerp(new THREE.Color(th.wall),.6);
export const col=h=>new THREE.Color(h);
function cvs(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
export function laneTexture(th,aniso){const W=1024,H=8192,c=cvs(W,H),x=c.getContext('2d');
 // lane spans z=+4..-19.45 (23.45m) -> px per m
 const Lm=23.45,pm=H/Lm,zpx=z=>(4-z)*pm; // z=4 -> y 0 (top of canvas is toward player)
 // canvas top = far? we map so that v=1 is +z (near). handled by flipY default: top row = v 1.
 const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,th.wood2);g.addColorStop(.5,th.wood);g.addColorStop(1,th.wood2);x.fillStyle=g;x.fillRect(0,0,W,H);
 const nb=39,bw=W/nb;
 for(let i=0;i<nb;i++){const v=(Math.sin(i*12.9898)*43758.5453)%1,sh=.1*Math.abs(v);x.fillStyle=(i%2?'rgba(0,0,0,':'rgba(255,255,255,')+(sh+.02)+')';x.fillRect(i*bw,0,bw,H);
  // grain
  x.strokeStyle='rgba(60,30,10,.09)';x.lineWidth=1;for(let k=0;k<26;k++){const gx=i*bw+Math.random()*bw,gy=Math.random()*H;x.beginPath();x.moveTo(gx,gy);x.bezierCurveTo(gx+3,gy+60,gx-3,gy+160,gx+2,gy+300+Math.random()*500);x.stroke()}
  // board end seams (staggered)
  for(let y=((i*937)%600);y<H;y+=1100+((i*53)%400)){x.fillStyle='rgba(0,0,0,.22)';x.fillRect(i*bw,y,bw,2)}}
 x.fillStyle='rgba(0,0,0,.22)';for(let i=1;i<nb;i++)x.fillRect(i*bw-.7,0,1.4,H);
 // approach darker tint (z>0)
 x.fillStyle='rgba(30,12,0,.12)';x.fillRect(0,0,W,zpx(0));
 // approach dots
 x.fillStyle='rgba(20,8,0,.55)';[1.2,2.1,3.0].forEach(z=>[-.4,-.28,-.16,0,.16,.28,.4].forEach(u=>{x.beginPath();x.arc(W/2+u/1.053*W,zpx(z),7,0,6.283);x.fill()}));
 // foul line
 x.fillStyle='#d9132a';x.fillRect(0,zpx(0)-8,W,16);x.fillStyle='rgba(255,200,200,.5)';x.fillRect(0,zpx(0)-8,W,3);
 // range dots at 2.1-2.4m
 x.fillStyle='rgba(20,8,0,.6)';[-.35,-.25,-.15,-.05,.05,.15,.25,.35].forEach((u,i)=>{x.beginPath();x.arc(W/2+u/1.053*W*1.0,zpx(-2.1+Math.abs(u)*0),4.5,0,6.283);x.fill()});
 // arrows at 4.57m (7 arrows, V shaped)
 x.fillStyle='rgba(40,16,0,.85)';[-.3,-.2,-.1,0,.1,.2,.3].forEach((u,i)=>{const zz=-4.45-(3-Math.abs(i-3))*.28,px=W/2+u/1.053*W*1.6*1.0,ww=24,hh=.45*pm;x.beginPath();x.moveTo(px,zpx(zz));x.lineTo(px-ww,zpx(zz)+hh);x.lineTo(px+ww,zpx(zz)+hh);x.closePath();x.fill()});
 // pin deck: pin spots and slight yellowing
 x.fillStyle='rgba(60,25,0,.1)';x.fillRect(0,zpx(PZ0+1.1),W,zpx(PIT)-zpx(PZ0+1.1));
 x.strokeStyle='rgba(30,12,0,.5)';x.lineWidth=3;for(let r=0;r<4;r++)for(let k=0;k<=r;k++){const px=W/2+((k-r/2)*.305)/1.053*W,py=zpx(PZ0-r*.264);x.beginPath();x.arc(px,py,9,0,6.283);x.stroke()}
 // oil lanes: darker wetter band to ~12m with sharp end
 const og=x.createLinearGradient(0,zpx(0),0,zpx(-12.5));og.addColorStop(0,'rgba(255,255,255,.1)');og.addColorStop(.85,'rgba(255,255,255,.06)');og.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=og;x.fillRect(W*.04,zpx(0),W*.92,zpx(-12.5)-zpx(0));
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=aniso||8;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;return t}
export function glowTexture(){const c=cvs(128,128),x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);return t}
function coneTex(){const c=cvs(64,256),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,256);const t=new THREE.CanvasTexture(c);return t}
export function pinGeometry(){const pts=[[0,0],[.0286,0],[.0300,.008],[.0390,.035],[.0510,.075],[.0590,.105],[.0605,.1143],[.0585,.14],[.0510,.18],[.0400,.215],[.0290,.245],[.0235,.268],[.0232,.285],[.0262,.312],[.0322,.338],[.0362,.356],[.0350,.370],[.0290,.378],[.0160,.3815],[0,.381]];
 const curve=new THREE.SplineCurve(pts.map(p=>new THREE.Vector2(p[0],p[1]))),sp=curve.getPoints(70).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));
 const g=new THREE.LatheGeometry(sp,36);g.computeVertexNormals();const pos=g.attributes.position,colA=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const y=pos.getY(i);let r=1,gg=1,b=1;if((y>.222&&y<.238)||(y>.256&&y<.272)){r=.86;gg=.08;b=.1}if(y<.006){r=.6;gg=.6;b=.6}colA[i*3]=r;colA[i*3+1]=gg;colA[i*3+2]=b}
 g.setAttribute('color',new THREE.BufferAttribute(colA,3));return g}
function box(w,h,d,m,x,y,z,cast,rec){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=!!cast;b.receiveShadow=rec!==false;return b}
function signText(txt,color,w,h,layers,depth){
 const cw=1024,ch=Math.round(1024*h/w),c=cvs(cw,ch),x=c.getContext('2d');x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';
 let fs=ch*.8;x.font='900 '+fs+'px Tahoma,Arial,sans-serif';while(x.measureText(txt).width>cw*.88&&fs>24){fs-=6;x.font='900 '+fs+'px Tahoma,Arial,sans-serif'}x.fillText(txt,cw/2,ch/2);
 const tex=new THREE.CanvasTexture(c);tex.anisotropy=8;tex.colorSpace=THREE.SRGBColorSpace;
 const gc=cvs(cw,ch),gx=gc.getContext('2d');gx.fillStyle='#fff';gx.textAlign='center';gx.textBaseline='middle';gx.font=x.font;gx.shadowColor='#fff';gx.shadowBlur=ch*.16;gx.fillText(txt,cw/2,ch/2);gx.fillText(txt,cw/2,ch/2);
 const gtex=new THREE.CanvasTexture(gc);gtex.colorSpace=THREE.SRGBColorSpace;
 const grp=new THREE.Group(),geo=new THREE.PlaneGeometry(w,h),base=new THREE.Color(color);
 const gl=new THREE.Mesh(new THREE.PlaneGeometry(w*1.12,h*1.12),new THREE.MeshBasicMaterial({map:gtex,color:base,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false,fog:false}));gl.position.z=-.01;grp.add(gl);const bk=new THREE.Mesh(new THREE.PlaneGeometry(w*1.06,h*1.04),new THREE.MeshBasicMaterial({color:0x100818,transparent:true,opacity:.62,depthWrite:false,fog:false}));bk.position.z=-.03;grp.add(bk);
 for(let i=0;i<layers;i++){const t=i/(layers-1),front=i===layers-1;
  const c2=front?base.clone().lerp(new THREE.Color(0xffffff),.62):base.clone().multiplyScalar(.12+.4*t*t);
  const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tex,color:c2,alphaTest:.5,toneMapped:false,fog:false}));m.position.z=t*depth;grp.add(m)}
 return grp}
export function buildEnv(scene,renderer,ti,q,artCanvas,title){const th=TH[ti]||TH[0],E={th,lights:[],glow:glowTexture(),dyn:[]};
 scene.background=col(th.fog);scene.fog=new THREE.Fog(col(th.fog).lerp(col(th.wall),.5),14,60);
 const pm=new THREE.PMREMGenerator(renderer);E.pmrem=pm;scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;scene.environmentIntensity=.55;
 // lights
 const hemi=new THREE.HemisphereLight(th.key,fcol0(th),.75);scene.add(hemi);
 const key=new THREE.SpotLight(th.key,120,40,.62,.55,1.6);key.position.set(.4,4.3,-8);key.target.position.set(0,0,-9);key.castShadow=true;const ss=q>=1?2048:512;key.shadow.mapSize.set(ss,ss);key.shadow.bias=-.0004;key.shadow.normalBias=.02;key.shadow.camera.near=2;key.shadow.camera.far=30;scene.add(key,key.target);E.key=key;
 const deck=new THREE.SpotLight(0xffffff,28,14,.36,.7,1.5);deck.castShadow=q>=1;deck.shadow.mapSize.set(q>=2?2048:1024,q>=2?2048:1024);deck.shadow.bias=-.0003;deck.shadow.normalBias=.012;deck.shadow.camera.near=1.5;deck.shadow.camera.far=9;deck.position.set(0,3.6,-16.2);deck.target.position.set(0,0,-18.3);scene.add(deck,deck.target);E.deck=deck;
 const app=new THREE.SpotLight(th.key,60,10,.9,.8,1.6);app.position.set(0,3.8,2.6);app.target.position.set(0,0,.5);scene.add(app,app.target);E.app=app;
 const fillL=new THREE.PointLight(th.acc,14,20,1.6);fillL.position.set(-3,1.3,-8);scene.add(fillL);const fillR=new THREE.PointLight(th.acc2,14,20,1.6);fillR.position.set(3,1.3,-8);scene.add(fillR);E.fillL=fillL;E.fillR=fillR;
 // floor
 const fcol=col(th.floor).lerp(col(th.wall),.55).lerp(col(th.wood2),.18);const floorM=new THREE.MeshPhysicalMaterial({color:fcol,roughness:.3,metalness:.1,clearcoat:.6,clearcoatRoughness:.2,envMapIntensity:.7});
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(60,60),floorM);fl.rotation.x=-Math.PI/2;fl.position.set(0,-.012,-8);fl.receiveShadow=true;scene.add(fl);
 // lane
 const laneTex=laneTexture(th,renderer.capabilities.getMaxAnisotropy());E.laneTex=laneTex;
 const laneM=new THREE.MeshPhysicalMaterial({color:new THREE.Color().setScalar(th.dim||1),map:laneTex,roughness:.2,metalness:0,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.5});E.laneM=laneM;
 const LL=23.45,lane=new THREE.Mesh(new THREE.PlaneGeometry(1.053,LL,1,1),laneM);lane.rotation.x=-Math.PI/2;lane.position.set(0,0,4-LL/2);lane.receiveShadow=true;scene.add(lane);E.lane=lane;
 const gutM=new THREE.MeshStandardMaterial({color:0x2a2c3a,roughness:.4,metalness:.4,side:THREE.DoubleSide,envMapIntensity:.6});
 const capM=new THREE.MeshPhysicalMaterial({color:col(th.wood2).multiplyScalar(.6).lerp(col(th.wall),.25),roughness:.18,metalness:.2,clearcoat:.8,envMapIntensity:1});
 const ledM=new THREE.MeshBasicMaterial({color:th.acc});const ledM2=new THREE.MeshBasicMaterial({color:th.acc2});E.led=[ledM,ledM2];
 function laneSet(cx,full){const G=new THREE.Group();G.position.x=cx;
  [-1,1].forEach(sd=>{const gm=new THREE.Mesh(new THREE.CylinderGeometry(.078,.078,LL,24,1,true,sd>0?0:Math.PI,Math.PI),gutM);gm.rotation.x=Math.PI/2;gm.rotation.z=0;gm.position.set(sd*(HW+.078),0,4-LL/2);gm.scale.y=1;gm.rotation.set(Math.PI/2,0,0);G.add(gm);
   const cap=box(.34,.06,LL,capM,sd*(HW+.156+.17),-.03,4-LL/2,false,true);G.add(cap);const led=box(.012,.012,LL,sd>0?ledM:ledM2,sd*(HW+.158),.003,4-LL/2,false,false);G.add(led);
   const wall=box(.05,.1,LL,capM,sd*(HW+.156+.5),.05,4-LL/2,true,true);G.add(wall)});
  return G}
 const main=laneSet(0,true);scene.add(main);
 // neighbor lanes (instanced pins + plane copies)
 const nm=new THREE.MeshPhysicalMaterial({map:laneTex,roughness:.25,clearcoat:.8,clearcoatRoughness:.1,envMapIntensity:1.1,color:new THREE.Color().setScalar(.73*(th.dim||1))});
 const pinG=pinGeometry();E.pinG=pinG;
 const pinM=new THREE.MeshPhysicalMaterial({color:0xe6e1d6,vertexColors:true,roughness:.26,clearcoat:1,clearcoatRoughness:.08,sheen:.5,sheenColor:new THREE.Color(0xffffff),sheenRoughness:.5,envMapIntensity:1.1});E.pinM=pinM;
 [-3.6,-1.8,1.8,3.6].forEach(cx=>{const ln=new THREE.Mesh(new THREE.PlaneGeometry(1.053,LL),nm);ln.rotation.x=-Math.PI/2;ln.position.set(cx,0,4-LL/2);ln.receiveShadow=true;scene.add(ln);scene.add(laneSet(cx,false));
  const im=new THREE.InstancedMesh(pinG,pinM,10);let i=0;const m4=new THREE.Matrix4();for(let r=0;r<4;r++)for(let k=0;k<=r;k++){m4.makeTranslation(cx+(k-r/2)*.305,0,PZ0-r*.264);im.setMatrixAt(i++,m4)}im.castShadow=true;scene.add(im);
  // ball return / bridge lights over neighbors
  });
// lane surface detail: oil-pattern roughness + wood bump
 {const rc=cvs(32,1024),rx=rc.getContext('2d'),yz=z=>(4-z)/23.45*1024;rx.fillStyle='#4a4a4a';rx.fillRect(0,0,32,1024);
  const rg=rx.createLinearGradient(0,yz(0),0,yz(-14.5));rg.addColorStop(0,'#1c1c1c');rg.addColorStop(.75,'#242424');rg.addColorStop(.86,'#5a5a5a');rg.addColorStop(1,'#6a6a6a');rx.fillStyle=rg;rx.fillRect(0,yz(0),32,yz(-14.5)-yz(0));
  rx.fillStyle='#6a6a6a';rx.fillRect(0,yz(-14.5),32,1024-yz(-14.5));const rt=new THREE.CanvasTexture(rc);rt.colorSpace=THREE.NoColorSpace;laneM.roughnessMap=rt;laneM.roughness=1;laneM.needsUpdate=true;
  nm.roughnessMap=rt;nm.roughness=1;nm.needsUpdate=true}
 // pit + masking unit
 const pit=box(4.8,.7,2,new THREE.MeshStandardMaterial({color:0x050507,roughness:.9}),0,-.3,PIT-1,false,true);scene.add(pit);
 const backM=new THREE.MeshStandardMaterial({color:col(th.wall).lerp(col(th.wood2),.2),roughness:.55,metalness:.2,envMapIntensity:.6});
 const mask=box(18,5.2,.4,backM,0,2.4,PIT-2.1,false,true);scene.add(mask);
 const artTex=new THREE.CanvasTexture(artCanvas);artTex.colorSpace=THREE.SRGBColorSpace;artTex.anisotropy=4;E.artTex=artTex;
 const sm=new THREE.MeshBasicMaterial({map:artTex,toneMapped:false});
 [0,-3.6,3.6,-1.8,1.8].forEach((cx,i)=>{const w=i===0?3.5:1.7,h=i===0?1.35:.95,y=i===0?2.45:2.05,s=new THREE.Mesh(new THREE.PlaneGeometry(w,h),sm);s.position.set(cx,y,PIT-1.88);scene.add(s);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(w+.12,h+.12,.06),new THREE.MeshBasicMaterial({color:i%2?th.acc2:th.acc}));fr.position.set(cx,y,PIT-1.92);scene.add(fr)});
if(title){const sg=signText(title,th.acc,3.0,.95,14,.16);sg.position.set(0,2.45,PIT-1.74);scene.add(sg);E.sign=sg}
 // lower masking face with LED trim
 const trimGeo=new THREE.BoxGeometry(18,.03,.03);[.9,1.0].forEach((y,i)=>{const t=new THREE.Mesh(trimGeo,i?ledM2:ledM);t.position.set(0,y,PIT-1.87);scene.add(t)});
 const curt=box(4.4,1.0,.06,new THREE.MeshStandardMaterial({color:th.wall,roughness:.9}),0,.5,PIT-.1,false,true);scene.add(curt);
 // ceiling + beams
 const ceil=box(30,.2,46,new THREE.MeshStandardMaterial({color:th.ceil,roughness:.9}),0,5.1,-9,false,false);scene.add(ceil);
 const beamM=new THREE.MeshStandardMaterial({color:0x14141c,roughness:.5,metalness:.6});
 for(let z=3;z>-21;z-=3){scene.add(box(14,.18,.22,beamM,0,4.6,z,false,false));const strip=new THREE.Mesh(new THREE.BoxGeometry(13.6,.025,.03),z%6?ledM:ledM2);strip.position.set(0,4.5,z+.12);scene.add(strip)}
 // hanging lamps
 const lampM=new THREE.MeshBasicMaterial({color:0xffffff});E.cones=[];const ct=coneTex();
 [-2.6,0,2.6].forEach(x=>[1,-5,-11,-17].forEach((z,j)=>{const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.08,.18,.12,16),new THREE.MeshStandardMaterial({color:0x222226,metalness:.8,roughness:.3}));lamp.position.set(x,4.45,z);scene.add(lamp);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),lampM);bulb.position.set(x,4.37,z);scene.add(bulb);
  const cm=new THREE.MeshBasicMaterial({map:ct,color:(x===0?th.key:(j%2?th.acc:th.acc2)),transparent:true,opacity:x===0?.14:.1,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});const cone=new THREE.Mesh(new THREE.ConeGeometry(x===0?1.2:.9,4.3,24,1,true),cm);cone.position.set(x,2.3,z);scene.add(cone);E.cones.push(cone)}));
 // side walls with neon panels
 [-1,1].forEach(sd=>{const wx=sd*7.2;scene.add(box(.3,5.2,34,backM,wx,2.4,-8,false,true));
  for(let z=3;z>-21;z-=2.4){const pm2=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.4),new THREE.MeshStandardMaterial({color:th.wall,roughness:.4,metalness:.3}));pm2.position.set(wx-sd*.16,2.2,z-1.2);pm2.rotation.y=-sd*Math.PI/2;scene.add(pm2);
   const st=new THREE.Mesh(new THREE.BoxGeometry(.04,2.2,.04),(Math.round(z)%2)?ledM:ledM2);st.position.set(wx-sd*.2,2.2,z);scene.add(st)}});
 // seating & tables near approach
 const sofaM=new THREE.MeshStandardMaterial({color:th.acc2,roughness:.7,metalness:.05}),darkM=new THREE.MeshStandardMaterial({color:0x15151a,roughness:.5,metalness:.3});
 [-1,1].forEach(sd=>{for(let k=0;k<3;k++){const z=3-k*2.2,cx=sd*5.4;const g=new THREE.Group();g.add(box(.9,.35,1.6,sofaM,0,.18,0,true,true));g.add(box(.18,.6,1.6,sofaM,sd*.36,.5,0,true,true));g.position.set(cx,0,z);g.rotation.y=sd>0?Math.PI*.5*0:0;scene.add(g);
   scene.add(box(.55,.04,.55,darkM,sd*4.4,.62,z,true,true));scene.add(box(.05,.6,.05,darkM,sd*4.4,.3,z,true,true));
   const mug=new THREE.Mesh(new THREE.CylinderGeometry(.04,.035,.1,12),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.2}));mug.position.set(sd*4.4,.69,z);scene.add(mug)}});
 // back wall behind approach
 scene.add(box(20,5.2,.3,backM,0,2.4,6.4,false,true));
 // ball return machine
 const br=new THREE.Group(),brM=new THREE.MeshPhysicalMaterial({color:0x6c7396,roughness:.22,metalness:.75,clearcoat:.8,envMapIntensity:1.4});br.add(box(.5,.62,.9,brM,0,.31,0,true,true));const hood=new THREE.Mesh(new THREE.SphereGeometry(.34,24,12,0,Math.PI*2,0,Math.PI/2),brM);hood.scale.set(1,.5,1.4);hood.position.set(0,.62,0);hood.castShadow=true;br.add(hood);
 const brLed=box(.02,.02,.9,ledM,.26,.5,0,false,false);br.add(brLed);br.add(box(.012,.012,.9,ledM2,-.26,.5,0,false,false));br.position.set(HW+.156+.5+.35,0,2.2);br.scale.setScalar(.72);scene.add(br);E.br=br;E.brPos=new THREE.Vector3(br.position.x,.72,br.position.z);
 // sweeper bar
 const bar=new THREE.Mesh(new THREE.BoxGeometry(1.35,.06,.07),new THREE.MeshStandardMaterial({color:0x9097a8,metalness:.9,roughness:.25}));bar.position.set(0,1.6,-16.2);bar.castShadow=true;scene.add(bar);E.bar=bar;
 // dust motes
 const dn=220,dp=new Float32Array(dn*3);for(let i=0;i<dn;i++){dp[i*3]=(Math.random()-.5)*7;dp[i*3+1]=Math.random()*4.2;dp[i*3+2]=2-Math.random()*22}
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.025,color:th.key,transparent:true,opacity:.35,depthWrite:false,map:E.glow,blending:THREE.AdditiveBlending}));scene.add(dust);E.dust=dust;E.dustP=dp;
 return E}
