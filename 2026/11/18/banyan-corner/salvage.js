import * as T from './vendor/three.module.js';
import {cabin,roofSoil} from './car-interior.js';
import {weather} from './patina.js';
export function salvage({G,add,shape,box,rod,ring,path,label,rr,pick,flowers,tuft}){
 const tin=weather('#9c9f92',70),shell=weather('#c2bb99',108),steel=weather('#7b8079',66),paint=weather('#acb7a4',148),rubber='#383a35',rust='#896047',disc=new T.CylinderGeometry(1,1,1,32),ball=new T.SphereGeometry(1,16,10);
 function condenser(y){let x=-3.98,z=-1.99;box(x,y,z,.44,.54,.88,tin);box(x-.227,y,z,.018,.48,.81,'#646b61');let fz=z+.115;add(disc,'#39443e',x-.242,y,fz,.208,.026,.208,0,0,Math.PI/2);
 for(let i=0;i<5;i++){let a=i*1.256;let o=add(ball,'#70766b',x-.262,y+.078*Math.sin(a),fz+.078*Math.cos(a),.014,.047,.105);o.rotation.x=-a+.48}
 for(let r of [.065,.105,.143,.179,.214])ring(x-.283,y,fz,r,.0045,'#a4a99b',0,Math.PI/2);
 for(let i=0;i<8;i++){let a=i*Math.PI/4;rod([x-.289,y,fz],[x-.289,y+.214*Math.sin(a),fz+.214*Math.cos(a)],.004,'#9da395')}
 for(let j=0;j<12;j++)box(x-.248,y-.186+j*.034,z-.28,.029,.014,.17,'#adad9c');for(let v of [-.355,.355]){box(x,y-.298,z+v,.52,.04,.048,steel);rod([x-.16,y-.32,z+v],[-3.725,y-.51,z+v],.022,rust)}
 for(let i=0;i<2;i++)path([[x,y-.05,z+.45],[x,y-.08,z+.54+i*.05],[x+.03,y-.34,z+.59+i*.05],[-3.72,y-.42,z+.59+i*.05]],.016+i*.006,i?'#a69f84':'#96735a');
 box(x-.246,y+.16,z-.28,.015,.043,.133,'#e6dbbf')}
 function wires(){const x=-5.48;for(let z of [-4.96,4.95]){rod([x,.025,z],[x,4.76,z],.09,tin,.058);box(x,4.4,z,.78,.075,.08,steel);for(let s of [-.29,.29]){rod([x+s,4.42,z],[x+s,4.67,z],.018,rust);for(let i=0;i<3;i++)add(disc,'#bbb9a0',x+s,4.49+i*.05,z,.053,.026,.053)}box(x+.105,2.36,z,.17,.34,.22,tin);path([[x+.162,2.2,z],[x+.12,2.04,z],[x+.08,.14,z]],.014,'#586258')}
 for(let s of [-.29,.29]){let pts=[];for(let k=0;k<=25;k++){let t=k/25;pts.push([x+s,4.65-.68*4*t*(1-t),-4.96+9.91*t])}path(pts,.01,'#484a43')}}
 function car(cx,cz){const Y=.015;let basis=(x,y,z)=>[cx+x,y+Y,cz+z];function part(g,m,x,y,z,w,h,d,rx=0,ry=0,rz=0){return add(g,m,...basis(x,y,z),w,h,d,rx,ry,rz)}function bar(a,b,r,m){rod(basis(...a),basis(...b),r,m)}
 function panel(points,m,uv){let pos=points.map(p=>basis(...p));let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos.flat(),3));g.setAttribute('uv',new T.Float32BufferAttribute(uv||[0,0,1,0,1,1,0,1],2));let ix=[];for(let i=1;i<pos.length-1;i++)ix.push(0,i,i+1);g.setIndex(ix);g.computeVertexNormals();let mesh=new T.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;G.add(mesh)}
 paint.side=T.DoubleSide;const glass=new T.MeshStandardMaterial({color:0x859a8d,transparent:true,opacity:.16,roughness:.37,side:T.DoubleSide,depthWrite:false});
 // Body sections taper at nose and tail. The lower right sill is dented inward.
 const sections=[[-1.24,.49,.48],[-1.13,.62,.55],[-.92,.68,.60],[-.6,.69,.62],[-.32,.68,.62],[.16,.68,.61],[.56,.69,.60],[.84,.67,.55],[1.14,.61,.49],[1.22,.5,.44]];
 function section([z,w,h]){return [[-w*.87,.20,z],[-w,.32,z],[-w,h-.065,z],[-w*.86,h,z],[w*.86,h+.008,z],[w,h-.065,z],[w*(z>.1&&z<.6?.92:1),.32,z],[w*.87,.20,z]]}
 for(let i=1;i<sections.length;i++){let a=section(sections[i-1]),b=section(sections[i]);for(let j=0;j<7;j++)if(j!==3||sections[i][0]<=-.92||sections[i-1][0]>=.56)panel([a[j],b[j],b[j+1],a[j+1]],paint,[(i-1)/9,j/7,i/9,j/7,i/9,(j+1)/7,(i-1)/9,(j+1)/7])}
 for(let s of [sections[0],sections.at(-1)])panel(section(s),paint,Array.from({length:8},(_,i)=>[i/7,i%2]).flat());
 for(let side of [-1,1]){let x=side*.58;
  let a=[x,.605,-.94],b=[side*.47,.98,-.61],c=[side*.46,1.005,.026],d=[x,.604,.56];bar(a,b,.028,paint);bar(b,c,.028,paint);bar(c,d,.029,paint);bar(a,d,.025,steel);bar([x,.606,-.38],[side*.47,.991,-.36],.031,paint);
  panel([a,b,[side*.47,.99,-.38],[x,.607,-.40]],glass);if(side<0)panel([[x,.607,-.35],[side*.47,.99,-.33],c,d],glass);else panel([[x,.609,-.33],[side*.56,.687,-.31],[side*.54,.717,-.21],[x,.609,-.15]],glass);
  bar([side*.68,.43,-.34],[side*.68,.60,-.36],.007,'#4d5249');bar([side*.68,.57,-.29],[side*.68,.57,-.16],.012,steel);
  for(let wz of [-.78,.76]){part(disc,rubber,side*.655,.274,wz,.255,.139,.266,0,0,Math.PI/2);part(disc,steel,side*.728,.273,wz,.157,.021,.157,0,0,Math.PI/2);for(let n=0;n<6;n++){let an=n*1.047;part(disc,'#4c4a40',side*.742,.273+.103*Math.cos(an),wz+.103*Math.sin(an),.023,.004,.023,0,0,Math.PI/2)}part(disc,rust,side*.748,.273,wz,.044,.012,.044,0,0,Math.PI/2)}}
 panel([[-.47,.98,-.61],[.47,.98,-.61],[.46,1.005,.026],[-.46,1.005,.026]],paint);
 panel([[-.58,.603,.56],[-.46,1.005,.026],[.46,1.005,.026],[.58,.603,.56]],glass);panel([[-.58,.605,-.94],[-.47,.98,-.61],[.47,.98,-.61],[.58,.605,-.94]],glass);
 // A split windshield, rubber seam and bent wipers follow the sloping glazing.
 function windshield(x,y){return [x,y,.56-(y-.603)*(.534/.402)+.007]}
 for(let pair of [[[.31,.76],[.17,.80]],[[.17,.80],[.10,.856]],[[.17,.80],[.19,.89]],[[.19,.89],[.25,.954]],[[.31,.76],[.36,.695]],[[.31,.76],[.424,.81]]])bar(windshield(...pair[0]),windshield(...pair[1]),.0035,'#c7c8b6');
 bar([-.58,.606,.562],[.58,.606,.562],.015,rubber);
 for(let side of [-1,1]){for(let wz of [-.78,.76]){let pts=[];for(let j=0;j<=14;j++){let a=j*Math.PI/14;pts.push([side*.71,.273+.278*Math.sin(a),wz+.288*Math.cos(a)])}for(let j=1;j<pts.length;j++)bar(pts[j-1],pts[j],.014,steel)}}
cabin({G,part,bar,basis,shape,ball});for(let side of [-1,1])bar([side*.45,.615,.54],[side*.16,.68,.45],.009,'#494c44');
 for(let z of [.67,.89,1.07]){let w=z>1?.50:.57;bar([-w,.566-(z-.67)*.23,z],[-w+.018,.565-(z-.67)*.23,z+.11],.006,'#625f4f')}
 part(shape.box,steel,0,.255,1.21,1.19,.077,.098,0,0,-.045);part(shape.box,'#484d44',0,.375,1.226,.63,.145,.025);for(let i=0;i<6;i++)part(shape.box,steel,0,.318+i*.021,1.244,.59,.008,.012);
 for(let side of [-1,1]){part(disc,steel,side*.412,.39,1.223,.102,.035,.102,Math.PI/2);part(disc,side<0?'#b7b097':'#49483e',side*.412,.39,1.246,.08,.015,.08,Math.PI/2);part(shape.box,'#995c4c',side*.37,.385,-1.25,.17,.095,.025)}
 label(cx,.235,cz+1.278,.29,.105,'桜  58–12','#cac8ad','#576754');roofSoil({G,basis,rr,tuft,ball,part})}
 function debris(){for(let j=0;j<2;j++){let x=-4.25+j*.47,z=-.85+j*.32;for(let s of [-.18,.18])for(let d of [-.14,.14])box(x+s,.33,z+d,.035,.29,.04,'#846f4e');for(let k=0;k<3;k++)for(let s of [-1,1]){box(x,.232+k*.09,z+s*.16,.42,.068,.025,'#9c8058');box(x+s*.202,.232+k*.09,z,.026,.068,.29,'#89724e')}}
 const can=weather('#849685',36);for(let i=0;i<5;i++){let x=-4.55+.34*i,z=3.32+.09*Math.sin(i);add(disc,can,x,.095,z,.06,.19,.06,0,0,1.26+i*.11);ring(x+.091,.09,z,.052,.005,steel,0,Math.PI/2)}
 for(let i=0;i<3;i++){let x=1.93+i*.14,z=2.26;box(x,.196+i*.008,z,.26,.009,.19,'#c2bda6',i*.28);for(let k=0;k<4;k++)box(x,.202+i*.008,z-.056+k*.024,.115,.002,.003,'#888577',i*.28)}
 barrierFeet()}
 function barrierFeet(){for(let x of [-4.34,-3.53]){box(x,.12,3.85,.084,.18,.24,steel,0,-.18);box(x,.05,3.85,.23,.043,.3,rust)}}
 return {condenser,wires,car,debris}
}
