// Optional mirrorControl: old mirrors with a group keep their existing assignment.
function litMirror198(it){return !!it&&['mirrfull','mirrcab'].includes(it.type);}
function mirrorControl198(it){return it.mirrorControl==='switch'||it.mirrorControl!=='button'&&!!it.lg?'switch':'button';}
function lightItem198(it){return !!it&&(LIGHT_T.has(it.type)||litMirror198(it)&&mirrorControl198(it)==='switch');}
function mirrorUI198(it){
 if(!litMirror198(it))return '';
 const mode=mirrorControl198(it),p=S.project,keys=[];
 for(const r of p.rooms||[])for(const sw of r.items||[]){if(sw.type!=='switch')continue;
  swPosts(sw).forEach((post,q)=>{if(post.t!=='sw')return;for(let k=0;k<post.k;k++){
   const g=post.kg[k]||'',value=JSON.stringify([r.id,sw.id,q,k]);
   keys.push(`<option value="${esc(value)}">${esc(r.name+' · '+(sw.mark||'Выключатель')+' · '+controlKey197({it:sw,q,k})+(g?' · '+g:' · свободная'))}</option>`);
  }});
 }
 return `<section class="light-control197" data-mirror-control198><b>Управление подсветкой</b><div class="row"><label class="field"><span>Способ включения</span><select id="f_mirrorControl198"><option value="button"${mode==='button'?' selected':''}>Кнопка на зеркале</option><option value="switch"${mode==='switch'?' selected':''}>Настенный выключатель</option></select></label></div>${mode==='switch'?`<label class="field"><span>Назначить клавишу выключателя</span><select id="f_mirrorKey198"><option value="">— выбрать клавишу</option>${keys.join('')}</select></label><p class="note">Зеркало войдёт в группу выбранной клавиши. Для свободной клавиши создастся новая группа. Другие светильники сохранят свои связи.</p>`:'<p class="note">Подсветка включается встроенной кнопкой. Настенный выключатель не назначается.</p>'}</section>`;
}
document.addEventListener('change',e=>{
 const id=e.target?.id;if(!['f_mirrorControl198','f_mirrorKey198'].includes(id))return;
 const r=room(),it=S.sel?.kind==='item'&&r?.items[S.sel.i];if(!litMirror198(it))return;
 e.stopImmediatePropagation();
 if(S.ro||window.OBM_RO||!layerEditable195(r,it)){renderSheet();return;}
 if(id==='f_mirrorControl198'){
  it.mirrorControl=e.target.value==='switch'?'switch':'button';
  if(it.mirrorControl==='button')delete it.lg;
 }else{
  let ref;try{ref=JSON.parse(e.target.value);}catch{return;}
  const [rid,sid,q,k]=ref,rr=S.project.rooms.find(x=>x.id===rid),sw=rr?.items.find(x=>x.id===sid);
  if(!sw||sw.type!=='switch'||!layerEditable195(rr,sw))return;
  const post=pcfg(sw,q);if(post.t!=='sw'||k<0||k>=post.k)return;
  const kg=post.kg.slice(),g=kg[k]||lgNew(S.project);kg[k]=g;pset(sw,q,{kg});
  it.mirrorControl='switch';it.lg=g;
 }
 save();render();renderSheet();
},true);
function mirrorSwitchOverlay198(p,T,P){
 if(stageActive()||!['plan','flat','ceil'].includes(S.vmode)||S.mode==='bind')return '';
 const r=room(),sw=S.sel?.kind==='item'&&r?.items[S.sel.i];if(sw?.type!=='switch')return '';
 const groups=new Set(swAllKg(sw).map(x=>x.g).filter(Boolean)),out=[];
 for(const rr of p.rooms||[]){if(S.vmode==='ceil'&&rr.id!==S.roomId)continue;
  for(const it of rr.items||[]){if(!litMirror198(it)||mirrorControl198(it)!=='switch'||!groups.has(it.lg))continue;
   const box=furnBox(it),pts=box.c.map(q=>W2S(T,q));
   out.push(`<g data-switch-mirror198="${esc(it.id)}" pointer-events="none"><title>${esc('Подсветка зеркала · '+it.lg)}</title><polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${P.accent}" fill-opacity=".18" stroke="${P.accent}" stroke-width="4"/></g>`);
  }
 }
 return out.join('');
}
