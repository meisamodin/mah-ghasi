// Pure physics for the 3D bowling game (meters). x: right, z: forward is -z. Foul line z=0, head pin z=-18.29.
export const HW=.5265,PZ0=-18.29,ROW=.264,SP=.305,PIT=-19.45;
export const OIL=[[4.5,6.5,1],[11,4,1.45],[0,12,.9]];
export function rack(){const a=[];let i=0;for(let r=0;r<4;r++)for(let k=0;k<=r;k++)a.push({i:i++,x:(k-r/2)*SP,z:PZ0-r*ROW,vx:0,vz:0,st:0,a:0,dx:0,dz:-1,spin:0,wob:0,gone:0,y:0,R:r,rx:0,rz:0});return a}
export function mkBall(x,z,vx,vz,sp,opt){opt=opt||{};return{x,z,vx,vz,sp,r:.108,m:opt.m||6.4,hk:opt.hk||1,oz:opt.oz||0,ol:opt.ol||10,om:opt.om||1,gut:0,t:0,rot:0,rx:0,hit:0,y:.108}}
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
export function step(S,dt,ev){const B=S.ball;
 if(B){B.t+=dt;if(!B.gut){const dist=-B.z,ramp=cl((dist-B.oz)/B.ol,0,1)*B.om;B.vx+=B.sp*1.75*B.hk*ramp*dt;B.vz*=1-.006*dt;const ang=1}
  B.x+=B.vx*dt;B.z+=B.vz*dt;B.rot+=Math.hypot(B.vx,B.vz)*dt/B.r;
  if(S.bump&&!B.gut&&Math.abs(B.x)>HW-.02){B.x=Math.sign(B.x)*(HW-.02);B.vx=-B.vx*.35}
  if(!B.gut&&Math.abs(B.x)>HW+.01){B.gut=B.x>0?1:-1;B.vx=0;ev&&ev('gutter')}
  if(B.gut){B.x+=(B.gut*(HW+.075)-B.x)*Math.min(1,dt*10);B.y+=(.07-B.y)*Math.min(1,dt*10)}
  if(!B.gut&&B.z<PZ0+.9){for(const p of S.pins){if(p.gone)continue;const pr=p.st?.085:.066,dx=p.x-B.x,dz=p.z-B.z,d=Math.hypot(dx,dz),m=B.r+pr;if(d<m&&d>1e-5){const nx=dx/d,nz=dz/d,rel=(p.vx-B.vx)*nx+(p.vz-B.vz)*nz;if(rel<0){const mp=1.55,j=-(1+.55)*rel/(1/B.m+1/mp);B.vx-=j/B.m*nx;B.vz-=j/B.m*nz;p.vx+=j/mp*nx;p.vz+=j/mp*nz;const sp=-rel;if(!p.st&&sp>.45){topple(p,p.vx,p.vz,sp,ev)}else if(!p.st){p.wob=1}ev&&ev('hit',sp)}const o=m-d;p.x+=nx*o;p.z+=nz*o}}}
  if(B.z<PIT-.15)S.ball=null}
 const P=S.pins;for(let i=0;i<P.length;i++){const a=P[i];if(a.gone)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.gone)continue;if(!a.st&&!b.st&&Math.abs(a.vx)+Math.abs(a.vz)+Math.abs(b.vx)+Math.abs(b.vz)<.005)continue;
   const m=(a.st?.085:.066)+(b.st?.085:.066),dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<m&&d>1e-5){const nx=dx/d,nz=dz/d,rel=(b.vx-a.vx)*nx+(b.vz-a.vz)*nz;if(rel<0){const j2=-(1.6)*rel/2;a.vx-=j2*nx;a.vz-=j2*nz;b.vx+=j2*nx;b.vz+=j2*nz;const sp=-rel;if(!a.st&&sp>.5)topple(a,-nx*sp,-nz*sp,sp,ev);if(!b.st&&sp>.5)topple(b,nx*sp,nz*sp,sp,ev);ev&&ev('pp',sp)}const o=(m-d)/2;a.x-=nx*o;a.z-=nz*o;b.x+=nx*o;b.z+=nz*o}}}
 for(const p of P){if(p.gone){p.y-=dt*2.2;continue}
  if(p.st){p.a=Math.min(1,p.a+dt*3.4);const k=p.a>=1?2.6:1.1;p.vx*=Math.max(0,1-k*dt);p.vz*=Math.max(0,1-k*dt);p.spin*=Math.max(0,1-1.5*dt)}else{p.vx*=Math.max(0,1-3.2*dt);p.vz*=Math.max(0,1-3.2*dt)}
  if(p.wob>0)p.wob=Math.max(0,p.wob-dt*1.5);p.x+=p.vx*dt;p.z+=p.vz*dt;
  if(p.z<PIT||Math.abs(p.x)>HW+.12){if(!p.st)topple(p,p.vx,p.vz,1,ev);p.gone=1;p.y=0}
  else if(p.z>PZ0+.9&&p.st){p.gone=1}}}
function topple(p,vx,vz,sp,ev){if(p.st)return;p.st=1;p.a=0;const l=Math.hypot(vx,vz);if(l>.02){p.dx=vx/l;p.dz=vz/l}else{p.dx=(Math.random()-.5);p.dz=-1;const q=Math.hypot(p.dx,p.dz);p.dx/=q;p.dz/=q}p.spin=(Math.random()-.5)*6;ev&&ev('topple',p)}
export function alive(S){return S.pins.filter(p=>!p.st&&!p.gone).length}
export function quiet(S){if(S.ball)return false;return !S.pins.some(p=>!p.gone&&(Math.abs(p.vx)+Math.abs(p.vz)>.05||(p.st&&p.a<1)))}
export function simulate(pins,b,maxT){const S={pins:pins.map(p=>({...p})),ball:mkBall(b.x,b.z===undefined?0:b.z,b.vx,b.vz,b.sp,b)};const dt=.004;let t=0;while(t<(maxT||5)){step(S,dt);t+=dt;if(!S.ball&&t>.5&&quiet(S))break}return{S,knocked:pins.filter(p=>!p.st&&!p.gone).length-alive(S)}}

export function* planGen(pins,opt){const al=pins.filter(p=>!p.st&&!p.gone);const first=al.length===10,cx=al.reduce((s,p)=>s+p.x,0)/Math.max(1,al.length),r=(a,b)=>a+Math.random()*(b-a);
 for(let k=0;k<(opt.N||20);k++){const bx=r(-.4,.4),xa=first?r(-.2,.2):Math.max(-.45,Math.min(.45,cx+r(-.1,.1))),sp=first?[-.5,-.25,0,.25,.5][Math.floor(Math.random()*5)]:[-.1,0,.1][Math.floor(Math.random()*3)],v=r(7,10),vx=(xa-bx)/18.3*v;
  const res=simulate(al,{x:bx,z:0,vx,vz:-v,sp,oz:opt.oz,ol:opt.ol,om:opt.om,m:opt.m,hk:opt.hk});yield{bx,vx,vz:-v,sp,kn:res.knocked}}}
export function pickFrom(res,lv){const R=res.slice().sort((a,b)=>b.kn-a.kn+(Math.random()-.5)*.01),rr=(a,b)=>a+Math.random()*(b-a);let i=lv>=3?Math.floor(rr(1,5)):lv===2?Math.floor(rr(3,10)):Math.floor(rr(4,11));i=Math.min(i,R.length-1);const r=R[i],ns=[[0,0],[.06,.013],[.035,.008],[.022,.004]][lv]||[.05,.01],g=()=>(Math.random()+Math.random()+Math.random()-1.5)*1.15;
 return{bx:Math.max(-.45,Math.min(.45,r.bx+g()*ns[0])),vx:r.vx+g()*ns[1]*Math.abs(r.vz),vz:r.vz,sp:r.sp}}
