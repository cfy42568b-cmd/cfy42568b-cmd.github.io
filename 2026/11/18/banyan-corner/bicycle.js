import * as T from './vendor/three.module.js';
import {weather} from './patina.js';
// A steel city bicycle, dimensions in model units relative to the rear axle.
export function bicycle({G,add,box,rod,shape}){
 const enamel=weather('#667c73',74),alloy=weather('#9b9e91',24),dark=weather('#504e42',38),tyre='#393b35',leather=weather('#775742',34),spoke='#999f94',wire='#45483f',L=1.09,R=.336;
 const pt=([x,y,z])=>[-3.23+x,.548+y,2.53+z];
 function tube(points,r,m){let g=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...pt(p)))),Math.max(8,points.length*4),r,7,false);let mesh=new T.Mesh(g,typeof m==='string'?new T.MeshStandardMaterial({color:m,roughness:.68}):m);mesh.castShadow=true;G.add(mesh)}
 function line(a,b,r,m){rod(pt(a),pt(b),r,m)}
 function loop(x,y,z,r,t,m){add(new T.TorusGeometry(r,t,8,56),m,...pt([x,y,z]),1,1,1)}
 for(let x of [0,L]){
  loop(x,0,0,R,.028,tyre);loop(x,0,0,R-.028,.011,alloy);loop(x,0,.021,R-.013,.003,'#9c9883');line([x,0,-.05],[x,0,.05],.032,alloy);
  for(let k=0;k<32;k++){let a=k*Math.PI/16,s=k%2?1:-1,b=a+s*.43;line([x+.029*Math.cos(b),.029*Math.sin(b),s*.035],[x+(R-.028)*Math.cos(a),(R-.028)*Math.sin(a),0],.0026,spoke)}
  // A shallow rolled steel mudguard follows the tyre with an air gap.
  let pos=[],idx=[];for(let i=0;i<=40;i++){let a=(x===0?-.25:.14)+(x===0?3.49:3.17)*i/40;for(let j=-2;j<=2;j++){let radius=R+.048-.009*(j/2)**2;pos.push(...pt([x+radius*Math.cos(a),radius*Math.sin(a),j*.018]));if(i&&j>-2){let k=i*5+j+2;idx.push(k-6,k-1,k-5,k-5,k-1,k)}}}let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();let m=new T.Mesh(g,alloy);alloy.side=T.DoubleSide;G.add(m)
 }
 const crank=[.452,-.076,0],saddle=[.298,.493,0],head=[.911,.39,0];
 line(crank,saddle,.026,enamel);tube([crank,[.59,.01,0],[.80,.245,0],head],.032,enamel);
 tube([[.364,.321,0],[.55,.211,0],[.69,.205,0],[.938,.463,0]],.020,enamel);line([.887,.487,0],[.949,.326,0],.035,enamel);
 for(let s of [-1,1]){line([0,.002,s*.046],[.32,.432,s*.022],.014,enamel);line([0,.002,s*.046],[.452,-.076,s*.021],.018,enamel);tube([[.942,.343,s*.016],[.973,.23,s*.043],[1.002,.092,s*.048],[L,0,s*.048]],.018,enamel);line([0,0,s*.051],[-.287,.234,s*.04],.006,alloy);line([L,0,s*.05],[L-.34,.165,s*.035],.006,alloy)}
 line([.298,.493,0],[.278,.56,0],.017,alloy);const saddleSkin=new T.SphereGeometry(1,32,16),sp=saddleSkin.attributes.position;for(let i=0;i<sp.count;i++){let x=sp.getX(i),y=sp.getY(i),z=sp.getZ(i);let narrow=.47+.57/(1+Math.exp((x-.03)*7));sp.setXYZ(i,x,y-.11*Math.cos(x*3),z*narrow)}saddleSkin.computeVertexNormals();add(saddleSkin,leather,...pt([.302,.576,0]),.147,.032,.095);line([.897,.491,0],[.865,.62,0],.014,alloy);
 tube([[.765,.63,-.232],[.83,.636,-.177],[.949,.63,-.113],[.954,.614,0],[.949,.63,.113],[.83,.636,.177],[.765,.63,.232]],.012,alloy);
 for(let s of [-1,1]){line([.764,.63,s*.232],[.83,.636,s*.178],.018,'#5a5040');line([.83,.621,s*.17],[.793,.585,s*.229],.007,alloy);tube([[.823,.628,s*.17],[.96,.578,s*.18],[1.045,.452,s*.107],[1.002,.336,s*.029]],.004,wire)}
 for(let s of [-1,1]){line([-.29,.414,s*.078],[.20,.414,s*.078],.009,alloy);line([.009,0,s*.051],[-.25,.409,s*.078],.009,alloy);line([.2,.414,s*.078],[.31,.449,s*.025],.009,alloy)}for(let j=0;j<5;j++)line([-.28+j*.111,.414,-.079],[-.28+j*.111,.414,.079],.005,alloy);
 loop(.452,-.076,.061,.095,.009,alloy);loop(0,0,.061,.048,.006,dark);for(let j=0;j<5;j++){let a=j*1.257;line([.452,-.076,.061],[.452+.087*Math.cos(a),-.076+.087*Math.sin(a),.061],.008,alloy)}
 for(let s of [-1,1]){line([0,s*.048,.063],[.452,-.076+s*.094,.063],.005,dark);let x=.452+s*.098,y=-.076+s*.081;line([.452,-.076,s*.075],[x,y,s*.085],.013,alloy);box(...pt([x,y,s*.124]),.083,.021,.085,tyre);box(...pt([x+.04,y,s*.124]),.004,.009,.061,'#af8052')}
 // Rim brake arms, pads and a sprung saddle support.
 for(let s of [-1,1]){tube([[1.044,.315,s*.035],[1.022,.359,s*.064],[1.007,.395,s*.037]],.007,alloy);box(...pt([1.043,.309,s*.034]),.046,.012,.014,tyre);tube([[.238,.522,s*.045],[.264,.499,s*.04],[.356,.539,s*.032]],.006,alloy)}
 for(let j=0;j<23;j++){let u=j/22;for(let side of [-1,1])add(shape.tube,dark,...pt([u*.452,.048*side*(1-u)+(-.076+.094*side)*u,.066]),.005,.006,.005,Math.PI/2)}
 line([.384,-.064,-.02],[.32,-.338,-.13],.01,alloy);
}
