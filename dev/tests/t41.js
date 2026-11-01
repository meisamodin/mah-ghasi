const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{const run=seq=>{const s={rolls:[],f:0,k:0};let n=0,done=false,rs=[];for(const r of seq){done=bwAfter(s,r,10);n++;rs.push(s.reset?1:0);if(done)break}return [n,done,s.f,s.k]};
return JSON.stringify([run(Array(12).fill(10)),run(Array(21).fill(5)),run(Array(20).fill(0)),run([...Array(18).fill(0),3,2]),run([...Array(18).fill(0),10,5,5])])}));await b.close()})();
