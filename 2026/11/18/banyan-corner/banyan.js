import * as T from './vendor/three.module.js';
import {standard,blade,leafTexture} from './surfaces.js';
export function banyan(group,random){
 const range=(a,b)=>a+(b-a)*random(),v=(x,y,z)=>new T.Vector3(x,y,z),tau=Math.PI*2;
 const positions=[],indices=[],uvs=[],colors=[];
 const bark=standard('#827662','bark',{vertexColors:true,roughness:.98});
 // Continuous swept skin. Flanges widen into buttress roots in the same basal rings.
 function limb(points,radius,steps,sides,base=false){
  const curve=new T.CatmullRomCurve3(points),frames=curve.computeFrenetFrames(steps,false),start=positions.length/3,length=curve.getLength();
  for(let i=0;i<=steps;i++){let t=i/steps,p=curve.getPointAt(t),r=radius(t);
   for(let j=0;j<=sides;j++){let a=tau*j/sides,fold=.5+.5*Math.cos(a*8+1.1*t+.34*Math.sin(a*3+t*6)),flute=.035*Math.sin(15*a+2*t)+.025*Math.cos(9*a-t*5);
    let d=r*(1+flute+(base?.19*fold:0))+(base?1.14*Math.pow(fold,4)*Math.exp(-t*16):0);
    let q=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*d).addScaledVector(frames.binormals[i],Math.sin(a)*d);
    positions.push(q.x,q.y,q.z);uvs.push(j/sides*(base?2:1),t*length*.66);let l=.76+.22*fold+.025*Math.sin(a*2+t*5);colors.push(l,l,l*.98);
    if(i&&j){let k=start+i*(sides+1)+j;indices.push(k-sides-2,k-sides-1,k-1,k-1,k-sides-1,k)}
   }
  }
  return curve;
 }
 const trunk=limb([v(-3.33,.15,.60),v(-3.24,1.45,.58),v(-3.16,3.2,.43),v(-3.05,4.85,.31),v(-2.54,6.21,-.14),v(-1.78,7.31,-.91),v(-1.05,8.36,-1.35),v(-.65,9.18,-1.54)],t=>.68*(1-t)**.72+.05,90,56,true);
 const geom=blade(),leaves=[],hues=[];
 function oneLeaf(origin,angle,tilt,len,light){let o=new T.Object3D();o.position.copy(origin);o.rotation.order='YXZ';o.rotation.set(tilt,angle,range(-.7,.7),'YXZ');o.scale.set(len*range(.8,1.22),len,len);o.updateMatrix();leaves.push(o.matrix);hues.push(new T.Color().setHSL(range(.211,.267),range(.36,.59),range(.22,.39)+light))}
 for(let i=0;i<34;i++){
  let angle=i*2.399+range(-.21,.21),level=i/34,dist=range(3.1,4.45)*(1-.57*level),s=trunk.getPointAt(.6+.34*level),end=v(-.8+Math.cos(angle)*dist,7.7+1.59*level+range(-.31,.28),-1.2+Math.sin(angle)*dist*.87);
  const mid=s.clone().lerp(end,.49);mid.y=Math.max(mid.y+.12,7.68);mid.z+=.26*Math.cos(angle);let branch=limb([s,mid,end],t=>.026+.195*(1-t)**1.38*(1-level*.45),14,12);
  for(let j=0;j<9;j++){let a=angle+range(-1.75,1.75),r=range(.49,1.2),point=branch.getPointAt(.51+.48*j/9),p=end.clone().add(v(Math.cos(a)*r,range(.08,.61),Math.sin(a)*r)),q=point.clone().lerp(p,.5);q.y+=.12;
   let spray=limb([point,q,p],t=>.009+.041*(1-t),8,6);
   for(let k=0;k<5;k++){
    let u=range(.26,.97),base=spray.getPointAt(u),b=a+(k%2?1:-1)*range(.36,1.82),reach=range(.32,.78),high=range(.17,.42),tip=base.clone().add(v(Math.cos(b)*reach,high-.16,Math.sin(b)*reach)),elbow=base.clone().lerp(tip,.52);elbow.y+=.11;
    let twig=limb([base,elbow,tip],t=>.003+.009*(1-t),3,4);
    for(let l=0;l<8;l++){let at=twig.getPointAt(.12+.86*l/7),az=Math.PI/2-b+(l%2?1:-1)*range(.45,1.25);oneLeaf(at,az,range(-.49,.68)+l*.025,range(.19,.38),level*.065)}
   }
  }
  if(i%2===0){let p=branch.getPointAt(.81);for(let j=0;j<3;j++){let x=range(-.13,.13),z=range(-.16,.16),len=range(1,3.9);limb([p,v(p.x+x+.04,p.y-.45,p.z+z),v(p.x+x-.05,p.y-len*.59,p.z+z+.04),v(p.x+x,p.y-len,p.z+z)],t=>.009+.023*(1-t),10,6)}}
 }
 let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();let tree=new T.Mesh(g,bark);tree.castShadow=tree.receiveShadow=true;group.add(tree);
 const lm=new T.MeshStandardMaterial({map:leafTexture,side:T.DoubleSide,roughness:.63,metalness:0,emissive:0x13220a,emissiveIntensity:.18});
 let canopy=new T.InstancedMesh(geom,lm,leaves.length);leaves.forEach((m,i)=>{canopy.setMatrixAt(i,m);canopy.setColorAt(i,hues[i])});canopy.castShadow=canopy.receiveShadow=true;group.add(canopy)
}
