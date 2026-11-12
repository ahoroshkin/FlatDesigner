const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
(async()=>{const original=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});try{
const page=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));await page.goto('file://'+path.join(__dirname,'_test.html'));await page.waitForFunction(()=>window.__T?.S.project?.rooms?.length);
await page.evaluate(p=>{const T=__T;T.S.project=p;const r=p.rooms.find(r=>r.items.some(i=>i.id==='jbauijv9'));T.S.roomId=r.id;T.workPick('furn');T.setVMode('plan');T.S.sel={kind:'item',i:r.items.findIndex(i=>i.id==='jbauijv9')};T.openSheet('item');T.fitView();T.render();},original);
assert.match(await page.locator('label').filter({has:page.locator('#f_fd')}).innerText(),/толщина/i);
for(const depth of [10,20]){
await page.fill('#f_fd',String(depth));await page.locator('#f_fd').dispatchEvent('change');
const state=await page.evaluate(()=>{const T=__T,r=T.room(),it=r.items.find(i=>i.id==='jbauijv9');return {it:JSON.parse(JSON.stringify(it)),d:T.furnBox(it).d,net:T.S.project.net,src:T.S.project.src,routes:T.S.project.serviceRoutes};});
assert.equal(state.it.d,depth);assert.equal(state.d,depth);const before=original.rooms.flatMap(r=>r.items).find(i=>i.id==='jbauijv9');assert.deepEqual({...state.it,d:before.d},before);assert.deepEqual(state.net,original.net);assert.deepEqual(state.src,original.src);assert.deepEqual(state.routes,original.serviceRoutes);
await page.evaluate(()=>__T.open3D());await page.waitForFunction(()=>window.THREE&&__T.V3.scene);
const size=await page.evaluate(()=>{const T=__T,r=T.room(),it=r.items.find(i=>i.id==='jbauijv9'),g=T.v3Furn(it,T.byType[it.type],r);return new THREE.Box3().setFromObject(g).getSize(new THREE.Vector3()).z;});
assert(Math.abs(size-depth)<.000001,`3D thickness ${size} expected ${depth}`);
await page.evaluate(()=>__T.close3D());
}
await page.evaluate(async()=>{await __T.save();});await page.waitForTimeout(500);await page.reload();await page.waitForFunction(id=>window.__T?.S.project?.id===id,original.id);
const saved=await page.evaluate(()=>__T.S.project.rooms.flatMap(r=>r.items).find(i=>i.id==='jbauijv9'));assert.equal(saved.d,20);assert.equal(saved.lg,'Л14');assert.equal(saved.mirrorControl,'switch');
assert.deepEqual(errors,[]);console.log('PASS: 10/20mm input, plan geometry, actual 3D bounds, save/reload; position/control/Л14/net/routes unchanged');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
