/* Apartment-only display. A filtered drawing model is never saved. */
function commonRoom196(r){
 const name=String(r.name||'').trim().toLowerCase().replace(/[‑–—]/g,'-');
 return /^(общий коридор 7(?:-го)? этажа|лифтовой холл|проход к сплит-шахте|сплит-шахта)$/.test(name);
}
function hideCommon196(p=S.project){
 if(!p?.rooms.some(commonRoom196)||!p.rooms.some(r=>!commonRoom196(r)&&r.points?.length>2))return false;
 const key='obmerka-apartment-view:'+p.id;
 if(!Object.hasOwn(commonView196,key)){try{commonView196[key]=localStorage.getItem(key)==='1';}catch(e){commonView196[key]=false;}}
 return commonView196[key];
}
const commonView196=Object.create(null);
const visibleRooms196=(p=S.project)=>hideCommon196(p)?p.rooms.filter(r=>!commonRoom196(r)):p.rooms;
const v3ScopeVisible196=scope=>scope==="all"||visibleRooms196().some(r=>r.id===scope&&r.points?.length>2);
function visibleNet196(net,rooms){
 const keep=new Set(),remove=new Set();
 rooms.forEach(r=>(r.wids||[]).forEach(id=>(commonRoom196(r)?remove:keep).add(id)));
 const walls=net.walls.filter(w=>!remove.has(w.id)||keep.has(w.id)), ids=new Set(walls.flatMap(w=>[w.a,w.b]));
 return {...net,walls,nodes:net.nodes.filter(n=>ids.has(n.id))};
}
function visiblePlan196(p){
 if(!p||!hideCommon196(p))return p;
 const net=visibleNet196(netOf(p),p.rooms), src=srcOf(p);
 const original=src?srcRoomsInner(src).map(r=>({...r,name:src.rooms?.find(x=>x.c&&inPoly(x.c,r.points))?.name})):null;
 return {...p,rooms:visibleRooms196(p),net,...(src?{src:{...src,rooms:src.rooms?.filter(r=>!commonRoom196(r)),net:visibleNet196(src.net,[...original,...p.rooms])}}:{})};
}
function commonSwitch196(p){
 if(!p?.rooms.some(commonRoom196)||!p.rooms.some(r=>!commonRoom196(r)&&r.points?.length>2))return '';
 return `<label class="row"><input type="checkbox" data-common196 ${hideCommon196(p)?'':'checked'}> Показывать подъезд</label><p class="note">Скрывает подъезд на плане и в 3D, а также участки трасс вне квартиры на плане. Полная длина трасс и чертежи сохраняются.</p>`;
}
document.addEventListener('change',e=>{
 if(!e.target.matches('[data-common196]')||!S.project)return;
 const key='obmerka-apartment-view:'+S.project.id;
 commonView196[key]=!e.target.checked;
 try{localStorage.setItem(key,commonView196[key]?'1':'0');}catch(err){}
 if(hideCommon196()&&commonRoom196(room())){S.roomId=visibleRooms196().find(r=>r.points?.length>2).id;S.roomsAll=false;}
 S.sel=null;
 $('#rmenu').hidden=true;
 renderRooms();fitView();render();renderSheet();
},true);
const serviceDisplay196=serviceSVG;
serviceSVG=function(p,T,o,clipRoom){
 const svg=serviceDisplay196(p,T,o,clipRoom);
 if(!svg||!o?.apartment196||clipRoom)return svg;
 const polygons=o.apartment196.filter(r=>r.points?.length>2).map(r=>`<polygon points="${r.points.map(q=>W2S(T,q).join(',')).join(' ')}"/>`).join('');
 return `<defs><clipPath id="apartmentRoutes196">${polygons}</clipPath></defs><g clip-path="url(#apartmentRoutes196)">${svg}</g>`;
};
const servicePoints196=servicePointHit;
servicePointHit=function(sp,touch){
 const hit=servicePoints196(sp,touch);
 if(!hit||!hideCommon196())return hit;
 return visibleRooms196().some(r=>r.points?.length>2&&inPoly(hit.r.points[hit.i],r.points))?hit:null;
};
