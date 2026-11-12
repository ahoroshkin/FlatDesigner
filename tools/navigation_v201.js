// Navigation changes never rewrite the working project.
function planTabs201(){
 let nav=document.getElementById('planTabs201');
 if(!nav){nav=document.createElement('nav');nav.id='planTabs201';nav.setAttribute('aria-label','Этапы планировки');document.getElementById('rooms').after(nav);}
 const group=wgOf(S.work||'rooms');nav.hidden=S.uiMode==='field'||group?.k!=='plan';
 nav.innerHTML=WORK_GROUPS.find(g=>g.k==='plan').items.map(([k,n])=>`<button class="roomchip${(S.work||'rooms')===k?' on':''}" data-work="${k}"${(S.work||'rooms')===k?' aria-current="page"':''}>${n}</button>`).join('');
}
const renderRoomsBase201=renderRooms;renderRooms=function(){renderRoomsBase201();planTabs201();};
function structureTarget201(r,it){
 if(!it&&S.sel?.kind==='netnode')return isOldNode(S.project,S.sel.id)?'src':'part';
 const wid=it?(it.wid||(r?.wids||[])[it.wall]):S.sel?.id||(r?.wids||[])[S.sel?.i];
 return wid&&srcOf(S.project)&&!isOldWall(S.project,wid)?'part':'src';
}
const renderSheetBase201=renderSheet;renderSheet=function(){
 renderSheetBase201();
 if(S.sheet==='out')document.getElementById('sheetTitle').textContent='Чертежи и ведомости';
 if(S.stage!=='final'||S.work!=='rooms')return;
 const r=room(),it=S.sel?.kind==='item'&&r?.items[S.sel.i],opening=S.sheet==='item'&&it&&(byType[it.type]||{}).opening;
 const wall=['netwall','netnode','wall','vertex','borrowed'].includes(S.sel?.kind)&&['netwall','netnode','wall','vertex','borrowed','contour'].includes(S.sheet);
 if(!opening&&!wall)return;
 const body=document.getElementById('sheetBody');if(!body||body.querySelector('[data-structure201]'))return;
 body.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=true);
 const target=structureTarget201(r,it),label=target==='part'?'Изменить в перегородках':'Изменить в исходном плане';
 body.insertAdjacentHTML('afterbegin',`<section class="structure201" data-structure201><b>Итоговый план — только просмотр конструкции</b><p>Стены, перегородки, двери, окна и проёмы здесь не изменяются.</p><button class="btn" data-edit-stage201="${target}">${label}</button></section>`);
};
document.addEventListener('click',e=>{const tab=e.target.closest('#planTabs201 [data-work]');if(tab){workPick(tab.dataset.work);return;}const b=e.target.closest('[data-edit-stage201]');if(b){workPick(b.dataset.editStage201);}});
