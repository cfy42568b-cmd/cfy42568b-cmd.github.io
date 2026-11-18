import * as T from './vendor/three.module.js';
import {drawing} from './patina.js';

const tau=Math.PI*2;
let seed=72621;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function mesh(parent,g,m,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o}
function circle(parent,r,t,m,y){const o=mesh(parent,new T.TorusGeometry(r,t,8,96),m,0,y,0);o.rotation.x=Math.PI/2;return o}
function metal(base,wet=false){const tex=drawing(384,384,(c,w,h)=>{c.fillStyle=base;c.fillRect(0,0,w,h);for(let i=0;i<19500;i++){c.fillStyle=i%4?'rgba(24,28,25,.28)':'rgba(188,171,141,.28)';c.fillRect(random()*w,random()*h,random()*1.9+.3,random()*1.6+.3)}for(let i=0;i<100;i++){let x=random()*w,y=random()*h,r=2+random()*11;for(let j=0;j<30;j++){let a=random()*tau,d=random()*r;c.fillStyle=j%3?'rgba(127,77,44,.20)':'rgba(75,51,36,.18)';c.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d,1+random()*2,1+random()*2)}}});
return new T.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:.0019,metalness:wet?.4:.26,roughness:wet?.46:.78})}

export function streetCastings(G){
 const iron=metal('#565951'),edge=metal('#77766a'),wetIron=metal('#494e49',true);
 const collar=new T.Group();collar.position.set(-.94,.03,3.13);G.add(collar);
 const profile=[[.315,-.39],[.315,.001],[.322,.006],[.331,.006],[.331,.021],[.347,.021],[.356,.012],[.369,.01],[.376,-.012],[.376,-.04]].map(([r,y])=>new T.Vector2(r,y));
 const rim=mesh(collar,new T.LatheGeometry(profile,96),wetIron);rim.material.side=T.DoubleSide;
 mesh(collar,new T.CylinderGeometry(.316,.316,.012,80),new T.MeshStandardMaterial({color:'#2e3933',roughness:.54}),0,-.32,0);
 // The pool is fed by a shallow overflow at the low lip of the frame.
 const water=new T.MeshPhongMaterial({color:0x668c81,specular:0xb8d9d4,shininess:90,transparent:true,opacity:.56,depthWrite:false,side:T.DoubleSide});
 const surface=mesh(collar,new T.CircleGeometry(.315,80),water,0,.017,0);surface.rotation.x=-Math.PI/2;surface.castShadow=false;
 const strip=[],faces=[];for(let j=0;j<=30;j++){let t=j/30,z=.248+.46*t,x=.018*Math.sin(t*7)*Math.sin(t*Math.PI),w=.096+.026*Math.sin(9*t)+.043*t,h=.019+.006*Math.exp(-((t-.22)**2)/.006)-.004*t;
 for(let k=0;k<5;k++){let u=k/2-1;strip.push(x+w*u,h+.0017*Math.sin(t*17+u*3),z);if(j&&k){let a=j*5+k;faces.push(a-6,a-1,a-5,a-5,a-1,a)}}}
 const spill=new T.BufferGeometry();spill.setAttribute('position',new T.Float32BufferAttribute(strip,3));spill.setIndex(faces);spill.computeVertexNormals();mesh(collar,spill,water).castShadow=false;
 circle(collar,.351,.0027,edge,.016);
 const cover=new T.Group();collar.add(cover);cover.position.set(-.049,.104,-.085);cover.rotation.order='YXZ';cover.rotation.set(-.31,-.22,.044);
 const silhouette=new T.Shape();silhouette.absarc(0,0,.329,0,tau,false);
 for(let x of [-.231,.231]){const slot=new T.Path();slot.absellipse(x,0,.010,.034,0,tau,true);silhouette.holes.push(slot)}
 const plate=new T.ExtrudeGeometry(silhouette,{depth:.025,bevelEnabled:true,bevelThickness:.0024,bevelSize:.0024,bevelSegments:2,curveSegments:48});plate.rotateX(-Math.PI/2);mesh(cover,plate,iron);
 circle(cover,.313,.0035,edge,.027);circle(cover,.268,.0031,edge,.027);circle(cover,.091,.0045,edge,.028);
 // Stamped anti-slip lozenges leave the two lifting pockets and the town seal clear.
 const diamond=new T.Shape();diamond.moveTo(-.019,0);diamond.lineTo(0,.0047);diamond.lineTo(.019,0);diamond.lineTo(0,-.0047);diamond.closePath();
 const relief=new T.ExtrudeGeometry(diamond,{depth:.0035,bevelThickness:.0013,bevelSize:.0013,bevelSegments:1});relief.rotateX(-Math.PI/2);
 const transforms=[],dummy=new T.Object3D();for(let iz=-10;iz<=10;iz++)for(let ix=-9;ix<=9;ix++){let z=iz*.029,x=(ix+(iz%2)*.5)*.045,r=Math.hypot(x,z);if(r<.112||r>.25||Math.abs(Math.abs(x)-.231)<.026&&Math.abs(z)<.051)continue;dummy.position.set(x,.027,z);dummy.rotation.y=(iz%2?1:-1)*.55;dummy.updateMatrix();transforms.push(dummy.matrix.clone())}
 const ridges=new T.InstancedMesh(relief,edge,transforms.length);transforms.forEach((m,i)=>ridges.setMatrixAt(i,m));ridges.castShadow=ridges.receiveShadow=true;cover.add(ridges);
 const emblem=new T.Shape();emblem.moveTo(0,.006);emblem.bezierCurveTo(-.019,.022,-.028,.049,-.014,.067);emblem.lineTo(0,.059);emblem.lineTo(.013,.067);emblem.bezierCurveTo(.030,.046,.016,.019,0,.006);
 const petal=new T.ExtrudeGeometry(emblem,{depth:.004,bevelEnabled:true,bevelThickness:.001,bevelSize:.001,bevelSegments:1});petal.rotateX(-Math.PI/2);
 for(let i=0;i<5;i++)mesh(cover,petal,edge,0,.028,0).rotation.y=i*tau/5;
 const legend=drawing(768,768,(c,w,h)=>{c.translate(w/2,h/2);c.textAlign='center';c.textBaseline='middle';c.fillStyle='#b9b09a';c.font='bold 25px serif';const words='桜　町　雨　水';[...words].forEach((v,i)=>{let a=(i-3)*.112;c.save();c.rotate(a);c.fillText(v,0,-316);c.restore()});c.font='18px monospace';c.fillText('S  •  1968',0,318)});
 const writing=mesh(cover,new T.PlaneGeometry(.698,.698),new T.MeshStandardMaterial({map:legend,transparent:true,depthWrite:false,roughness:.86}),0,.030,0);writing.rotation.x=-Math.PI/2;writing.castShadow=false;
 for(let n=0;n<3;n++){const bar=mesh(cover,new T.BoxGeometry(.54,.025,.014),iron,0,-.009,0);bar.rotation.y=n*Math.PI/3}
 tyres(G)
}

function tyres(G){
 // The texture wraps once around the wheel. Its vertical coordinate follows the bead-to-bead section.
 const profile=[[.258,-.070],[.254,-.088],[.268,-.098],[.310,-.104],[.367,-.102],[.399,-.094],[.417,-.079],[.431,-.061],[.435,-.032],[.436,0],[.435,.032],[.431,.061],[.417,.079],[.399,.094],[.367,.102],[.310,.104],[.268,.098],[.254,.088],[.258,.070],[.264,.047],[.264,-.047],[.258,-.070]];
 const N=144,ps=[],uv=[],idx=[];for(let j=0;j<profile.length;j++){let [r,y]=profile[j];for(let i=0;i<=N;i++){let a=i*tau/N;ps.push(Math.sin(a)*r,y,Math.cos(a)*r);uv.push(i/N,j/(profile.length-1));if(i&&j){let k=j*(N+1)+i;idx.push(k-N-2,k-N-1,k-1,k-N-1,k,k-1)}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(ps,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const sectionY=j=>(1-j/(profile.length-1))*512;
 function paintRubber(i,height){return drawing(1536,512,(c,w,h)=>{c.fillStyle=height?'#858585':['#514f48','#434641','#565750'][i];c.fillRect(0,0,w,h);
 for(let k=0;k<29000;k++){let v=random();c.fillStyle=v<.50?'rgba(10,12,11,.20)':'rgba(158,153,134,.17)';c.fillRect(random()*w,random()*h,.4+random()*2,.5+random()*1.4)}
 let top=sectionY(12),base=sectionY(6),mid=(top+base)/2;
 for(let j=0;j<4;j++){let y=top+(j+1)*(base-top)/5;c.strokeStyle=height?'#343434':'#343731';c.lineWidth=2.5;c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
 for(let j=-1;j<64;j++)for(let side of [-1,1]){let x=j*24+(side<0?7:0),fade=(i===2&&j>21&&j<35);c.beginPath();c.moveTo(x,mid+side*3);c.lineTo(x+(i===1?-5:7),mid+side*17);c.lineTo(x+(i===1?-5:4),mid+side*33);c.lineTo(x+(i===1?9:15),mid+side*53);c.lineTo(x+18,mid+side*76);c.strokeStyle=height?'#222222':fade?'#474941':'#272b26';c.lineWidth=fade?1.1:3.8;c.stroke();c.translate(1.7,0);c.strokeStyle=height?'#adadad':'rgba(155,151,135,.38)';c.lineWidth=1.1;c.stroke();c.translate(-1.7,0)}
 for(let j of [2.2,2.7,4.75,5.23,13.25,14.22,15.88,16.38]){let y=sectionY(j);c.fillStyle=height?'#aaaaaa':'#64655b';c.fillRect(0,y,w,1.26)}
 for(let side of [3.65,14.82]){let y=sectionY(side);c.textBaseline='middle';c.fillStyle=height?'#bfbfbf':'#79796b';c.font='bold 19px sans-serif';c.fillText(['SAKURA  •  TOURING','HIGASHI  •  RADIAL','SAKURA  •  ROAD'][i],60,y);c.font='bold 16px monospace';c.fillText('155 / 70 R13    75S',616,y);c.fillText('TUBELESS     JAPAN',1110,y)}
 for(let k=0;k<175;k++){let x=random()*w,y=sectionY((random()<.5?3:13)+random()*2.65);c.strokeStyle=height?'#464646':'rgba(29,33,28,.7)';c.lineWidth=.6+random()*.85;c.beginPath();c.moveTo(x,y);for(let n=0;n<4;n++){x+=random()*3+.6;y+=(random()-.5)*7;c.lineTo(x,y)}c.stroke()}
 })}
 for(let i=0;i<3;i++){let tex=paintRubber(i,false),relief=paintRubber(i,true);tex.anisotropy=relief.anisotropy=8;relief.colorSpace=T.NoColorSpace;let m=new T.MeshStandardMaterial({map:tex,bumpMap:relief,bumpScale:.0025,roughness:.94});let o=mesh(G,g,m,-1.56+[0,.027,-.04][i],.181+.103+i*.202,1.68+[0,.012,.035][i]);o.rotation.set(i===2?.025:0,i*1.68+.39,i===1?.017:0)}
}
