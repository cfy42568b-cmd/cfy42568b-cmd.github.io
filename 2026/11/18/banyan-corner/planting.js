import * as T from './vendor/three.module.js';
import {leafTexture} from './surfaces.js';
function surface(points,uv,indices){let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g}
// A thin, recurved blade and a broad leaf with a recessed base and serrated margins.
function leafShape(kind){let p=[],uv=[],ix=[];for(let i=0;i<=16;i++){let t=i/16,outline=kind==='grass'?.038*(1-t)**.69:kind==='bract'?.34*Math.sin(Math.PI*t)**.84:Math.sin(Math.PI*t)**.92*(.40+.27*Math.exp(-((t-.25)**2)/.008))*(i%2?1:.94);
 for(let j=0;j<5;j++){let s=(j-2)/2;let x=s*outline,y=kind==='grass'?t*(1-.24*t):-.13*t*t-.13*s*s*Math.sin(Math.PI*t),z=kind==='grass'?.42*t*t:t-.16*Math.abs(s)*Math.exp(-((t-.13)**2)/.014);if(kind==='bract')y+=.41*t*t+.14*s*s; p.push(x,y,z);uv.push(j/4,t);if(i&&j){let k=i*5+j;ix.push(k-6,k-1,k-5,k-5,k-1,k)}}}return surface(p,uv,ix)}
export function planting({R,rr,pick,add,rod,shape,vineLeaf}){
 const grass=leafShape('grass'),foliage=leafShape('vine'),petal=leafShape('bract');
 const palette=colors=>colors.map(color=>new T.MeshStandardMaterial({color,map:leafTexture,side:T.DoubleSide,roughness:.74}));
 const blades=palette(['#637548','#81895a','#747a42','#92905c','#a39968']),leaves=palette(['#3d603c','#456b46','#5a7749','#718250','#4f6c46']),rose=palette(['#bc6483','#d98a9a','#a95074','#e7a3a9','#b87486']);
 const pale=palette(['#e7d9ba','#ddd3b9','#d5b97c']),seed=new T.SphereGeometry(1,7,5);
 function tuft(x,y,z,s=1){let n=Math.floor(rr(10,22)),a=R()*6.28;for(let i=0;i<n;i++){let q=a+i*2.4,h=rr(.11,.37)*s,r=rr(0,.055)*s;let o=add(grass,pick(blades),x+r*Math.sin(q),y,z+r*Math.cos(q),h*rr(.8,1.45),h,h,rr(.05,.75),q,rr(-.2,.2));o.rotation.order='YXZ'}
 if(R()<.29){let h=.43*s,end=[x+.09*s,y+h,z+.06*s];rod([x,y,z],end,.004*s,'#87845a');for(let i=0;i<7;i++){let a=i*2.4;add(seed,'#a6a17c',end[0]+Math.sin(a)*.012*s,end[1]-i*.014*s,end[2]+Math.cos(a)*.014*s,.009*s,.021*s,.008*s,0,a,.47)}}}
 function flowers(x,y,z,s=1){tuft(x,y,z,s*.7);for(let i=0;i<4;i++){let a=i*2.4,h=rr(.15,.32)*s,e=[x+.08*s*Math.sin(a),y+h,z+.09*s*Math.cos(a)];rod([x,y,z],e,.004*s,'#697551');for(let k=0;k<7;k++){let q=k*.898;add(petal,pick(pale),...e,.025*s,.037*s,.039*s,-.19,q,0)}add(seed,'#c2a052',...e,.012*s,.009*s,.013*s)}}
 function ivy(x,y,z,n,spread=.2,pink=false){let p=[x,y,z],side=x>2.28&&z<.85,phase=R()*6.28;for(let i=0;i<n;i++){let drift=spread*(.55*Math.cos(phase+i*.5)+rr(-.3,.3)),q=[p[0]+(side?0:drift),p[1]-rr(.09,.14),p[2]+(side?drift:0)];rod(p,q,.009,'#756747');for(let k=0;k<2;k++){let sign=(i+k)%2?1:-1,offset=rr(.05,.105),out=rr(.035,.075),e=[q[0]+(side?out:sign*offset),q[1]+rr(-.035,.025),q[2]+(side?sign*offset:out)],yaw=side?Math.PI/2:0;rod(q,e,.0035,'#78805a');let size=rr(.115,.185);if(pink){let o=add(foliage,pick(leaves),...e,size,size,size,rr(.75,1.27),yaw+sign*rr(.45,1.02),rr(-.23,.23));o.rotation.order='YXZ'}else{vineLeaf(...e,size*rr(.80,1.18),i>n-3?.13:rr(.34,.96),yaw+rr(-.48,.48),sign*rr(.24,1.12))}
 if(pink&&i%3===1&&k===0){for(let f=0;f<3;f++){let ax=2.094*f+phase,ex=e[0]+.048*Math.cos(ax),ey=e[1]+.061*Math.sin(ax),ez=e[2]+.09;rod(e,[ex,ey,ez],.003,'#94756a');let col=pick(rose);for(let b=0;b<3;b++){let br=add(petal,col,ex,ey,ez,.084,.081,.099,-.40,b*2.094+ax,0);br.rotation.order='YXZ'}add(seed,'#f2e5bc',ex,ey+.018,ez,.008,.012,.008)}}}p=q}}
 return {ivy,tuft,flowers}
}
