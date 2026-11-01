import * as THREE from './three.module.min.js';
import {EffectComposer} from './postprocessing/EffectComposer.js';
import {RenderPass} from './postprocessing/RenderPass.js';
import {UnrealBloomPass} from './postprocessing/UnrealBloomPass.js';
import {OutputPass} from './postprocessing/OutputPass.js';
import {buildEnv,TH} from './env.js';
import * as A from './actors.js';
import * as P from './phys.js';
const _C={},W_=new Proxy({},{get(_,k){if(k in _C)return _C[k];let v;try{v=(0,eval)(String(k))}catch(e){v=undefined}if(v!==undefined)_C[k]=v;return v}}),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a);
const oL=(f,e)=>W_.oL?W_.oL(f,e):f,fa=n=>W_.fa?W_.fa(n):String(n);
let CUR=null;
export function open(host,opts){if(CUR)CUR.close();opts=opts||{};const o0=()=>W_.gxS();
 const root=document.createElement('div');root.id='b3root';root.style.cssText='position:fixed;inset:0;z-index:10000;background:#000;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden;font-family:Tahoma,system-ui,sans-serif';host.appendChild(root);
 const css=document.createElement('style');css.textContent=`#b3root *{box-sizing:border-box}#b3root .gb{background:rgba(12,10,30,.62);color:#fff;border:1.5px solid rgba(255,255,255,.35);border-radius:16px;padding:7px 13px;font:700 12px Tahoma;backdrop-filter:blur(6px);cursor:pointer}#b3root .gb.on{background:linear-gradient(135deg,#ff4f8b,#ff8a3d);border-color:#fff}
#b3root .sc{display:flex;direction:ltr;gap:2px}#b3root .fr{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.28);border-radius:4px;text-align:center;color:#fff;font:700 10px Tahoma;min-width:0}#b3root .fr.cur{border-color:#ffd24a;background:rgba(255,210,74,.18)}#b3root .fr .m{display:flex;justify-content:flex-end;height:14px;border-bottom:1px solid rgba(255,255,255,.2)}#b3root .fr .m i{font-style:normal;width:14px;line-height:14px;border-left:1px solid rgba(255,255,255,.2)}#b3root .fr .t{height:16px;line-height:16px;font-size:11px}
#b3root .bn{position:absolute;left:0;right:0;text-align:center;pointer-events:none;color:#fff;font:900 44px Tahoma;text-shadow:0 0 24px var(--c,#ffd24a),0 3px 0 rgba(0,0,0,.4);opacity:0;transform:scale(.6)}#b3root .bn.show{animation:b3p 1.5s ease-out forwards}@keyframes b3p{0%{opacity:0;transform:scale(.5)}15%{opacity:1;transform:scale(1.08)}30%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:scale(1.05)}}
#b3root .sheet{position:absolute;left:0;right:0;bottom:0;max-height:78%;overflow:auto;background:rgba(14,10,34,.96);border-radius:22px 22px 0 0;padding:16px 14px 24px;color:#fff;direction:rtl;transform:translateY(105%);transition:transform .3s}#b3root .sheet.open{transform:none}#b3root .sheet h4{margin:14px 0 8px;font:800 13px Tahoma;color:#ffd24a}#b3root .ch{display:flex;flex-wrap:wrap;gap:6px}#b3root .ch button{background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.25);border-radius:14px;padding:6px 11px;font:600 12px Tahoma}#b3root .ch button.on{background:linear-gradient(135deg,#ff4f8b,#ff8a3d);border-color:#fff}
#b3root .fin{position:absolute;inset:0;background:rgba(5,3,18,.82);display:none;align-items:center;justify-content:center;direction:rtl}#b3root .fin.show{display:flex}#b3root .fin .p{width:min(92%,420px);background:linear-gradient(160deg,#241c58,#0e0b2a);border:2px solid #ffd24a;border-radius:22px;padding:18px 14px;color:#fff;text-align:center}#b3root .st{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}#b3root .st div{background:rgba(255,255,255,.08);border-radius:12px;padding:8px;font:600 11px Tahoma;text-align:right}#b3root .st b{display:block;font:800 16px Tahoma}`;root.appendChild(css);
 const canvas=document.createElement('canvas');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';root.appendChild(canvas);
 const hud=document.createElement('div');hud.style.cssText='position:absolute;inset:0;pointer-events:none';root.appendChild(hud);
 hud.innerHTML=`<div id="b3sb" style="position:absolute;left:8px;right:8px;top:max(8px,env(safe-area-inset-top));background:rgba(8,6,24,.66);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:6px 6px 5px;backdrop-filter:blur(6px)"></div>
 <div id="b3btn" style="position:absolute;right:8px;display:flex;gap:6px;pointer-events:auto;flex-direction:row-reverse"></div>
 <div class="bn" id="b3bn" style="top:34%"></div><div id="b3q" style="position:absolute;left:6px;right:6px;bottom:calc(8px + env(safe-area-inset-bottom));display:flex;gap:6px;overflow-x:auto;pointer-events:auto;direction:rtl;padding-bottom:2px;touch-action:pan-x"></div><div id="b3hint" style="position:absolute;left:0;right:0;bottom:calc(66px + env(safe-area-inset-bottom));text-align:center;color:#fff;font:700 13px Tahoma;text-shadow:0 1px 6px #000;pointer-events:none"></div>
 <div id="b3ban" style="position:absolute;left:0;right:0;top:38%;text-align:center;pointer-events:none"></div>`;
 const sheet=document.createElement('div');sheet.className='sheet';root.appendChild(sheet);const fin=document.createElement('div');fin.className='fin';root.appendChild(fin);
 // ------------ renderer ------------
 const o=o0();let QL=o.b3v===2&&o.b3q!==undefined?o.b3q:1;
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:QL<1,powerPreference:'high-performance',preserveDrawingBuffer:!!opts.test})}catch(e){root.remove();if(W_.toast)W_.toast(oL('مرورگر WebGL را پشتیبانی نمی‌کند','WebGL is not supported'));return null}
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=QL>=1?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;renderer.outputColorSpace=THREE.SRGBColorSpace;
 let scene,E,pins,ball,bowlers=[],cam,composer,bloom,artCv,artCx,artT=0,artS,pcount=0;
 const dprOf=q=>q>=2?2:q>=1?1.6:1.1;let dprMax=dprOf(QL),PR=Math.min(W_.devicePixelRatio||1,dprMax),AD=0,adT=0,adN=0,adS=0;
 function resize(){const w=root.clientWidth||innerWidth,h=root.clientHeight||innerHeight;renderer.setPixelRatio(PR);renderer.setSize(w,h,false);if(cam){cam.aspect=w/h;cam.fov=h>w?58:44;cam.updateProjectionMatrix()}if(composer){composer.setPixelRatio(PR);composer.setSize(w,h)}}
 // ------------ scene ------------
 function build(){if(scene){scene.traverse(x=>{if(x.geometry)x.geometry.dispose&&x.geometry.dispose()})}scene=new THREE.Scene();const ti=o0().bt||0;artCv=document.createElement('canvas');artCv.width=1024;artCv.height=384;artCx=artCv.getContext('2d');artS={stars:Array.from({length:46},()=>[Math.random(),Math.random(),rnd(.8,2),rnd(1,3)]),f:0,k:0};
  E=buildEnv(scene,renderer,ti,QL,artCv);pins=A.makePins(scene,E);
  cam=new THREE.PerspectiveCamera(58,1,.05,90);cam.position.set(.4,1.7,4.6);scene.add(cam);
  ball=A.makeBall(...ballCols());scene.add(ball);
  [0,1].forEach(i=>{const b=A.makeBowler(i?{shirt:0x1f9d57,shirt2:0x0e5c34,skin:0xa8744f,hair:0xc9a15a,pants:0x3b3d48,num:9}:shirtFor(ti));b.visible=false;b.scale.setScalar(.9);scene.add(b);bowlers[i]=b});
  // bumpers
  E.bump=[-1,1].map(sd=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.05,.09,P.PZ0*-1+3.5),new THREE.MeshPhysicalMaterial({color:E.th.acc,roughness:.3,clearcoat:.6}));m.position.set(sd*(P.HW+.02),.045,-8.3);m.castShadow=true;scene.add(m);return m});
  buildGauge();
  composer=null;if(QL>=1){const w=root.clientWidth||innerWidth,h=root.clientHeight||innerHeight,rt=new THREE.WebGLRenderTarget(w*PR,h*PR,{type:THREE.HalfFloatType,samples:4});composer=new EffectComposer(renderer,rt);composer.addPass(new RenderPass(scene,cam));bloom=new UnrealBloomPass(new THREE.Vector2(w,h),QL>=2?.3:.2,.5,.95);composer.addPass(bloom);composer.addPass(new OutputPass())}
  resize();parts()}
 function shirtFor(ti){const c=(W_.BWT&&W_.BWT[ti])?W_.BWT[ti].shirt:['#c0392b','#8e2a20'];return{shirt:new THREE.Color(c[0]).getHex(),shirt2:new THREE.Color(c[1]).getHex(),num:7}}
 function ballCols(){const b=W_.BWBALLS&&W_.BWBALLS[o0().bbc||0],th=W_.BWT&&W_.BWT[o0().bt||0];if(b&&b.c)return[b.c,b.pat];return[th?th.ball:['#7db7ff','#17358a','#bcd8ff'],'']}
 // particles
 let PS;function parts(){const n=520,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));const pts=new THREE.Points(g,new THREE.PointsMaterial({size:.05,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,map:E.glow,sizeAttenuation:true}));pts.frustumCulled=false;scene.add(pts);PS={n,pts,v:new Float32Array(n*3),l:new Float32Array(n),i:0,g:g}}
 function spawn(x,y,z,n,c,sp,life,gr){const col=new THREE.Color(c);for(let k=0;k<n;k++){const i=PS.i=(PS.i+1)%PS.n,a=Math.random()*6.283,u=Math.random()*sp;PS.g.attributes.position.setXYZ(i,x,y,z);PS.v[i*3]=Math.cos(a)*u;PS.v[i*3+1]=rnd(.2,1)*sp*1.1;PS.v[i*3+2]=Math.sin(a)*u;PS.l[i]=life*rnd(.6,1);PS.g.attributes.color.setXYZ(i,col.r,col.g,col.b)}}
 function updParts(dt){const p=PS.g.attributes.position,c=PS.g.attributes.color;for(let i=0;i<PS.n;i++){if(PS.l[i]<=0){p.setY(i,-50);continue}PS.l[i]-=dt;PS.v[i*3+1]-=6*dt;p.setXYZ(i,p.getX(i)+PS.v[i*3]*dt,Math.max(.02,p.getY(i)+PS.v[i*3+1]*dt),p.getZ(i)+PS.v[i*3+2]*dt);if(PS.l[i]<.3){const f=PS.l[i]/.3;c.setXYZ(i,c.getX(i)*f,c.getY(i)*f,c.getZ(i)*f)}}p.needsUpdate=true;c.needsUpdate=true}
 // ------------ game state ------------
 const G={st:'idle',t:0,turn:0,vs:0,P:null,S:null,bx:0,pull:0,u:0,rel:false,cm:1,ban:null,over:false,slow:0,rec:null,recT:0,rep:null,cpu:null,walkT:0,hold:true,drag:null,ts:1,over2:0};
 function newGame(){const o=o0();G.vs=o.bvs||0;G.P=[{rolls:[],f:0,k:0,streak:0,maxStreak:0,gutN:0},{rolls:[],f:0,k:0,streak:0,maxStreak:0,gutN:0}];G.turn=0;G.over=false;G.earn=0;fin.classList.remove('show');G.S={pins:P.rack(),ball:null,bump:!!o.bbump};G.pins=G.S.pins;pins.forEach((m,i)=>A.poseCap(m,G.S.pins[i],0));scoreboard();startTurn(true)}
 const act=()=>G.P[G.turn];
 function startTurn(first){const o=o0();G.st='walk';G.t=0;G.rel=false;G.pull=0;G.u=0;G.bx=0;G.cpu=null;G.plan=null;G.pick=null;G.fcomp=false;bowlers.forEach((b,i)=>b.visible=(i===G.turn));
  const isC=G.vs&&G.turn===1;const cols=isC?[['#ff7a7a','#5a0d0d','#ffe2e2'],'stripe']:ballCols();ball.userData.sphere.material.map=A.ballTexture(cols[0],cols[1],G.turn+3);ball.userData.sphere.material.needsUpdate=true;
  G.walkDur=o.bskip?.6:3.2;banner(isC?oL('نوبت حریف','CPU turn'):(G.vs?oL('نوبت شما','Your turn'):''),isC?'#ff9a9a':'#7ee787',true);
  hint('');if(isC)G.plan=P.planGen(G.S.pins.filter(p=>!p.st&&!p.gone),{N:20,oz:OIL()[0],ol:OIL()[1],om:OIL()[2],m:8,hk:1});G.planRes=[];
  const b=bowlers[G.turn];b.position.set(E.brPos.x+.5,0,E.brPos.z);b.rotation.y=Math.PI*.5*0;ball.visible=true;ball.position.copy(E.brPos).add(new THREE.Vector3(0,.0,0));camSnap()}
 const OIL=()=>P.OIL[o0().boil||0];

 // ------------ 3D power / accuracy gauge ------------
 const NSEG=14;let GA=null;
 function buildGauge(){const g=new THREE.Group(),segs=[];
  const base=new THREE.Mesh(new THREE.BoxGeometry(.2,.04,.12),new THREE.MeshStandardMaterial({color:0x14122e,roughness:.4,metalness:.6}));base.position.y=.02;g.add(base);
  const back=new THREE.Mesh(new THREE.BoxGeometry(.17,NSEG*.085+.06,.03),new THREE.MeshStandardMaterial({color:0x0a0820,roughness:.3,metalness:.5,transparent:true,opacity:.75}));back.position.set(0,.04+(NSEG*.085)/2,-.03);g.add(back);
  for(let i=0;i<NSEG;i++){const k=i/(NSEG-1),c=new THREE.Color().setHSL(.36-.36*k,.95,.52),m=new THREE.MeshStandardMaterial({color:c.clone().multiplyScalar(.18),emissive:c,emissiveIntensity:0,roughness:.35,metalness:.2});const b=new THREE.Mesh(new THREE.BoxGeometry(.14,.07,.05),m);b.position.set(0,.09+i*.085,0);b.userData.c=c;g.add(b);segs.push(b)}
  const lab=new THREE.Mesh(new THREE.PlaneGeometry(.3,.1),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false}));lab.position.set(0,NSEG*.085+.28,0);lab.scale.setScalar(1.7);g.add(lab);
  const cv=document.createElement('canvas');cv.width=256;cv.height=84;const cx=cv.getContext('2d'),tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;lab.material.map=tex;
  g.position.set(-.95,0,1.0);g.visible=false;scene.add(g);
  // lane ribbon + target ring
  const rib=new THREE.Mesh(new THREE.PlaneGeometry(.05,1),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));rib.rotation.x=-Math.PI/2;rib.visible=false;scene.add(rib);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.13,.014,10,40),new THREE.MeshBasicMaterial({color:0x7ee787,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=Math.PI/2;ring.visible=false;scene.add(ring);
  const disc=new THREE.Mesh(new THREE.CircleGeometry(.12,32),new THREE.MeshBasicMaterial({color:0x7ee787,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false}));disc.rotation.x=-Math.PI/2;disc.visible=false;scene.add(disc);
  // accuracy arc bar across lane
  const bar=new THREE.Group();const track=new THREE.Mesh(new THREE.BoxGeometry(P.HW*2,.012,.07),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.18,depthWrite:false}));bar.add(track);
  const sweet=new THREE.Mesh(new THREE.BoxGeometry(.1,.016,.075),new THREE.MeshBasicMaterial({color:0x7ee787,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending}));bar.add(sweet);
  const mk=new THREE.Mesh(new THREE.ConeGeometry(.05,.14,4),new THREE.MeshBasicMaterial({color:0xffffff,blending:THREE.AdditiveBlending}));mk.position.y=.09;mk.rotation.x=Math.PI;bar.add(mk);bar.position.set(0,.02,-2.4);bar.visible=false;scene.add(bar);
  GA={g,segs,lab,cv,cx,tex,rib,ring,disc,bar,mk,sweet,pow:0,acc:0,hold:0,lastTxt:''}}
 function drawLab(pow,acc){const c=GA.cx;c.clearRect(0,0,256,84);c.fillStyle='rgba(8,6,24,.8)';c.fillRect(0,0,256,84);c.strokeStyle='rgba(255,255,255,.5)';c.strokeRect(1,1,254,82);c.fillStyle='#fff';c.font='bold 22px Tahoma';c.textAlign='center';c.fillText(oL('قدرت','POWER')+' '+Math.round(pow*100)+'%',128,32);c.fillStyle=acc>.75?'#7ee787':acc>.45?'#ffd24a':'#ff7a7a';c.fillText(oL('دقت','ACCURACY')+' '+Math.round(acc*100)+'%',128,64);GA.tex.needsUpdate=true}
 function liveInfo(){const d=G.drag;if(!d||d.pts.length<3)return null;const A_=d.pts,e=A_[A_.length-1];let i=A_.length-1;while(i>0&&e.t-A_[i-1].t<150)i--;const a=A_[i],dt=Math.max(16,e.t-a.t)/1000,dy=a.y-e.y,dx=e.x-a.x;if(dy<6)return{pow:G.pull*.3,ang:0,live:false};const sp=dy/dt,k=cl((sp-140)/1700,0,1);return{pow:k,ang:cl(dx/dy,-.6,.6),live:true}}
 function updGauge(dt){if(!GA)return;const o=o0(),aiming=G.st==='aim'&&!(G.vs&&G.turn===1)||G.st==='throw'&&G.tp&&!(G.vs&&G.turn===1);
  let L=aiming?liveInfo():null;if(L&&L.live){GA.pow=lerp(GA.pow,L.pow,.5);GA.ang=L.ang;GA.hold=1.8}else if(L){GA.pow=lerp(GA.pow,L.pow,.3);GA.hold=Math.max(GA.hold,.4)}
  if(G.tp&&G.st==='throw'){const v=-G.tp.vz;GA.pow=cl((v-6.8)/4.2,0,1);GA.ang=cl(G.tp.vx/(.05*v),-.6,.6);GA.hold=1.8}
  GA.hold-=dt;const show=GA.hold>0&&(G.st==='aim'||G.st==='throw'||G.st==='roll');
  GA.g.visible=show;GA.rib.visible=GA.ring.visible=GA.disc.visible=GA.bar.visible=show&&G.st!=='roll';if(!show){if(G.st==='aim'||G.st==='walk')GA.pow=lerp(GA.pow,0,.2);return}
  const n=GA.pow*NSEG,tt=T;GA.segs.forEach((b,i)=>{const on=Math.max(0,Math.min(1,n-i));b.material.emissiveIntensity=on*(1.6+.5*Math.sin(tt*8+i*.5));b.material.color.copy(b.userData.c).multiplyScalar(.12+.88*on);b.scale.z=1+on*.6});
  GA.g.position.set(cl(G.bx-.62,-.98,-.4),0,1.0);GA.g.lookAt(cam.position.x,0,cam.position.z);
  const bx=G.bx,px=cl(bx+GA.ang*.915,-.62,.62),off=Math.abs(px-(bx<0?-.035:.035)*0-0.035),acc=cl(1-off/.35,0,1);GA.acc=lerp(GA.acc||0,acc,.4);
  const col=GA.acc>.75?0x7ee787:GA.acc>.45?0xffd24a:0xff7a7a;[GA.ring,GA.disc].forEach(m=>m.material.color.setHex(col));GA.rib.material.color.setHex(col);
  GA.ring.position.set(px,.03,-18.29);GA.disc.position.set(px,.025,-18.29);GA.ring.scale.setScalar(1+.12*Math.sin(tt*6));
  const z0=-.2,z1=-18.29,len=z0-z1;GA.rib.scale.y=len;GA.rib.position.set((bx+px)/2,.02,(z0+z1)/2);GA.rib.rotation.set(-Math.PI/2,0,-Math.atan2(px-bx,len)*0,'XYZ');GA.rib.rotation.z=Math.atan2(px-bx,len);
  GA.bar.position.set(0,.025,-2.6);GA.mk.position.x=px;GA.mk.material.color.setHex(col);GA.sweet.position.x=0.035;
  const txt=Math.round(GA.pow*100)+'/'+Math.round(GA.acc*100);if(txt!==GA.lastTxt&&(GA.hold>0)){GA.lastTxt=txt;drawLab(GA.pow,GA.acc)}}
 // ------------ camera director ------------
 const CT={p:new THREE.Vector3(.4,1.7,4.6),l:new THREE.Vector3(0,.4,-8),k:4,fov:58,shake:0};const LK=new THREE.Vector3();
 function camSnap(){updCam(0.0,true)}
 function setCam(px,py,pz,lx,ly,lz,k,fovm){CT.p.set(px,py,pz);CT.l.set(lx,ly,lz);CT.k=k||4;CT.fm=fovm||1}
 function directCam(dt){const bx=G.bx,B=G.S&&G.S.ball,o=o0();
  if(G.st==='walk'){const k=G.t/G.walkDur;setCam(lerp(3.4,.6,k),1.9,lerp(5.2,5.9,k),lerp(.9,0,k),.6,lerp(1.5,-6,k),3)}
  else if(G.st==='aim'||G.st==='cpuaim'){setCam(bx*.5+.45,1.95,5.9,bx*.6,.3,-7.5,4.5)}
  else if(G.st==='throw'){setCam(bx*.5+.5,1.85,5.5,bx*.8,.3,-6,5)}
  else if(G.st==='roll'){const m=G.cm;if(!B){setCam(0,1.2,-12,0,.2,-19,2);return}
   const cz=B.z;if(m===1||cz>-9.5){setCam(B.x*.55,.62+Math.max(0,(cz+4)*.03),cz+2.5,B.x*.5,.15,cz-6,7.5)}
   else if(m===2){setCam(0,1.25,-19.9,0,.12,-9,10)}
   else if(m===3){setCam(1.22,.86,-15.2,0,.14,-18.2,10)}
   else{setCam(0,3.4,-14.4,0,0,-18.4,9)}}
  else if(G.st==='settle'||G.st==='sweep'){const m=G.cm;if(m===2)setCam(0,1.25,-19.9,0,.12,-9,3);else if(m===3)setCam(1.22,.86,-15.2,0,.14,-18.2,3);else if(m===4)setCam(0,3.4,-14.4,0,0,-18.4,3);else setCam(.5,1.3,-12.2,0,.1,-18.4,3)}
  else if(G.st==='replay'){const m=G.rep.cm;if(m===2)setCam(Math.sin(G.rep.t*.5)*.3,1.15,-19.9,0,.12,-12,5);else if(m===3)setCam(1.3,.7,-16,0,.14,-18.2,5);else setCam(1.0+Math.sin(G.rep.t*.4)*.25,1.0,-15.3,0,.14,-18.2,5)}}
 function updCam(dt,snap){const k=snap?1:1-Math.exp(-CT.k*dt);cam.position.lerp(CT.p,k);LK.lerp(CT.l,snap?1:1-Math.exp(-CT.k*1.3*dt));if(CT.shake>0.001){cam.position.x+=(Math.random()-.5)*CT.shake*.04;cam.position.y+=(Math.random()-.5)*CT.shake*.04;CT.shake*=Math.exp(-dt*6)}cam.lookAt(LK);}
 // ------------ UI ------------
 function banner(t,c,small){const e=hud.querySelector('#b3bn');if(!t){e.className='bn';return}e.style.setProperty('--c',c||'#ffd24a');e.style.fontSize=(small||t.length>10)?'26px':'44px';e.textContent=t;e.className='bn';void e.offsetWidth;e.className='bn show'}
 function hint(t){hud.querySelector('#b3hint').textContent=t}
 function frames(rolls){return W_.bwScore?W_.bwScore(rolls):[]}
 function scoreboard(){const el=hud.querySelector('#b3sb'),rows=G.vs?[0,1]:[0];el.innerHTML=rows.map(r=>{const F=frames(G.P[r].rolls),cur=G.over?-1:(G.turn===r?G.P[r].f:-1);return`<div style="display:flex;align-items:center;gap:5px;margin:${r?'4px':'0'} 0 0"><div style="width:34px;color:${r?'#ff9a9a':'#ffd24a'};font:800 10px Tahoma;text-align:center">${G.vs?(r?oL('حریف','CPU'):oL('شما','YOU')):''}</div><div class="sc" style="flex:1">${Array.from({length:10},(_,i)=>{const f=F[i]||{m:[],c:null},nm=i===9?3:2,ms=[];for(let j=0;j<nm;j++){const v=f.m[j];ms.push(`<i>${v===undefined?'':v===0?'-':v}</i>`)}return`<div class="fr ${cur===i?'cur':''}" style="${i===9?'flex:1.45':''}"><div class="m">${ms.join('')}</div><div class="t">${f.c!==null&&f.c!==undefined?f.c:''}</div></div>`}).join('')}</div></div>`}).join('');
  const bt=hud.querySelector('#b3btn');bt.style.top=(el.offsetHeight+16)+'px'}
 function buttons(){const bt=hud.querySelector('#b3btn');bt.innerHTML=`<button class="gb" data-b="x">${oL('خروج','Exit')}</button><button class="gb" data-b="s">${oL('تنظیمات','Settings')}</button><button class="gb" data-b="c">${oL('دوربین','Camera')}</button><button class="gb" data-b="r">${oL('شروع دوباره','Restart')}</button>`;bt.onclick=e=>{const b=e.target.closest('[data-b]');if(!b)return;const k=b.dataset.b;if(k==='x')close();else if(k==='s')openSheet();else if(k==='r')newGame();else if(k==='c'){const o=o0();o.bcam=((o.bcam||0)+1)%5;W_.gxSave();banner([oL('دوربین: خودکار','Camera: Auto'),oL('دوربین: پشت توپ','Camera: Chase'),oL('دوربین: پشت مهره‌ها','Camera: Pit'),oL('دوربین: کنار زمین','Camera: Side'),oL('دوربین: از بالا','Camera: Top')][o.bcam],'#7cf0ff',true)}}}
 function chips(title,arr,sel,key,fn){return`<h4>${title}</h4><div class="ch">${arr.map((t,i)=>`<button data-k="${key}" data-i="${i}" class="${sel===i?'on':''}">${t}</button>`).join('')}</div>`}
 function openSheet(){const o=o0(),bl=W_.BWBALLS||[],own=o.bown||[];sheet.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><b style="font:800 15px Tahoma">${oL('تنظیمات بازی','Game settings')}</b><button class="gb" data-k="close">${oL('بستن','Close')}</button></div>`
  +chips(oL('حریف','Opponent'),[oL('بدون حریف','Solo'),oL('کامپیوتر آسان','CPU easy'),oL('کامپیوتر معمولی','CPU normal'),oL('کامپیوتر سخت','CPU hard')],o.bvs||0,'bvs')
  +chips(oL('تم سالن','Alley theme'),TH.map((t,i)=>(W_.BWT&&W_.BWT[i])?oL(W_.BWT[i].n[0],W_.BWT[i].n[1]):t.n),o.bt||0,'bt')
  +`<h4>${oL('مجموعه توپ‌ها','Ball collection')} · ${oL('سکه','Coins')}: ${fa(o.coin||0)}</h4><div class="ch">${bl.map((b,i)=>{const ok=!b.cost||own.includes(i);return`<button data-k="bbc" data-i="${i}" class="${(o.bbc||0)===i?'on':''}" style="opacity:${ok?1:.7}">${oL(b.n[0],b.n[1])}${ok?'':' · '+fa(b.cost)}</button>`}).join('')}</div>`
  +chips(oL('روغن زمین','Oil pattern'),[oL('خانگی','House'),oL('ورزشی','Sport'),oL('خشک','Dry')],o.boil||0,'boil')
  +chips(oL('وزن توپ','Ball weight'),[oL('سبک','Light'),oL('متوسط','Medium'),oL('سنگین','Heavy')],o.bwt||0,'bwt')
  +chips(oL('دوربین','Camera'),[oL('خودکار','Auto'),oL('پشت توپ','Chase'),oL('پشت مهره‌ها','Pit'),oL('کنار زمین','Side'),oL('از بالا','Top')],o.bcam||0,'bcam')
  +chips(oL('کیفیت گرافیک','Graphics quality'),[oL('کم','Low'),oL('بالا','High'),oL('خیلی بالا','Ultra')],QL,'b3q')
  +`<h4>${oL('کمک','Assist')}</h4><div class="ch"><button data-k="t:bbump" class="${o.bbump?'on':''}">${oL('سپر ناودان','Bumpers')}</button><button data-k="t:baim" class="${o.baim?'on':''}">${oL('خط راهنما','Aim line')}</button><button data-k="t:bskip" class="${o.bskip?'on':''}">${oL('بدون نمایش بازیکن','Skip walk')}</button><button data-k="t:brepoff" class="${o.brepoff?'on':''}">${oL('بدون بازپخش','No replay')}</button></div>`;
  sheet.classList.add('open');G.paused=true}
 sheet.onclick=e=>{const b=e.target.closest('button');if(!b)return;const o=o0(),k=b.dataset.k;if(k==='close'){sheet.classList.remove('open');G.paused=false;return}
  if(k.startsWith('t:')){const kk=k.slice(2);o[kk]=o[kk]?0:1;W_.gxSave();if(kk==='bbump'){G.S.bump=!!o.bbump;E.bump.forEach(m=>m.visible=!!o.bbump)}openSheet();return}
  const i=+b.dataset.i;if(k==='bbc'){const bl=W_.BWBALLS,bb=bl[i];o.bown=o.bown||[];if(bb.cost&&!o.bown.includes(i)){if((o.coin||0)<bb.cost){W_.toast&&W_.toast(oL('سکه‌ی کافی نداری','Not enough coins'));return}o.coin-=bb.cost;o.bown.push(i)}o.bbc=i;W_.gxSave();ball.userData.sphere.material.map=A.ballTexture(...ballCols(),3);ball.userData.sphere.material.needsUpdate=true;openSheet();return}
  o[k]=i;if(k==='b3q')o.b3v=2;W_.gxSave();if(k==='bt'||k==='b3q'||k==='bvs'){if(k==='b3q'){QL=i;dprMax=dprOf(QL);PR=Math.min(W_.devicePixelRatio||1,dprMax)}sheet.classList.remove('open');G.paused=false;renderer.shadowMap.type=QL>=1?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;build();newGame()}else openSheet();quick()};

 // ------------ quick bar (in-game settings) ------------
 function quick(){const o=o0(),bl=W_.BWBALLS||[],bt=W_.BWT||[];const nm=(a,i)=>oL(a[i][0],a[i][1]);
  const items=[
  ['bvs',oL('حریف','Opp'),[oL('تنها','Solo'),oL('آسان','Easy'),oL('معمولی','Normal'),oL('سخت','Hard')][o.bvs||0],0],
  ['bt',oL('زمین','Alley'),bt[o.bt||0]?nm(bt.map(t=>t.n),o.bt||0):String(o.bt||0),0],
  ['boil',oL('روغن','Oil'),[oL('خانگی','House'),oL('ورزشی','Sport'),oL('خشک','Dry')][o.boil||0],0],
  ['bbc',oL('توپ','Ball'),bl[o.bbc||0]?nm(bl.map(t=>t.n),o.bbc||0):'',0],
  ['bwt',oL('وزن','Weight'),[oL('سبک','Light'),oL('متوسط','Medium'),oL('سنگین','Heavy')][o.bwt||0],0],
  ['bbump',oL('سپر','Bumper'),o.bbump?oL('روشن','On'):oL('خاموش','Off'),o.bbump],
  ['baim',oL('خط راهنما','Guide'),o.baim?oL('روشن','On'):oL('خاموش','Off'),o.baim],
  ['b3q',oL('کیفیت','Quality'),[oL('کم','Low'),oL('بالا','High'),oL('اولترا','Ultra')][QL],0]];
  const el=hud.querySelector('#b3q');el.innerHTML=items.map(it=>`<button class="gb ${it[3]?'on':''}" data-q="${it[0]}" style="flex:none;padding:5px 10px;line-height:1.25"><span style="opacity:.7;font-size:10px">${it[1]}</span><br>${it[2]}</button>`).join('')}
 function quickTap(k){const o=o0(),bl=W_.BWBALLS||[],N={bvs:4,bt:TH.length,boil:3,bbc:bl.length,bwt:3,b3q:3};
  if(k==='bbump'||k==='baim'){o[k]=o[k]?0:1;W_.gxSave();if(k==='bbump'){G.S.bump=!!o.bbump}quick();return}
  let v=((o[k]||0)+1)%N[k];if(k==='b3q')v=((QL)+1)%3;
  if(k==='bbc'){let g=0;while(g++<20){const b=bl[v];o.bown=o.bown||[];if(!b.cost||o.bown.includes(v))break;if((o.coin||0)>=b.cost&&g===1&&0){}v=(v+1)%N.bbc}o.bbc=v;W_.gxSave();ball.userData.sphere.material.map=A.ballTexture(...ballCols(),3);ball.userData.sphere.material.needsUpdate=true;quick();return}
  o[k]=v;if(k==='b3q')o.b3v=2;W_.gxSave();
  if(k==='bt'||k==='b3q'||k==='bvs'){if(k==='b3q'){QL=v;dprMax=dprOf(QL);PR=Math.min(W_.devicePixelRatio||1,dprMax);renderer.shadowMap.type=QL>=1?THREE.PCFSoftShadowMap:THREE.PCFShadowMap}build();newGame()}
  quick()}
 // ------------ input ------------
 function xy(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now(),w:r.width,h:r.height}}
 canvas.addEventListener('pointerdown',e=>{if(G.paused)return;const p=xy(e);try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  if(G.st==='walk'&&G.t>.2){G.t=Math.max(G.t,G.walkDur-.01);return}if(G.st==='replay'){G.rep.skip=1;return}if(G.over&&G.over2>.9){newGame();return}
  if(G.st!=='aim'||(G.vs&&G.turn===1))return;if(p.y<p.h*.35||p.y>p.h-70)return;G.drag={pts:[p],y0:p.y,x0:p.x,bx0:G.bx};W_.gxTone&&W_.gxTone(330,.1,.03)});
 canvas.addEventListener('pointermove',e=>{const d=G.drag;if(!d)return;const p=xy(e);d.pts.push(p);if(d.pts.length>60)d.pts.shift();let low=d.pts[0].y;d.pts.forEach(q=>low=Math.max(low,q.y));G.bx=cl(d.bx0+(p.x-d.x0)/p.w*1.25,-.44,.44);G.pull=cl((low-d.y0)/(p.h*.1),0,1)*(1-cl((low-p.y)/(p.h*.1),0,1)*.3)});
 canvas.addEventListener('pointerup',e=>{const d=G.drag;if(!d)return;G.drag=null;const f=flick(d);if(!f){G.pull=0;return}throwBall(f.vx,f.vz,f.sp)});
 function flick(d){const A_=d.pts;if(A_.length<3)return null;let mi=0;A_.forEach((q,i)=>{if(q.y>=A_[mi].y)mi=i});const U=A_.slice(mi);if(U.length<3)return null;const e=U[U.length-1];let i=U.length-1;while(i>0&&e.t-U[i-1].t<150)i--;const a=U[i],dt=Math.max(16,e.t-a.t)/1000,dy=a.y-e.y,dx=e.x-a.x;if(dy<18)return null;const sp=dy/dt;if(sp<140)return null;
  const k=Math.min(1,(sp-140)/1700),f=U[0],m=U[U.length>>1],tot=Math.max(50,f.y-e.y),cur=(e.x-2*m.x+f.x)/tot,ang=cl(dx/dy,-.6,.6),v=6.8+k*4.2;return{vz:-v,vx:ang*.05*v,sp:cl(cur*1.8,-1,1)}}
 // ------------ throwing ------------
 function throwBall(vx,vz,sp){if(G.st!=='aim'&&G.st!=='cpuaim')return;G.st='throw';G.u=G.pull>.15?.42*G.pull*.9:0;G.rel=false;G.tp={vx,vz,sp};G.pull=0;hint('')}
 function release(){const B=bowlers[G.turn].userData.J.AR.hand,v=new THREE.Vector3();B.getWorldPosition(v);const o=o0(),cp=G.vs&&G.turn===1,w=cp?1:(o.bwt||0),oil=OIL();
  const b=P.mkBall(cl(v.x,-.5,.5),-.12,G.tp.vx,G.tp.vz,G.tp.sp,{m:[5.4,6.8,7.9][w],hk:[1.25,1,.78][w],oz:oil[0],ol:oil[1],om:oil[2]});b.y=Math.max(.108,v.y-.05);b.drop=1;G.S.ball=b;G.S.bump=!!o.bbump;G.before=P.alive(G.S);G.st='roll';G.rel=true;G.t=0;G.slowed=false;G.gutterFlag=false;G.cm=o.bcam?o.bcam:[1,1,2,3,4][Math.floor(Math.random()*5)];G.rec=[];G.recT=0;G.hit=0;
  if(W_.gxTone){W_.gxTone(110,.4,.05);W_.gxVib&&W_.gxVib(14)}spawn(b.x,.05,b.z,10,0xffffff,.5,.5)}
 // ------------ physics events ------------
 let lastSnd=0;function ev(k,a){const n=performance.now();if(k==='hit'||k==='pp'||k==='topple'){if(n-lastSnd>38){lastSnd=n;W_.gxTone&&W_.gxTone(220+rnd(0,600),.08,Math.min(.07,.02+(a&&a.x===undefined?a:1)*.03));if(k==='hit')W_.gxVib&&W_.gxVib(10)}}
  if(k==='hit'&&!G.slowed&&G.S.ball){G.slowed=true;G.slow=.85;CT.shake=1.6;const b=G.S.ball;spawn(b.x,.2,b.z,28,0xffe9b0,2.2,.7)}
  if(k==='topple'){const p=a;spawn(p.x,.25,p.z,6,0xfff3d6,1.4,.5);G.hit++}
  if(k==='gutter'){G.gutterFlag=true;W_.gxTone&&W_.gxTone(120,.3,.04)}}
 // ------------ replay ------------
 function recFrame(){const r={b:G.S.ball?[ball.position.x,ball.position.y,ball.position.z,ball.quaternion.x,ball.quaternion.y,ball.quaternion.z,ball.quaternion.w]:null,p:pins.map(m=>[m.position.x,m.position.y,m.position.z,m.quaternion.x,m.quaternion.y,m.quaternion.z,m.quaternion.w,m.visible?1:0])};G.rec.push(r)}
 // ------------ main update ------------
 const _v=new THREE.Vector3(),_q=new THREE.Quaternion(),_ax=new THREE.Vector3();let T=0;
 function update(dtr){T+=dtr;if(G.paused){return}
  G.t+=dtr;const o=o0();let dt=dtr;if(G.slow>0){G.slow-=dtr;dt=dtr*.3}
  // art screen
  artT+=dtr;if(artT>.12&&W_.bwArt&&W_.BWT){artT=0;const A_=G.P?G.P[G.turn]:{f:0,k:0};artS.f=A_.f;artS.k=A_.k;artCx.save();artCx.clearRect(0,0,1024,384);try{W_.bwArt(artCx,T,W_.BWT[o.bt||0],0,0,1024,384,artS)}catch(e){}artCx.restore();E.artTex.needsUpdate=true}
  E.cones.forEach((c,i)=>c.material.opacity=(i<4?.14:.1)*(.85+.15*Math.sin(T*1.3+i)));
  if(E.dustP){for(let i=0;i<E.dustP.length;i+=3){E.dustP[i+1]+=Math.sin(T*.3+i)*.0006;E.dustP[i]+=Math.sin(T*.2+i*1.7)*.0004}E.dust.geometry.attributes.position.needsUpdate=true}
  const b=bowlers[G.turn],J=b.userData.J;
  if(G.st==='walk'){const d=G.walkDur,k=cl(G.t/d,0,1);const p1=.18,p2=.4;
   if(k<p1){b.position.set(E.brPos.x+.35,0,E.brPos.z+.1);b.rotation.y=-Math.PI/2;A.setPose(b,A.poseReach(sm(k/p1)));ball.position.copy(E.brPos).setY(.82)}
   else if(k<p2){const u=(k-p1)/(p2-p1);b.position.set(E.brPos.x+.35,0,E.brPos.z+.1);b.rotation.y=-Math.PI/2+u*.6;A.setPose(b,A.poseReach(1-sm(u)));hold(b)}
   else{const u=sm((k-p2)/(1-p2)),sx=E.brPos.x+.35,sz=E.brPos.z+.1;b.position.set(lerp(sx,G.bx,u),0,lerp(sz,.75,u));const dx=G.bx-sx,dz=.75-sz;b.rotation.y=lerp(-Math.PI/2+.6,Math.PI,0)*0+Math.atan2(-dx*.0+(-(dx)),-dz)*(1-u)+0;b.rotation.y=Math.atan2(-dx,-dz)*(1-u*u);A.setPose(b,A.poseWalk(G.t*7.5,true));hold(b)}
   if(G.t>=d){G.st=G.vs&&G.turn===1?'cpuaim':'aim';G.t=0;b.position.set(G.bx,0,.75);b.rotation.y=0;hint(G.vs&&G.turn===1?'':oL('توپ را بگیر و چپ و راست ببر، عقب بکش، بعد تند بالا بکش','Drag to aim, pull back, then flick up fast'))}}
  if(G.st==='aim'||G.st==='cpuaim'){b.position.set(G.bx,0,.75);b.rotation.y=0;const pu=G.pull*.42;if(G.pull>.02)A.setPose(b,A.poseThrow(pu));else A.setPose(b,A.poseStance(T));hold(b);
   if(G.st==='cpuaim'){if(G.plan){for(let i=0;i<4;i++){const r=G.plan.next();if(r.done){G.plan=null;G.pick=P.pickFrom(G.planRes,G.vs);G.pt=0;break}G.planRes.push(r.value)}}
    else if(G.pick){G.pt+=dtr;const k=cl(G.pt/.9,0,1);G.bx=lerp(0,G.pick.bx,sm(k));G.pull=cl((G.pt-.9)/.45,0,1);if(G.pt>1.4){throwBall(G.pick.vx,G.pick.vz,G.pick.sp)}}}}
  if(G.st==='throw'){G.u+=dtr/1.05;b.position.set(G.bx,0,.75-.5*sm(cl((G.u-.2)/.6,0,1)));A.setPose(b,A.poseThrow(Math.min(1,G.u)));hold(b);if(G.u>=.72&&!G.rel)release();}
  if(G.rel&&G.st!=='throw'||(G.st==='throw'&&G.rel)){}
  // follow-through bowler stays visible during roll
  if(G.st==='roll'||G.st==='settle'||G.st==='sweep'){if(G.rel){const u=Math.min(1,.72+G.t*.5);b.position.z=.25;b.position.x=G.bx;A.setPose(b,A.poseThrow(Math.min(1,u)))}
   if(G.t>1.6)b.visible=false}
  // physics
  if(G.st==='roll'||G.st==='settle'){const S=G.S,n=Math.max(1,Math.ceil(dt/.004)),h=dt/n;for(let i=0;i<n;i++)P.step(S,h,ev);
   const B=S.ball;if(B){B.t+=0;ball.visible=true;if(B.drop){B.y=Math.max(.108,B.y-dt*3.2);if(B.y<=.1081)B.drop=0}ball.position.set(B.x,B.gut?.05:B.y,B.z);_ax.set(0,1,0).cross(_v.set(B.vx,0,B.vz));const sp=Math.hypot(B.vx,B.vz);if(sp>.01){_ax.normalize();_q.setFromAxisAngle(_ax,sp*dt/B.r);ball.quaternion.premultiply(_q)}
    if(Math.random()<dt*14&&!B.gut)spawn(B.x+rnd(-.03,.03),.01,B.z+.05,1,0xfff4d6,.25,.35);if(G.rumbleT===undefined||T-G.rumbleT>.17){G.rumbleT=T;if(!B.gut)W_.gxTone&&W_.gxTone(65+Math.abs(B.vz)*3,.2,.02)}}
   else if(G.st==='roll'){G.st='settle';G.t=0;ball.visible=false}
   if(G.rec&&G.rec.length<420){G.recT+=dtr;if(G.recT>=1/60){G.recT=0}}}
  // pins pose
  if(G.S){for(let i=0;i<10;i++)A.poseCap(pins[i],G.S.pins[i],T)}
  if(G.rec&&(G.st==='roll'||G.st==='settle')&&G.rec.length<420&&(!G.S.ball||G.S.ball.z<-6))recFrame();
  if(G.st==='settle'){if(G.t>.6&&(P.quiet(G.S)||G.t>5))evaluate()}
  if(G.st==='replay')stepReplay(dtr);
  if(G.st==='sweep')stepSweep(dtr);
  if(G.over){G.over2+=dtr}
  directCam(dtr);if(G.st==='roll'&&G.S.ball&&G.S.ball.z<-17)CT.shake=Math.max(CT.shake,.25);updCam(dtr);
  updParts(dtr);updGauge(dtr);
  // aim line
  if(!E.aim){const g=new THREE.BufferGeometry().setFromPoints(Array.from({length:40},()=>new THREE.Vector3()));E.aim=new THREE.Points(g,new THREE.PointsMaterial({size:.035,color:0xffffff,transparent:true,opacity:.7,depthWrite:false,map:E.glow,blending:THREE.AdditiveBlending}));E.aim.frustumCulled=false;scene.add(E.aim)}
  E.aim.visible=!!o.baim&&G.st==='aim';if(E.aim.visible){const w=o.bwt||0,oil=OIL(),bl=P.mkBall(G.bx,0,0,-8.6,0,{oz:oil[0],ol:oil[1],om:oil[2],hk:[1.25,1,.78][w]});const arr=E.aim.geometry.attributes.position;let x=G.bx,vx=0,z=0;for(let i=0;i<40;i++){x+=vx*.05;z-=.5;const ramp=cl((-z-oil[0])/oil[1],0,1)*oil[2];vx+=0;arr.setXYZ(i,x,.01,z-.4*i*.02)}arr.needsUpdate=true}
  E.bump.forEach(m=>m.visible=!!o.bbump)}
 const sm=t=>t*t*(3-2*t);
 function hold(b){const v=new THREE.Vector3();b.userData.J.AR.hand.getWorldPosition(v);ball.visible=true;ball.position.set(v.x,v.y-.07,v.z-.01);ball.quaternion.set(0,0,0,1)}
 // ------------ evaluate roll ------------
 function evaluate(){const S=G.S,A_=act(),kn=G.before-P.alive(S),strike=G.before===10&&kn===10,spare=!strike&&P.alive(S)===0&&kn>0;
  A_.streak=strike?(A_.streak||0)+1:0;A_.maxStreak=Math.max(A_.maxStreak||0,A_.streak);if(kn===0&&G.gutterFlag)A_.gutN=(A_.gutN||0)+1;
  const f0=A_.f,done=W_.bwAfter(A_,kn,G.before);G.fcomp=A_.f>f0;G.done=done;const cpu=G.vs&&G.turn===1,pre=cpu?oL('حریف: ','CPU: '):'';
  if(strike){banner(pre+(A_.streak===3?oL('ترکی! ۳ استرایک','TURKEY!'):A_.streak>3?oL('استرایک ×','STRIKE ×')+fa(A_.streak):oL('استرایک!','STRIKE!')),'#ffd24a');confetti(60);[523,659,784,1047].forEach((f,i)=>setTimeout(()=>W_.gxTone&&W_.gxTone(f,.3,.06),i*110));if(!cpu){W_.bwAch&&W_.bwAch('st1','اولین استرایک','First strike');if(A_.streak===3)W_.bwAch&&W_.bwAch('turkey','ترکی: ۳ استرایک پشت‌سرهم','Turkey: 3 strikes in a row')}}
  else if(spare){banner(pre+oL('اسپر!','SPARE!'),'#7cf0ff');confetti(30);if(!cpu)W_.bwAch&&W_.bwAch('sp1','اولین اسپر','First spare')}
  else if(kn===0)banner(pre+(G.gutterFlag?oL('ناودان!','Gutter ball!'):oL('ناکام','Miss')),'#ff9a9a',true);else banner(pre+fa(kn)+' '+oL('مهره','pins'),'#fff',true);
  scoreboard();
  const wantRep=strike&&!o0().brepoff&&G.rec&&G.rec.length>40;
  if(wantRep){G.st='replay';G.rep={t:0,i:0,cm:[2,3,4][Math.floor(Math.random()*3)],skip:0};G.hold=true;showRep(true)}else{G.st='sweep';G.sw=0;G.t=0}}
 function showRep(on){const e=hud.querySelector('#b3ban');e.innerHTML=on?`<span style="display:inline-block;background:rgba(0,0,0,.6);color:#fff;border-radius:14px;padding:6px 14px;font:800 13px Tahoma"><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#ff3b4a;margin-left:6px"></i>${oL('بازپخش آهسته — برای رد کردن بزن','Slow-mo replay — tap to skip')}</span>`:''}
 function stepReplay(dt){const R=G.rec,rp=G.rep;rp.t+=dt;rp.i+=dt*60*.4;const i=Math.min(R.length-1,Math.floor(rp.i)),F=R[i];if(F.b){ball.visible=true;ball.position.set(F.b[0],F.b[1],F.b[2]);ball.quaternion.set(F.b[3],F.b[4],F.b[5],F.b[6])}else ball.visible=false;
  F.p.forEach((q,k)=>{pins[k].visible=!!q[7];pins[k].position.set(q[0],q[1],q[2]);pins[k].quaternion.set(q[3],q[4],q[5],q[6])});
  if(rp.i>R.length+50||rp.skip){showRep(false);pins.forEach(m=>m.visible=true);G.S.pins.forEach((p,k)=>A.poseCap(pins[k],p,T));ball.visible=false;G.st='sweep';G.sw=0;G.t=0;G.rec=null}}
 function confetti(n){const cols=[0xffd24a,0xff6b9d,0x22e8ff,0xa78bfa,0x7ee787];for(let i=0;i<n;i++)spawn(rnd(-.6,.6),rnd(1,2.6),rnd(-14,-10),1,cols[i%5],1.6,1.8)}
 // ------------ sweep & next ------------
 function stepSweep(dt){G.sw+=dt;const S=G.S,k=G.sw,bar=E.bar;
  // phases: 0-.6 pins lift, bar lower; .6-1.6 sweep; 1.6-2.2 bar rises; 2.2 reset
  const lift=cl(k/.5,0,1)*(k>1.7?1-cl((k-1.7)/.4,0,1):1);
  S.pins.forEach(p=>{if(!p.st&&!p.gone)p.drop=.3*lift});
  if(k<.6){bar.position.set(0,lerp(1.6,.06,sm(cl(k/.6,0,1))),-16.3)}
  else if(k<1.7){const u=sm((k-.6)/1.1);bar.position.set(0,.06,lerp(-16.3,-19.5,u));S.pins.forEach(p=>{if(p.st&&!p.gone&&p.z>bar.position.z-.1){p.vz=-1.6;p.vx*=.5}});for(let i=0;i<3;i++)P.step({pins:S.pins.filter(p=>p.st&&!p.gone),ball:null},dt/3)}
  else if(k<2.2){bar.position.set(0,lerp(.06,1.6,sm((k-1.7)/.5)),lerp(-19.5,-16.3,sm((k-1.7)/.5)))}
  if(k>1.9&&!G.swept){G.swept=1;S.pins.forEach(p=>{if(p.st)p.gone=1;p.drop=0})}
  if(k>2.3){G.swept=0;bar.position.set(0,1.6,-16.3);nextAfterSweep()}}
 function nextAfterSweep(){const A_=act(),vs=G.vs;
  if(vs){if(G.turn===0&&(G.done||G.fcomp)){if(G.done){G.done=false;A_.reset=true}G.turn=1;G.S.pins=G.pins=resetPins(A_);return startTurn()}
   if(G.turn===1&&G.fcomp&&!G.done){G.turn=0;G.S.pins=resetPins(A_);return startTurn()}
   if(G.turn===1&&G.done){G.turn=0;return gameOver()}}
  if(G.done)return gameOver();
  G.S.pins=resetPins(A_);startTurn()}
 function resetPins(A_){if(A_.reset||!(G.S.pins.some(p=>!p.st&&!p.gone))){const r=P.rack();r.forEach(p=>p.drop=.9);return r}return G.S.pins.filter(p=>!p.gone&&!p.st).map(p=>({...p,vx:0,vz:0,wob:0,drop:0}))&&refill()}
 function refill(){// keep standing pins at their positions, others gone
  const old=G.S.pins;old.forEach(p=>{if(p.st||p.gone)p.gone=1});return old}
 // ------------ game over ------------
 function stats(i){const F=frames(G.P[i].rolls),all=[];F.forEach(f=>f.m.forEach(m=>all.push(m)));const fb=[];let bf=0;F.forEach(f=>{if(f.m.length)fb.push(f.m[0]==='X'?10:f.m[0]);if(f.s!==null&&f.s!==undefined)bf=Math.max(bf,f.s)});
  return{tot:W_.bwTotal(G.P[i].rolls),st:all.filter(m=>m==='X').length,sp:all.filter(m=>m==='/').length,gut:G.P[i].gutN||0,avg:fb.length?Math.round(fb.reduce((a,b)=>a+b,0)/fb.length*10)/10:0,bf,ms:G.P[i].maxStreak||0}}
 function gameOver(){G.over=true;G.over2=0;G.st='over';scoreboard();const o=o0(),s=stats(0),c=G.vs?stats(1):null,r=c?(s.tot>c.tot?1:s.tot<c.tot?-1:0):0;
  o.bsc=o.bsc||[];o.bsc.unshift({d:W_.iso(W_.today()),s:s.tot,t:o.bt||0,f:10,x:s.st,ok:1,m:'3d'});o.bsc=o.bsc.slice(0,40);
  const earn=Math.floor(s.tot/5)+s.st*3+s.sp+(r>0?25:0);o.coin=(o.coin||0)+earn;o.games=(o.games||0)+1;const best=o.bbest||0,nb=s.tot>best;if(nb)o.bbest=s.tot;
  if(W_.bwAch){if(s.tot>=100)W_.bwAch('s100','امتیاز ۱۰۰','Score 100');if(s.tot>=200)W_.bwAch('s200','امتیاز ۲۰۰','Score 200');if(s.tot>=300)W_.bwAch('s300','بازی بی‌نقص ۳۰۰','Perfect game 300');if(o.games>=10)W_.bwAch('g10','۱۰ بازی','10 games');if(r>0)W_.bwAch('vs'+G.vs,'برد از کامپیوتر','Beat the CPU')}
  if(c){o.bwin=o.bwin||{w:0,l:0,d:0};if(r>0)o.bwin.w++;else if(r<0)o.bwin.l++;else o.bwin.d++}
  W_.gxSave();W_.save&&W_.save();
  const title=c?(r>0?oL('بردی!','You win!'):r<0?oL('کامپیوتر برد','CPU wins'):oL('مساوی','Draw')):oL('بازی تموم شد','Game over');
  fin.innerHTML=`<div class="p"><div style="font:900 24px Tahoma">${title}</div><div style="color:${r<0?'#ff9a9a':'#ffd24a'};font:700 13px Tahoma;margin-top:2px">${c?oL('شما','You')+' '+fa(s.tot)+' — '+fa(c.tot)+' '+oL('کامپیوتر','CPU'):(s.tot>=200?oL('حرفه‌ای!','Pro level!'):s.tot>=150?oL('عالی','Excellent'):s.tot>=100?oL('خوب','Good'):oL('ادامه بده','Keep going'))}</div><div style="font:900 62px Tahoma;margin:6px 0">${fa(s.tot)}</div><div style="font:600 12px Tahoma;color:${nb?'#ffd24a':'#ddd'}">${nb?oL('رکورد جدید!','New record!'):oL('بهترین امتیاز','Best')+': '+fa(o.bbest||0)}</div>
  <div class="st"><div>${oL('استرایک','Strikes')}<b>${fa(s.st)}</b></div><div>${oL('اسپر','Spares')}<b>${fa(s.sp)}</b></div><div>${oL('توپ ناودانی','Gutter balls')}<b>${fa(s.gut)}</b></div><div>${oL('بیشترین استرایک پشت‌سرهم','Longest streak')}<b>${fa(s.ms)}</b></div><div>${oL('میانگین توپ اول','First-ball avg')}<b>${fa(s.avg)}</b></div><div>${oL('بهترین فریم','Best frame')}<b>${fa(s.bf)}</b></div></div>
  <div style="color:#7ee787;font:700 12px Tahoma;margin-bottom:12px">✓ ${oL('امتیاز ثبت شد','Score saved')} · +${fa(earn)} ${oL('سکه','coins')}</div><div style="display:flex;gap:8px"><button class="gb" style="flex:1" data-f="r">${oL('بازی دوباره','Play again')}</button><button class="gb" style="flex:1" data-f="x">${oL('خروج','Exit')}</button></div></div>`;
  fin.classList.add('show');fin.onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;if(b.dataset.f==='r')newGame();else close()};confetti(r>=0?90:0)}
 // ------------ loop ------------
 let raf=0,last=performance.now(),dead=false;
 function frame(t){if(dead)return;raf=requestAnimationFrame(frame);const dr=(t-last)/1000,dt=Math.min(.05,dr);last=t;update(dt);render();adS+=dr;adN++;if(adS>1.2){const ms=adS/adN*1000;adS=0;adN=0;const mx=Math.min(W_.devicePixelRatio||1,dprMax);if(ms>22&&PR>1){PR=Math.max(1,PR-.2);resize()}else if(ms<13&&PR<mx){PR=Math.min(mx,PR+.1);resize()}}}
 function render(){if(composer)composer.render();else renderer.render(scene,cam)}
 function close(){if(dead)return;dead=true;cancelAnimationFrame(raf);try{renderer.dispose();renderer.forceContextLoss()}catch(_){}root.remove();CUR=null;try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}opts.onClose&&opts.onClose()}
 // go
 build();buttons();quick();hud.querySelector('#b3q').onclick=e=>{const b=e.target.closest('[data-q]');if(b)quickTap(b.dataset.q)};newGame();window.addEventListener('resize',resize);
 try{const r=root.requestFullscreen||root.webkitRequestFullscreen;if(r&&!opts.test){const q=r.call(root);q&&q.catch&&q.catch(()=>{})}}catch(_){}
 if(!opts.manual)raf=requestAnimationFrame(frame);
 CUR={close,G,update,render,comp:()=>composer,E:()=>E,pins:()=>pins,cam,P};return CUR}
