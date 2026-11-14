const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();try{
const page=await b.newPage({viewport:{width:1500,height:1000},acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));await page.goto('file://'+path.join(__dirname,'_test.html'));await page.waitForFunction(()=>window.__T?.S.project);
const p=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const inspect=await page.evaluate(p=>{const T=__T;T.S.project=p;T.S.roomId=p.rooms[1].id;T.workPick('ecost');const E=T.estimate(p);return {A:E.A,rooms:p.rooms.slice(0,4).map(r=>({name:r.name,A:T.estimate(p,new Set([r.id])).A})),groups:E.groups,net:p.net};},p);
assert.equal(await page.locator('[data-xlsx202]').count(),1,'Excel available directly in Results / stage estimate');await page.evaluate(()=>__T.openSheet('cost'));
assert(Math.abs(inspect.A.wallA/1e6-162.0772182271015)<1e-6);assert.equal(inspect.A.ceilA,0);assert(Math.abs(inspect.A.dropA/1e6-56.483712)<1e-6);assert(Math.abs(inspect.A.puttyA-162.0772182271015)<1e-6);assert.deepEqual(inspect.net,p.net);
const row=k=>inspect.groups.flatMap(g=>g.rows).find(x=>x.k===k);assert(Math.abs(row('plast.area').q-162.0772182271015)<1e-6);assert.equal(row('plast.mesh.work'),undefined);
assert(!inspect.groups.flatMap(g=>g.rows).some(x=>/Лифт|сплит-шахт/.test(x.n)));
// Common-room additions cannot change any apartment quantity or price.
const unchanged=await page.evaluate(()=>{const T=__T,p=T.S.project,b=JSON.stringify(T.estimate(p));const common=p.rooms.find(r=>r.name==='Лифтовой холл');common.points=common.points.map(([x,y])=>[x*10,y*10]);common.items.push({id:'excluded-test',type:'socket',wall:0,t:200,h:300});return b===JSON.stringify(T.estimate(p));});assert(unchanged);
// Re-enter original to keep independent control totals.
await page.evaluate(p=>{__T.S.project=p;__T.openSheet('cost');},p);
await page.locator('.estimate202 summary').click();const select=page.locator('[data-mesh202]').first();await select.selectOption('yes');
assert(await page.evaluate(()=>__T.estimate(__T.S.project).groups.flatMap(g=>g.rows).some(r=>r.k==='plast.mesh.work'&&r.q>0)));
await page.evaluate(()=>{const T=__T,p=T.S.project;p.prices={'plast.area':{m:0,w:950},'plast.prime.work':{m:0,w:100},'plast.mesh.work':{m:0,w:250}};p.costK={hard:10,disc:5};p.deliv={mode:'fixed',fixed:1234};T.renderSheet();});
await page.screenshot({path:'drawings/estimate-v202.png'});
const E=await page.evaluate(()=>__T.estimate(__T.S.project));const download=page.waitForEvent('download');await page.locator('[data-xlsx202]').first().click();const file=await download;assert.match(file.suggestedFilename(),/\.xlsx$/);await file.saveAs('tmp/estimate202-test.xlsx');fs.writeFileSync('tmp/estimate202-control.json',JSON.stringify(E));fs.writeFileSync('tmp/walls202-verified.json',JSON.stringify(inspect.rooms,null,2));
// Ceiling-only finish changes do not modify wall areas or mesh quantities.
const switchTest=await page.evaluate(()=>{const T=__T,p=T.S.project,r=p.rooms[0],before=T.estimate(p);r.estimateCeiling202='paint';const after=T.estimate(p);return {area:after.A.wallA-before.A.wallA,added:after.A.puttyA-before.A.puttyA,mesh:after.A.mesh202-before.A.mesh202};});assert.equal(switchTest.area,0);assert(Math.abs(switchTest.added-4.503775)<1e-6);assert.equal(switchTest.mesh,0);
assert.deepEqual(errors,[]);console.log('PASS: 162.0772m2 walls; openings deduplicated; common rooms excluded; 56.4837m2 stretch ceiling; no ceiling putty; explicit mesh; XLSX download with cost controls');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
