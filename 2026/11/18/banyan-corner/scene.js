import * as T from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {joinery} from './joinery.js';
import {balcony} from './balcony.js';
import {climbers} from './wall-vines.js';
import {bicycle} from './bicycle.js';
import {banyan} from './banyan.js';
import {streetCastings} from './street-castings.js';
import {shoal} from './koi.js';
import {furnish} from './interiors.js';
import {planting} from './planting.js';
import {wallArt,drawing} from './patina.js';
import {salvage} from './salvage.js';
import {standard} from './surfaces.js';
const canvas=document.querySelector('canvas'), renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(2,devicePixelRatio));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene(),camera=new T.OrthographicCamera(),controls=new OrbitControls(camera,canvas);
controls.target.set(0,3.85,0);camera.position.set(9.6,10.1,23);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;controls.minZoom=.55;controls.maxZoom=14;controls.zoomToCursor=true;
const V=(x,y,z)=>new T.Vector3(x,y,z), G=new T.Group();scene.add(G);
let seed=472;function R(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}const rr=(a,b)=>a+(b-a)*R(),pick=a=>a[Math.floor(R()*a.length)];
const matCache=new Map(),batches=new Map(),shape={box:new T.BoxGeometry(1,1,1),rock:new T.IcosahedronGeometry(1,0),crown:new T.IcosahedronGeometry(1,1),tube:new T.CylinderGeometry(1,1,1,8),leaf:new T.OctahedronGeometry(1)};
const softBox=new T.BoxGeometry(1,1,1,4,4,4),bp=softBox.attributes.position,bn=softBox.attributes.normal;
for(let i=0;i<bp.count;i++){let a=new T.Vector3().fromBufferAttribute(bp,i);for(let ax of ['x','y','z'])if(Math.abs(a[ax])===.25)a[ax]=Math.sign(a[ax])*.43;const core=a.clone().clampScalar(-.43,.43),n=a.clone().sub(core).normalize(),v=core.addScaledVector(n,.07);bp.setXYZ(i,v.x,v.y,v.z);bn.setXYZ(i,n.x,n.y,n.z)}
const softened=new Set(['#6c9990','#80a99b','#8bad99','#d8c489','#75988e','#dfcd94','#a4b8af','#a94939']);
const woodColors=new Set(['#96683c','#795539','#714833','#96683c','#756745','#625c40','#92825b','#524e37']);
const stoneColors=new Set(['#d7d0ad','#c1bfa2','#ede2bc','#aea98e','#c7c3a5','#b0ae94','#b7b69f','#786b51','#c8c5a7','#b7b79b','#b5b298']);
function mat(c){if(typeof c==='object')return c;if(!matCache.has(c)){let kind=c==='#68716b'?'asphalt':woodColors.has(c)?'grain':stoneColors.has(c)?'mineral':null;matCache.set(c,kind?standard(c,kind):new T.MeshStandardMaterial({color:c,roughness:.84,metalness:c==='#4c5750'?.34:0}))}return matCache.get(c)}
function add(geo,c,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const m=mat(c),k=geo.uuid+m.uuid,o=new T.Object3D();o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);if(!batches.has(k))batches.set(k,{geo,m,objs:[]});batches.get(k).objs.push(o);return o}
const box=(x,y,z,w,h,d,c,ry=0,rz=0)=>add(softened.has(c)?softBox:shape.box,c,x,y,z,w,h,d,0,ry,rz),rock=(x,y,z,w,h,d,c)=>add(shape.rock,c,x,y,z,w,h,d,rr(-.2,.2),R()*6),leaf=(x,y,z,w,h,d,c)=>add(shape.leaf,c,x,y,z,w,h,d,rr(-.6,.6),R()*6,rr(-.6,.6));
function rod(a,b,r,c,r2=r){let A=V(...a),B=V(...b),p=A.clone().lerp(B,.5),v=B.sub(A),geo=r===r2?shape.tube:new T.CylinderGeometry(r2/r,1,1,9);let o=add(geo,c,p.x,p.y,p.z,r,v.length(),r);o.quaternion.setFromUnitVectors(V(0,1,0),v.normalize());return o}
function path(pts,r,c){for(let i=1;i<pts.length;i++)rod(pts[i-1],pts[i],r,c)}
const cement=['#d7d0ad','#c1bfa2','#ede2bc'],greens=['#436c36','#739646','#a2b950','#618c40','#b9ca56'],bark=['#625c40','#756745','#92825b','#524e37'],wood='#96683c',iron='#4c5750',rust='#a25d40',dark='#344b42',cream='#e9dfba';
function label(x,y,z,w,h,words,bg,fg,rot=0){let cv=document.createElement('canvas');cv.width=768;cv.height=Math.max(90,Math.round(768*h/w));let ctx=cv.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+Math.min(cv.height*.68,cv.width/(words.length+.4))+'px serif';ctx.fillText(words,cv.width/2,cv.height/2);for(let i=0;i<400;i++){ctx.fillStyle='rgba(236,218,178,.25)';ctx.fillRect(R()*cv.width,R()*cv.height,rr(1,9),rr(1,3))}let tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;let mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map:tx}));mesh.position.set(x,y,z);mesh.rotation.y=rot;G.add(mesh)}
function ring(x,y,z,r,t,c,rx=0,ry=0){return add(new T.TorusGeometry(r,t,6,30),c,x,y,z,1,1,1,rx,ry)}
const {leaf:vineLeaf,balconyVines}=climbers({add,rod,rr,R,pick,shape});
const {tuft,flowers,ivy}=planting({R,rr,pick,add,rod,shape,vineLeaf});
const {picture,clock}=wallArt({G,rod,box,ring,add,shape,wood,rr});
const {condenser,wires,car,debris}=salvage({G,add,shape,box,rod,ring,path,label,rr,pick,flowers,tuft});
// Exposed earth, aggregate, broken asphalt and twisting roots on four faces.
function bedLayer(size,y,thick,c){let h=size/2,s=new T.Shape();s.moveTo(-h,-h);s.lineTo(h,-h);s.lineTo(h,h);s.lineTo(-h,h);s.closePath();let hole=new T.Path();hole.absellipse(.58,-4.38,2.40,1.04,0,Math.PI*2,true);s.holes.push(hole);let shaft=new T.Path();shaft.absarc(-.94,-3.13,.328,0,Math.PI*2,true);s.holes.push(shaft);let g=new T.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);let m=new T.Mesh(g,mat(c));m.position.y=y;m.castShadow=m.receiveShadow=true;G.add(m)}
box(0,-.725,0,11.6,.54,11.6,'#786b51');bedLayer(11.60,-.461,.32,'#786b51');bedLayer(11.64,-.165,.19,'#68716b');
for(let side=0;side<4;side++){const sidePt=(u,y,v)=>side===0?[u,y,v]:side===1?[v,y,-u]:side===2?[-u,y,-v]:[-v,y,u];for(let j=0;j<245;j++){let a=sidePt(rr(-5.73,5.73),rr(-.91,-.13),5.8);rock(...a,rr(.05,.19),rr(.025,.14),rr(.055,.14),pick(['#a69b81','#c7bb9d','#8f8c75','#675e49']))}for(let j=0;j<15;j++){let u=rr(-5.6,5.6),v=5.81,p=sidePt(u,.04,v);for(let k=0;k<6;k++){u+=rr(-.15,.15);let q=sidePt(u,-k*.16,v+.018*k);rod(p,q,.047-k*.005,pick(bark));p=q}if(j%4===0){let a=sidePt(u,-.38,5.84),b=sidePt(u+.2,-.59,6.06);rod(a,b,.023,rust)}}}
box(-.85,.085,-1.05,8.4,.19,7.4,'#b7b69f');
for(let j=0;j<24;j++){if(Math.abs((-5+j*.355)-.38)>.96)box(-5+j*.355,.155,2.7,.335,.24,.23,pick(cement));if(j<20)box(3.39,.155,2.43-j*.36,.22,.24,.34,pick(cement))}
for(let i=0;i<7;i++)box(4.6,.035,1.8+i*.43,1.55,.015,.18,'#dad8bb');
for(let j=0;j<6;j++)box(4.65,.034,-5+j*1.12,.07,.013,.56,'#c3bf9c');
for(let j=0;j<30;j++){let x=rr(-5.5,5.5),z=rr(3,5.5);if(((x-.55)/3.3)**2+((z-4.38)/1.65)**2<1)continue;path([[x,.037,z],[x+.18,.038,z-.13],[x+.34,.038,z-.11],[x+.63,.038,z-.34]],.012,'#414d42')}
// Three floors with distinct rooms and broken window bays.
const floorYs=[.27,2.63,4.99],back=-3.62,front=.9;
for(let f=0;f<3;f++){let y=floorYs[f];// The collapsed west-front bay leaves an open shaft for the entire trunk.
for(let [x,z,w,d] of [[-.7,-2.73,5.95,1.88],[.31,-.445,3.93,2.69]]){box(x,y,z,w,.18,d,'#aea98e');box(x,y+.105,z,w-.015,.04,d-.015,pick(cement))}
box(-.7,y+1.18,back,5.96,2.25,.18,pick(cement));box(-3.62,y+1.12,-2.70,.18,2.08,1.93,pick(cement));
for(let x of [-.70,2.14]){box(x,y+1.16,front,.18,2.16,.2,'#c7c3a5');box(x,y+2.19,-1.37,.23,.16,4.59,'#b0ae94')}
for(let j=0;j<11;j++){let x=-1.49+j*.355;box(x,y-.045,1.01,.39,.065,.03,pick(cement));if(j%3===1)rod([x,y,.99],[x+.09,y-.11,1.18],.014,rust)}
for(let j=0;j<8;j++){let z=back+.32+j*.55;box(2.21,y+.29,z,.19,rr(.32,.64),.55,pick(cement))}
for(let z of [-3.53,-1.48,.83])box(2.21,y+1.2,z,.12,2.18,.12,iron);box(2.21,y+2.23,-1.35,.12,.1,4.5,iron);
for(let [j,x] of [-2.75,-1.29,.15,1.44].entries()){if(f===2&&j===3)continue;picture(x,y+1.38,back+.127,f*4+j)}
for(let j=0;j<8;j++){let x=-1.42+j*.49;box(x,y+2.2,.9,.48,.15,.18,pick(cement))}
}
// Partial roof with a central opening.
box(1.74,7.30,-1.35,1.08,.21,4.60,'#c8c5a7');box(-1.19,7.30,-3.37,4.80,.21,.56,'#b5b298');
for(let j=0;j<35;j++){let x=rr(1.27,2.18),z=rr(-3.48,.78);rock(x,7.43,z,.13,.025,.15,pick(greens));if(R()<.3)tuft(x,7.43,z,.52)}
const {chair,sofa,freezer,deskExtras}=joinery({G,add,box,rod,ring,shape,standard});
const {shelf,desk,piano}=furnish({box,rod,add,shape,ring,label,range:rr,pick,wood:standard('#987650','grain'),iron,material:standard,T});
shelf(-2.5,.41,-2.9);shelf(-.74,.41,-2.9);
for(let a=0;a<12;a++)for(let b=0;b<8;b++)if(-3.32+a*.46> -1.47||-3.25+b*.51< -2.04)box(-3.32+a*.46,.409,-3.25+b*.51,.45,.014,.5,(a+b)%2?'#abbcaa':'#e1ddba');
freezer(1,.418,-1.72);label(.79,.76,-1.323,.79,.25,'アイス','#ded7b5','#ba6142');
desk(-.12,2.77,-.97);deskExtras(-.12,2.77,-.97);chair(-.98,2.77,-1.35);chair(.87,2.77,-1.55);shelf(-2.6,2.77,-2.93);
for(let j=0;j<10;j++)box(rr(-1.42,1.7),2.78,rr(-.8,.65),.2,.011,.28,cream,R()*5);
rod([.2,4.9,-.6],[.3,4.38,-.55],.014,iron);add(new T.ConeGeometry(.29,.21,16),'#b08751',.3,4.31,-.55,1,1,1);
sofa(-.60,5.122,-2.88);
piano(.77,5.145,-1.54);
clock(1.43,6.57,-3.45);
label(-3.718,4.57,-2.68,1.46,.36,'サクラ電器','#d6c9a2','#9d6554',-Math.PI/2);label(-.64,2.34,1.019,1.69,.33,'桜 町 商 店','#ede3bc','#557d71');
balcony({box,add,rod,path,shape,rr,pick,standard,ring});
banyan(G,R);
balconyVines();
for(let f=0;f<3;f++){for(let j=0;j<9;j++)ivy(-1.57+rr(0,.57),floorYs[f]+2.25,1.055,Math.floor(rr(5,16)),.13,j%2===0);for(let j=0;j<7;j++)ivy(2.34,floorYs[f]+2.25,rr(-3.48,.65),Math.floor(rr(4,12)),.045)}
// Pedestrian walkway stub and weathered guardrails.
box(3.18,3.58,-3.57,3.65,.27,1.12,'#b8b79b');box(4.61,1.78,-3.57,.31,3.5,.45,'#a9ad96');
for(let z of [-4.11,-3.02]){for(let i=0;i<14;i++)box(1.48+i*.26,3.99,z,.035,.69,.034,rust);box(3.19,4.35,z,3.58,.054,.056,rust);box(3.19,3.99,z,3.57,.036,.035,iron)}
for(let j=0;j<12;j++)ivy(rr(2,4.91),3.72,-2.98,Math.floor(rr(3,11)),.12);
// Kiosk, striped awning and rows of miniature magazines.
box(2.34,.94,1.21,1.45,1.48,1.18,'#739889');box(2.34,1.31,1.817,1.22,.59,.035,'#364d44');box(2.34,.98,1.91,1.51,.095,.33,wood);box(2.34,1.82,1.21,1.68,.14,1.4,'#5d7d6c');
for(let i=0;i<10;i++)add(shape.box,i%2?'#dfbd8f':'#bc6958',1.65+i*.152,1.7,1.99,.152,.065,.51,.18);
label(2.34,2.03,1.92,1.57,.37,'新聞・雑誌','#dfd7ae','#405f52');
for(let j=0;j<12;j++)box(1.77+(j%6)*.21,.51+Math.floor(j/6)*.23,1.83,.174,.21,.04,pick(['#d4bb87','#a36950','#a7b3a4','#d2d1ab']));for(let j=0;j<7;j++)ivy(1.65+rr(0,1.36),1.91,1.91,Math.floor(rr(3,7)),.1);
// The upper landing shares the interior tile elevation and meets its slab at z=.90.
box(.38,.290,1.48,1.57,.248,1.174,'#b4b2a0');
for(let [z,top] of [[2.19,.337],[2.45,.267],[2.71,.197],[2.97,.108]]){box(.38,(top+.028)/2,z,1.57,top-.028,.266,'#b8b6a1');box(.38,top-.019,z+.124,1.55,.027,.031,'#d0cdb5')}
// Detached service pad on the side street; all fittings share the same transform.
function vendingMachine(){const baseX=-4.50,baseZ=-2.97;
const point=(x,y,z)=>[baseX-(z-1.73),y,baseZ+(x+3.67)];
const B=(x,y,z,w,h,d,c)=>box(...point(x,y,z),d,h,w,c);
const A=(g,c,x,y,z,...rest)=>add(g,c,...point(x,y,z),...rest);
const L=(x,y,z,w,h,word,bg,fg)=>label(...point(x,y,z),w,h,word,bg,fg,-Math.PI/2);
const P=(pts,r,c)=>path(pts.map(p=>point(...p)),r,c);

B(-3.67,1.08,1.73,.94,1.75,.65,'#a94939');B(-3.67,1.3,2.064,.77,.92,.025,'#c4cec0');B(-3.79,1.34,2.083,.5,.72,.03,'#506e66');
for(let j=0;j<12;j++){let x=-3.98+j%4*.125,y=1.09+Math.floor(j/4)*.225;A(shape.tube,pick(['#e8c98e','#dfa15d','#98b9af','#d1d6b4']),x,y,2.113,.036,.13,.037);B(x,y-.074,2.12,.11,.021,.065,cream)}
L(-3.67,1.91,2.064,.88,.23,'ソーダ','#b44d3b','#fff0c8');B(-3.66,.63,2.074,.6,.16,.05,'#344b46');P([[-3.91,1.64,2.15],[-3.76,1.43,2.15],[-3.83,1.31,2.15],[-3.59,1.16,2.15]],.009,cream);
}
vendingMachine();
// Traffic light, streetlamp and overhead wires.
path([[-4.91,.1,2.9],[-4.83,3.07,2.9],[-4.55,4.38,2.88],[-4.28,4.54,2.88],[-3.91,4.52,2.88]],.063,iron);
rock(-3.89,4.45,2.88,.24,.11,.16,'#637d72');rock(-3.89,4.39,2.88,.21,.04,.14,'#f7e6a0');rod([-4.81,3.26,2.9],[-3.68,3.26,2.9],.045,rust);
box(-3.57,3.11,2.91,1,.39,.27,'#657b70',0,-.08);for(let i=0;i<3;i++){let x=-3.91+i*.33;add(shape.tube,iron,x,3.14-i*.023,3.064,.142,.07,.142,Math.PI/2);add(shape.tube,['#538c82','#beaa68','#af675e'][i],x,3.14-i*.023,3.108,.103,.018,.103,Math.PI/2);box(x,3.26-i*.023,3.13,.24,.034,.19,iron)}
wires();
const stopX=-5.12,stopZ=2.26;
rod([stopX,.04,stopZ],[stopX,2.29,stopZ],.041,rust);add(shape.tube,'#a75b48',stopX,2.28,stopZ,.31,.09,.31,Math.PI/2);label(stopX,2.28,stopZ+.051,.50,.18,'桜町','#a95c48','#f8e9c8');
box(stopX,1.59,stopZ,.41,.67,.075,'#898d7d');
const timeMap=drawing(256,384,(c,w,h)=>{c.fillStyle='#d8d3b8';c.fillRect(0,0,w,h);c.fillStyle='#53675f';c.fillRect(9,9,238,41);c.fillStyle='#e7dfc4';c.font='21px serif';c.fillText('桜町　時刻表',28,38);c.font='14px monospace';for(let i=0;i<13;i++){let y=75+i*22;c.fillStyle='#746e5c';c.fillText(String(i+6).padStart(2,'0')+'   08    26    48',16,y);c.fillRect(10,y+5,236,1)}});
const timetable=new T.Mesh(new T.PlaneGeometry(.36,.58),new T.MeshStandardMaterial({map:timeMap,roughness:.87}));timetable.position.set(stopX,1.59,stopZ+.041);G.add(timetable);
// Bicycle, tyre stack and fallen barricade.
bicycle({G,add,box,rod,shape});
box(-3.92,.27,3.85,1.21,.31,.12,'#d6bf8a',-.25,-.16);for(let j=0;j<4;j++)box(-4.36+j*.25,.32-j*.032,3.93+j*.055,.12,.27,.033,rust,-.25,-.56);
rod([-5.1,.17,4.04],[-4.08,.24,4.57],.11,iron);add(shape.tube,'#c4a784',-4.29,.36,4.48,.29,.85,.29,0,0,1.4);
// Printed, sun-bleached paper and rim bands on the overturned advertising drum.
const poster=drawing(768,320,(c,w,h)=>{c.fillStyle='#c5b48c';c.fillRect(0,0,w,h);for(let j=0;j<3;j++){let x=j*256;c.save();c.translate(x,0);c.fillStyle=['#a59078','#a7a18a','#bda784'][j];c.fillRect(4,8,246,303);c.fillStyle='#5a6a62';c.font='bold 39px serif';c.fillText(['映画祭','夏の市','音楽会'][j],45,83);c.beginPath();c.arc(119,172,53,0,7);c.fillStyle='#aa7667';c.fill();for(let i=0;i<6;i++){c.fillStyle='#68776a';c.beginPath();c.moveTo(24+i*27,247);c.lineTo(72+i*19,146+i*9);c.lineTo(145+i*12,247);c.fill()}c.fillRect(23,268,203,3);c.fillRect(53,279,141,2);c.restore()}for(let i=0;i<2700;i++){c.fillStyle='rgba(221,210,176,.44)';c.fillRect(rr(0,w),rr(0,h),rr(1,7),rr(1,3))}});
const paperWrap=new T.Mesh(new T.CylinderGeometry(.293,.293,.78,40,1,true),new T.MeshStandardMaterial({map:poster,roughness:.97}));paperWrap.position.set(-4.29,.36,4.48);paperWrap.rotation.z=1.4;G.add(paperWrap);
// Sunken compact car with windows, fenders, bumpers and a roof garden.
car(4.62,-1.06);debris();
// Translucent blue-green pool, cobbles, stream and shoal, cut into the asphalt.
const poolX=.58,poolZ=4.38;function water(x,y,z,w,d,col){let geo=new T.CircleGeometry(1,56);let m=new T.Mesh(geo,new T.MeshPhongMaterial({color:col,shininess:95,specular:0xc6efcd,transparent:true,opacity:z===poolZ?.22:.7,depthWrite:false}));m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);m.position.set(x,y,z);G.add(m)}
const pebble=new T.IcosahedronGeometry(1,1);const pebblePos=pebble.attributes.position;
for(let i=0;i<pebblePos.count;i++){let p=new T.Vector3().fromBufferAttribute(pebblePos,i),r=1+.09*Math.sin(p.x*4+2*p.z)*Math.cos(p.y*5);pebblePos.setXYZ(i,p.x*r,p.y*r,p.z*r)}
function stone(x,y,z,w,h,d,c){return add(pebble,c,x,y,z,w,h,d,rr(-.18,.18),R()*6)}
const bottom=add(shape.tube,'#76928a',poolX,-.399,poolZ,2.42,.065,1.06);
for(let k=0;k<340;k++){let a=R()*Math.PI*2,r=Math.sqrt(R())*.98;stone(poolX+2.38*r*Math.cos(a),-.335+rr(-.012,.021),poolZ+1.02*r*Math.sin(a),rr(.032,.092),rr(.02,.051),rr(.03,.081),pick(['#78867a','#919386','#a0aa96','#6a817b','#929a81']))}
water(poolX,.048,poolZ,2.43,1.06,'#76afa4');
for(let i=0;i<80;i++){let a=i/80*Math.PI*2,r=rr(.95,1.03),x=poolX+Math.cos(a)*2.43*r,z=poolZ+Math.sin(a)*1.06*r;if(Math.abs(x+.94)<.24&&z<3.86)continue;stone(x,.086,z,rr(.09,.26),rr(.06,.16),rr(.09,.22),pick(['#a7a790','#858f7e','#c4bfa1','#9eac88']));if(R()<.32)tuft(x,.12,z,.86)}
const waves=[];for(let i=0;i<9;i++){let a=R()*6,r=R()*.73,x=poolX+Math.cos(a)*r*2.3,z=poolZ+Math.sin(a)*r;let o=new T.Mesh(new T.TorusGeometry(rr(.12,.29),.003,4,32,3.3),new T.MeshBasicMaterial({color:'#d5ecd1',transparent:true,opacity:.7}));o.rotation.x=Math.PI/2;o.position.set(x,.082,z);G.add(o);waves.push(o)}
const swim=shoal(G);
streetCastings(G);
for(let j=0;j<165;j++){let x=rr(-5.5,5.5),z=rr(-5.5,5.5);if((x< -3.8||z< -4.15||Math.abs(x-3.36)<.18||z>2.55&&z<2.88)&&Math.abs(z-4.4)>.9){let y=x<3.35&&z<2.64&&x>-5.05&&z>-4.77?.19:.045;R()<.27?flowers(x,y,z):tuft(x,y,z,rr(.65,1.3))}}
for(let j=0;j<14;j++){let x=rr(-5.65,5.65);ivy(x,.015,5.82,Math.floor(rr(3,7)),.13)}
// Weathered plaster, hairline fractures, surviving glass and external plumbing.
for(const y of floorYs){
 for(let j=0;j<74;j++){let x=rr(-3.49,2.1),h=rr(.15,2.13);rock(x,y+h,-3.508,rr(.025,.16),rr(.013,.067),.012,pick(['#b8b598','#c7c2a3','#d8cfae']));rock(x,y+h,-3.727,rr(.03,.17),rr(.012,.06),.015,pick(cement))}
 for(let x of [-2.65,-.76,.91]){box(x,y+1.34,-3.74,1.18,.94,.06,'#7a8272');box(x,y+1.34,-3.785,1.05,.82,.035,'#809a8c');box(x,y+1.34,-3.812,.047,.84,.025,cream);box(x,y+.83,-3.79,1.34,.09,.19,pick(cement))}
 for(let z of [-2.94]){box(-3.74,y+1.41,z,.06,.92,1.1,'#70796d');box(-3.78,y+1.41,z,.035,.8,.98,'#86a397');box(-3.81,y+1.41,z,.03,.81,.05,cream)}
 for(let j=0;j<5;j++){let x=rr(-3.2,1.9),h=rr(1.35,2.17);path([[x,y+h,-3.51],[x+.09,y+h-.19,-3.51],[x+.035,y+h-.38,-3.51],[x+.21,y+h-.54,-3.51]],.009,'#929781')}
 for(let j=0;j<5;j++){let z=-3.52+j*.84;let glass=new T.BufferGeometry(),h=y+2.19;glass.setAttribute('position',new T.Float32BufferAttribute([2.2,h,z,2.2,h,z+.78,2.2,h-rr(.2,.81),z+.18],3));let shard=new T.Mesh(glass,new T.MeshBasicMaterial({color:0xb4e0d2,transparent:true,opacity:.25,side:T.DoubleSide,depthWrite:false}));G.add(shard)}
}
for(let x of [-3.32,1.79]){path([[x,.26,-3.9],[x,2.27,-3.9],[x+.11,2.42,-3.9],[x+.11,7.34,-3.9]],.047,'#927963');for(let i=0;i<6;i++)box(x+.06,1+i,-3.85,.18,.05,.15,iron)}
for(let y of [1.12,3.48,5.84])condenser(y);
for(let j=0;j<13;j++){let x=rr(-5.4,-2.8);path([[x,.034,4.92],[x+.13,.034,4.74],[x+.22,.034,4.78]],.012,'#545e51')}
for(let j=0;j<4;j++){let geometry=new T.PlaneGeometry(rr(.24,.49),3.86),o=new T.Mesh(geometry,new T.ShaderMaterial({side:T.DoubleSide,transparent:true,depthWrite:false,uniforms:{},vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 u;void main(){float a=pow(sin(u.x*3.14159),2.)*sin(u.y*3.14159)*.095;gl_FragColor=vec4(1.,.89,.57,a);}'}));o.rotation.z=-.31;o.position.set(-1.42+j*.49,6.1,-.78+j*.25);G.add(o)}

// Instancing retains detailed geometry with few draw calls.
for(let {geo,m,objs} of batches.values()){const mesh=new T.InstancedMesh(geo,m,objs.length);objs.forEach((o,i)=>{o.updateMatrix();mesh.setMatrixAt(i,o.matrix)});mesh.castShadow=true;mesh.receiveShadow=true;G.add(mesh)}
scene.add(new T.HemisphereLight(0xf0f4ef,0xa3a08e,1.65));let sun=new T.DirectionalLight(0xffeacc,2.47);sun.position.set(-5,14,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-11,right:11,top:12,bottom:-11,near:.1,far:40});sun.shadow.normalBias=.012;sun.shadow.bias=-.0003;scene.add(sun);
let floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.02;floor.receiveShadow=true;scene.add(floor);
const motes=[];for(let j=0;j<60;j++)motes.push(rr(-3,2),rr(.7,7.2),rr(-2,1.2));let dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.Float32BufferAttribute(motes,3));let dust=new T.Points(dustGeo,new T.PointsMaterial({size:.034,color:0xffedb3,transparent:true,opacity:.73}));scene.add(dust);
function resize(){let w=innerWidth,h=innerHeight,a=w/h,hh=Math.max(7.55,8.95/a);camera.left=-hh*a;camera.right=hh*a;camera.top=hh;camera.bottom=-hh;camera.near=.1;camera.far=140;camera.updateProjectionMatrix();renderer.setSize(w,h)}resize();addEventListener('resize',resize);
function frame(ms){let t=ms*.001;controls.update();dust.position.y=Math.sin(t*.22)*.13;waves.forEach((m,i)=>{let f=(t*.21+i*.23)%1;m.scale.setScalar(.65+f*.62);m.material.opacity=.26*Math.sin(f*Math.PI)});swim(t);renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);
