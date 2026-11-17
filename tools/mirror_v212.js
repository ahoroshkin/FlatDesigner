/* Mirror controls join the existing 3D lighting registry; design data is read-only here. */
function mirrorKey212(it,p=S.project){return mirrorControl198(it)==='switch'&&it.lg?it.lg:`mirror212:${p?.id||''}:${mirrorControl198(it)}:${it.id}`;}
function mirrorRegister212(mesh,it,key){if(!mesh)return;V3.LG=V3.LG||{};mesh.userData.mirrorLight212=it.id;v3Reg(mesh,key,'lamp');}
const v3Furn212Base=v3Furn;
v3Furn=function(it,c,r){const group=v3Furn212Base(it,c,r);if(!litMirror198(it)||!it.id||!r?.id)return group;
 const mode=mirrorControl198(it),key=mirrorKey212(it);V3.lgOn=V3.lgOn||{};
 if(mode==='switch'&&!it.lg)V3.lgOn[key]=false;
 const lights=[];group.traverse(m=>{if(m.isMesh&&m.userData.mk==='lamp')lights.push(m);});lights.forEach(m=>mirrorRegister212(m,it,key));
 if(mode==='button'){
  const h=Math.max(20,+it.h||c.h||600),d=thinT(it)?furnitureDepth200(it,c):Math.max(50,+it.d||c.d||600),y=clamp(h*.35,100,800),z=d/2,sw={g:key,id:it.id,k:0,q:0,mirror212:true};
  const button=new THREE.Group();button.userData.mirrorButton212=it.id;group.add(button);
  v3Cyl(button,14,14,3,0,y,z+3,'steel',28,'z');
  const ring=v3Mesh(new THREE.TorusGeometry(6,.8,8,24,Math.PI*1.6),v3M('lamp'),false);ring.rotation.z=Math.PI*.7;ring.position.set(0,y,z+5);button.add(ring);mirrorRegister212(ring,it,key);
  const stroke=v3B(button,-.7,.7,y+1,y+8,z+4,z+6,'lamp');mirrorRegister212(stroke,it,key);
  const target=new THREE.Mesh(new THREE.CircleGeometry(25,24),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));target.position.set(0,y,z+7);target.userData.mirrorTarget212=it.id;button.add(target);
  button.traverse(m=>{if(m.isMesh)m.userData.swk=sw;});
 }
 return group;
};
window.__mirror212={key:mirrorKey212,apply:v3LgApply,hit:v3SwitchHit};
