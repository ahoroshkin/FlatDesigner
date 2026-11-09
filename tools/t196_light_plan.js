const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const b=await chromium.launch();
 try{
  const page=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.setDefaultTimeout(8000);
  await page.addInitScript(id=>{
   localStorage.setItem('obmerka-tour','1');
   localStorage.setItem('obmerka-apartment-view:'+id,'1');
  },input.id);
  await page.goto(pathToFileURL(path.join(__dirname,'_test.html')).href);
  await page.waitForFunction(()=>__T.S.project?.rooms?.length);
  const ids=await page.evaluate(p=>{
   const T=__T,S=T.S;S.project=p;S.roomId=p.rooms[0].id;
   T.workPick('lite');
   return {mode:S.vmode,room:p.rooms.find(r=>r.name==='Комната 14,7').id};
  },input);
  assert.equal(ids.mode,'ceil');
  await page.evaluate(()=>__T.roomMenu());
  await page.locator('[data-roomall]').click();
  assert(await page.evaluate(()=>__T.S.vmode==='plan'&&__T.roomsAllOn()));
  // Re-entering "Свет" must keep the common plan selected.
  await page.evaluate(()=>__T.workPick('lite'));
  const state=()=>page.evaluate(({room})=>{
   const T=__T,S=T.S,r=S.project.rooms.find(r=>r.id===room),it=r.items.find(it=>it.type==='spot');
   const clearance=q=>Math.min(...r.points.map((a,i)=>T.projSeg(q,a,r.points[(i+1)%r.points.length]).dist));
   const q=T.arrPts(it).filter(p=>T.inPoly(p,r.points)).sort((a,b)=>clearance(b)-clearance(a))[0],pt=T.W2S(S.view,q),rc=document.querySelector('#plan').getBoundingClientRect();
   return {x:it.x,y:it.y,point:[pt[0]+rc.left,pt[1]+rc.top],mode:S.vmode,all:T.roomsAllOn(),room:S.roomId,sheet:S.sheet,selected:S.sel?.kind==='item'?T.room().items[S.sel.i]?.id:null,id:it.id,scale:S.view.s};
  },ids);
  const start=await state();
  assert(start.all&&start.mode==='plan'&&start.room!==ids.room);
  await page.mouse.click(...start.point);
  const selected=await state();
  assert.equal(selected.sheet,'item');
  assert.equal(selected.room,ids.room);
  assert.equal(selected.selected,selected.id);
  assert(selected.all&&selected.mode==='plan'&&selected.scale===start.scale);
  await page.evaluate(()=>__T.closeSheet());
  await page.waitForTimeout(300);
  const from=await state();
  await page.mouse.move(...from.point);await page.mouse.down();
  await page.mouse.move(from.point[0]+32,from.point[1]-8,{steps:8});await page.mouse.up();
  const moved=await state();
  assert(moved.x!==from.x||moved.y!==from.y);
  assert(moved.all&&moved.mode==='plan'&&moved.scale===start.scale);
  await page.evaluate(()=>{__T.S.editLayers195={ceil:false};__T.S.sel=null;});
  await page.mouse.click(...moved.point);
  assert.notEqual((await state()).sheet,'item');
  await page.evaluate(()=>__T.roomMenu());
  await page.locator('[data-room="'+ids.room+'"]').click();
  assert.equal((await state()).mode,'ceil');
  assert.deepEqual(errors,[]);
  console.log('PASS: full-apartment lighting view, tap and drag across rooms, layer lock and single-room ceiling');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
