const {chromium}=require('playwright');
const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.setDefaultTimeout(8000);
  await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));
  await page.goto(pathToFileURL(path.join(__dirname,'_test.html')).href);
  await page.waitForFunction(()=>__T.S.project?.rooms?.length);
  const before=await page.evaluate(p=>{
   const T=__T,S=T.S;S.project=p;S.stage='final';S.vmode='plan';S.roomId=p.rooms.find(T.commonRoom196).id;
   T.fitView();T.render();T.openSheet('layers');T.fitView();T.render();
   return {lengths:p.serviceRoutes.map(T.serviceStats),scale:S.view.s};
  },input);
  await page.locator('[data-common196]').uncheck();
  const hidden=await page.evaluate(()=>{
   const T=__T,S=T.S,p=S.project,view=T.visiblePlan196(p),plan=document.querySelector('#plan');
   return {names:view.rooms.map(r=>r.name),selected:T.room().name,allRooms:p.rooms.length,entry:view.rooms.some(r=>r.items.some(i=>i.type==='entry')),clip:plan.querySelectorAll('#apartmentRoutes196 polygon').length,routeCount:plan.querySelectorAll('[data-service-route]').length,lengths:p.serviceRoutes.map(T.serviceStats),scale:S.view.s,showsHall:plan.textContent.includes('Лифтовой холл'),fullDrawing:T.netPlanSVG(p,S.view,1280,900,T.PRINT_PAL,{live:false,zoom:false}).includes('Лифтовой холл')};
  });
  assert.equal(hidden.names.length,4);
  assert(!hidden.showsHall);
  assert(hidden.fullDrawing);
  assert(hidden.entry);
  assert.equal(hidden.clip,4);
  assert(hidden.routeCount>=2);
  assert(hidden.scale>before.scale);
  assert.equal(hidden.allRooms,8);
  assert(!hidden.names.some(n=>/шахт|лифтовой/i.test(n)));
  assert(hidden.names.includes(hidden.selected));
  assert.deepEqual(hidden.lengths,before.lengths);
  const source=await page.evaluate(()=>{const T=__T,S=T.S;S.stage='src';T.fitView();T.render();return document.querySelector('#plan').textContent;});
  assert(!source.includes('Лифтовой холл'));
  await page.locator('[data-common196]').check();
  assert.equal(await page.evaluate(()=>__T.visiblePlan196(__T.S.project).rooms.length),8);
  assert.deepEqual(errors,[]);
  console.log('PASS: four rooms hidden in live views; entrance, full plan and route lengths retained');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
