const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
const G=+process.argv[2]||6;
const out=await p.evaluate(G=>{const res={};
 const throwSim=(s,pick)=>{const sm={sim:1,hitT:0,slowed:1,slow:0,pp:[],shake:0,pdown:0,gutter:0,fl:null,pins:s.pins.filter(q=>q.st===0).map(q=>({...q,vx:0,vz:0,a:0,wob:0})),ball:{x:pick.bx,z:-1.4,vx:pick.vx,vz:pick.vz,sp:pick.sp,r:.21,rot:0,gut:0,t:0,m:8,hk:1,oz:pick.oz,ol:pick.ol,om:pick.om}};for(let j=0;j<900;j++){bwStep(sm,.005);if(!sm.ball&&j>100&&j%20===0&&!sm.pins.some(p=>p.st!==2&&(Math.abs(p.vx)+Math.abs(p.vz)>.12||(p.st===1&&p.a<1))))break}
  s.pins=sm.pins.filter(q=>q.st===0);return sm}
 for(const lv of [1,2,3]){const tots=[],strikes=[];for(let g=0;g<G;g++){const s={vs:lv,pins:[],plan:null,pick:null,rolls:[],f:0,k:0};const mk=()=>{bwRack(s,false)};mk();let done=false,st=0,gd=0;
   while(!done&&gd++<30){s.plan=null;s.pick=null;while(!(s.plan&&s.plan.done))bwPlan(s);bwPick(s);const before=s.pins.length;throwSim(s,s.pick);const kn=before-s.pins.length;if(before===10&&kn===10)st++;done=bwAfter(s,kn,before);if(s.reset)mk()}
   tots.push(bwTotal(s.rolls));strikes.push(st)}
  res[lv]={avg:Math.round(tots.reduce((a,b)=>a+b,0)/G),tots:tots.join(','),st:strikes.join(',')}}
 return res},G);
console.log(JSON.stringify(out,null,1),errs);await b.close()})();
