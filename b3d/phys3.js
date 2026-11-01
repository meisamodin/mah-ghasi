import * as C from './cannon-es.js';
import {HW,PZ0,ROW,SP,PIT,OIL} from './phys.js';
export * from './phys.js';
const DT=1/120,COM=.14,PH=.381,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
export function newSim(){
 const w=new C.World({gravity:new C.Vec3(0,-9.81,0)});w.solver.iterations=10;w.solver.tolerance=1e-3;w.allowSleep=true;w.broadphase=new C.SAPBroadphase(w);w.defaultContactMaterial.friction=.2;
 const M={g:new C.Material('g'),p:new C.Material('p'),b:new C.Material('b'),s:new C.Material('s')};
 const cm=(a,b,f,r)=>w.addContactMaterial(new C.ContactMaterial(a,b,{friction:f,restitution:r,contactEquationStiffness:1e8,contactEquationRelaxation:3}));
 cm(M.g,M.p,.35,.08);cm(M.p,M.p,.22,.32);cm(M.g,M.b,.0,0);cm(M.b,M.p,.08,.22);cm(M.s,M.p,.3,.2);cm(M.s,M.b,.05,.4);
 const S={w,M,pins:[],ball:null,acc:0,ev:null,bumpB:[],t:0,sweepBody:null};
 const box=(hx,hy,hz,x,y,z,mat)=>{const b=new C.Body({mass:0,material:mat||M.g});b.addShape(new C.Box(new C.Vec3(hx,hy,hz)));b.position.set(x,y,z);w.addBody(b);return b};
 box(HW+.02,.5,10.225,0,-.5,-9.025);                       // lane top y=0, z +1.2 .. -18.95
 box(.175,.5,10.225,HW+.195,-.55,-9.025);box(.175,.5,10.225,-HW-.195,-.55,-9.025); // gutters top y=-.05
 box(1.2,.5,.225,0,-.9,-19.475);                               // pit floor top y=-.4
 box(1.2,1,.1,0,.3,-19.75);box(.05,.6,1.4,HW+.4,.3,-18.6,M.s);box(.05,.6,1.4,-HW-.4,.3,-18.6,M.s); // back + side kickbacks
 box(1.2,.05,.4,0,1.2,-19.35,M.s);
 S.bar=new C.Body({mass:0,type:C.Body.KINEMATIC,material:M.s});S.bar.addShape(new C.Box(new C.Vec3(.7,.05,.04)));S.bar.position.set(0,1.6,-16.3);w.addBody(S.bar);
 S.bump=false;return S}
export function setBumpers(S,on){S.bump=on;S.bumpB.forEach(b=>S.w.removeBody(b));S.bumpB=[];if(on)[-1,1].forEach(sd=>{const b=new C.Body({mass:0,material:S.M.s});b.addShape(new C.Box(new C.Vec3(.03,.05,9.3)));b.position.set(sd*(HW+.03),.05,-9.6);S.w.addBody(b);S.bumpB.push(b)})}
function mkPin(S,i,x,z){const b=new C.Body({mass:1.5,material:S.M.p,linearDamping:.03,angularDamping:.12,allowSleep:true,sleepSpeedLimit:.12,sleepTimeLimit:.25});
 b.addShape(new C.Cylinder(.034,.056,.38,8),new C.Vec3(0,.19-COM,0));b.position.set(x,COM+.002,z);S.w.addBody(b);
 const p={i,body:b,x,z,hx:x,hz:z,st:0,gone:0,hit:0};
 b.addEventListener('collide',e=>{if(!S.ev)return;const v=Math.abs(e.contact.getImpactVelocityAlongNormal());if(v<.25)return;if(e.body===S.ball?.body){p.hit=1;S.ev('hit',v)}else if(e.body&&e.body.material===S.M.p)S.ev('pp',v)});
 return p}
export function rackPins(S,keep){S.pins.forEach(p=>S.w.removeBody(p.body));S.pins=[];let i=0;for(let r=0;r<4;r++)for(let k=0;k<=r;k++){const x=(k-r/2)*SP,z=PZ0-r*ROW;const p=mkPin(S,i,x,z);if(keep&&!keep[i]){S.w.removeBody(p.body);p.gone=1;p.st=1;p.body.position.y=-5}S.pins.push(p);i++}}
export function launch(S,x,y,z,vx,vz,sp,o){o=o||{};if(S.ball)S.w.removeBody(S.ball.body);const m=o.m||6.8,b=new C.Body({mass:m,material:S.M.b,linearDamping:0,angularDamping:0,allowSleep:false});b.addShape(new C.Sphere(.108));b.position.set(x,Math.max(.108,y),z);b.velocity.set(vx,0,vz);S.w.addBody(b);
 S.ball={body:b,sp:sp||0,hk:o.hk||1,oz:o.oz||0,ol:o.ol||10,om:o.om||1,gut:0,done:0,slow:0,r:.108,m,x,y,z,vx,vz,t:0};return S.ball}
export function pinDown(p){const q=p.body.quaternion,up=1-2*(q.x*q.x+q.z*q.z);return up<.82||p.body.position.y<.05||p.gone}
export function aliveSim(S){let n=0;S.pins.forEach(p=>{if(!p.gone&&!pinDown(p))n++});return n}
export function quietSim(S){if(S.ball&&!S.ball.done)return false;for(const p of S.pins){if(p.gone)continue;const b=p.body;if(b.sleepState===C.Body.SLEEPING)continue;if(b.velocity.lengthSquared()>.0016||b.angularVelocity.lengthSquared()>.04)return false}return true}
function subStep(S){const B=S.ball;if(B&&!B.done){const b=B.body,p=b.position,v=b.velocity;
  if(!B.gut&&!S.bump&&Math.abs(p.x)>HW-.005&&p.z<-.3){B.gut=1;b.collisionFilterMask=0;b.type=C.Body.KINEMATIC;b.position.y=.04;b.position.x=Math.sign(p.x)*(HW+.07);v.set(0,0,Math.min(v.z,-4));B.slow=0}
  if(!B.gut){const dist=-p.z,ramp=cl((dist-B.oz)/B.ol,0,1)*B.om;if(p.y<.2)b.applyForce(new C.Vec3(B.sp*.6*B.hk*ramp*B.m,0,0),p);b.angularVelocity.set(v.z/.108,0,-v.x/.108)}
  else b.angularVelocity.set(v.z/.108,0,0);
  B.x=p.x;B.y=p.y;B.z=p.z;B.vx=v.x;B.vz=v.z;
  if(p.z<-19.3||p.y<-.3||(p.z<-17&&Math.hypot(v.x,v.z)<.35)){B.slow+=DT;if(p.z<-19.3||B.slow>.8||p.y<-.3){B.done=1;S.w.removeBody(b)}}}
 S.w.step(DT)}
export function stepSim(S,dt,ev){S.ev=ev;S.acc+=dt;let n=0;while(S.acc>=DT&&n++<40){subStep(S);S.acc-=DT}if(n>=40)S.acc=0;S.t+=dt;
 S.pins.forEach(p=>{if(p.gone)return;const b=p.body;p.x=b.position.x;p.z=b.position.z;p.st=pinDown(p)?1:0});
 if(S.ball&&S.ball.done&&!S.ball.gone){S.ball.gone=1}}
export function poseBody(mesh,p){const b=p.body,q=b.quaternion;mesh.visible=!p.gone;const k=-COM;
 mesh.position.set(b.position.x+2*(q.x*q.y-q.w*q.z)*k,b.position.y+(1-2*(q.x*q.x+q.z*q.z))*k,b.position.z+2*(q.y*q.z+q.w*q.x)*k);mesh.quaternion.set(q.x,q.y,q.z,q.w)}
const goto=(b,x,y,z,dt)=>{const d=Math.max(dt,1e-3);b.velocity.set((x-b.position.x)/d,(y-b.position.y)/d,(z-b.position.z)/d)};
export function sweepStart(S){S.swept=0;S.pins.forEach(p=>{if(p.gone)return;p.lift=pinDown(p)?0:1;if(p.lift){const b=p.body;p.hx=b.position.x;p.hz=b.position.z;b.type=C.Body.KINEMATIC;b.updateMassProperties();b.quaternion.set(0,0,0,1);b.angularVelocity.set(0,0,0);b.velocity.set(0,0,0)}})}
export function sweepStep(S,k,dt){const bar=S.bar;
 S.pins.forEach(p=>{if(p.gone||!p.lift)return;const h=COM+.002+.32*Math.min(1,k/.45)*(k>1.75?1-cl((k-1.75)/.4,0,1):1);goto(p.body,p.hx,h,p.hz,dt);p.body.quaternion.set(0,0,0,1)});
 let tx=0,ty=1.6,tz=-16.3;
 if(k<.6){ty=1.6-(1.6-.06)*(k/.6)}else if(k<1.7){const u=(k-.6)/1.1;ty=.06;tz=-16.3+(-19.4+16.3)*u}else if(k<2.2){const u=(k-1.7)/.5;ty=.06+(1.6-.06)*u;tz=-19.4+(19.4-16.3)*u}
 goto(bar,tx,ty,tz,dt);
 if(k>1.95&&!S.swept){S.swept=1;S.pins.forEach(p=>{if(!p.lift&&!p.gone){S.w.removeBody(p.body);p.gone=1}})}
 return k>2.3}
export function sweepEnd(S){S.swept=0;S.bar.velocity.set(0,0,0);S.bar.position.set(0,1.6,-16.3);S.pins.forEach(p=>{if(p.gone)return;const b=p.body;b.type=C.Body.DYNAMIC;b.mass=1.5;b.updateMassProperties();b.position.set(p.hx,COM+.002,p.hz);b.velocity.set(0,0,0);b.angularVelocity.set(0,0,0);b.quaternion.set(0,0,0,1);b.wakeUp();p.lift=0;p.st=0})}
