const {chromium}=require('playwright');
const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const browser=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
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
  const scene=()=>page.evaluate(()=>{
   const T=__T,V=T.V3, p=T.S.project;
   const entry=p.rooms.flatMap(r=>r.items).find(i=>i.type==='entry');
   let door=false;
   V.root.traverse(o=>{if(o.isMesh&&o.userData.pick?.iid===entry.id)door=true;});
   return {door,scope:V.scope,roomOptions:[...document.querySelector('#v3room').options].map(o=>o.value),floors:[...new Set(V.floors.map(o=>o.userData.pick.rid))].sort(),size:V.box.size,centered:Math.abs(V.controls.target.x-V.box.cx)<1&&Math.abs(V.controls.target.z-V.box.cy)<1};
  });
  await page.evaluate(()=>{const T=__T;T.V3.scope=T.S.project.rooms.find(T.commonRoom196).id;T.V3.cam='iso';T.open3D();});
  const apt3d=await scene();
  const apartment=input.rooms.filter(r=>!['Общий коридор 7 этажа','Лифтовой холл','Проход к сплит-шахте','Сплит-шахта'].includes(r.name)).map(r=>r.id).sort();
  assert.deepEqual(apt3d.floors,apartment);
  assert.deepEqual(apt3d.roomOptions.sort(),['all',...apartment].sort());
  assert.equal(apt3d.scope,'all');
  assert(apt3d.door);
  assert(apt3d.centered);
  await page.evaluate(()=>__T.close3D());
  await page.locator('[data-common196]').check();
  assert.equal(await page.evaluate(()=>__T.visiblePlan196(__T.S.project).rooms.length),8);
  await page.evaluate(()=>__T.open3D());
  const full3d=await scene();
  assert.deepEqual(full3d.floors,input.rooms.map(r=>r.id).sort());
  assert(full3d.size>apt3d.size);
  assert(full3d.door);
  await page.evaluate(()=>__T.close3D());
  assert.deepEqual(errors,[]);
  console.log('PASS: four common rooms hidden in 2D and 3D; entrance and full drawings retained, routes unchanged');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
