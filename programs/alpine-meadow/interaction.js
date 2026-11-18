import * as T from './vendor/three.module.js';
export function interaction({canvas,camera,controls,picks,getTime,onLight,onPause}){
 const modes=[...document.querySelectorAll('[data-mode]')],orbit=document.querySelector('#orbit'),bubble=document.querySelector('#reply');
 const caster=new T.Raycaster(),pointer=new T.Vector2(),anchor=new T.Vector3();let speaker=null,timer;
 const chooseLight=index=>{onLight(index);modes.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)))};
 const rotate=on=>{controls.autoRotate=on;orbit.setAttribute('aria-pressed',String(on))};
 function reset(){rotate(false);let damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.reset();controls.enableDamping=damping;speaker=null;bubble.hidden=true}
 modes.forEach((button,i)=>button.onclick=()=>chooseLight(i));orbit.onclick=()=>rotate(!controls.autoRotate);document.querySelector('#reset').onclick=reset;
 window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;let k=e.key.toLowerCase();if(['1','2','3'].includes(k))chooseLight(Number(k)-1);else if(k==='r')rotate(!controls.autoRotate);else if(k==='home'){e.preventDefault();reset()}else if(k===' '&&e.target.tagName!=='BUTTON'){e.preventDefault();onPause()}});
 function anchorFor(g){g.getWorldPosition(anchor);anchor.y+=g.userData.kind==='person'?1.28:.98;return anchor.project(camera)}
 function updateReply(){if(!speaker)return;let p=anchorFor(speaker),rect=canvas.getBoundingClientRect(),bw=bubble.offsetWidth||170;let x=rect.left+(p.x+1)*rect.width/2,y=rect.top+(1-p.y)*rect.height/2;bubble.style.visibility=p.z>1||p.z< -1||x<0||x>innerWidth||y<0||y>innerHeight?'hidden':'visible';bubble.style.left=Math.max(bw/2+4,Math.min(innerWidth-bw/2-4,x))+'px';bubble.style.top=Math.max(40,y-5)+'px'}
 function reply(g){const data=g.userData;data.greet=getTime();let lines=data.lines||[data.name.includes('奶牛')?'哞——':'咩～',data.name.includes('奶牛')?'哞，哞。':'咩咩！'];let seq=data.replyCount||0;data.replyCount=seq+1;speaker=g;bubble.textContent=data.name.split(' · ')[0]+'　'+lines[seq%lines.length];bubble.hidden=false;updateReply();clearTimeout(timer);timer=setTimeout(()=>{speaker=null;bubble.hidden=true},2700)}
 function pick(x,y){const rect=canvas.getBoundingClientRect();pointer.set((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2);
 caster.setFromCamera(pointer,camera);let hit=caster.intersectObjects(picks,true)[0];if(hit){let g=hit.object;while(g&&!g.userData.kind)g=g.parent;if(g)reply(g);return}
 let best=null,score=Infinity;for(const g of picks){g.getWorldPosition(anchor);anchor.y+=g.userData.kind==='person'?.59:.48;anchor.project(camera);if(anchor.z< -1||anchor.z>1)continue;let dx=(anchor.x-pointer.x)*rect.width/2,dy=(anchor.y-pointer.y)*rect.height/2,d=dx*dx+dy*dy;if(d<score&&d<81){score=d;best=g}}if(best)reply(best)}
 const pointers=new Set();let tap=null;
 canvas.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);tap=pointers.size===1&&e.button===0?{id:e.pointerId,x:e.clientX,y:e.clientY}:null});
 canvas.addEventListener('pointermove',e=>{if(tap?.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)tap=null});
 canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);tap=null});
 canvas.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(tap?.id===e.pointerId&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6)pick(e.clientX,e.clientY);tap=null});
 return updateReply
}
