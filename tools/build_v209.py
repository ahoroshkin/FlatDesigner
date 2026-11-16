from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v208).html')
if not src.exists():src=Path('obmerka-v208.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100]);s=s.replace(a,b,1)
sub('const APP_VER="v208",','const APP_VER="v209",')
a=s.index('/* Shared dimensions for interactive elevations, reports and installer drawings. */');b=s.index('function elevFurnitureLabel207',a)
block=s[a:b]
old=" const C=opt.fontScale||1,fs=Math.max(opt.print?13.5:10.5,9.1*clamp(C,.95,1.8)),fg=Math.max(8.7,fs*.83),gap=fs+7,blue=P.dim||'#2458b8',gray='#777b7e',faint='#b9b9b3',out=[];"
new=" const density=opt.print?1:clamp(Math.sqrt(Math.abs(X(d.L)-X(0))/800),.72,1.15),C=opt.fontScale||1,fs=(opt.print?13.5:10.5)*density*clamp(C,1,1.25),fg=fs*.83,gap=fs*1.38,blue=P.dim||'#2458b8',gray='#777b7e',faint='#b9b9b3',out=[];"
assert old in block;block=block.replace(old,new)
block=block.replace('let cursor=floor+20;','let cursor=floor+fs*2.0;')
a0=block.index(' if(floorF.length)');b0=block.index(' const vals=',a0)
block=block[:a0]+''' if(floorF.length){const widthF=selected207&&selected207.a>0?[{...selected207,a:0,b:selected207.a,offset:true},...floorF]:floorF;const entries=elevPack207(widthF.map(f=>({x:(X(f.a)+X(f.b))/2,label:mm(f.b-f.a),f})),fg,x0,x1),rows=1+Math.max(...entries.map(e=>e.row));
  for(const e of entries){const a=X(e.f.a),b=X(e.f.b),y=cursor+e.row*gap,ty=y-fg*.35;out.push(line(a,floor+3,a,y+3,faint,.5),line(b,floor+3,b,y+3,faint,.5),line(a,y,b,y,gray),tick(a,y,gray),tick(b,y,gray),`<g data-dim-row209="furniture" data-line-y="${y}">`,text(e.xLabel,ty,e.label,gray,fg,'middle',e.f.offset?'furniture-offset':'furniture-width',e.f.b-e.f.a),'</g>');if(Math.abs(e.x-e.xLabel)>1)out.push(line(e.x,y,e.xLabel,ty-fg,gray,.5));}
  out.push(text(x0-10,cursor,'Мебель по стене',gray,fg,'end','caption'));cursor+=rows*gap+fs*1.5;
 }
'''+block[b0:]
a0=block.index(' const packed=elevPack207');b0=block.index(' // Cumulative',a0)
block=block[:a0]+''' const packed=elevPack207(segments,fs,x0,x1),rows=packed.length?1+Math.max(...packed.map(e=>e.row)):1,chainY=cursor+(rows-1)*gap;
 for(const e of packed){const a=X(e.a),b=X(e.b),y=cursor+e.row*gap,ty=y-fs*.35;out.push(line(a,y,b,y,blue),tick(a,y,blue),tick(b,y,blue),`<g data-dim-row209="between" data-line-y="${y}">`,text(e.xLabel,ty,e.label,blue,fs,'middle','between',e.b-e.a),'</g>');if(Math.abs(e.xLabel-e.x)>1)out.push(line(e.x,y,e.xLabel,ty-fs,blue,.6));}
 out.push(text(x0-10,cursor,'Между осями',gray,fg,'end','caption'));
'''+block[b0:]
block=block.replace('absBase=chainY+26','absBase=chainY+fs*2.6')
block=block.replace('ty=absBase+fs+8+e.row*gap','ty=absBase+fs*1.4+e.row*gap')
block=block.replace('absBase+fs+8,opt.fromR','absBase+fs*1.4,opt.fromR')
block=block.replace('absBase+Math.max(1,absRows)*gap+34','absBase+Math.max(1,absRows)*gap+fs*1.7')
block=block.replace('overallY+fs+7','overallY+fs*1.4').replace('overallY+fs+16-floor','overallY+fs*2.4-floor')
block=block.replace('labels.at(-1).y+fs+6','labels.at(-1).y+gap').replace('labels[k+1].y-fs-6','labels[k+1].y-gap')
# Preserve close measurements, including sub-10 mm gaps; only the visual layout changes.
s=s[:a]+block+s[b:]
sub('<section id="h12">','<section id="h12"><h3>Размеры при зуме (v209)</h3><p>При уменьшении развёртки размерные ряды уплотняются. Числа находятся рядом со своей размерной линией; близкие привязки разнесены по компактным рядам. Точные значения сохраняются. Та же раскладка используется в отчётах и монтажных чертежах.</p>')
Path('tools/elevation_v209.js').write_text(s[s.index('/* Shared dimensions for interactive elevations, reports and installer drawings. */'):s.index('const bbElev208Base') if False else s.index('/* Floor skirting and cabinet plinths are independent surfaces. */')])
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v209).html').write_text(s)
print('v209 assembled; preload unchanged')
