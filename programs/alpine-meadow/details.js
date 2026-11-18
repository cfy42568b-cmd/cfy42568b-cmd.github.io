import * as T from './vendor/three.module.js';
import {channel} from './headwaters.js';
const circle=Math.PI*2;
let state=777;const rand=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296),between=(a,b)=>a+(b-a)*rand();
function texture(kind){let c=document.createElement('canvas');c.width=c.height=256;let ctx=c.getContext('2d'),im=ctx.createImageData(256,256);for(let y=0;y<256;y++)for(let x=0;x<256;x++){let v=218+(rand()-.5)*29;if(kind==='wood')v+=15*Math.sin(y*.44+2*Math.sin(x*.025)+Math.sin(x*.082+y*.036))+8*Math.sin(y*.93+x*.009);else v+=12*Math.cos(x*.095+Math.sin(y*.074)*2)+9*Math.sin(y*.027+x*.024);im.data.set([v,v,v,255],4*(y*256+x))}ctx.putImageData(im,0,0);let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;return t}
const grain=texture('wood'),stone=texture('stone');
const spruceMap=new T.TextureLoader().load('./spruce.webp');spruceMap.colorSpace=T.SRGBColorSpace;spruceMap.anisotropy=4;
const sprayGeo=new T.PlaneGeometry(1,1,4,6),sp=sprayGeo.attributes.position;
for(let i=0;i<sp.count;i++){let t=sp.getY(i)+.5,x=sp.getX(i);sp.setXYZ(i,x,.16*Math.sin(Math.PI*t)-.081*x*x-.205*t*t,t)}sprayGeo.computeVertexNormals();
const sprayMat=new T.MeshStandardMaterial({map:spruceMap,side:T.DoubleSide,alphaTest:.44,roughness:.87});
const ellipsoid=new T.SphereGeometry(1,16,12),woodColors=new Set(['#705942','#be9c6e','#aa8c63','#ad9263','#c3a978','#bda372','#aa8c62','#8a7350','#b39a6e','#8f7150','#745e46','#957854','#c9ae82']);
export function surface(c){const tex=woodColors.has(c)?grain:stone;return new T.MeshStandardMaterial({color:c,map:tex,bumpMap:tex,bumpScale:woodColors.has(c)?.0015:.005,roughness:.89})}
export function details({island,mesh,box,cyl,mat,height,rx,fallback}){
 const sprays=[],hues=[],blades=[],bladeHues=[],flowerHeads=[],flowerHues=[];const dummy=new T.Object3D();
 function ball(x,y,z,w,h,d,c,parent=island){let m=mesh(ellipsoid,c,parent);m.position.set(x,y,z);m.scale.set(w,h,d);return m}
 function beam(a,b,r,c,parent=island,tip=r){let A=new T.Vector3(...a),B=new T.Vector3(...b),vec=B.clone().sub(A),m=mesh(new T.CylinderGeometry(tip,r,vec.length(),8),c,parent);m.position.copy(A.addScaledVector(vec,.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vec.normalize());return m}
 function instance(list,colors,x,y,z,w,h,d,rx,ry,rz,color){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz,'YXZ');dummy.scale.set(w,h,d);dummy.updateMatrix();list.push(dummy.matrix.clone());colors.push(new T.Color(color))}
 function tree(x,z,s){let y=height(x,z);beam([x,y-.02,z],[x+.024*s,y+2.7*s,z],.11*s,'#745e46',island,.019*s);
 for(let level=0;level<8;level++)for(let j=0;j<6;j++){let a=j*circle/6+level*.47+between(-.14,.14),t=level/8,length=s*(.91-.74*t)*between(.78,1.17),by=y+s*(.61+2.04*t),ex=x+Math.sin(a)*length,ez=z+Math.cos(a)*length;beam([x,by,z],[ex,by-.09*s,ez],s*.028*(1-.55*t),'#7c7058',island,.007*s);
 if(fallback){ball((x+ex)*.5,by,(z+ez)*.5,length*.51,s*.16,length*.43,'#557358');continue}
 for(let k=0;k<5;k++){let u=k*.145,b=a+(k%2?1:-1)*between(.20,.72);instance(sprays,hues,x+Math.sin(a)*length*u,by-.07*s*u,z+Math.cos(a)*length*u,length*between(.49,.69),length,length*(1-.50*u),between(-.09,.32),b,between(-.41,.41),['#c0cdb8','#d2d5be','#b3c1a8'][k%3])}}
 }
 function mountain(x,z,r,h,color){const n=104,rings=54,p=[],cols=[],idx=[];let k=between(0,6);for(let j=0;j<=rings;j++){let t=j/rings;for(let i=0;i<=n;i++){let a=i*circle/n,spine=.11*Math.sin(5*a+k)+.079*Math.sin(9*a+.9*t)+.035*Math.cos(17*a-t*3);let radius=r*(1-t)**.79*(1+spine);let ht=t*h+r*.064*Math.sin(Math.PI*t)*Math.sin(11*a+t*27);let px=x+Math.cos(a)*radius+.45*t,pz=z+Math.sin(a)*radius*.80+.19*t;let cut=0;if(pz>=-9.16&&pz<=-4.6){let dx=px-channel(pz,rx);cut=(.49+.19*Math.sin(t*24))*Math.exp(-dx*dx/.23)*Math.min(1,(pz+9.16)*5);ht-=cut}p.push(px,.78+ht,pz);let limit=.58+.10*Math.sin(4*a+k)+.07*Math.sin(9*a+t*7)-.06*Math.cos(3*a);let co=new T.Color(cut>.19?'#687d78':t>limit?(t>limit+.08?'#eceee5':'#d4dad1'):color);co.multiplyScalar(.82+.12*Math.sin(a*11+t*12)+rand()*.12);cols.push(co.r,co.g,co.b);if(i&&j){let v=j*(n+1)+i;idx.push(v-n-2,v-1,v-n-1,v-1,v,v-n-1)}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(cols,3));g.setIndex(idx);g.computeVertexNormals();let m=mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.97,side:T.DoubleSide}));return m}
 function grasses(){const cabins=[[-7,1],[-10,-2],[-5.2,-3.1],[-11,5.5],[-5.8,6.2],[8,-3.8]];
 for(let i=0;i<1700;i++){let x=between(-18.5,18.5),z=between(-9,15.3),y=height(x,z);if(x*x/345+z*z/236>1||Math.abs(x-rx(z))<1.02||cabins.some(([cx,cz])=>Math.abs(x-cx)<1.72&&Math.abs(z-cz)<1.65))continue;
 for(let j=0;j<7;j++){let a=j*2.4,s=between(.12,.33);instance(blades,bladeHues,x+.035*Math.cos(a),y,z+.035*Math.sin(a),s*.15,s,s,between(.07,.61),a,0,['#72874e','#8e995b','#7d9154','#a49f64'][j%4])}
 if(i%8===0){let h=between(.17,.31);beam([x,y,z],[x+.024,y+h,z],.005,'#75845b');for(let j=0;j<7;j++){let a=j*circle/7;instance(flowerHeads,flowerHues,x+.024+.026*Math.sin(a),y+h,z+.026*Math.cos(a),.018,.009,.027,0,a,0,['#eee5c4','#c0a2b7','#d7c87d','#a39dbb'][i%7%4])}instance(flowerHeads,flowerHues,x+.024,y+h+.006,z,.017,.012,.017,0,0,0,'#c6a05b')}}
 }
 function batch(g,m,list,colors){if(!list.length)return;let o=new T.InstancedMesh(g,m,list.length);list.forEach((v,i)=>{o.setMatrixAt(i,v);o.setColorAt(i,colors[i])});o.castShadow=o.receiveShadow=true;island.add(o)}
 function plantings(){if(!fallback)grasses();let leaf=new T.BufferGeometry();leaf.setAttribute('position',new T.Float32BufferAttribute([-.4,0,0,.4,0,0,.32,.55,.09,-.32,.55,.09,0,1,.35],3));leaf.setIndex([0,1,2,0,2,3,3,2,4]);leaf.computeVertexNormals();const neutral=new T.MeshStandardMaterial({color:'#ffffff',side:T.DoubleSide,roughness:.86});batch(sprayGeo,sprayMat,sprays,hues);batch(leaf,neutral,blades,bladeHues);batch(ellipsoid,neutral,flowerHeads,flowerHues)}
 function cabinInterior(g,w,h,d){let wood='#957854',dark='#745e46',ivory='#d8cead';for(let j=0;j<9;j++)box(-w*.46+j*w*.115,.257,0,w*.113,.063,d*.91,wood,g);
 box(-w*.48,h/2+.23,0,.075,h,d,'#be9c6e',g);box(0,h/2+.23,-d*.48,w,h,.083,'#c9ae82',g);box(w*.48,h/2+.23,-d*.26,.075,h,d*.47,'#be9c6e',g);
 for(let j=0;j<6;j++)box(0,.36+j*h*.15,-d*.455,w*.96,.015,.022,dark,g);
 let x=-w*.27,z=-d*.23;box(x,.623,z,w*.36,.065,d*.23,wood,g);for(let a of [-1,1])for(let b of [-1,1])beam([x+a*w*.14,.28,z+b*d*.079],[x+a*w*.14,.61,z+b*d*.079],.022,dark,g);
 cyl(x,.704,z,.061,.105,'#dad9c5',g,16);box(x+.17,.682,z+.015,.19,.028,.14,'#667a70',g);let sx=x,sz=z+d*.248;box(sx,.477,sz,.33,.064,.32,wood,g);box(sx,.67,sz+.14,.33,.27,.043,dark,g);for(let a of [-.12,.12])for(let b of [-.11,.11])beam([sx+a,.27,sz+b],[sx+a,.47,sz+b],.018,dark,g);
 box(w*.23,.41,-d*.23,w*.35,.21,d*.37,'#745e46',g);box(w*.23,.555,-d*.23,w*.34,.10,d*.36,'#bac3a5',g);ball(w*.23,.642,-d*.35,w*.13,.047,.10,ivory,g);for(let k=0;k<6;k++)box(w*.11+k*w*.048,.609,-d*.18,.018,.006,d*.23,'#919f8e',g);
 box(-w*.18,h*.76,-d*.41,w*.43,.04,.18,dark,g);for(let j=0;j<7;j++)box(-w*.34+j*.075,h*.76+.109,-d*.41,.060,.18,.114,['#926754','#6b7d6a','#b9ae88'][j%3],g);
 for(let side of [-1,1]){box(side*w*.45,h+.17,0,.105,.12,d,wood,g);for(let j=0;j<4;j++)box(side*w*.48,.43+j*h*.18,d*.489,.14,.066,.063,wood,g)}
 }
 function animalForm(g,head,cow,phase){const coat=cow?'#e6e2ce':'#e6e3cd',face=cow?coat:'#827e6d';let body=ball(0,.48,0,cow?.446:.333,cow?.251:.213,cow?.21:.204,coat,g);
 if(cow){let c=document.createElement('canvas');c.width=256;c.height=128;let ctx=c.getContext('2d');ctx.fillStyle='#dddccc';ctx.fillRect(0,0,256,128);ctx.fillStyle='#514f46';for(let j=0;j<7;j++){let x=(j*41+phase*19)%256,y=(j*37+phase*29)%128;ctx.beginPath();for(let k=0;k<=24;k++){let a=k*circle/24,r=1+.24*Math.cos(3*a+j)+.12*Math.sin(5*a);ctx.lineTo(x+20*r*Math.cos(a),y+16*r*Math.sin(a))}ctx.fill()}let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;body.material=new T.MeshStandardMaterial({map:t,roughness:.94});}
 else{for(let j=0;j<20;j++){let a=j*2.4,v=1-2*(j+.5)/20,u=Math.sqrt(1-v*v);ball(.24*u*Math.cos(a),.49+.143*v,.134*u*Math.sin(a),.115,.105,.108,'#dedbc7',g)}}
 ball(.04,-.012,0,cow?.163:.127,.16,.123,face,head);ball(.157,-.105,0,.098,.071,.113,cow?'#b69b8c':'#737264',head);
 for(let s of [-1,1]){let ear=ball(-.015,.074,s*.151,.089,.038,.074,face,head);ear.rotation.x=s*.33;ball(.108,.025,s*.106,.023,.019,.008,'#32372f',head);ball(.23,-.092,s*.06,.013,.010,.010,'#65584e',head);if(cow)beam([-.044,.129,s*.071],[-.075,.202,s*.101],.032,'#bdb49d',head,.006)}
 beam([cow?-.385:-.27,.55,-.014],[cow?-.463:-.31,cow?.22:.36,-.024],cow?.018:.036,coat,g);if(cow)ball(-.459,.198,-.023,.026,.076,.032,'#636155',g);
 const legs=[];for(let xx of [-1,1])for(let zz of [-1,1]){let limb=new T.Group();limb.position.set(xx*(cow?.26:.196),.352,zz*(cow?.131:.119));g.add(limb);beam([0,0,0],[xx*-.023,-.177,0],cow?.052:.038,coat,limb,.029);beam([xx*-.023,-.177,0],[xx*.012,-.306,0],.031,face,limb,.021);ball(xx*.012+.011,-.324,0,.044,.028,.031,'#534f42',limb);legs.push(limb)}return legs
 }
 return {tree,mountain,plantings,cabinInterior,animalForm,ball}
}
