/* Shared dimensions for interactive elevations, reports and installer drawings. */
function elevData207(r,i){
 const L=segLen(r.points,i),points=[],furniture=[];
 wallItems(r,i).forEach(({it,c,p,borrowed})=>{if(borrowed||c.opening||c.furn||c.wide)return;points.push({t:clamp(p.t,0,L),h:+it.h||0,it});});
 if(S.show.furn!==false)(r.items||[]).forEach(it=>{const c=byType[it.type];if(!c?.furn||c.deco||(furnWall(r,it)!==i&&!furnTouches(r,it,i)))return;const sp=furnSpan(r,it,i);if(!sp)return;const a=clamp(sp.t1,0,L),b=clamp(sp.t2,0,L),bottom=+it.mount||0,top=bottom+Math.max(20,+it.h||c.h||600);if(b-a<10)return;furniture.push({a,b,bottom,top,it,c});});
 return {L,H:r.ceiling||2700,points,furniture,selectedId:S.sel?.kind==='item'?r.items[S.sel.i]?.id:null};
}
function elevPack207(entries,fs,left,right){
 const rows=[];return entries.map(e=>{const half=Math.max(fs,e.label.length*fs*.55/2)+4,x=clamp(e.x,left+half,Math.max(left+half,right-half));let row=0;while(rows[row]?.some(b=>x+half>b[0]&&x-half<b[1]))row++;(rows[row]||(rows[row]=[])).push([x-half,x+half]);return {...e,xLabel:x,row};});
}
function elevDimensions207(d,X,Y,P,opt={}){
 const C=opt.fontScale||1,fs=Math.max(opt.print?13.5:10.5,9.1*clamp(C,.95,1.8)),fg=Math.max(8.7,fs*.83),gap=fs+7,blue=P.dim||'#2458b8',gray='#777b7e',faint='#b9b9b3',out=[];
 const x0=X(0),x1=X(d.L),floor=Y(0),top=Y(d.H),showFurniture=opt.furniture!==false;
 const line=(x,y,a,b,c,w=.7,dash='')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${c}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const text=(x,y,label,c,size=fs,anchor='middle',kind='',value='')=>`<text data-dim-label207="${kind}" data-value="${value}" x="${x}" y="${y}" fill="${c}" font-family="PT Sans Narrow,Arial Narrow,sans-serif" font-size="${size}" text-anchor="${anchor}"${kind==='overall'?' font-weight="700"':''}>${esc(label)}</text>`;
 const tick=(x,y,c)=>line(x-3,y+3,x+3,y-3,c,1);
 let cursor=floor+20;
 // One gray band for furniture resting on the floor, no furniture edges in blue.
 const selected207=!opt.print&&d.selectedId?d.furniture.find(f=>f.it.id===d.selectedId):null;
 const floorF=selected207?[selected207]:showFurniture?d.furniture.filter(f=>f.bottom<15&&f.top>300&&!f.c.flat).sort((a,b)=>a.a-b.a):[];
 if(floorF.length){const widthF=selected207&&selected207.a>0?[{...selected207,a:0,b:selected207.a,offset:true},...floorF]:floorF;const entries=elevPack207(widthF.map(f=>({x:(X(f.a)+X(f.b))/2,label:mm(f.b-f.a),f})),fg,x0,x1),rows=1+Math.max(...entries.map(e=>e.row)),y=cursor+rows*(fg+6);
  for(const e of entries){const a=X(e.f.a),b=X(e.f.b),ty=cursor+fg+e.row*(fg+6);out.push(line(a,floor+3,a,y+3,faint,.5),line(b,floor+3,b,y+3,faint,.5),line(a,y,b,y,gray),tick(a,y,gray),tick(b,y,gray),text(e.xLabel,ty,e.label,gray,fg,'middle',e.f.offset?'furniture-offset':'furniture-width',e.f.b-e.f.a));if(e.row||Math.abs(e.x-e.xLabel)>1)out.push(line(e.x,y,e.xLabel,ty+3,gray,.5));}
  out.push(text(x0-10,y,'Мебель по стене',gray,fg,'end','caption'));cursor=y+24;
 }
 const vals=[...new Set([0,d.L,...d.points.map(p=>Math.round(p.t))])].sort((a,b)=>a-b),segments=[];
 for(let k=1;k<vals.length;k++){const a=vals[k-1],b=vals[k];if(b-a<.01)continue;segments.push({x:(X(a)+X(b))/2,label:mm(b-a),a,b});}
 const packed=elevPack207(segments,fs,x0,x1),rows=packed.length?1+Math.max(...packed.map(e=>e.row)):1,chainY=cursor+rows*gap;
 for(const e of packed){const a=X(e.a),b=X(e.b),ty=cursor+fs+e.row*gap;out.push(line(a,chainY,b,chainY,blue),tick(a,chainY,blue),tick(b,chainY,blue),text(e.xLabel,ty,e.label,blue,fs,'middle','between',e.b-e.a));if(b-a<e.label.length*fs*.55+12||e.row||Math.abs(e.xLabel-e.x)>1)out.push(line(e.x,chainY-2,e.xLabel,ty+3,blue,.6));}
 out.push(text(x0-10,chainY,'Между осями',gray,fg,'end','caption'));
 // Cumulative values retain close-but-different coordinates, each with its own leader.
 const locations=vals.filter(t=>t>0&&t<d.L),absolute=elevPack207(locations.map(t=>({x:X(t),t,label:mm(opt.fromR?d.L-t:t)})),fs,x0,x1),absBase=chainY+26,absRows=absolute.length?1+Math.max(...absolute.map(e=>e.row)):0;
 out.push(line(x0,absBase,x1,absBase,blue,.7));
 for(const e of absolute){const ty=absBase+fs+8+e.row*gap;out.push(tick(e.x,absBase,blue),line(e.x,absBase+4,e.xLabel,ty-fs+2,blue,.55),text(e.xLabel,ty,e.label,blue,fs,'middle','from-corner',e.t));}
 for(const t of locations){const p=d.points.find(p=>Math.round(p.t)===t);out.push(line(X(t),Y(p?.h||0)+8,X(t),floor,faint,.5,'2 3'),line(X(t),floor+4,X(t),absBase-5,faint,.45,'2 4'));}
 out.push(text(x0-10,absBase+fs+8,opt.fromR?'От правого угла':'От левого угла',gray,fg,'end','caption'));
 const overallY=absBase+Math.max(1,absRows)*gap+34;out.push(line(x0,overallY,x1,overallY,blue,1),tick(x0,overallY,blue),tick(x1,overallY,blue),text((x0+x1)/2,overallY+fs+7,mm(d.L),blue,fs+1,'middle','overall',d.L));
 if(!opt.noV){
  const levels=[...new Set([0,Math.round(d.H),...d.points.map(p=>Math.round(clamp(p.h,0,d.H)))])].sort((a,b)=>b-a),xr=x0-22,labels=[];
  for(const h of levels){let y=Y(h);if(labels.length)y=Math.max(y,labels.at(-1).y+fs+6);labels.push({h,y});}
  for(let k=labels.length-1;k>=0;k--){const limit=k===labels.length-1?floor:labels[k+1].y-fs-6;labels[k].y=Math.min(labels[k].y,limit);}
  out.push(line(xr,top,xr,floor,blue,.8));
  for(const e of labels){const y=Y(e.h);out.push(tick(xr,y,blue),line(x0,y,xr,y,faint,.5,'2 3'),line(xr-4,y,xr-11,e.y,blue,.6),text(xr-15,e.y+fs*.35,mm(e.h),blue,fs,'end','height',e.h));}
 }
 // Only useful furniture heights on the right; never counted as electrical levels.
 if(showFurniture&&d.furniture.length){const pool=selected207?[selected207]:floorF.length?floorF:d.furniture.filter(f=>!f.c.flat),byHeight=new Map();pool.forEach(f=>{const height=Math.round(f.top-f.bottom);if(!byHeight.has(height))byHeight.set(height,f);});const heights=[...byHeight.keys()].sort((a,b)=>b-a),high=heights[0],low=heights.find(h=>h>=500&&h<=1200&&h!==high),hs=high==null?[]:[high,...(low?[low]:[])];hs.forEach((h,k)=>{const f=byHeight.get(h),xr=x1+25+k*22,y=Y(f.top),yb=Y(f.bottom);out.push(line(x1,y,xr+3,y,faint,.5),line(xr,y,xr,yb,gray,.6),tick(xr,y,gray),tick(xr,yb,gray),`<text data-dim-label207="furniture-height" data-value="${h}" x="${xr+9}" y="${(y+yb)/2}" transform="rotate(-90 ${xr+9} ${(y+yb)/2})" text-anchor="middle" fill="${gray}" font-family="PT Sans Narrow,Arial Narrow,sans-serif" font-size="${fg}">${esc(mm(h))}</text>`);});}

 if(selected207&&selected207.bottom>0){const xr=x1+80,y=Y(selected207.bottom);out.push(line(x1,y,xr,y,faint,.5),line(xr,y,xr,floor,gray,.7),tick(xr,y,gray),tick(xr,floor,gray),`<text data-dim-label207="furniture-mount" data-value="${selected207.bottom}" x="${xr+9}" y="${(y+floor)/2}" transform="rotate(-90 ${xr+9} ${(y+floor)/2})" text-anchor="middle" fill="${gray}" font-family="PT Sans Narrow,Arial Narrow,sans-serif" font-size="${fg}">${esc(mm(selected207.bottom))} от пола</text>`);}

 return {svg:`<g data-elev-dim197 data-elev-layout207="1" data-bottom="${overallY+fs+16-floor}">${out.join('')}</g>`,bottom:overallY+fs+16-floor};
}
function elevFurnitureLabel207(it,t1,t2,b,top,X,Y,col,P,scale,measures=true){
 const f=Math.max(9,8.1*clamp(scale||1,1,1.5)),w=X(t2)-X(t1);if(w<36&&it.type!=='inlet')return '';if(w<36)measures=false;
 const selected=P!==PRINT_PAL&&S.sel?.kind==='item'&&room()?.items[S.sel.i]?.id===it.id;
 const c=byType[it.type]||{},code=markOf(it,c),dim=[mm(+it.w||t2-t1),mm(+it.h||top-b),...(+it.d>0?[mm(+it.d)]:[])].join(' × '),x=X((t1+t2)/2),y=Y((b+top)/2),maxChars=Math.max(4,Math.floor(w/(f*.5))),label=String(code).length>maxChars?String(code).slice(0,maxChars-1)+'…':code;
 return `<g data-furniture-label207="${esc(it.id)}" fill="${selected?P.accent:'#777b7e'}" text-anchor="middle" font-family="PT Sans Narrow,Arial Narrow,sans-serif" font-size="${f}"${selected?' font-weight="700"':''}><text x="${x}" y="${y-3}">${esc(label)}</text>${measures?`<text data-furniture-size207="1" x="${x}" y="${y+f+3}">${esc(dim)}</text>`:""}</g>`;
}
function elevLayoutFor207(r,i,x,y,s,P,opt={}){const d=elevData207(r,i);return elevDimensions207(d,t=>x+t*s,h=>y-h*s,P,{fontScale:opt.zf||1,print:opt.print||P===PRINT_PAL,furniture:opt.furniture!==false&&S.elevFurniture207!==false,fromR:S.show.fromL===false,noV:opt.noV});}
const elevSVG207Base=elevSVG0;
elevSVG0=function(r,sel,W,H,P,forceS,opt={}){
 if(r.points.length<3)return elevSVG207Base(r,sel,W,H,P,forceS,opt);
 const ids=Array.isArray(sel)?sel:sel==='all'?r.points.map((_,i)=>i).filter(i=>!wallOpen(r,i)):[sel],Hc=r.ceiling||2700,gap=ids.length>1?140:0,L=ids.reduce((a,i)=>a+segLen(r.points,i),0),width=Math.max(W,340),height=Math.max(H,430),left=112,right=80,top=44;
 let scale=forceS||Math.min((width-left-right-gap*(ids.length-1))/Math.max(1,L),(height-top-190)/Hc),reserve=180;
 for(let k=0;k<3;k++){reserve=Math.max(125,...ids.map(i=>elevLayoutFor207(r,i,0,0,Math.max(.005,scale),P,{...opt,print:true}).bottom));if(!forceS)scale=Math.max(.005,Math.min((width-left-right-gap*(ids.length-1))/Math.max(1,L),(height-top-reserve)/Hc));}
 let x=left,body='';const yf=top+Hc*scale;for(const i of ids){body+=elevPanel(r,i,x,yf,scale,P,{...opt,zf:1,print:true});x+=segLen(r.points,i)*scale+gap;}
 const ww=Math.max(width,x-gap+right),hh=yf+reserve+12;return `<svg xmlns="http://www.w3.org/2000/svg" data-elevation207="1" width="${ww}" height="${hh}" viewBox="0 0 ${ww} ${hh}"><rect width="100%" height="100%" fill="${P.paper}"/>${body}</svg>`;
};
const fitWall207Base=fitWall;fitWall=function(){const r=room();if(!r||r.points.length<3)return fitWall207Base();const {w,h}=stageSize(),wr=wallRoom(r),k=wrK(wr),L=segLen(wr.points,k),H=r.ceiling||2700,left=125,right=90,top=60;let s=Math.min((w-left-right)/L,(h-top-190)/H),bottom=180;
 for(let i=0;i<4;i++){bottom=elevLayoutFor207(wr,k,0,0,s,palette(),{zf:1}).bottom;s=Math.max(.005,Math.min((w-left-right)/L,(h-top-bottom-8)/H));}
 S.view={s,ox:left+Math.max(0,(w-left-right-L*s)/2),oy:top+H*s};};
let lastMode207='';const render207Base=render;render=function(){if(innerWidth<700&&S.vmode==='wall'&&lastMode207!=='wall')S.palOpen=false;lastMode207=S.vmode;render207Base();let bar=document.getElementById('elevToolbar207');if(!bar){bar=document.createElement('div');bar.id='elevToolbar207';bar.style='position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;display:flex;gap:12px;align-items:center;padding:5px 10px;border:1px solid var(--rule);border-radius:9px;background:var(--paper);font:12px Arial;white-space:nowrap';document.querySelector('.stage').appendChild(bar);bar.addEventListener('pointerdown',e=>e.stopPropagation());bar.addEventListener('change',e=>{S.elevFurniture207=e.target.checked;try{localStorage.setItem('obmerka-elev-furniture207',String(e.target.checked));}catch(e){}fitWall();render();});}
 bar.hidden=S.vmode!=='wall';bar.style.display=bar.hidden?'none':'flex';bar.innerHTML=`<span>Размеры: монтажные точки</span><label><input type="checkbox" ${S.elevFurniture207!==false?'checked':''}> Размеры мебели</label>`;};
try{S.elevFurniture207=localStorage.getItem('obmerka-elev-furniture207')!=='false';}catch(e){}
