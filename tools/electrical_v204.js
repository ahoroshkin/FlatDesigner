/* v204: explicit common-frame assembly, reversible with original records. */
function frameCandidates204(r,it){return r.items.filter(x=>x!==it&&['socket','switch'].includes(x.type)&&x.wall===it.wall&&!x.free&&!x.frame204Sources&&posts(x)+posts(it)<=6&&Math.abs((+x.h||0)-(+it.h||0))<100&&Math.abs((+x.t||0)-(+it.t||0))<600);}
function frameJoin204(r,it,other){
 if(!frameCandidates204(r,it).includes(other))return false;
 const originals=JSON.parse(JSON.stringify([it,other])),sorted=[it,other].sort((a,b)=>(+a.t||0)-(+b.t||0)),configs=[];
 for(const x of sorted)for(let q=0;q<posts(x);q++)configs.push(x.type==='switch'?pcfg(x,q):{t:'so',k:1,pass:false,kg:[]});
 it.type='switch';it.n=configs.length;it.dir='h';it.step=71;it.t=((+sorted[0].t||0)+(+sorted[1].t||0))/2;it.pp=[];
 configs.forEach((x,q)=>pset(it,q,x));it.frame204Sources=originals;r.items.splice(r.items.indexOf(other),1);return true;
}
const itemUI204Base=itemUI;itemUI=function(r){let html=itemUI204Base(r);const it=r.items[S.sel.i];if(!it||!['socket','switch'].includes(it.type))return html;
 const candidates=it.frame204Sources?[]:frameCandidates204(r,it);
 return html+`<h3>Общая рамка</h3><p class="note">Один блок: общий центр, шаг ${+it.step||71} мм. Для трёх постов объедините выключатель и двойную розетку. После объединения проверьте линию питания блока.</p>`+(it.frame204Sources?'<button class="btn" data-frame204="split">Разобрать — восстановить исходные приборы</button>':candidates.map(x=>`<button class="btn" data-frame204="${esc(x.id)}">Объединить с ${esc(markOf(x,byType[x.type]))} · ${posts(x)} пост.</button>`).join(''));
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-frame204]');if(!b)return;const r=room(),it=r&&r.items[S.sel?.i];if(!it)return;markHistory();if(b.dataset.frame204==='split'&&it.frame204Sources){const old=JSON.parse(JSON.stringify(it.frame204Sources)),idx=r.items.indexOf(it);r.items.splice(idx,1,...old);S.sel.i=idx;}else{const other=r.items.find(x=>x.id===b.dataset.frame204);if(!other||!frameJoin204(r,it,other))return;S.sel.i=r.items.indexOf(it);}save();render();renderSheet();});
