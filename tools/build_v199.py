from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v198).html')
if not src.exists():src=Path('obmerka-v198.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v198", APP_DATE="12.11.2026";','const APP_VER="v199", APP_DATE="12.11.2026";')
sub('id="btnSaveFile" title="Сохранить в файл" aria-label="Сохранить проект в файл"','id="btnSaveFile" title="Сохранить: JSON, HTML, GitHub" aria-label="Сохранить проект" aria-haspopup="dialog" aria-expanded="false"')
sub(',:root[data-mode="field"] #btnSaveFile','')
sub('$("#btnSaveFile").addEventListener("click",()=>{ saveToFile().catch(e=>hint("Не удалось сохранить: "+(e&&e.message||e),4000)); });','$("#btnSaveFile").addEventListener("click",openSave199);')
sub('if(x.dataset.sv==="go") saveToFile().catch(()=>{});','if(x.dataset.sv==="go") openSave199();')
sub('if(mod&&k.toLowerCase()==="s"){ e.preventDefault(); saveToFile().catch(()=>{}); return; }','if(mod&&k.toLowerCase()==="s"){ e.preventDefault(); openSave199(); return; }')
sub('offer(fname(p.name)+".json", JSON.stringify(p,null,2), "application/json");','return offer(fname(p.name)+".json", JSON.stringify(p,null,2), "application/json");')
sub('<div id="app">','''<style>
.save-backdrop199{position:fixed;inset:0;z-index:50000;background:#0005;display:flex;align-items:flex-start;justify-content:flex-end;padding:72px 18px 18px;box-sizing:border-box}
.save-dialog199{background:var(--paper,#fff);color:var(--ink,#222);border:1px solid var(--rule,#ccc);border-radius:16px;padding:18px;width:440px;max-width:100%;max-height:calc(100dvh - 95px);overflow:auto;box-shadow:0 8px 36px #0003;box-sizing:border-box}
.save-heading199{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.save-heading199 h2{font-size:20px;margin:0}
.save-choice199{display:block;width:100%;text-align:left;padding:14px;margin:9px 0;border:1px solid var(--rule,#ccc);border-radius:10px;background:var(--paper2,#f8f7f2);color:inherit;cursor:pointer;font:inherit;min-height:64px}
.save-choice199 b{display:block;margin-bottom:5px}.save-choice199 span{display:block;font-size:13px;line-height:1.4}.save-choice199.primary{border:2px solid var(--accent,#17677e)}.save-choice199:focus-visible{outline:3px solid var(--accent,#17677e);outline-offset:2px}.save-choice199:disabled{opacity:.55;cursor:default}
.save-storage199{border-top:1px solid var(--rule,#ccc);padding-top:12px;margin-top:14px;font-size:13px}.save-storage199 .filemark{display:block;white-space:normal}
@media(max-width:560px){.save-backdrop199{padding:10px;align-items:flex-end}.save-dialog199{width:100%;max-height:calc(100dvh - 20px)}}
</style><div id="app">''')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/save_menu_v199.js').read_text()+'\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Сохранение JSON, HTML и GitHub (v199)</h3><p>Дискета в верхней панели и Ctrl/Cmd+S открывают меню сохранения. Первым пунктом идёт «Скачать проект JSON» — данные проекта без фотографий. Вторым — HTML с приложением и проектом. Третьим — синхронизация с приватным GitHub с результатом операции. Сохранение в браузере и статус HTML-копии показываются отдельно; скачивание JSON не меняет статус HTML.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v199).html').write_text(s)
Path('/private/tmp/obm199check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v199 assembled')
