const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:360,height:740}})).newPage();const err=[];p.on('pageerror',x=>err.push(x.message));
await p.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='t.local')return r.fulfill({body:fs.readFileSync('/mnt/user-data/outputs/mahbanoo.html'),contentType:'text/html'});r.abort()});
await p.goto('http://t.local/');await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[bwTotal(Array(12).fill(10)),bwTotal(Array(21).fill(5)),bwTotal(Array(20).fill(0)),bwTotal([10,9,1,5,5,7,2,10,10,10,9,0,8,2,9,1,10]),bwTotal([9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,1,10])]));
console.log(err);await b.close()})();
