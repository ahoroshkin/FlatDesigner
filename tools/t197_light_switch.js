const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const p=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
 const b=await chromium.launch();
 try{
  const page=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));
  await page.goto(pathToFileURL(path.join(__dirname,'_test.html')).href);
  await page.waitForFunction(()=>__T.S.project?.rooms?.length);
  await page.evaluate(p=>{const T=__T;T.S.project=p;T.S.roomId=p.rooms[1].id;T.workPick('lite');T.closeSheet();},p);
  const select=(rid,id,mode)=>page.evaluate(({rid,id,mode})=>{
   const T=__T,S=T.S;S.roomId=rid;T.setVMode(mode);
   S.sel={kind:'item',i:T.room().items.findIndex(x=>x.id===id)};
   T.openSheet('item');T.render();
  },{rid,id,mode});
  const tags=()=>page.locator('#plan [data-light-switch197]').evaluateAll(a=>a.map(e=>[e.dataset.lightSwitch197,e.dataset.lightKeys197]));
  const card=()=>page.locator('[data-light-controls197]').innerText();
  await select(p.rooms[1].id,'fom55jei','ceil');
  assert.deepEqual(await tags(),[['92h4p39o','П1·К2']]);
  assert.match(await card(),/Л11.*клавиша 2/s);
  await select(p.rooms[1].id,'fom55jei','plan');
  assert.deepEqual(await tags(),[['92h4p39o','П1·К2']]);
  assert.equal(await page.evaluate(()=>__T.S.layers.elec),false,'light mode still filters unrelated switches');
  await select(p.rooms[0].id,'kk1h12bp','ceil');
  assert.deepEqual(await tags(),[]);
  assert.match(await card(),/Коридор, кухня-ниша, столовая.*клавиша 1/s);
  await select(p.rooms[0].id,'kk1h12bp','plan');
  assert.deepEqual(await tags(),[['ya75vksk','К1']]);
  // Emulate the second control for the same group only in this disposable browser.
  await page.evaluate(()=>{
   const T=__T,p=T.S.project;
   p.rooms[1].items.find(i=>i.id==='ya75vksk').pass=true;
   const other=p.rooms[2].items.find(i=>i.id==='a4iao5yp');
   other.kg=['Л13'];other.pass=true;
   T.renderSheet();T.render();
  });
  assert.deepEqual(await tags(),[['ya75vksk','К1'],['a4iao5yp','К1']]);
  assert.equal((await card()).match(/проходная/g).length,2);
  await page.evaluate(()=>{const T=__T,S=T.S;T.room().items[S.sel.i].lg='';T.renderSheet();T.render();});
  assert.deepEqual(await tags(),[]);
  assert.match(await card(),/Выключатель не назначен/);
  await page.evaluate(()=>{const T=__T;T.S.sel=null;T.render();});
  assert.deepEqual(await tags(),[]);
  assert.deepEqual(errors,[]);
  console.log('PASS: second key, another room, two pass-through switches, unassigned light, cleared selection');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
