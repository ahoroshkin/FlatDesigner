from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v200).html')
if not src.exists():src=Path('obmerka-v200.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v200", APP_DATE="12.11.2026";','const APP_VER="v201", APP_DATE="12.11.2026";')
sub("[['plan','План'],['elev','Развёртка'],['3d','3D'],['items','Объекты'],['out','Чертежи']]","[['plan','План'],['elev','Развёртки'],['3d','3D']]")
sub("{k:'plan',n:'Планировка',items:[['src','Исходный план'],['dem','Демонтаж'],['part','Перегородки'],['rooms','Помещения']]}","{k:'plan',n:'Планировка',items:[['src','Исходный план'],['dem','Демонтаж'],['part','Новые перегородки'],['rooms','Итоговый план']]}")
sub("{k:'sum',n:'Итоги',items:[['ecost','Смета по этапам'],['ready','Готовность']]}","{k:'sum',n:'Итоги',items:[['drawings','Чертежи и ведомости'],['ecost','Смета по этапам'],['ready','Готовность']]}")
sub('["part","Конструкция (перегородки)"],["rooms","Помещения"]','["part","Новые перегородки"],["rooms","Итоговый план"]')
sub('else if(id==="ecost"){ soloOff(); openSheet("ecost"); }','else if(id==="drawings"){ soloOff(); openSheet("out"); }\n  else if(id==="ecost"){ soloOff(); openSheet("ecost"); }')
s=s.replace('«Помещениях»','«Итоговом плане»')
sub('<li><b>Внизу</b> — рабочие разделы: Контур, Объекты, Развёртка, Фото, Сводка, Вывод.</li>','<li><b>Внизу в Офисе</b> — виды: План, Развёртки, 3D. Чертежи и ведомости находятся в верхнем меню «Итоги». На объекте — инструменты замеров.</li>')
sub('<div id="app">','''<style>
#planTabs201{display:flex;gap:7px;flex:0 0 auto;padding:6px 12px;border-bottom:1px solid var(--rule);overflow-x:auto;background:var(--paper);min-height:40px;box-sizing:border-box}#planTabs201[hidden]{display:none}#planTabs201 button{white-space:nowrap;min-height:30px}.structure201{border:1px solid var(--accent);border-radius:10px;padding:10px;margin-bottom:12px;font-size:13px}.structure201 p{margin:7px 0}
</style><div id="app">''')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/navigation_v201.js').read_text()+'\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Навигация (v201)</h3><p>Внизу Офиса остаются виды «План», «Развёртки», «3D». Оформленные листы доступны через «Итоги → Чертежи и ведомости». «Объекты» из нижней панели убраны; каталог и список предметов доступны в рабочих разделах. Этапы планировки: исходный план, демонтаж, новые перегородки, итоговый план. В итоговом плане конструкция доступна только для просмотра; в карточке есть переход в этап её редактирования. На компьютере этапы видны отдельной строкой. В режиме «Объект» остаётся компактная панель замеров.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v201).html').write_text(s)
Path('/private/tmp/obm201check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v201 assembled')
