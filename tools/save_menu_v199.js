function closeSave199(){
 const box=document.getElementById('saveDialog199');if(!box)return;
 box.remove();document.getElementById('btnSaveFile')?.setAttribute('aria-expanded','false');document.getElementById('btnSaveFile')?.focus();
}
function openSave199(){
 if(document.getElementById('saveDialog199')){closeSave199();return;}
 if(!S.project)return;
 const box=document.createElement('div');box.id='saveDialog199';box.className='save-backdrop199';
 const ro=S.ro||window.OBM_RO;
 box.innerHTML=`<section class="save-dialog199" role="dialog" aria-modal="true" aria-labelledby="saveTitle199"><div class="save-heading199"><h2 id="saveTitle199">Сохранить проект</h2><button class="iconbtn" data-save199="close" aria-label="Закрыть">✕</button></div><button class="save-choice199 primary" data-save199="json"><b>Скачать проект JSON</b><span>Данные проекта для переноса в Обмерку. Без фотографий.</span></button><button class="save-choice199" data-save199="html"${ro?' disabled':''}><b>Скачать HTML с проектом</b><span>Приложение и проект в одном файле.</span></button><button class="save-choice199" data-save199="github"${ro?' disabled':''}><b>Сохранить в GitHub</b><span>${SYNC.cfg?.token?'Синхронизировать с репозиторием данных.':'GitHub не подключён — открыть настройку.'}</span></button><div data-storage197 class="save-storage199"></div><p class="note" id="saveResult199" role="status" aria-live="polite"></p></section>`;
 document.body.appendChild(box);document.getElementById('btnSaveFile')?.setAttribute('aria-expanded','true');saveStatus197();
 box.querySelector('[data-save199="json"]').focus();
 box.addEventListener('click',async e=>{
  const button=e.target.closest('[data-save199]');
  if(e.target===box||button?.dataset.save199==='close'){closeSave199();return;}
  if(!button||button.disabled)return;
  const action=button.dataset.save199;
  if(action==='json'){closeSave199();await exportJSON();return;}
  if(action==='html'){closeSave199();saveToFile().catch(err=>hint('Не удалось сохранить HTML: '+err.message,5000));return;}
  if(action==='github'){
   if(!SYNC.cfg?.token){closeSave199();openSheet('projects');hint('Подключите приватный репозиторий в разделе «Синхронизация с GitHub»',5000);return;}
   const result=box.querySelector('#saveResult199');button.disabled=true;result.textContent='Сохраняю и синхронизирую…';
   try{
    const p=JSON.parse(JSON.stringify(S.project)),version=+p.updated;
    clearTimeout(saveT);await putProject(p);await setMeta('last',p.id);
    const out=await syncAll();
    if(out.err)throw Error(out.err);
    if(out.busy)result.textContent='Синхронизация уже выполняется. Проверьте статус GitHub после её завершения.';
    else if(out.copies||(+SYNC.map[p.id]?.updated||0)!==version)result.textContent='Синхронизация завершена. Есть другая версия проекта — проверьте копии в «Проектах».';
    else result.textContent='Проект сохранён в GitHub'+((+S.project.updated!==version)?'. После отправки появились новые правки.':'.');
   }catch(err){result.textContent='Не удалось сохранить в GitHub: '+err.message;}
   finally{button.disabled=false;saveStatus197();}
  }
 });
 box.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeSave199();return;}
  if(e.key!=='Tab')return;
  const buttons=[...box.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
}
