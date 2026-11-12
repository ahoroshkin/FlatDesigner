const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();try{
 const page=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('obmerka-tour','1'));await page.goto('file://'+path.join(__dirname,'_test.html'));await page.waitForFunction(()=>window.__T?.S.project?.rooms?.length);
 const source=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));await page.evaluate(p=>{const T=__T;T.S.project=p;T.S.roomId=p.rooms[1].id;T.workPick('rooms');T.fitView();T.render();},source);
 await page.waitForSelector('#dock195 button');assert.deepEqual(await page.locator('#dock195 button').allTextContents(),['План','Развёртки','3D']);assert.deepEqual(await page.locator('#planTabs201 button').allTextContents(),['Исходный план','Демонтаж','Новые перегородки','Итоговый план']);
 await page.click('[data-wg="sum"]');assert.equal(await page.locator('#wgmenu button').first().innerText(),'Чертежи и ведомости');await page.click('[data-wgi="drawings"]');assert.equal(await page.evaluate(()=>__T.S.sheet),'out');assert.equal(await page.locator('#planTabs201').isVisible(),false);await page.screenshot({path:'drawings/navigation-v201-drawings.png'});
 await page.evaluate(()=>{const T=__T;T.workPick('rooms');const r=T.room(),i=r.items.findIndex(x=>T.byType[x.type]?.opening);T.S.sel={kind:'item',i};T.openSheet('item');T.render();});
 assert.equal(await page.locator('[data-structure201]').count(),1);assert.equal(await page.locator('#f_w').isDisabled(),true);
 const before=await page.evaluate(()=>JSON.stringify(__T.S.project));await page.locator('#plan').click({position:{x:20,y:20}});await page.evaluate(()=>{const T=__T,r=T.room();T.S.sel={kind:'item',i:r.items.findIndex(x=>T.byType[x.type]?.opening)};T.openSheet('item');});await page.keyboard.press('ArrowRight');await page.keyboard.press('Delete');assert.equal(await page.evaluate(()=>JSON.stringify(__T.S.project)),before);
 await page.click('[data-edit-stage201]');assert(['src','part'].includes(await page.evaluate(()=>__T.S.stage)));
 await page.click('#planTabs201 [data-work="rooms"]');assert.equal(await page.evaluate(()=>__T.wallsLocked()),true);
 await page.evaluate(()=>{__T.openSheet('layers');});assert.equal(await page.locator('[data-structure201]').count(),0,'view controls must remain usable');
 await page.evaluate(()=>__T.closeSheet());await page.screenshot({path:'drawings/navigation-v201-plan.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);assert.equal(await page.locator('#planTabs201').isVisible(),false);assert.deepEqual(await page.locator('#dock195 button').allTextContents(),['Замеры','Проёмы','Фото','Ещё']);await page.screenshot({path:'drawings/navigation-v201-phone.png'});
 assert.deepEqual(errors,[]);console.log('PASS: bottom views only; drawings in Results; four plan stages; final opening fields/arrows/delete locked; edit transition; layers stay usable; compact phone field mode');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
