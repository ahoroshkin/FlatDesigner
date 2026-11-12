const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const source=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),b=await chromium.launch();
 try{
 const page=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));
 await page.goto('file://'+path.join(__dirname,'_test.html'));await page.waitForFunction(()=>window.__T?.S.project?.rooms?.length);
 const ids=await page.evaluate(p=>{const T=__T,S=T.S;S.project=p;T.migrateNet(p);const r=p.rooms.find(r=>r.items.some(i=>i.type==='mirrfull'))||p.rooms[1];S.roomId=r.id;
 let m=r.items.find(i=>i.type==='mirrfull');if(!m){m={id:'mirror198test',type:'mirrfull',w:600,d:50,h:1800,mount:100,x:r.points[0][0]+600,y:r.points[0][1]+600};r.items.push(m);}
 delete m.lg;delete m.mirrorControl;
 const sw={id:'sw198test',type:'switch',wall:0,t:500,h:900,n:2,keys:2,kg:[],pp:[{t:'sw',k:2,kg:[]}]};r.items.push(sw);
 T.workPick('furn');T.setVMode('plan');S.sel={kind:'item',i:r.items.indexOf(m)};T.openSheet('item');T.fitView();T.render();return {rid:r.id,mid:m.id,sid:sw.id};},source);
 assert.equal(await page.locator('#f_mirrorControl198').inputValue(),'button');assert.equal(await page.locator('#f_lg').count(),0);
 await page.selectOption('#f_mirrorControl198','switch');assert.equal(await page.locator('#f_lg').count(),1);
 await page.selectOption('#f_mirrorKey198',JSON.stringify([ids.rid,ids.sid,1,1]));
 const g=await page.evaluate(({mid,sid})=>{const T=__T,r=T.room(),m=r.items.find(i=>i.id===mid),sw=r.items.find(i=>i.id===sid);return {g:m.lg,kg:T.pcfg(sw,1).kg[1],members:T.lgInfo(T.S.project).find(x=>x.g===m.lg).ms.map(x=>x.it.id),net:JSON.stringify(T.S.project.net),src:JSON.stringify(T.S.project.src),routes:JSON.stringify(T.S.project.serviceRoutes)};},ids);
 assert(g.g);assert.equal(g.g,g.kg);assert(g.members.includes(ids.mid));assert.equal(await page.locator(`[data-light-switch197="${ids.sid}"]`).count(),1);
 await page.screenshot({path:'drawings/mirror-v198.png'});
 await page.evaluate(({sid})=>{const T=__T;T.S.sel={kind:'item',i:T.room().items.findIndex(i=>i.id===sid)};T.openSheet('item');T.render();},ids);
 assert.equal(await page.locator(`[data-switch-mirror198="${ids.mid}"]`).count(),1);
 await page.evaluate(({mid})=>{const T=__T;T.S.sel={kind:'item',i:T.room().items.findIndex(i=>i.id===mid)};T.openSheet('item');T.render();},ids);
 // Existing keys reuse their group; built-in button detaches only the mirror.
 await page.selectOption('#f_mirrorControl198','button');
 assert.equal(await page.locator('#f_lg').count(),0);
 const off=await page.evaluate(({mid,sid,g})=>{const T=__T,r=T.room(),m=r.items.find(i=>i.id===mid),sw=r.items.find(i=>i.id===sid);return {group:m.lg,control:m.mirrorControl,key:T.pcfg(sw,1).kg[1],members:T.lgInfo(T.S.project).find(x=>x.g===g)?.ms.length||0};},{...ids,g:g.g});
 assert.equal(off.group,undefined);assert.equal(off.control,'button');assert.equal(off.key,g.g);assert.equal(off.members,0);
 await page.selectOption('#f_mirrorControl198','switch');await page.selectOption('#f_mirrorKey198',JSON.stringify([ids.rid,ids.sid,1,1]));
 const saved=await page.evaluate(async()=>{const T=__T;await T.save();return JSON.parse(JSON.stringify(T.S.project));});
 assert.equal(saved.rooms.find(r=>r.id===ids.rid).items.find(i=>i.id===ids.mid).lg,g.g);
 await page.reload();await page.waitForFunction(id=>window.__T?.S.project?.id===id,saved.id);
 const restored=await page.evaluate(({rid,mid})=>{const T=__T,m=T.S.project.rooms.find(r=>r.id===rid).items.find(i=>i.id===mid);return {mode:m.mirrorControl,g:m.lg,net:JSON.stringify(T.S.project.net),src:JSON.stringify(T.S.project.src),routes:JSON.stringify(T.S.project.serviceRoutes)};},ids);
 assert.equal(restored.mode,'switch');assert.equal(restored.g,g.g);assert.equal(restored.net,g.net);assert.equal(restored.src,g.src);assert.equal(restored.routes,g.routes);
 assert.deepEqual(errors,[]);console.log('PASS: built-in button; multi-post second key; group membership; two-way highlight; detachment; save/reload; geometry/routes preserved');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
