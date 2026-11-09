"""Screen-only dimension controls, applied to the v197 HTML builder."""

def patch_dimensions(sub):
    sub('roomDims:!!(S.dimAll||roomsAllOn()), apartment196:', 'dims:S.stageDims!==false, roomDims:!!S.dimAll, screenDims197:true, apartment196:')
    sub('dims:((cur||o.roomDims)&&o.dims!==false), dimChain:o.dimChain,', 'dims:((cur||o.roomDims)&&o.dims!==false), objectDims197:!o.screenDims197||((cur||o.roomDims)&&o.dims!==false), dimChain:o.dimChain,')
    sub('dimOut.push(roomInnerDims(r,T,P,o.dimChain===false));', 'dimOut.push(`<g data-room-dim197="${esc(r.id)}">${roomInnerDims(r,T,P,o.dimChain===false)}</g>`);')
    sub('if(S.furnDims && Math.max(B.w,B.d)*T.s>26)', 'if(o.objectDims197!==false && S.furnDims && Math.max(B.w,B.d)*T.s>26)')
    sub('if(ip.free && n>2 && o.ties!==false', 'if(o.objectDims197!==false && ip.free && n>2 && o.ties!==false')
    sub('out.push(lab(H.sx,"шаг "+mm(A0.sx))+lab(H.sy,"шаг "+mm(A0.sy)));', 'if(o.objectDims197!==false) out.push(lab(H.sx,"шаг "+mm(A0.sx))+lab(H.sy,"шаг "+mm(A0.sy)));')
    for suffix in ['A.n>1','A.m>1','(o.only==="ceiling"||S.vmode==="ceil")']:
        sub('if(labels && S.lightDims!==false && '+suffix, 'if(o.objectDims197!==false && labels && S.lightDims!==false && '+suffix)
    sub('if(S.dragDim) out.push(planDragDimSVG(p,T,P));', 'if(o.dims!==false&&S.dragDim) out.push(planDragDimSVG(p,T,P));')
    sub('if(S.netLive&&S.netLive.widths)', 'if(o.dims!==false&&S.netLive&&S.netLive.widths)')

    # Stage dimensions use the same scope. Match original faces to the selected room
    # by its boundary IDs, with a point-in-polygon fallback for a rebuilt contour.
    sub('if(S.stageDims!==false){                          // v155: размеры стен в свету у всех помещений (исходный план / демонтаж / перегородки)', 'if(o.dims!==false){')
    sub('dr.forEach((r,i)=>{ try{ out.push(roomInnerDims(stage==="part"?r:stageDimRoom(p,r),T,P,false)); }catch(e){} }); }',
        '''if(o.screenDims197&&!o.roomDims){
      const selected=(p.rooms||[]).find(r=>r.id===S.roomId);
      if(stage==="part") dr=dr.filter(r=>r===selected);
      else if(selected?.points?.length>2){
        const c=centroid(selected.points), walls=new Set((selected.wids||[]).filter(Boolean));
        const same=r=>new Set((r.wids||[]).filter(id=>walls.has(id))).size;
        const own=dr.find(r=>inPoly(c,r.points))||dr.reduce((best,r)=>same(r)>(best?same(best):0)?r:best,null);
        dr=own?[own]:[];
      }else dr=[];
    }
    dr.forEach(r=>{ try{ out.push(`<g data-stage-dim197>${roomInnerDims(stage==="part"?r:stageDimRoom(p,r),T,P,false)}</g>`); }catch(e){} }); }''')
    sub('if(stage==="src") dgSVG(p,T,P,Z,out);','if(stage==="src"&&o.dims!==false) dgSVG(p,T,P,Z,out);')

    # The ceiling and elevation have separate dimension renderers. Pass the
    # switch explicitly from the screen so exports retain their dimensions.
    sub('ceilSVG(r,w,h,P,S.view)', 'ceilSVG(r,w,h,P,S.view,o.dims)')
    sub('function ceilSVG1(r,W,H,P,Tin){','function ceilSVG1(r,W,H,P,Tin,dims=true){')
    sub('only:"ceiling", lightsToo:true, verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:Tin?"sel":false, dims:false','only:"ceiling", lightsToo:true, verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:Tin?"sel":false, dims:false, objectDims197:dims')
    sub('const cap=`Потолок ${mm(r.ceiling||0)} мм`+(dc?` · подвесной ${mm(dc)} мм`:"");','const cap=dims?`Потолок ${mm(r.ceiling||0)} мм`+(dc?` · подвесной ${mm(dc)} мм`:""):"Потолок";')
    sub('if(ax.xs.length){','if(dims&&ax.xs.length){')
    sub('if(ax.ys.length){','if(dims&&ax.ys.length){')
    sub('${body}${chains}${empty}', '${body}${chains?`<g data-ceil-dim197>${chains}</g>`:""}${empty}')
    sub('floorSVG(r,w,h,P,S.view)', 'floorSVG(r,w,h,P,S.view,o.dims)')
    sub('function floorSVG1(r,W,H,P,Tin){','function floorSVG1(r,W,H,P,Tin,dims=true){')
    sub('function partsFloorSVG(r,W,H,P,Tin,parts){','function partsFloorSVG(r,W,H,P,Tin,parts,dims=true){')
    sub('partsFloorSVG(r,W,H,P,Tin,parts);','partsFloorSVG(r,W,H,P,Tin,parts,dims);')
    sub('planSVG(r,T,W,H,P,{only:"floor", verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:false, dims:false})','planSVG(r,T,W,H,P,{only:"floor", verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:false, dims:false, objectDims197:dims})')
    sub('planSVG(b,T,W,H,P,{only:"floor", verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:false, dims:false})','planSVG(b,T,W,H,P,{only:"floor", verts:false, live:!!Tin, zoom:!!Tin, grid:false, area:false, ties:false, dims:false, objectDims197:dims})')
    sub('zf:elevZF(WR,K,w,h)}','zf:elevZF(WR,K,w,h),dims:o.dims}')
    sub('if(S.wdim&&S.wdim.i===K){','if(o.dims&&S.wdim&&S.wdim.i===K){')
    sub('if(S.wsnap){\n        const G=S.wsnap', 'if(o.dims&&S.wsnap){\n        const G=S.wsnap')
    sub('wide?`СТЕНА ${r.wlab?r.wlab[i]:i+1} · ${mm(L)} × ${mm(Hc)}`','wide&&opt.dims!==false?`СТЕНА ${r.wlab?r.wlab[i]:i+1} · ${mm(L)} × ${mm(Hc)}`')
    sub('const DM=P.dim||P.ink2;                                  // v142: размеры — синим', 'if(opt.dims!==false){\n  o.push(\'<g data-elev-dim197>\');\n  const DM=P.dim||P.ink2;')
    sub('if(opt.noV) return o.join("");','if(opt.noV){o.push("</g>");return o.join("");}')
    sub('if(opt.noHandle!==true) elevSizeHandles(r,i).forEach','o.push("</g>");}\n  if(opt.noHandle!==true) elevSizeHandles(r,i).forEach')

    sub('> Размеры исходного плана</label>', '> Показывать размеры</label>')
    sub('> Размеры стен на планах «Исходный план», «Демонтаж», «Перегородки»</label>', '> Показывать размеры</label>')
    sub('> Размеры всех помещений</label>', '> Размеры всех помещений <small>· иначе только выбранного</small></label>')
    sub(' · вся квартира, размеры везде', ' · вся квартира')
    sub('Все помещения: вся квартира, размеры стен у каждого помещения', 'Показаны все помещения')
    sub('S.stageDims=e.target.checked; try{', 'S.stageDims=e.target.checked; document.querySelectorAll("#lay_sdims").forEach(el=>el.checked=S.stageDims); try{')
    sub('S.dimAll=e.target.checked; try{', 'S.dimAll=e.target.checked; document.querySelectorAll("#lay_dimall").forEach(el=>el.checked=S.dimAll); try{')
