/* v196: reuse the existing geometry and permission handlers; only reorganize their UI. */
const lightPlan196=()=>S.work==='lite'&&S.stage==='final'&&['plan','flat'].includes(S.vmode);
function selectLightRoom196(id){
 const keep=lightPlan196()&&roomsAllOn();
 S.roomId=id;
 if(keep) S.roomsAllFor=id;
}
const layersBase196=layersUI;
layersUI=function(r){
 const box=document.createElement('div');box.innerHTML=layersBase196(r);
 const table=box.querySelector('.layer195'),old=box.querySelector('details');
 const main=document.createElement('section');main.className='display196';
 main.innerHTML=commonSwitch196(S.project)+`<div class="btnrow">${VIEW_PRESETS.map(([k,n,d])=>`<button class="btn" data-act="vpreset" data-pr="${k}" title="${esc(d)}">${n}</button>`).join('')}</div><label class="row"><input type="checkbox" data-labels196 ${S.labels?'checked':''}> Подписи объектов</label><label class="row"><input type="checkbox" id="lay_sdims" ${S.stageDims!==false?'checked':''}> Размеры исходного плана</label><label class="row"><input type="checkbox" id="lay_dimall" ${S.dimAll?'checked':''}> Размеры всех помещений</label>`;
 const names=box.querySelector('#lay_names');if(names)main.append(names.closest('label'));
 const title=document.createElement('h3');title.textContent='Слои: экран, правка, печать';main.append(title,table);
 if(old){old.querySelectorAll('[id^="lay_"]').forEach(el=>{if(main.querySelector('#'+el.id))el.closest('label')?.remove();});main.append(old);}
 const views=document.createElement('details');views.innerHTML='<summary>Вид чертежа и масштаб подписей</summary><div class="btnrow">'+[['plan','План'],['flat','Весь этаж'],['wall','Развёртка'],['floor','Пол'],['ceil','Потолок']].map(([v,n])=>`<button class="btn" data-view196="${v}">${n}</button>`).join('')+'<button class="btn" data-type196>Размер шрифта и значков</button></div>';main.append(views);return main.outerHTML;
};
const bbBase196=bbUI195;
bbUI195=function(r){let s=bbBase196(r);const a=s.indexOf('<span class="lbl">Система скрытого монтажа'),b=s.indexOf('<details><summary>Участки');if(a>=0&&b>a)s=s.slice(0,a)+'<details class="bbLED196"><summary>Монтажный профиль, вставка и подсветка</summary>'+s.slice(a,b)+'</details>'+s.slice(b);const start=s.indexOf('<label class="field"><span>Ссылка'),end=s.indexOf('<details class="bbLED196"');if(start>=0){const stop=end>start?end:s.indexOf('<details><summary>Участки',start);if(stop>start)s=s.slice(0,start)+'<details><summary>Товар и каталог</summary>'+s.slice(start,stop)+'</details>'+s.slice(stop);}return s;};
function details196(body,keep){const nodes=[...body.childNodes],basic=document.createElement('section'),detail=document.createElement('details');basic.className='essentials196';detail.className='advanced196';detail.innerHTML='<summary>Дополнительно</summary>';for(const n of nodes){if(n.nodeType===1&&(keep(n)||n.matches('.snav')))basic.append(n);else detail.append(n);}body.append(basic,detail);return basic;}
function compact196(){const body=$('#sheetBody');if(!body||body.dataset.ux196==='1')return;body.dataset.ux196='1';
 if(S.sheet==='layers')$('#sheetTitle').textContent='Отображение';
 if(['projects','fieldmore195'].includes(S.sheet))body.insertAdjacentHTML('afterbegin',`<section class="update196"><b>Обмерка ${APP_VER}</b><p>Обновление приложения не требует токена. Токен нужен для синхронизации ваших рабочих планов и сохраняется отдельно на каждом устройстве.</p><button class="btn" data-update196>Открыть актуальную версию</button><span role="status" id="updateStatus196"></span></section>`);
 if(S.sheet==='srcwallE'&&body.querySelector('#sw_len')){
 const basic=details196(body,n=>!!n.querySelector('#sw_len,[data-act="srclen"],#sw_keep')||n.matches('.snav'));
 const label=document.createElement('p');label.className='selected196';label.textContent='Выбрана исходная стена · '+(srcWallInner(S.project,S.sel.id)?.name||room().name);basic.prepend(label);
 const controls=document.createElement('div');controls.className='step196';controls.innerHTML='<button class="btn" data-step196="-10">−10 мм</button><button class="btn" data-step196="10">+10 мм</button><span>Изменить значение, затем выбрать движущийся конец</span>';basic.querySelector('#sw_len').closest('.row')?.after(controls);
 basic.querySelectorAll('[data-act="srclen"]').forEach(b=>{b.classList.add('apply196');b.title='Применить длину и '+b.textContent.trim().toLowerCase();});
 }
 if(S.sheet==='srcnode'&&body.querySelector('#sn_x'))details196(body,n=>!!n.querySelector('#sn_x,#sn_y,[data-act="srcnodexy"],#sn_step,[data-act="srcnode"]'));
 if(S.sheet==='item'){
 const rows=[...body.children];if(rows.length>8)details196(body,n=>rows.indexOf(n)<5||!!n.querySelector('[data-act="del"],[data-act="done"]'));
 }
 body.querySelectorAll('details').forEach((d,i)=>{const key=S.sheet+':'+i;if(S.details196?.[key])d.open=true;d.addEventListener('toggle',()=>{(S.details196||(S.details196={}))[key]=d.open;});});
}
const sheetBase196=renderSheet;renderSheet=function(){sheetBase196();compact196();};
function decoration196(){const b=$('#btnLayers');if(b){b.title='Отображение: размеры, подписи и слои';b.setAttribute('aria-label','Отображение');}let badge=$('#selection196');if(!badge){badge=document.createElement('div');badge.id='selection196';badge.setAttribute('role','status');document.querySelector('.stage')?.append(badge);}const kind=S.serviceDrag?'Точка трассы':S.sel?.kind;const names={srcnode:'Угол исходного плана',srcwallE:'Стена исходного плана',item:'Объект',wall:'Стена',vertex:'Угол'};if(badge){badge.textContent=kind?(names[kind]||'Выбран элемент'):'';badge.hidden=!kind;}}
const renderBase196=render;render=function(){renderBase196();decoration196();};
document.addEventListener('change',e=>{if(e.target.matches('[data-labels196]')){S.labels=e.target.checked;render();}},true);
document.addEventListener('click',async e=>{
 const step=e.target.closest('[data-step196]');if(step){const input=$('#sw_len');if(input&&!input.disabled){input.value=(parseFloat(input.value)||0)+Number(step.dataset.step196);input.dispatchEvent(new Event('input',{bubbles:true}));}return;}
 const v=e.target.closest('[data-view196]');if(v){setVMode(v.dataset.view196);closeSheet();return;}
 if(e.target.closest('[data-type196]')){uiMenu();return;}
 if(e.target.closest('[data-update196]')){const out=$('#updateStatus196');try{if(out)out.textContent='Сохраняю рабочий план…';clearTimeout(saveT);await putProject(JSON.parse(JSON.stringify(S.project)));await setMeta('last',S.project.id);if(!storageOK)throw Error('Хранилище недоступно. Сначала сохраните план в файл.');if(location.protocol==='file:'){if(out)out.textContent='Открываю сайт. Локальный план остаётся в этом браузере файла; для переноса сохраните JSON.';saveToFile();window.open('https://ahoroshkin.github.io/FlatDesigner/?update='+Date.now(),'_blank','noopener');}else{const u=new URL(location.href);u.searchParams.set('update',Date.now());location.assign(u.href);}}catch(err){if(out)out.textContent='Обновление остановлено: '+err.message;}return;}
},true);
// Collapse only after successful numeric measurement. Existing validation/undo/guards stay in charge.
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="srclen"]');if(!b||S.uiMode!=='field')return;const id=S.sel?.id,value=Number($('#sw_len')?.value),view={...S.view};setTimeout(()=>{const result=srcWallInner(S.project,id);if(result&&Math.abs(result.len-value)<1){closeSheet();S.view=view;render();hint('Замер сохранён. Выберите следующую стену.');}},0);},true);
// A noninteractive SVG crop follows the finger. It does not participate in hit testing.
let loupe196=null,loupePointer196=null,loupeFrame196=0;
function hideLoupe196(){if(loupe196)loupe196.hidden=true;loupePointer196=null;cancelAnimationFrame(loupeFrame196);}
function drawLoupe196(e){const active=S.serviceDrag||drag?.hit&&['srcnode','srcwallE','vertex'].includes(drag.hit.kind);if(!active)return;const plan=$('#plan'),rc=plan.getBoundingClientRect();if(!loupe196){loupe196=document.createElement('div');loupe196.id='loupe196';loupe196.setAttribute('aria-hidden','true');document.body.append(loupe196);}const clone=plan.cloneNode(true);clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));const vb=plan.viewBox.baseVal, sx=(vb.width||rc.width)/rc.width,sy=(vb.height||rc.height)/rc.height,x=(e.clientX-rc.left)*sx+(vb.x||0),y=(e.clientY-rc.top)*sy+(vb.y||0);clone.setAttribute('viewBox',`${x-30*sx} ${y-25*sy} ${60*sx} ${50*sy}`);clone.setAttribute('width','120');clone.setAttribute('height','100');clone.style.cssText='width:120px;height:100px;pointer-events:none';loupe196.replaceChildren(clone);loupe196.hidden=false;loupe196.style.left=Math.max(4,Math.min(innerWidth-128,e.clientX-60))+'px';loupe196.style.top=Math.max(4,e.clientY-140)+'px';}
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&e.target.closest('#plan'))loupePointer196=e.pointerId;},true);
document.addEventListener('pointermove',e=>{if(e.pointerId!==loupePointer196)return;cancelAnimationFrame(loupeFrame196);loupeFrame196=requestAnimationFrame(()=>drawLoupe196(e));},true);
['pointerup','pointercancel','lostpointercapture'].forEach(k=>document.addEventListener(k,hideLoupe196,true));window.addEventListener('blur',hideLoupe196);
