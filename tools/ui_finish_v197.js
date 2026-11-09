// Only confirmed file writes turn the HTML badge green. A download request
// is separate because a browser does not report its completion to the page.
const fileRecords197=new Map(), filePending197=new Set();
function loadFile197(id){
 if(fileRecords197.has(id))return;
 fileRecords197.set(id,null);
 Promise.all([getMeta('fs197:'+id),getMeta('fs:'+id)]).then(([record,legacy])=>{
  if(fileRecords197.get(id)!==null)return;
  fileRecords197.set(id,record||false);
  FS_AT[id]=record?.version||+legacy||0;
  saveStatus195();
 }).catch(()=>{if(fileRecords197.get(id)===null)fileRecords197.set(id,false);saveStatus195();});
}
async function recordFile197(id,version,kind){
 const record={version,kind};
 fileRecords197.set(id,record);
 FS_AT[id]=version;
 await setMeta('fs197:'+id,record);
}
function saveStatus197(){
 const p=S.project;if(!p)return;
 const local=S.localSaving195?['wait','сохранение…']:S.localError195?['bad','ошибка сохранения']:storageOK===false?['bad','только в памяти']:storageOK===null?['wait','проверка…']:['good','сохранено ✓'];
 const record=fileRecords197.get(p.id);
 let file;
 if(filePending197.has(p.id))file=['wait','выгрузка…'];
 else if(record==null)file=['wait','проверка…'];
 else if(!record)file=['stale','не обновлена'];
 else if(record.version!==+p.updated)file=['stale','есть новые правки'];
 else if(record.kind==='download')file=['wait','скачивание запущено'];
 else file=['good','сохранена ✓'];
 const html=`<span class="filemark ${local[0]}" data-saved197="local">В браузере: ${local[1]}</span><span class="filemark ${file[0]}" data-saved197="html">HTML-копия: ${file[1]}</span>`;
 for(const el of document.querySelectorAll('#fileMark,[data-storage197]')){
  if(el.innerHTML!==html)el.innerHTML=html;
 }
}
const saveFileBase197=saveToFile;
saveToFile=async function(){
 const p=S.project;
 if(!p||S.ro||window.OBM_RO||filePending197.has(p.id))return;
 filePending197.add(p.id);saveStatus197();
 try{await saveFileBase197();}finally{filePending197.delete(p.id);saveStatus197();}
};
function arrayHandleHit197(r,sp){
 const s=S.sel,it=s?.kind==='item'&&r.items[s.i],c=it&&byType[it.type];
 if(!it||!c?.array||!isArr(it)||!LIGHT_T.has(it.type)||S.ro||window.OBM_RO||!layerEditable195(r,it)||!layerOnIt(r,it)||!(lightPlan196()||S.vmode==='ceil'))return null;
 const H=arrHandles(it,S.view);
 for(const [k,kind] of [['rot','arrrot'],['sx','arrsx'],['sy','arrsy'],['mv','item']]){
  const q=H[k];if(q&&Math.hypot(q[0]-sp[0],q[1]-sp[1])<16)return {kind,i:s.i};
 }
 return null;
}
