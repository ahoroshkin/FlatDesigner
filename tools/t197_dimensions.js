const {chromium}=require('playwright');
const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
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
   localStorage.setItem('obmerka-sdims','1');
   localStorage.setItem('obmerka-dimall','0');
  },input.id);
  await page.goto(pathToFileURL(path.join(__dirname,'_test.html')).href);
  await page.waitForFunction(()=>__T.S.project?.rooms?.length);
  await page.evaluate(p=>{const T=__T,S=T.S;S.project=p;S.roomId=p.rooms[1].id;T.workPick('rooms');T.fitView();T.roomMenu();},input);
  await page.locator('[data-roomall]').click();
  await page.evaluate(()=>__T.openSheet('layers'));
  const master=page.locator('#sheetBody #lay_sdims'), all=page.locator('#sheetBody #lay_dimall');
  assert.match(await master.locator('..').innerText(),/Показывать размеры/);
  const count=k=>page.locator('#plan ['+k+']').count();
  assert.equal(await count('data-room-dim197'),1);
  assert.equal(await page.locator('#plan [data-room-dim197]').getAttribute('data-room-dim197'),input.rooms[1].id);
  await all.check(); assert.equal(await count('data-room-dim197'),4);
  await master.uncheck(); assert.equal(await count('data-room-dim197'),0);
  assert(await page.evaluate(()=>__T.roomsAllOn()));
  assert.match(await page.locator('#plan').textContent(),/Окно|ВХ|ДВ/);
  assert(await page.evaluate(()=>{const T=__T,S=T.S;return T.netPlanSVG(S.project,S.view,1500,900,T.PRINT_PAL,{roomDims:true,live:false,zoom:false}).includes('data-room-dim197');}));
  await master.check(); assert.equal(await count('data-room-dim197'),4);
  await all.uncheck(); assert.equal(await count('data-room-dim197'),1);

  await page.evaluate(()=>{const T=__T;T.workPick('src');T.openSheet('layers');});
  assert.equal(await count('data-stage-dim197'),1);
  await all.check(); assert.equal(await count('data-stage-dim197'),4);
  await master.uncheck(); assert.equal(await count('data-stage-dim197'),0);
  assert(await page.evaluate(()=>{const T=__T,S=T.S;return T.stageSVG(S.project,S.view,1500,900,T.PRINT_PAL,'src',{grid:false,print:true}).includes('data-stage-dim197');}));
  for(const work of ['dem','part']){
   await page.evaluate(w=>{const T=__T;T.workPick(w);T.openSheet('layers');},work);
   assert.equal(await count('data-stage-dim197'),0);
   await master.check(); assert.equal(await count('data-stage-dim197'),4);
   await master.uncheck();
  }

  await page.evaluate(()=>{const T=__T;T.S.roomsAll=false;T.workPick('lite');T.openSheet('layers');});
  assert.equal(await count('data-ceil-dim197'),0);
  await master.check(); assert.equal(await count('data-ceil-dim197'),1);
  await master.uncheck();
  assert(await page.evaluate(()=>__T.ceilSVG(__T.room(),1200,850,__T.PRINT_PAL).includes('data-ceil-dim197')));
  await page.evaluate(()=>__T.setVMode('wall'));
  assert.equal(await count('data-elev-dim197'),0);
  await master.check(); assert.equal(await count('data-elev-dim197'),1);
  await master.uncheck();
  assert(await page.evaluate(()=>__T.elevSVG(__T.room(),0,1200,850,__T.PRINT_PAL).includes('data-elev-dim197')));
  await page.evaluate(()=>__T.setVMode('floor'));
  assert.equal(await count('data-room-dim197'),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: both checkboxes, all rooms, original/demolition/partitions, ceiling/elevation/floor, prints unaffected');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
