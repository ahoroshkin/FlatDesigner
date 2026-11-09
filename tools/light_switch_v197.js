// The selection shows the existing control assignment; it never rewires a group.
function selectedLightControls197(r=room()){
 const it=S.sel?.kind==='item'&&r?.items[S.sel.i];
 if(!it||!LIGHT_T.has(it.type))return null;
 const group=it.lg||'';
 return {group,keys:group?lgSwitches(S.project,group):[]};
}
function controlKey197(s,short=false){
 const key=short?'К'+(s.k+1):'клавиша '+(s.k+1);
 if(posts(s.it)<=1)return key;
 return short?'П'+(s.q+1)+'·'+key:'пост '+(s.q+1)+', '+key;
}
function lightControlCard197(r){
 const selected=selectedLightControls197(r);if(!selected)return '';
 const {group,keys}=selected;
 return `<section class="light-control197" data-light-controls197><b>${group?'Управление · '+esc(group):'Управление светом'}</b>${keys.length?
  '<ul>'+keys.map(s=>`<li>${esc(s.r.name)} · ${esc(controlKey197(s))}${s.pass?' · проходная':''}${s.it.wall!=null?' · стена '+(s.it.wall+1):''}</li>`).join('')+'</ul>':
  '<div>Выключатель не назначен</div>'}</section>`;
}
function lightControlOverlay197(p,T,P){
 if(stageActive()||!['plan','flat','ceil'].includes(S.vmode)||S.mode==='bind')return '';
 const selected=selectedLightControls197();if(!selected?.keys.length)return '';
 const visible=new Set(p.rooms.map(r=>r.id)),marks=new Map();
 for(const s of selected.keys){
  if(!visible.has(s.r.id)||(S.vmode==='ceil'&&s.r.id!==S.roomId))continue;
  const byRoom=marks.get(s.r.id)||new Map();marks.set(s.r.id,byRoom);
  const hit=byRoom.get(s.it)||[];hit.push(s);byRoom.set(s.it,hit);
 }
 const out=[];
 for(const byRoom of marks.values())for(const keys of byRoom.values()){
  const first=keys[0],ip=itemPos(first.r,first.it);
  if(!ip?.pos?.every(Number.isFinite))continue;
  const [x,y]=W2S(T,ip.pos),[nx,ny]=ip.nrm||[0,-1],a=x+nx*14,b=y+ny*14;
  const label=keys.map(k=>controlKey197(k,true)).join(' / '),w=Math.max(28,label.length*7+12);
  const lx=a+nx*(w/2+12),ly=b+ny*22;
  out.push(`<g data-light-switch197="${esc(first.it.id||'')}" data-light-keys197="${esc(label)}" pointer-events="none"><title>${esc(first.r.name+' · '+keys.map(k=>controlKey197(k)).join(', '))}</title><line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" stroke="${P.accent}" stroke-width="2"/><circle cx="${a}" cy="${b}" r="10" fill="${P.paper}" stroke="${P.accent}" stroke-width="2.8"/><path d="M ${a-3} ${b+3} l 6 -6" stroke="${P.accent}" stroke-width="2"/><rect x="${lx-w/2}" y="${ly-9}" width="${w}" height="18" rx="7" fill="${P.paper}" stroke="${P.accent}" stroke-width="1.5"/><text x="${lx}" y="${ly+4}" fill="${P.accent}" font-family="Golos Text, sans-serif" font-size="11" text-anchor="middle" font-weight="700">${esc(label)}</text></g>`);
 }
 return out.join('');
}
