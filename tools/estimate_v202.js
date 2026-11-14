// All calculations use drawing copies; saved geometry is never rewritten.
function estimateRooms202(p){const off=estOff(p);return (p.rooms||[]).filter(r=>r.points?.length>2&&!commonRoom196(r)&&!off[r.id]);}
function estimateScope202(p,rooms=estimateRooms202(p)){
 const ids=new Set(rooms.flatMap(r=>r.wids||[]).filter(Boolean));
 const other=new Set((p.rooms||[]).filter(r=>!rooms.includes(r)).flatMap(r=>r.wids||[]).filter(Boolean));
 const keep=w=>ids.has(w.id)||!other.has(w.id),prune=net=>net?{...net,walls:net.walls.filter(keep)}:net;
 return {...p,rooms,net:prune(p.net),...(p.src?.net?{src:{...p.src,net:prune(p.src.net)}}:{})};
}
function ceilingKind202(p,r){return r.estimateCeiling202||(/кв[.\s_-]*109\b/i.test(p.name||'')?'stretch':(+r.dropC>0?'suspended':'paint'));}
function cutArea202(cuts){
 const xs=[...new Set(cuts.flatMap(c=>[c.t1,c.t2]))].sort((a,b)=>a-b);let area=0;
 for(let i=1;i<xs.length;i++){const l=xs[i-1],u=xs[i],ys=cuts.filter(c=>c.t1<u&&c.t2>l).map(c=>[c.h1,c.h2]).sort((a,b)=>a[0]-b[0]);let end=-Infinity,len=0;for(const [a,b] of ys){len+=Math.max(0,b-Math.max(a,end));end=Math.max(end,b);}area+=(u-l)*len;}
 return area;
}
const WALL_MATERIALS202=[['','Не указан'],['concrete','Бетон'],['foam','Пеноблок / газобетон'],['brick','Кирпич'],['pgp','ПГП'],['gkl','ГКЛ'],['other','Другой']];
function wallMaterial202(p,id){const w=wallById(p,id)||p.src?.net?.walls.find(w=>w.id===id);return w?.material202||(/^gas/.test(w?.mat||'')?'foam':/^brick/.test(w?.mat||'')?'brick':/^gkl/.test(w?.mat||'')?'gkl':/^pgp/.test(w?.mat||'')?'pgp':'');}
function assignMaterial202(p,ids,value){for(const net of [p.net,p.src?.net])for(const w of net?.walls||[])if(ids.includes(w.id)){if(value)w.material202=value;else delete w.material202;}}
function materialSelect202(value,attrs){return `<select ${attrs}>${value==='mixed'?'<option value="mixed" selected disabled>Разные материалы</option>':''}${WALL_MATERIALS202.map(([v,n])=>`<option value="${v}"${value===v?' selected':''}>${n}</option>`).join('')}</select>`;}
function intervalNet202(w,intervals){
 const xs=[...new Set(intervals.flat())].sort((a,b)=>a-b);let area=0;
 for(let i=1;i<xs.length;i++){const a=xs[i-1],b=xs[i];if(!intervals.some(([l,u])=>l<b&&u>a))continue;area+=(b-a)*w.H-cutArea202(w.cuts.map(c=>({...c,t1:Math.max(a,c.t1),t2:Math.min(b,c.t2)})).filter(c=>c.t2>c.t1));}
 return Math.max(0,area);
}
function wallAudit202(p,r){
 const wr=wallRoom(r),all=plWalls(r).map(w=>{
  const H=r.ceiling||2700,cuts=w.cuts.map(c=>({...c,h2:Math.min(H,c.h2)})),gross=w.L*H,cut=cutArea202(cuts),edges=wr.__edges?.[w.k]||[w.k];
  const ids=edges.map(i=>(r.wids||[])[i]).filter(Boolean),mats=[...new Set(ids.map(id=>wallMaterial202(p,id)))],material=mats.length===1?mats[0]:'mixed';
  const mesh=w.wo.mesh202===true||w.wo.mesh202===false?w.wo.mesh202:material==='foam'?true:material&&material!=='mixed'?false:null;
  return {...w,H,cuts,gross,cut,area:Math.max(0,gross-cut),mesh,material,ids,rid:r.id,room:r.name};
 });
 const lap=Math.max(.5,Math.min(1,+p.calc?.meshLap202||.5))*1000;
 for(const w of all){const intervals=[];if(w.on&&w.mesh===true)intervals.push([0,w.L]);
  if(w.on&&w.material==='concrete'&&w.wo.mesh202!==false){const prev=all.find(x=>x.k===(w.k+wr.points.length-1)%wr.points.length),next=all.find(x=>x.k===(w.k+1)%wr.points.length);
   if(prev?.on&&prev.material==='foam'&&prev.mesh===true)intervals.push([0,Math.min(lap,w.L)]);
   if(next?.on&&next.material==='foam'&&next.mesh===true)intervals.push([Math.max(0,w.L-lap),w.L]);
  }
  w.meshArea=w.on?intervalNet202(w,intervals):0;w.meshLapArea=w.mesh===true?0:w.meshArea;
 }
 return {walls:all,gross:all.reduce((s,w)=>s+w.gross,0),cut:all.reduce((s,w)=>s+w.cut,0),area:all.reduce((s,w)=>s+w.area,0),plaster:all.filter(w=>w.on).reduce((s,w)=>s+w.area,0),mesh:all.reduce((s,w)=>s+w.meshArea,0),unknown:all.filter(w=>w.on&&w.mesh===null).length};
}
function estimateOptions202(p){
 const rooms=estimateRooms202(p),audit=rooms.map(r=>({r,a:wallAudit202(p,r)}));
 return `<section class="estimate202"><b>Смета квартиры</b><p>Подъезд исключён независимо от отображения. Стены считаются до перекрытия; совпадающие проёмы вычитаются один раз. Откосы отдельно.</p><button class="btn pri" data-xlsx202>Скачать смету Excel (.xlsx)</button><details><summary>Площади стен, потолки, материалы и сетка</summary><label class="field"><span>Заход сетки с пеноблока на соседний бетон, м</span><select data-lap202>${[.5,.6,.7,.8,.9,1].map(v=>`<option value="${v}"${Math.abs((+p.calc?.meshLap202||.5)-v)<.001?' selected':''}>${v.toFixed(1)}</option>`).join('')}</select></label><p>Заход считается на соседний бетон по контуру помещения, с вычетом проёмов. Пересечения заходов объединяются. Нестандартные Т-примыкания внутри длинной бетонной стены требуют отдельной привязки.</p>${audit.map(({r,a})=>`<h4>${esc(r.name)} — стены ${q2(a.area/1e6)} м²</h4><label class="field"><span>Отделка потолка</span><select data-ceiling202="${esc(r.id)}">${[['stretch','Натяжной'],['suspended','Подвесной'],['paint','Шпаклёвка / покраска'],['none','Не учитывать']].map(([v,n])=>`<option value="${v}"${ceilingKind202(p,r)===v?' selected':''}>${n}</option>`).join('')}</select></label><div class="scrollx"><table class="t"><tr><th>Стена</th><th>Материал</th><th>Нетто, м²</th><th>Сетка на всю сторону</th><th>Сетка с заходами, м²</th></tr>${a.walls.map(w=>`<tr><td>${esc(w.lab)}</td><td>${materialSelect202(w.material,`data-est-material202="${esc(r.id)}" data-wall202="${esc(w.key)}"`)}</td><td>${q2(w.area/1e6)}</td><td><select data-mesh202="${esc(r.id)}" data-wall202="${esc(w.key)}"><option value=""${w.wo.mesh202==null?' selected':''}>По материалу</option><option value="yes"${w.wo.mesh202===true?' selected':''}>Да</option><option value="no"${w.wo.mesh202===false?' selected':''}>Нет</option></select></td><td>${q2(w.meshArea/1e6)}</td></tr>`).join('')}</table></div>`).join('')}</details><p>Под сетку с заходами: ${q2(audit.reduce((s,x)=>s+x.a.mesh,0)/1e6)} м². ${audit.some(x=>x.a.unknown)?'Есть стены без материала. Закупленные 100 м² не считаются автоматически смонтированными.':'По материалам и отмеченным сторонам стен.'}</p><p>До назначения отделки и расценок смета предварительная. Штукатурка — по включённым стенам; отключение отдельных стен доступно в разделе штукатурки. Шпаклёвка — отдельный выбор поверхностей.</p></section>`;
}
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.matches?.('[data-lap202]')){if(S.ro||window.OBM_RO)return;S.project.calc=S.project.calc||{};S.project.calc.meshLap202=Math.max(.5,Math.min(1,+el.value||.5));save();renderSheet();return;}
 if(el.dataset?.material202){if(S.ro||window.OBM_RO||S.editLayers195?.obmer===false)return;assignMaterial202(S.project,JSON.parse(el.dataset.material202),el.value);save();renderSheet();return;}
 const rid=el.dataset?.ceiling202||el.dataset?.mesh202||el.dataset?.estMaterial202;if(!rid)return;
 if(S.ro||window.OBM_RO)return;const r=S.project.rooms.find(x=>x.id===rid);if(!r)return;
 if(el.dataset.ceiling202)r.estimateCeiling202=el.value;
 else if(el.dataset.estMaterial202){if(S.editLayers195?.obmer===false)return;const w=wallAudit202(S.project,r).walls.find(w=>w.key===el.dataset.wall202);if(w)assignMaterial202(S.project,w.ids,el.value);}
 else{r.plastW=r.plastW||{};const w=r.plastW[el.dataset.wall202]||(r.plastW[el.dataset.wall202]={});if(el.value==='')delete w.mesh202;else w.mesh202=el.value==='yes';}
 save();renderSheet();
});
document.addEventListener('click',e=>{if(e.target.closest('[data-xlsx202]'))exportEstimate202();});
const renderMaterialBase202=renderSheet;renderSheet=function(){
 renderMaterialBase202();if(!['netwall','srcwallE','wall'].includes(S.sheet)||!['netwall','srcwall','srcwallE','wall'].includes(S.sel?.kind))return;
 const r=room(),id=S.sel.id||(r?.wids||[])[S.sel.i];if(!id)return;
 const body=document.getElementById('sheetBody');if(!body||body.querySelector('[data-material-card202]'))return;
 body.insertAdjacentHTML('afterbegin',`<section class="estimate202" data-material-card202><label class="field"><span>Материал стены — для расчёта отделки</span>${materialSelect202(wallMaterial202(S.project,id),`data-material202="${esc(JSON.stringify([id]))}"${S.ro||window.OBM_RO||S.editLayers195?.obmer===false?' disabled':''}`)}</label><p>Толщина и положение не меняются. Материал общий для обеих сторон стены. Сетка на пеноблоках и заходы на бетон учитываются в смете.</p></section>`);
};

// A small standards-based OOXML writer. Stored ZIP entries avoid external services.
function xxml202(v){return String(v??'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function zip202(files){
 const enc=new TextEncoder(),table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 const crc=b=>{let c=0xffffffff;for(const v of b)c=table[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;},parts=[],central=[];let offset=0;
 const header=(n)=>{const b=new Uint8Array(n);return {b,d:new DataView(b.buffer)};};
 for(const [name,text] of Object.entries(files)){const n=enc.encode(name),b=enc.encode(text),c=crc(b),h=header(30);h.d.setUint32(0,0x04034b50,true);h.d.setUint16(4,20,true);h.d.setUint16(6,0x800,true);h.d.setUint32(14,c,true);h.d.setUint32(18,b.length,true);h.d.setUint32(22,b.length,true);h.d.setUint16(26,n.length,true);parts.push(h.b,n,b);const z=header(46);z.d.setUint32(0,0x02014b50,true);z.d.setUint16(4,20,true);z.d.setUint16(6,20,true);z.d.setUint16(8,0x800,true);z.d.setUint32(16,c,true);z.d.setUint32(20,b.length,true);z.d.setUint32(24,b.length,true);z.d.setUint16(28,n.length,true);z.d.setUint32(42,offset,true);central.push(z.b,n);offset+=30+n.length+b.length;}
 const size=central.reduce((s,b)=>s+b.length,0),end=header(22),count=Object.keys(files).length;end.d.setUint32(0,0x06054b50,true);end.d.setUint16(8,count,true);end.d.setUint16(10,count,true);end.d.setUint32(12,size,true);end.d.setUint32(16,offset,true);return new Blob([...parts,...central,end.b],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function excel202(sheets){
 const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
 const files={'[Content_Types].xml':`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`,
 '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
 'xl/workbook.xml':`<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${xxml202(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`,
 'xl/_rels/workbook.xml.rels':`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
 'xl/styles.xml':'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF29475B"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="3"><xf fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="center" wrapText="1"/></xf><xf fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"><alignment vertical="center" wrapText="1"/></xf><xf fontId="0" fillId="0" borderId="0" numFmtId="4" xfId="0" applyNumberFormat="1"><alignment vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'};
 sheets.forEach((s,i)=>{files[`xl/worksheets/sheet${i+1}.xml`]=`<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${s.widths.map((w,j)=>`<col min="${j+1}" max="${j+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${s.rows.map((row,r)=>`<row r="${r+1}" ht="${r===0?38:Math.max(32,Math.min(160,12+15*Math.max(...row.map((v,c)=>typeof v==="string"?Math.ceil(v.length/Math.max(8,s.widths[c]*.8)):1))))}" customHeight="1">${row.map((v,c)=>{const a=col(c)+(r+1),st=r===0?1:typeof v==='number'||v?.f?2:0;if(v===null||v===undefined)return `<c r="${a}" s="${st}"/>`;if(v?.f)return `<c r="${a}" s="${st}"><f>${xxml202(v.f)}</f><v>${v.v}</v></c>`;return typeof v==='number'?`<c r="${a}" s="${st}"><v>${v}</v></c>`:`<c r="${a}" s="${st}" t="inlineStr"><is><t xml:space="preserve">${xxml202(v)}</t></is></c>`;}).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:${col(s.rows[0].length-1)}${s.rows.length}"/></worksheet>`;});
 return zip202(files);
}
function exportEstimate202(){
 const p=S.project,E=estimate(p),rs=estimateRooms202(p),rows=[['Раздел','Позиция','Ед.','Количество','Материал, ₽/ед.','Упаковка, ₽','В упаковке, ед.','Материалы, ₽','Работа, ₽/ед.','Доплата, ₽/ед.','Сложность, %','Работы, ₽','Всего, ₽','Примечание','Статус расценки']];
 for(const g of E.groups)for(const x of g.rows){const n=rows.length+1,price=p.prices?.[x.k]||{},has=Object.values(price).some(v=>typeof v==='number'&&v>0);rows.push([g.g,x.n,x.u,x.q,x.pm,x.pk||null,x.ps||null,{f:`IF(AND(F${n}>0,G${n}>0),ROUNDUP(D${n}/G${n}-0.000000001,0)*F${n},D${n}*E${n})`,v:x.sm},x.pw,x.pwx,+p.costK?.hard||0,{f:`D${n}*(I${n}+J${n})*(1+K${n}/100)`,v:x.sw},{f:`H${n}+L${n}`,v:x.s},x.note||'',x.k==='wall.area'?'Справочно':has?'Задана':'Цена не задана']);}
 const last=rows.length;rows.push(['Итого позиции','','','','','','',{f:`SUM(H2:H${last})`,v:E.mat},'','','',{f:`SUM(L2:L${last})`,v:E.work},{f:`SUM(M2:M${last})`,v:E.mat+E.work}]);
 rows.push(['Доставка и подъём','','','','','','','','','','','',E.deliv.sum,'Включая дополнительные строки доставки и вывоз']);rows.push(['Скидка','','','','','','','','','',+p.costK?.disc||0,'',{f:`-(M${last+1}+M${last+2})*K${last+3}/100`,v:-E.disc}]);rows.push(['ИТОГО ПО ЗАДАННЫМ ЦЕНАМ','','','','','','','','','','','',{f:`SUM(M${last+1}:M${last+3})`,v:E.total},'Незаполненные цены не входят в денежный итог. Смета предварительная.']);
 const audit=[['Помещение','Стена','Длина, м','Высота, м','До вычета, м²','Проёмы, м²','Нетто, м²','Штукатурить','Сетка на всю сторону','Потолок','Материал','Сетка с заходами, м²','Из них заходы, м²']];
 for(const r of rs)for(const w of wallAudit202(p,r).walls)audit.push([r.name,w.lab,w.L/1000,w.H/1000,w.gross/1e6,w.cut/1e6,w.area/1e6,w.on?'Да':'Нет',w.mesh===null?'Не указано':w.mesh?'Да':'Нет',ceilingKind202(p,r),(WALL_MATERIALS202.find(x=>x[0]===w.material)||['','Разные материалы'])[1],w.meshArea/1e6,w.meshLapArea/1e6]);
 const conditions=[['Условие','Значение'],['Объект',p.name],['Подъезд','Исключён: общие помещения не участвуют ни в объёмах, ни в ценах'],['Стены','До перекрытия. Проёмы вычтены по объединению пересекающихся участков, без двойного вычета. Откосы отдельно.'],['Штукатурка','Геометрический объём по включённым стенам. Исключите поверхности под ГКЛ и другие работы в настройках штукатурки.'],['Сетка','Только обработанные стороны пеноблочных стен. Неуказанные стороны не включены; 100 м² закупки не равны площади монтажа.'],['Цены','Берутся из сметы проекта. Пустые цены отмечены. Цена 0 может быть введена явно, проверьте состав работ.'],['Статус','Предварительная: проверьте поверхности под штукатурку, шпаклёвку, сетку и все расценки.'],['Натяжные и подвесные потолки','Шпаклёвка потолка, грунт и смеси под неё не начисляются.']];
 conditions.push(['Заход сетки на бетон',String(+p.calc?.meshLap202||.5)+' м с пеноблока на непосредственно соседний бетон по контуру помещения. Перекрытия объединены, проёмы вычтены. Неучтённые Т-примыкания проверить отдельно.']);
 const blob=excel202([{name:'Смета',rows,widths:[28,55,10,15,18,18,18,21,20,20,17,21,22,70,24]},{name:'Площади стен',rows:audit,widths:[38,16,17,17,20,20,20,20,24,22,28,24,24]},{name:'Условия',rows:conditions,widths:[40,120]}]);
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fname(p.name)+'_смета.xlsx';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);hint('Смета Excel скачивается. Проверьте строки без цен и условия расчёта.',5000);
}
