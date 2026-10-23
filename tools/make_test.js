// Делает тестовую копию программы с доступом window.__T для автотестов.
// node tools/make_test.js "<программа>.html"  →  tools/_test.html
const fs=require('fs'), path=require('path');
const src=process.argv[2]; if(!src){ console.error('укажите HTML'); process.exit(1); }
const s=fs.readFileSync(src,'utf8'), hook=fs.readFileSync(path.join(__dirname,'hook.js'),'utf8');
const anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';
if(!s.includes(anchor)){ console.error('не найдено место для вставки — обновите anchor в make_test.js'); process.exit(1); }
fs.writeFileSync(path.join(__dirname,'_test.html'), s.replace(anchor, anchor+'\n'+hook));
console.log('ok → tools/_test.html');
