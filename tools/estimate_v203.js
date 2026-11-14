function workDefault203(k){return /^(plast\.(area|prime\.work|mesh\.work)|putty\.area|ceil\.(area|drop)|wall\.slope\.|sill$|base\||floor\||skirt\.len|wtile\||open\||elec\||light\||hvac\||cab\.|pipe\.|part\..*\.area)/.test(k);}
function workName203(x){
 const names={'plast.area':'Выравнивание стен штукатуркой по маякам','plast.prime.work':'Грунтование перед штукатуркой','plast.mesh.work':'Армирование стен сеткой с заходами','putty.area':'Шпаклевание поверхностей','ceil.drop':'Монтаж натяжного / подвесного потолка','ceil.area':'Отделка окрашиваемого потолка','wall.slope.win':'Отделка оконных откосов','wall.slope.door':'Отделка дверных откосов','skirt.len':'Установка плинтуса','sill':'Установка подоконников'};
 if(names[x.k])return names[x.k];
 if(/^wtile\|/.test(x.k))return 'Облицовка стен: '+x.n.replace(/ — стены$/,'');
 if(/^floor\|/.test(x.k))return 'Укладка: '+x.n;
 if(/^base\|/.test(x.k))return 'Устройство: '+x.n;
 if(/^cab\./.test(x.k))return 'Прокладка: '+x.n;
 if(/^(elec|light|hvac|open)\|/.test(x.k))return 'Монтаж: '+x.n;
 return x.n;
}
function workSection203(x){
 if(/^(elec|frame|light|cab)[.|]/.test(x.k))return ['Электромонтаж',''];
 if(/^(pipe|plumb|hvac)[.|]/.test(x.k))return ['Сантехника и инженерия',''];
 if(/^part\./.test(x.k))return ['Общие работы','Перегородки'];
 if(/^wall\.slope/.test(x.k)||x.k==='sill')return [null,'Откосы и подоконники'];
 if(/^ceil\./.test(x.k))return [null,'Потолок'];
 if(/^(base\||floor[.|]|skirt\.)/.test(x.k))return [null,'Пол'];
 if(/^(plast\.|putty\.|wtile[.|])/.test(x.k))return [null,'Стены'];
 return [null,'Прочие работы'];
}
function simpleEstimate203(p){
 const E=estimate(p),rooms=estimateRooms202(p),each=rooms.map(r=>({r,rows:estimate(p,new Set([r.id])).groups.flatMap(g=>g.rows)})),groups=new Map(),material=[];
 const add=(section,sub,x,q)=>{const key=section+'\n'+sub,g=groups.get(key)||{section,sub,rows:[],total:0};groups.set(key,g);const hard=1+(+p.costK?.hard||0)/100,rate=(x.pw+x.pwx)*hard,c=p.prices?.[x.k]||{},known=x.pw>0||x.pwx>0||c.wSet203===true;const row={...x,n:workName203(x),q,rate,cost:q*rate,known};g.rows.push(row);g.total+=row.cost;};
 for(const g of E.groups)for(const x of g.rows){
  if(x.k==='wall.area'||x.k==='open.border')continue;
  const job=workDefault203(x.k)||x.sw>0;
  if(!job||x.sm>0)material.push({...x,section:g.g,known:x.pm>0||x.pk>0});
  if(!job)continue;
  const [global,sub]=workSection203(x);
  if(global){add(global,sub,x,x.q);continue;}
  const parts=each.map(a=>({r:a.r,x:a.rows.find(z=>z.k===x.k)})).filter(a=>a.x?.q>0),sum=parts.reduce((s,a)=>s+a.x.q,0);
  if(Math.abs(sum-x.q)<Math.max(.00001,x.q*1e-7)){for(const a of parts)add(a.r.name,sub,x,a.x.q);}
  else add('Общие работы',sub,x,x.q); // Unattributed quantities remain explicit, never spread proportionally.
 }
 const order=['Общие работы',...rooms.map(r=>r.name),'Сантехника и инженерия','Электромонтаж'],subOrder=['Перегородки','Стены','Пол','Потолок','Откосы и подоконники','Прочие работы'];
 const list=[...groups.values()].sort((a,b)=>(order.indexOf(a.section)-order.indexOf(b.section))||(subOrder.indexOf(a.sub)-subOrder.indexOf(b.sub)));
 return {E,groups:list,material,missing:list.reduce((s,g)=>s+g.rows.filter(x=>!x.known).length,0),work:list.reduce((s,g)=>s+g.total,0)};
}
function simpleEstimateUI203(p){
 const M=simpleEstimate203(p),mode=S.estimateView203||'work',money=v=>rub(v)+' ₽';
 const nav=`<div class="est203-actions"><button class="btn pri" data-xlsx203>Скачать Excel</button>${[['work','Работы'],['materials','Материалы'],['settings','Объёмы и настройки']].map(([k,n])=>`<button class="btn${mode===k?' pri':''}" data-est-view203="${k}">${n}</button>`).join('')}</div>`;
 const head=`<section class="est203-head"><p>Только квартира. Работы и материалы раздельно.</p>${nav}<p>${M.missing?'Не заданы расценки: '+M.missing+' строк. Итоги показывают только заполненную часть.':'Расценки работ заполнены. Проверьте состав и объёмы.'}</p></section>`;
 if(mode==='settings')return head+estimateOptions202(p)+estRoomsUI(p)+`<details><summary>Подробные расценки, доставка и коэффициенты</summary>${costUI()}</details>`;
 const table=(rows,mat=false)=>`<div class="est203-scroll"><table class="est203-table"><thead><tr><th>${mat?'Материал / оборудование':'Работа'}</th><th>Объём</th><th>Ед.</th><th>Цена, ₽</th><th>Стоимость, ₽</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.n)}${mat&&x.packs?`<small style="display:block">Цена за упаковку ${x.ps} ${esc(x.u)}</small>`:''}</td><td>${q2(x.q)}</td><td>${esc(x.u)}</td><td>${mat?(x.known?money(x.packs?x.pk:x.pm):'<span class="est203-missing">Не задана</span>'):`<input class="num" data-work-rate203="${esc(x.k)}" aria-label="Расценка: ${esc(x.n)}" inputmode="decimal" placeholder="Не задана" value="${x.known?Math.round(x.rate*100)/100:''}">`}</td><td>${x.known?money(mat?x.sm:x.cost):'—'}</td></tr>`).join('')}</tbody></table></div>`;
 if(mode==='materials')return head+`<p class="note">Материалы из расчёта проекта. Расценки и упаковки меняются в подробных настройках. Это план закупки, а не журнал оплаченных покупок.</p>`+table(M.material,true)+`<p class="est203-total">Материалы по заданным ценам: ${money(M.E.mat)}</p>`;
 return head+M.groups.map((g,gi)=>`<details class="est203-group" open><summary>${esc(g.section)}${g.sub?' · '+esc(g.sub):''}</summary>${table(g.rows)}<div class="est203-total">По заполненным расценкам: ${money(g.total)}</div></details>${M.groups[gi+1]?.section!==g.section&&M.groups.filter(x=>x.section===g.section).length>1?`<div class="est203-roomtotal">Итого: ${esc(g.section)} — ${money(M.groups.filter(x=>x.section===g.section).reduce((a,x)=>a+x.total,0))}</div>`:""}`).join('')+`<section class="est203-summary"><div>Работы <b>${money(M.work)}</b></div><div>Материалы <b>${money(M.E.mat)}</b></div><div>Доставка, подъём, вывоз <b>${money(M.E.deliv.sum)}</b></div>${M.E.disc?`<div>Скидка <b>−${money(M.E.disc)}</b></div>`:''}<div class="est203-total">Итого по заданным ценам <b>${money(M.E.total)}</b></div></section>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-est-view203]');if(b){S.estimateView203=b.dataset.estView203;renderSheet();}if(e.target.closest('[data-xlsx203]'))exportEstimate203();});
document.addEventListener('change',e=>{const k=e.target.dataset?.workRate203;if(!k)return;e.stopImmediatePropagation();if(S.ro||window.OBM_RO)return;const p=S.project,x=estimate(p).groups.flatMap(g=>g.rows).find(x=>x.k===k);if(!x)return;
 const c=(p.prices||(p.prices={}))[k]||((p.prices)[k]={}),text=e.target.value.trim(),rate=Number(text.replace(/\s/g,'').replace(',','.')),hard=1+(+p.costK?.hard||0)/100;
 if(!text){delete c.w;delete c.wSet203;}else if(Number.isFinite(rate)&&rate>=0&&hard>0&&rate/hard>=x.pwx){c.w=rate/hard-x.pwx;c.wSet203=true;}else{hint('Проверьте расценку и надбавку за толщину штукатурки');renderSheet();return;}save();renderSheet();
},true);
const renderEstimateBase203=renderSheet;renderSheet=function(){renderEstimateBase203();const on=['ecost','cost'].includes(S.sheet);document.documentElement.classList.toggle('est203-open',on);if(on){document.getElementById('sheetTitle').textContent='Смета ремонта';document.getElementById('sheetBody').innerHTML=simpleEstimateUI203(S.project);}};

function estimateSheets203(p){
 const M=simpleEstimate203(p),rows=[['№','Работа','Объём','Ед.','Расценка, ₽','Стоимость, ₽']],bands=[],merges=[],subtotal=[],sectionTotals=new Map();let num=0;
 const band=label=>{const row=rows.length+1;rows.push([label,'','','','','']);bands.push(row-1);merges.push(`A${row}:F${row}`);};
 for(let gi=0;gi<M.groups.length;gi++){const g=M.groups[gi];band(g.section+(g.sub?' · '+g.sub:''));const start=rows.length+1;
  for(const x of g.rows){const r=rows.length+1;rows.push([++num,x.n,x.q,x.u,x.known?x.rate:'Не задана',{f:`IF(ISNUMBER(E${r}),C${r}*E${r},"")`,v:x.known?x.cost:''}]);}
  const last=rows.length,r=rows.length+1;rows.push(['','Подытог по заполненным расценкам','','','',{f:`SUM(F${start}:F${last})`,v:g.total}]);subtotal.push(r);const a=sectionTotals.get(g.section)||[];a.push(r);sectionTotals.set(g.section,a);
  if(M.groups[gi+1]?.section!==g.section&&a.length>1)rows.push(['','Итого: '+g.section,'','','',{f:a.map(n=>'F'+n).join('+'),v:M.groups.filter(x=>x.section===g.section).reduce((s,x)=>s+x.total,0)}]);
 }
 const material=[['№','Материал / оборудование','Количество','Ед.','Цена, ₽','Сумма, ₽']];
 M.material.forEach((x,i)=>{const r=material.length+1;material.push([i+1,x.n+(x.packs?` (упаковка ${x.ps} ${x.u})`:''),x.q,x.u,x.known?(x.packs?x.pk:x.pm):'Не задана',{f:`IF(ISNUMBER(E${r}),${x.packs?`ROUNDUP(C${r}/${x.ps}-0.000000001,0)*E${r}`:`C${r}*E${r}`},"")`,v:x.known?x.sm:''}]);});
 const matLast=material.length,matTotal=matLast+1;material.push(['','Материалы по заданным ценам','','','',{f:matLast>1?`SUM(F2:F${matLast})`:'0',v:M.E.mat}]);
 band('Итоги объекта');const workRow=rows.length+1;rows.push(['','Работы','','','',{f:subtotal.length?subtotal.map(r=>'F'+r).join('+'):'0',v:M.work}]);const matRow=rows.length+1;rows.push(['','Материалы — отдельный лист','','','',{f:`'Материалы'!F${matTotal}`,v:M.E.mat}]);const delivery=rows.length+1;rows.push(['','Доставка, подъём и вывоз','','','',M.E.deliv.sum]);const disc=rows.length+1;rows.push(['','Скидка',+p.costK?.disc||0,'%',null,{f:`-(F${workRow}+F${matRow}+F${delivery})*C${disc}/100`,v:-M.E.disc}]);rows.push(['','Итого по заданным ценам','','','',{f:`SUM(F${workRow}:F${disc})`,v:M.E.total}]);
 const audit=[['Помещение','Стена','Материал','Длина, м','Высота, м','До вычета, м²','Проёмы, м²','Стены нетто, м²','Сетка с заходами, м²','Заходы, м²']];
 for(const r of estimateRooms202(p))for(const w of wallAudit202(p,r).walls)audit.push([r.name,w.lab,(WALL_MATERIALS202.find(x=>x[0]===w.material)||['','Разные материалы'])[1],w.L/1000,w.H/1000,w.gross/1e6,w.cut/1e6,w.area/1e6,w.meshArea/1e6,w.meshLapArea/1e6]);
 const conditions=[['Условие','Значение'],['Объект',p.name],['Оформление','Самостоятельная структура и формулировки. Расчёты по данным проекта.'],['Неуказанные цены',M.missing+' строк работ. Пустая цена не является нулевой стоимостью: итог предварительный.'],['Материалы','Плановый расход / оборудование, не фактическая оплата. Цена упаковки подписана в названии.'],['Работы','Количество по помещениям распределено только при совпадении с общим расчётом. Нераспределяемые работы показаны в общих разделах.'],['Расценки','В основной таблице показана ставка с заданными надбавками и коэффициентом сложности. Одинаковая работа имеет общую расценку в проекте.'],['Подъезд','Исключён из всех разделов сметы.'],['Потолки','Натяжные потолки не включены в шпаклёвку.'],['Сетка','По материалам и обработанным сторонам стен, заход '+(+p.calc?.meshLap202||.5)+' м на соседний бетон. Пересечения объединены, проёмы вычтены. Т-примыкания проверить отдельно.'],['Проверка','Подтвердите поверхности под штукатурку, шпаклёвку, объёмы откосов и состав каждого вида работ.']];
 return {M,sheets:[{name:'Смета работ',rows,widths:[7,66,15,11,20,24],sectionRows:bands,merges,filter:false},{name:'Материалы',rows:material,widths:[7,72,18,12,22,25]},{name:'Расчёт объёмов',rows:audit,widths:[38,16,27,16,17,19,19,20,25,20]},{name:'Условия',rows:conditions,widths:[32,115]}]};
}
function exportEstimate203(){const {sheets}=estimateSheets203(S.project),blob=excel202(sheets),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fname(S.project.name)+'_смета.xlsx';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);hint('Скачивается смета: работы, материалы и расчёт объёмов.');}
exportEstimate202=exportEstimate203;
