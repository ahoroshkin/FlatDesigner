const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const testPath=path.join(__dirname,'_test199.html');
const anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';
fs.writeFileSync(testPath,fs.readFileSync(path.join(__dirname,'_test.html'),'utf8').replace(anchor,`window.__save199={stub(mode){SYNC.cfg={owner:'test',repo:'private',token:'test',auto:false};syncAll=async()=>{if(mode==='error')return {err:'Тест: нет связи'};if(mode==='busy')return {busy:true};SYNC.map[S.project.id]={sha:'test',updated:S.project.updated};return {pushed:1,copies:0};};}};\n`+anchor));
(async()=>{const b=await chromium.launch();try{
const page=await b.newPage({viewport:{width:1440,height:1000},acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));await page.goto('file://'+testPath);await page.waitForFunction(()=>window.__T?.S.project?.rooms?.length);
const source=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));await page.evaluate(p=>{const T=__T;T.S.project=p;T.S.roomId=p.rooms[1].id;T.render();},source);
await page.click('#btnSaveFile');assert.deepEqual(await page.locator('.save-choice199 b').allTextContents(),['Скачать проект JSON','Скачать HTML с проектом','Сохранить в GitHub']);
await page.screenshot({path:'drawings/save-menu-v199-desktop.png'});
const status=await page.locator('#fileMark').innerText();const dl=page.waitForEvent('download');await page.click('[data-save199="json"]');const download=await dl;assert.match(download.suggestedFilename(),/\.json$/);
const actual=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(actual.id,source.id);assert.deepEqual(actual.net,source.net);assert.deepEqual(actual.serviceRoutes,source.serviceRoutes);assert.equal(await page.locator('#fileMark').innerText(),status);
await page.keyboard.press('Control+s');await page.waitForSelector('#saveDialog199');await page.keyboard.press('Escape');assert.equal(await page.locator('#saveDialog199').count(),0);
await page.click('#btnSaveFile');await page.click('[data-save199="github"]');assert.equal(await page.locator('#saveDialog199').count(),0);assert(await page.locator('#sy_token').count());
await page.evaluate(()=>__T.closeSheet());await page.click('#btnSaveFile');await page.evaluate(()=>window.showSaveFilePicker=undefined);const hd=page.waitForEvent('download');await page.click('[data-save199="html"]');const html=await hd;assert.match(html.suggestedFilename(),/\.html$/);assert(fs.readFileSync(await html.path(),'utf8').includes('const SAVED_JSON='));
for(const [mode,pattern] of [['success',/Проект сохранён в GitHub/],['error',/Не удалось сохранить.*нет связи/],['busy',/уже выполняется/]]){
await page.evaluate(m=>__save199.stub(m),mode);await page.click('#btnSaveFile');await page.click('[data-save199="github"]');await page.waitForFunction(()=>!document.querySelector('[data-save199="github"]').disabled);assert.match(await page.locator('#saveResult199').innerText(),pattern);await page.click('[data-save199="close"]');}
await page.setViewportSize({width:390,height:844});await page.click('#btnSaveFile');const bounds=await page.locator('.save-dialog199').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=390&&bounds.y>=0&&bounds.y+bounds.height<=844);
assert(await page.locator('[data-save199="json"]').isVisible());await page.screenshot({path:'drawings/save-menu-v199-phone.png'});
assert.deepEqual(errors,[]);console.log('PASS: JSON first; actual JSON/HTML downloads; JSON does not change HTML status; Ctrl+S/Escape; GitHub configuration/success/error/busy; 390px layout');
}finally{await b.close();fs.unlinkSync(testPath);}})().catch(e=>{console.error(e);process.exitCode=1;});
