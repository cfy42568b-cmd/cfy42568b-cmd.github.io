import * as T from './vendor/three.module.js';
import {drawing} from './patina.js';
export function cabin({G,part,bar,basis,shape,ball}){
 const clothMap=drawing(192,192,(g,w,h)=>{g.fillStyle='#a49579';g.fillRect(0,0,w,h);for(let i=0;i<192;i+=2){g.fillStyle=i%4?'#9e927d':'#a89e88';g.fillRect(i,0,1,h);g.fillStyle='rgba(87,77,61,.08)';g.fillRect(0,i,w,1)}for(let i=0;i<16;i++){g.fillStyle='rgba(79,69,56,.06)';g.fillRect(i*12,0,2,h)}});
 const cloth=new T.MeshStandardMaterial({map:clothMap,roughness:.99}),trim='#7f7462',dash='#5b5a50',dark='#393b35';const local=(v)=>new T.Vector3(...basis(...v));
 function cord(points,r,c){let g=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(local)),18,r,6,false);let mesh=new T.Mesh(g,new T.MeshStandardMaterial({color:c,roughness:.8}));G.add(mesh)}
 // Rounded upholstered forms with a flatter face and piped edges.
 const cushion=new T.BoxGeometry(2,2,2,10,10,10),cp=cushion.attributes.position,cn=cushion.attributes.normal;
 for(let i=0;i<cp.count;i++){let v=new T.Vector3().fromBufferAttribute(cp,i);let core=v.clone().clampScalar(-.64,.64),normal=v.clone().sub(core).normalize(),q=core.addScaledVector(normal,.36);cp.setXYZ(i,q.x,q.y,q.z);cn.setXYZ(i,normal.x,normal.y,normal.z)}
 function pad(x,y,z,w,h,d,lean=0){part(cushion,cloth,x,y,z,w,h,d,lean);if(h>d){for(let k=-2;k<=2;k++){let s=k*.255;cord([-.66,0,.66].map(t=>[x+w*s,y+t*h,z+d+.002+t*h*Math.sin(lean)]),.0016,trim)}for(let side of [-1,1])cord([-.70,0,.70].map(t=>[x+side*w*.88,y+t*h,z+d*.91+t*h*Math.sin(lean)]),.0032,'#93856f')}}
 part(shape.box,dark,0,.259,-.15,1.12,.035,1.53);part(ball,'#646253',0,.31,-.04,.09,.083,.48);
 for(let side of [-1,1]){let x=side*.26;pad(x,.389,-.095,.191,.076,.238);pad(x,.581,-.278,.19,.216,.064,-.12);for(let a of [-.061,.061])bar([x+a,.74,-.30],[x+a,.81,-.31],.008,'#a3a397');pad(x,.846,-.308,.114,.067,.044);part(cushion,'#817865',x+side*.158,.6,-.268,.032,.168,.073,-.12);bar([side*.505,.425,-.20],[side*.525,.667,-.37],.009,'#4a4842');part(shape.box,'#6e584b',x-side*.186,.449,-.11,.032,.056,.031)}
 pad(0,.466,-.66,.48,.110,.16);pad(0,.625,-.785,.48,.148,.066,-.16);
 part(cushion,dash,0,.617,.333,.55,.084,.166);part(shape.box,dash,0,.597,.247,.95,.112,.12);part(ball,dark,.252,.677,.263,.178,.069,.085);
 const gauge=drawing(256,128,(g,w,h)=>{g.fillStyle='#333832';g.fillRect(0,0,w,h);for(let x of [64,192]){g.strokeStyle='#c7c5ad';g.lineWidth=3;g.beginPath();g.arc(x,65,52,0,7);g.stroke();for(let j=0;j<13;j++){let a=2.33+j*.39;g.beginPath();g.moveTo(x+Math.cos(a)*42,65+Math.sin(a)*42);g.lineTo(x+Math.cos(a)*48,65+Math.sin(a)*48);g.stroke()}g.strokeStyle='#ce9674';g.beginPath();g.moveTo(x,65);g.lineTo(x-29,86);g.stroke()}});
 let meters=new T.Mesh(new T.PlaneGeometry(.236,.102),new T.MeshStandardMaterial({map:gauge,roughness:.78,side:T.DoubleSide}));meters.position.copy(local([.248,.657,.187]));meters.rotation.y=Math.PI;G.add(meters);
 for(let x of [-.43,-.387,-.03,.013,.397,.438])part(shape.box,'#363a35',x,.626,.182,.028,.026,.013);part(shape.box,dark,-.261,.576,.178,.29,.004,.01);bar([-.27,.606,.179],[-.20,.606,.179],.006,'#aba697');
 const centre=[.26,.653,.063],radius=.115,tilt=.67;
 let rim=new T.Mesh(new T.TorusGeometry(radius,.012,10,48),new T.MeshStandardMaterial({color:'#4a453c',roughness:.62}));rim.position.copy(local(centre));rim.rotation.x=tilt;G.add(rim);bar([.26,.573,.234],centre,.027,dark);for(let a of [.12,3.02,4.73])bar(centre,[centre[0]+radius*Math.cos(a),centre[1]+radius*Math.sin(a)*Math.cos(tilt),centre[2]+radius*Math.sin(a)*Math.sin(tilt)],.009,'#838276');part(ball,dark,...centre,.034,.022,.027);
 bar([0,.36,.027],[.012,.484,-.006],.008,'#95958a');part(ball,'#443e36',.012,.494,-.006,.019,.021,.019);bar([.066,.364,-.125],[.073,.407,-.207],.011,dark);
 for(let j=0;j<3;j++)part(shape.box,dark,.16+j*.075,.336,.302,.045,.015,.063,-.38);
 bar([0,.96,.06],[0,.88,.11],.008,dark);part(shape.box,dark,0,.878,.116,.17,.056,.027);part(shape.box,'#a0aca5',0,.878,.099,.15,.042,.003)
}
export function roofSoil({G,basis,rr,tuft,ball,part}){
 // Organic sediment follows the slope of the sheet metal and thins to a feather edge.
 const roof=z=>.98+(z+.61)*.025/.636,cx=-.133,cz=-.452;
 function outline(a){return .88+.09*Math.sin(3*a+.8)+.065*Math.cos(5*a)+.051*Math.sin(9*a+.2)+.022*Math.sin(17*a)}
 function param(a,r){let k=outline(a)*r;return [cx+.321*k*Math.cos(a),cz+.124*k*Math.sin(a)+.033*k*Math.cos(a)]}
 function thickness(a,r){return .001+.026*(1-r**1.4)*(.83+.18*Math.sin(2*a)*r)+.004*Math.sin(3*a+r*5)*r*(1-r)}
 const pos=[],col=[],idx=[],uv=[],N=80,nr=13;for(let j=0;j<=nr;j++){let r=j/nr;for(let k=0;k<=N;k++){let a=k/N*Math.PI*2,[x,z]=param(a,r);pos.push(...basis(x,roof(z)+thickness(a,r),z));uv.push((x-cx)*3,(z-cz)*3);let c=new T.Color().setHSL(rr(.071,.11),rr(.17,.31),rr(.25,.36)+r*.045,T.SRGBColorSpace);col.push(c.r,c.g,c.b,Math.min(1,(1-r)*5.5)*rr(.89,1));if(k&&j){let i=j*(N+1)+k;idx.push(i-N-2,i-N-1,i-1,i-1,i-N-1,i)}}}
 const map=drawing(256,256,(g,w,h)=>{g.fillStyle='#bfb7a6';g.fillRect(0,0,w,h);for(let i=0;i<22000;i++){let v=rr(42,245);g.fillStyle='rgb('+v+' '+v+' '+v+')';g.fillRect(rr(0,w),rr(0,h),rr(.5,2),rr(.5,1.7))}});map.wrapS=map.wrapT=T.RepeatWrapping;
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setAttribute('color',new T.Float32BufferAttribute(col,4));geo.setIndex(idx);geo.computeVertexNormals();let mesh=new T.Mesh(geo,new T.MeshStandardMaterial({map,bumpMap:map,bumpScale:.0008,vertexColors:true,transparent:true,depthWrite:false,side:T.DoubleSide,roughness:1}));mesh.receiveShadow=true;G.add(mesh);
 // Fine crumbs spread beyond the humus in a shallow wash toward the rear gutter.
 for(let i=0;i<250;i++){let a=rr(0,Math.PI*2),r=rr(.85,1.24),[x,z]=param(a,r);if(x<-.455||z<-.594)continue;let y=roof(z)+(r>1?.001:thickness(a,r));part(ball,i%4?'#766b55':'#8f8169',x,y+.0009,z,rr(.0012,.0051),rr(.0007,.0015),rr(.001,.0043))}
 for(let i=0;i<93;i++){let a=rr(0,Math.PI*2),r=Math.sqrt(rr(.025,1)),[x,z]=param(a,r),y=roof(z)+thickness(a,r);if(i<7){let [wx,wy,wz]=basis(x,y-.002,z);tuft(wx,wy,wz,rr(.31,.56))}else if(i<20){let c=i%2?'#8b7656':'#6f5e46';part(ball,c,x,y+.001,z,rr(.012,.024),.0025,rr(.004,.009),0,a,.09)}else{part(ball,i%3?'#665b47':'#978b74',x,y,z,rr(.002,.007),rr(.001,.003),rr(.003,.006))}}
}
