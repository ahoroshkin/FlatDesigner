const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const b=await chromium.launch();
 try{
 const page=await b.newPage({viewport:{width:1550,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.setDefaultTimeout(8000);
 await page.addInitScript(id=>{
  localStorage.setItem('obmerka-tour','1');
  localStorage.setItem('obmerka-apartment-view:'+id,'1');
 },input.id);
 await page.goto(pathToFileURL(path.join(__dirname,'_test.html')).href);
 await page.waitForFunction(()=>__T.S.project?.rooms?.length);
 await page.evaluate(p=>{
  const T=__T,S=T.S;S.project=p;S.roomId=p.rooms.find(r=>r.name==='Комната 14,7').id;
  T.workPick('lite');
  const r=T.room();S.sel={kind:'item',i:r.items.findIndex(i=>i.type==='spot')};T.render();
 },input);
 const state=()=>page.evaluate(()=>{const T=__T,S=T.S,it=T.room().items[S.sel?.i];return {x:it?.x,y:it?.y,ang:it?.arr?.ang,sx:it?.arr?.sx,sy:it?.arr?.sy,scale:S.view.s};});
 async function drag(k,dx,dy){
  const dot=page.locator('#plan [data-array-handle="'+k+'"]');
  assert.equal(await dot.count(),1);
  const box=await dot.boundingBox();assert(box);
  const x=box.x+box.width/2,y=box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:8});await page.mouse.up();
  assert.equal(await dot.count(),1,'selection retained after '+k);
 }
 async function checkHandles(){
  const a=await state();await drag('mv',22,10);
  const m=await state();assert(m.x!==a.x||m.y!==a.y);
  await drag('rot',-25,34);const r=await state();assert.notEqual(r.ang,m.ang);
  await drag('sx',30,15);const z=await state();assert.notEqual(z.sx,r.sx);
  assert.equal(z.scale,a.scale);
 }
 await checkHandles();
 await page.evaluate(()=>__T.roomMenu());
 await page.locator('[data-roomall]').click();
 await page.evaluate(()=>{const T=__T,r=T.room();T.S.sel={kind:'item',i:r.items.findIndex(i=>i.type==='spot')};T.render();});
 await checkHandles();
 assert(await page.evaluate(()=>__T.roomsAllOn()));
 await page.evaluate(()=>{const T=__T;T.S.editLayers195={ceil:false};T.render();});
 assert.equal(await page.locator('#plan [data-array-handle]').count(),0);
 await page.evaluate(()=>{__T.S.editLayers195={};});
 console.log('PASS: moving, rotating and stretching a grid in both views; locked layer has no handles');
 // Pause a real asynchronous save path after the HTML blob has been prepared.
 await page.evaluate(()=>{
  const T=__T;
  window.__writes=[];
  window.showSaveFilePicker=async()=>({name:'test.html',createWritable:async()=>({
   write:async blob=>{
    window.__writes.push(await blob.text());
    if(window.__writes.length===1)await new Promise(resolve=>window.__resumeWrite=resolve);
   },close:async()=>{}
  })});
  window.__saving=T.saveToFile();
 });
 await page.waitForFunction(()=>window.__resumeWrite);
 assert.match(await page.locator('#fileMark [data-saved197="html"]').innerText(),/выгрузка/);
 const stamps=await page.evaluate(async()=>{
  const T=__T, match=window.__writes[0].match(/^const SAVED_JSON=(.*);$/m);
  const before=JSON.parse(JSON.parse(match[1]));
  T.S.project.notes='Изменено во время записи';
  T.save();const after=T.S.project.updated;
  window.__resumeWrite();await window.__saving;
  return {file:before.updated,after,note:before.notes};
 });
 assert(stamps.after>stamps.file);
 assert.notEqual(stamps.note,'Изменено во время записи');
 await page.waitForFunction(()=>document.querySelector('#fileMark [data-saved197="local"]').classList.contains('good'));
 assert.match(await page.locator('#fileMark [data-saved197="html"]').innerText(),/новые правки/);
 assert.equal(await page.locator('#fileMark [data-saved197="html"].good').count(),0);
 await page.evaluate(()=>__T.saveToFile());
 assert.equal(await page.locator('#fileMark [data-saved197="html"].good').count(),1);
 const after=await page.evaluate(()=>__T.S.project.updated);
 await page.evaluate(async()=>{window.showSaveFilePicker=async()=>{throw new DOMException('cancel','AbortError');};await __T.saveToFile();});
 assert.equal(await page.evaluate(()=>__T.S.project.updated),after);
 assert.equal(await page.locator('#fileMark [data-saved197="html"].good').count(),1);
 await page.evaluate(()=>{window.showSaveFilePicker=undefined;});
 const download=page.waitForEvent('download');
 await page.evaluate(()=>__T.saveToFile());await download;
 assert.match(await page.locator('#fileMark [data-saved197="html"]').innerText(),/скачивание запущено/);
 assert.deepEqual(errors,[]);
 console.log('PASS: HTML snapshot, edit during write, separate status, successful write, cancel and download');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
