from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v202).html')
if not src.exists():src=Path('obmerka-v202.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v202", APP_DATE="14.11.2026";','const APP_VER="v203", APP_DATE="14.11.2026";')
sub('st=r===0?1:typeof v', 'st=r===0||s.sectionRows?.includes(r)?1:typeof v')
sub('r===0?38:Math.max(32','r===0?38:s.sectionRows?.includes(r)?30:Math.max(32')
sub('if(v?.f)return `<c r="${a}" s="${st}"><f>${xxml202(v.f)}</f><v>${v.v}</v></c>`;', 'if(v?.f)return `<c r="${a}" s="${st}"${typeof v.v===\'string\'?\' t="str"\':\'\'}><f>${xxml202(v.f)}</f><v>${xxml202(v.v)}</v></c>`;')
sub('</sheetData><autoFilter ref="A1:${col(s.rows[0].length-1)}${s.rows.length}"/></worksheet>', '''</sheetData>${s.filter===false?'':`<autoFilter ref="A1:${col(s.rows[0].length-1)}${s.rows.length}"/>`}${s.merges?.length?`<mergeCells count="${s.merges.length}">${s.merges.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells>`:''}</worksheet>''')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/estimate_v203.js').read_text()+'\n'+anchor)
sub('<div id="app">','''<style>
:root.est203-open[data-mode="office"] .sheet{width:min(760px,65vw)}:root.est203-open[data-mode="office"].sheet-on #app{right:min(760px,65vw)!important}
.est203-head{padding:8px 0 12px;border-bottom:1px solid var(--rule)}.est203-head>b{font-size:19px}.est203-head p{font-size:12px;line-height:1.4;color:var(--ink-2)}.est203-actions{display:flex;gap:6px;flex-wrap:wrap}.est203-actions .btn{font-size:12px;min-height:38px}.est203-group{margin:14px 0;border:1px solid var(--rule);border-radius:10px;overflow:hidden}.est203-group>summary{font-weight:700;padding:12px;background:var(--paper2)}.est203-scroll{overflow-x:auto}.est203-table{border-collapse:collapse;width:100%;min-width:480px;font-size:12px}.est203-table th,.est203-table td{padding:9px 7px;text-align:right;border-bottom:1px solid var(--rule);vertical-align:middle}.est203-table th:first-child,.est203-table td:first-child{text-align:left;min-width:150px}.est203-table th{font-size:11px;color:var(--ink-2)}.est203-table input{width:90px;min-width:70px;text-align:right;font-size:12px;padding:5px}.est203-total{padding:10px 12px;font-weight:700;text-align:right;font-size:12px}.est203-summary{padding:12px;border-top:2px solid var(--accent)}.est203-summary>div{display:flex;justify-content:space-between;gap:12px;margin:9px 0;font-size:13px}.est203-missing{color:#985100}.est203-roomtotal{padding:10px;background:var(--paper2);border-bottom:2px solid var(--accent);font-weight:700}
</style><div id="app">''')
sub('<section id="h12">','<section id="h12"><h3>Компактная смета (v203)</h3><p>В «Итогах» смета работ сгруппирована по помещениям и видам работ. Материалы и расчёт объёмов отделены от основного листа. Экран и Excel используют одну модель. Расценки можно менять в таблице, одинаковая работа имеет общую цену. В Excel четыре листа: смета работ, материалы, расчёт объёмов, условия. Неуказанные цены не выдаются за нулевую стоимость; итог предварительный. Подробные параметры доступны через «Объёмы и настройки».</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v203).html').write_text(s)
Path('/private/tmp/obm203check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v203 assembled')
